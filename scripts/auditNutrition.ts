// One-off nutrition data audit: flags entries whose stated calories disagree
// with their macros (Atwater: kcal ≈ 4P + 4C + 9F). Pure read-only analysis.

import { getFoodCatalog } from '../src/data/foodCatalog'
import { restaurants } from '../src/data/restaurantMenus'
import { globalRestaurants } from '../src/data/globalRestaurantMenus'

interface Row {
  source: string
  id: string
  name: string
  cal: number
  p: number
  c: number
  f: number
  fib: number
  expected: number
  devPct: number
}

function atwater(p: number, c: number, f: number): number {
  // Net carbs already include fiber in most DB conventions; fiber ~2 kcal/g.
  // Use standard 4/4/9; fiber is a minor correction we ignore for flagging.
  return p * 4 + c * 4 + f * 9
}

function check(rows: Row[], r: Omit<Row, 'expected' | 'devPct'>) {
  const expected = atwater(r.p, r.c, r.f)
  if (r.cal < 20 && expected < 20) return // skip near-zero (water, spices)
  const denom = Math.max(r.cal, expected, 1)
  const devPct = Math.abs(r.cal - expected) / denom
  rows.push({ ...r, expected: Math.round(expected), devPct })
}

const rows: Row[] = []

// Catalog items: calories/p/c/f are PER 100 g/ml
const catalog = getFoodCatalog('tr')
for (const f of catalog) {
  check(rows, {
    source: 'catalog',
    id: f.id,
    name: f.name,
    cal: f.calories,
    p: f.protein,
    c: f.carbs,
    f: f.fat,
    fib: f.fiber ?? 0,
  })
}

// Restaurant items: calories/p/c/f are WHOLE-ITEM
for (const list of [restaurants, globalRestaurants]) {
  for (const rest of list) {
    for (const cat of rest.categories) {
      for (const item of cat.items) {
        check(rows, {
          source: `rest:${rest.name}`,
          id: item.id,
          name: `${rest.name} — ${item.name}`,
          cal: item.calories,
          p: item.protein,
          c: item.carbs,
          f: item.fat,
          fib: item.fiber ?? 0,
        })
      }
    }
  }
}

const THRESH = Number(process.argv[2] ?? '0.30')
const MIN_ABS = 40 // ignore tiny absolute kcal gaps
const flagged = rows
  .filter((r) => r.devPct > THRESH && Math.abs(r.cal - r.expected) >= MIN_ABS)
  .sort((a, b) => b.devPct - a.devPct)

console.log(`Total entries checked: ${rows.length}`)
console.log(`Flagged (dev > ${(THRESH * 100).toFixed(0)}% and |Δ| ≥ ${MIN_ABS} kcal): ${flagged.length}\n`)
for (const r of flagged) {
  console.log(
    `${(r.devPct * 100).toFixed(0)}%  stated=${r.cal} expected=${r.expected}  ` +
      `[P${r.p} C${r.c} F${r.f}]  ${r.name}  (${r.source}/${r.id})`
  )
}
