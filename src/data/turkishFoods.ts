// ─── Türkiye'de Sık Tüketilen Besinler Veritabanı ──────────────────────────
// Kaynak: USDA FoodData Central + Türk Gıda Kodeksi referans değerleri
// Not: Bu değerler yaklaşıktır ve beslenme farkındalığı amacıyla kullanılmalıdır.

import { MARKET_MEGA_EXPANSION, RESTAURANT_MENU_FOODS } from './marketAndRestaurantFoods'
import { COMPREHENSIVE_FOOD_EXPANSION } from './comprehensiveFoodExpansion'

export interface TurkishFood {
  id: string
  name: string
  brand?: string
  aliases?: string[]
  defaultUnit: 'gram' | 'piece'
  caloriesPer100g: number
  proteinPer100g: number
  carbsPer100g: number
  fatPer100g: number
  fiberPer100g: number
  pieceWeightGrams?: number
  servingOptions?: TurkishFoodServing[]
  category: FoodCategory
}

export interface TurkishFoodServing {
  label: string
  grams: number
}

export type FoodCategory =
  | 'protein'
  | 'tahıl'
  | 'meyve'
  | 'süt-ürünü'
  | 'sebze'
  | 'kuruyemiş'
  | 'içecek'
  | 'ekmek'
  | 'çorba'
  | 'market'
  | 'atıştırmalık'
  | 'tatlı'
  | 'bakliyat'
  | 'şarküteri'
  | 'hazır-yemek'
  | 'takviye'
  | 'diğer'

const BASE_TURKISH_FOODS: TurkishFood[] = [
  // ─── Protein Kaynakları ──────────────────────────────────────────────────
  {
    id: 'haslanmis-yumurta',
    name: 'Haşlanmış Yumurta',
    defaultUnit: 'piece',
    caloriesPer100g: 155,
    proteinPer100g: 12.6,
    carbsPer100g: 1.1,
    fatPer100g: 10.6,
    fiberPer100g: 0,
    pieceWeightGrams: 50,
    category: 'protein',
  },
  {
    id: 'sahanda-yumurta',
    name: 'Sahanda Yumurta',
    defaultUnit: 'piece',
    caloriesPer100g: 196,
    proteinPer100g: 13.6,
    carbsPer100g: 0.7,
    fatPer100g: 15.3,
    fiberPer100g: 0,
    pieceWeightGrams: 60,
    category: 'protein',
  },
  {
    id: 'tavuk-gogsu-izgara',
    name: 'Tavuk Göğsü (Izgara)',
    defaultUnit: 'gram',
    caloriesPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0,
    fatPer100g: 3.6,
    fiberPer100g: 0,
    category: 'protein',
  },
  {
    id: 'kofte',
    name: 'Köfte (Izgara)',
    defaultUnit: 'piece',
    caloriesPer100g: 235,
    proteinPer100g: 17,
    carbsPer100g: 7,
    fatPer100g: 15,
    fiberPer100g: 0.5,
    pieceWeightGrams: 40,
    category: 'protein',
  },
  {
    id: 'somon-fileto',
    name: 'Somon Fileto',
    defaultUnit: 'gram',
    caloriesPer100g: 208,
    proteinPer100g: 20,
    carbsPer100g: 0,
    fatPer100g: 13,
    fiberPer100g: 0,
    category: 'protein',
  },

  // ─── Tahıllar & Pilavlar ─────────────────────────────────────────────────
  {
    id: 'pirinc-pilavi',
    name: 'Pirinç Pilavı',
    defaultUnit: 'gram',
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28,
    fatPer100g: 0.3,
    fiberPer100g: 0.4,
    category: 'tahıl',
  },
  {
    id: 'bulgur-pilavi',
    name: 'Bulgur Pilavı',
    defaultUnit: 'gram',
    caloriesPer100g: 83,
    proteinPer100g: 3.1,
    carbsPer100g: 18.6,
    fatPer100g: 0.2,
    fiberPer100g: 4.5,
    category: 'tahıl',
  },
  {
    id: 'makarna-haslanmis',
    name: 'Makarna (Haşlanmış)',
    defaultUnit: 'gram',
    caloriesPer100g: 131,
    proteinPer100g: 5,
    carbsPer100g: 25,
    fatPer100g: 1.1,
    fiberPer100g: 1.8,
    category: 'tahıl',
  },

  // ─── Ekmekler ────────────────────────────────────────────────────────────
  {
    id: 'beyaz-ekmek',
    name: 'Beyaz Ekmek',
    defaultUnit: 'piece',
    caloriesPer100g: 265,
    proteinPer100g: 9,
    carbsPer100g: 49,
    fatPer100g: 3.2,
    fiberPer100g: 2.7,
    pieceWeightGrams: 30,
    category: 'ekmek',
  },
  {
    id: 'tam-bugday-ekmegi',
    name: 'Tam Buğday Ekmeği',
    defaultUnit: 'piece',
    caloriesPer100g: 247,
    proteinPer100g: 13,
    carbsPer100g: 43,
    fatPer100g: 3.4,
    fiberPer100g: 6.8,
    pieceWeightGrams: 30,
    category: 'ekmek',
  },

  // ─── Çorbalar ────────────────────────────────────────────────────────────
  {
    id: 'mercimek-corbasi',
    name: 'Mercimek Çorbası',
    defaultUnit: 'gram',
    caloriesPer100g: 56,
    proteinPer100g: 3.5,
    carbsPer100g: 8,
    fatPer100g: 1.2,
    fiberPer100g: 1.9,
    category: 'çorba',
  },

  // ─── Süt Ürünleri ───────────────────────────────────────────────────────
  {
    id: 'yogurt-tam-yagli',
    name: 'Yoğurt (Tam Yağlı)',
    defaultUnit: 'gram',
    caloriesPer100g: 61,
    proteinPer100g: 3.5,
    carbsPer100g: 4.7,
    fatPer100g: 3.3,
    fiberPer100g: 0,
    category: 'süt-ürünü',
  },
  {
    id: 'suzme-yogurt',
    name: 'Süzme Yoğurt (%0)',
    defaultUnit: 'gram',
    caloriesPer100g: 59,
    proteinPer100g: 10,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    fiberPer100g: 0,
    category: 'süt-ürünü',
  },
  {
    id: 'ayran',
    name: 'Ayran',
    defaultUnit: 'gram',
    caloriesPer100g: 37,
    proteinPer100g: 1.7,
    carbsPer100g: 2.5,
    fatPer100g: 1.5,
    fiberPer100g: 0,
    category: 'içecek',
  },
  {
    id: 'beyaz-peynir',
    name: 'Beyaz Peynir',
    defaultUnit: 'gram',
    caloriesPer100g: 264,
    proteinPer100g: 18,
    carbsPer100g: 1,
    fatPer100g: 21,
    fiberPer100g: 0,
    category: 'süt-ürünü',
  },
  {
    id: 'kasar-peynir',
    name: 'Kaşar Peynir',
    defaultUnit: 'gram',
    caloriesPer100g: 349,
    proteinPer100g: 25,
    carbsPer100g: 2,
    fatPer100g: 27,
    fiberPer100g: 0,
    category: 'süt-ürünü',
  },

  // ─── Meyveler ────────────────────────────────────────────────────────────
  {
    id: 'muz',
    name: 'Muz',
    defaultUnit: 'piece',
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 22.8,
    fatPer100g: 0.3,
    fiberPer100g: 2.6,
    pieceWeightGrams: 118,
    category: 'meyve',
  },
  {
    id: 'elma',
    name: 'Elma',
    defaultUnit: 'piece',
    caloriesPer100g: 52,
    proteinPer100g: 0.3,
    carbsPer100g: 13.8,
    fatPer100g: 0.2,
    fiberPer100g: 2.4,
    pieceWeightGrams: 182,
    category: 'meyve',
  },
  {
    id: 'portakal',
    name: 'Portakal',
    defaultUnit: 'piece',
    caloriesPer100g: 47,
    proteinPer100g: 0.9,
    carbsPer100g: 11.7,
    fatPer100g: 0.1,
    fiberPer100g: 2.4,
    pieceWeightGrams: 131,
    category: 'meyve',
  },

  // ─── Sebzeler ────────────────────────────────────────────────────────────
  {
    id: 'domates',
    name: 'Domates',
    defaultUnit: 'piece',
    caloriesPer100g: 18,
    proteinPer100g: 0.9,
    carbsPer100g: 3.9,
    fatPer100g: 0.2,
    fiberPer100g: 1.2,
    pieceWeightGrams: 123,
    category: 'sebze',
  },
  {
    id: 'salatalik',
    name: 'Salatalık',
    defaultUnit: 'piece',
    caloriesPer100g: 15,
    proteinPer100g: 0.7,
    carbsPer100g: 3.6,
    fatPer100g: 0.1,
    fiberPer100g: 0.5,
    pieceWeightGrams: 200,
    category: 'sebze',
  },

  // ─── Kuruyemişler ────────────────────────────────────────────────────────
  {
    id: 'badem',
    name: 'Badem',
    defaultUnit: 'gram',
    caloriesPer100g: 579,
    proteinPer100g: 21,
    carbsPer100g: 22,
    fatPer100g: 50,
    fiberPer100g: 12.5,
    category: 'kuruyemiş',
  },
  {
    id: 'ceviz',
    name: 'Ceviz',
    defaultUnit: 'gram',
    caloriesPer100g: 654,
    proteinPer100g: 15,
    carbsPer100g: 14,
    fatPer100g: 65,
    fiberPer100g: 6.7,
    category: 'kuruyemiş',
  },

  // ─── Diğer ───────────────────────────────────────────────────────────────
  {
    id: 'zeytin-siyah',
    name: 'Siyah Zeytin',
    defaultUnit: 'piece',
    caloriesPer100g: 115,
    proteinPer100g: 0.8,
    carbsPer100g: 6,
    fatPer100g: 10.7,
    fiberPer100g: 3.2,
    pieceWeightGrams: 4,
    category: 'diğer',
  },
  {
    id: 'zeytin-yesil',
    name: 'Yeşil Zeytin',
    defaultUnit: 'piece',
    caloriesPer100g: 145,
    proteinPer100g: 1,
    carbsPer100g: 3.8,
    fatPer100g: 15.3,
    fiberPer100g: 3.3,
    pieceWeightGrams: 4,
    category: 'diğer',
  },
  {
    id: 'bal',
    name: 'Bal',
    defaultUnit: 'gram',
    caloriesPer100g: 304,
    proteinPer100g: 0.3,
    carbsPer100g: 82,
    fatPer100g: 0,
    fiberPer100g: 0.2,
    category: 'diğer',
  },
  {
    id: 'zeytinyagi',
    name: 'Zeytinyağı',
    defaultUnit: 'gram',
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100,
    fiberPer100g: 0,
    category: 'diğer',
  },

  // ─── Market & Paketli Ürünler ───────────────────────────────────────────
  // Etiket değerleri marka/gramaja göre değişebilir; uygulama içinde hızlı
  // giriş için yaklaşık değerler olarak tutulur.
  {
    id: 'ulker-albeni-cikolata',
    name: 'Ülker Albeni Çikolata',
    defaultUnit: 'piece',
    caloriesPer100g: 485,
    proteinPer100g: 5.8,
    carbsPer100g: 67,
    fatPer100g: 21,
    fiberPer100g: 1.8,
    pieceWeightGrams: 40,
    category: 'market',
  },
  {
    id: 'albeni-cikolata',
    name: 'Albeni Çikolata',
    defaultUnit: 'piece',
    caloriesPer100g: 485,
    proteinPer100g: 5.8,
    carbsPer100g: 67,
    fatPer100g: 21,
    fiberPer100g: 1.8,
    pieceWeightGrams: 40,
    category: 'market',
  },
  {
    id: 'ac-bitir-hindi-salam',
    name: 'Aç Bitir Hindi Salam',
    defaultUnit: 'piece',
    caloriesPer100g: 170,
    proteinPer100g: 13,
    carbsPer100g: 3,
    fatPer100g: 12,
    fiberPer100g: 0,
    pieceWeightGrams: 60,
    category: 'market',
  },
  {
    id: 'ac-bitir-dana-salam',
    name: 'Aç Bitir Dana Salam',
    defaultUnit: 'piece',
    caloriesPer100g: 245,
    proteinPer100g: 13,
    carbsPer100g: 2,
    fatPer100g: 20,
    fiberPer100g: 0,
    pieceWeightGrams: 60,
    category: 'market',
  },
  {
    id: 'salam',
    name: 'Salam',
    defaultUnit: 'gram',
    caloriesPer100g: 250,
    proteinPer100g: 13,
    carbsPer100g: 2,
    fatPer100g: 21,
    fiberPer100g: 0,
    category: 'market',
  },
  {
    id: 'protein-bar',
    name: 'Protein Bar',
    defaultUnit: 'piece',
    caloriesPer100g: 380,
    proteinPer100g: 32,
    carbsPer100g: 34,
    fatPer100g: 12,
    fiberPer100g: 8,
    pieceWeightGrams: 50,
    category: 'market',
  },
  {
    id: 'eti-lifalif-protein-bar',
    name: 'Eti Lifalif Protein Bar',
    defaultUnit: 'piece',
    caloriesPer100g: 365,
    proteinPer100g: 28,
    carbsPer100g: 39,
    fatPer100g: 10,
    fiberPer100g: 9,
    pieceWeightGrams: 35,
    category: 'market',
  },
  {
    id: 'nesfit-protein-bar',
    name: 'Nesfit Protein Bar',
    defaultUnit: 'piece',
    caloriesPer100g: 370,
    proteinPer100g: 26,
    carbsPer100g: 42,
    fatPer100g: 11,
    fiberPer100g: 8,
    pieceWeightGrams: 40,
    category: 'market',
  },
]

const DETAILED_TURKISH_FOODS: TurkishFood[] = [
  // ─── Yumurta & Kahvaltı ─────────────────────────────────────────────────
  { id: 'yumurta-cig', name: 'Yumurta', aliases: ['çiğ yumurta'], defaultUnit: 'piece', caloriesPer100g: 143, proteinPer100g: 12.6, carbsPer100g: 0.7, fatPer100g: 9.5, fiberPer100g: 0, pieceWeightGrams: 50, servingOptions: [{ label: '1 adet', grams: 50 }, { label: '2 adet', grams: 100 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'menemen', name: 'Menemen', defaultUnit: 'gram', caloriesPer100g: 105, proteinPer100g: 5.2, carbsPer100g: 4.8, fatPer100g: 7.2, fiberPer100g: 1.1, servingOptions: [{ label: '1 porsiyon', grams: 220 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'omlet-sade', name: 'Omlet (Sade)', defaultUnit: 'piece', caloriesPer100g: 154, proteinPer100g: 11, carbsPer100g: 1.7, fatPer100g: 11.8, fiberPer100g: 0, pieceWeightGrams: 120, servingOptions: [{ label: '1 omlet', grams: 120 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'simit', name: 'Simit', defaultUnit: 'piece', caloriesPer100g: 360, proteinPer100g: 10, carbsPer100g: 58, fatPer100g: 10, fiberPer100g: 3.4, pieceWeightGrams: 100, servingOptions: [{ label: '1 adet', grams: 100 }, { label: 'Yarım', grams: 50 }, { label: '100 g', grams: 100 }], category: 'ekmek' },
  { id: 'pogaca-peynirli', name: 'Poğaça (Peynirli)', defaultUnit: 'piece', caloriesPer100g: 360, proteinPer100g: 8.5, carbsPer100g: 42, fatPer100g: 18, fiberPer100g: 2, pieceWeightGrams: 80, servingOptions: [{ label: '1 adet', grams: 80 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'borek-peynirli', name: 'Börek (Peynirli)', defaultUnit: 'gram', caloriesPer100g: 330, proteinPer100g: 10, carbsPer100g: 32, fatPer100g: 18, fiberPer100g: 1.7, servingOptions: [{ label: '1 dilim', grams: 120 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'yulaf-ezmesi', name: 'Yulaf Ezmesi', aliases: ['oat', 'oats'], defaultUnit: 'gram', caloriesPer100g: 389, proteinPer100g: 16.9, carbsPer100g: 66.3, fatPer100g: 6.9, fiberPer100g: 10.6, servingOptions: [{ label: '1 kase', grams: 40 }, { label: '1 yemek kaşığı', grams: 10 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
  { id: 'granola', name: 'Granola', defaultUnit: 'gram', caloriesPer100g: 450, proteinPer100g: 10, carbsPer100g: 64, fatPer100g: 16, fiberPer100g: 7, servingOptions: [{ label: '1 kase', grams: 45 }, { label: '100 g', grams: 100 }], category: 'tahıl' },

  // ─── Protein, Et, Tavuk, Balık ──────────────────────────────────────────
  { id: 'tavuk-gogsu-haslanmis', name: 'Tavuk Göğsü (Haşlanmış)', defaultUnit: 'gram', caloriesPer100g: 151, proteinPer100g: 29, carbsPer100g: 0, fatPer100g: 3.2, fiberPer100g: 0, servingOptions: [{ label: '1 porsiyon', grams: 150 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'tavuk-but-izgara', name: 'Tavuk But (Izgara)', defaultUnit: 'gram', caloriesPer100g: 209, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 11, fiberPer100g: 0, servingOptions: [{ label: '1 but', grams: 120 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'hindi-gogus', name: 'Hindi Göğüs', defaultUnit: 'gram', caloriesPer100g: 135, proteinPer100g: 29, carbsPer100g: 0, fatPer100g: 1.6, fiberPer100g: 0, servingOptions: [{ label: '1 porsiyon', grams: 150 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'dana-kiyma-az-yagli', name: 'Dana Kıyma (Az Yağlı)', defaultUnit: 'gram', caloriesPer100g: 215, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 12, fiberPer100g: 0, servingOptions: [{ label: '1 porsiyon', grams: 120 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'dana-biftek', name: 'Dana Biftek', defaultUnit: 'gram', caloriesPer100g: 250, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 15, fiberPer100g: 0, servingOptions: [{ label: '1 porsiyon', grams: 180 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'ton-baligi-suda', name: 'Ton Balığı (Suda)', defaultUnit: 'gram', caloriesPer100g: 116, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 1, fiberPer100g: 0, servingOptions: [{ label: '1 kutu süzülmüş', grams: 80 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'ton-baligi-yagda', name: 'Ton Balığı (Yağda)', defaultUnit: 'gram', caloriesPer100g: 198, proteinPer100g: 29, carbsPer100g: 0, fatPer100g: 8.2, fiberPer100g: 0, servingOptions: [{ label: '1 kutu süzülmüş', grams: 80 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'levrek-izgara', name: 'Levrek (Izgara)', defaultUnit: 'gram', caloriesPer100g: 124, proteinPer100g: 24, carbsPer100g: 0, fatPer100g: 2.6, fiberPer100g: 0, servingOptions: [{ label: '1 fileto', grams: 180 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'tavuk-doner', name: 'Tavuk Döner', defaultUnit: 'gram', caloriesPer100g: 215, proteinPer100g: 19, carbsPer100g: 3, fatPer100g: 14, fiberPer100g: 0.4, servingOptions: [{ label: '1 porsiyon', grams: 120 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'et-doner', name: 'Et Döner', defaultUnit: 'gram', caloriesPer100g: 255, proteinPer100g: 18, carbsPer100g: 2, fatPer100g: 20, fiberPer100g: 0.3, servingOptions: [{ label: '1 porsiyon', grams: 120 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },

  // ─── Bakliyat & Ana Yemekler ────────────────────────────────────────────
  { id: 'mercimek-haslanmis', name: 'Mercimek (Haşlanmış)', defaultUnit: 'gram', caloriesPer100g: 116, proteinPer100g: 9, carbsPer100g: 20, fatPer100g: 0.4, fiberPer100g: 7.9, servingOptions: [{ label: '1 kase', grams: 180 }, { label: '100 g', grams: 100 }], category: 'bakliyat' },
  { id: 'nohut-haslanmis', name: 'Nohut (Haşlanmış)', defaultUnit: 'gram', caloriesPer100g: 164, proteinPer100g: 8.9, carbsPer100g: 27.4, fatPer100g: 2.6, fiberPer100g: 7.6, servingOptions: [{ label: '1 kase', grams: 170 }, { label: '100 g', grams: 100 }], category: 'bakliyat' },
  { id: 'kuru-fasulye', name: 'Kuru Fasulye', defaultUnit: 'gram', caloriesPer100g: 145, proteinPer100g: 7.5, carbsPer100g: 21, fatPer100g: 3.2, fiberPer100g: 6, servingOptions: [{ label: '1 porsiyon', grams: 250 }, { label: '100 g', grams: 100 }], category: 'bakliyat' },
  { id: 'etsiz-turlu', name: 'Türlü (Etsiz)', defaultUnit: 'gram', caloriesPer100g: 72, proteinPer100g: 2, carbsPer100g: 9, fatPer100g: 3.2, fiberPer100g: 2.8, servingOptions: [{ label: '1 porsiyon', grams: 250 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'tavuklu-salata', name: 'Tavuklu Salata', defaultUnit: 'gram', caloriesPer100g: 115, proteinPer100g: 12, carbsPer100g: 5, fatPer100g: 5, fiberPer100g: 1.8, servingOptions: [{ label: '1 kase', grams: 300 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'lahmacun', name: 'Lahmacun', defaultUnit: 'piece', caloriesPer100g: 245, proteinPer100g: 10, carbsPer100g: 30, fatPer100g: 9, fiberPer100g: 2, pieceWeightGrams: 110, servingOptions: [{ label: '1 adet', grams: 110 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'pide-kiymali', name: 'Pide (Kıymalı)', defaultUnit: 'piece', caloriesPer100g: 270, proteinPer100g: 12, carbsPer100g: 35, fatPer100g: 9, fiberPer100g: 2.2, pieceWeightGrams: 250, servingOptions: [{ label: '1 adet', grams: 250 }, { label: 'Yarım', grams: 125 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },

  // ─── Karbonhidratlar, Pilav, Makarna ────────────────────────────────────
  { id: 'patates-haslanmis', name: 'Patates (Haşlanmış)', defaultUnit: 'gram', caloriesPer100g: 87, proteinPer100g: 1.9, carbsPer100g: 20, fatPer100g: 0.1, fiberPer100g: 1.8, servingOptions: [{ label: '1 orta', grams: 150 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
  { id: 'patates-kizartmasi', name: 'Patates Kızartması', defaultUnit: 'gram', caloriesPer100g: 312, proteinPer100g: 3.4, carbsPer100g: 41, fatPer100g: 15, fiberPer100g: 3.8, servingOptions: [{ label: '1 küçük', grams: 75 }, { label: '1 orta', grams: 110 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'kinoa-haslanmis', name: 'Kinoa (Haşlanmış)', defaultUnit: 'gram', caloriesPer100g: 120, proteinPer100g: 4.4, carbsPer100g: 21.3, fatPer100g: 1.9, fiberPer100g: 2.8, servingOptions: [{ label: '1 kase', grams: 150 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
  { id: 'karabugday-haslanmis', name: 'Karabuğday (Haşlanmış)', defaultUnit: 'gram', caloriesPer100g: 92, proteinPer100g: 3.4, carbsPer100g: 20, fatPer100g: 0.6, fiberPer100g: 2.7, servingOptions: [{ label: '1 kase', grams: 160 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
  { id: 'tam-bugday-makarna', name: 'Tam Buğday Makarna (Haşlanmış)', defaultUnit: 'gram', caloriesPer100g: 124, proteinPer100g: 5.3, carbsPer100g: 26, fatPer100g: 0.8, fiberPer100g: 3.9, servingOptions: [{ label: '1 tabak', grams: 200 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
  { id: 'lavaş', name: 'Lavaş', defaultUnit: 'piece', caloriesPer100g: 300, proteinPer100g: 9, carbsPer100g: 55, fatPer100g: 5, fiberPer100g: 2.5, pieceWeightGrams: 65, servingOptions: [{ label: '1 adet', grams: 65 }, { label: '100 g', grams: 100 }], category: 'ekmek' },
  { id: 'tortilla', name: 'Tortilla Ekmeği', defaultUnit: 'piece', caloriesPer100g: 310, proteinPer100g: 8.5, carbsPer100g: 52, fatPer100g: 8, fiberPer100g: 3, pieceWeightGrams: 60, servingOptions: [{ label: '1 adet', grams: 60 }, { label: '100 g', grams: 100 }], category: 'ekmek' },

  // ─── Süt Ürünleri ───────────────────────────────────────────────────────
  { id: 'sut-yarim-yagli', name: 'Süt (Yarım Yağlı)', defaultUnit: 'gram', caloriesPer100g: 47, proteinPer100g: 3.3, carbsPer100g: 4.8, fatPer100g: 1.6, fiberPer100g: 0, servingOptions: [{ label: '1 bardak', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'süt-ürünü' },
  { id: 'sut-tam-yagli', name: 'Süt (Tam Yağlı)', defaultUnit: 'gram', caloriesPer100g: 61, proteinPer100g: 3.2, carbsPer100g: 4.8, fatPer100g: 3.3, fiberPer100g: 0, servingOptions: [{ label: '1 bardak', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'süt-ürünü' },
  { id: 'kefir', name: 'Kefir', defaultUnit: 'gram', caloriesPer100g: 55, proteinPer100g: 3.4, carbsPer100g: 4.8, fatPer100g: 2.2, fiberPer100g: 0, servingOptions: [{ label: '1 şişe küçük', grams: 250 }, { label: '1 bardak', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'süt-ürünü' },
  { id: 'labne', name: 'Labne', defaultUnit: 'gram', caloriesPer100g: 230, proteinPer100g: 6, carbsPer100g: 4, fatPer100g: 21, fiberPer100g: 0, servingOptions: [{ label: '1 yemek kaşığı', grams: 20 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },
  { id: 'lor-peyniri', name: 'Lor Peyniri', defaultUnit: 'gram', caloriesPer100g: 98, proteinPer100g: 17, carbsPer100g: 3, fatPer100g: 2, fiberPer100g: 0, servingOptions: [{ label: '1 porsiyon', grams: 100 }, { label: '1 yemek kaşığı', grams: 25 }], category: 'süt-ürünü' },
  { id: 'cottage-peynir', name: 'Cottage Peynir', aliases: ['cottage cheese'], defaultUnit: 'gram', caloriesPer100g: 98, proteinPer100g: 11, carbsPer100g: 3.4, fatPer100g: 4.3, fiberPer100g: 0, servingOptions: [{ label: '1 kase', grams: 150 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },

  // ─── Meyve & Sebze ──────────────────────────────────────────────────────
  { id: 'armut', name: 'Armut', defaultUnit: 'piece', caloriesPer100g: 57, proteinPer100g: 0.4, carbsPer100g: 15.2, fatPer100g: 0.1, fiberPer100g: 3.1, pieceWeightGrams: 178, servingOptions: [{ label: '1 adet', grams: 178 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'cilek', name: 'Çilek', defaultUnit: 'gram', caloriesPer100g: 32, proteinPer100g: 0.7, carbsPer100g: 7.7, fatPer100g: 0.3, fiberPer100g: 2, servingOptions: [{ label: '1 kase', grams: 150 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'uzum', name: 'Üzüm', defaultUnit: 'gram', caloriesPer100g: 69, proteinPer100g: 0.7, carbsPer100g: 18, fatPer100g: 0.2, fiberPer100g: 0.9, servingOptions: [{ label: '1 salkım küçük', grams: 150 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'karpuz', name: 'Karpuz', defaultUnit: 'gram', caloriesPer100g: 30, proteinPer100g: 0.6, carbsPer100g: 7.6, fatPer100g: 0.2, fiberPer100g: 0.4, servingOptions: [{ label: '1 dilim', grams: 280 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'avokado', name: 'Avokado', defaultUnit: 'piece', caloriesPer100g: 160, proteinPer100g: 2, carbsPer100g: 8.5, fatPer100g: 14.7, fiberPer100g: 6.7, pieceWeightGrams: 150, servingOptions: [{ label: '1 adet', grams: 150 }, { label: 'Yarım', grams: 75 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'brokoli-buharda', name: 'Brokoli (Buharda)', defaultUnit: 'gram', caloriesPer100g: 35, proteinPer100g: 2.4, carbsPer100g: 7.2, fatPer100g: 0.4, fiberPer100g: 3.3, servingOptions: [{ label: '1 kase', grams: 150 }, { label: '100 g', grams: 100 }], category: 'sebze' },
  { id: 'havuç', name: 'Havuç', defaultUnit: 'piece', caloriesPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 9.6, fatPer100g: 0.2, fiberPer100g: 2.8, pieceWeightGrams: 70, servingOptions: [{ label: '1 adet', grams: 70 }, { label: '100 g', grams: 100 }], category: 'sebze' },
  { id: 'marul', name: 'Marul', defaultUnit: 'gram', caloriesPer100g: 15, proteinPer100g: 1.4, carbsPer100g: 2.9, fatPer100g: 0.2, fiberPer100g: 1.3, servingOptions: [{ label: '1 kase', grams: 55 }, { label: '100 g', grams: 100 }], category: 'sebze' },

  // ─── Kuruyemiş, Yağ & Sürmeler ──────────────────────────────────────────
  { id: 'fistik-ezmesi', name: 'Fıstık Ezmesi', defaultUnit: 'gram', caloriesPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatPer100g: 50, fiberPer100g: 6, servingOptions: [{ label: '1 yemek kaşığı', grams: 16 }, { label: '100 g', grams: 100 }], category: 'kuruyemiş' },
  { id: 'findik', name: 'Fındık', defaultUnit: 'gram', caloriesPer100g: 628, proteinPer100g: 15, carbsPer100g: 17, fatPer100g: 61, fiberPer100g: 9.7, servingOptions: [{ label: '1 avuç', grams: 30 }, { label: '100 g', grams: 100 }], category: 'kuruyemiş' },
  { id: 'antep-fistigi', name: 'Antep Fıstığı', defaultUnit: 'gram', caloriesPer100g: 562, proteinPer100g: 20, carbsPer100g: 28, fatPer100g: 45, fiberPer100g: 10, servingOptions: [{ label: '1 avuç', grams: 30 }, { label: '100 g', grams: 100 }], category: 'kuruyemiş' },
  { id: 'tahin', name: 'Tahin', defaultUnit: 'gram', caloriesPer100g: 595, proteinPer100g: 17, carbsPer100g: 21, fatPer100g: 53, fiberPer100g: 9, servingOptions: [{ label: '1 yemek kaşığı', grams: 15 }, { label: '100 g', grams: 100 }], category: 'diğer' },
  { id: 'tereyagi', name: 'Tereyağı', defaultUnit: 'gram', caloriesPer100g: 717, proteinPer100g: 0.9, carbsPer100g: 0.1, fatPer100g: 81, fiberPer100g: 0, servingOptions: [{ label: '1 tatlı kaşığı', grams: 10 }, { label: '100 g', grams: 100 }], category: 'diğer' },

  // ─── Şarküteri & Market Proteinleri ─────────────────────────────────────
  { id: 'pinar-acbitir-hindi-fume', name: 'Pınar Aç Bitir Hindi Füme', brand: 'Pınar', aliases: ['aç bitir hindi füme', 'hindi füme'], defaultUnit: 'piece', caloriesPer100g: 115, proteinPer100g: 20, carbsPer100g: 2, fatPer100g: 3, fiberPer100g: 0, pieceWeightGrams: 60, servingOptions: [{ label: '1 paket', grams: 60 }, { label: '1 dilim', grams: 10 }, { label: '100 g', grams: 100 }], category: 'şarküteri' },
  { id: 'pinar-acbitir-salam', name: 'Pınar Aç Bitir Salam', brand: 'Pınar', aliases: ['aç bitir salam'], defaultUnit: 'piece', caloriesPer100g: 245, proteinPer100g: 13, carbsPer100g: 2, fatPer100g: 20, fiberPer100g: 0, pieceWeightGrams: 60, servingOptions: [{ label: '1 paket', grams: 60 }, { label: '1 dilim', grams: 10 }, { label: '100 g', grams: 100 }], category: 'şarküteri' },
  { id: 'sosis', name: 'Sosis', defaultUnit: 'piece', caloriesPer100g: 290, proteinPer100g: 12, carbsPer100g: 3, fatPer100g: 26, fiberPer100g: 0, pieceWeightGrams: 45, servingOptions: [{ label: '1 adet', grams: 45 }, { label: '100 g', grams: 100 }], category: 'şarküteri' },
  { id: 'pastirma', name: 'Pastırma', defaultUnit: 'gram', caloriesPer100g: 250, proteinPer100g: 29, carbsPer100g: 1, fatPer100g: 14, fiberPer100g: 0, servingOptions: [{ label: '1 dilim', grams: 12 }, { label: '100 g', grams: 100 }], category: 'şarküteri' },

  // ─── Paketli Atıştırmalık, Bar, Çikolata ────────────────────────────────
  { id: 'ulker-cikolata-sutlu', name: 'Ülker Sütlü Çikolata', brand: 'Ülker', aliases: ['sütlü çikolata'], defaultUnit: 'piece', caloriesPer100g: 535, proteinPer100g: 7, carbsPer100g: 58, fatPer100g: 31, fiberPer100g: 2, pieceWeightGrams: 60, servingOptions: [{ label: '1 paket', grams: 60 }, { label: '1 kare', grams: 8 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'eti-canga', name: 'Eti Canga', brand: 'Eti', aliases: ['canga çikolata'], defaultUnit: 'piece', caloriesPer100g: 500, proteinPer100g: 7, carbsPer100g: 60, fatPer100g: 26, fiberPer100g: 2, pieceWeightGrams: 45, servingOptions: [{ label: '1 adet', grams: 45 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'eti-cin', name: 'Eti Cin', brand: 'Eti', aliases: ['cin bisküvi'], defaultUnit: 'piece', caloriesPer100g: 405, proteinPer100g: 5, carbsPer100g: 75, fatPer100g: 9, fiberPer100g: 2, pieceWeightGrams: 33, servingOptions: [{ label: '1 paket', grams: 33 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'eti-burcak', name: 'Eti Burçak', brand: 'Eti', aliases: ['burçak bisküvi'], defaultUnit: 'gram', caloriesPer100g: 465, proteinPer100g: 7, carbsPer100g: 66, fatPer100g: 18, fiberPer100g: 5, servingOptions: [{ label: '1 paket', grams: 131 }, { label: '4 adet', grams: 32 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'ulker-hanimeller', name: 'Ülker Hanımeller', brand: 'Ülker', aliases: ['hanımeller kurabiye'], defaultUnit: 'gram', caloriesPer100g: 490, proteinPer100g: 6, carbsPer100g: 64, fatPer100g: 23, fiberPer100g: 2.5, servingOptions: [{ label: '1 paket', grams: 82 }, { label: '1 adet', grams: 13 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'tadelle', name: 'Tadelle', brand: 'Tadelle', aliases: ['tadelle çikolata'], defaultUnit: 'piece', caloriesPer100g: 545, proteinPer100g: 8, carbsPer100g: 49, fatPer100g: 35, fiberPer100g: 4, pieceWeightGrams: 30, servingOptions: [{ label: '1 adet', grams: 30 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'snickers', name: 'Snickers', brand: 'Mars', defaultUnit: 'piece', caloriesPer100g: 488, proteinPer100g: 8.6, carbsPer100g: 60, fatPer100g: 24, fiberPer100g: 2, pieceWeightGrams: 50, servingOptions: [{ label: '1 bar', grams: 50 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'corny-big-protein', name: 'Corny Big Protein Bar', brand: 'Corny', aliases: ['protein bar corny'], defaultUnit: 'piece', caloriesPer100g: 370, proteinPer100g: 30, carbsPer100g: 38, fatPer100g: 11, fiberPer100g: 6, pieceWeightGrams: 50, servingOptions: [{ label: '1 bar', grams: 50 }, { label: '100 g', grams: 100 }], category: 'market' },
  { id: 'zuber-protein-bar', name: 'Züber Protein Bar', brand: 'Züber', aliases: ['zuber protein'], defaultUnit: 'piece', caloriesPer100g: 385, proteinPer100g: 25, carbsPer100g: 42, fatPer100g: 13, fiberPer100g: 8, pieceWeightGrams: 40, servingOptions: [{ label: '1 bar', grams: 40 }, { label: '100 g', grams: 100 }], category: 'market' },
  { id: 'cips-sade', name: 'Patates Cipsi (Sade)', aliases: ['cips'], defaultUnit: 'gram', caloriesPer100g: 536, proteinPer100g: 6.5, carbsPer100g: 53, fatPer100g: 34, fiberPer100g: 4, servingOptions: [{ label: '1 küçük paket', grams: 45 }, { label: '1 büyük paket', grams: 100 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'kraker', name: 'Kraker', defaultUnit: 'gram', caloriesPer100g: 430, proteinPer100g: 9, carbsPer100g: 70, fatPer100g: 12, fiberPer100g: 3, servingOptions: [{ label: '1 paket', grams: 40 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },

  // ─── İçecekler & Tatlılar ───────────────────────────────────────────────
  { id: 'coca-cola', name: 'Coca-Cola', brand: 'Coca-Cola', aliases: ['kola'], defaultUnit: 'gram', caloriesPer100g: 42, proteinPer100g: 0, carbsPer100g: 10.6, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 kutu', grams: 330 }, { label: '1 bardak', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'coca-cola-zero', name: 'Coca-Cola Zero', brand: 'Coca-Cola', aliases: ['kola zero'], defaultUnit: 'gram', caloriesPer100g: 0.3, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 kutu', grams: 330 }, { label: '1 bardak', grams: 200 }], category: 'içecek' },
  { id: 'meyve-suyu', name: 'Meyve Suyu', defaultUnit: 'gram', caloriesPer100g: 46, proteinPer100g: 0.5, carbsPer100g: 11, fatPer100g: 0.1, fiberPer100g: 0.2, servingOptions: [{ label: '1 bardak', grams: 200 }, { label: '1 kutu', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'turk-kahvesi-sekersiz', name: 'Türk Kahvesi (Şekersiz)', defaultUnit: 'piece', caloriesPer100g: 2, proteinPer100g: 0.1, carbsPer100g: 0, fatPer100g: 0, fiberPer100g: 0, pieceWeightGrams: 60, servingOptions: [{ label: '1 fincan', grams: 60 }], category: 'içecek' },
  { id: 'baklava', name: 'Baklava', defaultUnit: 'piece', caloriesPer100g: 430, proteinPer100g: 6, carbsPer100g: 55, fatPer100g: 21, fiberPer100g: 2, pieceWeightGrams: 40, servingOptions: [{ label: '1 dilim', grams: 40 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'sutlac', name: 'Sütlaç', defaultUnit: 'gram', caloriesPer100g: 135, proteinPer100g: 3.2, carbsPer100g: 24, fatPer100g: 2.8, fiberPer100g: 0.2, servingOptions: [{ label: '1 kase', grams: 200 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'kazandibi', name: 'Kazandibi', defaultUnit: 'gram', caloriesPer100g: 160, proteinPer100g: 3.5, carbsPer100g: 28, fatPer100g: 4, fiberPer100g: 0.2, servingOptions: [{ label: '1 porsiyon', grams: 180 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
]

// ─── Geniş Market / Abur Cubur / Marka Ürünleri ─────────────────────────────
// Paketli atıştırmalık, çikolata, bisküvi, cips, içecek, tatlı, dondurma,
// kuruyemiş, ek meyve-sebze ve hazır yemekler. Değerler etikete göre yaklaşıktır.
const EXTRA_TURKISH_FOODS: TurkishFood[] = [
  // ─── Çikolata, Gofret, Bar ──────────────────────────────────────────────
  { id: 'milka-cikolata', name: 'Milka Sütlü Çikolata', brand: 'Milka', aliases: ['milka'], defaultUnit: 'piece', caloriesPer100g: 530, proteinPer100g: 6.7, carbsPer100g: 59, fatPer100g: 29, fiberPer100g: 2, pieceWeightGrams: 100, servingOptions: [{ label: '1 kare', grams: 5 }, { label: '1 paket', grams: 100 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'nutella', name: 'Nutella', brand: 'Ferrero', aliases: ['çikolatalı fındık kreması', 'nutella'], defaultUnit: 'gram', caloriesPer100g: 539, proteinPer100g: 6.3, carbsPer100g: 57.5, fatPer100g: 30.9, fiberPer100g: 0, servingOptions: [{ label: '1 yemek kaşığı', grams: 15 }, { label: '1 tatlı kaşığı', grams: 8 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'cokokrem', name: 'Ülker Çokokrem', brand: 'Ülker', aliases: ['çokokrem', 'kakao kreması'], defaultUnit: 'gram', caloriesPer100g: 541, proteinPer100g: 6, carbsPer100g: 60, fatPer100g: 30, fiberPer100g: 2, servingOptions: [{ label: '1 yemek kaşığı', grams: 15 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'eti-karam', name: 'Eti Karam Bitter', brand: 'Eti', aliases: ['karam', 'bitter çikolata'], defaultUnit: 'piece', caloriesPer100g: 560, proteinPer100g: 7, carbsPer100g: 48, fatPer100g: 37, fiberPer100g: 8, pieceWeightGrams: 24, servingOptions: [{ label: '1 adet', grams: 24 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'damak', name: 'Ülker Damak Fıstıklı', brand: 'Ülker', aliases: ['damak çikolata'], defaultUnit: 'piece', caloriesPer100g: 545, proteinPer100g: 8, carbsPer100g: 52, fatPer100g: 34, fiberPer100g: 3, pieceWeightGrams: 33, servingOptions: [{ label: '1 adet', grams: 33 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'ulker-cokoprens', name: 'Ülker Çokoprens', brand: 'Ülker', aliases: ['çokoprens'], defaultUnit: 'piece', caloriesPer100g: 470, proteinPer100g: 6, carbsPer100g: 68, fatPer100g: 19, fiberPer100g: 2, pieceWeightGrams: 44, servingOptions: [{ label: '1 paket', grams: 44 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'ulker-cikolatali-gofret', name: 'Ülker Çikolatalı Gofret', brand: 'Ülker', aliases: ['gofret'], defaultUnit: 'piece', caloriesPer100g: 535, proteinPer100g: 6, carbsPer100g: 58, fatPer100g: 31, fiberPer100g: 1.5, pieceWeightGrams: 35, servingOptions: [{ label: '1 adet', grams: 35 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'ulker-dido', name: 'Ülker Dido', brand: 'Ülker', aliases: ['dido'], defaultUnit: 'piece', caloriesPer100g: 520, proteinPer100g: 6, carbsPer100g: 60, fatPer100g: 29, fiberPer100g: 1, pieceWeightGrams: 35, servingOptions: [{ label: '1 adet', grams: 35 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'ulker-cokostar', name: 'Ülker Çokostar', brand: 'Ülker', aliases: ['çokostar'], defaultUnit: 'piece', caloriesPer100g: 490, proteinPer100g: 6, carbsPer100g: 65, fatPer100g: 23, fiberPer100g: 2, pieceWeightGrams: 28, servingOptions: [{ label: '1 adet', grams: 28 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'eti-metro', name: 'Eti Metro', brand: 'Eti', aliases: ['metro çikolata'], defaultUnit: 'piece', caloriesPer100g: 480, proteinPer100g: 5, carbsPer100g: 62, fatPer100g: 24, fiberPer100g: 2, pieceWeightGrams: 36, servingOptions: [{ label: '1 adet', grams: 36 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'mars-bar', name: 'Mars', brand: 'Mars', aliases: ['mars çikolata'], defaultUnit: 'piece', caloriesPer100g: 449, proteinPer100g: 4, carbsPer100g: 65, fatPer100g: 17, fiberPer100g: 1.2, pieceWeightGrams: 51, servingOptions: [{ label: '1 bar', grams: 51 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'twix', name: 'Twix', brand: 'Twix', aliases: ['twix çikolata'], defaultUnit: 'piece', caloriesPer100g: 495, proteinPer100g: 4.6, carbsPer100g: 64, fatPer100g: 24, fiberPer100g: 1.5, pieceWeightGrams: 50, servingOptions: [{ label: '1 bar', grams: 50 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'kinder-bueno', name: 'Kinder Bueno', brand: 'Kinder', aliases: ['bueno'], defaultUnit: 'piece', caloriesPer100g: 571, proteinPer100g: 8.5, carbsPer100g: 49, fatPer100g: 37, fiberPer100g: 2, pieceWeightGrams: 43, servingOptions: [{ label: '1 paket', grams: 43 }, { label: 'Yarım', grams: 21 }, { label: '100 g', grams: 100 }], category: 'tatlı' },

  // ─── Bisküvi, Kraker, Kek ───────────────────────────────────────────────
  { id: 'eti-crax', name: 'Eti Crax Kraker', brand: 'Eti', aliases: ['crax'], defaultUnit: 'gram', caloriesPer100g: 470, proteinPer100g: 9, carbsPer100g: 62, fatPer100g: 20, fiberPer100g: 3, servingOptions: [{ label: '1 paket', grams: 42 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'ulker-halley', name: 'Ülker Halley', brand: 'Ülker', aliases: ['halley'], defaultUnit: 'piece', caloriesPer100g: 430, proteinPer100g: 4.5, carbsPer100g: 64, fatPer100g: 17, fiberPer100g: 1.5, pieceWeightGrams: 30, servingOptions: [{ label: '1 adet', grams: 30 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'ulker-biskrem', name: 'Ülker Biskrem', brand: 'Ülker', aliases: ['biskrem'], defaultUnit: 'piece', caloriesPer100g: 470, proteinPer100g: 5.5, carbsPer100g: 64, fatPer100g: 21, fiberPer100g: 2, pieceWeightGrams: 11, servingOptions: [{ label: '1 adet', grams: 11 }, { label: '1 paket', grams: 88 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'eti-potibor', name: 'Eti Pötibör', brand: 'Eti', aliases: ['pötibör', 'petit beurre'], defaultUnit: 'gram', caloriesPer100g: 440, proteinPer100g: 8, carbsPer100g: 74, fatPer100g: 11, fiberPer100g: 2.5, servingOptions: [{ label: '1 adet', grams: 8 }, { label: '1 paket', grams: 175 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'ulker-bebe-biskuvi', name: 'Ülker Bebe Bisküvi', brand: 'Ülker', aliases: ['bebe bisküvi'], defaultUnit: 'gram', caloriesPer100g: 420, proteinPer100g: 9, carbsPer100g: 74, fatPer100g: 9, fiberPer100g: 2.5, servingOptions: [{ label: '1 adet', grams: 6 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'eti-form-biskuvi', name: 'Eti Form Bisküvi', brand: 'Eti', aliases: ['form bisküvi', 'lifli bisküvi'], defaultUnit: 'gram', caloriesPer100g: 415, proteinPer100g: 8, carbsPer100g: 70, fatPer100g: 11, fiberPer100g: 8, servingOptions: [{ label: '1 adet', grams: 8 }, { label: '1 paket', grams: 50 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'eti-topkek', name: 'Eti Topkek', brand: 'Eti', aliases: ['topkek'], defaultUnit: 'piece', caloriesPer100g: 410, proteinPer100g: 5, carbsPer100g: 55, fatPer100g: 19, fiberPer100g: 1, pieceWeightGrams: 35, servingOptions: [{ label: '1 adet', grams: 35 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'eti-browni', name: 'Eti Browni Kek', brand: 'Eti', aliases: ['browni'], defaultUnit: 'piece', caloriesPer100g: 420, proteinPer100g: 5, carbsPer100g: 52, fatPer100g: 21, fiberPer100g: 2, pieceWeightGrams: 40, servingOptions: [{ label: '1 adet', grams: 40 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'eti-popkek', name: 'Eti Popkek', brand: 'Eti', aliases: ['popkek'], defaultUnit: 'piece', caloriesPer100g: 400, proteinPer100g: 5, carbsPer100g: 56, fatPer100g: 17, fiberPer100g: 1, pieceWeightGrams: 40, servingOptions: [{ label: '1 adet', grams: 40 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'ulker-cizi', name: 'Ülker Çizi Kraker', brand: 'Ülker', aliases: ['çizi'], defaultUnit: 'gram', caloriesPer100g: 490, proteinPer100g: 8, carbsPer100g: 62, fatPer100g: 23, fiberPer100g: 2, servingOptions: [{ label: '1 paket', grams: 35 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'cubuk-kraker', name: 'Çubuk Kraker', aliases: ['çubuk kraker', 'tuzlu çubuk'], defaultUnit: 'gram', caloriesPer100g: 460, proteinPer100g: 9, carbsPer100g: 68, fatPer100g: 16, fiberPer100g: 3, servingOptions: [{ label: '1 avuç', grams: 30 }, { label: '1 paket', grams: 70 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },

  // ─── Cips & Tuzlu Atıştırmalık ──────────────────────────────────────────
  { id: 'lays-cips', name: "Lay's Patates Cipsi", brand: "Lay's", aliases: ['lays', 'cips'], defaultUnit: 'gram', caloriesPer100g: 540, proteinPer100g: 6, carbsPer100g: 53, fatPer100g: 34, fiberPer100g: 4, servingOptions: [{ label: '1 küçük paket', grams: 35 }, { label: '1 büyük paket', grams: 107 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'ruffles-cips', name: 'Ruffles Cips', brand: 'Ruffles', aliases: ['ruffles'], defaultUnit: 'gram', caloriesPer100g: 540, proteinPer100g: 6, carbsPer100g: 52, fatPer100g: 34, fiberPer100g: 4, servingOptions: [{ label: '1 küçük paket', grams: 35 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'doritos', name: 'Doritos', brand: 'Doritos', aliases: ['doritos', 'mısır cipsi'], defaultUnit: 'gram', caloriesPer100g: 498, proteinPer100g: 7, carbsPer100g: 63, fatPer100g: 24, fiberPer100g: 4, servingOptions: [{ label: '1 paket', grams: 40 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'cheetos', name: 'Cheetos', brand: 'Cheetos', aliases: ['cheetos'], defaultUnit: 'gram', caloriesPer100g: 520, proteinPer100g: 6, carbsPer100g: 57, fatPer100g: 30, fiberPer100g: 1, servingOptions: [{ label: '1 paket', grams: 40 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'patos', name: 'Patos', brand: 'Patos', aliases: ['patos'], defaultUnit: 'gram', caloriesPer100g: 510, proteinPer100g: 6, carbsPer100g: 58, fatPer100g: 28, fiberPer100g: 2, servingOptions: [{ label: '1 paket', grams: 30 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'pringles', name: 'Pringles', brand: 'Pringles', aliases: ['pringles'], defaultUnit: 'gram', caloriesPer100g: 530, proteinPer100g: 4, carbsPer100g: 52, fatPer100g: 34, fiberPer100g: 3, servingOptions: [{ label: '1 avuç', grams: 30 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },

  // ─── İçecekler ──────────────────────────────────────────────────────────
  { id: 'fanta', name: 'Fanta', brand: 'Fanta', aliases: ['fanta', 'gazoz'], defaultUnit: 'gram', caloriesPer100g: 41, proteinPer100g: 0, carbsPer100g: 10, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 kutu', grams: 330 }, { label: '1 bardak', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'sprite', name: 'Sprite', brand: 'Sprite', aliases: ['sprite'], defaultUnit: 'gram', caloriesPer100g: 38, proteinPer100g: 0, carbsPer100g: 9, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 kutu', grams: 330 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'pepsi', name: 'Pepsi', brand: 'Pepsi', aliases: ['pepsi'], defaultUnit: 'gram', caloriesPer100g: 43, proteinPer100g: 0, carbsPer100g: 11, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 kutu', grams: 330 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'redbull', name: 'Red Bull', brand: 'Red Bull', aliases: ['red bull', 'enerji içeceği'], defaultUnit: 'gram', caloriesPer100g: 45, proteinPer100g: 0, carbsPer100g: 11, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 kutu', grams: 250 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'monster-energy', name: 'Monster Energy', brand: 'Monster', aliases: ['monster', 'enerji içeceği'], defaultUnit: 'gram', caloriesPer100g: 47, proteinPer100g: 0, carbsPer100g: 11, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 kutu', grams: 500 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'fuse-tea', name: 'Fuse Tea Şeftali', brand: 'Fuse Tea', aliases: ['ice tea', 'soğuk çay', 'fuse tea'], defaultUnit: 'gram', caloriesPer100g: 28, proteinPer100g: 0, carbsPer100g: 7, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 kutu', grams: 330 }, { label: '1 bardak', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'cappy-visne', name: 'Cappy Vişne', brand: 'Cappy', aliases: ['cappy', 'vişne suyu'], defaultUnit: 'gram', caloriesPer100g: 50, proteinPer100g: 0.4, carbsPer100g: 12, fatPer100g: 0.1, fiberPer100g: 0.2, servingOptions: [{ label: '1 kutu', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'uludag-gazoz', name: 'Uludağ Gazoz', brand: 'Uludağ', aliases: ['gazoz', 'uludağ'], defaultUnit: 'gram', caloriesPer100g: 40, proteinPer100g: 0, carbsPer100g: 10, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 şişe', grams: 250 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'maden-suyu', name: 'Maden Suyu (Sade)', aliases: ['soda', 'maden sodası'], defaultUnit: 'gram', caloriesPer100g: 0, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 şişe', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'limonata', name: 'Limonata', aliases: ['limonata'], defaultUnit: 'gram', caloriesPer100g: 38, proteinPer100g: 0.1, carbsPer100g: 9.5, fatPer100g: 0, fiberPer100g: 0.1, servingOptions: [{ label: '1 bardak', grams: 250 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'milkshake', name: 'Milkshake (Çikolatalı)', aliases: ['milkshake'], defaultUnit: 'gram', caloriesPer100g: 110, proteinPer100g: 3.5, carbsPer100g: 18, fatPer100g: 3, fiberPer100g: 0.5, servingOptions: [{ label: '1 bardak', grams: 300 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'salgam', name: 'Şalgam Suyu', aliases: ['şalgam'], defaultUnit: 'gram', caloriesPer100g: 5, proteinPer100g: 0.3, carbsPer100g: 1, fatPer100g: 0, fiberPer100g: 0.5, servingOptions: [{ label: '1 bardak', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'boza', name: 'Boza', aliases: ['boza'], defaultUnit: 'gram', caloriesPer100g: 90, proteinPer100g: 1.5, carbsPer100g: 19, fatPer100g: 0.2, fiberPer100g: 0.8, servingOptions: [{ label: '1 bardak', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'latte', name: 'Latte (Sütlü Kahve)', aliases: ['latte', 'sütlü kahve'], defaultUnit: 'gram', caloriesPer100g: 55, proteinPer100g: 3, carbsPer100g: 6, fatPer100g: 2, fiberPer100g: 0, servingOptions: [{ label: '1 bardak', grams: 240 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'cappuccino', name: 'Cappuccino', aliases: ['cappuccino', 'kapuçino'], defaultUnit: 'gram', caloriesPer100g: 40, proteinPer100g: 2.2, carbsPer100g: 4, fatPer100g: 1.6, fiberPer100g: 0, servingOptions: [{ label: '1 fincan', grams: 180 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'cay-sekerli', name: 'Çay (1 Şekerli)', aliases: ['çay', 'şekerli çay'], defaultUnit: 'piece', caloriesPer100g: 16, proteinPer100g: 0, carbsPer100g: 4, fatPer100g: 0, fiberPer100g: 0, pieceWeightGrams: 120, servingOptions: [{ label: '1 bardak', grams: 120 }], category: 'içecek' },
  { id: 'kakaolu-sut', name: 'Kakaolu Süt', aliases: ['çikolatalı süt', 'kakaolu süt'], defaultUnit: 'gram', caloriesPer100g: 84, proteinPer100g: 3.3, carbsPer100g: 13, fatPer100g: 2, fiberPer100g: 0.3, servingOptions: [{ label: '1 kutu', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'süt-ürünü' },

  // ─── Süt Ürünleri & Protein (marka) ─────────────────────────────────────
  { id: 'sutas-yogurt', name: 'Sütaş Yoğurt', brand: 'Sütaş', aliases: ['yoğurt'], defaultUnit: 'gram', caloriesPer100g: 61, proteinPer100g: 3.5, carbsPer100g: 4.7, fatPer100g: 3.3, fiberPer100g: 0, servingOptions: [{ label: '1 kase', grams: 200 }, { label: '1 yemek kaşığı', grams: 25 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },
  { id: 'activia', name: 'Activia Yoğurt', brand: 'Danone', aliases: ['activia'], defaultUnit: 'piece', caloriesPer100g: 75, proteinPer100g: 3.8, carbsPer100g: 12, fatPer100g: 1.8, fiberPer100g: 0.5, pieceWeightGrams: 100, servingOptions: [{ label: '1 kase', grams: 100 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },
  { id: 'icim-protein-sut', name: 'İçim Protein Süt', brand: 'İçim', aliases: ['protein süt'], defaultUnit: 'gram', caloriesPer100g: 60, proteinPer100g: 6.6, carbsPer100g: 6, fatPer100g: 1.5, fiberPer100g: 0, servingOptions: [{ label: '1 şişe', grams: 250 }, { label: '100 ml', grams: 100 }], category: 'süt-ürünü' },
  { id: 'whey-protein', name: 'Whey Protein Tozu', aliases: ['protein tozu', 'whey'], defaultUnit: 'gram', caloriesPer100g: 380, proteinPer100g: 75, carbsPer100g: 8, fatPer100g: 6, fiberPer100g: 1, servingOptions: [{ label: '1 ölçek', grams: 30 }, { label: '100 g', grams: 100 }], category: 'market' },
  { id: 'kaymak', name: 'Kaymak', aliases: ['kaymak'], defaultUnit: 'gram', caloriesPer100g: 330, proteinPer100g: 5, carbsPer100g: 3.5, fatPer100g: 33, fiberPer100g: 0, servingOptions: [{ label: '1 yemek kaşığı', grams: 20 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },

  // ─── Dondurma ───────────────────────────────────────────────────────────
  { id: 'magnum', name: 'Magnum Klasik', brand: 'Magnum', aliases: ['magnum', 'dondurma'], defaultUnit: 'piece', caloriesPer100g: 290, proteinPer100g: 3.5, carbsPer100g: 32, fatPer100g: 16, fiberPer100g: 1, pieceWeightGrams: 79, servingOptions: [{ label: '1 adet', grams: 79 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'cornetto', name: 'Cornetto', brand: 'Algida', aliases: ['cornetto', 'külah dondurma'], defaultUnit: 'piece', caloriesPer100g: 280, proteinPer100g: 3.5, carbsPer100g: 35, fatPer100g: 14, fiberPer100g: 1, pieceWeightGrams: 90, servingOptions: [{ label: '1 adet', grams: 90 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'maras-dondurma', name: 'Maraş Dondurması', aliases: ['maraş dondurması', 'dondurma'], defaultUnit: 'gram', caloriesPer100g: 210, proteinPer100g: 4.5, carbsPer100g: 26, fatPer100g: 9.5, fiberPer100g: 0.5, servingOptions: [{ label: '1 top', grams: 60 }, { label: '1 kase', grams: 120 }, { label: '100 g', grams: 100 }], category: 'tatlı' },

  // ─── Şekerleme & Tatlılar ───────────────────────────────────────────────
  { id: 'haribo', name: 'Haribo Jelibon', brand: 'Haribo', aliases: ['jelibon', 'yumuşak şeker'], defaultUnit: 'gram', caloriesPer100g: 343, proteinPer100g: 6.9, carbsPer100g: 77, fatPer100g: 0.5, fiberPer100g: 0, servingOptions: [{ label: '1 avuç', grams: 25 }, { label: '1 paket', grams: 80 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'lokum', name: 'Lokum', aliases: ['lokum', 'rahat lokum'], defaultUnit: 'piece', caloriesPer100g: 330, proteinPer100g: 0.2, carbsPer100g: 83, fatPer100g: 0.1, fiberPer100g: 0.5, pieceWeightGrams: 15, servingOptions: [{ label: '1 adet', grams: 15 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'tahin-helvasi', name: 'Tahin Helvası', aliases: ['helva'], defaultUnit: 'gram', caloriesPer100g: 516, proteinPer100g: 12, carbsPer100g: 47, fatPer100g: 32, fiberPer100g: 3, servingOptions: [{ label: '1 dilim', grams: 40 }, { label: '1 yemek kaşığı', grams: 20 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'profiterol', name: 'Profiterol', aliases: ['profiterol'], defaultUnit: 'gram', caloriesPer100g: 290, proteinPer100g: 4, carbsPer100g: 30, fatPer100g: 17, fiberPer100g: 0.5, servingOptions: [{ label: '1 porsiyon', grams: 120 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'magnolia', name: 'Magnolia (Muzlu)', aliases: ['magnolia', 'kup tatlı'], defaultUnit: 'gram', caloriesPer100g: 180, proteinPer100g: 2.5, carbsPer100g: 26, fatPer100g: 7, fiberPer100g: 0.6, servingOptions: [{ label: '1 kase', grams: 150 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'recel', name: 'Reçel', aliases: ['reçel', 'marmelat'], defaultUnit: 'gram', caloriesPer100g: 250, proteinPer100g: 0.4, carbsPer100g: 62, fatPer100g: 0.1, fiberPer100g: 0.8, servingOptions: [{ label: '1 yemek kaşığı', grams: 20 }, { label: '100 g', grams: 100 }], category: 'tatlı' },

  // ─── Fırın & Hamur İşi ──────────────────────────────────────────────────
  { id: 'donut', name: 'Donut', aliases: ['donut', 'halka tatlı'], defaultUnit: 'piece', caloriesPer100g: 360, proteinPer100g: 4, carbsPer100g: 45, fatPer100g: 18, fiberPer100g: 1.5, pieceWeightGrams: 60, servingOptions: [{ label: '1 adet', grams: 60 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'muffin', name: 'Muffin', aliases: ['muffin'], defaultUnit: 'piece', caloriesPer100g: 380, proteinPer100g: 5, carbsPer100g: 50, fatPer100g: 18, fiberPer100g: 1, pieceWeightGrams: 70, servingOptions: [{ label: '1 adet', grams: 70 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'kruvasan', name: 'Kruvasan', aliases: ['kruvasan', 'croissant'], defaultUnit: 'piece', caloriesPer100g: 406, proteinPer100g: 8, carbsPer100g: 45, fatPer100g: 21, fiberPer100g: 2.6, pieceWeightGrams: 60, servingOptions: [{ label: '1 adet', grams: 60 }, { label: '100 g', grams: 100 }], category: 'ekmek' },
  { id: 'acma', name: 'Açma', aliases: ['açma'], defaultUnit: 'piece', caloriesPer100g: 330, proteinPer100g: 8, carbsPer100g: 45, fatPer100g: 13, fiberPer100g: 2, pieceWeightGrams: 80, servingOptions: [{ label: '1 adet', grams: 80 }, { label: '100 g', grams: 100 }], category: 'ekmek' },

  // ─── Hazır / Sokak Yemekleri ────────────────────────────────────────────
  { id: 'pizza-karisik', name: 'Pizza (Karışık)', aliases: ['pizza'], defaultUnit: 'gram', caloriesPer100g: 266, proteinPer100g: 11, carbsPer100g: 33, fatPer100g: 10, fiberPer100g: 2.3, servingOptions: [{ label: '1 dilim', grams: 100 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'kasarli-tost', name: 'Kaşarlı Tost', aliases: ['tost'], defaultUnit: 'piece', caloriesPer100g: 290, proteinPer100g: 13, carbsPer100g: 30, fatPer100g: 13, fiberPer100g: 2, pieceWeightGrams: 150, servingOptions: [{ label: '1 adet', grams: 150 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'hamburger', name: 'Hamburger', aliases: ['hamburger', 'burger'], defaultUnit: 'piece', caloriesPer100g: 250, proteinPer100g: 13, carbsPer100g: 22, fatPer100g: 12, fiberPer100g: 1.5, pieceWeightGrams: 180, servingOptions: [{ label: '1 adet', grams: 180 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'sucuk-izgara', name: 'Sucuk (Izgara)', aliases: ['sucuk'], defaultUnit: 'gram', caloriesPer100g: 430, proteinPer100g: 22, carbsPer100g: 2, fatPer100g: 37, fiberPer100g: 0, servingOptions: [{ label: '1 dilim', grams: 15 }, { label: '100 g', grams: 100 }], category: 'şarküteri' },
  { id: 'sucuklu-yumurta', name: 'Sucuklu Yumurta', aliases: ['sucuklu yumurta'], defaultUnit: 'gram', caloriesPer100g: 215, proteinPer100g: 13, carbsPer100g: 2, fatPer100g: 17, fiberPer100g: 0, servingOptions: [{ label: '1 porsiyon', grams: 150 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'kumpir', name: 'Kumpir', aliases: ['kumpir'], defaultUnit: 'gram', caloriesPer100g: 180, proteinPer100g: 4, carbsPer100g: 28, fatPer100g: 6, fiberPer100g: 2.5, servingOptions: [{ label: '1 adet', grams: 350 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },

  // ─── Yemekler & Çorbalar ────────────────────────────────────────────────
  { id: 'karniyarik', name: 'Karnıyarık', aliases: ['karnıyarık'], defaultUnit: 'gram', caloriesPer100g: 130, proteinPer100g: 4.5, carbsPer100g: 9, fatPer100g: 8.5, fiberPer100g: 3, servingOptions: [{ label: '1 adet', grams: 220 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'imam-bayildi', name: 'İmam Bayıldı', aliases: ['imam bayıldı'], defaultUnit: 'gram', caloriesPer100g: 110, proteinPer100g: 1.5, carbsPer100g: 9, fatPer100g: 8, fiberPer100g: 3, servingOptions: [{ label: '1 porsiyon', grams: 200 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'yaprak-sarma', name: 'Yaprak Sarma', aliases: ['sarma', 'dolma'], defaultUnit: 'piece', caloriesPer100g: 170, proteinPer100g: 3, carbsPer100g: 22, fatPer100g: 8, fiberPer100g: 2.5, pieceWeightGrams: 25, servingOptions: [{ label: '1 adet', grams: 25 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'manti', name: 'Mantı', aliases: ['mantı'], defaultUnit: 'gram', caloriesPer100g: 210, proteinPer100g: 8, carbsPer100g: 30, fatPer100g: 6.5, fiberPer100g: 1.5, servingOptions: [{ label: '1 porsiyon', grams: 250 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'kisir', name: 'Kısır', aliases: ['kısır'], defaultUnit: 'gram', caloriesPer100g: 180, proteinPer100g: 4, carbsPer100g: 30, fatPer100g: 5, fiberPer100g: 4, servingOptions: [{ label: '1 porsiyon', grams: 150 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'ezogelin-corba', name: 'Ezogelin Çorbası', aliases: ['ezogelin'], defaultUnit: 'gram', caloriesPer100g: 55, proteinPer100g: 2.5, carbsPer100g: 9, fatPer100g: 1.2, fiberPer100g: 1.2, servingOptions: [{ label: '1 kase', grams: 250 }, { label: '100 ml', grams: 100 }], category: 'çorba' },
  { id: 'tarhana-corba', name: 'Tarhana Çorbası', aliases: ['tarhana'], defaultUnit: 'gram', caloriesPer100g: 50, proteinPer100g: 2, carbsPer100g: 8, fatPer100g: 1, fiberPer100g: 1, servingOptions: [{ label: '1 kase', grams: 250 }, { label: '100 ml', grams: 100 }], category: 'çorba' },
  { id: 'yayla-corba', name: 'Yayla Çorbası', aliases: ['yayla çorbası'], defaultUnit: 'gram', caloriesPer100g: 60, proteinPer100g: 2.5, carbsPer100g: 7, fatPer100g: 2.5, fiberPer100g: 0.5, servingOptions: [{ label: '1 kase', grams: 250 }, { label: '100 ml', grams: 100 }], category: 'çorba' },
  { id: 'domates-corbasi', name: 'Domates Çorbası', aliases: ['domates çorbası'], defaultUnit: 'gram', caloriesPer100g: 48, proteinPer100g: 1.2, carbsPer100g: 7, fatPer100g: 1.8, fiberPer100g: 1, servingOptions: [{ label: '1 kase', grams: 250 }, { label: '100 ml', grams: 100 }], category: 'çorba' },

  // ─── Deniz Ürünleri ─────────────────────────────────────────────────────
  { id: 'karides-izgara', name: 'Karides (Izgara)', aliases: ['karides'], defaultUnit: 'gram', caloriesPer100g: 99, proteinPer100g: 24, carbsPer100g: 0.2, fatPer100g: 1, fiberPer100g: 0, servingOptions: [{ label: '1 porsiyon', grams: 120 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'midye-dolma', name: 'Midye Dolma', aliases: ['midye'], defaultUnit: 'piece', caloriesPer100g: 110, proteinPer100g: 5, carbsPer100g: 15, fatPer100g: 3, fiberPer100g: 0.5, pieceWeightGrams: 20, servingOptions: [{ label: '1 adet', grams: 20 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'kalamar-tava', name: 'Kalamar (Tava)', aliases: ['kalamar'], defaultUnit: 'gram', caloriesPer100g: 175, proteinPer100g: 15, carbsPer100g: 9, fatPer100g: 8, fiberPer100g: 0.4, servingOptions: [{ label: '1 porsiyon', grams: 120 }, { label: '100 g', grams: 100 }], category: 'protein' },

  // ─── Kuruyemiş & Kurutulmuş ─────────────────────────────────────────────
  { id: 'kaju', name: 'Kaju', aliases: ['kaju fıstığı'], defaultUnit: 'gram', caloriesPer100g: 553, proteinPer100g: 18, carbsPer100g: 30, fatPer100g: 44, fiberPer100g: 3.3, servingOptions: [{ label: '1 avuç', grams: 30 }, { label: '100 g', grams: 100 }], category: 'kuruyemiş' },
  { id: 'yer-fistigi', name: 'Yer Fıstığı (Kavrulmuş)', aliases: ['fıstık', 'yer fıstığı'], defaultUnit: 'gram', caloriesPer100g: 567, proteinPer100g: 26, carbsPer100g: 16, fatPer100g: 49, fiberPer100g: 8.5, servingOptions: [{ label: '1 avuç', grams: 30 }, { label: '100 g', grams: 100 }], category: 'kuruyemiş' },
  { id: 'ay-cekirdegi', name: 'Ay Çekirdeği', aliases: ['çekirdek'], defaultUnit: 'gram', caloriesPer100g: 584, proteinPer100g: 21, carbsPer100g: 20, fatPer100g: 51, fiberPer100g: 8.6, servingOptions: [{ label: '1 avuç', grams: 30 }, { label: '100 g', grams: 100 }], category: 'kuruyemiş' },
  { id: 'kabak-cekirdegi', name: 'Kabak Çekirdeği', aliases: ['kabak çekirdeği'], defaultUnit: 'gram', caloriesPer100g: 559, proteinPer100g: 30, carbsPer100g: 11, fatPer100g: 49, fiberPer100g: 6, servingOptions: [{ label: '1 avuç', grams: 30 }, { label: '100 g', grams: 100 }], category: 'kuruyemiş' },
  { id: 'leblebi', name: 'Leblebi', aliases: ['leblebi'], defaultUnit: 'gram', caloriesPer100g: 367, proteinPer100g: 19, carbsPer100g: 58, fatPer100g: 6, fiberPer100g: 11, servingOptions: [{ label: '1 avuç', grams: 30 }, { label: '100 g', grams: 100 }], category: 'kuruyemiş' },
  { id: 'kuru-uzum', name: 'Kuru Üzüm', aliases: ['kuru üzüm'], defaultUnit: 'gram', caloriesPer100g: 299, proteinPer100g: 3.1, carbsPer100g: 79, fatPer100g: 0.5, fiberPer100g: 3.7, servingOptions: [{ label: '1 avuç', grams: 30 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'kuru-kayisi', name: 'Kuru Kayısı', aliases: ['kuru kayısı'], defaultUnit: 'piece', caloriesPer100g: 241, proteinPer100g: 3.4, carbsPer100g: 63, fatPer100g: 0.5, fiberPer100g: 7.3, pieceWeightGrams: 8, servingOptions: [{ label: '1 adet', grams: 8 }, { label: '1 avuç', grams: 40 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'hurma', name: 'Hurma', aliases: ['hurma'], defaultUnit: 'piece', caloriesPer100g: 282, proteinPer100g: 2.5, carbsPer100g: 75, fatPer100g: 0.4, fiberPer100g: 8, pieceWeightGrams: 8, servingOptions: [{ label: '1 adet', grams: 8 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'kuru-incir', name: 'Kuru İncir', aliases: ['kuru incir'], defaultUnit: 'piece', caloriesPer100g: 249, proteinPer100g: 3.3, carbsPer100g: 64, fatPer100g: 0.9, fiberPer100g: 9.8, pieceWeightGrams: 20, servingOptions: [{ label: '1 adet', grams: 20 }, { label: '100 g', grams: 100 }], category: 'meyve' },

  // ─── Ek Meyveler ────────────────────────────────────────────────────────
  { id: 'kivi', name: 'Kivi', aliases: ['kivi'], defaultUnit: 'piece', caloriesPer100g: 61, proteinPer100g: 1.1, carbsPer100g: 15, fatPer100g: 0.5, fiberPer100g: 3, pieceWeightGrams: 75, servingOptions: [{ label: '1 adet', grams: 75 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'ananas', name: 'Ananas', aliases: ['ananas'], defaultUnit: 'gram', caloriesPer100g: 50, proteinPer100g: 0.5, carbsPer100g: 13, fatPer100g: 0.1, fiberPer100g: 1.4, servingOptions: [{ label: '1 dilim', grams: 80 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'mango', name: 'Mango', aliases: ['mango'], defaultUnit: 'piece', caloriesPer100g: 60, proteinPer100g: 0.8, carbsPer100g: 15, fatPer100g: 0.4, fiberPer100g: 1.6, pieceWeightGrams: 200, servingOptions: [{ label: '1 adet', grams: 200 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'seftali', name: 'Şeftali', aliases: ['şeftali'], defaultUnit: 'piece', caloriesPer100g: 39, proteinPer100g: 0.9, carbsPer100g: 10, fatPer100g: 0.3, fiberPer100g: 1.5, pieceWeightGrams: 150, servingOptions: [{ label: '1 adet', grams: 150 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'kayisi', name: 'Kayısı', aliases: ['kayısı'], defaultUnit: 'piece', caloriesPer100g: 48, proteinPer100g: 1.4, carbsPer100g: 11, fatPer100g: 0.4, fiberPer100g: 2, pieceWeightGrams: 35, servingOptions: [{ label: '1 adet', grams: 35 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'erik', name: 'Erik', aliases: ['erik'], defaultUnit: 'piece', caloriesPer100g: 46, proteinPer100g: 0.7, carbsPer100g: 11, fatPer100g: 0.3, fiberPer100g: 1.4, pieceWeightGrams: 65, servingOptions: [{ label: '1 adet', grams: 65 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'nar', name: 'Nar', aliases: ['nar'], defaultUnit: 'gram', caloriesPer100g: 83, proteinPer100g: 1.7, carbsPer100g: 19, fatPer100g: 1.2, fiberPer100g: 4, servingOptions: [{ label: '1 kase tane', grams: 150 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'mandalina', name: 'Mandalina', aliases: ['mandalina'], defaultUnit: 'piece', caloriesPer100g: 53, proteinPer100g: 0.8, carbsPer100g: 13, fatPer100g: 0.3, fiberPer100g: 1.8, pieceWeightGrams: 90, servingOptions: [{ label: '1 adet', grams: 90 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'kiraz', name: 'Kiraz', aliases: ['kiraz'], defaultUnit: 'gram', caloriesPer100g: 63, proteinPer100g: 1.1, carbsPer100g: 16, fatPer100g: 0.2, fiberPer100g: 2.1, servingOptions: [{ label: '1 kase', grams: 150 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'greyfurt', name: 'Greyfurt', aliases: ['greyfurt'], defaultUnit: 'piece', caloriesPer100g: 42, proteinPer100g: 0.8, carbsPer100g: 11, fatPer100g: 0.1, fiberPer100g: 1.6, pieceWeightGrams: 230, servingOptions: [{ label: 'Yarım', grams: 115 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'kavun', name: 'Kavun', aliases: ['kavun'], defaultUnit: 'gram', caloriesPer100g: 34, proteinPer100g: 0.8, carbsPer100g: 8, fatPer100g: 0.2, fiberPer100g: 0.9, servingOptions: [{ label: '1 dilim', grams: 200 }, { label: '100 g', grams: 100 }], category: 'meyve' },

  // ─── Ek Sebzeler ────────────────────────────────────────────────────────
  { id: 'yesil-biber', name: 'Yeşil Biber', aliases: ['biber'], defaultUnit: 'piece', caloriesPer100g: 20, proteinPer100g: 0.9, carbsPer100g: 4.6, fatPer100g: 0.2, fiberPer100g: 1.7, pieceWeightGrams: 50, servingOptions: [{ label: '1 adet', grams: 50 }, { label: '100 g', grams: 100 }], category: 'sebze' },
  { id: 'patlican', name: 'Patlıcan', aliases: ['patlıcan'], defaultUnit: 'piece', caloriesPer100g: 25, proteinPer100g: 1, carbsPer100g: 6, fatPer100g: 0.2, fiberPer100g: 3, pieceWeightGrams: 250, servingOptions: [{ label: '1 adet', grams: 250 }, { label: '100 g', grams: 100 }], category: 'sebze' },
  { id: 'kabak-sebze', name: 'Kabak', aliases: ['kabak'], defaultUnit: 'piece', caloriesPer100g: 17, proteinPer100g: 1.2, carbsPer100g: 3.1, fatPer100g: 0.3, fiberPer100g: 1, pieceWeightGrams: 200, servingOptions: [{ label: '1 adet', grams: 200 }, { label: '100 g', grams: 100 }], category: 'sebze' },
  { id: 'ispanak', name: 'Ispanak', aliases: ['ıspanak'], defaultUnit: 'gram', caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4, fiberPer100g: 2.2, servingOptions: [{ label: '1 porsiyon', grams: 150 }, { label: '100 g', grams: 100 }], category: 'sebze' },
  { id: 'sogan', name: 'Soğan', aliases: ['soğan'], defaultUnit: 'piece', caloriesPer100g: 40, proteinPer100g: 1.1, carbsPer100g: 9.3, fatPer100g: 0.1, fiberPer100g: 1.7, pieceWeightGrams: 110, servingOptions: [{ label: '1 adet', grams: 110 }, { label: '100 g', grams: 100 }], category: 'sebze' },
  { id: 'misir-haslanmis', name: 'Mısır (Haşlanmış)', aliases: ['mısır'], defaultUnit: 'piece', caloriesPer100g: 96, proteinPer100g: 3.4, carbsPer100g: 21, fatPer100g: 1.5, fiberPer100g: 2.4, pieceWeightGrams: 150, servingOptions: [{ label: '1 koçan', grams: 150 }, { label: '100 g', grams: 100 }], category: 'sebze' },
  { id: 'taze-fasulye', name: 'Taze Fasulye', aliases: ['taze fasulye'], defaultUnit: 'gram', caloriesPer100g: 31, proteinPer100g: 1.8, carbsPer100g: 7, fatPer100g: 0.2, fiberPer100g: 3.4, servingOptions: [{ label: '1 porsiyon', grams: 200 }, { label: '100 g', grams: 100 }], category: 'sebze' },
  { id: 'karnabahar', name: 'Karnabahar', aliases: ['karnabahar'], defaultUnit: 'gram', caloriesPer100g: 25, proteinPer100g: 1.9, carbsPer100g: 5, fatPer100g: 0.3, fiberPer100g: 2, servingOptions: [{ label: '1 porsiyon', grams: 150 }, { label: '100 g', grams: 100 }], category: 'sebze' },
  { id: 'mantar', name: 'Mantar', aliases: ['mantar'], defaultUnit: 'gram', caloriesPer100g: 22, proteinPer100g: 3.1, carbsPer100g: 3.3, fatPer100g: 0.3, fiberPer100g: 1, servingOptions: [{ label: '1 porsiyon', grams: 100 }, { label: '100 g', grams: 100 }], category: 'sebze' },
  { id: 'roka', name: 'Roka', aliases: ['roka'], defaultUnit: 'gram', caloriesPer100g: 25, proteinPer100g: 2.6, carbsPer100g: 3.7, fatPer100g: 0.7, fiberPer100g: 1.6, servingOptions: [{ label: '1 demet', grams: 40 }, { label: '100 g', grams: 100 }], category: 'sebze' },
]

// ─── İkinci Geniş Parti — FatSecret tarzı marka & gündelik besinler ─────────
const EXTRA_TURKISH_FOODS_2: TurkishFood[] = [
  // ── Çikolata, Bar, Şekerleme ────────────────────────────────────────────
  { id: 'kitkat', name: 'Kit Kat', brand: 'Nestlé', aliases: ['kitkat'], defaultUnit: 'piece', caloriesPer100g: 518, proteinPer100g: 6.5, carbsPer100g: 59, fatPer100g: 28, fiberPer100g: 1.5, pieceWeightGrams: 41.5, servingOptions: [{ label: '1 paket (4 parmak)', grams: 41.5 }, { label: '1 parmak', grams: 10 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'bounty', name: 'Bounty', brand: 'Mars', aliases: ['bounty'], defaultUnit: 'piece', caloriesPer100g: 473, proteinPer100g: 3.9, carbsPer100g: 58, fatPer100g: 25, fiberPer100g: 2.5, pieceWeightGrams: 57, servingOptions: [{ label: '1 paket', grams: 57 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'toblerone', name: 'Toblerone', brand: 'Toblerone', aliases: ['toblerone'], defaultUnit: 'gram', caloriesPer100g: 535, proteinPer100g: 5.5, carbsPer100g: 59, fatPer100g: 30, fiberPer100g: 2, servingOptions: [{ label: '1 üçgen', grams: 16 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'eti-negro', name: 'Eti Negro', brand: 'Eti', aliases: ['negro'], defaultUnit: 'gram', caloriesPer100g: 480, proteinPer100g: 6, carbsPer100g: 66, fatPer100g: 21, fiberPer100g: 3, servingOptions: [{ label: '1 paket', grams: 100 }, { label: '2 adet', grams: 18 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'eti-gong', name: 'Eti Gong', brand: 'Eti', aliases: ['gong'], defaultUnit: 'piece', caloriesPer100g: 455, proteinPer100g: 5, carbsPer100g: 68, fatPer100g: 18, fiberPer100g: 1.5, pieceWeightGrams: 36, servingOptions: [{ label: '1 adet', grams: 36 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'eti-tutku', name: 'Eti Tutku', brand: 'Eti', aliases: ['tutku'], defaultUnit: 'piece', caloriesPer100g: 500, proteinPer100g: 6, carbsPer100g: 64, fatPer100g: 24, fiberPer100g: 2, pieceWeightGrams: 13, servingOptions: [{ label: '1 adet', grams: 13 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'oreo', name: 'Oreo', brand: 'Oreo', aliases: ['oreo'], defaultUnit: 'piece', caloriesPer100g: 480, proteinPer100g: 5, carbsPer100g: 70, fatPer100g: 20, fiberPer100g: 2.5, pieceWeightGrams: 11, servingOptions: [{ label: '1 adet', grams: 11 }, { label: '3 adet', grams: 33 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'ulker-cikolatali-sandvic', name: 'Ülker Çikolatalı Sandviç Bisküvi', brand: 'Ülker', aliases: ['çikolatalı bisküvi'], defaultUnit: 'piece', caloriesPer100g: 475, proteinPer100g: 6, carbsPer100g: 67, fatPer100g: 20, fiberPer100g: 2, pieceWeightGrams: 12, servingOptions: [{ label: '1 adet', grams: 12 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'lokma', name: 'Lokma Tatlısı', aliases: ['lokma'], defaultUnit: 'piece', caloriesPer100g: 340, proteinPer100g: 4, carbsPer100g: 55, fatPer100g: 12, fiberPer100g: 1, pieceWeightGrams: 15, servingOptions: [{ label: '1 adet', grams: 15 }, { label: '1 porsiyon', grams: 120 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'kunefe', name: 'Künefe', aliases: ['künefe'], defaultUnit: 'gram', caloriesPer100g: 320, proteinPer100g: 7, carbsPer100g: 40, fatPer100g: 15, fiberPer100g: 0.8, servingOptions: [{ label: '1 porsiyon', grams: 180 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'dondurma-vanilya', name: 'Dondurma (Vanilya)', aliases: ['dondurma'], defaultUnit: 'gram', caloriesPer100g: 207, proteinPer100g: 3.5, carbsPer100g: 24, fatPer100g: 11, fiberPer100g: 0.7, servingOptions: [{ label: '1 top', grams: 60 }, { label: '1 kase', grams: 120 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'pekmez', name: 'Üzüm Pekmezi', aliases: ['pekmez'], defaultUnit: 'gram', caloriesPer100g: 293, proteinPer100g: 1.5, carbsPer100g: 70, fatPer100g: 0.2, fiberPer100g: 0, servingOptions: [{ label: '1 yemek kaşığı', grams: 20 }, { label: '100 g', grams: 100 }], category: 'tatlı' },

  // ── Cips & Tuzlu ────────────────────────────────────────────────────────
  { id: 'mister-cips', name: 'Mısır Cipsi (Nachos)', aliases: ['nachos', 'mısır cipsi'], defaultUnit: 'gram', caloriesPer100g: 497, proteinPer100g: 7, carbsPer100g: 62, fatPer100g: 24, fiberPer100g: 5, servingOptions: [{ label: '1 paket', grams: 40 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'misir-patlamis', name: 'Patlamış Mısır', aliases: ['popcorn', 'mısır patlağı'], defaultUnit: 'gram', caloriesPer100g: 387, proteinPer100g: 12, carbsPer100g: 78, fatPer100g: 4.5, fiberPer100g: 15, servingOptions: [{ label: '1 kase', grams: 30 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'galeta', name: 'Galeta / Grissini', aliases: ['grissini', 'galeta'], defaultUnit: 'gram', caloriesPer100g: 410, proteinPer100g: 11, carbsPer100g: 72, fatPer100g: 8, fiberPer100g: 3, servingOptions: [{ label: '1 adet', grams: 7 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },

  // ── İçecekler ───────────────────────────────────────────────────────────
  { id: 'cola-turka', name: 'Cola Turka', brand: 'Cola Turka', aliases: ['kola'], defaultUnit: 'gram', caloriesPer100g: 42, proteinPer100g: 0, carbsPer100g: 10.5, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 kutu', grams: 330 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'schweppes', name: 'Schweppes', brand: 'Schweppes', aliases: ['soda gazlı'], defaultUnit: 'gram', caloriesPer100g: 38, proteinPer100g: 0, carbsPer100g: 9, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 kutu', grams: 250 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'lipton-ice-tea', name: 'Lipton Ice Tea Limon', brand: 'Lipton', aliases: ['ice tea', 'buzlu çay'], defaultUnit: 'gram', caloriesPer100g: 26, proteinPer100g: 0, carbsPer100g: 6.4, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 kutu', grams: 330 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'beypazari-maden', name: 'Beypazarı Maden Suyu', brand: 'Beypazarı', aliases: ['maden suyu', 'soda'], defaultUnit: 'gram', caloriesPer100g: 0, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 şişe', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'su', name: 'Su', aliases: ['water'], defaultUnit: 'gram', caloriesPer100g: 0, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 bardak', grams: 200 }, { label: '1 şişe', grams: 500 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'taze-portakal-suyu', name: 'Taze Sıkılmış Portakal Suyu', aliases: ['portakal suyu'], defaultUnit: 'gram', caloriesPer100g: 45, proteinPer100g: 0.7, carbsPer100g: 10.4, fatPer100g: 0.2, fiberPer100g: 0.2, servingOptions: [{ label: '1 bardak', grams: 250 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'nescafe-3u1', name: 'Nescafé 3ü1 Arada', brand: 'Nescafé', aliases: ['3ü1 arada', 'hazır kahve'], defaultUnit: 'piece', caloriesPer100g: 430, proteinPer100g: 4, carbsPer100g: 75, fatPer100g: 12, fiberPer100g: 0.5, pieceWeightGrams: 17.5, servingOptions: [{ label: '1 paket', grams: 17.5 }], category: 'içecek' },
  { id: 'filtre-kahve', name: 'Filtre Kahve (Sade)', aliases: ['americano', 'filtre kahve'], defaultUnit: 'gram', caloriesPer100g: 2, proteinPer100g: 0.1, carbsPer100g: 0, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 fincan', grams: 240 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'sutas-ayran', name: 'Sütaş Ayran', brand: 'Sütaş', aliases: ['ayran'], defaultUnit: 'gram', caloriesPer100g: 38, proteinPer100g: 1.6, carbsPer100g: 2.7, fatPer100g: 2, fiberPer100g: 0, servingOptions: [{ label: '1 kutu', grams: 200 }, { label: '1 bardak', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'powerade', name: 'Powerade', brand: 'Powerade', aliases: ['sporcu içeceği', 'gatorade'], defaultUnit: 'gram', caloriesPer100g: 26, proteinPer100g: 0, carbsPer100g: 6, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 şişe', grams: 500 }, { label: '100 ml', grams: 100 }], category: 'içecek' },

  // ── Süt Ürünleri & Peynir ───────────────────────────────────────────────
  { id: 'pinar-sut', name: 'Pınar Süt (Tam Yağlı)', brand: 'Pınar', aliases: ['süt'], defaultUnit: 'gram', caloriesPer100g: 62, proteinPer100g: 3.2, carbsPer100g: 4.7, fatPer100g: 3.4, fiberPer100g: 0, servingOptions: [{ label: '1 bardak', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'süt-ürünü' },
  { id: 'kasar-dilim', name: 'Kaşar Peyniri (Dilim)', aliases: ['kaşar', 'tost peyniri'], defaultUnit: 'piece', caloriesPer100g: 350, proteinPer100g: 24, carbsPer100g: 2, fatPer100g: 27, fiberPer100g: 0, pieceWeightGrams: 20, servingOptions: [{ label: '1 dilim', grams: 20 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },
  { id: 'tulum-peyniri', name: 'Tulum Peyniri', aliases: ['tulum'], defaultUnit: 'gram', caloriesPer100g: 365, proteinPer100g: 23, carbsPer100g: 1, fatPer100g: 30, fiberPer100g: 0, servingOptions: [{ label: '1 porsiyon', grams: 40 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },
  { id: 'hellim', name: 'Hellim Peyniri', aliases: ['hellim', 'halloumi'], defaultUnit: 'gram', caloriesPer100g: 321, proteinPer100g: 22, carbsPer100g: 2.2, fatPer100g: 25, fiberPer100g: 0, servingOptions: [{ label: '2 dilim', grams: 50 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },
  { id: 'krem-peynir', name: 'Krem Peynir', aliases: ['krem peynir', 'philadelphia'], defaultUnit: 'gram', caloriesPer100g: 253, proteinPer100g: 6, carbsPer100g: 4, fatPer100g: 24, fiberPer100g: 0, servingOptions: [{ label: '1 yemek kaşığı', grams: 20 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },
  { id: 'cokelek', name: 'Çökelek', aliases: ['çökelek'], defaultUnit: 'gram', caloriesPer100g: 130, proteinPer100g: 18, carbsPer100g: 4, fatPer100g: 4.5, fiberPer100g: 0, servingOptions: [{ label: '1 porsiyon', grams: 60 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },
  { id: 'puding', name: 'Puding (Çikolatalı)', aliases: ['puding'], defaultUnit: 'gram', caloriesPer100g: 120, proteinPer100g: 3, carbsPer100g: 20, fatPer100g: 3, fiberPer100g: 0.5, servingOptions: [{ label: '1 kase', grams: 150 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'cacik', name: 'Cacık', aliases: ['cacık', 'haydari'], defaultUnit: 'gram', caloriesPer100g: 55, proteinPer100g: 3, carbsPer100g: 4, fatPer100g: 3, fiberPer100g: 0.5, servingOptions: [{ label: '1 kase', grams: 200 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },

  // ── Şarküteri, Et, Tavuk ────────────────────────────────────────────────
  { id: 'hindi-jambon', name: 'Hindi Jambon', aliases: ['jambon', 'füme hindi'], defaultUnit: 'piece', caloriesPer100g: 105, proteinPer100g: 18, carbsPer100g: 1.5, fatPer100g: 3, fiberPer100g: 0, pieceWeightGrams: 12, servingOptions: [{ label: '1 dilim', grams: 12 }, { label: '100 g', grams: 100 }], category: 'şarküteri' },
  { id: 'kavurma', name: 'Kavurma', aliases: ['et kavurma'], defaultUnit: 'gram', caloriesPer100g: 280, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 20, fiberPer100g: 0, servingOptions: [{ label: '1 porsiyon', grams: 100 }, { label: '100 g', grams: 100 }], category: 'şarküteri' },
  { id: 'tavuk-nugget', name: 'Tavuk Nugget', aliases: ['nugget'], defaultUnit: 'piece', caloriesPer100g: 270, proteinPer100g: 15, carbsPer100g: 16, fatPer100g: 16, fiberPer100g: 1, pieceWeightGrams: 18, servingOptions: [{ label: '1 adet', grams: 18 }, { label: '6 adet', grams: 108 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'tavuk-sis', name: 'Tavuk Şiş', aliases: ['tavuk şiş'], defaultUnit: 'gram', caloriesPer100g: 175, proteinPer100g: 27, carbsPer100g: 2, fatPer100g: 7, fiberPer100g: 0.3, servingOptions: [{ label: '1 porsiyon', grams: 150 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'adana-kebap', name: 'Adana Kebap', aliases: ['kebap', 'adana'], defaultUnit: 'gram', caloriesPer100g: 290, proteinPer100g: 18, carbsPer100g: 2, fatPer100g: 24, fiberPer100g: 0.3, servingOptions: [{ label: '1 porsiyon', grams: 150 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'tavuk-but-firin', name: 'Tavuk But (Fırın, derisiz)', aliases: ['tavuk but'], defaultUnit: 'gram', caloriesPer100g: 190, proteinPer100g: 25, carbsPer100g: 0, fatPer100g: 10, fiberPer100g: 0, servingOptions: [{ label: '1 but', grams: 120 }, { label: '100 g', grams: 100 }], category: 'protein' },

  // ── Balık & Deniz Ürünleri ──────────────────────────────────────────────
  { id: 'hamsi-tava', name: 'Hamsi (Tava)', aliases: ['hamsi'], defaultUnit: 'gram', caloriesPer100g: 195, proteinPer100g: 20, carbsPer100g: 5, fatPer100g: 10, fiberPer100g: 0.2, servingOptions: [{ label: '1 porsiyon', grams: 150 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'cupra-izgara', name: 'Çupra (Izgara)', aliases: ['çupra', 'çipura'], defaultUnit: 'gram', caloriesPer100g: 128, proteinPer100g: 23, carbsPer100g: 0, fatPer100g: 4, fiberPer100g: 0, servingOptions: [{ label: '1 balık', grams: 200 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'alabalik', name: 'Alabalık (Izgara)', aliases: ['alabalık'], defaultUnit: 'gram', caloriesPer100g: 140, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 6, fiberPer100g: 0, servingOptions: [{ label: '1 balık', grams: 200 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'sardalya', name: 'Sardalya', aliases: ['sardalya'], defaultUnit: 'gram', caloriesPer100g: 208, proteinPer100g: 25, carbsPer100g: 0, fatPer100g: 11, fiberPer100g: 0, servingOptions: [{ label: '1 porsiyon', grams: 120 }, { label: '100 g', grams: 100 }], category: 'protein' },

  // ── Ekmek & Tahıl & Kahvaltılık ─────────────────────────────────────────
  { id: 'cavdar-ekmegi', name: 'Çavdar Ekmeği', aliases: ['çavdar ekmek'], defaultUnit: 'piece', caloriesPer100g: 259, proteinPer100g: 8.5, carbsPer100g: 48, fatPer100g: 3.3, fiberPer100g: 5.8, pieceWeightGrams: 30, servingOptions: [{ label: '1 dilim', grams: 30 }, { label: '100 g', grams: 100 }], category: 'ekmek' },
  { id: 'misir-gevregi', name: 'Mısır Gevreği', aliases: ['cornflakes', 'gevrek'], defaultUnit: 'gram', caloriesPer100g: 357, proteinPer100g: 7, carbsPer100g: 84, fatPer100g: 0.9, fiberPer100g: 3, servingOptions: [{ label: '1 kase', grams: 40 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
  { id: 'musli', name: 'Müsli', aliases: ['müsli'], defaultUnit: 'gram', caloriesPer100g: 367, proteinPer100g: 10, carbsPer100g: 66, fatPer100g: 6, fiberPer100g: 7.5, servingOptions: [{ label: '1 kase', grams: 45 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
  { id: 'eriste', name: 'Erişte (Haşlanmış)', aliases: ['erişte'], defaultUnit: 'gram', caloriesPer100g: 138, proteinPer100g: 5, carbsPer100g: 27, fatPer100g: 1.5, fiberPer100g: 1.5, servingOptions: [{ label: '1 tabak', grams: 200 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
  { id: 'gozleme-peynirli', name: 'Gözleme (Peynirli)', aliases: ['gözleme'], defaultUnit: 'gram', caloriesPer100g: 250, proteinPer100g: 9, carbsPer100g: 33, fatPer100g: 9, fiberPer100g: 1.8, servingOptions: [{ label: '1 adet', grams: 200 }, { label: 'Yarım', grams: 100 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'sigara-boregi', name: 'Sigara Böreği', aliases: ['sigara böreği'], defaultUnit: 'piece', caloriesPer100g: 290, proteinPer100g: 8, carbsPer100g: 30, fatPer100g: 15, fiberPer100g: 1.5, pieceWeightGrams: 30, servingOptions: [{ label: '1 adet', grams: 30 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },

  // ── Türk Yemekleri & Zeytinyağlı & Meze ─────────────────────────────────
  { id: 'cig-kofte', name: 'Çiğ Köfte', aliases: ['çiğ köfte'], defaultUnit: 'gram', caloriesPer100g: 180, proteinPer100g: 5, carbsPer100g: 35, fatPer100g: 3, fiberPer100g: 4, servingOptions: [{ label: '1 porsiyon', grams: 150 }, { label: '1 dürüm', grams: 200 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'icli-kofte', name: 'İçli Köfte', aliases: ['içli köfte'], defaultUnit: 'piece', caloriesPer100g: 235, proteinPer100g: 9, carbsPer100g: 26, fatPer100g: 11, fiberPer100g: 2, pieceWeightGrams: 90, servingOptions: [{ label: '1 adet', grams: 90 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'humus', name: 'Humus', aliases: ['humus'], defaultUnit: 'gram', caloriesPer100g: 177, proteinPer100g: 8, carbsPer100g: 20, fatPer100g: 8, fiberPer100g: 6, servingOptions: [{ label: '1 porsiyon', grams: 100 }, { label: '1 yemek kaşığı', grams: 25 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'zeytinyagli-fasulye', name: 'Zeytinyağlı Taze Fasulye', aliases: ['zeytinyağlı fasulye'], defaultUnit: 'gram', caloriesPer100g: 90, proteinPer100g: 2, carbsPer100g: 9, fatPer100g: 5.5, fiberPer100g: 3.4, servingOptions: [{ label: '1 porsiyon', grams: 200 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'dolma-biber', name: 'Biber Dolması', aliases: ['dolma'], defaultUnit: 'piece', caloriesPer100g: 130, proteinPer100g: 4, carbsPer100g: 16, fatPer100g: 6, fiberPer100g: 2.5, pieceWeightGrams: 120, servingOptions: [{ label: '1 adet', grams: 120 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'pilav-tavuklu', name: 'Tavuklu Pilav', aliases: ['tavuklu pilav'], defaultUnit: 'gram', caloriesPer100g: 165, proteinPer100g: 9, carbsPer100g: 24, fatPer100g: 4, fiberPer100g: 0.6, servingOptions: [{ label: '1 porsiyon', grams: 250 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'izgara-kofte-porsiyon', name: 'Izgara Köfte (Porsiyon)', aliases: ['köfte porsiyon'], defaultUnit: 'gram', caloriesPer100g: 235, proteinPer100g: 17, carbsPer100g: 5, fatPer100g: 16, fiberPer100g: 0.5, servingOptions: [{ label: '1 porsiyon (4-5 adet)', grams: 180 }, { label: '100 g', grams: 100 }], category: 'protein' },

  // ── Kuruyemiş & Tohum ───────────────────────────────────────────────────
  { id: 'chia-tohumu', name: 'Chia Tohumu', aliases: ['chia'], defaultUnit: 'gram', caloriesPer100g: 486, proteinPer100g: 17, carbsPer100g: 42, fatPer100g: 31, fiberPer100g: 34, servingOptions: [{ label: '1 yemek kaşığı', grams: 12 }, { label: '100 g', grams: 100 }], category: 'kuruyemiş' },
  { id: 'keten-tohumu', name: 'Keten Tohumu', aliases: ['keten tohumu'], defaultUnit: 'gram', caloriesPer100g: 534, proteinPer100g: 18, carbsPer100g: 29, fatPer100g: 42, fiberPer100g: 27, servingOptions: [{ label: '1 yemek kaşığı', grams: 10 }, { label: '100 g', grams: 100 }], category: 'kuruyemiş' },
  { id: 'kuru-erik', name: 'Kuru Erik', aliases: ['kuru erik'], defaultUnit: 'piece', caloriesPer100g: 240, proteinPer100g: 2.2, carbsPer100g: 64, fatPer100g: 0.4, fiberPer100g: 7, pieceWeightGrams: 10, servingOptions: [{ label: '1 adet', grams: 10 }, { label: '1 avuç', grams: 40 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'hindistan-cevizi', name: 'Hindistan Cevizi (Rende)', aliases: ['hindistan cevizi'], defaultUnit: 'gram', caloriesPer100g: 354, proteinPer100g: 3.3, carbsPer100g: 15, fatPer100g: 33, fiberPer100g: 9, servingOptions: [{ label: '1 yemek kaşığı', grams: 8 }, { label: '100 g', grams: 100 }], category: 'kuruyemiş' },

  // ── Meyveler ────────────────────────────────────────────────────────────
  { id: 'taze-incir', name: 'Taze İncir', aliases: ['incir'], defaultUnit: 'piece', caloriesPer100g: 74, proteinPer100g: 0.8, carbsPer100g: 19, fatPer100g: 0.3, fiberPer100g: 2.9, pieceWeightGrams: 50, servingOptions: [{ label: '1 adet', grams: 50 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'bogurtlen', name: 'Böğürtlen', aliases: ['böğürtlen'], defaultUnit: 'gram', caloriesPer100g: 43, proteinPer100g: 1.4, carbsPer100g: 10, fatPer100g: 0.5, fiberPer100g: 5.3, servingOptions: [{ label: '1 kase', grams: 120 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'ahududu', name: 'Ahududu', aliases: ['ahududu', 'raspberry'], defaultUnit: 'gram', caloriesPer100g: 52, proteinPer100g: 1.2, carbsPer100g: 12, fatPer100g: 0.7, fiberPer100g: 6.5, servingOptions: [{ label: '1 kase', grams: 120 }, { label: '100 g', grams: 100 }], category: 'meyve' },
  { id: 'ananas-dilim', name: 'Vişne', aliases: ['vişne'], defaultUnit: 'gram', caloriesPer100g: 50, proteinPer100g: 1, carbsPer100g: 12, fatPer100g: 0.3, fiberPer100g: 1.6, servingOptions: [{ label: '1 kase', grams: 150 }, { label: '100 g', grams: 100 }], category: 'meyve' },

  // ── Sebzeler ────────────────────────────────────────────────────────────
  { id: 'salatalik-tek', name: 'Salatalık', aliases: ['hıyar'], defaultUnit: 'piece', caloriesPer100g: 15, proteinPer100g: 0.7, carbsPer100g: 3.6, fatPer100g: 0.1, fiberPer100g: 0.5, pieceWeightGrams: 120, servingOptions: [{ label: '1 adet', grams: 120 }, { label: '100 g', grams: 100 }], category: 'sebze' },
  { id: 'pancar', name: 'Pancar', aliases: ['pancar'], defaultUnit: 'gram', caloriesPer100g: 43, proteinPer100g: 1.6, carbsPer100g: 10, fatPer100g: 0.2, fiberPer100g: 2.8, servingOptions: [{ label: '1 porsiyon', grams: 100 }, { label: '100 g', grams: 100 }], category: 'sebze' },
  { id: 'bamya', name: 'Bamya', aliases: ['bamya'], defaultUnit: 'gram', caloriesPer100g: 33, proteinPer100g: 1.9, carbsPer100g: 7, fatPer100g: 0.2, fiberPer100g: 3.2, servingOptions: [{ label: '1 porsiyon', grams: 150 }, { label: '100 g', grams: 100 }], category: 'sebze' },
  { id: 'kereviz', name: 'Kereviz', aliases: ['kereviz'], defaultUnit: 'gram', caloriesPer100g: 42, proteinPer100g: 1.5, carbsPer100g: 9, fatPer100g: 0.3, fiberPer100g: 1.8, servingOptions: [{ label: '1 porsiyon', grams: 150 }, { label: '100 g', grams: 100 }], category: 'sebze' },

  // ── Fitness & Takviye ───────────────────────────────────────────────────
  { id: 'kazein-protein', name: 'Kazein Protein Tozu', aliases: ['kazein', 'casein'], defaultUnit: 'gram', caloriesPer100g: 360, proteinPer100g: 78, carbsPer100g: 6, fatPer100g: 3, fiberPer100g: 1, servingOptions: [{ label: '1 ölçek', grams: 30 }, { label: '100 g', grams: 100 }], category: 'market' },
  { id: 'protein-puding', name: 'Protein Puding', aliases: ['protein puding'], defaultUnit: 'gram', caloriesPer100g: 90, proteinPer100g: 10, carbsPer100g: 8, fatPer100g: 2, fiberPer100g: 0.5, servingOptions: [{ label: '1 kase', grams: 200 }, { label: '100 g', grams: 100 }], category: 'market' },
  { id: 'fellas-protein-bar', name: 'Fellas Protein Bar', brand: 'Fellas', aliases: ['protein bar'], defaultUnit: 'piece', caloriesPer100g: 360, proteinPer100g: 33, carbsPer100g: 36, fatPer100g: 9, fiberPer100g: 6, pieceWeightGrams: 60, servingOptions: [{ label: '1 bar', grams: 60 }, { label: '100 g', grams: 100 }], category: 'market' },
]

// ─── Gündelik Market & Mutfak Hazinesi ─────────────────────────────────────
// FatSecret tarzı hızlı gram girişi için; marka/ürün etiketleri değişebileceği
// için değerler makul ortalama kabul edilmelidir.
const BROAD_MARKET_FOODS: TurkishFood[] = [
  // ── Ekmek, fırın ve kahvaltılık tahıllar ───────────────────────────────
  { id: 'kepek-ekmegi', name: 'Kepek Ekmeği', aliases: ['kepekli ekmek'], defaultUnit: 'piece', caloriesPer100g: 250, proteinPer100g: 9, carbsPer100g: 45, fatPer100g: 3.5, fiberPer100g: 7, pieceWeightGrams: 30, servingOptions: [{ label: '1 dilim', grams: 30 }, { label: '100 g', grams: 100 }], category: 'ekmek' },
  { id: 'eksi-maya-ekmegi', name: 'Ekşi Mayalı Ekmek', aliases: ['ekşi maya ekmek', 'sourdough'], defaultUnit: 'piece', caloriesPer100g: 255, proteinPer100g: 8.5, carbsPer100g: 49, fatPer100g: 2.5, fiberPer100g: 3.5, pieceWeightGrams: 35, servingOptions: [{ label: '1 dilim', grams: 35 }, { label: '100 g', grams: 100 }], category: 'ekmek' },
  { id: 'tost-ekmegi', name: 'Tost Ekmeği', aliases: ['paket tost ekmeği', 'sandviç ekmeği'], defaultUnit: 'piece', caloriesPer100g: 275, proteinPer100g: 9, carbsPer100g: 50, fatPer100g: 4.5, fiberPer100g: 3, pieceWeightGrams: 25, servingOptions: [{ label: '1 dilim', grams: 25 }, { label: '2 dilim', grams: 50 }, { label: '100 g', grams: 100 }], category: 'ekmek' },
  { id: 'hamburger-ekmegi', name: 'Hamburger Ekmeği', aliases: ['burger ekmeği'], defaultUnit: 'piece', caloriesPer100g: 285, proteinPer100g: 9, carbsPer100g: 52, fatPer100g: 4.5, fiberPer100g: 2.5, pieceWeightGrams: 70, servingOptions: [{ label: '1 adet', grams: 70 }, { label: '100 g', grams: 100 }], category: 'ekmek' },
  { id: 'sandvic-ekmegi', name: 'Sandviç Ekmeği', aliases: ['sandviç ekmeği', 'baget sandviç'], defaultUnit: 'piece', caloriesPer100g: 270, proteinPer100g: 9, carbsPer100g: 51, fatPer100g: 3.5, fiberPer100g: 2.8, pieceWeightGrams: 80, servingOptions: [{ label: '1 adet', grams: 80 }, { label: '100 g', grams: 100 }], category: 'ekmek' },
  { id: 'bazlama', name: 'Bazlama', aliases: ['bazlama ekmeği'], defaultUnit: 'piece', caloriesPer100g: 290, proteinPer100g: 8.5, carbsPer100g: 56, fatPer100g: 3.8, fiberPer100g: 2.8, pieceWeightGrams: 120, servingOptions: [{ label: '1 adet', grams: 120 }, { label: 'Yarım', grams: 60 }, { label: '100 g', grams: 100 }], category: 'ekmek' },
  { id: 'tirnak-pide', name: 'Tırnak Pide', aliases: ['pide ekmek', 'ramazan pidesi'], defaultUnit: 'piece', caloriesPer100g: 280, proteinPer100g: 8.5, carbsPer100g: 54, fatPer100g: 3.2, fiberPer100g: 2.5, pieceWeightGrams: 120, servingOptions: [{ label: '1 küçük', grams: 120 }, { label: '100 g', grams: 100 }], category: 'ekmek' },
  { id: 'yufka', name: 'Yufka', aliases: ['böreklik yufka'], defaultUnit: 'piece', caloriesPer100g: 315, proteinPer100g: 9, carbsPer100g: 60, fatPer100g: 4, fiberPer100g: 2.5, pieceWeightGrams: 65, servingOptions: [{ label: '1 adet', grams: 65 }, { label: '100 g', grams: 100 }], category: 'ekmek' },
  { id: 'glutensiz-ekmek', name: 'Glutensiz Ekmek', aliases: ['glutensiz ekmek'], defaultUnit: 'piece', caloriesPer100g: 245, proteinPer100g: 4.5, carbsPer100g: 50, fatPer100g: 4, fiberPer100g: 5, pieceWeightGrams: 30, servingOptions: [{ label: '1 dilim', grams: 30 }, { label: '100 g', grams: 100 }], category: 'ekmek' },
  { id: 'galeta-ekmek-cubugu', name: 'Galeta', aliases: ['grissini', 'ekmek çubuğu'], defaultUnit: 'piece', caloriesPer100g: 390, proteinPer100g: 12, carbsPer100g: 70, fatPer100g: 7, fiberPer100g: 4, pieceWeightGrams: 10, servingOptions: [{ label: '1 adet', grams: 10 }, { label: '1 paket', grams: 40 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'pirinc-patlagi', name: 'Pirinç Patlağı', aliases: ['rice cake', 'pirinç keki'], defaultUnit: 'piece', caloriesPer100g: 385, proteinPer100g: 8, carbsPer100g: 82, fatPer100g: 3, fiberPer100g: 3.5, pieceWeightGrams: 10, servingOptions: [{ label: '1 adet', grams: 10 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
  { id: 'nesquik-gevrek', name: 'Nestle Nesquik Gevrek', brand: 'Nestle', aliases: ['nesquik', 'kakaolu gevrek'], defaultUnit: 'gram', caloriesPer100g: 380, proteinPer100g: 7, carbsPer100g: 79, fatPer100g: 3, fiberPer100g: 5, servingOptions: [{ label: '1 kase', grams: 40 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
  { id: 'kelloggs-corn-flakes', name: "Kellogg's Corn Flakes", brand: "Kellogg's", aliases: ['corn flakes', 'mısır gevreği'], defaultUnit: 'gram', caloriesPer100g: 370, proteinPer100g: 7, carbsPer100g: 84, fatPer100g: 0.8, fiberPer100g: 3, servingOptions: [{ label: '1 kase', grams: 40 }, { label: '100 g', grams: 100 }], category: 'tahıl' },

  // ── Kuru gıda, makarna, pilav ve bakliyat ──────────────────────────────
  { id: 'pirinc-cig', name: 'Pirinç (Çiğ)', aliases: ['baldo pirinç', 'osmancık pirinç'], defaultUnit: 'gram', caloriesPer100g: 365, proteinPer100g: 7.1, carbsPer100g: 80, fatPer100g: 0.7, fiberPer100g: 1.3, servingOptions: [{ label: '1 yemek kaşığı', grams: 15 }, { label: '1 su bardağı', grams: 180 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
  { id: 'basmati-pilavi', name: 'Basmati Pilavı', aliases: ['basmati pirinç', 'basmati pilav'], defaultUnit: 'gram', caloriesPer100g: 121, proteinPer100g: 2.7, carbsPer100g: 25.2, fatPer100g: 0.4, fiberPer100g: 0.7, servingOptions: [{ label: '1 porsiyon', grams: 200 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
  { id: 'sehriyeli-pilav', name: 'Şehriyeli Pirinç Pilavı', aliases: ['şehriyeli pilav'], defaultUnit: 'gram', caloriesPer100g: 145, proteinPer100g: 2.8, carbsPer100g: 28, fatPer100g: 2.5, fiberPer100g: 0.5, servingOptions: [{ label: '1 porsiyon', grams: 200 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
  { id: 'bulgur-cig', name: 'Bulgur (Çiğ)', aliases: ['pilavlık bulgur', 'köftelik bulgur'], defaultUnit: 'gram', caloriesPer100g: 342, proteinPer100g: 12.3, carbsPer100g: 76, fatPer100g: 1.3, fiberPer100g: 12.5, servingOptions: [{ label: '1 yemek kaşığı', grams: 12 }, { label: '1 su bardağı', grams: 160 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
  { id: 'kuskus-haslanmis', name: 'Kuskus (Haşlanmış)', aliases: ['kuskus'], defaultUnit: 'gram', caloriesPer100g: 112, proteinPer100g: 3.8, carbsPer100g: 23, fatPer100g: 0.2, fiberPer100g: 1.4, servingOptions: [{ label: '1 tabak', grams: 200 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
  { id: 'noodle-hazir', name: 'Hazır Noodle', aliases: ['noodle', 'indomie', 'nissin'], defaultUnit: 'piece', caloriesPer100g: 440, proteinPer100g: 9, carbsPer100g: 60, fatPer100g: 18, fiberPer100g: 3, pieceWeightGrams: 75, servingOptions: [{ label: '1 paket', grams: 75 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'un-beyaz', name: 'Beyaz Un', aliases: ['un'], defaultUnit: 'gram', caloriesPer100g: 364, proteinPer100g: 10, carbsPer100g: 76, fatPer100g: 1, fiberPer100g: 2.7, servingOptions: [{ label: '1 yemek kaşığı', grams: 10 }, { label: '1 su bardağı', grams: 120 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
  { id: 'irmik', name: 'İrmik', aliases: ['irmik'], defaultUnit: 'gram', caloriesPer100g: 360, proteinPer100g: 12, carbsPer100g: 73, fatPer100g: 1, fiberPer100g: 4, servingOptions: [{ label: '1 yemek kaşığı', grams: 12 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
  { id: 'barbunya-pilaki', name: 'Barbunya Pilaki', aliases: ['barbunya', 'konserve barbunya'], defaultUnit: 'gram', caloriesPer100g: 126, proteinPer100g: 6, carbsPer100g: 18, fatPer100g: 3, fiberPer100g: 6, servingOptions: [{ label: '1 porsiyon', grams: 200 }, { label: '100 g', grams: 100 }], category: 'bakliyat' },
  { id: 'konserve-misir', name: 'Konserve Mısır', aliases: ['mısır konservesi', 'tatlı mısır'], defaultUnit: 'gram', caloriesPer100g: 96, proteinPer100g: 3.4, carbsPer100g: 21, fatPer100g: 1.5, fiberPer100g: 2.4, servingOptions: [{ label: '1 yemek kaşığı', grams: 15 }, { label: '1 küçük kutu', grams: 150 }, { label: '100 g', grams: 100 }], category: 'sebze' },
  { id: 'konserve-bezelye', name: 'Konserve Bezelye', aliases: ['bezelye konservesi'], defaultUnit: 'gram', caloriesPer100g: 70, proteinPer100g: 4.5, carbsPer100g: 12, fatPer100g: 0.4, fiberPer100g: 4.5, servingOptions: [{ label: '1 porsiyon', grams: 150 }, { label: '100 g', grams: 100 }], category: 'sebze' },

  // ── Süt ürünleri, peynir, yumurta rafı ─────────────────────────────────
  { id: 'pinar-sut-ortalama', name: 'Pınar Süt', brand: 'Pınar', aliases: ['pınar süt', 'süt'], defaultUnit: 'gram', caloriesPer100g: 61, proteinPer100g: 3.2, carbsPer100g: 4.7, fatPer100g: 3.3, fiberPer100g: 0, servingOptions: [{ label: '1 bardak', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'süt-ürünü' },
  { id: 'sek-sut', name: 'Sek Süt', brand: 'Sek', aliases: ['sek süt', 'süt'], defaultUnit: 'gram', caloriesPer100g: 61, proteinPer100g: 3.2, carbsPer100g: 4.7, fatPer100g: 3.3, fiberPer100g: 0, servingOptions: [{ label: '1 bardak', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'süt-ürünü' },
  { id: 'torku-sut', name: 'Torku Süt', brand: 'Torku', aliases: ['torku süt', 'süt'], defaultUnit: 'gram', caloriesPer100g: 61, proteinPer100g: 3.2, carbsPer100g: 4.7, fatPer100g: 3.3, fiberPer100g: 0, servingOptions: [{ label: '1 bardak', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'süt-ürünü' },
  { id: 'laktozsuz-sut', name: 'Laktozsuz Süt', aliases: ['laktozsuz süt', 'içim laktozsuz', 'sütaş laktozsuz'], defaultUnit: 'gram', caloriesPer100g: 46, proteinPer100g: 3.2, carbsPer100g: 4.8, fatPer100g: 1.5, fiberPer100g: 0, servingOptions: [{ label: '1 bardak', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'süt-ürünü' },
  { id: 'light-yogurt', name: 'Light Yoğurt', aliases: ['yağsız yoğurt', 'diyet yoğurt'], defaultUnit: 'gram', caloriesPer100g: 45, proteinPer100g: 4.5, carbsPer100g: 5, fatPer100g: 0.5, fiberPer100g: 0, servingOptions: [{ label: '1 kase', grams: 200 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },
  { id: 'greek-yogurt', name: 'Greek Yoğurt', aliases: ['greek yogurt', 'yoğun yoğurt'], defaultUnit: 'gram', caloriesPer100g: 95, proteinPer100g: 9, carbsPer100g: 4, fatPer100g: 5, fiberPer100g: 0, servingOptions: [{ label: '1 kase', grams: 150 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },
  { id: 'skyr', name: 'Skyr Yoğurt', aliases: ['skyr', 'yüksek protein yoğurt'], defaultUnit: 'gram', caloriesPer100g: 65, proteinPer100g: 11, carbsPer100g: 4, fatPer100g: 0.2, fiberPer100g: 0, servingOptions: [{ label: '1 kase', grams: 150 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },
  { id: 'dil-peyniri', name: 'Dil Peyniri', aliases: ['dil peyniri'], defaultUnit: 'gram', caloriesPer100g: 320, proteinPer100g: 24, carbsPer100g: 2, fatPer100g: 24, fiberPer100g: 0, servingOptions: [{ label: '1 dilim', grams: 30 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },
  { id: 'tulum-peyniri-dilim', name: 'Tulum Peyniri', aliases: ['tulum'], defaultUnit: 'gram', caloriesPer100g: 355, proteinPer100g: 22, carbsPer100g: 2, fatPer100g: 29, fiberPer100g: 0, servingOptions: [{ label: '1 dilim', grams: 30 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },
  { id: 'mozzarella', name: 'Mozzarella Peyniri', aliases: ['mozzarella'], defaultUnit: 'gram', caloriesPer100g: 280, proteinPer100g: 22, carbsPer100g: 3, fatPer100g: 20, fiberPer100g: 0, servingOptions: [{ label: '1 dilim', grams: 25 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },
  { id: 'cheddar-peynir', name: 'Cheddar Peyniri', aliases: ['cheddar'], defaultUnit: 'gram', caloriesPer100g: 403, proteinPer100g: 25, carbsPer100g: 1.3, fatPer100g: 33, fiberPer100g: 0, servingOptions: [{ label: '1 dilim', grams: 20 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },
  { id: 'krem-peynir-surulebilir', name: 'Krem Peynir', aliases: ['krem peynir', 'sürülebilir peynir'], defaultUnit: 'gram', caloriesPer100g: 255, proteinPer100g: 6, carbsPer100g: 4, fatPer100g: 24, fiberPer100g: 0, servingOptions: [{ label: '1 yemek kaşığı', grams: 20 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },
  { id: 'tereyagi-kasik', name: 'Tereyağı', aliases: ['tereyağı', 'butter'], defaultUnit: 'gram', caloriesPer100g: 717, proteinPer100g: 0.9, carbsPer100g: 0.1, fatPer100g: 81, fiberPer100g: 0, servingOptions: [{ label: '1 tatlı kaşığı', grams: 10 }, { label: '1 yemek kaşığı', grams: 14 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },

  // ── Et, şarküteri ve donuk/pratik proteinler ──────────────────────────
  { id: 'tavuk-kanat', name: 'Tavuk Kanat', aliases: ['kanat', 'tavuk kanadı'], defaultUnit: 'piece', caloriesPer100g: 203, proteinPer100g: 30, carbsPer100g: 0, fatPer100g: 8, fiberPer100g: 0, pieceWeightGrams: 45, servingOptions: [{ label: '1 adet', grams: 45 }, { label: '1 porsiyon', grams: 180 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'tavuk-baget', name: 'Tavuk Baget', aliases: ['baget', 'tavuk budu'], defaultUnit: 'piece', caloriesPer100g: 190, proteinPer100g: 27, carbsPer100g: 0, fatPer100g: 9, fiberPer100g: 0, pieceWeightGrams: 100, servingOptions: [{ label: '1 adet', grams: 100 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'dana-antrikot', name: 'Dana Antrikot', aliases: ['antrikot'], defaultUnit: 'gram', caloriesPer100g: 271, proteinPer100g: 24, carbsPer100g: 0, fatPer100g: 19, fiberPer100g: 0, servingOptions: [{ label: '1 porsiyon', grams: 180 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'kuzu-pirzola', name: 'Kuzu Pirzola', aliases: ['pirzola'], defaultUnit: 'gram', caloriesPer100g: 294, proteinPer100g: 25, carbsPer100g: 0, fatPer100g: 21, fiberPer100g: 0, servingOptions: [{ label: '1 adet', grams: 70 }, { label: '1 porsiyon', grams: 180 }, { label: '100 g', grams: 100 }], category: 'protein' },
  { id: 'pastirma-dilim', name: 'Pastırma', aliases: ['pastırma'], defaultUnit: 'gram', caloriesPer100g: 250, proteinPer100g: 29, carbsPer100g: 3, fatPer100g: 13, fiberPer100g: 0, servingOptions: [{ label: '1 dilim', grams: 10 }, { label: '100 g', grams: 100 }], category: 'şarküteri' },
  { id: 'füme-hindi', name: 'Füme Hindi', aliases: ['hindi füme', 'hindi salam'], defaultUnit: 'gram', caloriesPer100g: 105, proteinPer100g: 19, carbsPer100g: 2, fatPer100g: 2, fiberPer100g: 0, servingOptions: [{ label: '1 dilim', grams: 15 }, { label: '1 paket', grams: 60 }, { label: '100 g', grams: 100 }], category: 'şarküteri' },
  { id: 'sosis-adet', name: 'Sosis', aliases: ['sosis'], defaultUnit: 'piece', caloriesPer100g: 280, proteinPer100g: 12, carbsPer100g: 3, fatPer100g: 24, fiberPer100g: 0, pieceWeightGrams: 45, servingOptions: [{ label: '1 adet', grams: 45 }, { label: '100 g', grams: 100 }], category: 'şarküteri' },
  { id: 'tavuk-nugget-market', name: 'Tavuk Nugget', aliases: ['nugget', 'banvit nugget', 'piliç nugget'], defaultUnit: 'piece', caloriesPer100g: 275, proteinPer100g: 14, carbsPer100g: 19, fatPer100g: 16, fiberPer100g: 1, pieceWeightGrams: 20, servingOptions: [{ label: '1 adet', grams: 20 }, { label: '6 adet', grams: 120 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'tavuk-schnitzel', name: 'Tavuk Şinitzel', aliases: ['şinitzel', 'schnitzel'], defaultUnit: 'piece', caloriesPer100g: 260, proteinPer100g: 17, carbsPer100g: 18, fatPer100g: 14, fiberPer100g: 1, pieceWeightGrams: 120, servingOptions: [{ label: '1 adet', grams: 120 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'balik-parmak', name: 'Balık Kroket', aliases: ['fish finger', 'balık parmak', 'balık kroket'], defaultUnit: 'piece', caloriesPer100g: 235, proteinPer100g: 12, carbsPer100g: 21, fatPer100g: 12, fiberPer100g: 1, pieceWeightGrams: 28, servingOptions: [{ label: '1 adet', grams: 28 }, { label: '5 adet', grams: 140 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },

  // ── Paketli atıştırmalık ve market markaları ──────────────────────────
  { id: 'eti-wanted', name: 'Eti Wanted', brand: 'Eti', aliases: ['wanted çikolata'], defaultUnit: 'piece', caloriesPer100g: 500, proteinPer100g: 6, carbsPer100g: 61, fatPer100g: 26, fiberPer100g: 2, pieceWeightGrams: 32, servingOptions: [{ label: '1 adet', grams: 32 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'eti-cin-paket', name: 'Eti Cin', brand: 'Eti', aliases: ['cin bisküvi'], defaultUnit: 'piece', caloriesPer100g: 405, proteinPer100g: 5, carbsPer100g: 77, fatPer100g: 8, fiberPer100g: 2, pieceWeightGrams: 10, servingOptions: [{ label: '1 adet', grams: 10 }, { label: '1 paket', grams: 100 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'eti-negro-paket', name: 'Eti Negro', brand: 'Eti', aliases: ['negro bisküvi', 'kakaolu bisküvi'], defaultUnit: 'gram', caloriesPer100g: 470, proteinPer100g: 6, carbsPer100g: 69, fatPer100g: 18, fiberPer100g: 4, servingOptions: [{ label: '1 paket', grams: 100 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'ulker-probis', name: 'Ülker Probis', brand: 'Ülker', aliases: ['probis', 'proteinli bisküvi'], defaultUnit: 'piece', caloriesPer100g: 445, proteinPer100g: 9, carbsPer100g: 63, fatPer100g: 17, fiberPer100g: 3, pieceWeightGrams: 28, servingOptions: [{ label: '1 adet', grams: 28 }, { label: '1 paket', grams: 75 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'ulker-ikram', name: 'Ülker İkram', brand: 'Ülker', aliases: ['ikram bisküvi'], defaultUnit: 'gram', caloriesPer100g: 485, proteinPer100g: 6, carbsPer100g: 66, fatPer100g: 21, fiberPer100g: 2.5, servingOptions: [{ label: '1 paket', grams: 84 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'ulker-hosbes', name: 'Ülker Hoşbeş', brand: 'Ülker', aliases: ['hoşbeş', 'gofret'], defaultUnit: 'gram', caloriesPer100g: 515, proteinPer100g: 6, carbsPer100g: 63, fatPer100g: 27, fiberPer100g: 2, servingOptions: [{ label: '1 paket', grams: 40 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'eti-tutku-paket', name: 'Eti Tutku', brand: 'Eti', aliases: ['tutku bisküvi'], defaultUnit: 'gram', caloriesPer100g: 465, proteinPer100g: 6, carbsPer100g: 68, fatPer100g: 18, fiberPer100g: 2.5, servingOptions: [{ label: '1 paket', grams: 100 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'torku-banada', name: 'Torku Banada', brand: 'Torku', aliases: ['banada', 'çikolata kreması'], defaultUnit: 'gram', caloriesPer100g: 540, proteinPer100g: 6, carbsPer100g: 58, fatPer100g: 31, fiberPer100g: 2, servingOptions: [{ label: '1 yemek kaşığı', grams: 15 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'sarelle', name: 'Sarelle', brand: 'Sarelle', aliases: ['sarelle', 'fındık kreması'], defaultUnit: 'gram', caloriesPer100g: 545, proteinPer100g: 7, carbsPer100g: 55, fatPer100g: 32, fiberPer100g: 2, servingOptions: [{ label: '1 yemek kaşığı', grams: 15 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'tadim-karisik-kuruyemis', name: 'Tadım Karışık Kuruyemiş', brand: 'Tadım', aliases: ['karışık kuruyemiş', 'tadım'], defaultUnit: 'gram', caloriesPer100g: 590, proteinPer100g: 18, carbsPer100g: 20, fatPer100g: 50, fiberPer100g: 8, servingOptions: [{ label: '1 avuç', grams: 30 }, { label: '1 paket', grams: 75 }, { label: '100 g', grams: 100 }], category: 'kuruyemiş' },
  { id: 'popcorn', name: 'Patlamış Mısır', aliases: ['popcorn', 'mikrodalga mısır'], defaultUnit: 'gram', caloriesPer100g: 387, proteinPer100g: 13, carbsPer100g: 78, fatPer100g: 5, fiberPer100g: 15, servingOptions: [{ label: '1 kase', grams: 25 }, { label: '1 paket', grams: 80 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },

  // ── İçecek, sos, yağ ve sürülebilirler ─────────────────────────────────
  { id: 'redbull-sekersiz', name: 'Red Bull Şekersiz', brand: 'Red Bull', aliases: ['red bull sugarfree', 'şekersiz enerji içeceği'], defaultUnit: 'gram', caloriesPer100g: 3, proteinPer100g: 0, carbsPer100g: 0.4, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 kutu', grams: 250 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'ayran-sise', name: 'Ayran (Şişe)', aliases: ['sütaş ayran', 'içim ayran', 'pınar ayran', 'ayran'], defaultUnit: 'gram', caloriesPer100g: 37, proteinPer100g: 1.8, carbsPer100g: 2.6, fatPer100g: 1.5, fiberPer100g: 0, servingOptions: [{ label: '1 küçük', grams: 200 }, { label: '1 büyük', grams: 300 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'meyveli-kefir', name: 'Meyveli Kefir', aliases: ['çilekli kefir', 'orman meyveli kefir'], defaultUnit: 'gram', caloriesPer100g: 70, proteinPer100g: 3, carbsPer100g: 10, fatPer100g: 1.8, fiberPer100g: 0, servingOptions: [{ label: '1 şişe', grams: 250 }, { label: '100 ml', grams: 100 }], category: 'süt-ürünü' },
  { id: 'hazir-soguk-kahve', name: 'Hazır Soğuk Kahve', aliases: ['starbucks frappuccino', 'ice coffee', 'soğuk kahve'], defaultUnit: 'gram', caloriesPer100g: 68, proteinPer100g: 2.5, carbsPer100g: 11, fatPer100g: 1.8, fiberPer100g: 0, servingOptions: [{ label: '1 şişe', grams: 250 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'ketcap', name: 'Ketçap', aliases: ['ketchup'], defaultUnit: 'gram', caloriesPer100g: 112, proteinPer100g: 1.3, carbsPer100g: 26, fatPer100g: 0.2, fiberPer100g: 0.3, servingOptions: [{ label: '1 yemek kaşığı', grams: 15 }, { label: '100 g', grams: 100 }], category: 'diğer' },
  { id: 'mayonez', name: 'Mayonez', aliases: ['mayonez'], defaultUnit: 'gram', caloriesPer100g: 680, proteinPer100g: 1, carbsPer100g: 1, fatPer100g: 75, fiberPer100g: 0, servingOptions: [{ label: '1 yemek kaşığı', grams: 15 }, { label: '100 g', grams: 100 }], category: 'diğer' },
  { id: 'hardal', name: 'Hardal', aliases: ['mustard'], defaultUnit: 'gram', caloriesPer100g: 66, proteinPer100g: 4, carbsPer100g: 6, fatPer100g: 3.3, fiberPer100g: 3, servingOptions: [{ label: '1 tatlı kaşığı', grams: 10 }, { label: '100 g', grams: 100 }], category: 'diğer' },
  { id: 'barbeku-sos', name: 'Barbekü Sos', aliases: ['bbq sos', 'barbecue'], defaultUnit: 'gram', caloriesPer100g: 150, proteinPer100g: 1, carbsPer100g: 36, fatPer100g: 0.5, fiberPer100g: 0.5, servingOptions: [{ label: '1 yemek kaşığı', grams: 15 }, { label: '100 g', grams: 100 }], category: 'diğer' },
  { id: 'soya-sosu', name: 'Soya Sosu', aliases: ['soy sauce'], defaultUnit: 'gram', caloriesPer100g: 53, proteinPer100g: 8, carbsPer100g: 5, fatPer100g: 0.6, fiberPer100g: 0.8, servingOptions: [{ label: '1 yemek kaşığı', grams: 15 }, { label: '100 ml', grams: 100 }], category: 'diğer' },
  { id: 'nar-eksisi', name: 'Nar Ekşisi', aliases: ['nar ekşisi'], defaultUnit: 'gram', caloriesPer100g: 260, proteinPer100g: 0.5, carbsPer100g: 64, fatPer100g: 0.1, fiberPer100g: 0.5, servingOptions: [{ label: '1 yemek kaşığı', grams: 15 }, { label: '100 g', grams: 100 }], category: 'diğer' },
  { id: 'pekmez-karisik', name: 'Pekmez', aliases: ['üzüm pekmezi', 'keçiboynuzu pekmezi'], defaultUnit: 'gram', caloriesPer100g: 290, proteinPer100g: 1, carbsPer100g: 72, fatPer100g: 0.1, fiberPer100g: 0.2, servingOptions: [{ label: '1 yemek kaşığı', grams: 20 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'tahin-susam-ezmesi', name: 'Tahin', aliases: ['susam ezmesi'], defaultUnit: 'gram', caloriesPer100g: 595, proteinPer100g: 17, carbsPer100g: 21, fatPer100g: 53, fiberPer100g: 9, servingOptions: [{ label: '1 yemek kaşığı', grams: 15 }, { label: '100 g', grams: 100 }], category: 'kuruyemiş' },
  { id: 'aycicek-yagi', name: 'Ayçiçek Yağı', aliases: ['sıvı yağ', 'ayçiçek yağı'], defaultUnit: 'gram', caloriesPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100, fiberPer100g: 0, servingOptions: [{ label: '1 yemek kaşığı', grams: 14 }, { label: '100 g', grams: 100 }], category: 'diğer' },
  { id: 'hindistan-cevizi-yagi', name: 'Hindistan Cevizi Yağı', aliases: ['coconut oil'], defaultUnit: 'gram', caloriesPer100g: 892, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100, fiberPer100g: 0, servingOptions: [{ label: '1 yemek kaşığı', grams: 14 }, { label: '100 g', grams: 100 }], category: 'diğer' },

  // ── Hazır yemek, donuk ürün ve pratik market tabakları ────────────────
  { id: 'donuk-pizza', name: 'Donuk Pizza', aliases: ['dondurulmuş pizza', 'market pizza'], defaultUnit: 'gram', caloriesPer100g: 255, proteinPer100g: 11, carbsPer100g: 32, fatPer100g: 9, fiberPer100g: 2.5, servingOptions: [{ label: '1 dilim', grams: 100 }, { label: '1 küçük pizza', grams: 300 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'donuk-patates', name: 'Donuk Patates Kızartması', aliases: ['dondurulmuş patates', 'frozen fries'], defaultUnit: 'gram', caloriesPer100g: 165, proteinPer100g: 2.5, carbsPer100g: 25, fatPer100g: 6, fiberPer100g: 2.5, servingOptions: [{ label: '1 porsiyon', grams: 150 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'hazir-manti-market', name: 'Hazır Mantı', aliases: ['market mantı', 'donuk mantı'], defaultUnit: 'gram', caloriesPer100g: 230, proteinPer100g: 10, carbsPer100g: 34, fatPer100g: 6, fiberPer100g: 2, servingOptions: [{ label: '1 porsiyon', grams: 250 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'hazir-lazanya', name: 'Hazır Lazanya', aliases: ['lazanya'], defaultUnit: 'gram', caloriesPer100g: 160, proteinPer100g: 8, carbsPer100g: 16, fatPer100g: 7, fiberPer100g: 1.5, servingOptions: [{ label: '1 porsiyon', grams: 300 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'hazir-salata-ton', name: 'Ton Balıklı Hazır Salata', aliases: ['hazır salata', 'ton salata'], defaultUnit: 'gram', caloriesPer100g: 110, proteinPer100g: 9, carbsPer100g: 8, fatPer100g: 4.5, fiberPer100g: 2, servingOptions: [{ label: '1 kase', grams: 250 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'wrap-tavuklu', name: 'Tavuklu Wrap', aliases: ['wrap', 'tavuk wrap'], defaultUnit: 'piece', caloriesPer100g: 220, proteinPer100g: 13, carbsPer100g: 26, fatPer100g: 8, fiberPer100g: 2.5, pieceWeightGrams: 220, servingOptions: [{ label: '1 adet', grams: 220 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'sandvic-peynirli', name: 'Peynirli Sandviç', aliases: ['hazır sandviç', 'market sandviç'], defaultUnit: 'piece', caloriesPer100g: 245, proteinPer100g: 10, carbsPer100g: 32, fatPer100g: 9, fiberPer100g: 2.5, pieceWeightGrams: 180, servingOptions: [{ label: '1 adet', grams: 180 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
  { id: 'tost-sucuklu-kasarli', name: 'Sucuklu Kaşarlı Tost', aliases: ['sucuklu tost'], defaultUnit: 'piece', caloriesPer100g: 325, proteinPer100g: 15, carbsPer100g: 28, fatPer100g: 18, fiberPer100g: 2, pieceWeightGrams: 170, servingOptions: [{ label: '1 adet', grams: 170 }, { label: '100 g', grams: 100 }], category: 'hazır-yemek' },
]

// ─── Sporcu Takviyeleri (marka bazlı) ──────────────────────────────────────
// Değerler markaların yayınladığı besin etiketlerine göre 100 g başınadır.
// Çoğu whey ürünü ~30 g, gainer ürünü ~75-100 g ölçek (servis) ile satılır.

function whey(
  id: string,
  name: string,
  brand: string,
  kcal: number,
  p: number,
  c: number,
  f: number,
  scoop = 30
): TurkishFood {
  return {
    id,
    name,
    brand,
    aliases: ['protein tozu', 'whey', 'whey protein', brand.toLowerCase()],
    defaultUnit: 'gram',
    caloriesPer100g: kcal,
    proteinPer100g: p,
    carbsPer100g: c,
    fatPer100g: f,
    fiberPer100g: 0,
    servingOptions: [
      { label: `1 ölçek (${scoop} g)`, grams: scoop },
      { label: '100 g', grams: 100 },
    ],
    category: 'takviye',
  }
}

function gainer(
  id: string,
  name: string,
  brand: string,
  kcal: number,
  p: number,
  c: number,
  f: number,
  scoop = 100
): TurkishFood {
  return {
    id,
    name,
    brand,
    aliases: ['gainer', 'mass gainer', 'kilo aldırıcı', 'protein tozu', brand.toLowerCase()],
    defaultUnit: 'gram',
    caloriesPer100g: kcal,
    proteinPer100g: p,
    carbsPer100g: c,
    fatPer100g: f,
    fiberPer100g: 1,
    servingOptions: [
      { label: `1 ölçek (${scoop} g)`, grams: scoop },
      { label: '100 g', grams: 100 },
    ],
    category: 'takviye',
  }
}

const SUPPLEMENT_FOODS: TurkishFood[] = [
  // ── ProteinOcean ──
  whey('po-whey-protein', 'ProteinOcean Whey Protein', 'ProteinOcean', 400, 77, 8, 7),
  whey('po-whey-isolate', 'ProteinOcean Whey Isolate', 'ProteinOcean', 380, 88, 2, 1),
  whey('po-micellar-casein', 'ProteinOcean Micellar Casein', 'ProteinOcean', 360, 78, 6, 3),
  whey('po-egg-protein', 'ProteinOcean Egg Protein', 'ProteinOcean', 375, 80, 4, 4),
  gainer('po-mass-gainer', 'ProteinOcean Mass Gainer', 'ProteinOcean', 378, 18, 68, 4),

  // ── Hardline ──
  whey('hardline-whey-3-matrix', 'Hardline Whey 3 Matrix', 'Hardline', 393, 75, 10, 6, 33),
  whey('hardline-whey-isolate', 'Hardline Whey Isolate', 'Hardline', 380, 85, 3, 2),
  gainer('hardline-progainer', 'Hardline Progainer', 'Hardline', 380, 20, 68, 4),

  // ── BigJoy ──
  whey('bigjoy-big-whey-power', 'BigJoy Big Whey Power', 'BigJoy', 400, 74, 9, 7),
  whey('bigjoy-iso-whey', 'BigJoy Iso Whey Zero', 'BigJoy', 375, 86, 2, 1),
  gainer('bigjoy-big-gainer', 'BigJoy Big Gainer', 'BigJoy', 375, 15, 72, 4, 75),

  // ── Protouch ──
  whey('protouch-daily-whey', 'Protouch Daily Whey', 'Protouch', 395, 72, 12, 6),
  gainer('protouch-mass-gainer', 'Protouch Mass Gainer', 'Protouch', 378, 16, 70, 4),

  // ── Torq Nutrition ──
  whey('torq-whey-protein', 'Torq Nutrition Whey Protein', 'Torq Nutrition', 397, 75, 9, 7, 32),
  whey('torq-iso-whey', 'Torq Nutrition Iso Whey', 'Torq Nutrition', 382, 86, 3, 2),
  gainer('torq-mass-gainer', 'Torq Nutrition Mass Gainer', 'Torq Nutrition', 380, 18, 68, 5),

  // ── Ostrovit ──
  whey('ostrovit-wpc', 'Ostrovit WPC Whey', 'Ostrovit', 410, 72, 8, 8),
  whey('ostrovit-wheymax', 'Ostrovit WheyMax Isolate', 'Ostrovit', 385, 86, 3, 2),

  // ── Optimum Nutrition ──
  whey('on-gold-standard', 'ON Gold Standard Whey', 'Optimum Nutrition', 400, 79, 9, 6, 31),
  whey('on-iso-platinum', 'ON Platinum Hydro Whey', 'Optimum Nutrition', 385, 87, 4, 2),
  gainer('on-serious-mass', 'ON Serious Mass', 'Optimum Nutrition', 372, 10, 77, 2, 167),

  // ── Dymatize ──
  whey('dymatize-iso-100', 'Dymatize ISO 100', 'Dymatize', 360, 90, 2, 1, 32),
  whey('dymatize-elite-whey', 'Dymatize Elite Whey', 'Dymatize', 400, 78, 8, 8),
  gainer('dymatize-super-mass', 'Dymatize Super Mass Gainer', 'Dymatize', 380, 21, 66, 3),

  // ── MyProtein ──
  whey('myprotein-impact-whey', 'MyProtein Impact Whey', 'MyProtein', 400, 82, 6, 7, 25),
  whey('myprotein-clear-whey', 'MyProtein Clear Whey Isolate', 'MyProtein', 360, 90, 1, 0, 25),
  gainer('myprotein-weight-gainer', 'MyProtein Weight Gainer Blend', 'MyProtein', 385, 31, 50, 7),

  // ── Scitec Nutrition ──
  whey('scitec-100-whey', 'Scitec 100% Whey Protein', 'Scitec Nutrition', 412, 74, 8, 7),
  gainer('scitec-jumbo', 'Scitec Jumbo Gainer', 'Scitec Nutrition', 390, 22, 58, 7),

  // ── Muscletech ──
  whey('muscletech-nitrotech', 'Muscletech Nitro-Tech', 'Muscletech', 380, 77, 10, 3, 46),
  gainer('muscletech-masstech', 'Muscletech Mass-Tech', 'Muscletech', 386, 21, 66, 4),

  // ── BSN ──
  whey('bsn-syntha6', 'BSN Syntha-6', 'BSN', 390, 49, 25, 12, 47),

  // ── Diğer popüler whey markaları ──
  whey('wheylab-whey', 'WheyLab Whey Protein', 'WheyLab', 395, 74, 10, 6),
  whey('gymlord-whey', 'GymLord Whey Protein', 'GymLord', 398, 73, 10, 7),
  whey('nutrabolics-isobolic', 'Nutrabolics Isobolic', 'Nutrabolics', 375, 85, 4, 2),
  whey('biotech-100-whey', 'BioTechUSA 100% Pure Whey', 'BioTechUSA', 412, 72, 9, 8),

  // ── Genel sporcu takviyeleri ──
  {
    id: 'kreatin-monohidrat', name: 'Kreatin Monohidrat', aliases: ['kreatin', 'creatine'],
    defaultUnit: 'gram', caloriesPer100g: 0, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0, fiberPer100g: 0,
    servingOptions: [{ label: '1 ölçek (5 g)', grams: 5 }, { label: '100 g', grams: 100 }], category: 'takviye',
  },
  {
    id: 'bcaa-tozu', name: 'BCAA Tozu', aliases: ['bcaa', 'amino asit'],
    defaultUnit: 'gram', caloriesPer100g: 280, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0, fiberPer100g: 0,
    servingOptions: [{ label: '1 ölçek (7 g)', grams: 7 }, { label: '100 g', grams: 100 }], category: 'takviye',
  },
  {
    id: 'eaa-tozu', name: 'EAA Tozu', aliases: ['eaa', 'esansiyel amino asit'],
    defaultUnit: 'gram', caloriesPer100g: 320, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0, fiberPer100g: 0,
    servingOptions: [{ label: '1 ölçek (10 g)', grams: 10 }, { label: '100 g', grams: 100 }], category: 'takviye',
  },
  {
    id: 'glutamin-tozu', name: 'Glutamin Tozu', aliases: ['glutamin', 'glutamine'],
    defaultUnit: 'gram', caloriesPer100g: 0, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0, fiberPer100g: 0,
    servingOptions: [{ label: '1 ölçek (5 g)', grams: 5 }, { label: '100 g', grams: 100 }], category: 'takviye',
  },
  {
    id: 'pre-workout', name: 'Pre-Workout', aliases: ['preworkout', 'antrenman öncesi'],
    defaultUnit: 'gram', caloriesPer100g: 80, proteinPer100g: 0, carbsPer100g: 18, fatPer100g: 0, fiberPer100g: 0,
    servingOptions: [{ label: '1 ölçek (10 g)', grams: 10 }, { label: '100 g', grams: 100 }], category: 'takviye',
  },
  {
    id: 'l-karnitin', name: 'L-Karnitin (sıvı)', aliases: ['karnitin', 'carnitine'],
    defaultUnit: 'gram', caloriesPer100g: 12, proteinPer100g: 0, carbsPer100g: 3, fatPer100g: 0, fiberPer100g: 0,
    servingOptions: [{ label: '1 ampul (25 ml)', grams: 25 }, { label: '100 ml', grams: 100 }], category: 'takviye',
  },
  {
    id: 'protein-bar-genel', name: 'Protein Bar', aliases: ['protein bar', 'bar'],
    defaultUnit: 'piece', caloriesPer100g: 360, proteinPer100g: 33, carbsPer100g: 36, fatPer100g: 9, fiberPer100g: 6,
    pieceWeightGrams: 60, servingOptions: [{ label: '1 bar', grams: 60 }, { label: '100 g', grams: 100 }], category: 'takviye',
  },
  {
    id: 'protein-gofret', name: 'Protein Gofret', aliases: ['protein wafer', 'gofret'],
    defaultUnit: 'piece', caloriesPer100g: 420, proteinPer100g: 30, carbsPer100g: 40, fatPer100g: 15, fiberPer100g: 4,
    pieceWeightGrams: 35, servingOptions: [{ label: '1 gofret', grams: 35 }, { label: '100 g', grams: 100 }], category: 'takviye',
  },
]

// ─── Market — eksik kalan yaygın marka ürünleri ─────────────────────────────
const MARKET_EXTRA_FOODS: TurkishFood[] = [
  // Atıştırmalık & çikolata
  { id: 'kinder-cikolata', name: 'Kinder Çikolata', brand: 'Kinder', aliases: ['kinder'], defaultUnit: 'piece', caloriesPer100g: 566, proteinPer100g: 8.7, carbsPer100g: 53.5, fatPer100g: 35, fiberPer100g: 1.5, pieceWeightGrams: 12.5, servingOptions: [{ label: '1 baton', grams: 12.5 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'kinder-sut-dilimi', name: 'Kinder Süt Dilimi', brand: 'Kinder', aliases: ['süt dilimi', 'kinder'], defaultUnit: 'piece', caloriesPer100g: 435, proteinPer100g: 8.7, carbsPer100g: 28, fatPer100g: 31, fiberPer100g: 0.8, pieceWeightGrams: 28, servingOptions: [{ label: '1 dilim', grams: 28 }, { label: '100 g', grams: 100 }], category: 'atıştırmalık' },
  { id: 'cezerye', name: 'Cezerye', aliases: ['cezerye'], defaultUnit: 'piece', caloriesPer100g: 360, proteinPer100g: 3, carbsPer100g: 70, fatPer100g: 8, fiberPer100g: 4, pieceWeightGrams: 15, servingOptions: [{ label: '1 adet', grams: 15 }, { label: '100 g', grams: 100 }], category: 'tatlı' },
  { id: 'pismaniye', name: 'Pişmaniye', aliases: ['pişmaniye', 'pismaniye'], defaultUnit: 'gram', caloriesPer100g: 470, proteinPer100g: 5, carbsPer100g: 76, fatPer100g: 16, fiberPer100g: 1, servingOptions: [{ label: '1 avuç', grams: 30 }, { label: '100 g', grams: 100 }], category: 'tatlı' },

  // İçecekler
  { id: 'gatorade', name: 'Gatorade', brand: 'Gatorade', aliases: ['sporcu içeceği', 'isotonik'], defaultUnit: 'gram', caloriesPer100g: 26, proteinPer100g: 0, carbsPer100g: 6.5, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 şişe (500 ml)', grams: 500 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'burn-enerji', name: 'Burn Enerji İçeceği', brand: 'Burn', aliases: ['enerji içeceği', 'burn'], defaultUnit: 'gram', caloriesPer100g: 49, proteinPer100g: 0, carbsPer100g: 12, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 kutu (250 ml)', grams: 250 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'dimes-meyve-suyu', name: 'Dimes Meyve Suyu', brand: 'Dimes', aliases: ['meyve suyu', 'dimes'], defaultUnit: 'gram', caloriesPer100g: 48, proteinPer100g: 0.2, carbsPer100g: 11.5, fatPer100g: 0, fiberPer100g: 0.3, servingOptions: [{ label: '1 kutu (200 ml)', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'camlica-gazoz', name: 'Çamlıca Gazoz', brand: 'Çamlıca', aliases: ['gazoz', 'çamlıca'], defaultUnit: 'gram', caloriesPer100g: 41, proteinPer100g: 0, carbsPer100g: 10, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 şişe (250 ml)', grams: 250 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'capri-sun', name: 'Capri-Sun', brand: 'Capri-Sun', aliases: ['capri sun', 'meyve suyu'], defaultUnit: 'gram', caloriesPer100g: 42, proteinPer100g: 0, carbsPer100g: 10, fatPer100g: 0, fiberPer100g: 0, servingOptions: [{ label: '1 paket (200 ml)', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'içecek' },
  { id: 'nesquik-icecek', name: 'Nesquik Sütlü Kakao (hazır)', brand: 'Nesquik', aliases: ['kakaolu süt', 'çikolatalı süt'], defaultUnit: 'gram', caloriesPer100g: 61, proteinPer100g: 3, carbsPer100g: 9.5, fatPer100g: 1.5, fiberPer100g: 0.3, servingOptions: [{ label: '1 kutu (200 ml)', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'içecek' },

  // Kahvaltılık & market temel
  { id: 'tam-yagli-sut', name: 'Tam Yağlı Süt', aliases: ['süt', 'inek sütü'], defaultUnit: 'gram', caloriesPer100g: 64, proteinPer100g: 3.3, carbsPer100g: 4.8, fatPer100g: 3.6, fiberPer100g: 0, servingOptions: [{ label: '1 bardak (200 ml)', grams: 200 }, { label: '100 ml', grams: 100 }], category: 'süt-ürünü' },
  { id: 'ucgen-peynir', name: 'Üçgen Peynir', aliases: ['üçgen peynir', 'krem peynir'], defaultUnit: 'piece', caloriesPer100g: 230, proteinPer100g: 10, carbsPer100g: 4, fatPer100g: 18, fiberPer100g: 0, pieceWeightGrams: 17.5, servingOptions: [{ label: '1 üçgen', grams: 17.5 }, { label: '100 g', grams: 100 }], category: 'süt-ürünü' },
  { id: 'cikolatali-gevrek', name: 'Çikolatalı Gevrek', aliases: ['chocapic', 'kakaolu gevrek', 'mısır gevreği'], defaultUnit: 'gram', caloriesPer100g: 384, proteinPer100g: 7, carbsPer100g: 76, fatPer100g: 4, fiberPer100g: 6, servingOptions: [{ label: '1 kase (40 g)', grams: 40 }, { label: '100 g', grams: 100 }], category: 'tahıl' },
]

// ─── Migros / A101 / BİM — Kapsamlı Market Genişletmesi ─────────────────────
// Fabrika fonksiyonları: tekrarı azaltır, tutarlılık sağlar
function g(id: string, name: string, cal: number, p: number, c: number, fat: number, fib: number, cat: FoodCategory, brand?: string, aliases?: string[], servings?: TurkishFoodServing[]): TurkishFood {
  return { id, name, ...(brand && { brand }), ...(aliases && { aliases }), defaultUnit: 'gram', caloriesPer100g: cal, proteinPer100g: p, carbsPer100g: c, fatPer100g: fat, fiberPer100g: fib, servingOptions: servings ?? [{ label: '1 porsiyon', grams: 100 }, { label: '100 g', grams: 100 }], category: cat }
}
function pc(id: string, name: string, cal: number, p: number, c: number, fat: number, fib: number, cat: FoodCategory, pieceGrams: number, pieceLabel: string, brand?: string, aliases?: string[]): TurkishFood {
  return { id, name, ...(brand && { brand }), ...(aliases && { aliases }), defaultUnit: 'piece', caloriesPer100g: cal, proteinPer100g: p, carbsPer100g: c, fatPer100g: fat, fiberPer100g: fib, pieceWeightGrams: pieceGrams, servingOptions: [{ label: pieceLabel, grams: pieceGrams }, { label: '100 g', grams: 100 }], category: cat }
}
// Kısaltma: bardak (200ml), kutu (200ml), şişe (500ml)
const S_BARDAK: TurkishFoodServing[] = [{ label: '1 bardak (200 ml)', grams: 200 }, { label: '100 ml', grams: 100 }]
const S_KUTU: TurkishFoodServing[] = [{ label: '1 kutu (200 ml)', grams: 200 }, { label: '100 ml', grams: 100 }]
const S_SISE: TurkishFoodServing[] = [{ label: '1 şişe (500 ml)', grams: 500 }, { label: '100 ml', grams: 100 }]
const S_KASE: TurkishFoodServing[] = [{ label: '1 kase (200 g)', grams: 200 }, { label: '100 g', grams: 100 }]
const S_YKASIK: TurkishFoodServing[] = [{ label: '1 yemek kaşığı (15 g)', grams: 15 }, { label: '100 g', grams: 100 }]
const S_DILIM: TurkishFoodServing[] = [{ label: '1 dilim (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]
const S_KUTU250: TurkishFoodServing[] = [{ label: '1 kutu (250 ml)', grams: 250 }, { label: '100 ml', grams: 100 }]
const S_SISE330: TurkishFoodServing[] = [{ label: '1 şişe (330 ml)', grams: 330 }, { label: '100 ml', grams: 100 }]
const S_KUTU330: TurkishFoodServing[] = [{ label: '1 kutu (330 ml)', grams: 330 }, { label: '100 ml', grams: 100 }]

const MIGROS_A101_BIM_FOODS: TurkishFood[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // SÜT & SÜT ÜRÜNLERİ — Marka çeşitleri
  // ═══════════════════════════════════════════════════════════════════════════
  // Süt markaları
  g('eker-sut', 'Eker Süt (Tam Yağlı)', 64, 3.3, 4.8, 3.5, 0, 'süt-ürünü', 'Eker', ['süt'], S_BARDAK),
  g('icim-sut', 'İçim Süt (Tam Yağlı)', 63, 3.2, 4.7, 3.5, 0, 'süt-ürünü', 'İçim', ['süt'], S_BARDAK),
  g('sutas-sut', 'Sütaş Süt (Tam Yağlı)', 64, 3.3, 4.8, 3.6, 0, 'süt-ürünü', 'Sütaş', ['süt'], S_BARDAK),
  g('icim-yarim-yagli', 'İçim Süt (Yarım Yağlı)', 46, 3.3, 4.8, 1.6, 0, 'süt-ürünü', 'İçim', ['süt'], S_BARDAK),
  g('eker-yarim-yagli', 'Eker Süt (Yarım Yağlı)', 46, 3.3, 4.7, 1.5, 0, 'süt-ürünü', 'Eker', ['süt'], S_BARDAK),
  g('a101-icim-sut', 'A101 İçim Süt (1L)', 64, 3.3, 4.8, 3.5, 0, 'süt-ürünü', 'A101', ['süt'], S_BARDAK),
  g('bim-sut', 'BİM Dost Süt (Tam Yağlı)', 63, 3.2, 4.7, 3.5, 0, 'süt-ürünü', 'BİM', ['süt'], S_BARDAK),
  g('cimpa-sut', 'Çimpa Süt (A101)', 64, 3.3, 4.8, 3.5, 0, 'süt-ürünü', 'Çimpa', ['süt', 'a101'], S_BARDAK),

  // Yoğurt markaları
  g('pinar-yogurt', 'Pınar Yoğurt (Tam Yağlı)', 63, 3.5, 4.5, 3.5, 0, 'süt-ürünü', 'Pınar', ['yoğurt'], S_KASE),
  g('eker-yogurt', 'Eker Yoğurt (Tam Yağlı)', 62, 3.4, 4.6, 3.4, 0, 'süt-ürünü', 'Eker', ['yoğurt'], S_KASE),
  g('sek-yogurt', 'SEK Yoğurt (Tam Yağlı)', 61, 3.5, 4.5, 3.3, 0, 'süt-ürünü', 'SEK', ['yoğurt'], S_KASE),
  g('sutas-homojen', 'Sütaş Homojen Yoğurt', 80, 3.8, 4.5, 5.2, 0, 'süt-ürünü', 'Sütaş', ['yoğurt'], S_KASE),
  g('danone-yogurt', 'Danone Doğal Yoğurt', 58, 3.6, 4.2, 3.0, 0, 'süt-ürünü', 'Danone', ['yoğurt'], S_KASE),
  g('torku-yogurt', 'Torku Yoğurt', 62, 3.5, 4.6, 3.3, 0, 'süt-ürünü', 'Torku', ['yoğurt'], S_KASE),
  g('bim-yogurt', 'BİM Dost Yoğurt', 60, 3.4, 4.5, 3.2, 0, 'süt-ürünü', 'BİM', ['yoğurt'], S_KASE),
  g('a101-yogurt', 'A101 Yoğurt', 61, 3.5, 4.5, 3.3, 0, 'süt-ürünü', 'A101', ['yoğurt'], S_KASE),
  g('pinar-suzme-yogurt', 'Pınar Süzme Yoğurt', 50, 8.5, 3.5, 0.3, 0, 'süt-ürünü', 'Pınar', ['süzme yoğurt'], S_KASE),
  g('eker-suzme-yogurt', 'Eker Süzme Yoğurt', 48, 8.0, 3.6, 0.2, 0, 'süt-ürünü', 'Eker', ['süzme yoğurt'], S_KASE),
  g('danone-activia-meyveli', 'Activia Meyveli Yoğurt', 88, 3.5, 14, 1.8, 0.5, 'süt-ürünü', 'Danone', ['activia'], [{ label: '1 kase (100 g)', grams: 100 }]),

  // Ayran markaları
  g('pinar-ayran', 'Pınar Ayran', 36, 1.3, 1.5, 2.4, 0, 'süt-ürünü', 'Pınar', ['ayran'], S_BARDAK),
  g('icim-ayran', 'İçim Ayran', 37, 1.4, 1.5, 2.5, 0, 'süt-ürünü', 'İçim', ['ayran'], S_BARDAK),
  g('eker-ayran', 'Eker Ayran', 36, 1.3, 1.5, 2.4, 0, 'süt-ürünü', 'Eker', ['ayran'], S_BARDAK),

  // Kefir markaları
  g('sutas-kefir', 'Sütaş Kefir', 55, 3.3, 4.5, 2.5, 0, 'süt-ürünü', 'Sütaş', ['kefir'], S_KUTU),
  g('icim-kefir', 'İçim Kefir', 53, 3.2, 4.4, 2.4, 0, 'süt-ürünü', 'İçim', ['kefir'], S_KUTU),
  g('pinar-kefir', 'Pınar Kefir', 54, 3.3, 4.5, 2.4, 0, 'süt-ürünü', 'Pınar', ['kefir'], S_KUTU),

  // Peynir markaları
  g('pinar-kasar', 'Pınar Taze Kaşar', 350, 25, 0.5, 27, 0, 'süt-ürünü', 'Pınar', ['kaşar'], S_DILIM),
  g('bahcivan-tost', 'Bahçıvan Tost Peyniri', 340, 24, 1, 26, 0, 'süt-ürünü', 'Bahçıvan', ['kaşar', 'tost peyniri'], S_DILIM),
  g('muratbey-burgu', 'Muratbey Burgu Peynir', 335, 25, 0.8, 26, 0, 'süt-ürünü', 'Muratbey', ['peynir'], S_DILIM),
  g('tahsildaroglu-ezine', 'Tahsildaroğlu Ezine Beyaz', 270, 18, 1, 21, 0, 'süt-ürünü', 'Tahsildaroğlu', ['beyaz peynir', 'ezine'], S_DILIM),
  g('pinar-beyaz-peynir', 'Pınar Beyaz Peynir', 250, 16, 1, 20, 0, 'süt-ürünü', 'Pınar', ['beyaz peynir'], S_DILIM),
  g('bim-kasar', 'BİM Kaşar Peyniri', 345, 24, 0.5, 27, 0, 'süt-ürünü', 'BİM', ['kaşar'], S_DILIM),
  g('a101-kasar', 'A101 Kaşar Peyniri', 345, 24, 0.5, 27, 0, 'süt-ürünü', 'A101', ['kaşar'], S_DILIM),
  g('icim-ucgen-peynir', 'İçim Üçgen Peynir', 235, 10, 4, 19, 0, 'süt-ürünü', 'İçim', ['üçgen peynir'], [{ label: '1 üçgen (17 g)', grams: 17 }, { label: '100 g', grams: 100 }]),
  g('sutas-labne', 'Sütaş Labne', 160, 6, 3.5, 13.5, 0, 'süt-ürünü', 'Sütaş', ['labne'], S_YKASIK),
  g('pinar-labne', 'Pınar Labne', 165, 6, 3.5, 14, 0, 'süt-ürünü', 'Pınar', ['labne'], S_YKASIK),
  g('danone-actimel', 'Actimel', 72, 2.8, 11, 1.5, 0, 'süt-ürünü', 'Danone', ['actimel', 'probiyotik'], [{ label: '1 şişe (100 ml)', grams: 100 }]),
  g('sut-kremasi', 'Süt Kreması (%20)', 195, 2.5, 3.5, 19, 0, 'süt-ürünü', undefined, ['krema', 'süt kreması'], S_YKASIK),
  g('pinar-sut-kremasi', 'Pınar Süt Kreması', 302, 2.2, 3.2, 31, 0, 'süt-ürünü', 'Pınar', ['krema'], S_YKASIK),

  // ═══════════════════════════════════════════════════════════════════════════
  // ET & ŞARKÜTERI — Marka çeşitleri
  // ═══════════════════════════════════════════════════════════════════════════
  g('dana-kusbasi', 'Dana Kuşbaşı', 140, 20, 0, 6.5, 0, 'protein', undefined, ['dana', 'kuşbaşı']),
  g('kuzu-kusbasi', 'Kuzu Kuşbaşı', 210, 17, 0, 15, 0, 'protein', undefined, ['kuzu', 'kuşbaşı']),
  g('kuzu-but', 'Kuzu But (Fırın)', 230, 26, 0, 14, 0, 'protein', undefined, ['kuzu']),
  g('dana-ciger', 'Dana Ciğer', 135, 20, 3.9, 3.6, 0, 'protein', undefined, ['ciğer']),
  g('tavuk-ciger', 'Tavuk Ciğer', 119, 17, 1, 4.8, 0, 'protein', undefined, ['ciğer']),
  g('mezgit-izgara', 'Mezgit (Izgara)', 82, 18.3, 0, 0.7, 0, 'protein', undefined, ['balık', 'mezgit']),
  g('palamut-izgara', 'Palamut (Izgara)', 158, 25, 0, 6, 0, 'protein', undefined, ['balık', 'palamut']),
  g('uskumru-izgara', 'Uskumru (Izgara)', 205, 19, 0, 14, 0, 'protein', undefined, ['balık', 'uskumru']),
  g('cipura-izgara', 'Çipura (Izgara)', 115, 20, 0, 3.7, 0, 'protein', undefined, ['balık', 'çipura']),

  // Sucuk markaları
  g('pinar-sucuk', 'Pınar Dana Sucuk', 350, 18, 1, 30, 0, 'şarküteri', 'Pınar', ['sucuk'], S_DILIM),
  g('namet-sucuk', 'Namet Dana Sucuk', 345, 17, 1, 30, 0, 'şarküteri', 'Namet', ['sucuk'], S_DILIM),
  g('yayla-sucuk', 'Yayla Sucuk', 340, 17, 1, 29, 0, 'şarküteri', 'Yayla', ['sucuk'], S_DILIM),
  g('bim-sucuk', 'BİM Kangal Sucuk', 348, 17, 1, 30, 0, 'şarküteri', 'BİM', ['sucuk', 'kangal'], S_DILIM),
  g('a101-sucuk', 'A101 Sucuk', 345, 17, 1, 30, 0, 'şarküteri', 'A101', ['sucuk'], S_DILIM),

  // Sosis markaları
  g('pinar-sosis', 'Pınar Sosis', 250, 12, 3, 21, 0, 'şarküteri', 'Pınar', ['sosis'], [{ label: '1 adet', grams: 25 }, { label: '100 g', grams: 100 }]),
  g('namet-sosis', 'Namet Sosis', 245, 12, 3, 20, 0, 'şarküteri', 'Namet', ['sosis'], [{ label: '1 adet', grams: 25 }, { label: '100 g', grams: 100 }]),
  g('banvit-sosis', 'Banvit Tavuk Sosis', 230, 13, 2, 18, 0, 'şarküteri', 'Banvit', ['sosis', 'tavuk sosis'], [{ label: '1 adet', grams: 25 }, { label: '100 g', grams: 100 }]),
  g('bim-sosis', 'BİM Sosis', 248, 12, 3, 20, 0, 'şarküteri', 'BİM', ['sosis'], [{ label: '1 adet', grams: 25 }, { label: '100 g', grams: 100 }]),

  // Salam/Jambon markaları
  g('pinar-dana-salam', 'Pınar Dana Salam', 280, 14, 2, 24, 0, 'şarküteri', 'Pınar', ['salam'], S_DILIM),
  g('namet-salam', 'Namet Salam', 275, 14, 2, 23, 0, 'şarküteri', 'Namet', ['salam'], S_DILIM),
  g('namet-hindi-fume', 'Namet Hindi Füme', 110, 20, 1.5, 2.5, 0, 'şarküteri', 'Namet', ['hindi füme', 'jambon'], S_DILIM),
  g('pinar-hindi-fume', 'Pınar Hindi Füme', 115, 21, 1.5, 2.8, 0, 'şarküteri', 'Pınar', ['hindi füme', 'jambon'], S_DILIM),
  g('hindi-sosis', 'Hindi Sosis', 180, 15, 2, 12, 0, 'şarküteri', undefined, ['hindi sosis'], [{ label: '1 adet', grams: 25 }, { label: '100 g', grams: 100 }]),
  g('hindi-sucuk', 'Hindi Sucuk', 200, 18, 1, 14, 0, 'şarküteri', undefined, ['hindi sucuk'], S_DILIM),
  g('fume-et', 'Füme Et', 180, 28, 1, 7, 0, 'şarküteri', undefined, ['füme et', 'kurutulmuş et'], S_DILIM),

  // ═══════════════════════════════════════════════════════════════════════════
  // MEYVE — Eksik çeşitler
  // ═══════════════════════════════════════════════════════════════════════════
  g('dut', 'Dut', 43, 1.4, 10, 0.4, 1.7, 'meyve'),
  g('karadut', 'Karadut', 43, 1.4, 10, 0.4, 1.7, 'meyve'),
  g('ayva', 'Ayva', 57, 0.4, 15, 0.1, 1.9, 'meyve'),
  g('guava', 'Guava', 68, 2.6, 14, 1, 5.4, 'meyve'),
  g('papaya', 'Papaya', 43, 0.5, 11, 0.3, 1.7, 'meyve'),
  g('limon', 'Limon', 29, 1.1, 9, 0.3, 2.8, 'meyve'),
  g('lime', 'Misket Limonu (Lime)', 30, 0.7, 11, 0.2, 2.8, 'meyve'),
  g('hindistan-cevizi-taze', 'Hindistan Cevizi (Taze)', 354, 3.3, 15, 33, 9, 'meyve'),
  g('yesil-uzum', 'Yeşil Üzüm', 67, 0.6, 17, 0.4, 0.9, 'meyve'),
  g('siyah-uzum', 'Siyah Üzüm', 70, 0.7, 18, 0.2, 0.9, 'meyve'),
  g('kurutulmus-muz', 'Kurutulmuş Muz (Chips)', 520, 2.3, 59, 34, 5.5, 'meyve'),
  g('dondurulmus-cilek', 'Dondurulmuş Çilek', 35, 0.7, 7.7, 0.3, 2, 'meyve'),
  g('dondurulmus-frambuaz', 'Dondurulmuş Frambuaz', 48, 1.1, 11, 0.3, 4.4, 'meyve'),

  // ═══════════════════════════════════════════════════════════════════════════
  // SEBZE — Eksik çeşitler
  // ═══════════════════════════════════════════════════════════════════════════
  g('enginar', 'Enginar', 47, 3.3, 11, 0.2, 5.4, 'sebze'),
  g('kuskonmaz', 'Kuşkonmaz', 20, 2.2, 3.9, 0.1, 2.1, 'sebze'),
  g('pazi', 'Pazı (Pişmiş)', 19, 1.8, 3.7, 0.1, 1.6, 'sebze'),
  g('semizotu', 'Semizotu', 20, 2, 3.4, 0.4, 0.8, 'sebze'),
  g('pirasa', 'Pırasa (Pişmiş)', 31, 0.8, 7.6, 0.2, 1.8, 'sebze'),
  g('sarimsak', 'Sarımsak', 149, 6.4, 33, 0.5, 2.1, 'sebze', undefined, ['sarımsak'], [{ label: '1 diş', grams: 3 }, { label: '100 g', grams: 100 }]),
  g('zencefil-taze', 'Taze Zencefil', 80, 1.8, 18, 0.8, 2, 'sebze', undefined, ['zencefil'], [{ label: '1 cm parça', grams: 5 }, { label: '100 g', grams: 100 }]),
  g('taze-bezelye', 'Taze Bezelye (Pişmiş)', 84, 5.4, 16, 0.2, 5.7, 'sebze'),
  g('turp-kirmizi', 'Turp', 16, 0.7, 3.4, 0.1, 1.6, 'sebze'),
  g('taze-sogan', 'Taze Soğan', 32, 1.8, 7.3, 0.2, 2.6, 'sebze'),
  g('taze-nane', 'Taze Nane', 70, 3.8, 14.9, 0.9, 8, 'sebze', undefined, undefined, [{ label: '1 avuç', grams: 5 }, { label: '100 g', grams: 100 }]),
  g('maydanoz', 'Maydanoz', 36, 3, 6.3, 0.8, 3.3, 'sebze', undefined, undefined, [{ label: '1 demet', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('dereotu', 'Dereotu', 43, 3.5, 7, 1.1, 2.1, 'sebze', undefined, undefined, [{ label: '1 demet', grams: 20 }, { label: '100 g', grams: 100 }]),

  // ═══════════════════════════════════════════════════════════════════════════
  // TAHIL & BAKLİYAT — Marka çeşitleri
  // ═══════════════════════════════════════════════════════════════════════════
  // Pirinç markaları
  g('reis-baldo', 'Reis Baldo Pirinç (Çiğ)', 360, 6.7, 80, 0.7, 0.4, 'tahıl', 'Reis', ['baldo', 'pirinç']),
  g('reis-osmancik', 'Reis Osmancık Pirinç (Çiğ)', 358, 6.5, 79, 0.6, 0.5, 'tahıl', 'Reis', ['osmancık', 'pirinç']),
  g('reis-basmati', 'Reis Basmati Pirinç (Çiğ)', 355, 7, 78, 0.6, 0.6, 'tahıl', 'Reis', ['basmati', 'pirinç']),
  g('duru-bulgur', 'Duru Pilavlık Bulgur (Çiğ)', 342, 12, 70, 1.3, 12, 'tahıl', 'Duru', ['bulgur']),
  g('duru-ince-bulgur', 'Duru İnce Bulgur (Çiğ)', 342, 12, 70, 1.3, 12, 'tahıl', 'Duru', ['ince bulgur', 'kısırlık']),

  // Makarna markaları
  g('barilla-spagetti', 'Barilla Spaghetti (Çiğ)', 356, 12.5, 72, 1.5, 3, 'tahıl', 'Barilla', ['makarna', 'spagetti']),
  g('barilla-penne', 'Barilla Penne (Çiğ)', 356, 12.5, 72, 1.5, 3, 'tahıl', 'Barilla', ['makarna', 'penne']),
  g('filiz-makarna', 'Filiz Makarna (Çiğ)', 358, 12, 73, 1.5, 2.5, 'tahıl', 'Filiz', ['makarna']),
  g('nuhun-ankara', "Nuh'un Ankara Makarna (Çiğ)", 355, 12, 72, 1.5, 2.5, 'tahıl', "Nuh'un Ankara", ['makarna']),
  g('piyale-makarna', 'Piyale Makarna (Çiğ)', 356, 12, 72, 1.5, 2.5, 'tahıl', 'Piyale', ['makarna']),
  g('barilla-tam-bugday', 'Barilla Tam Buğday Makarna (Çiğ)', 348, 13, 66, 2.5, 7.5, 'tahıl', 'Barilla', ['tam buğday makarna']),

  // Un markaları
  g('sinangil-un', 'Sinangil Un', 364, 10, 76, 1, 2.7, 'tahıl', 'Sinangil', ['un']),
  g('soke-un', 'Söke Un', 364, 10, 76, 1, 2.7, 'tahıl', 'Söke', ['un']),

  // Bakliyat
  g('reis-kirmizi-mercimek', 'Reis Kırmızı Mercimek (Çiğ)', 340, 24, 60, 1.1, 11, 'bakliyat', 'Reis', ['mercimek']),
  g('reis-yesil-mercimek', 'Reis Yeşil Mercimek (Çiğ)', 352, 25, 63, 1, 11, 'bakliyat', 'Reis', ['mercimek']),
  g('reis-nohut', 'Reis Nohut (Çiğ)', 364, 19, 61, 6, 12.2, 'bakliyat', 'Reis', ['nohut']),
  g('reis-kuru-fasulye', 'Reis Kuru Fasulye (Çiğ)', 333, 21, 60, 1.2, 15, 'bakliyat', 'Reis', ['fasulye']),
  g('duru-yesil-mercimek', 'Duru Yeşil Mercimek (Çiğ)', 352, 25, 63, 1, 11, 'bakliyat', 'Duru', ['mercimek']),

  // ═══════════════════════════════════════════════════════════════════════════
  // EKMEK & UNLU MAMULLER
  // ═══════════════════════════════════════════════════════════════════════════
  pc('uno-sandvic', 'Uno Sandviç Ekmeği', 270, 8, 50, 4, 2.5, 'ekmek', 30, '1 dilim', 'Uno', ['sandviç ekmeği']),
  pc('uno-hamburger', 'Uno Hamburger Ekmeği', 280, 8.5, 50, 4.5, 2, 'ekmek', 55, '1 adet', 'Uno', ['hamburger ekmeği']),
  pc('uno-tost', 'Uno Tost Ekmeği', 270, 8, 50, 4, 2, 'ekmek', 30, '1 dilim', 'Uno', ['tost ekmeği']),
  pc('ramazan-pidesi', 'Ramazan Pidesi', 265, 8.5, 52, 2, 2, 'ekmek', 200, '1 adet (yarım)', undefined, ['pide']),
  pc('lavash-ince', 'İnce Lavaş', 320, 9, 62, 3.5, 2, 'ekmek', 60, '1 adet', undefined, ['lavaş', 'dürüm lavaşı']),
  pc('misir-ekmegi', 'Mısır Ekmeği', 240, 6, 46, 3, 3, 'ekmek', 150, '1 adet', undefined, ['mısır ekmeği']),
  g('grissini', 'Grissini (Çubuk Ekmek)', 410, 11, 72, 8, 3, 'ekmek', undefined, ['grissini', 'galeta'], [{ label: '1 adet', grams: 5 }, { label: '100 g', grams: 100 }]),
  g('pide-lahmacun-hamuru', 'Pide Hamuru (Çiğ)', 285, 8, 56, 2.5, 2, 'ekmek'),

  // ═══════════════════════════════════════════════════════════════════════════
  // İÇECEKLER — Eksik markalar
  // ═══════════════════════════════════════════════════════════════════════════
  g('cay-sade', 'Çay (Sade)', 1, 0, 0, 0, 0, 'içecek', undefined, ['çay'], [{ label: '1 bardak', grams: 200 }, { label: '100 ml', grams: 100 }]),
  g('cay-iki-sekerli', 'Çay (2 Şekerli)', 16, 0, 4, 0, 0, 'içecek', undefined, ['çay'], [{ label: '1 bardak', grams: 200 }, { label: '100 ml', grams: 100 }]),
  g('nescafe-gold', 'Nescafe Gold (Sade)', 130, 14, 9, 2, 0, 'içecek', 'Nescafe', ['nescafe gold'], [{ label: '1 fincan (2 g)', grams: 2 }, { label: '100 g', grams: 100 }]),
  g('jacobs-monarch', 'Jacobs Monarch Hazır Kahve', 118, 13, 10, 1.5, 0, 'içecek', 'Jacobs', ['jacobs'], [{ label: '1 fincan (2 g)', grams: 2 }, { label: '100 g', grams: 100 }]),
  g('yedigun', 'Yedigün Meyve Suyu', 44, 0, 11, 0, 0, 'içecek', 'Yedigün', ['meyve suyu', 'yedigün'], S_KUTU),
  g('fruko', 'Fruko', 46, 0, 11.5, 0, 0, 'içecek', 'Fruko', ['fruko', 'meyve suyu'], S_KUTU),
  g('uludag-limonata', 'Uludağ Limonata', 34, 0, 8.5, 0, 0, 'içecek', 'Uludağ', ['limonata'], S_SISE330),
  g('uludag-frutti', 'Uludağ Frutti', 36, 0, 9, 0, 0, 'içecek', 'Uludağ', ['frutti'], S_KUTU330),
  g('sirma-soda', 'Sırma Soda', 0, 0, 0, 0, 0, 'içecek', 'Sırma', ['soda'], S_KUTU),
  g('kinik-maden-suyu', 'Kınık Maden Suyu', 0, 0, 0, 0, 0, 'içecek', 'Kınık', ['maden suyu'], S_SISE),
  g('erikli-maden-suyu', 'Erikli Maden Suyu', 0, 0, 0, 0, 0, 'içecek', 'Erikli', ['maden suyu'], S_SISE),
  g('cappy-atom', 'Cappy Atom', 42, 0, 10.5, 0, 0, 'içecek', 'Cappy', ['cappy', 'meyve suyu'], S_KUTU),
  g('cappy-seftali', 'Cappy Şeftali Nektarı', 45, 0, 11, 0, 0, 'içecek', 'Cappy', ['cappy', 'şeftali'], S_KUTU),
  g('didi-meyve-suyu', 'Didi Meyve Suyu', 44, 0, 11, 0, 0, 'içecek', 'Didi', ['meyve suyu'], S_KUTU),
  g('pinar-sut-kahvesi', 'Pınar Sütlü Kahve', 56, 2.8, 7.5, 1.8, 0, 'içecek', 'Pınar', ['sütlü kahve', 'soğuk kahve'], S_KUTU),
  g('starbucks-market-latte', 'Starbucks Frappuccino (Market)', 60, 2.5, 8.5, 1.8, 0, 'içecek', 'Starbucks', ['frappuccino', 'soğuk kahve'], S_KUTU250),
  g('caykur-buzlu-cay', 'Çaykur Buzlu Çay', 28, 0, 7, 0, 0, 'içecek', 'Çaykur', ['buzlu çay', 'ice tea'], S_SISE),
  g('lipton-ice-tea-seftali', 'Lipton Ice Tea Şeftali', 24, 0, 5.9, 0, 0, 'içecek', 'Lipton', ['ice tea', 'şeftali'], S_SISE),
  g('pepsi-max', 'Pepsi Max', 0.4, 0, 0, 0, 0, 'içecek', 'Pepsi', ['pepsi max', 'diyet'], S_KUTU330),
  g('fanta-portakal', 'Fanta Portakal', 42, 0, 10, 0, 0, 'içecek', 'Fanta', ['fanta'], S_KUTU330),
  g('sprite-seker', 'Sprite Şekersiz', 0.5, 0, 0, 0, 0, 'içecek', 'Sprite', ['sprite'], S_KUTU330),
  g('a101-su', 'A101 Özkaynak Su', 0, 0, 0, 0, 0, 'içecek', 'A101', ['su'], S_SISE),
  g('bim-erikli-su', 'BİM Erikli Su', 0, 0, 0, 0, 0, 'içecek', 'BİM', ['su', 'erikli'], S_SISE),

  // ═══════════════════════════════════════════════════════════════════════════
  // DONDURMA & DONUK GIDALAR
  // ═══════════════════════════════════════════════════════════════════════════
  pc('algida-max', 'Algida Max', 305, 4, 38, 16, 1, 'tatlı', 92, '1 adet', 'Algida', ['dondurma', 'max']),
  pc('magnum-badem', 'Magnum Badem', 310, 5, 29, 20, 1, 'tatlı', 86, '1 adet', 'Magnum', ['dondurma', 'magnum']),
  pc('magnum-beyaz', 'Magnum Beyaz', 305, 4, 30, 19, 0, 'tatlı', 86, '1 adet', 'Magnum', ['dondurma', 'magnum']),
  pc('cornetto-cikolatali', 'Cornetto Çikolatalı', 250, 3.5, 30, 14, 1, 'tatlı', 90, '1 adet', 'Cornetto', ['dondurma', 'cornetto']),
  pc('carte-dor-vanilya', "Carte d'Or Vanilya", 175, 3, 23, 8, 0, 'tatlı', 65, '1 top', "Carte d'Or", ['dondurma'], ),
  pc('carte-dor-cikolata', "Carte d'Or Çikolata", 210, 4, 26, 10, 1, 'tatlı', 65, '1 top', "Carte d'Or", ['dondurma']),
  g('golf-dondurma', 'Golf Dondurma (Kaymak)', 260, 3.5, 29, 15, 0, 'tatlı', undefined, ['dondurma', 'golf'], [{ label: '1 çubuk', grams: 70 }, { label: '100 g', grams: 100 }]),

  // Donuk gıdalar
  g('superfresh-donuk-borek', 'SuperFresh Donuk Su Böreği', 260, 8, 30, 12, 1.5, 'hazır-yemek', 'SuperFresh', ['börek', 'donuk börek']),
  g('pinar-donuk-pizza', 'Pınar Donuk Pizza', 230, 9, 28, 9, 1.5, 'hazır-yemek', 'Pınar', ['donuk pizza', 'pizza']),
  g('superfresh-patates', 'SuperFresh Donuk Patates', 160, 2, 26, 5, 2, 'hazır-yemek', 'SuperFresh', ['donuk patates'], [{ label: '1 avuç (100 g)', grams: 100 }, { label: '100 g', grams: 100 }]),
  g('pinar-donuk-borek', 'Pınar Donuk Sigara Böreği', 240, 7, 28, 11, 1, 'hazır-yemek', 'Pınar', ['börek', 'sigara böreği'], [{ label: '1 adet', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('dondurulmus-sebze', 'Dondurulmuş Karışık Sebze', 40, 2.5, 6, 0.3, 3, 'sebze', undefined, ['donuk sebze'], S_KASE),
  g('dondurulmus-bezelye', 'Dondurulmuş Bezelye', 77, 5, 14, 0.4, 5, 'sebze', undefined, ['donuk bezelye'], S_KASE),
  g('banvit-tavuk-nugget', 'Banvit Tavuk Nugget', 240, 14, 18, 12, 1, 'hazır-yemek', 'Banvit', ['nugget'], [{ label: '4 adet', grams: 80 }, { label: '100 g', grams: 100 }]),
  g('banvit-tavuk-schnitzel', 'Banvit Tavuk Şinitzel', 220, 14, 16, 11, 1, 'hazır-yemek', 'Banvit', ['şinitzel'], [{ label: '1 adet', grams: 100 }]),
  g('superfresh-karisik-meyve', 'SuperFresh Donuk Karışık Meyve', 55, 0.8, 12, 0.3, 2.5, 'meyve', 'SuperFresh', ['donuk meyve']),

  // ═══════════════════════════════════════════════════════════════════════════
  // HAZIR GIDALAR & KONSERVE & SOS
  // ═══════════════════════════════════════════════════════════════════════════
  // Çorba
  g('knorr-mercimek', 'Knorr Hazır Mercimek Çorbası', 65, 3.5, 10, 1.5, 2, 'çorba', 'Knorr', ['hazır çorba', 'mercimek']),
  g('knorr-domates', 'Knorr Hazır Domates Çorbası', 55, 1.5, 10, 1, 1, 'çorba', 'Knorr', ['hazır çorba', 'domates']),
  g('knorr-yayla', 'Knorr Hazır Yayla Çorbası', 60, 2, 8, 2, 0.5, 'çorba', 'Knorr', ['hazır çorba', 'yayla']),
  g('knorr-tavuk-suyu', 'Knorr Tavuk Suyu (Küp)', 150, 6, 12, 8, 0, 'çorba', 'Knorr', ['bouillon', 'küp', 'tavuk suyu'], [{ label: '1 küp', grams: 10 }, { label: '100 g', grams: 100 }]),

  // Makarna sosu
  g('barilla-napoletana', 'Barilla Soslar Napoletana', 54, 1.5, 8, 1.5, 1.5, 'hazır-yemek', 'Barilla', ['makarna sosu', 'domates sosu'], S_YKASIK),
  g('barilla-pesto', 'Barilla Pesto alla Genovese', 390, 5, 6, 39, 2, 'hazır-yemek', 'Barilla', ['pesto', 'makarna sosu'], S_YKASIK),
  g('knorr-makarna-sosu', 'Knorr Makarna Sosu (Kremalı)', 80, 2, 10, 3.5, 0.5, 'hazır-yemek', 'Knorr', ['makarna sosu']),

  // Konserve
  g('sera-domates-salcasi', 'Sera Domates Salçası', 80, 3, 14, 0.5, 3, 'diğer', 'Sera', ['salça', 'domates salçası'], S_YKASIK),
  g('tukas-domates-salcasi', 'Tukaş Domates Salçası', 80, 3, 14, 0.5, 3, 'diğer', 'Tukaş', ['salça'], S_YKASIK),
  g('sera-biber-salcasi', 'Sera Biber Salçası', 100, 3, 17, 2, 4, 'diğer', 'Sera', ['biber salçası'], S_YKASIK),
  g('tukas-konserve-bezelye', 'Tukaş Konserve Bezelye', 65, 4, 10, 0.3, 4, 'diğer', 'Tukaş', ['konserve bezelye']),
  g('sera-konserve-misir', 'Sera Konserve Mısır', 82, 2.7, 16, 1, 2, 'diğer', 'Sera', ['konserve mısır']),

  // Sos markaları
  g('heinz-ketcap', 'Heinz Ketçap', 112, 1.3, 26, 0.1, 0.3, 'diğer', 'Heinz', ['ketçap'], S_YKASIK),
  g('calve-mayonez', 'Calvé Mayonez', 720, 1, 1, 79, 0, 'diğer', 'Calvé', ['mayonez'], S_YKASIK),
  g('heinz-hardal', 'Heinz Hardal', 66, 4, 5, 3.3, 3.3, 'diğer', 'Heinz', ['hardal'], S_YKASIK),
  g('tamek-ketcap', 'Tamek Ketçap', 110, 1.2, 25, 0.2, 0.3, 'diğer', 'Tamek', ['ketçap'], S_YKASIK),
  g('bim-ketcap', 'BİM Ketçap', 108, 1.2, 25, 0.1, 0.3, 'diğer', 'BİM', ['ketçap'], S_YKASIK),
  g('a101-ketcap', 'A101 Ketçap', 108, 1.2, 25, 0.1, 0.3, 'diğer', 'A101', ['ketçap'], S_YKASIK),

  // Kahvaltılık spread markaları
  g('kemal-kukrer-recel', 'Kemal Kükrer Kayısı Reçeli', 250, 0.3, 62, 0, 1, 'diğer', 'Kemal Kükrer', ['reçel', 'kayısı reçeli'], S_YKASIK),
  g('tamek-recel', 'Tamek Çilek Reçeli', 255, 0.3, 63, 0, 0.8, 'diğer', 'Tamek', ['reçel', 'çilek reçeli'], S_YKASIK),
  g('sera-recel', 'Sera Vişne Reçeli', 260, 0.3, 64, 0, 0.5, 'diğer', 'Sera', ['reçel', 'vişne reçeli'], S_YKASIK),
  g('torku-banada-recel', 'Torku Banada Fındık Kreması', 545, 5, 57, 33, 2, 'diğer', 'Torku', ['banada', 'fındık kreması', 'çikolatalı krema'], S_YKASIK),
  g('balparmak-bal', 'Balparmak Bal', 320, 0.3, 80, 0, 0, 'diğer', 'Balparmak', ['bal'], S_YKASIK),
  g('altiparmak-bal', 'Altıparmak Bal', 320, 0.3, 80, 0, 0, 'diğer', 'Altıparmak', ['bal'], S_YKASIK),
  g('bim-bal', 'BİM Bal', 320, 0.3, 80, 0, 0, 'diğer', 'BİM', ['bal'], S_YKASIK),
  g('arifoğlu-tahin', 'Arifoğlu Tahin', 600, 17, 21, 53, 3, 'diğer', 'Arifoğlu', ['tahin'], S_YKASIK),
  g('koska-tahin-helvasi', 'Koska Tahin Helvası', 516, 12, 48, 31, 2, 'tatlı', 'Koska', ['tahin helvası', 'helva'], S_DILIM),

  // Yağ markaları
  g('komili-zeytinyagi', 'Komili Zeytinyağı (Sızma)', 884, 0, 0, 100, 0, 'diğer', 'Komili', ['zeytinyağı'], S_YKASIK),
  g('yudum-aycicek', 'Yudum Ayçiçek Yağı', 884, 0, 0, 100, 0, 'diğer', 'Yudum', ['ayçiçek yağı'], S_YKASIK),
  g('kristal-aycicek', 'Kristal Ayçiçek Yağı', 884, 0, 0, 100, 0, 'diğer', 'Kristal', ['ayçiçek yağı'], S_YKASIK),
  g('bim-zeytinyagi', 'BİM Zeytinyağı', 884, 0, 0, 100, 0, 'diğer', 'BİM', ['zeytinyağı'], S_YKASIK),
  g('tariş-zeytinyagi', 'Tariş Zeytinyağı (Sızma)', 884, 0, 0, 100, 0, 'diğer', 'Tariş', ['zeytinyağı'], S_YKASIK),
  g('luna-margarin', 'Luna Margarin', 720, 0.1, 0.1, 80, 0, 'diğer', 'Luna', ['margarin'], S_YKASIK),
  g('becel-margarin', 'Becel Margarin', 360, 0, 0, 40, 0, 'diğer', 'Becel', ['margarin'], S_YKASIK),

  // ═══════════════════════════════════════════════════════════════════════════
  // ATIŞTIRMALIK & ÇİKOLATA — A101/BİM/Migros markaları + eksikler
  // ═══════════════════════════════════════════════════════════════════════════
  // Eti eksik ürünler
  pc('eti-benimo', 'Eti Benimo', 430, 4, 56, 22, 2, 'atıştırmalık', 26, '1 adet', 'Eti', ['benimo']),
  pc('eti-adicto', 'Eti Adicto Browni', 445, 5.5, 52, 24, 2.5, 'atıştırmalık', 40, '1 adet', 'Eti', ['adicto', 'browni']),
  pc('eti-sut-burger', 'Eti Süt Burger', 470, 6, 60, 23, 1.5, 'atıştırmalık', 35, '1 adet', 'Eti', ['süt burger']),
  pc('eti-hosbis', 'Eti Hoşbiş', 480, 6, 58, 25, 1.5, 'atıştırmalık', 30, '1 adet', 'Eti', ['hoşbiş']),
  pc('eti-keloglan', 'Eti Keloğlan Bisküvi', 460, 7, 68, 18, 2, 'atıştırmalık', 45, '1 paket', 'Eti', ['keloğlan']),
  pc('eti-karam-bademli', 'Eti Karam Bademli Bitter', 540, 7, 50, 35, 4, 'atıştırmalık', 60, '1 tablet', 'Eti', ['karam', 'bitter']),
  pc('eti-karam-gold', 'Eti Karam Gold Çikolata', 560, 7, 52, 36, 2, 'atıştırmalık', 60, '1 tablet', 'Eti', ['karam gold']),
  pc('eti-wafrini', 'Eti Wafrini Gofret', 520, 5.5, 58, 30, 1, 'atıştırmalık', 24, '1 adet', 'Eti', ['gofret', 'wafrini']),

  // Ülker eksik ürünler
  pc('ulker-metro-karamel', 'Ülker Metro Karamel', 470, 5, 62, 23, 1.5, 'atıştırmalık', 36, '1 adet', 'Ülker', ['metro']),
  pc('ulker-laviva', 'Ülker Laviva', 480, 5.5, 56, 27, 2, 'atıştırmalık', 35, '1 adet', 'Ülker', ['laviva']),
  pc('ulker-bitter-80', 'Ülker Bitter %80', 580, 8, 28, 48, 10, 'atıştırmalık', 60, '1 tablet', 'Ülker', ['bitter']),
  pc('ulker-findikli-cikolata', 'Ülker Fındıklı Çikolata', 560, 8, 50, 36, 3, 'atıştırmalık', 60, '1 tablet', 'Ülker', ['fındıklı çikolata']),
  pc('ulker-antep-fistikli', 'Ülker Antep Fıstıklı Çikolata', 555, 9, 48, 37, 3, 'atıştırmalık', 60, '1 tablet', 'Ülker', ['antep fıstıklı']),
  pc('ulker-dankek', 'Dankek Kakaolu Kek', 400, 5, 54, 18, 2, 'atıştırmalık', 50, '1 adet', 'Ülker', ['dankek', 'kek']),
  pc('ulker-saklikoy', 'Ülker Saklıköy', 485, 6.5, 64, 22, 2.5, 'atıştırmalık', 30, '1 adet', 'Ülker', ['saklıköy']),
  pc('ulker-golf-cikolata', 'Ülker Golf Çikolata', 460, 5, 58, 24, 1.5, 'atıştırmalık', 18, '1 adet', 'Ülker', ['golf']),
  pc('ulker-cokomel', 'Ülker Çokomel', 390, 4, 68, 11, 1, 'atıştırmalık', 16, '1 adet', 'Ülker', ['çokomel', 'marshmallow']),

  // Uluslararası çikolata/atıştırmalık
  pc('ferrero-rocher', 'Ferrero Rocher', 575, 8, 42, 42, 2, 'atıştırmalık', 12.5, '1 adet', 'Ferrero', ['ferrero', 'rocher']),
  pc('raffaello', 'Raffaello', 615, 6.5, 38, 49, 1, 'atıştırmalık', 10, '1 adet', 'Ferrero', ['raffaello']),
  pc('mm-fistiksiz', "M&M's (Çikolatalı)", 480, 5, 66, 21, 1.5, 'atıştırmalık', 45, '1 paket', "M&M's", ['m&m', 'mm']),
  pc('mm-fistikli', "M&M's (Fıstıklı)", 510, 10, 58, 27, 2.5, 'atıştırmalık', 45, '1 paket', "M&M's", ['m&m', 'mm']),
  pc('after-eight', 'After Eight', 405, 2.5, 70, 13, 3, 'atıştırmalık', 8, '1 adet', 'After Eight', ['after eight']),
  pc('nutella-go', "Nutella & Go", 538, 6, 56, 32, 2, 'atıştırmalık', 52, '1 paket', 'Nutella', ['nutella go']),
  pc('kinder-joy', 'Kinder Joy', 560, 8, 48, 38, 1, 'atıştırmalık', 20, '1 adet', 'Kinder', ['kinder joy']),

  // Cips / çerez ekstra
  g('cipso', 'Cipso Cips', 530, 6, 55, 32, 3.5, 'atıştırmalık', 'Cipso', ['cips'], [{ label: '1 paket (70 g)', grams: 70 }, { label: '100 g', grams: 100 }]),
  g('lays-yogurt', "Lay's Yoğurtlu", 535, 6, 52, 33, 3, 'atıştırmalık', "Lay's", ['cips', 'yoğurtlu'], [{ label: '1 paket (70 g)', grams: 70 }, { label: '100 g', grams: 100 }]),
  g('ruffles-baharat', 'Ruffles Baharatlı', 520, 6, 55, 30, 3.5, 'atıştırmalık', 'Ruffles', ['cips', 'baharatlı'], [{ label: '1 paket (70 g)', grams: 70 }, { label: '100 g', grams: 100 }]),
  g('doritos-nacho', 'Doritos Nacho', 490, 7, 60, 24, 4, 'atıştırmalık', 'Doritos', ['cips', 'nacho'], [{ label: '1 paket (70 g)', grams: 70 }, { label: '100 g', grams: 100 }]),
  g('bim-cips', 'BİM Çerezza Cips', 525, 6, 54, 31, 3, 'atıştırmalık', 'BİM', ['cips', 'çerezza'], [{ label: '1 paket (70 g)', grams: 70 }, { label: '100 g', grams: 100 }]),
  g('a101-cips', 'A101 Cips', 525, 6, 54, 31, 3, 'atıştırmalık', 'A101', ['cips'], [{ label: '1 paket (70 g)', grams: 70 }, { label: '100 g', grams: 100 }]),
  g('belvita', 'Belvita Kahvaltılık Bisküvi', 450, 7, 68, 16, 4, 'atıştırmalık', 'Belvita', ['belvita', 'bisküvi'], [{ label: '1 paket (50 g)', grams: 50 }, { label: '100 g', grams: 100 }]),
  g('kelloggs-extra', "Kellogg's Extra Granola", 440, 8, 60, 18, 6, 'tahıl', "Kellogg's", ['granola', 'extra', 'gevrek'], [{ label: '1 kase (45 g)', grams: 45 }, { label: '100 g', grams: 100 }]),
  g('kelloggs-special-k', "Kellogg's Special K", 375, 14, 72, 2, 3, 'tahıl', "Kellogg's", ['special k', 'gevrek'], [{ label: '1 kase (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('kelloggs-crunchy', "Kellogg's Crunchy Müsli", 445, 8, 62, 18, 5, 'tahıl', "Kellogg's", ['müsli', 'gevrek'], [{ label: '1 kase (45 g)', grams: 45 }, { label: '100 g', grams: 100 }]),

  // ═══════════════════════════════════════════════════════════════════════════
  // TATLI — Eksik market tatlılar, puding markaları
  // ═══════════════════════════════════════════════════════════════════════════
  g('dr-oetker-puding-cikolata', 'Dr. Oetker Puding Çikolatalı', 120, 3, 19, 3.5, 0.5, 'tatlı', 'Dr. Oetker', ['puding', 'çikolatalı'], [{ label: '1 kase (125 g)', grams: 125 }, { label: '100 g', grams: 100 }]),
  g('dr-oetker-puding-vanilya', 'Dr. Oetker Puding Vanilyalı', 115, 2.8, 19, 3, 0, 'tatlı', 'Dr. Oetker', ['puding', 'vanilyalı'], [{ label: '1 kase (125 g)', grams: 125 }, { label: '100 g', grams: 100 }]),
  g('pinar-puding', 'Pınar Puding Çikolatalı', 125, 3.2, 20, 3.5, 0.5, 'tatlı', 'Pınar', ['puding'], [{ label: '1 kase (125 g)', grams: 125 }, { label: '100 g', grams: 100 }]),
  g('danone-danette', 'Danette Çikolatalı Puding', 130, 3.5, 20, 4, 0.5, 'tatlı', 'Danone', ['puding', 'danette'], [{ label: '1 kase (125 g)', grams: 125 }, { label: '100 g', grams: 100 }]),
  g('sutas-sutlac', 'Sütaş Sütlaç', 132, 3.5, 21, 3.6, 0, 'tatlı', 'Sütaş', ['sütlaç'], [{ label: '1 kase (150 g)', grams: 150 }, { label: '100 g', grams: 100 }]),
  g('sutas-kazandibi', 'Sütaş Kazandibi', 145, 3.8, 24, 3.8, 0, 'tatlı', 'Sütaş', ['kazandibi'], [{ label: '1 kase (150 g)', grams: 150 }, { label: '100 g', grams: 100 }]),
  g('sutas-profiterol', 'Sütaş Profiterol', 330, 5, 40, 17, 1, 'tatlı', 'Sütaş', ['profiterol'], [{ label: '1 kase (100 g)', grams: 100 }]),

  // ═══════════════════════════════════════════════════════════════════════════
  // HAZIR YEMEK & FAST FOOD MARKET ÜRÜNLERİ
  // ═══════════════════════════════════════════════════════════════════════════
  g('hazir-lahmacun', 'Hazır Lahmacun', 235, 10, 30, 8, 1.5, 'hazır-yemek', undefined, ['lahmacun']),
  g('hazir-pide-kasarli', 'Hazır Pide (Kaşarlı)', 260, 11, 32, 10, 1.5, 'hazır-yemek', undefined, ['pide']),
  g('hazir-naan-ekmegi', 'Naan Ekmeği', 290, 9, 52, 5, 2, 'ekmek', undefined, ['naan', 'hint ekmeği']),
  g('hazir-pilav-reis', 'Reis Hazır Pilav', 150, 3, 28, 2.5, 0.5, 'hazır-yemek', 'Reis', ['hazır pilav'], [{ label: '1 paket (250 g)', grams: 250 }, { label: '100 g', grams: 100 }]),
  g('hazir-makarna-knorr', 'Knorr Hazır Makarna', 130, 4, 22, 3, 1, 'hazır-yemek', 'Knorr', ['hazır makarna']),

  // ═══════════════════════════════════════════════════════════════════════════
  // KURUYEMİŞ — Marka çeşitleri
  // ═══════════════════════════════════════════════════════════════════════════
  g('tadim-fistik', 'Tadım Yer Fıstığı', 567, 26, 16, 49, 8, 'kuruyemiş', 'Tadım', ['yer fıstığı'], [{ label: '1 avuç (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('tadim-badem', 'Tadım Badem', 575, 21, 22, 49, 12, 'kuruyemiş', 'Tadım', ['badem'], [{ label: '1 avuç (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('tadim-fındik', 'Tadım Fındık', 628, 15, 17, 61, 10, 'kuruyemiş', 'Tadım', ['fındık'], [{ label: '1 avuç (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('tadim-antep-fistigi', 'Tadım Antep Fıstığı', 560, 20, 28, 45, 10, 'kuruyemiş', 'Tadım', ['antep fıstığı'], [{ label: '1 avuç (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('tadim-kaju', 'Tadım Kaju', 553, 18, 30, 44, 3, 'kuruyemiş', 'Tadım', ['kaju'], [{ label: '1 avuç (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('tadim-ceviz', 'Tadım Ceviz İçi', 654, 15, 14, 65, 7, 'kuruyemiş', 'Tadım', ['ceviz'], [{ label: '1 avuç (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('bim-kuruyemis', 'BİM Karışık Kuruyemiş', 595, 18, 20, 52, 7, 'kuruyemiş', 'BİM', ['karışık kuruyemiş'], [{ label: '1 avuç (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('a101-leblebi', 'A101 Leblebi', 370, 22, 56, 6, 5, 'kuruyemiş', 'A101', ['leblebi'], [{ label: '1 avuç (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),

  // ═══════════════════════════════════════════════════════════════════════════
  // HAZIR YEMEK (Market) — Döner, pide, lahmacun, gözleme
  // ═══════════════════════════════════════════════════════════════════════════
  g('mercimek-kofte', 'Mercimek Köftesi', 220, 8, 34, 6, 5, 'hazır-yemek', undefined, ['mercimek köfte']),
  g('sigara-boregi-market', 'Sigara Böreği (Hazır)', 280, 8, 28, 15, 1.5, 'hazır-yemek', undefined, ['sigara böreği']),
  g('ispanakli-borek-market', 'Ispanaklı Börek (Hazır)', 250, 8, 26, 13, 2, 'hazır-yemek', undefined, ['ıspanaklı börek']),
  g('patatesli-borek-market', 'Patatesli Börek (Hazır)', 270, 6, 30, 14, 2, 'hazır-yemek', undefined, ['patatesli börek']),
  g('etli-ekmek', 'Etli Ekmek', 220, 12, 24, 8, 1.5, 'hazır-yemek', undefined, ['etli ekmek']),
  g('ic-pilav', 'İç Pilav', 200, 5, 30, 7, 2, 'hazır-yemek', undefined, ['iç pilav', 'fıstıklı pilav']),
  g('nohutlu-pilav', 'Nohutlu Pilav', 180, 5, 30, 4, 3, 'hazır-yemek', undefined, ['nohutlu pilav']),
  g('makarna-bolonez', 'Makarna Bolonez', 150, 7, 18, 5.5, 1.5, 'hazır-yemek', undefined, ['bolonez', 'makarna']),
  g('makarna-kremasoslu', 'Kremalı Makarna', 185, 6, 22, 8, 1, 'hazır-yemek', undefined, ['kremalı makarna']),
  g('bezelye-yemegi', 'Bezelye Yemeği', 90, 4, 12, 3, 4, 'hazır-yemek', undefined, ['bezelye yemeği']),
  g('zeytinyagli-yaprak-sarma', 'Zeytinyağlı Yaprak Sarma', 195, 3, 22, 10, 2.5, 'hazır-yemek', undefined, ['yaprak sarma']),
  g('patlican-musakka', 'Patlıcan Musakka', 130, 6, 10, 7.5, 2, 'hazır-yemek', undefined, ['musakka']),
  g('hamsili-pilav', 'Hamsili Pilav', 185, 10, 22, 6.5, 0.5, 'hazır-yemek', undefined, ['hamsili pilav']),
  g('coban-salata', 'Çoban Salatası', 45, 1, 5, 2.5, 1.5, 'sebze', undefined, ['çoban salatası', 'salata']),
  g('mevsim-salata', 'Mevsim Salatası', 35, 1.5, 4, 1.5, 2, 'sebze', undefined, ['mevsim salata', 'salata']),
]

// ═══════════════════════════════════════════════════════════════════════════════
// GENİŞ VERİTABANI GENİŞLETMESİ — Tüm kategorilerden eksik besinler
// USDA FoodData Central + Türk Gıda Kodeksi referans değerleri
// ═══════════════════════════════════════════════════════════════════════════════
const EXPANSION_FOODS: TurkishFood[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PROTEİN — Et, Balık, Deniz Ürünleri, Yumurta çeşitleri
  // ═══════════════════════════════════════════════════════════════════════════
  g('dana-bonfile', 'Dana Bonfile (Izgara)', 271, 26, 0, 18, 0, 'protein', undefined, ['bonfile']),
  g('dana-antrikot', 'Dana Antrikot (Izgara)', 250, 27, 0, 15, 0, 'protein', undefined, ['antrikot']),
  g('dana-but', 'Dana But (Fırın)', 180, 28, 0, 7, 0, 'protein', undefined, ['dana but']),
  g('dana-kiyma-yagli', 'Dana Kıyma (Yağlı %20)', 254, 17, 0, 20, 0, 'protein', undefined, ['kıyma']),
  g('dana-dil', 'Dana Dil (Haşlanmış)', 224, 16, 0, 17, 0, 'protein', undefined, ['dana dil']),
  g('dana-bobrek', 'Dana Böbrek', 99, 17, 0, 3, 0, 'protein', undefined, ['böbrek']),
  g('dana-yürek', 'Dana Yürek', 112, 17, 0.1, 4, 0, 'protein', undefined, ['yürek']),
  g('kuzu-pirzola-izgara', 'Kuzu Pirzola (Izgara)', 282, 26, 0, 19, 0, 'protein', undefined, ['pirzola']),
  g('kuzu-incik', 'Kuzu İncik (Fırın)', 220, 25, 0, 13, 0, 'protein', undefined, ['incik']),
  g('kuzu-kol', 'Kuzu Kol (Fırın)', 235, 24, 0, 15, 0, 'protein', undefined, ['kuzu kol']),
  g('kuzu-ciger', 'Kuzu Ciğer (Izgara)', 165, 26, 2.8, 5.5, 0, 'protein', undefined, ['ciğer']),
  g('kuzu-kiyma', 'Kuzu Kıyma', 282, 17, 0, 23, 0, 'protein', undefined, ['kuzu kıyma']),
  g('tavuk-but-derisiz-firin', 'Tavuk But (Fırın, derisiz)', 190, 27, 0, 9, 0, 'protein', undefined, ['tavuk but']),
  g('tavuk-kanat-izgara', 'Tavuk Kanat (Izgara)', 203, 30, 0, 8.1, 0, 'protein', undefined, ['kanat']),
  g('tavuk-baget-izgara', 'Tavuk Baget (Izgara)', 172, 28, 0, 6, 0, 'protein', undefined, ['baget']),
  g('tavuk-sinitzel', 'Tavuk Şinitzel', 260, 16, 15, 15, 1, 'protein', undefined, ['şinitzel']),
  g('tavuk-sis-izgara', 'Tavuk Şiş (Izgara)', 180, 28, 2, 6.5, 0.5, 'protein', undefined, ['tavuk şiş']),
  g('hindi-but', 'Hindi But (Fırın)', 158, 28, 0, 5, 0, 'protein', undefined, ['hindi but']),
  g('hindi-kiyma', 'Hindi Kıyma', 150, 21, 0, 7, 0, 'protein', undefined, ['hindi kıyma']),
  g('bildircin-yumurtasi', 'Bıldırcın Yumurtası', 158, 13, 0.4, 11, 0, 'protein', undefined, ['bıldırcın'], [{ label: '1 adet', grams: 9 }, { label: '100 g', grams: 100 }]),
  g('yumurta-akı', 'Yumurta Akı', 52, 11, 0.7, 0.2, 0, 'protein', undefined, ['yumurta beyazı'], [{ label: '1 adet', grams: 33 }, { label: '100 g', grams: 100 }]),
  g('yumurta-sarisi', 'Yumurta Sarısı', 322, 16, 3.6, 27, 0, 'protein', undefined, ['yumurta sarısı'], [{ label: '1 adet', grams: 17 }, { label: '100 g', grams: 100 }]),
  // Balık & Deniz ürünleri
  g('hamsi-tava', 'Hamsi (Tava)', 210, 20, 6, 12, 0, 'protein', undefined, ['hamsi']),
  g('sardalya-tava', 'Sardalya (Tava)', 208, 25, 0, 11, 0, 'protein', undefined, ['sardalya']),
  g('sardalya-konserve', 'Sardalya (Konserve, Yağda)', 208, 25, 0, 11, 0, 'protein', undefined, ['sardalya konserve']),
  g('istavrit', 'İstavrit (Tava)', 175, 18, 5, 9, 0, 'protein', undefined, ['istavrit']),
  g('lufer-izgara', 'Lüfer (Izgara)', 159, 26, 0, 5.6, 0, 'protein', undefined, ['lüfer']),
  g('tekir-izgara', 'Tekir (Izgara)', 128, 22, 0, 4, 0, 'protein', undefined, ['tekir']),
  g('kalkan-izgara', 'Kalkan (Izgara)', 95, 20, 0, 1.5, 0, 'protein', undefined, ['kalkan']),
  g('barbun-tava', 'Barbun (Tava)', 172, 20, 5, 8, 0, 'protein', undefined, ['barbun']),
  g('kefal-izgara', 'Kefal (Izgara)', 117, 19, 0, 4, 0, 'protein', undefined, ['kefal']),
  g('somon-fume', 'Füme Somon', 117, 18, 0, 4.3, 0, 'protein', undefined, ['füme somon']),
  g('karides-haslama', 'Karides (Haşlanmış)', 99, 24, 0.2, 0.3, 0, 'protein', undefined, ['karides']),
  g('midye-dolma-adet', 'Midye Dolma', 172, 8, 18, 7, 1, 'protein', undefined, ['midye'], [{ label: '1 adet', grams: 30 }, { label: '10 adet', grams: 300 }, { label: '100 g', grams: 100 }]),
  g('kalamar-tava', 'Kalamar (Tava)', 175, 18, 8, 7.5, 0, 'protein', undefined, ['kalamar']),
  g('ahtapot-izgara', 'Ahtapot (Izgara)', 164, 30, 4.4, 2, 0, 'protein', undefined, ['ahtapot']),
  g('istakoz-haslama', 'Istakoz (Haşlanmış)', 89, 19, 0, 0.5, 0, 'protein', undefined, ['istakoz', 'lobster']),
  g('pavurya', 'Pavurya (Yengeç)', 87, 18, 0, 1.1, 0, 'protein', undefined, ['yengeç', 'pavurya']),
  g('levrek-buhar', 'Levrek (Buharda)', 110, 23, 0, 2, 0, 'protein', undefined, ['levrek']),
  g('alabalik-izgara', 'Alabalık (Izgara)', 190, 27, 0, 9, 0, 'protein', undefined, ['alabalık']),

  // ═══════════════════════════════════════════════════════════════════════════
  // MEYVE — Kapsamlı meyve listesi
  // ═══════════════════════════════════════════════════════════════════════════
  pc('seftali', 'Şeftali', 39, 0.9, 10, 0.3, 1.5, 'meyve', 150, '1 adet'),
  pc('kayisi', 'Kayısı', 48, 1.4, 11, 0.4, 2, 'meyve', 35, '1 adet'),
  pc('erik-taze', 'Erik', 46, 0.7, 11, 0.3, 1.4, 'meyve', 66, '1 adet'),
  pc('visne', 'Vişne', 50, 1, 12, 0.3, 1.6, 'meyve', 5, '1 adet'),
  pc('kiraz-taze', 'Kiraz', 50, 1, 12, 0.3, 1.6, 'meyve', 8, '1 adet'),
  pc('mandalina-taze', 'Mandalina', 53, 0.8, 13, 0.3, 1.8, 'meyve', 88, '1 adet'),
  pc('greyfurt-taze', 'Greyfurt', 42, 0.8, 11, 0.1, 1.6, 'meyve', 230, '1 adet'),
  pc('nar-taze', 'Nar', 83, 1.7, 19, 1.2, 4, 'meyve', 200, '1 adet'),
  pc('incir-taze', 'Taze İncir', 74, 0.8, 19, 0.3, 2.9, 'meyve', 50, '1 adet'),
  pc('kivi-taze', 'Kivi', 61, 1.1, 15, 0.5, 3, 'meyve', 76, '1 adet'),
  pc('mango-taze', 'Mango', 60, 0.8, 15, 0.4, 1.6, 'meyve', 200, '1 adet'),
  pc('ananas-taze', 'Ananas', 50, 0.5, 13, 0.1, 1.4, 'meyve', 905, '1 adet'),
  pc('kavun-taze', 'Kavun', 34, 0.8, 8.2, 0.2, 0.9, 'meyve', 200, '1 dilim'),
  g('ahududu', 'Ahududu', 52, 1.2, 12, 0.7, 6.5, 'meyve'),
  g('bogurtlen', 'Böğürtlen', 43, 1.4, 10, 0.5, 5.3, 'meyve'),
  g('yaban-mersini', 'Yaban Mersini (Blueberry)', 57, 0.7, 14, 0.3, 2.4, 'meyve', undefined, ['blueberry', 'yabanmersini']),
  g('hurma-taze', 'Hurma', 277, 1.8, 75, 0.2, 6.7, 'meyve', undefined, undefined, [{ label: '1 adet', grams: 24 }, { label: '100 g', grams: 100 }]),
  g('kuru-uzum', 'Kuru Üzüm', 299, 3.1, 79, 0.5, 3.7, 'meyve', undefined, undefined, [{ label: '1 avuç (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('kuru-kayisi', 'Kuru Kayısı', 241, 3.4, 63, 0.5, 7.3, 'meyve', undefined, undefined, [{ label: '5 adet (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('kuru-incir', 'Kuru İncir', 249, 3.3, 64, 0.9, 9.8, 'meyve', undefined, undefined, [{ label: '2 adet (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('kuru-erik-taze', 'Kuru Erik', 240, 2.2, 64, 0.4, 7.1, 'meyve', undefined, undefined, [{ label: '3 adet (25 g)', grams: 25 }, { label: '100 g', grams: 100 }]),
  g('kuru-dut', 'Kuru Dut', 350, 4, 82, 2, 4, 'meyve'),
  g('kurutulmus-ananas', 'Kurutulmuş Ananas', 325, 1.5, 82, 0.4, 4, 'meyve'),
  g('kurutulmus-mango', 'Kurutulmuş Mango', 314, 2.5, 78, 0.8, 6, 'meyve'),
  g('cranberry-kuru', 'Kurutulmuş Cranberry', 308, 0.1, 82, 1.4, 5.7, 'meyve', undefined, ['kızılcık']),

  // ═══════════════════════════════════════════════════════════════════════════
  // SEBZE — Kapsamlı sebze listesi
  // ═══════════════════════════════════════════════════════════════════════════
  g('ispanak-pismis', 'Ispanak (Pişmiş)', 23, 2.9, 3.6, 0.3, 2.2, 'sebze', undefined, ['ıspanak']),
  g('ispanak-cig', 'Ispanak (Çiğ)', 23, 2.9, 3.6, 0.4, 2.2, 'sebze', undefined, ['ıspanak']),
  g('kabak-pismis', 'Kabak (Pişmiş)', 17, 1.2, 3.4, 0.3, 1, 'sebze'),
  g('kabak-cig', 'Kabak (Çiğ)', 17, 1.2, 3.1, 0.3, 1, 'sebze'),
  g('patlican-izgara', 'Patlıcan (Izgara)', 35, 0.8, 8, 0.2, 3, 'sebze', undefined, ['patlıcan']),
  g('patlican-kizartma', 'Patlıcan (Kızartma)', 170, 0.8, 8.5, 15, 2.5, 'sebze', undefined, ['patlıcan']),
  g('biber-dolmasi-pismis', 'Biber Dolması', 120, 5, 12, 6, 2, 'hazır-yemek', undefined, ['dolma']),
  g('yesil-biber', 'Yeşil Biber', 20, 0.9, 4.6, 0.2, 1.7, 'sebze', undefined, undefined, [{ label: '1 adet', grams: 75 }, { label: '100 g', grams: 100 }]),
  g('kirmizi-biber', 'Kırmızı Biber', 31, 1, 6, 0.3, 2.1, 'sebze', undefined, ['kapya'], [{ label: '1 adet', grams: 120 }, { label: '100 g', grams: 100 }]),
  g('sogan-kuru', 'Soğan', 40, 1.1, 9.3, 0.1, 1.7, 'sebze', undefined, undefined, [{ label: '1 orta', grams: 110 }, { label: '100 g', grams: 100 }]),
  g('mantar-cig', 'Mantar (Çiğ)', 22, 3.1, 3.3, 0.3, 1, 'sebze', undefined, ['kültür mantarı']),
  g('mantar-sote', 'Mantar (Sote)', 65, 3, 4, 4, 1, 'sebze', undefined, ['mantar sote']),
  g('bamya-pismis', 'Bamya (Pişmiş)', 33, 1.9, 7.5, 0.2, 3.2, 'sebze'),
  g('karnabahar-pismis', 'Karnabahar (Pişmiş)', 23, 1.8, 4.1, 0.5, 2.3, 'sebze'),
  g('karnabahar-cig', 'Karnabahar (Çiğ)', 25, 1.9, 5, 0.3, 2, 'sebze'),
  g('brokoli-cig', 'Brokoli (Çiğ)', 34, 2.8, 6.6, 0.4, 2.6, 'sebze'),
  g('lahana-beyaz', 'Beyaz Lahana', 25, 1.3, 5.8, 0.1, 2.5, 'sebze', undefined, ['lahana']),
  g('kirmizi-lahana', 'Kırmızı Lahana', 31, 1.4, 7.4, 0.2, 2.1, 'sebze'),
  g('bruksel-lahanasi', 'Brüksel Lahanası (Pişmiş)', 36, 3.4, 7.1, 0.5, 2.6, 'sebze'),
  g('kereviz-sapli', 'Saplı Kereviz', 14, 0.7, 3, 0.2, 1.6, 'sebze', undefined, ['kereviz']),
  g('kereviz-yumru', 'Kereviz (Yumru)', 42, 1.5, 9.2, 0.3, 1.8, 'sebze'),
  g('taze-fasulye-pismis', 'Taze Fasulye (Zeytinyağlı)', 75, 2, 7, 4, 3, 'sebze'),
  g('barbunya-pilaki', 'Barbunya Pilaki', 138, 7, 18, 4, 6, 'hazır-yemek', undefined, ['barbunya']),
  g('roka-cig', 'Roka', 25, 2.6, 3.7, 0.7, 1.6, 'sebze'),
  g('tere-cig', 'Tere', 32, 2.6, 5.5, 0.7, 1.1, 'sebze'),
  g('avokado-yari', 'Avokado (Yarım)', 160, 2, 8.5, 14.7, 6.7, 'meyve', undefined, ['avokado'], [{ label: 'Yarım adet', grams: 75 }, { label: '100 g', grams: 100 }]),
  g('tatli-patates', 'Tatlı Patates (Haşlanmış)', 90, 2, 21, 0.1, 3, 'sebze', undefined, ['tatlı patates', 'sweet potato']),
  g('tatli-patates-firin', 'Tatlı Patates (Fırın)', 103, 2.3, 24, 0.1, 3.3, 'sebze', undefined, ['tatlı patates']),
  g('bezelye-pismis', 'Bezelye (Pişmiş)', 84, 5.4, 16, 0.2, 5.7, 'sebze'),
  g('sogan-yesil', 'Yeşilsoğan', 32, 1.8, 7.3, 0.2, 2.6, 'sebze', undefined, ['yeşil soğan']),
  g('salata-iceberg', 'Iceberg Marul', 14, 0.9, 3, 0.1, 1.2, 'sebze'),
  g('taze-fasulye-cig', 'Taze Fasulye (Çiğ)', 31, 1.8, 7, 0.1, 2.7, 'sebze'),
  g('kabak-cekirdeği', 'Kabak Çekirdeği', 559, 30, 11, 49, 6, 'kuruyemiş'),
  g('ay-cekirdegi', 'Ay Çekirdeği', 584, 21, 20, 51, 8.6, 'kuruyemiş', undefined, ['ayçekirdeği', 'çekirdek']),
  g('tursu-karisik', 'Turşu (Karışık)', 15, 0.5, 3, 0.2, 1, 'sebze', undefined, ['turşu'], [{ label: '1 adet', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('zeytinyagli-enginar', 'Zeytinyağlı Enginar', 80, 2, 9, 4, 3, 'hazır-yemek', undefined, ['enginar']),
  g('zeytinyagli-barbunya', 'Zeytinyağlı Barbunya', 138, 7, 18, 4, 6, 'hazır-yemek', undefined, ['barbunya']),
  g('zeytinyagli-kereviz', 'Zeytinyağlı Kereviz', 70, 1.5, 8, 4, 2, 'hazır-yemek', undefined, ['kereviz']),
  g('zeytinyagli-pirasa', 'Zeytinyağlı Pırasa', 80, 1, 8, 5, 2, 'hazır-yemek', undefined, ['pırasa']),

  // ═══════════════════════════════════════════════════════════════════════════
  // SÜT ÜRÜNLERİ — Peynir, Yoğurt, Süt çeşitleri
  // ═══════════════════════════════════════════════════════════════════════════
  g('cheddar-peyniri', 'Cheddar Peyniri', 403, 25, 1.3, 33, 0, 'süt-ürünü', undefined, ['cheddar'], S_DILIM),
  g('dil-peyniri', 'Dil Peyniri', 280, 22, 1, 21, 0, 'süt-ürünü', undefined, ['dil peyniri'], S_DILIM),
  g('hellim-peyniri', 'Hellim Peyniri', 321, 25, 1.7, 25, 0, 'süt-ürünü', undefined, ['hellim', 'halloumi'], S_DILIM),
  g('tulum-peyniri', 'Tulum Peyniri', 340, 24, 1, 27, 0, 'süt-ürünü', undefined, ['tulum'], S_DILIM),
  g('cokelek-peynir', 'Çökelek', 105, 15, 3, 3.5, 0, 'süt-ürünü', undefined, ['çökelek']),
  g('mozzarella', 'Mozzarella Peyniri', 280, 28, 3.1, 17, 0, 'süt-ürünü', undefined, ['mozzarella'], S_DILIM),
  g('krem-peynir', 'Krem Peynir', 342, 6, 4, 34, 0, 'süt-ürünü', undefined, ['krem peynir', 'philadelphia'], S_YKASIK),
  g('ricotta', 'Ricotta Peyniri', 174, 11, 3, 13, 0, 'süt-ürünü', undefined, ['ricotta']),
  g('parmesan', 'Parmesan Peyniri', 431, 38, 4.1, 29, 0, 'süt-ürünü', undefined, ['parmesan', 'parmigiano'], [{ label: '1 yemek kaşığı (10 g)', grams: 10 }, { label: '100 g', grams: 100 }]),
  g('otlu-peynir', 'Otlu Peynir (Van)', 280, 17, 1, 23, 0, 'süt-ürünü', undefined, ['otlu peynir', 'van peyniri'], S_DILIM),
  g('mihaliç-peyniri', 'Mihaliç Peyniri', 390, 28, 0.5, 30, 0, 'süt-ürünü', undefined, ['mihaliç'], S_DILIM),
  g('light-yogurt', 'Light Yoğurt', 35, 4, 4.5, 0.2, 0, 'süt-ürünü', undefined, ['diyet yoğurt']),
  g('meyveli-yogurt', 'Meyveli Yoğurt', 90, 3.5, 14, 1.8, 0.5, 'süt-ürünü', undefined, ['meyveli yoğurt']),
  g('greek-yogurt', 'Greek Yoğurt', 97, 9, 3.6, 5, 0, 'süt-ürünü', undefined, ['yunan yoğurdu', 'greek']),
  g('skyr-yogurt', 'Skyr Yoğurt', 63, 11, 4, 0.2, 0, 'süt-ürünü', undefined, ['skyr']),
  g('icim-protein-sut', 'İçim Protein Süt', 55, 8, 4, 0.5, 0, 'süt-ürünü', 'İçim', ['protein süt'], S_KUTU250),
  g('laktozsuz-sut', 'Laktozsuz Süt', 47, 3.3, 4.8, 1.6, 0, 'süt-ürünü', undefined, ['laktozsuz']),
  g('kakaolu-sut', 'Kakaolu Süt', 61, 3, 9.5, 1.5, 0.3, 'içecek', undefined, ['çikolatalı süt'], S_KUTU),
  g('meyveli-kefir', 'Meyveli Kefir', 65, 3, 8, 2, 0.3, 'süt-ürünü', undefined, ['meyveli kefir']),
  g('kaymak', 'Kaymak', 292, 2, 3, 30, 0, 'süt-ürünü', undefined, undefined, S_YKASIK),

  // ═══════════════════════════════════════════════════════════════════════════
  // TAHIL & PİLAV — Çeşitli tahıllar ve pirinç türleri
  // ═══════════════════════════════════════════════════════════════════════════
  g('pirinc-cig', 'Pirinç (Çiğ)', 360, 6.5, 80, 0.6, 0.4, 'tahıl', undefined, ['pirinç']),
  g('bulgur-cig', 'Bulgur (Çiğ)', 342, 12, 70, 1.3, 12, 'tahıl', undefined, ['bulgur']),
  g('basmati-pilav', 'Basmati Pilavı (Pişmiş)', 130, 3, 28, 0.4, 0.4, 'tahıl', undefined, ['basmati']),
  g('sehriyeli-pirinc-pilavi', 'Şehriyeli Pirinç Pilavı', 145, 3, 27, 3, 0.5, 'tahıl', undefined, ['şehriyeli pilav']),
  g('eriste-haslanmis', 'Erişte (Haşlanmış)', 138, 4, 26, 2, 1.5, 'tahıl', undefined, ['erişte']),
  g('kuskus-haslanmis', 'Kuskus (Haşlanmış)', 112, 3.8, 23, 0.2, 1.4, 'tahıl', undefined, ['kuskus']),
  g('musli-genel', 'Müsli', 375, 9, 66, 7, 8, 'tahıl', undefined, ['müsli'], [{ label: '1 kase (50 g)', grams: 50 }, { label: '100 g', grams: 100 }]),
  g('misir-gevregi', 'Mısır Gevreği', 357, 7, 84, 0.9, 3.3, 'tahıl', undefined, ['corn flakes', 'mısır gevreği'], [{ label: '1 kase (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('pirinc-patlagi', 'Pirinç Patlağı', 387, 8, 82, 3, 3, 'tahıl', undefined, ['pirinç patlağı'], [{ label: '1 adet', grams: 8 }, { label: '100 g', grams: 100 }]),
  g('yulaf-sutu', 'Yulaf Sütü', 44, 0.3, 6.7, 1.5, 0.8, 'içecek', undefined, ['oat milk'], S_BARDAK),
  g('beyaz-un', 'Beyaz Un', 364, 10, 76, 1, 2.7, 'tahıl', undefined, ['un']),
  g('misir-unu', 'Mısır Unu', 362, 7, 77, 2, 5, 'tahıl', undefined, ['mısır unu']),
  g('nisasta', 'Nişasta', 381, 0.3, 91, 0.1, 0, 'tahıl', undefined, ['mısır nişastası']),
  g('galeta-unu', 'Galeta Unu', 395, 12, 75, 5, 4, 'tahıl', undefined, ['galeta unu']),
  g('irmik-cig', 'İrmik (Çiğ)', 360, 13, 73, 1, 3.9, 'tahıl', undefined, ['irmik']),
  g('irmik-helvasi', 'İrmik Helvası', 340, 5, 45, 16, 1, 'tatlı', undefined, ['irmik helvası']),

  // ═══════════════════════════════════════════════════════════════════════════
  // EKMEK — Çeşitli ekmek türleri
  // ═══════════════════════════════════════════════════════════════════════════
  pc('kepek-ekmegi', 'Kepek Ekmeği', 250, 13, 44, 3.5, 7.5, 'ekmek', 30, '1 dilim'),
  pc('eksi-mayali-ekmek', 'Ekşi Mayalı Ekmek', 274, 10, 51, 3, 4, 'ekmek', 40, '1 dilim'),
  pc('cavdar-ekmegi', 'Çavdar Ekmeği', 259, 9, 48, 3.3, 5.8, 'ekmek', 32, '1 dilim'),
  pc('glutensiz-ekmek', 'Glutensiz Ekmek', 240, 3, 48, 4, 3, 'ekmek', 25, '1 dilim'),
  pc('bazlama', 'Bazlama', 280, 8, 50, 5, 2, 'ekmek', 100, '1 adet'),
  pc('gozleme-peynirli', 'Gözleme (Peynirli)', 250, 9, 30, 10, 2, 'ekmek', 150, '1 adet'),
  pc('acma-ekmek', 'Açma', 340, 7, 42, 16, 1.5, 'ekmek', 70, '1 adet'),
  pc('yufka-ekmek', 'Yufka', 310, 9, 60, 3.5, 2, 'ekmek', 60, '1 yaprak'),
  pc('galeta-genel', 'Galeta / Grissini', 410, 11, 72, 8, 3, 'ekmek', 10, '1 adet'),
  pc('tost-ekmegi-dilim', 'Tost Ekmeği', 270, 8, 50, 4, 2, 'ekmek', 30, '1 dilim'),
  pc('hamburger-ekmegi', 'Hamburger Ekmeği', 280, 8.5, 50, 4.5, 2, 'ekmek', 55, '1 adet'),
  pc('sandvic-ekmegi', 'Sandviç Ekmeği', 270, 8, 50, 4, 2.5, 'ekmek', 30, '1 dilim'),

  // ═══════════════════════════════════════════════════════════════════════════
  // ÇORBA — Türk mutfağı çorbaları
  // ═══════════════════════════════════════════════════════════════════════════
  g('domates-corbasi', 'Domates Çorbası', 39, 1, 7, 0.8, 1, 'çorba', undefined, ['domates çorbası'], S_KASE),
  g('ezogelin-corbasi', 'Ezogelin Çorbası', 55, 3, 9, 1, 2, 'çorba', undefined, ['ezogelin'], S_KASE),
  g('tarhana-corbasi', 'Tarhana Çorbası', 60, 2.5, 8, 2, 1.5, 'çorba', undefined, ['tarhana'], S_KASE),
  g('yayla-corbasi', 'Yayla Çorbası', 50, 2, 6, 2, 0.5, 'çorba', undefined, ['yayla'], S_KASE),
  g('tavuk-suyu-corba', 'Tavuk Suyu Çorbası', 36, 2.5, 4, 1, 0.3, 'çorba', undefined, ['tavuk suyu'], S_KASE),
  g('dügün-corbasi', 'Düğün Çorbası', 70, 3, 6, 4, 0.5, 'çorba', undefined, ['düğün'], S_KASE),
  g('sehriye-corbasi', 'Şehriye Çorbası', 48, 2, 8, 1, 0.5, 'çorba', undefined, ['şehriye çorbası'], S_KASE),
  g('kremali-mantar-corbasi', 'Kremalı Mantar Çorbası', 65, 1.5, 6, 4, 0.5, 'çorba', undefined, ['mantar çorbası'], S_KASE),
  g('paça-corbasi', 'Paça Çorbası', 50, 4, 2, 3, 0, 'çorba', undefined, ['paça', 'kelle paça'], S_KASE),
  g('isgara-corbasi', 'Işkembe Çorbası', 52, 5, 3, 2, 0, 'çorba', undefined, ['işkembe'], S_KASE),
  g('sebze-corbasi', 'Sebze Çorbası', 35, 1.5, 5, 1, 1.5, 'çorba', undefined, ['sebze çorbası'], S_KASE),
  g('kremali-brokoli-corbasi', 'Kremalı Brokoli Çorbası', 55, 2, 5, 3, 1, 'çorba', undefined, ['brokoli çorbası'], S_KASE),
  g('balkabagi-corbasi', 'Balkabağı Çorbası', 40, 1, 7, 1, 1, 'çorba', undefined, ['balkabağı çorbası'], S_KASE),

  // ═══════════════════════════════════════════════════════════════════════════
  // BAKLİYAT — Çeşitli bakliyat türleri
  // ═══════════════════════════════════════════════════════════════════════════
  g('kirmizi-mercimek-cig', 'Kırmızı Mercimek (Çiğ)', 340, 24, 60, 1.1, 11, 'bakliyat', undefined, ['mercimek']),
  g('yesil-mercimek-cig', 'Yeşil Mercimek (Çiğ)', 352, 25, 63, 1, 11, 'bakliyat', undefined, ['mercimek']),
  g('nohut-cig', 'Nohut (Çiğ)', 364, 19, 61, 6, 12.2, 'bakliyat', undefined, ['nohut']),
  g('kuru-fasulye-cig', 'Kuru Fasulye (Çiğ)', 333, 21, 60, 1.2, 15, 'bakliyat', undefined, ['fasulye']),
  g('barbunya-haslanmis', 'Barbunya (Haşlanmış)', 143, 9, 26, 0.5, 9, 'bakliyat', undefined, ['barbunya']),
  g('borulce-haslanmis', 'Börülce (Haşlanmış)', 116, 8, 21, 0.5, 6.5, 'bakliyat', undefined, ['börülce']),
  g('fasulye-haslanmis', 'Fasulye (Haşlanmış)', 127, 8.7, 23, 0.5, 6.4, 'bakliyat', undefined, ['fasulye']),
  g('soya-fasulyesi', 'Soya Fasulyesi (Haşlanmış)', 173, 17, 10, 9, 6, 'bakliyat', undefined, ['soya']),
  g('bezelye-kuru', 'Bezelye (Kuru, Haşlanmış)', 118, 8.3, 21, 0.4, 8.3, 'bakliyat', undefined, ['kuru bezelye']),

  // ═══════════════════════════════════════════════════════════════════════════
  // KURUYEMİŞ — Çeşitli kuruyemişler ve tohumlar
  // ═══════════════════════════════════════════════════════════════════════════
  g('yer-fistigi-kavrulmus', 'Yer Fıstığı (Kavrulmuş)', 567, 26, 16, 49, 8, 'kuruyemiş', undefined, ['yer fıstığı'], [{ label: '1 avuç (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('leblebi', 'Leblebi', 370, 22, 56, 6, 5, 'kuruyemiş', undefined, undefined, [{ label: '1 avuç (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('kaju-kavrulmus', 'Kaju (Kavrulmuş)', 553, 18, 30, 44, 3, 'kuruyemiş', undefined, ['kaju'], [{ label: '1 avuç (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('sam-fistigi', 'Şam Fıstığı (Çam Fıstığı)', 673, 14, 13, 68, 3.7, 'kuruyemiş', undefined, ['çam fıstığı'], [{ label: '1 yemek kaşığı (10 g)', grams: 10 }, { label: '100 g', grams: 100 }]),
  g('susam', 'Susam', 573, 18, 23, 50, 12, 'kuruyemiş', undefined, undefined, [{ label: '1 yemek kaşığı (10 g)', grams: 10 }, { label: '100 g', grams: 100 }]),
  g('chia-tohumu', 'Chia Tohumu', 486, 17, 42, 31, 34, 'kuruyemiş', undefined, ['chia'], [{ label: '1 yemek kaşığı (10 g)', grams: 10 }, { label: '100 g', grams: 100 }]),
  g('keten-tohumu', 'Keten Tohumu', 534, 18, 29, 42, 27, 'kuruyemiş', undefined, ['keten'], [{ label: '1 yemek kaşığı (10 g)', grams: 10 }, { label: '100 g', grams: 100 }]),
  g('hindistan-cevizi-rende', 'Hindistan Cevizi (Rende)', 354, 3.3, 15, 33, 9, 'kuruyemiş', undefined, ['hindistan cevizi']),
  g('pecan-cevizi', 'Pekan Cevizi', 691, 9, 14, 72, 10, 'kuruyemiş', undefined, ['pecan'], [{ label: '1 avuç (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('macadamia', 'Makademya Fıstığı', 718, 8, 14, 76, 9, 'kuruyemiş', undefined, ['macadamia'], [{ label: '1 avuç (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('karisik-kuruyemis', 'Tadım Karışık Kuruyemiş', 595, 18, 20, 52, 7, 'kuruyemiş', 'Tadım', ['karışık kuruyemiş'], [{ label: '1 avuç (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),

  // ═══════════════════════════════════════════════════════════════════════════
  // İÇECEKLER — Kapsamlı içecek listesi
  // ═══════════════════════════════════════════════════════════════════════════
  g('su-genel', 'Su', 0, 0, 0, 0, 0, 'içecek', undefined, undefined, S_BARDAK),
  g('maden-suyu-sade', 'Maden Suyu (Sade)', 0, 0, 0, 0, 0, 'içecek', undefined, ['maden suyu', 'soda'], S_SISE),
  g('beypazari-maden-suyu', 'Beypazarı Maden Suyu', 0, 0, 0, 0, 0, 'içecek', 'Beypazarı', ['maden suyu'], S_SISE),
  g('cay-sekerli', 'Çay (1 Şekerli)', 8, 0, 2, 0, 0, 'içecek', undefined, ['şekerli çay'], [{ label: '1 bardak', grams: 200 }]),
  g('filtre-kahve-sade', 'Filtre Kahve (Sade)', 2, 0.3, 0, 0, 0, 'içecek', undefined, ['filtre kahve'], [{ label: '1 fincan (240 ml)', grams: 240 }]),
  g('espresso', 'Espresso', 2, 0.1, 0.4, 0, 0, 'içecek', undefined, ['espresso'], [{ label: '1 shot (30 ml)', grams: 30 }]),
  g('cappuccino-genel', 'Cappuccino', 45, 2.5, 5, 1.8, 0, 'içecek', undefined, ['cappuccino'], [{ label: '1 fincan (240 ml)', grams: 240 }]),
  g('latte-genel', 'Latte (Sütlü Kahve)', 42, 2.7, 5, 1.4, 0, 'içecek', undefined, ['latte', 'sütlü kahve'], [{ label: '1 fincan (300 ml)', grams: 300 }]),
  g('nescafe-3u1', 'Nescafé 3ü1 Arada', 440, 6, 70, 16, 0, 'içecek', 'Nescafe', ['3ü1', '3in1'], [{ label: '1 paket (17 g)', grams: 17 }, { label: '100 g', grams: 100 }]),
  g('hazir-soguk-kahve', 'Hazır Soğuk Kahve', 56, 2.5, 8, 1.5, 0, 'içecek', undefined, ['soğuk kahve', 'iced coffee'], S_KUTU250),
  g('ayran-sise', 'Ayran (Şişe)', 37, 1.7, 2.5, 1.5, 0, 'içecek', undefined, ['ayran'], S_SISE),
  g('limonata-genel', 'Limonata', 32, 0, 8, 0, 0, 'içecek', undefined, ['limonata'], S_BARDAK),
  g('boza-icecek', 'Boza', 120, 2, 24, 1.5, 1, 'içecek', undefined, ['boza'], S_BARDAK),
  g('cola-turka', 'Cola Turka', 42, 0, 10.5, 0, 0, 'içecek', 'Cola Turka', ['cola turka'], S_KUTU330),
  g('pepsi-genel', 'Pepsi', 42, 0, 10.5, 0, 0, 'içecek', 'Pepsi', ['pepsi'], S_KUTU330),
  g('sprite-genel', 'Sprite', 40, 0, 10, 0, 0, 'içecek', 'Sprite', ['sprite'], S_KUTU330),
  g('schweppes-genel', 'Schweppes', 38, 0, 9.5, 0, 0, 'içecek', 'Schweppes', ['schweppes', 'tonik'], S_KUTU330),
  g('fanta-genel', 'Fanta', 42, 0, 10, 0, 0, 'içecek', 'Fanta', ['fanta'], S_KUTU330),
  g('red-bull', 'Red Bull', 45, 0, 11, 0, 0, 'içecek', 'Red Bull', ['red bull', 'enerji'], S_KUTU250),
  g('red-bull-sugar-free', 'Red Bull Şekersiz', 3, 0, 0, 0, 0, 'içecek', 'Red Bull', ['red bull şekersiz'], S_KUTU250),
  g('monster-energy', 'Monster Energy', 42, 0, 10.5, 0, 0, 'içecek', 'Monster', ['monster', 'enerji'], S_SISE),
  g('powerade-genel', 'Powerade', 26, 0, 6.5, 0, 0, 'içecek', 'Powerade', ['powerade'], S_SISE),
  g('fuse-tea-seftali', 'Fuse Tea Şeftali', 24, 0, 6, 0, 0, 'içecek', 'Fuse Tea', ['fuse tea', 'ice tea'], S_SISE),
  g('cappy-visne', 'Cappy Vişne', 44, 0, 11, 0, 0, 'içecek', 'Cappy', ['cappy vişne'], S_KUTU),
  g('uludag-gazoz', 'Uludağ Gazoz', 41, 0, 10, 0, 0, 'içecek', 'Uludağ', ['gazoz'], S_SISE330),
  g('salgam-suyu', 'Şalgam Suyu', 18, 0.5, 3.5, 0.1, 0.5, 'içecek', undefined, ['şalgam'], S_BARDAK),
  g('taze-portakal-suyu', 'Taze Sıkılmış Portakal Suyu', 45, 0.7, 10, 0.2, 0.2, 'içecek', undefined, ['portakal suyu'], S_BARDAK),
  g('milkshake-cikolatali', 'Milkshake (Çikolatalı)', 112, 3.5, 18, 3.2, 0.5, 'içecek', undefined, ['milkshake'], S_BARDAK),
  g('protein-puding', 'Protein Puding', 100, 15, 8, 1, 0, 'süt-ürünü', undefined, ['protein puding'], [{ label: '1 kase (200 g)', grams: 200 }, { label: '100 g', grams: 100 }]),
  g('hindistan-cevizi-yagi', 'Hindistan Cevizi Yağı', 862, 0, 0, 100, 0, 'diğer', undefined, ['coconut oil'], S_YKASIK),
  g('aycicek-yagi', 'Ayçiçek Yağı', 884, 0, 0, 100, 0, 'diğer', undefined, ['ayçiçek yağı'], S_YKASIK),

  // ═══════════════════════════════════════════════════════════════════════════
  // TATLI — Türk ve market tatlıları
  // ═══════════════════════════════════════════════════════════════════════════
  pc('lokum-genel', 'Lokum', 360, 0.5, 89, 0.3, 0, 'tatlı', 10, '1 adet'),
  pc('lokma-tatlisi', 'Lokma Tatlısı', 370, 4, 50, 18, 1, 'tatlı', 15, '1 adet'),
  g('kunefe', 'Künefe', 380, 8, 42, 20, 1, 'tatlı', undefined, ['künefe'], [{ label: '1 porsiyon', grams: 200 }, { label: '100 g', grams: 100 }]),
  g('revani', 'Revani', 350, 5, 55, 13, 0.5, 'tatlı', undefined, ['revani']),
  g('tulumba', 'Tulumba Tatlısı', 380, 3, 55, 17, 0.5, 'tatlı', undefined, ['tulumba']),
  g('kemalpaşa', 'Kemalpaşa Tatlısı', 300, 6, 42, 12, 0, 'tatlı', undefined, ['kemalpaşa']),
  g('asure', 'Aşure', 125, 3, 24, 2, 2, 'tatlı', undefined, ['aşure', 'noah pudding']),
  g('gullac', 'Güllaç', 180, 4, 30, 5, 0.5, 'tatlı', undefined, ['güllaç']),
  g('helva-un', 'Un Helvası', 420, 4, 52, 22, 1, 'tatlı', undefined, ['un helvası']),
  g('hosmerim', 'Höşmerim', 350, 8, 30, 22, 0, 'tatlı', undefined, ['höşmerim']),
  g('trilece', 'Trileçe', 245, 6, 30, 11, 0, 'tatlı', undefined, ['trileçe', 'tres leches']),
  g('cheesecake', 'Cheesecake', 321, 6, 26, 22, 0.5, 'tatlı', undefined, ['cheesecake']),
  g('tiramisu', 'Tiramisu', 283, 6, 28, 16, 0.5, 'tatlı', undefined, ['tiramisu']),
  g('brownie', 'Browni', 405, 5, 50, 22, 2, 'tatlı', undefined, ['browni', 'brownie']),
  g('waffle', 'Waffle (Sade)', 310, 8, 35, 15, 1, 'tatlı', undefined, ['waffle']),
  g('pancake', 'Pancake', 227, 6, 33, 8, 1, 'tatlı', undefined, ['pancake', 'pankek'], [{ label: '1 adet', grams: 50 }, { label: '100 g', grams: 100 }]),
  g('krep', 'Krep (Sade)', 216, 6, 28, 8.5, 0.5, 'tatlı', undefined, ['krep', 'crêpe'], [{ label: '1 adet', grams: 70 }, { label: '100 g', grams: 100 }]),
  g('dondurma-vanilya', 'Dondurma (Vanilya)', 207, 3.5, 24, 11, 0, 'tatlı', undefined, ['dondurma']),
  g('maras-dondurmasi', 'Maraş Dondurması', 240, 5, 28, 12, 0, 'tatlı', undefined, ['maraş dondurması']),
  g('magnolia-muzlu', 'Magnolia (Muzlu)', 130, 3, 20, 4, 0.5, 'tatlı', undefined, ['magnolia']),
  g('puding-cikolatali', 'Puding (Çikolatalı)', 120, 3, 19, 3.5, 0.5, 'tatlı', undefined, ['puding']),
  g('tahin-helvasi', 'Tahin Helvası', 516, 12, 48, 31, 2, 'tatlı', undefined, ['helva', 'tahin helvası']),
  g('pekmez-genel', 'Pekmez', 290, 1, 72, 0.2, 0, 'diğer', undefined, ['pekmez'], S_YKASIK),
  g('uzum-pekmezi', 'Üzüm Pekmezi', 290, 1, 72, 0.2, 0, 'diğer', undefined, ['üzüm pekmezi'], S_YKASIK),
  g('nar-eksisi', 'Nar Ekşisi', 150, 0.5, 37, 0.1, 0, 'diğer', undefined, ['nar ekşisi'], S_YKASIK),

  // ═══════════════════════════════════════════════════════════════════════════
  // HAZIR YEMEK — Türk Mutfağı Ana Yemekler
  // ═══════════════════════════════════════════════════════════════════════════
  g('karniyarik', 'Karnıyarık', 150, 7, 10, 9, 3, 'hazır-yemek', undefined, ['karnıyarık']),
  g('imam-bayildi', 'İmam Bayıldı', 115, 2, 10, 8, 3, 'hazır-yemek', undefined, ['imam bayıldı']),
  g('kisir', 'Kısır', 160, 5, 25, 5, 4, 'hazır-yemek', undefined, ['kısır']),
  g('humus-genel', 'Humus', 166, 8, 14, 10, 6, 'hazır-yemek', undefined, ['humus', 'hummus']),
  g('cacik', 'Cacık', 36, 2, 3, 1.5, 0.3, 'hazır-yemek', undefined, ['cacık']),
  g('manti-genel', 'Mantı', 185, 8, 22, 7, 1.5, 'hazır-yemek', undefined, ['mantı'], [{ label: '1 porsiyon', grams: 250 }, { label: '100 g', grams: 100 }]),
  g('hazir-manti', 'Hazır Mantı', 170, 7, 22, 6, 1, 'hazır-yemek', undefined, ['hazır mantı']),
  g('icli-kofte', 'İçli Köfte', 245, 10, 26, 11, 2, 'hazır-yemek', undefined, ['içli köfte'], [{ label: '1 adet', grams: 60 }, { label: '100 g', grams: 100 }]),
  g('cig-kofte', 'Çiğ Köfte', 175, 6, 30, 3, 4, 'hazır-yemek', undefined, ['çiğ köfte'], [{ label: '1 porsiyon', grams: 150 }, { label: '100 g', grams: 100 }]),
  g('tavuklu-pilav', 'Tavuklu Pilav', 170, 10, 22, 5, 0.5, 'hazır-yemek', undefined, ['tavuklu pilav']),
  g('izgara-kofte-porsiyon', 'Izgara Köfte (Porsiyon)', 235, 17, 7, 15, 0.5, 'hazır-yemek', undefined, ['köfte'], [{ label: '1 porsiyon (4 adet)', grams: 160 }, { label: '100 g', grams: 100 }]),
  g('adana-kebap', 'Adana Kebap', 250, 15, 3, 20, 0.5, 'hazır-yemek', undefined, ['adana kebap'], [{ label: '1 porsiyon', grams: 200 }, { label: '100 g', grams: 100 }]),
  g('tirnak-pide', 'Tırnak Pide', 280, 13, 34, 10, 2, 'hazır-yemek', undefined, ['tırnak pide'], [{ label: '1 adet', grams: 300 }, { label: '100 g', grams: 100 }]),
  g('kasarli-tost', 'Kaşarlı Tost', 280, 12, 28, 14, 1.5, 'hazır-yemek', undefined, ['tost', 'kaşarlı tost'], [{ label: '1 adet', grams: 150 }, { label: '100 g', grams: 100 }]),
  g('sucuklu-kasarli-tost', 'Sucuklu Kaşarlı Tost', 320, 14, 26, 18, 1.5, 'hazır-yemek', undefined, ['sucuklu tost'], [{ label: '1 adet', grams: 170 }, { label: '100 g', grams: 100 }]),
  g('peynirli-sandvic', 'Peynirli Sandviç', 250, 10, 30, 10, 2, 'hazır-yemek', undefined, ['sandviç']),
  g('sucuklu-yumurta', 'Sucuklu Yumurta', 220, 14, 2, 18, 0, 'hazır-yemek', undefined, ['sucuklu yumurta'], [{ label: '1 porsiyon', grams: 200 }, { label: '100 g', grams: 100 }]),
  g('sucuk-izgara', 'Sucuk (Izgara)', 350, 18, 1, 30, 0, 'şarküteri', undefined, ['sucuk'], S_DILIM),
  g('kavurma-genel', 'Kavurma', 300, 25, 0, 22, 0, 'protein', undefined, ['kavurma']),
  g('hamburger-genel', 'Hamburger', 295, 17, 24, 14, 2, 'hazır-yemek', undefined, ['hamburger', 'burger'], [{ label: '1 adet', grams: 200 }, { label: '100 g', grams: 100 }]),
  g('tavuklu-wrap', 'Tavuklu Wrap', 200, 12, 20, 8, 1.5, 'hazır-yemek', undefined, ['wrap', 'dürüm']),
  g('donuk-pizza', 'Donuk Pizza', 230, 9, 28, 9, 1.5, 'hazır-yemek', undefined, ['donuk pizza', 'pizza']),
  g('pizza-karisik', 'Pizza (Karışık)', 266, 11, 30, 11, 2, 'hazır-yemek', undefined, ['pizza'], [{ label: '1 dilim', grams: 107 }, { label: '100 g', grams: 100 }]),
  g('hazir-lazanya', 'Hazır Lazanya', 135, 6, 16, 5, 1, 'hazır-yemek', undefined, ['lazanya']),
  g('hazir-noodle', 'Hazır Noodle', 110, 3, 16, 4, 0.5, 'hazır-yemek', undefined, ['noodle', 'hazır noodle']),
  g('kumpir-genel', 'Kumpir', 180, 4, 26, 7, 3, 'hazır-yemek', undefined, ['kumpir'], [{ label: '1 porsiyon', grams: 400 }, { label: '100 g', grams: 100 }]),
  g('ton-balikli-salata', 'Ton Balıklı Hazır Salata', 95, 8, 6, 4, 1.5, 'hazır-yemek', undefined, ['ton balığı salata']),
  g('misir-haslama', 'Mısır (Haşlanmış)', 96, 3.4, 21, 1.5, 2.4, 'sebze', undefined, ['haşlanmış mısır'], [{ label: '1 koçan', grams: 200 }, { label: '100 g', grams: 100 }]),
  g('patlamis-misir', 'Patlamış Mısır', 387, 13, 78, 4.5, 15, 'atıştırmalık', undefined, ['popcorn'], [{ label: '1 küçük kase', grams: 25 }, { label: '100 g', grams: 100 }]),
  g('donuk-patates-kizartmasi', 'Donuk Patates Kızartması', 160, 2, 26, 5, 2, 'hazır-yemek', undefined, ['donuk patates']),
  g('tavuk-nugget', 'Tavuk Nugget', 240, 14, 18, 12, 1, 'hazır-yemek', undefined, ['nugget'], [{ label: '6 adet', grams: 120 }, { label: '100 g', grams: 100 }]),
  g('balik-kroket', 'Balık Kroket', 220, 10, 20, 11, 1, 'hazır-yemek', undefined, ['balık kroket']),
  g('donut-genel', 'Donut', 421, 5, 53, 22, 1, 'tatlı', undefined, ['donut'], [{ label: '1 adet', grams: 70 }, { label: '100 g', grams: 100 }]),
  g('muffin-genel', 'Muffin', 370, 5, 48, 18, 1.5, 'tatlı', undefined, ['muffin'], [{ label: '1 adet', grams: 80 }, { label: '100 g', grams: 100 }]),
  g('kruvasan', 'Kruvasan', 406, 8, 43, 21, 2, 'ekmek', undefined, ['kruvasan', 'croissant'], [{ label: '1 adet', grams: 60 }, { label: '100 g', grams: 100 }]),
  g('sigara-boregi', 'Sigara Böreği', 280, 8, 28, 15, 1.5, 'hazır-yemek', undefined, ['sigara böreği'], [{ label: '1 adet', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('yaprak-sarma', 'Yaprak Sarma', 195, 3, 22, 10, 2.5, 'hazır-yemek', undefined, ['sarma'], [{ label: '1 adet', grams: 25 }, { label: '100 g', grams: 100 }]),
  g('zeytinyagli-taze-fasulye', 'Zeytinyağlı Taze Fasulye', 75, 2, 7, 4, 3, 'hazır-yemek', undefined, ['taze fasulye']),

  // ═══════════════════════════════════════════════════════════════════════════
  // ATIŞTIRMALIK — Eksik çikolata/bisküvi/cips ürünleri
  // ═══════════════════════════════════════════════════════════════════════════
  // Eti
  pc('eti-browni-kek', 'Eti Browni Kek', 445, 5.5, 52, 24, 2.5, 'atıştırmalık', 40, '1 adet', 'Eti', ['browni']),
  pc('eti-popkek', 'Eti Popkek', 430, 5, 56, 22, 1.5, 'atıştırmalık', 55, '1 adet', 'Eti', ['popkek']),
  pc('eti-topkek', 'Eti Topkek', 420, 5, 56, 20, 1.5, 'atıştırmalık', 35, '1 adet', 'Eti', ['topkek']),
  pc('eti-metro', 'Eti Metro', 475, 5, 60, 24, 1.5, 'atıştırmalık', 36, '1 adet', 'Eti', ['metro']),
  pc('eti-wanted', 'Eti Wanted', 490, 6, 57, 27, 2, 'atıştırmalık', 32, '1 adet', 'Eti', ['wanted']),
  pc('eti-negro', 'Eti Negro', 430, 5, 70, 14, 2, 'atıştırmalık', 30, '1 adet', 'Eti', ['negro']),
  pc('eti-potibor', 'Eti Pötibör', 450, 7, 72, 14, 2, 'atıştırmalık', 180, '1 paket', 'Eti', ['pötibör']),
  pc('eti-tutku', 'Eti Tutku', 470, 5, 65, 21, 1.5, 'atıştırmalık', 25, '1 adet', 'Eti', ['tutku']),
  pc('eti-karam-bitter', 'Eti Karam Bitter', 540, 7, 50, 35, 5, 'atıştırmalık', 60, '1 tablet', 'Eti', ['karam']),
  pc('eti-form-biskuvi', 'Eti Form Bisküvi', 420, 8, 68, 12, 5, 'atıştırmalık', 50, '1 paket', 'Eti', ['form']),
  pc('eti-gong', 'Eti Gong', 500, 7, 58, 28, 2, 'atıştırmalık', 35, '1 paket', 'Eti', ['gong']),
  pc('eti-crax-kraker', 'Eti Crax Kraker', 470, 8, 62, 20, 2, 'atıştırmalık', 50, '1 paket', 'Eti', ['crax']),
  // Ülker
  pc('ulker-biskrem', 'Ülker Biskrem', 480, 5.5, 63, 23, 1.5, 'atıştırmalık', 17, '1 adet', 'Ülker', ['biskrem']),
  pc('ulker-bebe-biskuvi', 'Ülker Bebe Bisküvi', 440, 8, 70, 14, 2, 'atıştırmalık', 180, '1 paket', 'Ülker', ['bebe']),
  pc('ulker-probis', 'Ülker Probis', 490, 7, 60, 24, 2, 'atıştırmalık', 30, '1 adet', 'Ülker', ['probis']),
  pc('ulker-halley', 'Ülker Halley', 425, 4.5, 62, 18, 1, 'atıştırmalık', 30, '1 adet', 'Ülker', ['halley']),
  pc('ulker-dido', 'Ülker Dido', 520, 6, 56, 30, 2, 'atıştırmalık', 35, '1 adet', 'Ülker', ['dido']),
  pc('ulker-damak-fistikli', 'Ülker Damak Fıstıklı', 550, 9, 48, 36, 3, 'atıştırmalık', 60, '1 tablet', 'Ülker', ['damak']),
  pc('ulker-cokoprens', 'Ülker Çokoprens', 480, 5, 60, 24, 2, 'atıştırmalık', 30, '1 adet', 'Ülker', ['çokoprens']),
  pc('ulker-cokostar', 'Ülker Çokostar', 430, 4, 56, 22, 2, 'atıştırmalık', 25, '1 adet', 'Ülker', ['çokostar']),
  pc('ulker-ikram', 'Ülker İkram', 485, 5, 62, 24, 1.5, 'atıştırmalık', 30, '1 adet', 'Ülker', ['ikram']),
  pc('ulker-hosbis', 'Ülker Hoşbeş', 470, 5, 64, 22, 2, 'atıştırmalık', 28, '1 adet', 'Ülker', ['hoşbeş']),
  pc('ulker-cikolatali-gofret', 'Ülker Çikolatalı Gofret', 510, 5.5, 58, 29, 1.5, 'atıştırmalık', 35, '1 adet', 'Ülker', ['gofret']),
  pc('ulker-cikolatali-sandvic', 'Ülker Çikolatalı Sandviç Bisküvi', 465, 5, 66, 20, 2, 'atıştırmalık', 27, '1 adet', 'Ülker', ['sandviç bisküvi']),
  pc('ulker-cizi-kraker', 'Ülker Çizi Kraker', 485, 8, 60, 23, 2, 'atıştırmalık', 50, '1 paket', 'Ülker', ['çizi']),
  // Ulker diğer
  g('ulker-cokokrem', 'Ülker Çokokrem', 545, 5, 57, 33, 2, 'diğer', 'Ülker', ['çokokrem', 'çikolatalı krema'], S_YKASIK),
  g('nutella-genel', 'Nutella', 539, 6, 58, 31, 3, 'diğer', 'Nutella', ['nutella', 'fındık kreması'], S_YKASIK),
  g('sarelle-genel', 'Sarelle', 540, 5, 57, 33, 2, 'diğer', 'Sarelle', ['sarelle', 'çikolatalı krema'], S_YKASIK),
  g('recel-genel', 'Reçel', 250, 0.3, 62, 0, 1, 'diğer', undefined, ['reçel'], S_YKASIK),
  // Uluslararası
  pc('kinder-bueno', 'Kinder Bueno', 570, 9, 49, 38, 2, 'atıştırmalık', 43, '1 adet', 'Kinder', ['bueno']),
  pc('bounty-genel', 'Bounty', 471, 4, 55, 26, 3, 'atıştırmalık', 57, '1 adet', 'Mars', ['bounty']),
  pc('twix-genel', 'Twix', 495, 5, 62, 25, 1, 'atıştırmalık', 50, '1 adet', 'Mars', ['twix']),
  pc('mars-genel', 'Mars', 449, 4, 66, 18, 1, 'atıştırmalık', 51, '1 adet', 'Mars', ['mars']),
  pc('kitkat-genel', 'Kit Kat', 518, 7, 60, 28, 2, 'atıştırmalık', 41.5, '1 paket', 'Nestle', ['kit kat']),
  pc('toblerone-genel', 'Toblerone', 525, 5, 60, 30, 1, 'atıştırmalık', 35, '1 adet', 'Toblerone', ['toblerone']),
  pc('milka-sutlu', 'Milka Sütlü Çikolata', 530, 6.3, 58, 30, 1, 'atıştırmalık', 80, '1 tablet', 'Milka', ['milka']),
  pc('oreo-genel', 'Oreo', 480, 4.5, 68, 20, 2, 'atıştırmalık', 11, '1 adet', 'Oreo', ['oreo']),
  pc('haribo-jelibon', 'Haribo Jelibon', 340, 7, 77, 0.5, 0, 'atıştırmalık', 80, '1 paket', 'Haribo', ['jelibon']),
  // Cips
  g('cheetos-genel', 'Cheetos', 500, 5.5, 58, 28, 1, 'atıştırmalık', 'Cheetos', ['cheetos'], [{ label: '1 paket (50 g)', grams: 50 }, { label: '100 g', grams: 100 }]),
  g('doritos-genel', 'Doritos', 490, 7, 60, 24, 4, 'atıştırmalık', 'Doritos', ['doritos'], [{ label: '1 paket (70 g)', grams: 70 }, { label: '100 g', grams: 100 }]),
  g('pringles-genel', 'Pringles', 530, 4, 55, 33, 3, 'atıştırmalık', 'Pringles', ['pringles'], [{ label: '1 kutu (165 g)', grams: 165 }, { label: '100 g', grams: 100 }]),
  g('patos-genel', 'Patos', 515, 6, 56, 30, 2.5, 'atıştırmalık', 'Patos', ['patos'], [{ label: '1 paket (70 g)', grams: 70 }, { label: '100 g', grams: 100 }]),
  g('ruffles-genel', 'Ruffles Cips', 520, 6, 55, 30, 3.5, 'atıştırmalık', 'Ruffles', ['ruffles'], [{ label: '1 paket (70 g)', grams: 70 }, { label: '100 g', grams: 100 }]),
  g('cubuk-kraker', 'Çubuk Kraker', 430, 9, 70, 12, 3, 'atıştırmalık', undefined, ['çubuk kraker'], [{ label: '1 paket (40 g)', grams: 40 }, { label: '100 g', grams: 100 }]),

  // ═══════════════════════════════════════════════════════════════════════════
  // ŞARKÜTERI — Et ürünleri ve markalar
  // ═══════════════════════════════════════════════════════════════════════════
  g('hindi-jambon-genel', 'Hindi Jambon', 110, 18, 2, 3.5, 0, 'şarküteri', undefined, ['jambon', 'hindi jambon'], S_DILIM),
  g('fume-hindi-genel', 'Füme Hindi', 110, 20, 1.5, 2.5, 0, 'şarküteri', undefined, ['füme hindi'], S_DILIM),
  g('pastirma-genel', 'Pastırma', 250, 29, 1, 14, 0, 'şarküteri', undefined, ['pastırma'], [{ label: '1 dilim (12 g)', grams: 12 }, { label: '100 g', grams: 100 }]),
  g('sosis-genel', 'Sosis', 250, 12, 3, 21, 0, 'şarküteri', undefined, ['sosis'], [{ label: '1 adet (25 g)', grams: 25 }, { label: '100 g', grams: 100 }]),
  g('salam-genel', 'Salam', 280, 14, 2, 24, 0, 'şarküteri', undefined, ['salam'], S_DILIM),
  g('kasar-dilim', 'Kaşar Peyniri (Dilim)', 350, 25, 0.5, 27, 0, 'süt-ürünü', undefined, ['kaşar dilim'], [{ label: '1 dilim (25 g)', grams: 25 }, { label: '100 g', grams: 100 }]),

  // ═══════════════════════════════════════════════════════════════════════════
  // DİĞER — Sos, baharat, katıklar
  // ═══════════════════════════════════════════════════════════════════════════
  g('ketcap', 'Ketçap', 112, 1.3, 26, 0.1, 0.3, 'diğer', undefined, ['ketçap'], S_YKASIK),
  g('mayonez-genel', 'Mayonez', 680, 1, 1, 75, 0, 'diğer', undefined, ['mayonez'], S_YKASIK),
  g('hardal-genel', 'Hardal', 66, 4, 5, 3.3, 3.3, 'diğer', undefined, ['hardal'], S_YKASIK),
  g('barbekü-sos', 'Barbekü Sos', 170, 0.8, 41, 0.6, 0.5, 'diğer', undefined, ['barbekü', 'bbq'], S_YKASIK),
  g('soya-sosu', 'Soya Sosu', 53, 5, 5, 0.1, 0.4, 'diğer', undefined, ['soya sosu'], [{ label: '1 yemek kaşığı (15 ml)', grams: 15 }, { label: '100 ml', grams: 100 }]),
  g('seker', 'Şeker', 387, 0, 100, 0, 0, 'diğer', undefined, ['toz şeker'], [{ label: '1 çay kaşığı (4 g)', grams: 4 }, { label: '1 küp', grams: 4 }, { label: '100 g', grams: 100 }]),
  g('tuz', 'Tuz', 0, 0, 0, 0, 0, 'diğer', undefined, undefined, [{ label: '1 çay kaşığı (6 g)', grams: 6 }, { label: '100 g', grams: 100 }]),
  g('domates-salcasi', 'Domates Salçası', 80, 3, 14, 0.5, 3, 'diğer', undefined, ['salça'], S_YKASIK),
  g('biber-salcasi', 'Biber Salçası', 100, 3, 17, 2, 4, 'diğer', undefined, ['biber salçası'], S_YKASIK),
  g('sirke', 'Sirke', 21, 0, 0.6, 0, 0, 'diğer', undefined, ['sirke'], S_YKASIK),
  g('elma-sirkesi', 'Elma Sirkesi', 21, 0, 0.9, 0, 0, 'diğer', undefined, ['elma sirkesi'], S_YKASIK),
  g('konserve-bezelye', 'Konserve Bezelye', 65, 4, 10, 0.3, 4, 'diğer', undefined, ['konserve bezelye']),
  g('konserve-misir', 'Konserve Mısır', 82, 2.7, 16, 1, 2, 'diğer', undefined, ['konserve mısır']),

  // ═══════════════════════════════════════════════════════════════════════════
  // TAKVİYE — Ek sporcu takviyeleri ve protein barlar
  // ═══════════════════════════════════════════════════════════════════════════
  g('kazein-protein', 'Kazein Protein Tozu', 360, 78, 6, 3, 0, 'takviye', undefined, ['kazein', 'casein'], [{ label: '1 ölçek (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  pc('fellas-protein-bar', 'Fellas Protein Bar', 380, 27, 38, 13, 5, 'takviye', 45, '1 adet', 'Fellas', ['fellas']),
  pc('corny-big-protein-bar', 'Corny Big Protein Bar', 370, 30, 38, 11, 6, 'takviye', 50, '1 adet', 'Corny', ['corny']),
  pc('nesfit-protein-bar-ek', 'Nesfit Protein Bar', 370, 26, 42, 11, 8, 'takviye', 40, '1 adet', 'Nestle', ['nesfit']),
  pc('zuber-protein-bar-ek', 'Züber Protein Bar', 385, 25, 42, 13, 8, 'takviye', 40, '1 adet', 'Züber', ['züber']),

  // ═══════════════════════════════════════════════════════════════════════════
  // MARKET MARKALARI — Pınar, Sütaş, Sek, Torku ürünleri
  // ═══════════════════════════════════════════════════════════════════════════
  g('pinar-sut-genel', 'Pınar Süt', 64, 3.3, 4.8, 3.5, 0, 'süt-ürünü', 'Pınar', ['pınar süt'], S_BARDAK),
  g('pinar-sut-tam-yagli', 'Pınar Süt (Tam Yağlı)', 64, 3.3, 4.8, 3.6, 0, 'süt-ürünü', 'Pınar', ['pınar süt'], S_BARDAK),
  g('sutas-ayran', 'Sütaş Ayran', 36, 1.3, 1.5, 2.4, 0, 'süt-ürünü', 'Sütaş', ['sütaş ayran'], S_BARDAK),
  g('sutas-yogurt', 'Sütaş Yoğurt', 62, 3.4, 4.6, 3.4, 0, 'süt-ürünü', 'Sütaş', ['sütaş yoğurt'], S_KASE),
  g('sek-sut', 'Sek Süt', 46, 3.3, 4.8, 1.6, 0, 'süt-ürünü', 'SEK', ['sek süt'], S_BARDAK),
  g('torku-sut', 'Torku Süt', 64, 3.3, 4.8, 3.5, 0, 'süt-ürünü', 'Torku', ['torku süt'], S_BARDAK),
  g('activia-yogurt', 'Activia Yoğurt', 65, 3.8, 4.5, 3.5, 0, 'süt-ürünü', 'Danone', ['activia'], S_KASE),
  g('torku-banada-genel', 'Torku Banada', 545, 5, 57, 33, 2, 'diğer', 'Torku', ['banada', 'fındık kreması'], S_YKASIK),
  // Nestle Gevrek
  g('nestle-nesquik-gevrek', 'Nestle Nesquik Gevrek', 388, 7, 78, 4.5, 4, 'tahıl', 'Nestle', ['nesquik', 'gevrek'], [{ label: '1 kase (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),

  // ═══════════════════════════════════════════════════════════════════════════
  // EK PROTEİN & ET ÜRÜNLERİ
  // ═══════════════════════════════════════════════════════════════════════════
  g('dana-tandir', 'Dana Tandır', 200, 25, 0, 11, 0, 'protein', undefined, ['tandır']),
  g('kuzu-tandir', 'Kuzu Tandır', 240, 22, 0, 16, 0, 'protein', undefined, ['tandır']),
  g('dana-rosto', 'Dana Rosto', 190, 26, 2, 8, 0, 'protein', undefined, ['rosto']),
  g('dana-haslama', 'Dana Haşlama', 175, 27, 0, 7, 0, 'protein', undefined, ['haşlama']),
  g('dana-sote', 'Dana Sote', 200, 22, 3, 11, 0.5, 'hazır-yemek', undefined, ['sote']),
  g('tavuk-sote', 'Tavuk Sote', 150, 18, 4, 7, 1, 'hazır-yemek', undefined, ['tavuk sote']),
  g('etli-nohut', 'Etli Nohut', 140, 8, 15, 5, 4, 'hazır-yemek', undefined, ['etli nohut']),
  g('etli-kuru-fasulye', 'Etli Kuru Fasulye', 155, 9, 18, 5, 5, 'hazır-yemek', undefined, ['etli kuru fasulye']),
  g('orman-kebabi', 'Orman Kebabı', 160, 12, 8, 9, 2, 'hazır-yemek', undefined, ['orman kebabı']),
  g('ali-nazik', 'Ali Nazik', 170, 14, 6, 10, 1, 'hazır-yemek', undefined, ['ali nazik']),
  g('hunkar-begendi', 'Hünkâr Beğendi', 160, 12, 10, 8, 1, 'hazır-yemek', undefined, ['hünkâr beğendi']),
  g('iskender-kebap', 'İskender Kebap', 220, 14, 16, 12, 1, 'hazır-yemek', undefined, ['iskender'], [{ label: '1 porsiyon', grams: 350 }, { label: '100 g', grams: 100 }]),
  g('urfa-kebap', 'Urfa Kebap', 245, 15, 3, 19, 0.5, 'hazır-yemek', undefined, ['urfa kebap'], [{ label: '1 porsiyon', grams: 200 }, { label: '100 g', grams: 100 }]),
  g('beyti-kebap', 'Beyti Kebap', 260, 16, 12, 17, 1, 'hazır-yemek', undefined, ['beyti'], [{ label: '1 porsiyon', grams: 250 }, { label: '100 g', grams: 100 }]),
  g('cop-sis', 'Çöp Şiş', 230, 18, 2, 17, 0.5, 'hazır-yemek', undefined, ['çöp şiş']),
  g('cizbiz-kofte', 'Cızbız Köfte', 240, 17, 7, 16, 0.5, 'hazır-yemek', undefined, ['cızbız']),
  g('doner-durum', 'Döner Dürüm', 220, 12, 24, 9, 1.5, 'hazır-yemek', undefined, ['dürüm'], [{ label: '1 adet', grams: 300 }, { label: '100 g', grams: 100 }]),
  g('et-sote', 'Et Sote', 180, 18, 5, 10, 1, 'hazır-yemek', undefined, ['et sote']),
  g('tas-kebabi', 'Tas Kebabı', 155, 14, 6, 8, 1, 'hazır-yemek', undefined, ['tas kebabı']),
  g('kazandibi-kebap', 'Kuzu Tandır Kebabı', 220, 22, 3, 14, 0.5, 'hazır-yemek', undefined, ['tandır kebabı']),

  // ═══════════════════════════════════════════════════════════════════════════
  // EK TÜRK YEMEKLERİ & HAZIR GIDALAR
  // ═══════════════════════════════════════════════════════════════════════════
  g('etli-dolma', 'Etli Biber Dolması', 130, 6, 12, 7, 2, 'hazır-yemek', undefined, ['etli dolma']),
  g('kabak-dolmasi', 'Kabak Dolması', 95, 3, 10, 5, 1.5, 'hazır-yemek', undefined, ['kabak dolması']),
  g('etli-yaprak-sarma', 'Etli Yaprak Sarma', 180, 6, 16, 11, 2, 'hazır-yemek', undefined, ['etli sarma']),
  g('sebzeli-tavuk', 'Sebzeli Tavuk', 120, 14, 6, 4.5, 1.5, 'hazır-yemek', undefined, ['sebzeli tavuk']),
  g('firin-tavuk', 'Fırın Tavuk', 190, 27, 0, 9, 0, 'protein', undefined, ['fırın tavuk']),
  g('tavuk-tantuni', 'Tavuk Tantuni', 200, 16, 14, 9, 1.5, 'hazır-yemek', undefined, ['tantuni']),
  g('et-tantuni', 'Et Tantuni', 230, 18, 14, 12, 1.5, 'hazır-yemek', undefined, ['tantuni']),
  g('kokorec', 'Kokoreç', 200, 15, 5, 14, 0, 'hazır-yemek', undefined, ['kokoreç'], [{ label: '1 yarım ekmek', grams: 250 }, { label: '100 g', grams: 100 }]),
  g('midye-tava', 'Midye Tava', 240, 12, 18, 13, 1, 'hazır-yemek', undefined, ['midye tava']),
  g('cig-kofte-durum', 'Çiğ Köfte Dürüm', 175, 6, 28, 4, 3, 'hazır-yemek', undefined, ['çiğ köfte dürüm'], [{ label: '1 adet', grams: 200 }, { label: '100 g', grams: 100 }]),
  g('corba-genel', 'Çorba (Genel)', 45, 2, 6, 1.5, 1, 'çorba', undefined, ['çorba'], S_KASE),
  g('kizartma-yag', 'Kızartma Yağı (Toplam)', 884, 0, 0, 100, 0, 'diğer', undefined, ['kızartma yağı'], S_YKASIK),
  g('gozleme-patatesli', 'Gözleme (Patatesli)', 230, 5, 32, 9, 2, 'hazır-yemek', undefined, ['patatesli gözleme']),
  g('gozleme-kiymali', 'Gözleme (Kıymalı)', 265, 11, 28, 12, 2, 'hazır-yemek', undefined, ['kıymalı gözleme']),
  g('ispanakli-yumurta', 'Ispanaklı Yumurta', 105, 8, 3, 7, 1.5, 'hazır-yemek', undefined, ['ıspanaklı yumurta']),
  g('patatesli-omlet', 'Patatesli Omlet', 140, 7, 12, 7.5, 1, 'hazır-yemek', undefined, ['patatesli omlet']),
  g('omlet-peynirli', 'Omlet (Peynirli)', 175, 13, 1.5, 13, 0, 'protein', undefined, ['peynirli omlet']),
  g('french-toast', 'French Toast', 230, 8, 28, 10, 1, 'ekmek', undefined, ['french toast', 'yumurtalı ekmek']),
  g('avokado-toast', 'Avokado Toast', 220, 6, 20, 13, 5, 'hazır-yemek', undefined, ['avokado toast']),
  g('peynirli-omlet-kasar', 'Kaşarlı Omlet', 185, 14, 1, 14, 0, 'protein', undefined, ['kaşarlı omlet']),

  // ═══════════════════════════════════════════════════════════════════════════
  // EK SEBZE YEMEKLERİ
  // ═══════════════════════════════════════════════════════════════════════════
  g('ispanak-yemegi', 'Ispanak Yemeği', 60, 3, 5, 3, 2, 'hazır-yemek', undefined, ['ıspanak yemeği']),
  g('kabak-mucver', 'Kabak Mücver', 180, 4, 14, 12, 2, 'hazır-yemek', undefined, ['mücver'], [{ label: '1 adet', grams: 50 }, { label: '100 g', grams: 100 }]),
  g('karnabahar-kizartma', 'Karnabahar Kızartma', 160, 4, 12, 11, 3, 'hazır-yemek', undefined, ['karnabahar kızartma']),
  g('patlican-kebap', 'Patlıcan Kebabı', 145, 7, 8, 10, 3, 'hazır-yemek', undefined, ['patlıcan kebabı']),
  g('turlu-etli', 'Türlü (Etli)', 95, 5, 8, 5, 2.5, 'hazır-yemek', undefined, ['etli türlü']),
  g('bamya-yemegi', 'Bamya Yemeği', 65, 3, 8, 3, 3, 'hazır-yemek', undefined, ['bamya yemeği']),
  g('zeytinyagli-bamya', 'Zeytinyağlı Bamya', 60, 2, 7, 3, 3, 'hazır-yemek', undefined, ['zeytinyağlı bamya']),
  g('etli-bezelye', 'Etli Bezelye', 100, 6, 10, 4, 3, 'hazır-yemek', undefined, ['etli bezelye']),
  g('fasulye-pilaki', 'Fasulye Pilaki', 90, 5, 14, 1.5, 4, 'hazır-yemek', undefined, ['pilaki']),
  g('patates-oturtma', 'Patates Oturtma', 130, 5, 14, 6, 2, 'hazır-yemek', undefined, ['oturtma']),
  g('sebze-graten', 'Sebze Graten', 120, 5, 8, 8, 2, 'hazır-yemek', undefined, ['graten']),
  g('falafel', 'Falafel', 333, 13, 32, 18, 5, 'hazır-yemek', undefined, ['falafel'], [{ label: '1 adet', grams: 20 }, { label: '100 g', grams: 100 }]),

  // ═══════════════════════════════════════════════════════════════════════════
  // EK İÇECEKLER & KAHVE ÇEŞİTLERİ
  // ═══════════════════════════════════════════════════════════════════════════
  g('americano', 'Americano', 2, 0.3, 0, 0, 0, 'içecek', undefined, ['americano'], [{ label: '1 fincan (240 ml)', grams: 240 }]),
  g('macchiato', 'Macchiato', 15, 0.7, 1, 0.5, 0, 'içecek', undefined, ['macchiato'], [{ label: '1 fincan (60 ml)', grams: 60 }]),
  g('mocha', 'Mocha', 190, 5, 28, 6, 1, 'içecek', undefined, ['mocha'], [{ label: '1 fincan (350 ml)', grams: 350 }]),
  g('flat-white', 'Flat White', 65, 4, 5, 3.5, 0, 'içecek', undefined, ['flat white'], [{ label: '1 fincan (200 ml)', grams: 200 }]),
  g('sicak-cikolata', 'Sıcak Çikolata', 85, 3.5, 12, 2.5, 0.5, 'içecek', undefined, ['sıcak çikolata'], [{ label: '1 fincan (250 ml)', grams: 250 }]),
  g('salep', 'Salep', 95, 3, 15, 2.5, 0, 'içecek', undefined, ['salep'], [{ label: '1 fincan (200 ml)', grams: 200 }]),
  g('bitki-cayi', 'Bitki Çayı', 1, 0, 0, 0, 0, 'içecek', undefined, ['bitki çayı', 'ihlamur', 'ada çayı'], [{ label: '1 bardak', grams: 200 }]),
  g('yesil-cay', 'Yeşil Çay', 1, 0, 0, 0, 0, 'içecek', undefined, ['yeşil çay', 'green tea'], [{ label: '1 bardak', grams: 200 }]),
  g('smoothie-meyve', 'Meyveli Smoothie', 55, 0.8, 12, 0.3, 1.5, 'içecek', undefined, ['smoothie'], S_BARDAK),
  g('protein-shake', 'Protein Shake (Hazır)', 70, 10, 5, 1, 0, 'içecek', undefined, ['protein shake'], S_SISE),
  g('ayran-koy', 'Köy Ayranı', 42, 2, 3, 2, 0, 'içecek', undefined, ['köy ayranı'], S_BARDAK),
  g('kombucha', 'Kombucha', 17, 0, 4, 0, 0, 'içecek', undefined, ['kombucha'], S_SISE330),
  g('hindistan-cevizi-suyu', 'Hindistan Cevizi Suyu', 19, 0.7, 3.7, 0.2, 1.1, 'içecek', undefined, ['coconut water'], S_KUTU330),

  // ═══════════════════════════════════════════════════════════════════════════
  // EK TATLILAR
  // ═══════════════════════════════════════════════════════════════════════════
  g('sekerpare', 'Şekerpare', 380, 5, 55, 16, 1, 'tatlı', undefined, ['şekerpare'], [{ label: '1 adet', grams: 40 }, { label: '100 g', grams: 100 }]),
  g('sambali', 'Şambali', 400, 5, 60, 16, 1, 'tatlı', undefined, ['şambali']),
  g('keskul', 'Keşkül', 135, 4, 20, 4, 0.5, 'tatlı', undefined, ['keşkül']),
  g('asure-sade', 'Aşure', 125, 3, 24, 2, 2, 'tatlı', undefined, ['aşure']),
  g('kadayif', 'Kadayıf', 420, 4, 52, 22, 1, 'tatlı', undefined, ['kadayıf'], [{ label: '1 porsiyon', grams: 100 }, { label: '100 g', grams: 100 }]),
  g('ekmek-kadayifi', 'Ekmek Kadayıfı', 280, 5, 38, 12, 0.5, 'tatlı', undefined, ['ekmek kadayıfı'], [{ label: '1 porsiyon', grams: 150 }, { label: '100 g', grams: 100 }]),
  g('supangle', 'Supangle', 160, 3.5, 24, 5.5, 1, 'tatlı', undefined, ['supangle']),
  g('muhallebi', 'Muhallebi', 115, 3, 18, 3.5, 0, 'tatlı', undefined, ['muhallebi']),
  g('tavuk-gogsu-tatli', 'Tavuk Göğsü (Tatlı)', 145, 5, 22, 4, 0, 'tatlı', undefined, ['tavuk göğsü tatlı']),
  g('zerde', 'Zerde', 130, 1, 28, 1.5, 0.5, 'tatlı', undefined, ['zerde']),
  g('kurabiye', 'Kurabiye', 480, 5, 62, 24, 1.5, 'tatlı', undefined, ['kurabiye', 'un kurabiyesi'], [{ label: '1 adet', grams: 15 }, { label: '100 g', grams: 100 }]),
  g('cikolatali-kurabiye', 'Çikolatalı Kurabiye', 490, 6, 60, 25, 2.5, 'tatlı', undefined, ['cookie'], [{ label: '1 adet', grams: 25 }, { label: '100 g', grams: 100 }]),

  // ═══════════════════════════════════════════════════════════════════════════
  // EK MARKET ÜRÜNLERİ — Kahvaltılık, atıştırmalık, hazır gıda
  // ═══════════════════════════════════════════════════════════════════════════
  g('pinar-cheddar', 'Pınar Cheddar', 345, 22, 2, 28, 0, 'süt-ürünü', 'Pınar', ['cheddar'], S_DILIM),
  g('bahcivan-hellim', 'Bahçıvan Hellim', 320, 25, 1.5, 24, 0, 'süt-ürünü', 'Bahçıvan', ['hellim'], S_DILIM),
  g('eker-suzme-peynir', 'Eker Süzme Peynir', 105, 15, 3, 3.5, 0, 'süt-ürünü', 'Eker', ['süzme peynir']),
  g('sutas-meyveli-yogurt', 'Sütaş Meyveli Yoğurt', 85, 3.5, 13, 2, 0.5, 'süt-ürünü', 'Sütaş', ['meyveli yoğurt']),
  g('danone-oikos', 'Danone Oikos Greek', 97, 9, 4, 5, 0, 'süt-ürünü', 'Danone', ['oikos', 'greek'], S_KASE),
  g('pinar-protein-yogurt', 'Pınar Protein Yoğurt', 58, 10, 4, 0.3, 0, 'süt-ürünü', 'Pınar', ['protein yoğurt'], S_KASE),
  g('sutas-cacik', 'Sütaş Cacık', 36, 2, 3, 1.5, 0.3, 'süt-ürünü', 'Sütaş', ['cacık']),
  g('pinar-lor', 'Pınar Lor Peyniri', 98, 17, 3, 2, 0, 'süt-ürünü', 'Pınar', ['lor'], [{ label: '1 yemek kaşığı', grams: 25 }, { label: '100 g', grams: 100 }]),
  g('philadelphia-krem', 'Philadelphia Krem Peynir', 249, 6, 4, 24, 0, 'süt-ürünü', 'Philadelphia', ['philadelphia', 'krem peynir'], S_YKASIK),
  g('milka-oreo', 'Milka Oreo', 510, 5, 60, 28, 1.5, 'atıştırmalık', 'Milka', ['milka oreo'], [{ label: '1 kare', grams: 8 }, { label: '100 g', grams: 100 }]),
  g('cadbury-dairy-milk', 'Cadbury Dairy Milk', 534, 7.5, 57, 30, 2, 'atıştırmalık', 'Cadbury', ['cadbury'], [{ label: '1 kare', grams: 8 }, { label: '100 g', grams: 100 }]),
  pc('ulker-metro-cikolatali', 'Ülker Metro Çikolatalı', 475, 5, 60, 24, 1.5, 'atıştırmalık', 36, '1 adet', 'Ülker', ['metro']),
  g('bim-cokokrem', 'BİM Çokokrem', 540, 5, 57, 33, 2, 'diğer', 'BİM', ['çikolatalı krema'], S_YKASIK),
  g('a101-nutella', 'A101 Fındık Kreması', 540, 5, 57, 33, 2, 'diğer', 'A101', ['fındık kreması'], S_YKASIK),
  g('bim-recel', 'BİM Reçel', 250, 0.3, 62, 0, 1, 'diğer', 'BİM', ['reçel'], S_YKASIK),
  g('a101-recel', 'A101 Reçel', 250, 0.3, 62, 0, 1, 'diğer', 'A101', ['reçel'], S_YKASIK),
  g('bim-pekmez', 'BİM Pekmez', 290, 1, 72, 0.2, 0, 'diğer', 'BİM', ['pekmez'], S_YKASIK),
  g('bim-tereyagi', 'BİM Tereyağı', 717, 0.9, 0.1, 81, 0, 'diğer', 'BİM', ['tereyağı'], S_YKASIK),
  g('a101-tereyagi', 'A101 Tereyağı', 717, 0.9, 0.1, 81, 0, 'diğer', 'A101', ['tereyağı'], S_YKASIK),
  g('pinar-tereyagi', 'Pınar Tereyağı', 717, 0.9, 0.1, 81, 0, 'diğer', 'Pınar', ['tereyağı'], S_YKASIK),
  g('sutas-tereyagi', 'Sütaş Tereyağı', 717, 0.9, 0.1, 81, 0, 'diğer', 'Sütaş', ['tereyağı'], S_YKASIK),
  g('banvit-tavuk-gogsu', 'Banvit Tavuk Göğsü', 110, 24, 0, 1.2, 0, 'protein', 'Banvit', ['tavuk göğsü']),
  g('banvit-tavuk-but', 'Banvit Tavuk But', 140, 18, 0, 7, 0, 'protein', 'Banvit', ['tavuk but']),
  g('namet-tavuk-sosis', 'Namet Tavuk Sosis', 230, 13, 2, 18, 0, 'şarküteri', 'Namet', ['tavuk sosis'], [{ label: '1 adet', grams: 25 }, { label: '100 g', grams: 100 }]),
  g('namet-hindi-jambon', 'Namet Hindi Jambon', 105, 18, 2, 3, 0, 'şarküteri', 'Namet', ['hindi jambon'], S_DILIM),
  g('pinar-hindi-jambon', 'Pınar Hindi Jambon', 110, 18, 2, 3.5, 0, 'şarküteri', 'Pınar', ['hindi jambon'], S_DILIM),

  // ═══════════════════════════════════════════════════════════════════════════
  // EK KAHVALTILIK & TEMEL GIDALAR
  // ═══════════════════════════════════════════════════════════════════════════
  g('misir-cipsi-nachos', 'Mısır Cipsi (Nachos)', 490, 7, 60, 24, 4, 'atıştırmalık', undefined, ['nachos', 'mısır cipsi']),
  g('karisik-meyve-suyu', 'Karışık Meyve Suyu', 46, 0.5, 11, 0.1, 0.2, 'içecek', undefined, ['meyve suyu'], S_KUTU),
  g('portakal-suyu-hazir', 'Portakal Suyu (Hazır)', 45, 0.7, 10, 0.2, 0.2, 'içecek', undefined, ['portakal suyu'], S_KUTU),
  g('seftali-nektari', 'Şeftali Nektarı', 50, 0.3, 12, 0.1, 0.5, 'içecek', undefined, ['şeftali suyu'], S_KUTU),
  g('visne-suyu', 'Vişne Suyu', 52, 0.3, 13, 0.1, 0.3, 'içecek', undefined, ['vişne suyu'], S_KUTU),
  g('elma-suyu', 'Elma Suyu', 46, 0.1, 11, 0.1, 0.2, 'içecek', undefined, ['elma suyu'], S_KUTU),
  g('acai-bowl', 'Açai Bowl', 150, 3, 22, 6, 5, 'meyve', undefined, ['açai', 'acai bowl'], S_KASE),
  g('chia-puding', 'Chia Puding', 160, 5, 18, 8, 7, 'tatlı', undefined, ['chia puding']),
  g('overnight-oats', 'Overnight Oats', 180, 7, 28, 5, 4, 'tahıl', undefined, ['overnight oats', 'gece yulafı'], S_KASE),
  g('granola-bar', 'Granola Bar', 450, 7, 62, 18, 4, 'atıştırmalık', undefined, ['granola bar'], [{ label: '1 adet (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('pirinc-keki', 'Pirinç Keki', 375, 5, 82, 1, 0.5, 'atıştırmalık', undefined, ['pirinç keki', 'rice cake'], [{ label: '1 adet', grams: 10 }, { label: '100 g', grams: 100 }]),
]

// ═══════════════════════════════════════════════════════════════════════════════
// AVRUPA ZİNCİRLERİ — Carrefour, Lidl, Kaufland + uluslararası markalar
// Avrupa'dan kullananlar için: Lidl private-label (Milbona, Freeway, Solevita,
// Crownfield, Combino, Fin Carré, Sondey, McEnnedy), Carrefour, Kaufland K-Classic,
// + yaygın Avrupa markaları (Alpro, Oatly, Président, Müller, Ehrmann, Ritter Sport,
// Lindt, Lotus, Leibniz, McVitie's, Iglo, Dr. Oetker Ristorante, Hellmann's, Maggi,
// Bonduelle, Rio Mare, vb.)
// ═══════════════════════════════════════════════════════════════════════════════
const EUROPEAN_FOODS: TurkishFood[] = [
  // ─── LIDL PRIVATE LABEL ────────────────────────────────────────────────────
  // Milbona (Lidl dairy)
  g('milbona-sut', 'Milbona Süt (Tam Yağlı)', 64, 3.3, 4.8, 3.5, 0, 'süt-ürünü', 'Milbona', ['lidl', 'süt'], S_BARDAK),
  g('milbona-yarim-yagli', 'Milbona Süt (Yarım Yağlı)', 46, 3.4, 4.9, 1.5, 0, 'süt-ürünü', 'Milbona', ['lidl', 'süt'], S_BARDAK),
  g('milbona-yogurt', 'Milbona Yoğurt (Doğal)', 61, 3.5, 4.5, 3.3, 0, 'süt-ürünü', 'Milbona', ['lidl', 'yoğurt'], S_KASE),
  g('milbona-greek-yogurt', 'Milbona Greek Yogurt (%10)', 130, 5, 4, 10, 0, 'süt-ürünü', 'Milbona', ['lidl', 'greek yogurt'], S_KASE),
  g('milbona-protein-yogurt', 'Milbona Protein Yoğurt', 57, 10, 4, 0.2, 0, 'süt-ürünü', 'Milbona', ['lidl', 'protein yoğurt'], [{ label: '1 kase (200 g)', grams: 200 }]),
  g('milbona-kasar', 'Milbona Gouda Peyniri', 356, 24, 0.5, 28, 0, 'süt-ürünü', 'Milbona', ['lidl', 'gouda'], S_DILIM),
  g('milbona-emmental', 'Milbona Emmental', 380, 29, 0.5, 29, 0, 'süt-ürünü', 'Milbona', ['lidl', 'emmental'], S_DILIM),
  g('milbona-mozzarella', 'Milbona Mozzarella', 254, 19, 1, 19, 0, 'süt-ürünü', 'Milbona', ['lidl', 'mozzarella'], S_DILIM),
  g('milbona-tereyagi', 'Milbona Tereyağı', 740, 0.6, 0.6, 82, 0, 'süt-ürünü', 'Milbona', ['lidl', 'tereyağı'], S_YKASIK),

  // Freeway (Lidl drinks)
  g('freeway-cola', 'Freeway Cola', 42, 0, 10.6, 0, 0, 'içecek', 'Freeway', ['lidl', 'cola'], S_KUTU330),
  g('freeway-cola-zero', 'Freeway Cola Zero', 0.4, 0, 0, 0, 0, 'içecek', 'Freeway', ['lidl', 'cola zero'], S_KUTU330),
  g('freeway-energy', 'Freeway Energy Drink', 45, 0, 11, 0, 0, 'içecek', 'Freeway', ['lidl', 'enerji'], S_KUTU250),

  // Solevita (Lidl juices)
  g('solevita-portakal', 'Solevita Portakal Suyu', 43, 0.7, 10, 0.1, 0.2, 'içecek', 'Solevita', ['lidl', 'portakal suyu'], S_BARDAK),
  g('solevita-elma', 'Solevita Elma Suyu', 46, 0.1, 11, 0.1, 0.2, 'içecek', 'Solevita', ['lidl', 'elma suyu'], S_BARDAK),

  // Crownfield (Lidl cereals)
  g('crownfield-corn-flakes', 'Crownfield Corn Flakes', 378, 7, 84, 1, 3, 'tahıl', 'Crownfield', ['lidl', 'gevrek'], [{ label: '1 kase (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),
  g('crownfield-granola', 'Crownfield Crunchy Granola', 445, 8, 62, 18, 5, 'tahıl', 'Crownfield', ['lidl', 'granola'], [{ label: '1 kase (45 g)', grams: 45 }, { label: '100 g', grams: 100 }]),
  g('crownfield-protein-musli', 'Crownfield Protein Müsli', 390, 25, 42, 12, 8, 'tahıl', 'Crownfield', ['lidl', 'müsli', 'protein'], [{ label: '1 kase (60 g)', grams: 60 }, { label: '100 g', grams: 100 }]),

  // Combino (Lidl pasta)
  g('combino-spagetti', 'Combino Spaghetti (Çiğ)', 355, 12, 72, 1.5, 3, 'tahıl', 'Combino', ['lidl', 'makarna'], [{ label: '1 porsiyon', grams: 85 }, { label: '100 g', grams: 100 }]),
  g('combino-penne', 'Combino Penne (Çiğ)', 355, 12, 72, 1.5, 3, 'tahıl', 'Combino', ['lidl', 'makarna'], [{ label: '1 porsiyon', grams: 85 }, { label: '100 g', grams: 100 }]),

  // Fin Carré (Lidl chocolate)
  pc('fin-carre-sutlu', 'Fin Carré Sütlü Çikolata', 535, 7, 57, 31, 1, 'atıştırmalık', 25, '4 kare', 'Fin Carré', ['lidl', 'çikolata']),
  pc('fin-carre-bitter', 'Fin Carré Bitter %70', 570, 8, 38, 42, 8, 'atıştırmalık', 25, '4 kare', 'Fin Carré', ['lidl', 'bitter']),

  // Sondey (Lidl biscuits)
  pc('sondey-digestive', 'Sondey Digestive Bisküvi', 470, 7, 65, 20, 4, 'atıştırmalık', 14, '1 adet', 'Sondey', ['lidl', 'bisküvi']),
  pc('sondey-cookies', 'Sondey Chocolate Chip Cookies', 490, 6, 62, 24, 3, 'atıştırmalık', 12, '1 adet', 'Sondey', ['lidl', 'kurabiye']),

  // McEnnedy (Lidl American-style)
  pc('mcennedy-burger', 'McEnnedy Beef Burger (Donuk)', 220, 15, 8, 14, 1, 'hazır-yemek', 100, '1 adet', 'McEnnedy', ['lidl', 'burger']),
  g('mcennedy-tortilla-chips', 'McEnnedy Tortilla Chips', 480, 7, 60, 23, 4, 'atıştırmalık', 'McEnnedy', ['lidl', 'cips', 'nachos'], [{ label: '1 avuç (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),

  // Chef Select (Lidl ready meals)
  g('chef-select-lazanya', 'Chef Select Lazanya', 135, 7, 14, 5.5, 1, 'hazır-yemek', 'Chef Select', ['lidl', 'lazanya'], [{ label: '1 porsiyon (400 g)', grams: 400 }, { label: '100 g', grams: 100 }]),

  // ─── CARREFOUR PRIVATE LABEL ───────────────────────────────────────────────
  g('carrefour-sut', 'Carrefour Süt (Tam Yağlı)', 64, 3.3, 4.8, 3.5, 0, 'süt-ürünü', 'Carrefour', ['süt'], S_BARDAK),
  g('carrefour-yogurt', 'Carrefour Yoğurt (Doğal)', 60, 3.4, 4.5, 3.2, 0, 'süt-ürünü', 'Carrefour', ['yoğurt'], S_KASE),
  g('carrefour-kasar', 'Carrefour Kaşar Peyniri', 345, 24, 0.5, 27, 0, 'süt-ürünü', 'Carrefour', ['kaşar'], S_DILIM),
  g('carrefour-beyaz-peynir', 'Carrefour Beyaz Peynir', 250, 16, 1, 20, 0, 'süt-ürünü', 'Carrefour', ['beyaz peynir'], S_DILIM),
  g('carrefour-tereyagi', 'Carrefour Tereyağı', 740, 0.6, 0.6, 82, 0, 'süt-ürünü', 'Carrefour', ['tereyağı'], S_YKASIK),
  g('carrefour-sucuk', 'Carrefour Sucuk', 345, 17, 1, 30, 0, 'şarküteri', 'Carrefour', ['sucuk'], S_DILIM),
  g('carrefour-sosis', 'Carrefour Sosis', 245, 12, 3, 20, 0, 'şarküteri', 'Carrefour', ['sosis'], [{ label: '1 adet', grams: 25 }, { label: '100 g', grams: 100 }]),
  g('carrefour-cips', 'Carrefour Patates Cipsi', 530, 6, 53, 33, 3, 'atıştırmalık', 'Carrefour', ['cips'], [{ label: '1 paket (70 g)', grams: 70 }, { label: '100 g', grams: 100 }]),
  g('carrefour-su', 'Carrefour Su', 0, 0, 0, 0, 0, 'içecek', 'Carrefour', ['su'], S_SISE),
  g('carrefour-bio-yogurt', 'Carrefour Bio Yoğurt (Organik)', 62, 3.6, 4.5, 3.4, 0, 'süt-ürünü', 'Carrefour Bio', ['organik yoğurt'], S_KASE),
  g('carrefour-bio-sut', 'Carrefour Bio Süt (Organik)', 65, 3.4, 4.9, 3.6, 0, 'süt-ürünü', 'Carrefour Bio', ['organik süt'], S_BARDAK),

  // ─── KAUFLAND PRIVATE LABEL ────────────────────────────────────────────────
  g('k-classic-sut', 'K-Classic Süt (Tam Yağlı)', 64, 3.3, 4.8, 3.5, 0, 'süt-ürünü', 'K-Classic', ['kaufland', 'süt'], S_BARDAK),
  g('k-classic-yogurt', 'K-Classic Yoğurt', 60, 3.4, 4.5, 3.2, 0, 'süt-ürünü', 'K-Classic', ['kaufland', 'yoğurt'], S_KASE),
  g('k-classic-gouda', 'K-Classic Gouda', 356, 24, 0.5, 28, 0, 'süt-ürünü', 'K-Classic', ['kaufland', 'gouda'], S_DILIM),
  g('k-classic-emmental', 'K-Classic Emmental', 380, 29, 0.5, 29, 0, 'süt-ürünü', 'K-Classic', ['kaufland', 'emmental'], S_DILIM),
  g('k-classic-cips', 'K-Classic Chips', 530, 6, 53, 33, 3, 'atıştırmalık', 'K-Classic', ['kaufland', 'cips'], [{ label: '1 paket (70 g)', grams: 70 }, { label: '100 g', grams: 100 }]),
  g('k-classic-cola', 'K-Classic Cola', 42, 0, 10.5, 0, 0, 'içecek', 'K-Classic', ['kaufland', 'cola'], S_KUTU330),

  // ─── AVRUPA PEYNİR ÇEŞİTLERİ ──────────────────────────────────────────────
  g('gouda-peyniri', 'Gouda Peyniri', 356, 24, 0.5, 28, 0, 'süt-ürünü', undefined, ['gouda', 'hollanda peyniri'], S_DILIM),
  g('emmental-peyniri', 'Emmental Peyniri', 380, 29, 0.5, 29, 0, 'süt-ürünü', undefined, ['emmental', 'isviçre peyniri'], S_DILIM),
  g('brie-peyniri', 'Brie Peyniri', 334, 21, 0.5, 28, 0, 'süt-ürünü', undefined, ['brie'], S_DILIM),
  g('camembert-peyniri', 'Camembert Peyniri', 300, 20, 0.5, 24, 0, 'süt-ürünü', undefined, ['camembert'], S_DILIM),
  g('feta-peyniri', 'Feta Peyniri', 264, 14, 4, 21, 0, 'süt-ürünü', undefined, ['feta', 'yunan peyniri'], S_DILIM),
  g('mascarpone-peyniri', 'Mascarpone', 429, 4, 3, 44, 0, 'süt-ürünü', undefined, ['mascarpone'], S_YKASIK),
  g('parmesan-peyniri', 'Parmesan Peyniri', 431, 38, 4, 29, 0, 'süt-ürünü', undefined, ['parmesan', 'parmigiano'], [{ label: '1 yemek kaşığı (5 g)', grams: 5 }, { label: '100 g', grams: 100 }]),
  g('ricotta-peyniri', 'Ricotta Peyniri', 174, 11, 3, 13, 0, 'süt-ürünü', undefined, ['ricotta'], S_YKASIK),
  g('gruyere-peyniri', 'Gruyère Peyniri', 413, 30, 0.4, 32, 0, 'süt-ürünü', undefined, ['gruyère', 'gruyere'], S_DILIM),
  g('roquefort-peyniri', 'Roquefort (Küflü Peynir)', 369, 22, 2, 31, 0, 'süt-ürünü', undefined, ['roquefort', 'küflü peynir'], S_DILIM),

  // ─── ULUSLARARASI SÜT ÜRÜNLERİ ────────────────────────────────────────────
  // Président
  g('president-tereyagi', 'Président Tereyağı', 740, 0.6, 0.7, 82, 0, 'süt-ürünü', 'Président', ['tereyağı'], S_YKASIK),
  g('president-brie', 'Président Brie', 334, 21, 0.5, 28, 0, 'süt-ürünü', 'Président', ['brie'], S_DILIM),
  g('president-camembert', 'Président Camembert', 300, 20, 0.5, 24, 0, 'süt-ürünü', 'Président', ['camembert'], S_DILIM),

  // Babybel / Kiri / La Vache qui Rit
  pc('babybel-original', 'Babybel Original', 310, 22, 0, 25, 0, 'süt-ürünü', 20, '1 adet', 'Babybel', ['babybel']),
  pc('kiri-peynir', 'Kiri Krem Peynir', 305, 7, 3, 30, 0, 'süt-ürünü', 18, '1 adet', 'Kiri', ['kiri', 'krem peynir']),
  pc('lavache-qui-rit', 'La Vache Qui Rit', 220, 11, 5, 17, 0, 'süt-ürünü', 17, '1 üçgen', 'La Vache Qui Rit', ['gülen inek peyniri']),

  // Philadelphia
  g('philadelphia-original', 'Philadelphia Original', 215, 5.5, 3.5, 20, 0, 'süt-ürünü', 'Philadelphia', ['philadelphia', 'krem peynir'], S_YKASIK),
  g('philadelphia-light', 'Philadelphia Light', 135, 8, 4, 9.5, 0, 'süt-ürünü', 'Philadelphia', ['philadelphia light'], S_YKASIK),

  // Müller / Ehrmann / Zott
  g('muller-corner', 'Müller Corner Yoğurt', 110, 5, 17, 2.5, 0.3, 'süt-ürünü', 'Müller', ['müller', 'meyveli yoğurt'], [{ label: '1 kase (143 g)', grams: 143 }]),
  g('muller-rice', 'Müller Rice', 120, 3.5, 20, 3, 0.2, 'süt-ürünü', 'Müller', ['müller rice', 'sütlü pirinç'], [{ label: '1 kase (180 g)', grams: 180 }]),
  g('ehrmann-protein-puding', 'Ehrmann High Protein Puding', 92, 12, 9.5, 1.2, 0.4, 'takviye', 'Ehrmann', ['protein puding', 'ehrmann'], [{ label: '1 kase (200 g)', grams: 200 }]),
  g('ehrmann-protein-yogurt', 'Ehrmann High Protein Yoğurt', 54, 10, 3, 0.2, 0, 'süt-ürünü', 'Ehrmann', ['protein yoğurt'], [{ label: '1 kase (200 g)', grams: 200 }]),
  g('zott-monte', 'Zott Monte', 135, 3, 16, 6.5, 0.3, 'süt-ürünü', 'Zott', ['monte', 'çikolatalı süt tatlısı'], [{ label: '1 kase (150 g)', grams: 150 }]),
  g('zott-sahne-joghurt', 'Zott Sahne Joghurt', 105, 3.5, 13, 4.5, 0.2, 'süt-ürünü', 'Zott', ['meyveli yoğurt'], [{ label: '1 kase (150 g)', grams: 150 }]),
  g('danio-protein', 'Danio High Protein', 75, 11, 6, 0.8, 0, 'süt-ürünü', 'Danone', ['danio', 'protein yoğurt'], [{ label: '1 kase (170 g)', grams: 170 }]),
  g('yakult', 'Yakult', 55, 1.2, 12, 0.1, 0, 'süt-ürünü', 'Yakult', ['yakult', 'probiyotik'], [{ label: '1 şişe (65 ml)', grams: 65 }]),

  // ─── BİTKİSEL ALTERNATIFLER (Plant-Based) ─────────────────────────────────
  g('alpro-soya-sut', 'Alpro Soya Sütü', 39, 3.3, 2.5, 1.8, 0.5, 'içecek', 'Alpro', ['alpro', 'soya sütü', 'bitkisel süt'], S_BARDAK),
  g('alpro-badem-sut', 'Alpro Badem Sütü', 24, 0.5, 3, 1.1, 0.3, 'içecek', 'Alpro', ['alpro', 'badem sütü'], S_BARDAK),
  g('alpro-yulaf-sut', 'Alpro Yulaf Sütü', 44, 0.3, 6.7, 1.5, 0.8, 'içecek', 'Alpro', ['alpro', 'yulaf sütü'], S_BARDAK),
  g('alpro-hindistan-cevizi', 'Alpro Hindistan Cevizi Sütü', 20, 0.2, 2.7, 0.9, 0.1, 'içecek', 'Alpro', ['alpro', 'hindistan cevizi sütü'], S_BARDAK),
  g('alpro-soya-yogurt', 'Alpro Soya Yoğurt', 50, 4, 2.3, 2.3, 1, 'süt-ürünü', 'Alpro', ['alpro', 'bitkisel yoğurt'], S_KASE),
  g('oatly-yulaf-sut', 'Oatly Yulaf Sütü', 46, 0.3, 6.5, 1.5, 0.8, 'içecek', 'Oatly', ['oatly', 'yulaf sütü'], S_BARDAK),
  g('oatly-barista', 'Oatly Barista Edition', 59, 0.4, 6, 3.3, 0.8, 'içecek', 'Oatly', ['oatly', 'barista', 'yulaf sütü'], S_BARDAK),
  g('oatly-cream', 'Oatly Yulaf Kreması', 150, 0.3, 5, 14, 0.5, 'içecek', 'Oatly', ['oatly', 'bitkisel krema'], S_YKASIK),

  // ─── AVRUPA ÇİKOLATA & ATIŞTIRMALIK ───────────────────────────────────────
  // Ritter Sport
  pc('ritter-sport-sutlu', 'Ritter Sport Sütlü Çikolata', 545, 8, 53, 34, 1, 'atıştırmalık', 17, '1 kare', 'Ritter Sport', ['ritter', 'çikolata']),
  pc('ritter-sport-findikli', 'Ritter Sport Fındıklı', 575, 9, 44, 41, 3, 'atıştırmalık', 17, '1 kare', 'Ritter Sport', ['ritter', 'fındıklı']),
  pc('ritter-sport-marzipan', 'Ritter Sport Marzipan', 475, 6, 52, 27, 2, 'atıştırmalık', 17, '1 kare', 'Ritter Sport', ['ritter', 'marzipan']),

  // Lindt
  pc('lindt-excellence-85', 'Lindt Excellence %85 Bitter', 580, 11, 22, 50, 13, 'atıştırmalık', 10, '2 kare', 'Lindt', ['lindt', 'bitter']),
  pc('lindt-excellence-70', 'Lindt Excellence %70 Bitter', 560, 9, 32, 43, 10, 'atıştırmalık', 10, '2 kare', 'Lindt', ['lindt', 'bitter']),
  pc('lindt-lindor', 'Lindt Lindor Truffle', 550, 6, 46, 39, 2, 'atıştırmalık', 12, '1 adet', 'Lindt', ['lindt', 'lindor']),

  // Lotus Biscoff
  pc('lotus-biscoff', 'Lotus Biscoff Bisküvi', 484, 3, 76, 18, 1.5, 'atıştırmalık', 7.8, '1 adet', 'Lotus', ['lotus', 'biscoff', 'bisküvi']),
  g('lotus-biscoff-spread', 'Lotus Biscoff Spread', 580, 3, 58, 37, 1, 'atıştırmalık', 'Lotus', ['lotus', 'biscoff krema'], S_YKASIK),

  // Leibniz / Bahlsen
  pc('leibniz-minis', 'Leibniz Minis Çikolatalı', 490, 7, 62, 23, 3, 'atıştırmalık', 5, '1 adet', 'Leibniz', ['leibniz', 'bisküvi']),
  pc('bahlsen-hit', 'Bahlsen Hit Kakaolu', 480, 6, 64, 22, 2, 'atıştırmalık', 12, '1 adet', 'Bahlsen', ['bahlsen', 'bisküvi']),

  // McVitie's
  pc('mcvities-digestive', "McVitie's Digestive", 470, 7, 65, 20, 4, 'atıştırmalık', 14, '1 adet', "McVitie's", ['digestive', 'bisküvi']),
  pc('mcvities-hobnobs', "McVitie's Hobnobs", 470, 7, 61, 21, 5, 'atıştırmalık', 13, '1 adet', "McVitie's", ['hobnobs']),

  // LU
  pc('lu-prince', 'LU Prince Çikolatalı', 462, 7, 68, 18, 3, 'atıştırmalık', 15, '1 adet', 'LU', ['lu prince', 'bisküvi']),
  pc('lu-tuc-kraker', 'TUC Kraker', 490, 8, 60, 24, 2, 'atıştırmalık', 4, '1 adet', 'LU', ['tuc', 'kraker']),

  // Skittles
  pc('skittles', 'Skittles', 400, 0.4, 90, 4.4, 0, 'atıştırmalık', 55, '1 paket', 'Skittles', ['skittles', 'şeker']),

  // Kinder ek
  pc('kinder-surprise', 'Kinder Surprise', 555, 8.5, 52, 35, 1.5, 'atıştırmalık', 20, '1 adet', 'Kinder', ['kinder surprise']),
  pc('kinder-happy-hippo', 'Kinder Happy Hippo', 570, 8, 50, 38, 1, 'atıştırmalık', 20, '1 adet', 'Kinder', ['happy hippo']),
  pc('kinder-pingui', 'Kinder Pinguí', 430, 5.5, 40, 28, 1, 'atıştırmalık', 30, '1 adet', 'Kinder', ['pingui']),

  // ─── AVRUPA İÇECEKLER ─────────────────────────────────────────────────────
  g('san-pellegrino', 'San Pellegrino Maden Suyu', 0, 0, 0, 0, 0, 'içecek', 'San Pellegrino', ['maden suyu'], S_SISE),
  g('san-pellegrino-limonata', 'San Pellegrino Limonata', 40, 0, 9.8, 0, 0, 'içecek', 'San Pellegrino', ['limonata'], S_KUTU330),
  g('dr-pepper', 'Dr Pepper', 44, 0, 11, 0, 0, 'içecek', 'Dr Pepper', ['dr pepper'], S_KUTU330),
  g('innocent-smoothie', 'Innocent Smoothie (Karışık)', 52, 0.5, 11, 0.2, 1, 'içecek', 'Innocent', ['smoothie'], S_KUTU250),
  g('oasis-meyve-icecek', 'Oasis Meyve İçeceği', 30, 0, 7, 0, 0, 'içecek', 'Oasis', ['meyve suyu'], S_SISE),
  g('evian-su', 'Evian Su', 0, 0, 0, 0, 0, 'içecek', 'Evian', ['su'], S_SISE),
  g('vittel-su', 'Vittel Su', 0, 0, 0, 0, 0, 'içecek', 'Vittel', ['su'], S_SISE),
  g('perrier-maden', 'Perrier Maden Suyu', 0, 0, 0, 0, 0, 'içecek', 'Perrier', ['maden suyu'], S_SISE330),
  g('monster-ultra', 'Monster Ultra (Şekersiz)', 3, 0, 0.5, 0, 0, 'içecek', 'Monster', ['monster', 'enerji', 'şekersiz'], S_KUTU),

  // ─── AVRUPA DONUK GIDA ─────────────────────────────────────────────────────
  // Iglo
  g('iglo-balik-parmak', 'Iglo Balık Parmak', 195, 11, 19, 8, 1, 'hazır-yemek', 'Iglo', ['balık parmak', 'donuk'], [{ label: '4 adet', grams: 112 }, { label: '100 g', grams: 100 }]),
  g('iglo-ispanak', 'Iglo Dondurulmuş Ispanak', 23, 2.8, 1.6, 0.4, 2, 'sebze', 'Iglo', ['donuk ıspanak'], S_KASE),
  g('iglo-sebze-karisim', 'Iglo Karışık Sebze', 40, 2.5, 6, 0.3, 3, 'sebze', 'Iglo', ['donuk sebze'], S_KASE),

  // Dr. Oetker Ristorante
  g('ristorante-margherita', 'Dr. Oetker Ristorante Margherita', 230, 10, 26, 9, 1.5, 'hazır-yemek', 'Dr. Oetker', ['ristorante', 'donuk pizza', 'pizza'], [{ label: '½ pizza (175 g)', grams: 175 }, { label: '100 g', grams: 100 }]),
  g('ristorante-salame', 'Dr. Oetker Ristorante Salame', 250, 11, 26, 11, 1.5, 'hazır-yemek', 'Dr. Oetker', ['ristorante', 'donuk pizza'], [{ label: '½ pizza (175 g)', grams: 175 }, { label: '100 g', grams: 100 }]),
  g('ristorante-quattro-formaggi', 'Dr. Oetker Ristorante Quattro Formaggi', 245, 12, 25, 11, 1, 'hazır-yemek', 'Dr. Oetker', ['ristorante', 'pizza'], [{ label: '½ pizza (170 g)', grams: 170 }, { label: '100 g', grams: 100 }]),

  // Wagner
  g('wagner-big-pizza', 'Wagner Big Pizza', 220, 9, 27, 8, 1.5, 'hazır-yemek', 'Wagner', ['pizza', 'donuk'], [{ label: '½ pizza (200 g)', grams: 200 }, { label: '100 g', grams: 100 }]),

  // ─── AVRUPA SOS & KONSERVE ─────────────────────────────────────────────────
  // Hellmann's
  g('hellmanns-mayonez', "Hellmann's Mayonez", 720, 1, 1, 79, 0, 'diğer', "Hellmann's", ['mayonez'], S_YKASIK),
  g('hellmanns-light', "Hellmann's Light Mayonez", 327, 0.8, 6, 33, 0, 'diğer', "Hellmann's", ['light mayonez'], S_YKASIK),

  // Maggi
  g('maggi-fix-bolognese', 'Maggi Fix Bolognese', 75, 4, 12, 1, 2, 'hazır-yemek', 'Maggi', ['bolognese sosu', 'maggi']),
  g('maggi-tavuk-suyu', 'Maggi Tavuk Suyu Küp', 150, 6, 12, 8, 0, 'çorba', 'Maggi', ['tavuk suyu', 'bouillon'], [{ label: '1 küp', grams: 10 }, { label: '100 g', grams: 100 }]),

  // Tabasco / Sriracha
  g('tabasco', 'Tabasco Sos', 12, 1, 1.5, 0.3, 0.5, 'diğer', 'Tabasco', ['tabasco', 'acı sos'], [{ label: '1 çay kaşığı', grams: 5 }, { label: '100 ml', grams: 100 }]),
  g('sriracha', 'Sriracha Sos', 93, 2, 19, 1, 1.5, 'diğer', 'Sriracha', ['sriracha', 'acı sos'], [{ label: '1 çay kaşığı', grams: 5 }, { label: '100 ml', grams: 100 }]),

  // Bonduelle (konserve sebze)
  g('bonduelle-misir', 'Bonduelle Konserve Mısır', 82, 2.7, 16, 1, 2, 'diğer', 'Bonduelle', ['konserve mısır'], [{ label: '½ kutu (140 g)', grams: 140 }, { label: '100 g', grams: 100 }]),
  g('bonduelle-bezelye', 'Bonduelle Konserve Bezelye', 65, 4, 10, 0.3, 4, 'diğer', 'Bonduelle', ['konserve bezelye'], [{ label: '½ kutu (140 g)', grams: 140 }, { label: '100 g', grams: 100 }]),
  g('bonduelle-karisik', 'Bonduelle Karışık Sebze', 55, 3, 8, 0.3, 3, 'diğer', 'Bonduelle', ['konserve sebze'], [{ label: '½ kutu (140 g)', grams: 140 }, { label: '100 g', grams: 100 }]),

  // Rio Mare (ton balığı)
  g('rio-mare-suda', 'Rio Mare Ton Balığı (Suda)', 103, 23, 0, 1, 0, 'protein', 'Rio Mare', ['ton balığı', 'konserve'], [{ label: '1 kutu (80 g)', grams: 80 }, { label: '100 g', grams: 100 }]),
  g('rio-mare-yagda', 'Rio Mare Ton Balığı (Zeytinyağlı)', 198, 24, 0, 11, 0, 'protein', 'Rio Mare', ['ton balığı', 'konserve'], [{ label: '1 kutu (80 g)', grams: 80 }, { label: '100 g', grams: 100 }]),

  // ─── AVRUPA KAHVALTILIK & TAHIL ────────────────────────────────────────────
  pc('weetabix', 'Weetabix', 362, 11, 68, 2, 10, 'tahıl', 19, '1 adet', 'Weetabix', ['weetabix', 'gevrek']),
  g('jordans-granola', "Jordan's Granola", 440, 8, 60, 18, 6, 'tahıl', "Jordan's", ['granola'], [{ label: '1 kase (45 g)', grams: 45 }, { label: '100 g', grams: 100 }]),
  g('nestle-fitness', 'Nestlé Fitness Gevrek', 375, 8, 76, 3, 6, 'tahıl', 'Nestlé', ['fitness', 'gevrek'], [{ label: '1 kase (30 g)', grams: 30 }, { label: '100 g', grams: 100 }]),

  // Nutella alternatives (European)
  g('nutella-750', 'Nutella', 539, 6.3, 57.5, 31, 2, 'diğer', 'Nutella', ['nutella', 'fındık kreması'], S_YKASIK),
  g('nocciolata-organik', 'Nocciolata Organik Fındık Kreması', 545, 5, 56, 33, 2.5, 'diğer', 'Nocciolata', ['fındık kreması', 'organik'], S_YKASIK),

  // ─── AVRUPA ET & ŞARKÜTERI ─────────────────────────────────────────────────
  g('prosciutto-crudo', 'Prosciutto Crudo (İtalyan Jambon)', 270, 26, 0, 18, 0, 'şarküteri', undefined, ['prosciutto', 'jambon', 'parma'], S_DILIM),
  g('salami-milano', 'Salami Milano', 400, 22, 1, 34, 0, 'şarküteri', undefined, ['salami', 'milano'], S_DILIM),
  g('chorizo', 'Chorizo', 455, 24, 2, 38, 0, 'şarküteri', undefined, ['chorizo', 'İspanyol sosis'], S_DILIM),
  g('mortadella', 'Mortadella', 311, 14, 3, 27, 0, 'şarküteri', undefined, ['mortadella', 'İtalyan salam'], S_DILIM),
  g('bresaola', 'Bresaola', 151, 34, 0, 2, 0, 'şarküteri', undefined, ['bresaola', 'kurutulmuş et'], S_DILIM),
  g('serrano-jambon', 'Serrano Jambon', 241, 31, 0.5, 12, 0, 'şarküteri', undefined, ['serrano', 'İspanyol jambon'], S_DILIM),

  // ─── AVRUPA HAZIR YEMEK ────────────────────────────────────────────────────
  g('hummus-market', 'Hummus (Market)', 166, 7.9, 14, 9, 6, 'hazır-yemek', undefined, ['humus', 'nohut ezmesi'], S_YKASIK),
  g('tzatziki', 'Tzatziki', 95, 3.5, 4, 7, 0.3, 'hazır-yemek', undefined, ['tzatziki', 'cacık'], S_YKASIK),
  g('guacamole', 'Guacamole', 160, 2, 9, 14, 6.7, 'hazır-yemek', undefined, ['guacamole', 'avokado sos'], S_YKASIK),
  g('tabbouleh', 'Tabbouleh Salatası', 160, 4, 18, 8, 3, 'hazır-yemek', undefined, ['tabbouleh', 'kısır']),
  g('couscous-salata', 'Couscous Salatası', 150, 4, 20, 6, 2, 'hazır-yemek', undefined, ['kuskus salatası']),

  // ─── BİTKİSEL PROTEİN (Plant-Based Meat) ──────────────────────────────────
  pc('beyond-burger', 'Beyond Meat Burger', 230, 20, 6, 14, 2, 'protein', 113, '1 adet', 'Beyond Meat', ['beyond', 'bitkisel burger']),
  g('tofu-firm', 'Tofu (Sıkı)', 144, 17, 3, 8, 2, 'protein', undefined, ['tofu', 'soya peyniri']),
  g('seitan', 'Seitan', 370, 75, 14, 2, 1, 'protein', undefined, ['seitan', 'buğday eti']),
  g('tempeh', 'Tempeh', 192, 20, 8, 11, 5, 'protein', undefined, ['tempeh', 'soya']),
  g('edamame', 'Edamame (Haşlanmış)', 122, 11, 10, 5, 5, 'protein', undefined, ['edamame', 'soya fasulyesi']),
]

// ═══════════════════════════════════════════════════════════════════════════════
// EXPANSION 2 — Dondurmalar, Atıştırmalıklar, Bakliyatlar, Çorbalar,
// Sebzeler, Meyveler, Tatlılar, Hazır Yemekler, Ekmekler ve daha fazlası
// ═══════════════════════════════════════════════════════════════════════════════
const EXPANSION_FOODS_2: TurkishFood[] = [

  // ─── DONDURMALAR ──────────────────────────────────────────────────────────
  pc('magnum-badem', 'Magnum Badem', 260, 4, 26, 16, 0.5, 'tatlı', 86, '1 adet', 'Magnum', ['dondurma', 'magnum']),
  pc('magnum-white', 'Magnum Beyaz Çikolata', 255, 3.8, 27, 15, 0, 'tatlı', 86, '1 adet', 'Magnum', ['dondurma', 'beyaz magnum']),
  pc('magnum-gold', 'Magnum Gold', 268, 3.5, 28, 16, 0, 'tatlı', 85, '1 adet', 'Magnum', ['dondurma']),
  pc('magnum-mini', 'Magnum Mini', 170, 2.5, 18, 10, 0, 'tatlı', 55, '1 adet', 'Magnum', ['dondurma', 'mini magnum']),
  pc('cornetto-klasik', 'Cornetto Klasik', 220, 3, 29, 10, 0.5, 'tatlı', 90, '1 adet', 'Cornetto', ['dondurma', 'külah']),
  pc('cornetto-disk', 'Cornetto Disk', 195, 2.5, 25, 9, 0, 'tatlı', 75, '1 adet', 'Cornetto', ['dondurma']),
  pc('carte-dor-klasik', 'Carte d\'Or Klasik Vanilya', 190, 3.2, 23, 9.5, 0, 'tatlı', 100, '1 top (100g)', 'Carte d\'Or', ['dondurma']),
  pc('carte-dor-cikolata', 'Carte d\'Or Çikolata', 210, 3.8, 26, 10, 1, 'tatlı', 100, '1 top (100g)', 'Carte d\'Or', ['dondurma']),
  pc('carte-dor-cilek', 'Carte d\'Or Çilek', 160, 2.5, 22, 7, 0.3, 'tatlı', 100, '1 top (100g)', 'Carte d\'Or', ['dondurma']),
  pc('golf-dondurma', 'Golf Dondurma (Klasik)', 240, 3, 30, 12, 0, 'tatlı', 100, '1 adet', 'Golf', ['dondurma', 'golf']),
  pc('nogger-dondurma', 'Nogger', 240, 3.5, 27, 13, 0.5, 'tatlı', 90, '1 adet', 'Algida', ['dondurma', 'nogger']),
  pc('cokokrem-dondurma', 'Çokokrem Dondurma', 250, 3.2, 28, 14, 0.5, 'tatlı', 85, '1 adet', 'Ülker', ['dondurma', 'çokokrem']),
  pc('popsicle-meyveli', 'Meyveli Buzlu Dondurma', 80, 0.2, 20, 0.1, 0, 'tatlı', 70, '1 adet', undefined, ['buzlu dondurma', 'popsicle', 'buz']),
  g('dondurma-cikolata', 'Dondurma (Çikolatalı)', 216, 3.8, 28, 11, 1, 'tatlı', undefined, ['çikolatalı dondurma']),
  g('dondurma-cilek', 'Dondurma (Çilekli)', 192, 3, 25, 9, 0.5, 'tatlı', undefined, ['çilekli dondurma']),
  g('dondurma-fistikli', 'Dondurma (Antep Fıstıklı)', 240, 5, 24, 14, 0.5, 'tatlı', undefined, ['fıstıklı dondurma', 'maraş dondurma']),
  g('dondurma-kaymakli', 'Dondurma (Kaymaklı)', 225, 3.5, 22, 14, 0, 'tatlı', undefined, ['kaymaklı dondurma']),
  g('dondurma-limonlu', 'Dondurma (Limonlu)', 150, 1, 24, 5, 0, 'tatlı', undefined, ['limonlu dondurma', 'sorbe']),
  g('dondurma-mango', 'Dondurma (Mangolu)', 170, 1.5, 26, 6.5, 0.3, 'tatlı', undefined, ['mangolu dondurma']),
  g('soft-dondurma', 'Soft Dondurma (Vanilya)', 222, 4, 33, 8, 0, 'tatlı', undefined, ['soft serve', 'yumuşak dondurma']),
  pc('sandwich-dondurma', 'Sandwich Dondurma', 240, 3, 35, 10, 0.5, 'tatlı', 80, '1 adet', undefined, ['dondurma sandviç']),
  pc('calippo-dondurma', 'Calippo', 100, 0, 25, 0, 0, 'tatlı', 105, '1 adet', 'Algida', ['calippo', 'buzlu dondurma']),
  pc('twister-dondurma', 'Twister', 80, 0.5, 18, 0.5, 0, 'tatlı', 80, '1 adet', 'Algida', ['twister', 'dondurma']),
  pc('max-dondurma', 'Max Dondurma (Vanilya-Çikolata)', 245, 3.5, 28, 13, 0.5, 'tatlı', 100, '1 adet', 'Algida', ['max', 'dondurma']),
  pc('feast-dondurma', 'Feast', 265, 3, 30, 15, 0.5, 'tatlı', 90, '1 adet', 'Algida', ['feast dondurma']),
  g('gelato-fistik', 'Gelato (Antep Fıstıklı)', 250, 6, 26, 14, 0.5, 'tatlı', undefined, ['gelato', 'italyan dondurma']),
  pc('bim-dondurma-cub', 'BİM Çubuk Dondurma', 200, 2.5, 24, 10, 0, 'tatlı', 75, '1 adet', 'BİM', ['dondurma', 'bim']),
  pc('a101-dondurma-kaymak', 'A101 Kaymaklı Dondurma', 210, 3, 22, 12, 0, 'tatlı', 100, '1 top (100g)', 'A101', ['dondurma', 'a101']),

  // ─── ATISTIRMALIKLAR — Cipsler, krakerler, kurabiyeler ────────────────────
  pc('lays-klasik', 'Lay\'s Klasik', 536, 6.5, 52, 33, 4, 'atıştırmalık', 30, '1 paket (30g)', 'Lay\'s', ['cips', 'lays']),
  pc('lays-yogurt', 'Lay\'s Yoğurt & Otlar', 530, 6, 53, 33, 3.5, 'atıştırmalık', 30, '1 paket (30g)', 'Lay\'s', ['cips']),
  pc('lays-barbekü', 'Lay\'s Barbekü', 535, 6.5, 53, 33, 3.5, 'atıştırmalık', 30, '1 paket (30g)', 'Lay\'s', ['cips', 'bbq']),
  pc('ruffles-sour-cream', 'Ruffles Sour Cream & Onion', 530, 6, 54, 32, 3.5, 'atıştırmalık', 30, '1 paket (30g)', 'Ruffles', ['cips', 'tırtıklı']),
  pc('doritos-nacho', 'Doritos Nacho', 500, 7, 59, 26, 3, 'atıştırmalık', 30, '1 paket (30g)', 'Doritos', ['cips', 'nachos']),
  pc('doritos-ranch', 'Doritos Cool Ranch', 495, 6.5, 60, 25, 3, 'atıştırmalık', 30, '1 paket (30g)', 'Doritos', ['cips']),
  pc('patos-baharatli', 'Patos Baharatlı', 520, 5, 58, 30, 2, 'atıştırmalık', 30, '1 paket (30g)', 'Patos', ['patos', 'cips']),
  pc('cipso-yogurt', 'Cipso Yoğurtlu', 525, 6, 54, 32, 3, 'atıştırmalık', 30, '1 paket (30g)', 'Cipso', ['cips']),
  pc('tostitos-salsa', 'Tostitos (Salsa)', 480, 7, 62, 23, 3, 'atıştırmalık', 30, '1 paket (30g)', 'Tostitos', ['nachos', 'tortilla cips']),
  pc('cheetos-top', 'Cheetos Top', 510, 6, 56, 29, 2, 'atıştırmalık', 25, '1 paket (25g)', 'Cheetos', ['cheetos', 'peynirli cips']),
  pc('cips-kettle', 'Kettle Chips (Sade)', 500, 6, 52, 30, 5, 'atıştırmalık', 40, '1 paket (40g)', undefined, ['kettle', 'el yapımı cips']),
  pc('peynir-cubugu', 'Peynir Çubuğu (Kızarmış)', 350, 11, 22, 24, 1, 'atıştırmalık', 30, '1 porsiyon (30g)', undefined, ['peynir çubuğu', 'mozzarella stick']),
  pc('simit-cips', 'Simit Cipsi', 420, 8, 62, 15, 3, 'atıştırmalık', 30, '1 paket (30g)', undefined, ['simit cipsi']),
  pc('misir-cubugu', 'Mısır Çubuğu', 480, 4, 62, 24, 1.5, 'atıştırmalık', 30, '1 paket (30g)', undefined, ['mısır çubuğu', 'corn puff']),
  pc('acma-mini', 'Mini Açma (Çikolatalı)', 380, 7, 48, 18, 1.5, 'atıştırmalık', 40, '1 adet', undefined, ['mini açma', 'çikolatalı açma']),
  pc('grisini', 'Grissini (Sade)', 380, 10, 72, 6, 3, 'atıştırmalık', 20, '2 çubuk (20g)', undefined, ['grissini', 'çubuk ekmek']),
  pc('golpa-gofret', 'Ülker Golpa Gofret', 510, 5, 58, 29, 1, 'atıştırmalık', 33, '1 adet', 'Ülker', ['gofret', 'golpa']),
  pc('eti-hosbes', 'Eti Hoşbeş', 440, 5.5, 62, 19, 1.5, 'atıştırmalık', 30, '1 adet', 'Eti', ['hoşbeş', 'bisküvi']),
  pc('eti-adicto', 'Eti Adicto', 480, 6, 56, 26, 2, 'atıştırmalık', 34, '1 adet', 'Eti', ['adicto', 'bisküvi']),
  pc('eti-karam-sutlu', 'Eti Karam Sütlü', 545, 7, 56, 33, 2, 'atıştırmalık', 34, '1 adet', 'Eti', ['karam', 'çikolata']),
  pc('eti-subye', 'Eti Sübye (Fıstıklı)', 520, 8, 52, 31, 2, 'atıştırmalık', 40, '1 adet', 'Eti', ['sübye']),
  pc('ulker-laviva', 'Ülker Laviva', 490, 5, 58, 27, 1.5, 'atıştırmalık', 35, '1 adet', 'Ülker', ['laviva']),
  pc('ulker-metro-karamel', 'Ülker Metro Karamel', 470, 5, 62, 23, 1, 'atıştırmalık', 36, '1 adet', 'Ülker', ['metro', 'karamel']),
  pc('ulker-napoliten', 'Ülker Napoliten', 530, 6, 58, 30, 1.5, 'atıştırmalık', 33, '1 paket', 'Ülker', ['napoliten', 'çikolata']),
  pc('torku-banada-30g', 'Torku Banada (Tekli)', 535, 5, 60, 30, 1.5, 'atıştırmalık', 30, '1 adet', 'Torku', ['banada', 'çikolata']),
  pc('torku-turtacik', 'Torku Turtacık', 410, 4.5, 60, 17, 1, 'atıştırmalık', 35, '1 adet', 'Torku', ['turtacık', 'turta']),
  pc('torku-pratik-kek', 'Torku Pratik Kek', 400, 5, 55, 18, 1, 'atıştırmalık', 40, '1 adet', 'Torku', ['kek']),
  pc('bim-gofret', 'BİM Çikolatalı Gofret', 500, 5, 58, 28, 1, 'atıştırmalık', 30, '1 adet', 'BİM', ['gofret', 'bim']),
  pc('a101-kraker', 'A101 Tuzlu Kraker', 440, 9, 65, 16, 2.5, 'atıştırmalık', 30, '1 paket (30g)', 'A101', ['kraker', 'a101']),
  pc('kurabiye-tereyag', 'Tereyağlı Kurabiye', 480, 6, 60, 24, 1, 'atıştırmalık', 25, '1 adet (25g)', undefined, ['kurabiye', 'un kurabiyesi']),
  pc('kurabiye-cikolata', 'Çikolatalı Kurabiye', 490, 5.5, 62, 25, 2, 'atıştırmalık', 30, '1 adet (30g)', undefined, ['kurabiye', 'cookie']),
  pc('kurabiye-yulaflı', 'Yulaflı Kurabiye', 430, 7, 58, 20, 4, 'atıştırmalık', 30, '1 adet (30g)', undefined, ['kurabiye', 'yulaf kurabiye']),
  pc('browni-gold', 'Eti Browni Gold', 430, 5, 55, 22, 1.5, 'atıştırmalık', 45, '1 adet', 'Eti', ['browni', 'kek']),
  pc('ozmo-fun', 'Ozmo Fun', 525, 6, 60, 29, 1, 'atıştırmalık', 24, '1 adet', 'Şölen', ['ozmo', 'çikolata']),
  pc('ozmo-cornet', 'Ozmo Cornet', 540, 5.5, 58, 32, 1, 'atıştırmalık', 25, '1 adet', 'Şölen', ['ozmo', 'çikolata']),
  pc('solen-biscolata', 'Şölen Biscolata', 510, 6, 56, 30, 1.5, 'atıştırmalık', 34, '1 adet', 'Şölen', ['biscolata']),
  pc('solen-octavia', 'Şölen Octavia', 520, 5, 58, 30, 1.5, 'atıştırmalık', 30, '1 adet', 'Şölen', ['octavia', 'gofret']),
  pc('acik-cekirdek', 'Ay Çekirdeği (Kavrulmuş)', 580, 21, 20, 50, 9, 'atıştırmalık', 50, '1 avuç (50g)', undefined, ['çekirdek', 'ay çekirdeği']),
  pc('kabak-cekirdek-kav', 'Kabak Çekirdeği (Kavrulmuş)', 560, 30, 15, 45, 6, 'atıştırmalık', 30, '1 avuç (30g)', undefined, ['kabak çekirdeği', 'çekirdek']),
  g('misir-patlamis-tereyag', 'Patlamış Mısır (Tereyağlı)', 535, 9, 55, 31, 10, 'atıştırmalık', undefined, ['popcorn', 'tereyağlı mısır']),
  g('misir-patlamis-karamel', 'Patlamış Mısır (Karamel)', 400, 4, 76, 10, 4, 'atıştırmalık', undefined, ['karamel mısır', 'popcorn']),
  pc('gummy-bears', 'Jelibon (Yumuşak Şeker)', 340, 7, 77, 0.1, 0, 'atıştırmalık', 30, '1 avuç (30g)', undefined, ['jelibon', 'haribo', 'sakız şeker']),
  pc('sakiz-cikolata', 'Çikolata Kaplı Draje', 480, 5, 62, 24, 2, 'atıştırmalık', 30, '1 avuç (30g)', undefined, ['draje', 'bonibon', 'm&m']),
  pc('pestil', 'Pestil (Üzüm)', 310, 2, 72, 1, 3, 'atıştırmalık', 30, '1 yaprak (30g)', undefined, ['pestil', 'meyve pestili']),
  pc('meyve-kurusu-karisik', 'Karışık Kuru Meyve', 280, 2.5, 65, 0.5, 5, 'atıştırmalık', 40, '1 avuç (40g)', undefined, ['kuru meyve', 'karışık']),
  pc('bonibon', 'Bonibon', 420, 3, 72, 14, 0, 'atıştırmalık', 24, '1 paket (24g)', 'Ülker', ['bonibon', 'draje']),
  pc('cokonat', 'Çokonat', 510, 5, 55, 30, 2, 'atıştırmalık', 33, '1 adet', 'Ülker', ['çokonat', 'hindistan cevizi']),
  pc('milka-fındık', 'Milka Fındıklı Çikolata', 540, 7, 54, 33, 2, 'atıştırmalık', 30, '1 kare (30g)', 'Milka', ['çikolata', 'fındıklı']),
  pc('cadbury-cikolata', 'Cadbury Dairy Milk', 530, 7, 57, 30, 0, 'atıştırmalık', 30, '1 kare (30g)', 'Cadbury', ['çikolata']),
  g('kuruyemis-karisik', 'Karışık Kuruyemiş', 607, 18, 18, 54, 6, 'atıştırmalık', undefined, ['karışık kuruyemiş', 'tadım']),
  pc('cici-bebe', 'Ülker Cici Bebe', 430, 7, 68, 14, 2, 'atıştırmalık', 30, '2 adet (30g)', 'Ülker', ['cici bebe', 'bisküvi']),
  pc('bebe-gold', 'Ülker Bebe Gold', 450, 8, 65, 17, 2, 'atıştırmalık', 30, '2 adet (30g)', 'Ülker', ['bebe gold', 'bisküvi']),
  pc('rice-cake', 'Pirinç Patlağı (Sade)', 387, 8, 81, 3, 4, 'atıştırmalık', 10, '1 adet (10g)', undefined, ['pirinç patlağı', 'rice cake']),
  pc('rice-cake-cikolata', 'Pirinç Patlağı (Çikolatalı)', 430, 6, 72, 14, 3, 'atıştırmalık', 15, '1 adet (15g)', undefined, ['çikolatalı pirinç patlağı']),
  pc('muesli-bar', 'Müsli Bar (Meyveli)', 380, 5, 65, 12, 4, 'atıştırmalık', 25, '1 adet (25g)', undefined, ['müsli bar', 'granola bar']),

  // ─── BAKLİYATLAR (tam kapsamlı) ──────────────────────────────────────────
  g('yesil-mercimek', 'Yeşil Mercimek (Haşlanmış)', 116, 9, 20, 0.4, 8, 'bakliyat', undefined, ['yeşil mercimek']),
  g('kirmizi-mercimek', 'Kırmızı Mercimek (Haşlanmış)', 116, 9, 20, 0.4, 4, 'bakliyat', undefined, ['kırmızı mercimek']),
  g('nohut-haslama', 'Nohut (Haşlanmış)', 164, 8.9, 27, 2.6, 7.6, 'bakliyat', undefined, ['nohut']),
  g('kuru-fasulye-haslama', 'Kuru Fasulye (Haşlanmış)', 127, 8.7, 23, 0.5, 6.4, 'bakliyat', undefined, ['kuru fasulye', 'beyaz fasulye']),
  g('barbunya-haslama', 'Barbunya (Haşlanmış)', 143, 8.9, 26, 0.5, 9, 'bakliyat', undefined, ['barbunya', 'kırmızı fasulye']),
  g('borulce', 'Börülce (Haşlanmış)', 116, 8, 21, 0.5, 6.5, 'bakliyat', undefined, ['börülce', 'kuru börülce']),
  g('siyah-fasulye', 'Siyah Fasulye (Haşlanmış)', 132, 8.9, 24, 0.5, 8.7, 'bakliyat', undefined, ['siyah fasulye', 'black bean']),
  g('mung-fasulye', 'Maş Fasulyesi (Haşlanmış)', 105, 7, 19, 0.4, 5, 'bakliyat', undefined, ['maş fasulyesi', 'mung bean']),
  g('bezelye-kuru', 'Kuru Bezelye (Haşlanmış)', 118, 8.3, 21, 0.4, 8, 'bakliyat', undefined, ['kuru bezelye']),
  g('bezelye-taze', 'Taze Bezelye (Haşlanmış)', 84, 5.4, 16, 0.4, 5.5, 'bakliyat', undefined, ['bezelye', 'taze bezelye']),
  g('bakla-taze', 'Bakla (Taze, Haşlanmış)', 88, 8, 13, 0.7, 5, 'bakliyat', undefined, ['bakla', 'taze bakla']),
  g('bakla-kuru', 'Bakla (Kuru, Haşlanmış)', 110, 8, 19, 0.4, 6, 'bakliyat', undefined, ['kuru bakla']),
  g('soya-fasulye', 'Soya Fasulyesi (Haşlanmış)', 173, 17, 10, 9, 6, 'bakliyat', undefined, ['soya fasulyesi']),
  g('mercimek-kofte', 'Mercimek Köftesi', 180, 7, 28, 5, 4, 'bakliyat', undefined, ['mercimek köftesi', 'vegan köfte']),
  g('nohut-yemegi', 'Nohut Yemeği', 150, 7, 20, 5, 5, 'bakliyat', undefined, ['nohut yemeği', 'etli nohut']),
  g('kuru-fasulye-yemegi', 'Kuru Fasulye (Yemek)', 130, 7, 18, 3.5, 5, 'bakliyat', undefined, ['kuru fasulye yemeği', 'fasulye pilav']),
  g('barbunya-pilaki-ev', 'Barbunya Pilaki (Ev Yapımı)', 120, 6, 18, 3, 5, 'bakliyat', undefined, ['barbunya pilaki']),
  g('borulce-yemegi', 'Börülce Yemeği', 110, 6, 16, 3, 5, 'bakliyat', undefined, ['börülce yemeği']),
  g('fasulye-salata', 'Fasulye Salatası', 120, 6, 16, 4, 5, 'bakliyat', undefined, ['fasulye salatası', 'piyaz']),

  // ─── ÇORBALAR ─────────────────────────────────────────────────────────────
  g('mercimek-corba', 'Mercimek Çorbası (Ev)', 70, 4, 11, 1.5, 2.5, 'çorba', undefined, ['mercimek çorbası'], S_KASE),
  g('ezogelin-corba', 'Ezogelin Çorbası (Ev)', 65, 3.5, 10, 1.5, 2, 'çorba', undefined, ['ezogelin'], S_KASE),
  g('domates-corba-ev', 'Domates Çorbası (Ev)', 50, 1.5, 8, 1.5, 1, 'çorba', undefined, ['domates çorbası'], S_KASE),
  g('tarhana-corba-ev', 'Tarhana Çorbası (Ev)', 60, 2.5, 9, 1.5, 1, 'çorba', undefined, ['tarhana çorbası'], S_KASE),
  g('yayla-corba-ev', 'Yayla Çorbası (Ev)', 55, 2.5, 6, 2.5, 0.5, 'çorba', undefined, ['yayla çorbası'], S_KASE),
  g('tavuk-suyu-corba', 'Tavuk Suyu Çorbası', 30, 2.5, 2, 1.2, 0, 'çorba', undefined, ['tavuk suyu', 'tavuk çorbası'], S_KASE),
  g('sehriyeli-tavuk-corba', 'Şehriyeli Tavuk Çorbası', 55, 3.5, 7, 1.5, 0.3, 'çorba', undefined, ['şehriyeli tavuk'], S_KASE),
  g('kremali-mantar-corba', 'Kremalı Mantar Çorbası', 80, 2, 6, 5.5, 0.5, 'çorba', undefined, ['mantar çorbası', 'kremalı mantar'], S_KASE),
  g('kremali-brokoli-corba', 'Kremalı Brokoli Çorbası', 75, 2.5, 6, 5, 1, 'çorba', undefined, ['brokoli çorbası'], S_KASE),
  g('iskembe-corba', 'İşkembe Çorbası', 50, 5, 3, 2, 0, 'çorba', undefined, ['işkembe çorbası', 'işkembe'], S_KASE),
  g('paça-corba', 'Paça Çorbası', 45, 5, 2, 2, 0, 'çorba', undefined, ['paça çorbası', 'kelle paça'], S_KASE),
  g('düğün-corba', 'Düğün Çorbası', 70, 4, 7, 3, 0.5, 'çorba', undefined, ['düğün çorbası'], S_KASE),
  g('sütlü-corba', 'Sütlü Sebze Çorbası', 55, 2, 7, 2.5, 0.5, 'çorba', undefined, ['sütlü çorba'], S_KASE),
  g('balkabagi-corba', 'Bal Kabağı Çorbası', 40, 1, 8, 0.5, 1.5, 'çorba', undefined, ['balkabağı çorbası', 'kabak çorbası'], S_KASE),
  g('domates-corba-paket', 'Domates Çorbası (Hazır Paket)', 60, 1.5, 10, 1.5, 0.5, 'çorba', undefined, ['hazır çorba', 'paket çorba'], S_KASE),
  g('mercimek-corba-paket', 'Mercimek Çorbası (Hazır Paket)', 65, 3.5, 10, 1.2, 2, 'çorba', undefined, ['hazır mercimek', 'paket çorba'], S_KASE),
  g('lebeniye-corba', 'Lebeniye Çorbası', 75, 3, 9, 3, 1, 'çorba', undefined, ['lebeniye'], S_KASE),
  g('havuc-zencefil-corba', 'Havuç Zencefil Çorbası', 45, 1, 9, 0.5, 2, 'çorba', undefined, ['havuç çorbası', 'zencefil çorbası'], S_KASE),
  g('sogan-corba', 'Soğan Çorbası', 45, 1.5, 7, 1.5, 0.5, 'çorba', undefined, ['soğan çorbası', 'french onion'], S_KASE),
  g('yesil-mercimek-corba', 'Yeşil Mercimek Çorbası', 75, 5, 11, 1.5, 3, 'çorba', undefined, ['yeşil mercimek çorbası'], S_KASE),

  // ─── SEBZELER (eksik olanlar) ─────────────────────────────────────────────
  g('enginar', 'Enginar (Haşlanmış)', 47, 3.3, 11, 0.2, 5.4, 'sebze', undefined, ['enginar']),
  g('kusku-lahana', 'Lahana (Beyaz)', 25, 1.3, 6, 0.1, 2.5, 'sebze', undefined, ['lahana', 'beyaz lahana']),
  g('kirmizi-lahana', 'Kırmızı Lahana', 31, 1.4, 7, 0.2, 2.1, 'sebze', undefined, ['kırmızı lahana', 'mor lahana']),
  g('bruksel-lahana', 'Brüksel Lahanası', 43, 3.4, 9, 0.3, 3.8, 'sebze', undefined, ['brüksel lahanası']),
  g('semizotu', 'Semizotu', 20, 2, 3.4, 0.4, 0, 'sebze', undefined, ['semizotu']),
  g('pirasa', 'Pırasa (Haşlanmış)', 31, 0.8, 7, 0.2, 1, 'sebze', undefined, ['pırasa']),
  g('turp', 'Turp', 16, 0.7, 3.4, 0.1, 1.6, 'sebze', undefined, ['turp', 'beyaz turp']),
  g('tere', 'Tere', 32, 2.6, 6, 0.7, 1.1, 'sebze', undefined, ['tere', 'su teresi']),
  g('pazı', 'Pazı (Haşlanmış)', 19, 1.8, 4, 0.1, 1.6, 'sebze', undefined, ['pazı']),
  g('kuşkonmaz', 'Kuşkonmaz (Haşlanmış)', 22, 2.4, 4, 0.2, 2, 'sebze', undefined, ['kuşkonmaz', 'asparagus']),
  g('sakiz-kabagi', 'Sakız Kabağı (Haşlanmış)', 17, 1.2, 3.4, 0.2, 1.1, 'sebze', undefined, ['sakız kabağı', 'sivri kabak']),
  g('yer-elmasi', 'Yer Elması', 73, 2, 17, 0, 1.6, 'sebze', undefined, ['yer elması', 'jerusalem artichoke']),
  g('tatli-patates', 'Tatlı Patates (Fırın)', 90, 2, 21, 0.1, 3.3, 'sebze', undefined, ['tatlı patates', 'sweet potato']),
  g('kestane', 'Kestane (Kavrulmuş)', 245, 3.2, 53, 2.2, 5, 'sebze', undefined, ['kestane']),
  g('bamya-yemegi', 'Bamya Yemeği', 65, 2, 8, 3, 2, 'sebze', undefined, ['bamya yemeği']),
  g('bezelye-yemegi', 'Bezelye Yemeği (Zeytinyağlı)', 80, 4, 10, 3, 3.5, 'sebze', undefined, ['bezelye yemeği']),
  g('kabak-mucver', 'Kabak Mücver', 160, 5, 15, 9, 1.5, 'sebze', undefined, ['mücver', 'kabak mücver']),
  g('ispanak-yemegi', 'Ispanak Yemeği', 70, 3.5, 5, 4, 2, 'sebze', undefined, ['ıspanak yemeği', 'ispanak']),
  g('patlican-musakka', 'Patlıcan Musakka', 110, 5, 8, 7, 2, 'sebze', undefined, ['musakka', 'patlıcan musakka']),
  g('karnabahar-kizartma', 'Karnabahar Kızartma', 180, 4, 12, 13, 2, 'sebze', undefined, ['karnabahar kızartma']),
  g('patlican-kizartma', 'Patlıcan Kızartma', 200, 1.5, 8, 18, 2.5, 'sebze', undefined, ['patlıcan kızartma']),
  g('dolma-biber', 'Biber Dolması (Zeytinyağlı)', 120, 2.5, 16, 5, 2, 'sebze', undefined, ['zeytinyağlı biber dolma']),
  g('dolma-yaprak-zeytin', 'Yaprak Sarma (Zeytinyağlı)', 150, 2, 18, 8, 2, 'sebze', undefined, ['zeytinyağlı sarma', 'yaprak sarma']),
  g('havuc-tarator', 'Havuç Tarator', 100, 2, 10, 6, 2, 'sebze', undefined, ['havuç tarator']),
  g('bostana', 'Bostana (Gaziantep)', 90, 2, 10, 5, 2, 'sebze', undefined, ['bostana']),
  g('sivri-biber', 'Sivri Biber', 27, 1.3, 5, 0.3, 2, 'sebze', undefined, ['sivri biber', 'yeşil biber']),
  g('kapya-biber', 'Kapya Biber', 31, 1, 6, 0.3, 2, 'sebze', undefined, ['kapya biber', 'kırmızı biber']),
  g('kabak-dolma', 'Kabak Dolması (Etli)', 95, 5, 10, 4, 1.5, 'sebze', undefined, ['kabak dolması']),

  // ─── MEYVELER (eksik olanlar) ──────────────────────────────────────────────
  g('dut-beyaz', 'Dut (Beyaz)', 43, 1.4, 10, 0.4, 1.7, 'meyve', undefined, ['dut', 'beyaz dut']),
  g('dut-siyah', 'Dut (Siyah)', 43, 1.4, 10, 0.4, 1.7, 'meyve', undefined, ['karadut', 'siyah dut']),
  g('ayva', 'Ayva', 57, 0.4, 15, 0.1, 1.9, 'meyve', undefined, ['ayva']),
  g('trabzon-hurmasi', 'Trabzon Hurması', 127, 0.8, 34, 0.4, 3.6, 'meyve', undefined, ['trabzon hurması', 'cennet hurması']),
  g('murver', 'Mürdüm Eriği', 46, 0.7, 11, 0.3, 1.4, 'meyve', undefined, ['mürdüm eriği', 'can eriği']),
  g('guava', 'Guava', 68, 2.6, 14, 1, 5.4, 'meyve', undefined, ['guava']),
  g('papaya', 'Papaya', 43, 0.5, 11, 0.3, 1.7, 'meyve', undefined, ['papaya']),
  g('pitaya', 'Pitaya (Ejder Meyvesi)', 50, 1.1, 11, 0.4, 3, 'meyve', undefined, ['pitaya', 'ejder meyvesi', 'dragon fruit']),
  g('passiflora', 'Çarkıfelek (Passion Fruit)', 97, 2.2, 23, 0.7, 10, 'meyve', undefined, ['passion fruit', 'çarkıfelek']),
  g('nar2', 'Nar (Tane)', 83, 1.7, 19, 1.2, 4, 'meyve', undefined, ['nar tanesi']),
  g('avokado2', 'Avokado (Yarım)', 160, 2, 8.5, 15, 6.7, 'meyve', undefined, ['avokado']),
  g('incir-taze', 'İncir (Taze)', 74, 0.8, 19, 0.3, 2.9, 'meyve', undefined, ['taze incir']),
  g('seftali-beyaz', 'Şeftali (Beyaz)', 39, 0.9, 10, 0.3, 1.5, 'meyve', undefined, ['beyaz şeftali']),
  g('nektarin', 'Nektarin', 44, 1.1, 11, 0.3, 1.7, 'meyve', undefined, ['nektarin']),
  g('kayisi-taze', 'Kayısı (Taze)', 48, 1.4, 11, 0.4, 2, 'meyve', undefined, ['taze kayısı']),
  g('koruk', 'Koruk (Ekşi Üzüm)', 35, 0.5, 8, 0.1, 1, 'meyve', undefined, ['koruk']),
  g('yaban-mersini', 'Yaban Mersini (Blueberry)', 57, 0.7, 14, 0.3, 2.4, 'meyve', undefined, ['yaban mersini', 'blueberry', 'maviyemiş']),
  g('frambuaz', 'Frambuaz', 52, 1.2, 12, 0.7, 6.5, 'meyve', undefined, ['frambuaz', 'raspberry']),
  g('kusburnu', 'Kuşburnu', 162, 1.6, 38, 0.3, 24, 'meyve', undefined, ['kuşburnu']),
  g('limon', 'Limon', 29, 1.1, 9, 0.3, 2.8, 'meyve', undefined, ['limon']),
  g('miskat-limonu', 'Misket Limonu (Lime)', 30, 0.7, 11, 0.2, 2.8, 'meyve', undefined, ['lime', 'misket limonu']),
  g('portakal-kan', 'Kan Portakalı', 50, 0.9, 12, 0.1, 2, 'meyve', undefined, ['kan portakalı']),
  g('uzum-siyah', 'Üzüm (Siyah)', 67, 0.6, 17, 0.4, 0.9, 'meyve', undefined, ['siyah üzüm']),
  g('uzum-yesil', 'Üzüm (Yeşil)', 67, 0.6, 17, 0.4, 0.9, 'meyve', undefined, ['yeşil üzüm', 'çekirdeksiz üzüm']),

  // ─── TATLILAR (eksik olanlar) ──────────────────────────────────────────────
  g('tulumba', 'Tulumba Tatlısı', 360, 4, 50, 16, 0.5, 'tatlı', undefined, ['tulumba']),
  g('revani', 'Revani', 340, 5, 52, 13, 0.5, 'tatlı', undefined, ['revani']),
  g('san-burma', 'Sarı Burma', 400, 6, 48, 21, 1, 'tatlı', undefined, ['sarı burma', 'burma tatlısı']),
  g('kadayif', 'Kadayıf', 380, 5, 50, 18, 0.5, 'tatlı', undefined, ['kadayıf']),
  g('ekmek-kadayifi', 'Ekmek Kadayıfı', 280, 5, 40, 12, 0.5, 'tatlı', undefined, ['ekmek kadayıfı']),
  g('trilece', 'Trileçe', 220, 5, 30, 9, 0, 'tatlı', undefined, ['trileçe', 'tres leches']),
  g('supangle', 'Supangle', 200, 4, 28, 8, 1, 'tatlı', undefined, ['supangle']),
  g('tiramisu', 'Tiramisu', 280, 5, 28, 16, 0.5, 'tatlı', undefined, ['tiramisu']),
  g('cheesecake', 'Cheesecake', 320, 6, 26, 22, 0.5, 'tatlı', undefined, ['cheesecake', 'san sebastian']),
  g('magnolia', 'Magnolia', 230, 4, 28, 12, 0, 'tatlı', undefined, ['magnolia']),
  g('asure', 'Aşure', 120, 3, 22, 2.5, 2, 'tatlı', undefined, ['aşure', 'noah pudingi']),
  g('gullac', 'Güllaç', 180, 5, 28, 5.5, 0.3, 'tatlı', undefined, ['güllaç']),
  g('keskul', 'Keşkül', 160, 4, 22, 6.5, 0.5, 'tatlı', undefined, ['keşkül']),
  g('irmik-helvasi', 'İrmik Helvası', 330, 4, 40, 18, 0.5, 'tatlı', undefined, ['irmik helvası']),
  g('un-helvasi', 'Un Helvası', 350, 3, 42, 19, 0.5, 'tatlı', undefined, ['un helvası']),
  g('hosmerim', 'Höşmerim', 300, 8, 30, 17, 0, 'tatlı', undefined, ['höşmerim']),
  g('sutlu-nuriye', 'Sütlü Nuriye', 280, 5, 35, 14, 0.5, 'tatlı', undefined, ['sütlü nuriye']),
  g('sambali', 'Şambali', 350, 4, 50, 15, 0.5, 'tatlı', undefined, ['şambali']),
  g('cikolata-sufle', 'Çikolatalı Sufle', 350, 6, 35, 20, 2, 'tatlı', undefined, ['sufle', 'çikolata sufle', 'fondü']),
  g('waffle', 'Waffle (Çikolatalı)', 330, 6, 42, 16, 1, 'tatlı', undefined, ['waffle']),
  g('pancake', 'Pankek (3 adet)', 227, 6, 33, 8, 1, 'tatlı', undefined, ['pankek', 'pancake']),
  g('french-toast', 'French Toast', 260, 7, 30, 13, 1, 'tatlı', undefined, ['french toast', 'yumurtalı ekmek']),
  g('mozaik-pasta', 'Mozaik Pasta', 400, 5, 45, 23, 2, 'tatlı', undefined, ['mozaik pasta', 'bisküvi pastası']),
  g('havuc-dilim-pasta', 'Havuç Dilim Pasta', 340, 5, 45, 16, 1.5, 'tatlı', undefined, ['havuç dilim', 'havuç kek']),
  g('brownie', 'Brownie (Ev Yapımı)', 380, 5, 42, 22, 2, 'tatlı', undefined, ['brownie']),
  g('cookie-cikolata', 'Cookie (Çikolatalı)', 490, 5, 62, 25, 2, 'tatlı', undefined, ['cookie']),
  g('creme-brulee', 'Crème Brûlée', 270, 4, 26, 17, 0, 'tatlı', undefined, ['crème brûlée', 'krem brüle']),
  g('panna-cotta', 'Panna Cotta', 240, 3, 22, 16, 0, 'tatlı', undefined, ['panna cotta']),
  g('lokma-tatli', 'Lokma Tatlısı (Ev)', 330, 4, 45, 15, 0.5, 'tatlı', undefined, ['lokma']),
  g('kabak-tatlisi', 'Kabak Tatlısı', 140, 1.5, 28, 3, 1.5, 'tatlı', undefined, ['kabak tatlısı']),
  g('ayva-tatlisi', 'Ayva Tatlısı', 150, 0.5, 32, 3, 2, 'tatlı', undefined, ['ayva tatlısı']),
  g('zerde', 'Zerde', 140, 1, 30, 2, 0.3, 'tatlı', undefined, ['zerde', 'safran pirinç']),
  g('sakizli-muhallebi', 'Sakızlı Muhallebi', 140, 3, 22, 4.5, 0, 'tatlı', undefined, ['sakızlı muhallebi']),

  // ─── HAZIR YEMEKLER (eksik Türk yemekleri) ────────────────────────────────
  g('iskender', 'İskender Kebap', 180, 12, 10, 11, 0.5, 'hazır-yemek', undefined, ['iskender', 'iskender kebap']),
  g('tantuni', 'Tantuni (Dürüm)', 230, 14, 18, 12, 1, 'hazır-yemek', undefined, ['tantuni']),
  g('kokorec', 'Kokoreç (Yarım Ekmek)', 250, 15, 15, 15, 0.5, 'hazır-yemek', undefined, ['kokoreç']),
  g('ali-nazik', 'Ali Nazik Kebabı', 160, 14, 5, 10, 1, 'hazır-yemek', undefined, ['ali nazik']),
  g('cig-kofte-durum', 'Çiğ Köfte Dürüm', 200, 5, 32, 6, 3, 'hazır-yemek', undefined, ['çiğ köfte dürüm']),
  g('doner-ekmek', 'Döner (Yarım Ekmek)', 260, 15, 22, 13, 1, 'hazır-yemek', undefined, ['döner ekmek arası']),
  g('pideli-kofte', 'Pideli Köfte', 220, 14, 18, 10, 1, 'hazır-yemek', undefined, ['pideli köfte']),
  g('hunkar-begendi', 'Hünkâr Beğendi', 170, 12, 10, 9, 1, 'hazır-yemek', undefined, ['hünkar beğendi']),
  g('kuzu-tandir', 'Kuzu Tandır', 220, 18, 3, 16, 0, 'hazır-yemek', undefined, ['kuzu tandır', 'tandır']),
  g('beyti-sarma', 'Beyti Sarma', 240, 16, 12, 15, 1, 'hazır-yemek', undefined, ['beyti', 'beyti sarma']),
  g('urfa-kebap', 'Urfa Kebabı', 250, 16, 5, 19, 0.5, 'hazır-yemek', undefined, ['urfa kebap', 'urfa']),
  g('cop-sis', 'Çöp Şiş', 230, 18, 2, 17, 0, 'hazır-yemek', undefined, ['çöp şiş']),
  g('patlican-kebap', 'Patlıcan Kebabı', 180, 12, 8, 12, 2, 'hazır-yemek', undefined, ['patlıcan kebabı']),
  g('orman-kebap', 'Orman Kebabı', 160, 12, 8, 9, 1.5, 'hazır-yemek', undefined, ['orman kebabı']),
  g('ciger-sis', 'Ciğer Şiş', 160, 22, 2, 7, 0, 'hazır-yemek', undefined, ['ciğer şiş', 'arnavut ciğeri']),
  g('arnavut-cigeri', 'Arnavut Ciğeri', 180, 20, 5, 9, 0.5, 'hazır-yemek', undefined, ['arnavut ciğeri']),
  g('etli-ekmek', 'Etli Ekmek (Konya)', 240, 12, 28, 9, 1, 'hazır-yemek', undefined, ['etli ekmek']),
  g('lahmacun2', 'Lahmacun (1 adet)', 210, 8, 28, 8, 1.5, 'hazır-yemek', undefined, ['lahmacun']),
  g('pide-kasarli', 'Pide (Kaşarlı)', 270, 12, 30, 12, 1, 'hazır-yemek', undefined, ['kaşarlı pide']),
  g('pide-kusbasi', 'Pide (Kuşbaşılı)', 250, 14, 28, 9, 1, 'hazır-yemek', undefined, ['kuşbaşılı pide']),
  g('pide-sucuklu', 'Pide (Sucuklu)', 290, 13, 28, 14, 1, 'hazır-yemek', undefined, ['sucuklu pide']),
  g('manti-ev', 'Mantı (Ev Yapımı)', 170, 8, 20, 7, 1, 'hazır-yemek', undefined, ['ev mantısı', 'Kayseri mantısı']),
  g('su-boregi', 'Su Böreği', 230, 8, 22, 13, 1, 'hazır-yemek', undefined, ['su böreği']),
  g('sigara-boregi-ev', 'Sigara Böreği (Ev)', 300, 9, 25, 19, 1, 'hazır-yemek', undefined, ['sigara böreği']),
  g('gozleme-kiyma', 'Gözleme (Kıymalı)', 230, 10, 26, 10, 1, 'hazır-yemek', undefined, ['kıymalı gözleme']),
  g('gozleme-patates', 'Gözleme (Patatesli)', 210, 5, 30, 8, 1.5, 'hazır-yemek', undefined, ['patatesli gözleme']),
  g('gozleme-ispanak', 'Gözleme (Ispanaklı)', 200, 7, 26, 8, 2, 'hazır-yemek', undefined, ['ıspanaklı gözleme']),
  g('tavuk-sote', 'Tavuk Sote', 140, 16, 4, 7, 1, 'hazır-yemek', undefined, ['tavuk sote']),
  g('et-sote', 'Et Sote', 180, 18, 5, 10, 1, 'hazır-yemek', undefined, ['et sote']),
  g('tas-kebabi', 'Tas Kebabı', 160, 15, 6, 9, 1, 'hazır-yemek', undefined, ['tas kebabı']),
  g('sultan-kebap', 'Sultan Kebap', 200, 14, 10, 13, 1, 'hazır-yemek', undefined, ['sultan kebap']),
  g('kuzu-incik', 'Kuzu İncik', 230, 20, 2, 16, 0, 'hazır-yemek', undefined, ['kuzu incik']),
  g('testi-kebap', 'Testi Kebabı', 140, 10, 8, 8, 1.5, 'hazır-yemek', undefined, ['testi kebabı']),
  g('coban-kavurma', 'Çoban Kavurma', 250, 20, 3, 18, 0.5, 'hazır-yemek', undefined, ['çoban kavurma']),
  g('sacma-kebap', 'Saç Kavurma', 240, 19, 3, 17, 0.5, 'hazır-yemek', undefined, ['saç kavurma']),
  g('borek-patatesli', 'Börek (Patatesli)', 250, 5, 28, 13, 1, 'hazır-yemek', undefined, ['patatesli börek']),
  g('findik-lahmacun', 'Fındık Lahmacun', 280, 10, 30, 14, 1, 'hazır-yemek', undefined, ['fındık lahmacun']),
  g('cizbiz-kofte', 'Cızbız Köfte', 260, 18, 5, 19, 0.5, 'hazır-yemek', undefined, ['cızbız köfte']),
  g('kasarli-kofte', 'Kaşarlı Köfte', 280, 17, 8, 20, 0.5, 'hazır-yemek', undefined, ['kaşarlı köfte']),
  g('izmir-kofte', 'İzmir Köfte', 150, 10, 8, 9, 1.5, 'hazır-yemek', undefined, ['izmir köfte', 'patatesli köfte']),
  g('sac-boregi', 'Saç Böreği', 260, 8, 26, 14, 1, 'hazır-yemek', undefined, ['saç böreği']),
  g('kol-boregi', 'Kol Böreği', 270, 9, 26, 15, 1, 'hazır-yemek', undefined, ['kol böreği']),

  // ─── EKMEKLER (eksik olanlar) ──────────────────────────────────────────────
  g('pide-ekmek', 'Pide Ekmeği (Ramazan)', 275, 8, 54, 2, 2, 'ekmek', undefined, ['ramazan pidesi', 'pide ekmeği']),
  g('yufka-ekmek', 'Yufka Ekmeği', 310, 9, 64, 1.5, 2, 'ekmek', undefined, ['yufka ekmeği', 'sac ekmeği']),
  g('misir-ekmegi', 'Mısır Ekmeği', 250, 6, 48, 4, 3, 'ekmek', undefined, ['mısır ekmeği']),
  g('pogaca-sade', 'Poğaça (Sade)', 350, 7, 42, 17, 1.5, 'ekmek', undefined, ['sade poğaça']),
  g('pogaca-zeytinli', 'Poğaça (Zeytinli)', 340, 7, 40, 17, 2, 'ekmek', undefined, ['zeytinli poğaça']),
  g('acma-sade', 'Açma (Sade)', 340, 8, 44, 15, 1.5, 'ekmek', undefined, ['açma', 'sade açma']),
  g('pisi', 'Pişi', 320, 7, 40, 15, 1, 'ekmek', undefined, ['pişi', 'hamur kızartma']),
  g('katmer', 'Katmer (Gaziantep)', 480, 7, 40, 33, 1, 'ekmek', undefined, ['katmer']),
  g('lavas-ince', 'Lavaş (İnce)', 260, 8, 50, 3, 2, 'ekmek', undefined, ['lavaş', 'ince lavaş']),
  g('somun-ekmek', 'Somun Ekmek', 265, 9, 50, 3, 3, 'ekmek', undefined, ['somun', 'köy ekmeği']),
  g('focaccia', 'Focaccia', 310, 8, 46, 11, 2, 'ekmek', undefined, ['focaccia']),
  g('bagel', 'Bagel (Sade)', 260, 10, 50, 1.5, 2.5, 'ekmek', undefined, ['bagel', 'simit amerikan']),
  g('ciabatta', 'Ciabatta', 270, 9, 49, 4, 2, 'ekmek', undefined, ['ciabatta']),
  g('naan-ekmegi', 'Naan Ekmeği', 290, 8, 50, 6, 2, 'ekmek', undefined, ['naan']),

  // ─── KURUYEMİŞLER (eksik olanlar) ─────────────────────────────────────────
  g('sam-fistigi', 'Şam Fıstığı (Kavrulmuş)', 571, 21, 28, 46, 10, 'kuruyemiş', undefined, ['şam fıstığı', 'pistachio']),
  g('macadamia', 'Macadamia', 718, 8, 14, 76, 8.6, 'kuruyemiş', undefined, ['macadamia']),
  g('pekan-cevizi', 'Pekan Cevizi', 691, 9, 14, 72, 10, 'kuruyemiş', undefined, ['pekan', 'pecan']),
  g('brezilya-cevizi', 'Brezilya Cevizi', 659, 14, 12, 67, 7.5, 'kuruyemiş', undefined, ['brezilya cevizi']),
  g('findik-cig', 'Fındık (Çiğ)', 628, 15, 17, 61, 10, 'kuruyemiş', undefined, ['çiğ fındık']),
  g('badem-cig', 'Badem (Çiğ)', 579, 21, 22, 50, 12, 'kuruyemiş', undefined, ['çiğ badem']),
  g('ceviz-ic', 'Ceviz İçi', 654, 15, 14, 65, 6.7, 'kuruyemiş', undefined, ['ceviz içi']),
  g('yer-fistigi-cig', 'Yer Fıstığı (Çiğ)', 567, 26, 16, 49, 8.5, 'kuruyemiş', undefined, ['çiğ yer fıstığı']),
  g('kaju-kavrulmus', 'Kaju (Kavrulmuş)', 574, 18, 30, 46, 3, 'kuruyemiş', undefined, ['kavrulmuş kaju']),
  g('susam', 'Susam', 573, 18, 23, 50, 12, 'kuruyemiş', undefined, ['susam']),
  g('haşhaş-tohumu', 'Haşhaş Tohumu', 525, 18, 28, 42, 20, 'kuruyemiş', undefined, ['haşhaş']),
  g('keten-ogutulmus', 'Keten Tohumu (Öğütülmüş)', 534, 18, 29, 42, 27, 'kuruyemiş', undefined, ['öğütülmüş keten']),
  g('antep-fistik-cig', 'Antep Fıstığı (Çiğ)', 560, 20, 28, 45, 10, 'kuruyemiş', undefined, ['çiğ antep fıstığı']),
  g('leblebi-sari', 'Leblebi (Sarı)', 360, 20, 50, 6, 10, 'kuruyemiş', undefined, ['sarı leblebi']),
  g('leblebi-beyaz', 'Leblebi (Beyaz Şekerli)', 400, 14, 62, 10, 5, 'kuruyemiş', undefined, ['şekerli leblebi', 'beyaz leblebi']),

  // ─── İÇECEKLER (eksik olanlar) ────────────────────────────────────────────
  g('turk-kahvesi-sutlu', 'Türk Kahvesi (Sütlü)', 25, 1, 3, 1, 0, 'içecek', undefined, ['sütlü türk kahvesi'], S_BARDAK),
  g('americano', 'Americano', 5, 0.3, 1, 0, 0, 'içecek', undefined, ['americano'], S_BARDAK),
  g('espresso', 'Espresso', 5, 0.1, 0.5, 0, 0, 'içecek', undefined, ['espresso'], [{ label: '1 shot (30 ml)', grams: 30 }, { label: '100 ml', grams: 100 }]),
  g('flat-white', 'Flat White', 130, 6, 10, 7, 0, 'içecek', undefined, ['flat white'], S_BARDAK),
  g('mocha', 'Mocha (Çikolatalı Kahve)', 230, 7, 30, 10, 1, 'içecek', undefined, ['mocha', 'mokka'], S_BARDAK),
  g('iced-latte', 'Iced Latte', 100, 5, 9, 4.5, 0, 'içecek', undefined, ['buzlu latte', 'iced latte'], S_KUTU330),
  g('iced-americano', 'Iced Americano', 10, 0.3, 2, 0, 0, 'içecek', undefined, ['buzlu americano'], S_KUTU330),
  g('caramel-macchiato', 'Caramel Macchiato', 200, 6, 28, 7, 0, 'içecek', undefined, ['karamel macchiato'], S_BARDAK),
  g('frappuccino', 'Frappuccino (Karamelli)', 280, 4, 45, 10, 0, 'içecek', undefined, ['frappuccino', 'frappe'], S_BARDAK),
  g('sahlep', 'Sahlep', 120, 3, 18, 4, 0, 'içecek', undefined, ['sahlep'], S_BARDAK),
  g('sicak-cikolata', 'Sıcak Çikolata', 180, 6, 25, 7, 2, 'içecek', undefined, ['sıcak çikolata', 'hot chocolate'], S_BARDAK),
  g('chai-latte', 'Chai Latte', 140, 4, 22, 4, 0, 'içecek', undefined, ['chai latte', 'tarçınlı süt'], S_BARDAK),
  g('matcha-latte', 'Matcha Latte', 120, 5, 16, 4, 0.5, 'içecek', undefined, ['matcha latte', 'matcha'], S_BARDAK),
  g('smoothie-muz-cilek', 'Smoothie (Muz-Çilek)', 70, 1.5, 15, 0.5, 1.5, 'içecek', undefined, ['smoothie', 'muz çilek'], S_BARDAK),
  g('smoothie-yesil', 'Yeşil Smoothie', 50, 2, 9, 0.5, 2, 'içecek', undefined, ['yeşil smoothie', 'detox'], S_BARDAK),
  g('protein-shake-cikolata', 'Protein Shake (Çikolatalı)', 130, 25, 6, 2, 1, 'içecek', undefined, ['protein shake'], S_BARDAK),
  g('komposto', 'Komposto', 60, 0.3, 15, 0, 0.5, 'içecek', undefined, ['komposto', 'hoşaf'], S_BARDAK),
  g('taze-portakal-suyu', 'Taze Sıkma Portakal Suyu', 45, 0.7, 10, 0.2, 0.2, 'içecek', undefined, ['taze portakal suyu'], S_BARDAK),
  g('nar-suyu-taze', 'Taze Sıkma Nar Suyu', 54, 0.2, 13, 0.1, 0.1, 'içecek', undefined, ['taze nar suyu'], S_BARDAK),
  g('havuc-suyu', 'Havuç Suyu', 40, 0.9, 9, 0.2, 0.8, 'içecek', undefined, ['havuç suyu'], S_BARDAK),
  g('limonata-ev', 'Limonata (Ev Yapımı)', 40, 0.1, 10, 0, 0.1, 'içecek', undefined, ['limonata'], S_BARDAK),
  g('cay-sade', 'Çay (Sade)', 1, 0, 0.2, 0, 0, 'içecek', undefined, ['çay', 'demli çay'], [{ label: '1 bardak (150 ml)', grams: 150 }, { label: '100 ml', grams: 100 }]),
  g('cay-elma', 'Elma Çayı', 2, 0, 0.5, 0, 0, 'içecek', undefined, ['elma çayı'], [{ label: '1 bardak (150 ml)', grams: 150 }, { label: '100 ml', grams: 100 }]),
  g('cay-yesil', 'Yeşil Çay', 1, 0, 0.2, 0, 0, 'içecek', undefined, ['yeşil çay'], [{ label: '1 bardak (150 ml)', grams: 150 }, { label: '100 ml', grams: 100 }]),
  g('cay-papatya', 'Papatya Çayı', 1, 0, 0.1, 0, 0, 'içecek', undefined, ['papatya çayı', 'bitki çayı'], [{ label: '1 bardak (150 ml)', grams: 150 }, { label: '100 ml', grams: 100 }]),
  g('cay-adacayi', 'Adaçayı', 2, 0, 0.4, 0, 0, 'içecek', undefined, ['adaçayı'], [{ label: '1 bardak (150 ml)', grams: 150 }, { label: '100 ml', grams: 100 }]),
  g('cay-ihlamur', 'Ihlamur Çayı', 2, 0, 0.3, 0, 0, 'içecek', undefined, ['ıhlamur'], [{ label: '1 bardak (150 ml)', grams: 150 }, { label: '100 ml', grams: 100 }]),
  g('cay-kusburnu', 'Kuşburnu Çayı', 3, 0.1, 0.5, 0, 0, 'içecek', undefined, ['kuşburnu çayı'], [{ label: '1 bardak (150 ml)', grams: 150 }, { label: '100 ml', grams: 100 }]),
  g('ayran-ev', 'Ayran (Ev Yapımı)', 35, 2, 2.5, 2, 0, 'içecek', undefined, ['ev ayranı'], S_BARDAK),
  g('kefir-sade', 'Kefir (Sade)', 60, 3.3, 4, 3.5, 0, 'içecek', undefined, ['sade kefir'], S_BARDAK),
  g('sutas-caciki', 'Sütaş Cacık İçecek', 30, 2, 2, 1.5, 0, 'içecek', 'Sütaş', ['cacık içecek'], S_BARDAK),
  g('sprite-zero', 'Sprite Zero', 0.5, 0, 0.1, 0, 0, 'içecek', 'Sprite', ['sprite zero'], S_KUTU330),
  g('fanta-zero', 'Fanta Zero', 0.5, 0, 0.1, 0, 0, 'içecek', 'Fanta', ['fanta zero'], S_KUTU330),
  g('schweppes-mandarin', 'Schweppes Mandalina', 36, 0, 9, 0, 0, 'içecek', 'Schweppes', ['schweppes mandalina'], S_KUTU330),
  g('ice-tea-seftali', 'Ice Tea (Şeftali)', 28, 0, 7, 0, 0, 'içecek', undefined, ['ice tea', 'şeftalili ice tea'], S_SISE),
  g('ice-tea-limon', 'Ice Tea (Limon)', 26, 0, 6.5, 0, 0, 'içecek', undefined, ['limonlu ice tea'], S_SISE),
  g('meyve-suyu-karisik', 'Meyve Suyu (Karışık)', 50, 0.3, 12, 0, 0.2, 'içecek', undefined, ['karışık meyve suyu'], S_KUTU250),
  g('visne-suyu', 'Vişne Suyu', 55, 0.3, 13, 0, 0.1, 'içecek', undefined, ['vişne suyu'], S_KUTU250),
  g('seftali-suyu', 'Şeftali Suyu', 50, 0.3, 12, 0, 0.2, 'içecek', undefined, ['şeftali suyu'], S_KUTU250),

  // ─── ŞARKÜTERI (eksik olanlar) ─────────────────────────────────────────────
  g('sucuk-kangal', 'Sucuk (Dilimlenmiş, Çiğ)', 380, 18, 1, 34, 0, 'şarküteri', undefined, ['sucuk', 'kangal sucuk'], S_DILIM),
  g('sosis-tavuk', 'Tavuk Sosis', 200, 12, 3, 16, 0, 'şarküteri', undefined, ['tavuk sosis']),
  g('sosis-dana', 'Dana Sosis', 270, 12, 2, 24, 0, 'şarküteri', undefined, ['dana sosis']),
  g('kavurma-kurutulmus', 'Kavurma (Kurutulmuş)', 400, 30, 0, 32, 0, 'şarküteri', undefined, ['kavurma']),
  g('pastirma-dilim', 'Pastırma (Dilim)', 174, 33, 1, 5, 0, 'şarküteri', undefined, ['pastırma'], S_DILIM),
  g('jambon-hindi-dilim', 'Hindi Jambon (Light)', 100, 18, 1, 3, 0, 'şarküteri', 'Pınar', ['light hindi'], S_DILIM),
  g('salam-dilim', 'Salam (Dana, Dilim)', 280, 13, 2, 25, 0, 'şarküteri', undefined, ['dana salam'], S_DILIM),
  g('fume-et', 'Füme Et', 190, 30, 0, 8, 0, 'şarküteri', undefined, ['füme et', 'füme biftek'], S_DILIM),
  g('bacon', 'Bacon (Kızartılmış)', 540, 37, 1, 42, 0, 'şarküteri', undefined, ['bacon', 'domuz pastırma']),
  g('rozbif', 'Rozbif (Dilim)', 170, 28, 0, 6, 0, 'şarküteri', undefined, ['rozbif'], S_DILIM),

  // ─── PROTEİN (eksik balık & et) ───────────────────────────────────────────
  g('hamsi-tava', 'Hamsi (Tava)', 210, 18, 5, 13, 0, 'protein', undefined, ['hamsi', 'tava hamsi']),
  g('istavrit', 'İstavrit (Izgara)', 150, 22, 0, 7, 0, 'protein', undefined, ['istavrit']),
  g('palamut-izgara', 'Palamut (Izgara)', 160, 24, 0, 7, 0, 'protein', undefined, ['palamut']),
  g('lufer-izgara', 'Lüfer (Izgara)', 170, 24, 0, 8, 0, 'protein', undefined, ['lüfer']),
  g('mezgit-tava', 'Mezgit (Tava)', 180, 20, 5, 9, 0, 'protein', undefined, ['mezgit']),
  g('barbun-tava', 'Barbun (Tava)', 195, 20, 5, 11, 0, 'protein', undefined, ['barbun', 'tekir']),
  g('somon-fume', 'Somon (Füme)', 117, 18, 0, 5, 0, 'protein', undefined, ['füme somon']),
  g('sardalya-konserve', 'Sardalya (Konserve, Yağda)', 208, 25, 0, 12, 0, 'protein', undefined, ['konserve sardalya']),
  g('midye-tava', 'Midye Tava', 280, 14, 18, 16, 0.5, 'protein', undefined, ['midye tava']),
  g('ahtapot', 'Ahtapot (Izgara)', 82, 15, 2, 1, 0, 'protein', undefined, ['ahtapot']),
  g('kuzu-but', 'Kuzu But (Fırın)', 230, 22, 0, 16, 0, 'protein', undefined, ['kuzu but']),
  g('kuzu-kaburga', 'Kuzu Kaburga', 290, 18, 0, 24, 0, 'protein', undefined, ['kuzu kaburga']),
  g('dana-bonfile', 'Dana Bonfile (Izgara)', 175, 28, 0, 7, 0, 'protein', undefined, ['bonfile', 'dana bonfile']),
  g('dana-kusbasi', 'Dana Kuşbaşı (Sote)', 180, 26, 2, 8, 0, 'protein', undefined, ['kuşbaşı', 'dana kuşbaşı']),
  g('tavuk-cizbiz', 'Tavuk Pirzola (Izgara)', 170, 28, 0, 6, 0, 'protein', undefined, ['tavuk pirzola', 'tavuk cızbız']),
  g('hindi-but', 'Hindi But (Fırın)', 160, 28, 0, 5, 0, 'protein', undefined, ['hindi but']),
  g('hindi-kiyma', 'Hindi Kıyma', 170, 22, 0, 9, 0, 'protein', undefined, ['hindi kıyma']),
  g('kaz-eti', 'Kaz Eti (Fırın)', 300, 25, 0, 22, 0, 'protein', undefined, ['kaz']),
  g('ordek-eti', 'Ördek Eti (Fırın)', 340, 20, 0, 28, 0, 'protein', undefined, ['ördek']),
  g('bıldırcın', 'Bıldırcın (Izgara)', 192, 25, 0, 10, 0, 'protein', undefined, ['bıldırcın']),

  // ─── TAHILLAR (eksik olanlar) ──────────────────────────────────────────────
  g('pirinc-sushi', 'Sushi Pirinci (Pişmiş)', 130, 2.7, 28, 0.3, 0.4, 'tahıl', undefined, ['sushi pirinci']),
  g('pirinc-basmati-pismis', 'Basmati Pirinç (Pişmiş)', 121, 3.5, 25, 0.4, 0.4, 'tahıl', undefined, ['basmati', 'basmati pirinç']),
  g('bulgur-pismis', 'Bulgur (Pişmiş)', 83, 3, 19, 0.2, 4.5, 'tahıl', undefined, ['pişmiş bulgur']),
  g('kuskus-pismis', 'Kuskus (Pişmiş)', 112, 3.8, 23, 0.2, 1.4, 'tahıl', undefined, ['kuskus']),
  g('kinoa-pismis', 'Kinoa (Pişmiş)', 120, 4.4, 21, 1.9, 2.8, 'tahıl', undefined, ['kinoa', 'quinoa']),
  g('yulaf-pismis', 'Yulaf Lapası (Pişmiş)', 71, 2.5, 12, 1.5, 1.7, 'tahıl', undefined, ['yulaf lapası', 'oatmeal'], S_KASE),
  g('karabugday-pismis', 'Karabuğday (Pişmiş)', 92, 3.4, 20, 0.6, 2.7, 'tahıl', undefined, ['karabuğday']),
  g('eriste-pismis', 'Erişte (Pişmiş)', 138, 5, 26, 1.5, 1, 'tahıl', undefined, ['erişte']),
  g('makarna-tam-bugday', 'Tam Buğday Makarna (Pişmiş)', 124, 5, 25, 0.5, 4, 'tahıl', undefined, ['tam buğday makarna']),
  g('pirinc-pilavi-ev', 'Pirinç Pilavı (Ev Yapımı)', 150, 3, 28, 3, 0.5, 'tahıl', undefined, ['pilav', 'pirinç pilavı']),
  g('bulgur-pilavi-ev', 'Bulgur Pilavı (Ev Yapımı)', 120, 3.5, 22, 2.5, 4, 'tahıl', undefined, ['bulgur pilavı']),
  g('nohutlu-pilav', 'Nohutlu Pilav', 160, 5, 26, 4, 2, 'tahıl', undefined, ['nohutlu pilav']),
  g('domatesli-pilav', 'Domatesli Pilav', 140, 3, 24, 3.5, 1, 'tahıl', undefined, ['domatesli pilav']),
  g('sehriyeli-pilav', 'Şehriyeli Pilav', 155, 3.5, 28, 3.5, 0.5, 'tahıl', undefined, ['şehriyeli pilav']),
  g('ic-pilav', 'İç Pilav', 180, 4, 25, 7, 1, 'tahıl', undefined, ['iç pilav']),

  // ─── SÜT ÜRÜNLERİ (eksik olanlar) ────────────────────────────────────────
  g('ricotta', 'Ricotta Peyniri', 174, 11, 3, 13, 0, 'süt-ürünü', undefined, ['ricotta']),
  g('mascarpone', 'Mascarpone', 429, 5, 3, 44, 0, 'süt-ürünü', undefined, ['mascarpone']),
  g('brie-peynir', 'Brie Peyniri', 334, 21, 0.5, 28, 0, 'süt-ürünü', undefined, ['brie']),
  g('parmesan', 'Parmesan Peyniri', 431, 38, 4, 29, 0, 'süt-ürünü', undefined, ['parmesan', 'parmigiano']),
  g('gouda', 'Gouda Peyniri', 356, 25, 2.2, 27, 0, 'süt-ürünü', undefined, ['gouda']),
  g('izmir-tulum', 'İzmir Tulum Peyniri', 380, 24, 1, 31, 0, 'süt-ürünü', undefined, ['izmir tulum']),
  g('van-otlu-peynir', 'Van Otlu Peynir', 300, 20, 2, 24, 0, 'süt-ürünü', undefined, ['otlu peynir', 'van peyniri']),
  g('mihaliç-peynir', 'Mihaliç Peyniri', 380, 25, 1, 31, 0, 'süt-ürünü', undefined, ['mihaliç']),
  g('yoresel-yogurt', 'Yöresel Süzme Yoğurt', 80, 5, 4, 5, 0, 'süt-ürünü', undefined, ['süzme yoğurt', 'köy yoğurdu'], S_KASE),
  g('kefir-meyveli', 'Kefir (Meyveli)', 65, 3, 9, 1.5, 0, 'süt-ürünü', undefined, ['meyveli kefir'], S_BARDAK),
  g('yogurt-drink', 'İçilebilir Yoğurt', 50, 3, 5, 1.5, 0, 'süt-ürünü', undefined, ['yoğurt içeceği'], S_BARDAK),
  g('sutas-puding-karamel', 'Sütaş Puding (Karamel)', 130, 3, 22, 3.5, 0, 'süt-ürünü', 'Sütaş', ['karamel puding']),
  g('pinar-protein-yogurt', 'Pınar Protein Yoğurt', 60, 10, 4, 0.5, 0, 'süt-ürünü', 'Pınar', ['protein yoğurt']),

  // ─── MARKET ÜRÜNLERİ (hazır gıdalar) ──────────────────────────────────────
  g('hazir-pilav-ince', 'Hazır Pilav (İnce)', 140, 3, 26, 2.5, 0.5, 'market', undefined, ['hazır pilav']),
  g('hazir-corbalar', 'Hazır Çorba (Paket, genel)', 55, 2, 9, 1, 0.5, 'market', undefined, ['hazır çorba', 'paket çorba'], S_KASE),
  g('hazir-makarna-sos', 'Makarna Sosu (Domates)', 70, 2, 10, 2.5, 1.5, 'market', undefined, ['makarna sosu', 'domates sos']),
  g('konserve-ton-zeytinyag', 'Ton Balığı Konserve (Zeytinyağlı)', 200, 26, 0, 10, 0, 'market', undefined, ['zeytinyağlı ton']),
  g('konserve-ton-su', 'Ton Balığı Konserve (Suda)', 108, 24, 0, 1, 0, 'market', undefined, ['suda ton']),
  g('hazir-kumpir-sos', 'Hazır Kumpir Sosu', 200, 2, 8, 18, 0.5, 'market', undefined, ['kumpir sosu']),
  g('salca-domates', 'Domates Salçası', 82, 4, 16, 0.5, 4, 'market', undefined, ['salça', 'domates salçası'], S_YKASIK),
  g('salca-biber', 'Biber Salçası', 90, 3, 16, 2, 5, 'market', undefined, ['biber salçası'], S_YKASIK),
  g('zeytin-siyah-gemlik', 'Siyah Zeytin (Gemlik)', 145, 1, 4, 15, 3, 'market', undefined, ['gemlik zeytin']),
  g('zeytin-yesil-edremit', 'Yeşil Zeytin (Edremit)', 145, 1, 4, 15, 3, 'market', undefined, ['edremit zeytin']),
  g('tursu-karisik', 'Turşu (Karışık)', 12, 0.5, 2, 0.1, 1, 'market', undefined, ['turşu', 'karışık turşu']),
  g('sirke-elma', 'Elma Sirkesi', 21, 0, 0.9, 0, 0, 'market', undefined, ['elma sirkesi'], S_YKASIK),
  g('tahin-pekmez', 'Tahin-Pekmez Karışım', 420, 8, 50, 22, 3, 'market', undefined, ['tahin pekmez'], S_YKASIK),

  // ─── DİĞER (sade yağlar, soslar, baharatlar) ─────────────────────────────
  g('sriracaha', 'Sriracha Sos', 93, 2, 19, 1, 1, 'diğer', undefined, ['sriracha'], S_YKASIK),
  g('ranch-sos', 'Ranch Sos', 360, 1.5, 6, 37, 0, 'diğer', undefined, ['ranch', 'ranch dressing'], S_YKASIK),
  g('pesto-sos', 'Pesto Sos', 300, 5, 4, 30, 1, 'diğer', undefined, ['pesto'], S_YKASIK),
  g('hummus-hazir', 'Humus (Hazır)', 166, 8, 14, 10, 6, 'diğer', undefined, ['humus'], S_YKASIK),
  g('guacamole', 'Guacamole', 160, 2, 9, 15, 7, 'diğer', undefined, ['guacamole', 'avokado sos'], S_YKASIK),
  g('acili-sos', 'Acı Biber Sosu (Tabasco)', 12, 0.7, 1.5, 0.4, 0.5, 'diğer', undefined, ['tabasco', 'acı sos'], S_YKASIK),
  g('soya-sosu', 'Soya Sosu', 53, 8, 5, 0, 0, 'diğer', undefined, ['soya sosu'], S_YKASIK),
  g('bal-kaymak', 'Bal Kaymak', 350, 3, 35, 22, 0, 'diğer', undefined, ['bal kaymak'], S_YKASIK),
]

const ALL_TURKISH_FOODS: TurkishFood[] = [
  ...BASE_TURKISH_FOODS,
  ...DETAILED_TURKISH_FOODS,
  ...EXTRA_TURKISH_FOODS,
  ...EXTRA_TURKISH_FOODS_2,
  ...BROAD_MARKET_FOODS,
  ...SUPPLEMENT_FOODS,
  ...MARKET_EXTRA_FOODS,
  ...MIGROS_A101_BIM_FOODS,
  ...EXPANSION_FOODS,
  ...EXPANSION_FOODS_2,
  ...EUROPEAN_FOODS,
  ...MARKET_MEGA_EXPANSION,
  ...RESTAURANT_MENU_FOODS,
  ...COMPREHENSIVE_FOOD_EXPANSION,
]

export const TURKISH_FOODS: TurkishFood[] = Array.from(
  new Map(ALL_TURKISH_FOODS.map((food) => [food.id, food])).values()
)

// ─── Yardımcı fonksiyonlar ──────────────────────────────────────────────────

/** Kategoriye göre besinleri filtrele */
export function getFoodsByCategory(category: FoodCategory): TurkishFood[] {
  return TURKISH_FOODS.filter((f) => f.category === category)
}

/** İsme göre besin ara (Türkçe karakterlere duyarsız) */
export function searchFoods(query: string): TurkishFood[] {
  const normalized = normalizeForSearch(query)
  if (!normalized) return TURKISH_FOODS

  return TURKISH_FOODS.filter((f) => {
    const haystack = [f.name, f.brand, ...(f.aliases ?? [])]
      .filter(Boolean)
      .map((value) => normalizeForSearch(value as string))
      .join(' ')
    return haystack.includes(normalized)
  })
}

/** ID ile besin bul */
export function getFoodById(id: string): TurkishFood | undefined {
  return TURKISH_FOODS.find((f) => f.id === id)
}

/** Türkçe karakter normalizasyonu */
function normalizeForSearch(text: string): string {
  return text
    .replace(/İ/g, 'i')
    .toLowerCase()
    .replace(/̇/g, '')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim()
}

/** Tüm benzersiz kategorileri döndür */
export function getAllCategories(): FoodCategory[] {
  return [...new Set(TURKISH_FOODS.map((f) => f.category))]
}

/** Kategori etiketi (Türkçe UI için) */
export const CATEGORY_LABELS: Record<FoodCategory, string> = {
  protein: 'Protein',
  tahıl: 'Tahıl & Pilav',
  meyve: 'Meyve',
  'süt-ürünü': 'Süt Ürünleri',
  sebze: 'Sebze',
  kuruyemiş: 'Kuruyemiş',
  içecek: 'İçecek',
  ekmek: 'Ekmek',
  çorba: 'Çorba',
  market: 'Market Ürünleri',
  atıştırmalık: 'Atıştırmalık',
  tatlı: 'Tatlı',
  bakliyat: 'Bakliyat',
  şarküteri: 'Şarküteri',
  'hazır-yemek': 'Hazır Yemek',
  takviye: 'Takviye & Sporcu Gıdası',
  diğer: 'Diğer',
}
