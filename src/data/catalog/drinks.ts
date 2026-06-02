import { food, S } from './helpers'
import type { FoodCatalogItem } from '../../types/food'

export const DRINKS: FoodCatalogItem[] = [
  // ── Su & Gazlı ───────────────────────────────────────────
  food({ id: 'cat-su', name: 'Su', cat: 'İçecek', sub: 'Su', cal: 0, p: 0, c: 0, f: 0, fib: 0, servings: [S.ml100, S.bardak(200), S.sise(500), S.custom('1 litre', 'sise', undefined, 1000)], aliases: ['water', 'su'] }),
  food({ id: 'cat-soda', name: 'Soda', cat: 'İçecek', sub: 'Gazlı', cal: 0, p: 0, c: 0, f: 0, fib: 0, servings: [S.ml100, S.sise(200, '1 şişe')], aliases: ['soda', 'sparkling water', 'maden suyu'] }),
  food({ id: 'cat-kola', name: 'Kola', cat: 'İçecek', sub: 'Gazlı', cal: 42, p: 0, c: 10.6, f: 0, fib: 0, servings: [S.ml100, S.kutu(330, '1 kutu'), S.bardak(200), S.sise(500)], aliases: ['cola', 'coke', 'coca cola', 'pepsi', 'kola'] }),
  food({ id: 'cat-kola-zero', name: 'Zero Kola', cat: 'İçecek', sub: 'Gazlı', cal: 0, p: 0, c: 0, f: 0, fib: 0, servings: [S.ml100, S.kutu(330), S.sise(500)], aliases: ['zero cola', 'diet cola', 'zero kola', 'coke zero', 'pepsi max'] }),
  food({ id: 'cat-gazoz', name: 'Gazoz', cat: 'İçecek', sub: 'Gazlı', cal: 40, p: 0, c: 10, f: 0, fib: 0, servings: [S.ml100, S.kutu(330), S.sise(250)], aliases: ['gazoz', 'lemonade soda', 'sprite', 'fanta'] }),
  food({ id: 'cat-ice-tea', name: 'Ice Tea', cat: 'İçecek', sub: 'Gazlı', cal: 35, p: 0, c: 8.5, f: 0, fib: 0, servings: [S.ml100, S.kutu(330), S.sise(500)], aliases: ['iced tea', 'ice tea', 'soguk cay'] }),

  // ── Meyve Suyu ───────────────────────────────────────────
  food({ id: 'cat-portakal-suyu', name: 'Portakal Suyu', cat: 'İçecek', sub: 'Meyve Suyu', cal: 45, p: 0.5, c: 10, f: 0.1, fib: 0.2, servings: [S.ml100, S.bardak(200), S.kutu(330), S.sise(500)], aliases: ['orange juice', 'portakal suyu'] }),
  food({ id: 'cat-elma-suyu', name: 'Elma Suyu', cat: 'İçecek', sub: 'Meyve Suyu', cal: 48, p: 0.1, c: 12, f: 0.1, fib: 0.2, servings: [S.ml100, S.bardak(200), S.kutu(330)], aliases: ['apple juice', 'elma suyu'] }),
  food({ id: 'cat-limonata', name: 'Limonata (Ev Yapımı)', cat: 'İçecek', sub: 'Meyve Suyu', cal: 40, p: 0, c: 10, f: 0, fib: 0, servings: [S.ml100, S.bardak(250)], aliases: ['lemonade', 'limonata'] }),

  // ── Süt & Yoğurt İçecekleri ──────────────────────────────
  food({ id: 'cat-ayran', name: 'Ayran', cat: 'İçecek', sub: 'Süt İçecek', cal: 38, p: 1.8, c: 2.4, f: 1.8, fib: 0, servings: [S.ml100, S.bardak(200), S.kutu(330), S.sise(500)], aliases: ['ayran', 'turkish yogurt drink'] }),
  food({ id: 'cat-cikolatali-sut', name: 'Çikolatalı Süt', cat: 'İçecek', sub: 'Süt İçecek', cal: 83, p: 3.2, c: 12, f: 2.5, fib: 0.5, servings: [S.ml100, S.bardak(200), S.kutu(250)], aliases: ['chocolate milk', 'cikolatali sut'] }),
  food({ id: 'cat-sahlep', name: 'Sahlep', cat: 'İçecek', sub: 'Sıcak', cal: 85, p: 2, c: 10, f: 4, fib: 0, servings: [S.bardak(200), S.ml100], aliases: ['sahlep', 'salep'] }),

  // ── Kahve ────────────────────────────────────────────────
  food({ id: 'cat-turk-kahvesi-sade', name: 'Türk Kahvesi (Sade)', cat: 'Kahve', sub: 'Türk Kahvesi', cal: 7, p: 0.3, c: 1, f: 0.2, fib: 0, servings: [S.custom('1 fincan', 'ml', undefined, 60), S.ml100], aliases: ['turkish coffee', 'turk kahvesi', 'sade kahve'] }),
  food({ id: 'cat-turk-kahvesi-orta', name: 'Türk Kahvesi (Orta Şekerli)', cat: 'Kahve', sub: 'Türk Kahvesi', cal: 40, p: 0.3, c: 8, f: 0.2, fib: 0, servings: [S.custom('1 fincan', 'ml', undefined, 60)], aliases: ['orta sekerli', 'medium sweet turkish coffee'] }),
  food({ id: 'cat-filtre-kahve', name: 'Filtre Kahve (Sade)', cat: 'Kahve', sub: 'Filtre', cal: 2, p: 0.3, c: 0, f: 0, fib: 0, servings: [S.bardak(240), S.ml100], aliases: ['filter coffee', 'filtre kahve', 'drip coffee', 'black coffee'] }),
  food({ id: 'cat-espresso', name: 'Espresso', cat: 'Kahve', sub: 'Espresso', cal: 3, p: 0.1, c: 0.5, f: 0, fib: 0, servings: [S.custom('1 tek shot', 'ml', undefined, 30), S.custom('1 double shot', 'ml', undefined, 60), S.ml100], aliases: ['espresso'] }),
  food({ id: 'cat-americano', name: 'Americano', cat: 'Kahve', sub: 'Espresso', cal: 5, p: 0.3, c: 0, f: 0, fib: 0, servings: [S.bardak(240), S.custom('Büyük boy', 'ml', undefined, 360), S.ml100], aliases: ['americano'] }),
  food({ id: 'cat-latte', name: 'Latte (Tam Yağlı Süt)', cat: 'Kahve', sub: 'Sütlü Kahve', cal: 50, p: 2.3, c: 3.3, f: 2.3, fib: 0, servings: [S.bardak(300, 'Orta boy'), S.custom('Büyük boy', 'ml', undefined, 400), S.ml100], aliases: ['latte', 'cafe latte', 'caffe latte'] }),
  food({ id: 'cat-cappuccino', name: 'Cappuccino', cat: 'Kahve', sub: 'Sütlü Kahve', cal: 50, p: 2.5, c: 3, f: 2.5, fib: 0, servings: [S.bardak(200, 'Orta boy'), S.custom('Büyük boy', 'ml', undefined, 300), S.ml100], aliases: ['cappuccino', 'cappucino'] }),
  food({ id: 'cat-mocha', name: 'Mocha', cat: 'Kahve', sub: 'Sütlü Kahve', cal: 80, p: 2.5, c: 10, f: 3.5, fib: 0.5, servings: [S.bardak(300, 'Orta boy'), S.custom('Büyük boy', 'ml', undefined, 400), S.ml100], aliases: ['mocha', 'mokka', 'cafe mocha'] }),
  food({ id: 'cat-frappe', name: 'Frappuccino / Frappe', cat: 'Kahve', sub: 'Soğuk Kahve', cal: 75, p: 1.5, c: 13, f: 2, fib: 0, servings: [S.bardak(350, 'Orta boy'), S.custom('Büyük boy', 'ml', undefined, 470), S.ml100], aliases: ['frappe', 'frappuccino', 'iced coffee'] }),

  // ── Çay ──────────────────────────────────────────────────
  food({ id: 'cat-cay-sade', name: 'Çay (Sade)', cat: 'İçecek', sub: 'Çay', cal: 1, p: 0, c: 0.2, f: 0, fib: 0, servings: [S.custom('1 bardak', 'ml', undefined, 100), S.ml100], aliases: ['tea', 'cay', 'black tea', 'sade cay'] }),
  food({ id: 'cat-cay-sekerli', name: 'Çay (1 Şekerli)', cat: 'İçecek', sub: 'Çay', cal: 20, p: 0, c: 5, f: 0, fib: 0, servings: [S.custom('1 bardak', 'ml', undefined, 100)], aliases: ['sweet tea', 'sekerli cay'] }),
  food({ id: 'cat-yesil-cay', name: 'Yeşil Çay', cat: 'İçecek', sub: 'Çay', cal: 1, p: 0, c: 0.2, f: 0, fib: 0, servings: [S.custom('1 bardak', 'ml', undefined, 200), S.ml100], aliases: ['green tea', 'yesil cay'] }),

  // ── Enerji & Sporcu ──────────────────────────────────────
  food({ id: 'cat-enerji-icecek', name: 'Enerji İçeceği', cat: 'İçecek', sub: 'Enerji', cal: 44, p: 0, c: 10.8, f: 0, fib: 0, servings: [S.ml100, S.kutu(250, '1 kutu'), S.kutu(500, '1 büyük kutu')], aliases: ['energy drink', 'enerji icecegi', 'red bull', 'monster'] }),
  food({ id: 'cat-protein-shake', name: 'Protein Shake (Sütle)', cat: 'Sporcu Besinleri', sub: 'İçecek', cal: 83, p: 10, c: 6.7, f: 2, fib: 0.5, servings: [S.bardak(300, '1 bardak'), S.ml100], aliases: ['protein shake', 'protein smoothie'] }),
  food({ id: 'cat-smoothie-meyve', name: 'Smoothie (Meyveli)', cat: 'İçecek', sub: 'Smoothie', cal: 60, p: 1, c: 13, f: 0.3, fib: 1, servings: [S.bardak(300, 'Orta boy'), S.custom('Büyük boy', 'ml', undefined, 450), S.ml100], aliases: ['smoothie', 'fruit smoothie', 'meyve smoothie'] }),

  // ── Alkol ────────────────────────────────────────────────
  food({ id: 'cat-bira', name: 'Bira', cat: 'İçecek', sub: 'Alkol', cal: 43, p: 0.3, c: 3.6, f: 0, fib: 0, servings: [S.ml100, S.kutu(330), S.sise(500)], aliases: ['beer', 'bira'] }),
  food({ id: 'cat-sarap-kirmizi', name: 'Kırmızı Şarap', cat: 'İçecek', sub: 'Alkol', cal: 83, p: 0.1, c: 2.6, f: 0, fib: 0, servings: [S.ml100, S.bardak(150, '1 kadeh')], aliases: ['red wine', 'kirmizi sarap', 'wine'] }),
  food({ id: 'cat-raki', name: 'Rakı', cat: 'İçecek', sub: 'Alkol', cal: 240, p: 0, c: 0, f: 0, fib: 0, servings: [S.ml100, S.custom('1 tek', 'ml', undefined, 50)], aliases: ['raki', 'turkish raki'] }),
]
