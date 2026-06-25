import { getFoodCatalog } from '../src/data/foodCatalog'
import { normalizeFoodText } from '../src/utils/foodSearch'
import type { AppLocale } from '../src/i18n'

const locales: AppLocale[] = ['de', 'fr', 'es', 'it', 'en', 'tr']

function nameKey(name: string) {
  return normalizeFoodText(name)
}
function brandKey(item: { name: string; brand?: string }) {
  return `${normalizeFoodText(item.name)}|${item.brand ? normalizeFoodText(item.brand) : ''}`
}

for (const locale of locales) {
  const catalog = getFoodCatalog(locale)
  // duplicates by name only (the reported metric)
  const byName = new Map<string, typeof catalog>()
  for (const item of catalog) {
    const k = nameKey(item.name)
    if (!byName.has(k)) byName.set(k, [])
    byName.get(k)!.push(item)
  }
  let nameDupCount = 0
  // duplicates that survive a name+brand dedup (the "unintended" ones we want to kill)
  const byBrand = new Set<string>()
  let brandDupCount = 0
  // among name-collisions, how many have a brand distinction (legit) vs not
  let legitBrandGroups = 0
  let collapsibleGroups = 0
  for (const [, items] of byName) {
    if (items.length > 1) nameDupCount += items.length - 1
  }
  for (const item of catalog) {
    const k = brandKey(item)
    if (byBrand.has(k)) brandDupCount++
    else byBrand.add(k)
  }
  // inspect name-collision groups
  const sampleCollapsible: string[] = []
  for (const [, items] of byName) {
    if (items.length < 2) continue
    const brands = new Set(items.map((i) => (i.brand ? normalizeFoodText(i.brand) : '')))
    if (brands.size > 1) legitBrandGroups++
    // groups where 2+ items share the same brand-key = collapsible
    const bk = new Map<string, number>()
    for (const i of items) {
      const k = brandKey(i)
      bk.set(k, (bk.get(k) ?? 0) + 1)
    }
    const hasCollapse = [...bk.values()].some((n) => n > 1)
    if (hasCollapse) {
      collapsibleGroups++
      if (sampleCollapsible.length < 8) {
        sampleCollapsible.push(
          `${items[0].name}: ` + items.map((i) => `${i.id}${i.brand ? `(${i.brand})` : ''}`).join(' + '),
        )
      }
    }
  }
  console.log(`\n=== ${locale} (total ${catalog.length}) ===`)
  console.log(`  name-only dup names: ${nameDupCount}`)
  console.log(`  remaining dups after name+brand dedup: ${brandDupCount}`)
  console.log(`  name-collision groups with brand distinction (legit): ${legitBrandGroups}`)
  console.log(`  groups containing a same-name+same-brand collapse: ${collapsibleGroups}`)
  for (const s of sampleCollapsible) console.log(`    e.g. ${s}`)
}
