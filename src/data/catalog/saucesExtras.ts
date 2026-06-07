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

  // ── Salça & Ekşi ────────────────────────────────────────
  food({ id: 'cat-domates-salcasi', name: 'Domates Salçası', cat: 'Soslar', sub: 'Salça', cal: 82, p: 4.3, c: 19, f: 0.5, fib: 4, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 15), S.custom('1 tatlı kaşığı', 'porsiyon', 6), S.g100], aliases: ['tomato paste', 'domates salcasi'] }),
  food({ id: 'cat-biber-salcasi', name: 'Biber Salçası', cat: 'Soslar', sub: 'Salça', cal: 90, p: 4, c: 18, f: 1, fib: 5, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 15), S.custom('1 tatlı kaşığı', 'porsiyon', 6), S.g100], aliases: ['pepper paste', 'biber salcasi'] }),
  food({ id: 'cat-nar-eksisi', name: 'Nar Ekşisi', cat: 'Soslar', sub: 'Sos', cal: 250, p: 1, c: 62, f: 0.2, fib: 0.5, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 18), S.custom('1 tatlı kaşığı', 'porsiyon', 6), S.g100], aliases: ['pomegranate molasses', 'nar eksisi', 'pomegranate sour'] }),
  food({ id: 'cat-sirke', name: 'Sirke (Elma/Üzüm)', cat: 'Soslar', sub: 'Sos', cal: 22, p: 0, c: 0.9, f: 0, fib: 0, servings: [S.custom('1 yemek kaşığı', 'ml', undefined, 15), S.ml100], aliases: ['vinegar', 'sirke', 'apple cider vinegar'] }),

  // ── Baharatlar ──────────────────────────────────────────
  food({ id: 'cat-pul-biber', name: 'Pul Biber', cat: 'Soslar', sub: 'Baharat', cal: 282, p: 12, c: 50, f: 14, fib: 28, servings: [S.custom('1 tatlı kaşığı', 'porsiyon', 3), S.custom('1 çay kaşığı', 'porsiyon', 1.5), S.g100], aliases: ['red pepper flakes', 'pul biber', 'chili flakes'] }),
  food({ id: 'cat-sumak', name: 'Sumak', cat: 'Soslar', sub: 'Baharat', cal: 290, p: 3, c: 68, f: 4, fib: 30, servings: [S.custom('1 tatlı kaşığı', 'porsiyon', 3), S.g100], aliases: ['sumac', 'sumak'] }),
  food({ id: 'cat-kekik', name: 'Kekik (Kuru)', cat: 'Soslar', sub: 'Baharat', cal: 276, p: 9, c: 64, f: 7, fib: 37, servings: [S.custom('1 tatlı kaşığı', 'porsiyon', 2), S.custom('1 çay kaşığı', 'porsiyon', 1), S.g100], aliases: ['oregano', 'thyme', 'kekik'] }),

  // ── Hazır Soslar ────────────────────────────────────────
  food({ id: 'cat-aci-sos', name: 'Acı Sos', cat: 'Soslar', sub: 'Sos', cal: 60, p: 1, c: 10, f: 1, fib: 1, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 15), S.custom('1 tatlı kaşığı', 'porsiyon', 5), S.g100], aliases: ['hot sauce', 'aci sos', 'chili sauce'] }),
  food({ id: 'cat-sarimsakli-yogurt-sos', name: 'Sarımsaklı Yoğurt Sos', cat: 'Soslar', sub: 'Sos', cal: 70, p: 3, c: 4, f: 4.5, fib: 0.2, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 18), S.porsiyon(50), S.g100], aliases: ['garlic yogurt sauce', 'sarimsakli yogurt', 'sarimsak sos'] }),

  // ── Ek Soslar & Sos Çeşitleri ───────────────────────────
  food({ id: 'cat-teriyaki-sos', name: 'Teriyaki Sosu', cat: 'Soslar', sub: 'Sos', cal: 89, p: 6, c: 16, f: 0, fib: 0.1, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 18), S.g100], aliases: ['teriyaki sauce', 'teriyaki'] }),
  food({ id: 'cat-bal-hardal-sos', name: 'Bal-Hardal Sos', cat: 'Soslar', sub: 'Sos', cal: 250, p: 1, c: 30, f: 14, fib: 0.5, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 15), S.g100], aliases: ['honey mustard', 'bal hardal'] }),
  food({ id: 'cat-pesto', name: 'Pesto Sosu', cat: 'Soslar', sub: 'Sos', cal: 387, p: 5, c: 6, f: 38, fib: 2, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 15), S.g100], aliases: ['pesto', 'basil pesto', 'feslegenli sos'] }),
  food({ id: 'cat-sriracha', name: 'Sriracha', cat: 'Soslar', sub: 'Sos', cal: 93, p: 2, c: 19, f: 1, fib: 2, servings: [S.custom('1 tatlı kaşığı', 'porsiyon', 5), S.custom('1 yemek kaşığı', 'porsiyon', 15), S.g100], aliases: ['sriracha', 'thai hot sauce'] }),
  food({ id: 'cat-hoisin-sos', name: 'Hoisin Sosu', cat: 'Soslar', sub: 'Sos', cal: 220, p: 3.5, c: 44, f: 3.4, fib: 2, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 16), S.g100], aliases: ['hoisin sauce', 'hoisin'] }),
  food({ id: 'cat-limon-sosu', name: 'Limon Sosu (Limon Sıkma)', cat: 'Soslar', sub: 'Sos', cal: 22, p: 0.4, c: 7, f: 0.2, fib: 0.3, servings: [S.custom('1 yemek kaşığı', 'ml', undefined, 15), S.ml100], aliases: ['lemon juice', 'limon suyu', 'limon sosu'] }),
  food({ id: 'cat-susamli-sos', name: 'Susamlı Sos', cat: 'Soslar', sub: 'Sos', cal: 250, p: 4, c: 15, f: 19, fib: 1, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 15), S.g100], aliases: ['sesame sauce', 'sesame dressing'] }),
  food({ id: 'cat-tatli-chili-sos', name: 'Tatlı Chili Sos', cat: 'Soslar', sub: 'Sos', cal: 210, p: 0.5, c: 52, f: 0.3, fib: 0.5, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 15), S.g100], aliases: ['sweet chili sauce', 'sweet chilli', 'tatli biber sos'] }),

  // ── Ek Yağlar & Sürülebilir ─────────────────────────────
  food({ id: 'cat-hindistan-cevizi-yagi', name: 'Hindistan Cevizi Yağı', cat: 'Soslar', sub: 'Yağ', cal: 862, p: 0, c: 0, f: 100, fib: 0, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 14), S.g100], aliases: ['coconut oil', 'hindistan cevizi yagi'] }),
  food({ id: 'cat-susam-yagi', name: 'Susam Yağı', cat: 'Soslar', sub: 'Yağ', cal: 884, p: 0, c: 0, f: 100, fib: 0, servings: [S.custom('1 tatlı kaşığı', 'ml', undefined, 5), S.custom('1 yemek kaşığı', 'ml', undefined, 14), S.ml100], aliases: ['sesame oil', 'susam yagi'] }),
  food({ id: 'cat-badem-ezmesi', name: 'Badem Ezmesi', cat: 'Soslar', sub: 'Sürülebilir', cal: 614, p: 21, c: 19, f: 56, fib: 10, servings: [S.custom('1 yemek kaşığı', 'porsiyon', 16), S.g100], aliases: ['almond butter', 'badem ezmesi'] }),

  // ── Ek Baharatlar ───────────────────────────────────────
  food({ id: 'cat-kimyon', name: 'Kimyon', cat: 'Soslar', sub: 'Baharat', cal: 375, p: 18, c: 44, f: 22, fib: 11, servings: [S.custom('1 çay kaşığı', 'porsiyon', 2), S.g100], aliases: ['cumin', 'kimyon'] }),
  food({ id: 'cat-tarcin', name: 'Tarçın', cat: 'Soslar', sub: 'Baharat', cal: 247, p: 4, c: 81, f: 1.2, fib: 53, servings: [S.custom('1 çay kaşığı', 'porsiyon', 2.5), S.g100], aliases: ['cinnamon', 'tarcin'] }),
  food({ id: 'cat-zerdeçal', name: 'Zerdeçal', cat: 'Soslar', sub: 'Baharat', cal: 312, p: 10, c: 67, f: 3.3, fib: 22, servings: [S.custom('1 çay kaşığı', 'porsiyon', 2), S.g100], aliases: ['turmeric', 'zerdecal'] }),
  food({ id: 'cat-karabiber', name: 'Karabiber', cat: 'Soslar', sub: 'Baharat', cal: 255, p: 10, c: 64, f: 3.3, fib: 26, servings: [S.custom('1 çay kaşığı', 'porsiyon', 2), S.g100], aliases: ['black pepper', 'karabiber'] }),
]
