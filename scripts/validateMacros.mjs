#!/usr/bin/env node
/**
 * Macro consistency validator
 * Checks that cal ≈ protein*4 + carbs*4 + fat*9  (±10% or ±15 kcal tolerance)
 * Usage: node scripts/validateMacros.mjs [--fix]
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

// Match a food({ ... }) block — handles multiline
const FOOD_BLOCK_RE = /food\(\{([^}]+)\}\)/gs

// Extract named numeric fields
function extractNum(block, key) {
  const m = block.match(new RegExp(`\\b${key}:\\s*([0-9]+(?:\\.[0-9]+)?)`, 'i'))
  return m ? parseFloat(m[1]) : null
}

function extractId(block) {
  const m = block.match(/id:\s*'([^']+)'/)
  return m ? m[1] : '?'
}

let totalErrors = 0
let totalFixed = 0

for (const rel of FILES) {
  const filePath = path.join(ROOT, rel)
  let src
  try {
    src = readFileSync(filePath, 'utf8')
  } catch {
    console.warn(`⚠️  Skipping missing file: ${rel}`)
    continue
  }

  const errors = []
  let fixedSrc = src

  for (const match of src.matchAll(FOOD_BLOCK_RE)) {
    const block = match[1]
    const id = extractId(block)
    const cal = extractNum(block, 'cal')
    const p = extractNum(block, 'p')
    const c = extractNum(block, 'c')
    const f = extractNum(block, 'f')

    if (cal === null || p === null || c === null || f === null) continue

    const expected = Math.round(p * 4 + c * 4 + f * 9)
    const diff = Math.abs(cal - expected)
    const pct = cal > 0 ? diff / cal : 0

    // Tolerance: 10% OR 15 kcal, whichever is larger
    const tolerance = Math.max(15, cal * 0.10)

    if (diff > tolerance) {
      errors.push({ id, cal, p, c, f, expected, diff })

      if (FIX_MODE) {
        // Replace just the cal: N value inside this exact food block occurrence
        const fullMatch = match[0]
        const fixed = fullMatch.replace(
          /\bcal:\s*[0-9]+(?:\.[0-9]+)?/,
          `cal: ${expected}`
        )
        fixedSrc = fixedSrc.replace(fullMatch, fixed)
        totalFixed++
      }
    }
  }

  if (errors.length === 0) {
    console.log(`✅ ${rel} — all macros consistent`)
  } else {
    console.log(`\n❌ ${rel} — ${errors.length} inconsistencies${FIX_MODE ? ' (auto-fixed)' : ''}:`)
    for (const e of errors) {
      const sign = e.cal > e.expected ? '↑ too high' : '↓ too low'
      console.log(
        `   [${e.id}]  cal=${e.cal}  expected≈${e.expected}  diff=${e.diff >= 0 ? '+' : ''}${e.cal - e.expected} ${sign}`
      )
    }
    totalErrors += errors.length

    if (FIX_MODE) {
      writeFileSync(filePath, fixedSrc, 'utf8')
      console.log(`   → Written back to ${rel}`)
    }
  }
}

console.log(`\n─────────────────────────────`)
if (FIX_MODE) {
  console.log(`Fixed ${totalFixed} entries across ${FILES.length} files.`)
} else {
  console.log(`Total inconsistencies found: ${totalErrors}`)
  if (totalErrors > 0) console.log(`Re-run with --fix to auto-correct calorie values.`)
}
