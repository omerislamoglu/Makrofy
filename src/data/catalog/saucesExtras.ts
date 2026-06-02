import { food, S } from './helpers'
import type { FoodCatalogItem } from '../../types/food'

export const SAUCES_EXTRAS: FoodCatalogItem[] = [
  // ── Yağlar ──────────────────────────────────────────────
  food({ id: 'cat-zeytinyagi', name: 'Zeytinyağı', cat: 'Soslar', sub: 'Yağ', cal: 884, p: 0, c: 0, f: 100, fib: 0, servings: [S.custom('1 yemek kaşığı', 'ml', undefined, 15), S.custom('1 tatlı kaşığı', 'ml', undefined, 7), S.ml100], aliases: ['olive oil', 'zeytinyagi'] }),
  food({ id: 'cat-tereyagi', name: 'Tereyağı', cat: 'Soslar', sub: 'Yağ', cal: 717, p: 0.9, c: 0.1, f: 81, fib: 0, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 14), S.custom('1 paket', 'porsiyon', 10), S.g100], aliases: ['butter', 'tereyagi'] }),
  food({ id: 'cat-aycicek-yagi', name: 'Ayçiçek Yağı', cat: 'Soslar', sub: 'Yağ', cal: 884, p: 0, c: 0, f: 100, fib: 0, servings: [S.custom('1 yemek kaşığı', 'ml', undefined, 15), S.ml100], aliases: ['sunflower oil', 'aycicek yagi'] }),

  // ── Soslar ──────────────────────────────────────────────
  food({ id: 'cat-ketcap', name: 'Ketçap', cat: 'Soslar', sub: 'Sos', cal: 112, p: 1.3, c: 26, f: 0.1, fib: 0.3, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 17), S.custom('1 paket', 'porsiyon', 10), S.g100], aliases: ['ketchup', 'ketcap'] }),
  food({ id: 'cat-mayonez', name: 'Mayonez', cat: 'Soslar', sub: 'Sos', cal: 680, p: 1, c: 0.6, f: 75, fib: 0, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 14), S.custom('1 paket', 'porsiyon', 10), S.g100], aliases: ['mayonnaise', 'mayonez', 'mayo'] }),
  food({ id: 'cat-hardal', name: 'Hardal', cat: 'Soslar', sub: 'Sos', cal: 66, p: 4, c: 5, f: 3.3, fib: 3, servings: [S.custom('1 tatlı kaşığı', 'porsiyon', 5), S.custom('1 yemek kaşığı', 'porsiyon', 15), S.g100], aliases: ['mustard', 'hardal'] }),
  food({ id: 'cat-soya-sosu', name: 'Soya Sosu', cat: 'Soslar', sub: 'Sos', cal: 53, p: 8, c: 5, f: 0, fib: 0.8, servings: [S.custom('1 yemek kaşığı', 'ml', undefined, 15), S.ml100], aliases: ['soy sauce', 'soya sosu'] }),
  food({ id: 'cat-ranch-sos', name: 'Ranch Sos', cat: 'Soslar', sub: 'Sos', cal: 400, p: 1.5, c: 5, f: 42, fib: 0, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 15), S.g100], aliases: ['ranch sauce', 'ranch dressing'] }),
  food({ id: 'cat-barbekyu-sos', name: 'Barbekü Sosu', cat: 'Soslar', sub: 'Sos', cal: 170, p: 0.8, c: 40, f: 0.6, fib: 0.5, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 17), S.g100], aliases: ['bbq sauce', 'barbecue sauce', 'barbekyu sosu'] }),

  // ── Sürülebilir & Tatlandırıcı ──────────────────────────
  food({ id: 'cat-fistik-ezmesi', name: 'Fıstık Ezmesi', cat: 'Soslar', sub: 'Sürülebilir', cal: 588, p: 25, c: 20, f: 50, fib: 6, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 16), S.custom('2 yemek kaşığı', 'porsiyon', 32), S.g100], aliases: ['peanut butter', 'fistik ezmesi'] }),
  food({ id: 'cat-nutella', name: 'Nutella / Çikolata Ezmesi', cat: 'Soslar', sub: 'Sürülebilir', cal: 539, p: 6.3, c: 57, f: 31, fib: 3.4, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 15), S.custom('2 yemek kaşığı', 'porsiyon', 30), S.g100], aliases: ['nutella', 'chocolate spread', 'cikolata ezmesi'] }),
  food({ id: 'cat-bal', name: 'Bal', cat: 'Soslar', sub: 'Tatlandırıcı', cal: 304, p: 0.3, c: 82, f: 0, fib: 0.2, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 21), S.custom('1 tatlı kaşığı', 'porsiyon', 7), S.g100], aliases: ['honey', 'bal'] }),
  food({ id: 'cat-recel', name: 'Reçel', cat: 'Soslar', sub: 'Tatlandırıcı', cal: 250, p: 0.4, c: 65, f: 0.1, fib: 0.5, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 20), S.custom('1 tatlı kaşığı', 'porsiyon', 7), S.g100], aliases: ['jam', 'recel', 'marmalade'] }),
  food({ id: 'cat-seker', name: 'Şeker', cat: 'Soslar', sub: 'Tatlandırıcı', cal: 387, p: 0, c: 100, f: 0, fib: 0, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 12), S.custom('1 küp', 'porsiyon', 4), S.custom('1 paket', 'porsiyon', 5), S.g100], aliases: ['sugar', 'seker'] }),
  food({ id: 'cat-pekmez', name: 'Pekmez', cat: 'Soslar', sub: 'Tatlandırıcı', cal: 290, p: 0.5, c: 72, f: 0, fib: 0, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 20), S.g100], aliases: ['molasses', 'pekmez', 'grape molasses'] }),
  food({ id: 'cat-tahin', name: 'Tahin', cat: 'Soslar', sub: 'Sürülebilir', cal: 595, p: 17, c: 21, f: 54, fib: 9, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 15), S.g100], aliases: ['tahini', 'tahin'] }),
]
