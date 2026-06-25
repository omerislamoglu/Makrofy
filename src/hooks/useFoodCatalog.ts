import { useMemo } from 'react'
import { useLocale } from '../contexts/LocaleContext'
import { getFoodCatalog, getPopularFoodIds } from '../data/foodCatalog'
import type { FoodCatalogItem } from '../types/food'

export function useFoodCatalog(): {
  catalog: FoodCatalogItem[]
  popularIds: string[]
} {
  const { locale } = useLocale()

  const catalog = useMemo<FoodCatalogItem[]>(() => getFoodCatalog(locale), [locale])
  const popularIds = useMemo<string[]>(() => getPopularFoodIds(locale), [locale])

  return { catalog, popularIds }
}
