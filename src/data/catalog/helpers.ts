import type { FoodCatalogCategory, FoodCatalogItem, FoodServingOption, FoodUnitType } from '../../types/food'

function normalizeId(text: string): string {
  return text
    .replace(/İ/g, 'i')
    .toLowerCase()
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function normalize(text: string): string {
  return text
    .replace(/İ/g, 'i')
    .toLowerCase()
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function srv(label: string, unitType: FoodUnitType, gramEq?: number, mlEq?: number): FoodServingOption {
  const id = normalizeId(label)
  return {
    id,
    label,
    unitType,
    quantity: 1,
    ...(gramEq !== undefined && { gramEquivalent: gramEq }),
    ...(mlEq !== undefined && { mlEquivalent: mlEq }),
  }
}

export const S = {
  g100: srv('100 g', 'gram', 100),
  ml100: srv('100 ml', 'ml', undefined, 100),
  g: (g: number) => srv(`${g} g`, 'gram', g),
  ml: (ml: number) => srv(`${ml} ml`, 'ml', undefined, ml),
  adet: (g: number, label = '1 adet') => srv(label, 'adet', g),
  porsiyon: (g: number, label = '1 porsiyon') => srv(label, 'porsiyon', g),
  dilim: (g: number, label = '1 dilim') => srv(label, 'dilim', g),
  bardak: (ml: number, label = '1 bardak') => srv(label, 'ml', undefined, ml),
  kutu: (ml: number, label = '1 kutu') => srv(label, 'kutu', undefined, ml),
  sise: (ml: number, label = '1 şişe') => srv(label, 'sise', undefined, ml),
  paket: (g: number, label = '1 paket') => srv(label, 'paket', g),
  bar: (g: number, label = '1 bar') => srv(label, 'bar', g),
  kase: (g: number, label = '1 kase') => srv(label, 'porsiyon', g),
  custom: srv,
}

interface FoodDef {
  id: string
  name: string
  brand?: string
  cat: FoodCatalogCategory
  sub: string
  cal: number
  p: number
  c: number
  f: number
  fib?: number
  sugar?: number
  satFat?: number
  sodium?: number
  servings: FoodServingOption[]
  defaultIdx?: number
  aliases?: string[]
}

export function food(d: FoodDef): FoodCatalogItem {
  const allServings = d.servings.length > 0 ? d.servings : [S.g100]
  const units: FoodUnitType[] = [...new Set(allServings.map((s) => s.unitType))]
  const aliases = d.aliases ?? []
  const searchParts = [d.name, d.brand, d.cat, d.sub, ...aliases].filter(Boolean)

  return {
    id: d.id,
    name: d.name,
    ...(d.brand && { brand: d.brand }),
    category: d.cat,
    subcategory: d.sub,
    servingOptions: allServings,
    defaultServing: allServings[d.defaultIdx ?? 0],
    calories: d.cal,
    protein: d.p,
    carbs: d.c,
    fat: d.f,
    fiber: d.fib ?? 0,
    ...(d.sugar !== undefined && { sugar: d.sugar }),
    ...(d.satFat !== undefined && { saturatedFat: d.satFat }),
    ...(d.sodium !== undefined && { sodium: d.sodium }),
    unitTypes: units,
    aliases,
    searchableText: normalize(searchParts.join(' ')),
    isCustom: false,
  }
}
