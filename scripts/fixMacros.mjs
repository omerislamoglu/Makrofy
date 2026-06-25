#!/usr/bin/env node
/**
 * Smart macro fixer — ratio-based detection
 *
 * The formula cal ≈ p*4 + c*4 + f*9 fails for two structural reasons:
 *   A) Alcohol items: alcohol provides 7 kcal/g, not in p/c/f.
 *      → cal is CORRECT, expected is too low.
 *      Detection: cal > expected * 1.4
 *      Fix: add (cal - expected) / 4  to carbs (industry-standard: alcohol-as-carbs).
 *
 *   B) High-fiber foods (spices, oat bran, etc.): fiber is counted in carbs
 *      but contributes ~2 kcal/g not 4 kcal/g. Database cal is ground truth.
 *      Detection: expected > cal * 1.1  AND  fib > 5
 *      Fix: skip — database cal is correct.
 *
 *   C) True errors: macro values genuinely wrong.
 *      Fix: recalculate cal = round(p*4 + c*4 + f*9).
 *
 * Usage:
 *   node scripts/fixMacros.mjs          # dry-run (prints what would change)
 *   node scripts/fixMacros.mjs --fix    # applies fixes in-place
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const FILES = [
  'src/data/regionalFoodsDE.ts',
  'src/data/regionalFoodsFR.ts',
  'src/data/regionalFoodsES.ts',
  'src/data/regionalFoodsIT.ts',
  'src/data/englishRegionalFoods.ts',
]

const FIX_MODE = process.argv.includes('--fix')

// Ratios:
//  cal > expected * ALCOHOL_RATIO  → alcohol (add carbs)
//  expected > cal * FIBER_RATIO AND (high-fiber OR organic-acid citrus/vinegar) → skip
//  everything else: fix cal to expected
const ALCOHOL_RATIO = 1.25  // cal ≥ 25% higher than formula → non-macro calories (alcohol)
const FIBER_RATIO   = 1.10  // formula ≥ 10% higher → potential skip candidate
const FIBER_MIN     = 3     // g/100g — catches dried fruits (raisins ~3.7g), spices, etc.
// Organic-acid guard: citrus fruits & vinegars (balsamic, apple cider) have acetic/citric
// acid counted as carbs but contributing less than 4 kcal/g.
// Skip when total carbs are low (citrus, vinegar) OR fiber/carb ratio is high.
const ORGANIC_ACID_C_THRESHOLD  = 20  // total carbs < 20g → likely citrus/vinegar/low-sugar
const ORGANIC_ACID_FIBER_RATIO  = 0.18 // fib/c > 0.18 → high-fiber-to-carb ratio

// Hard minimum delta to even bother fixing (both kcal AND percentage)
const MIN_KCAL_DIFF = 15
const MIN_PCT_DIFF  = 0.10

function extractNum(block, key) {
  // Negative lookahead: don't match keys that are prefixes (e.g. "c" shouldn't match "cal")
  const m = block.match(new RegExp(`(?<![a-zA-Z])${key}:\\s*([0-9]+(?:\\.[0-9]+)?)(?![a-z])`, 'i'))
  return m ? parseFloat(m[1]) : null
}

function extractFib(block) {
  return extractNum(block, 'fib') ?? 0
}

function extractId(block) {
  const m = block.match(/id:\s*'([^']+)'/)
  return m ? m[1] : ''
}

function extractName(block) {
  const m = block.match(/name:\s*'([^']+)'/)
  return m ? m[1] : ''
}

const FOOD_BLOCK_RE = /food\(\{([^}]+)\}\)/gs

let totalIssues = 0
let totalFixed  = 0
let totalSkipped = 0

for (const rel of FILES) {
  const filePath = path.join(ROOT, rel)
  let src
  try {
    src = readFileSync(filePath, 'utf8')
  } catch {
    console.warn(`⚠️  Skipping missing file: ${rel}`)
    continue
  }

  let fixedSrc = src
  let fileIssues  = 0
  let fileFixed   = 0
  let fileSkipped = 0

  // Collect (oldStr, newStr) pairs so we can replace without offset drift
  const patches = []

  for (const match of src.matchAll(FOOD_BLOCK_RE)) {
    const block = match[1]
    const id    = extractId(block)
    const name  = extractName(block)

    const cal = extractNum(block, 'cal')
    const p   = extractNum(block, 'p')
    const c   = extractNum(block, 'c')
    const f   = extractNum(block, 'f')
    const fib = extractFib(block)

    if (cal === null || p === null || c === null || f === null) continue

    const expected = p * 4 + c * 4 + f * 9
    const diff     = cal - expected          // positive = cal too high
    const absDiff  = Math.abs(diff)
    const pct      = cal > 0 ? absDiff / cal : 1

    // Below combined threshold — nothing to do
    if (absDiff <= MIN_KCAL_DIFF || pct <= MIN_PCT_DIFF) continue

    fileIssues++
    totalIssues++

    // ── Category A: alcohol ────────────────────────────────────────────────
    if (cal > expected * ALCOHOL_RATIO) {
      // Calories exceed formula by 40%+ → non-macro source (overwhelmingly alcohol).
      // Strategy: represent as "alcohol-as-carbs" so macro sum equals cal.
      const extraCarbs = Math.round(diff / 4)
      const newC       = Math.round(c + extraCarbs)
      console.log(`  [ALCO ] ${id || name}: c=${c}→${newC} (+${extraCarbs}g carb-equiv, cal=${cal} stays)`)
      if (FIX_MODE) {
        patches.push([
          match[0],
          match[0].replace(/(?<![a-zA-Z])c:\s*[0-9]+(?:\.[0-9]+)?(?![a-z])/, `c: ${newC}`),
        ])
      }
      fileFixed++
      totalFixed++
      continue
    }

    // ── Category B: high-fiber / organic-acid food ────────────────────────
    // Formula can both over- and under-estimate for foods with:
    //   (a) high fiber (contributes ~2 kcal/g not 4 kcal/g)
    //   (b) organic acids (citric, malic, acetic) counted as carbs but yielding
    //       less than 4 kcal/g (citrus fruits, vinegars, spices)
    //   (c) sugar alcohols / polyols (gum, sugar-free products)
    // In all these cases the database cal value is the ground truth — skip.
    const isHighFiber   = fib > FIBER_MIN
    const isOrganicAcid = c > 0 && (c < ORGANIC_ACID_C_THRESHOLD || fib / c > ORGANIC_ACID_FIBER_RATIO)
    // Bidirectional: if the food has meaningful fiber AND the discrepancy is < 25%
    // (not large enough to be a clear data error), trust the database value either way.
    const isModerateHighFiber = fib > FIBER_MIN && pct < 0.25
    const shouldSkip = (expected > cal * FIBER_RATIO && (isHighFiber || isOrganicAcid))
                    || isModerateHighFiber
    if (shouldSkip) {
      console.log(`  [FIBER] ${id || name}: cal=${cal} expected≈${Math.round(expected)} fib=${fib} c=${c} — skipping (DB value is ground truth)`)
      fileSkipped++
      totalSkipped++
      continue
    }

    // ── Category C: true error ─────────────────────────────────────────────
    const newCal = Math.round(expected)
    const dir    = diff > 0 ? 'too-high' : 'too-low'
    console.log(`  [FIX  ] ${id || name}: cal=${cal}→${newCal} (${dir} by ${Math.round(absDiff)} kcal)`)
    if (FIX_MODE) {
      patches.push([
        match[0],
        match[0].replace(/(?<![a-zA-Z])cal:\s*[0-9]+(?:\.[0-9]+)?(?![a-z])/, `cal: ${newCal}`),
      ])
    }
    fileFixed++
    totalFixed++
  }

  if (patches.length && FIX_MODE) {
    for (const [oldStr, newStr] of patches) {
      fixedSrc = fixedSrc.replace(oldStr, newStr)
    }
    writeFileSync(filePath, fixedSrc, 'utf8')
    console.log(`  → Written: ${rel}`)
  }

  const status = fileIssues === 0 ? '✅' : FIX_MODE ? '🔧' : '❌'
  console.log(`\n${status} ${rel}: ${fileIssues} issues (fix=${fileFixed} skip=${fileSkipped})\n`)
}

console.log(`═══════════════════════════════════════`)
console.log(`Total issues flagged : ${totalIssues}`)
console.log(`Will fix             : ${totalFixed}`)
console.log(`Skipped (high-fiber) : ${totalSkipped}`)
if (!FIX_MODE && totalFixed > 0) {
  console.log(`\nRe-run with --fix to apply all corrections.`)
}
