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

  // ── Geleneksel İçecekler ─────────────────────────────────
  food({ id: 'cat-boza', name: 'Boza', cat: 'İçecek', sub: 'Geleneksel', cal: 75, p: 1.5, c: 16, f: 0.2, fib: 0.5, servings: [S.bardak(200, '1 bardak'), S.ml100], aliases: ['boza', 'fermented millet drink'] }),
  food({ id: 'cat-salgam', name: 'Şalgam Suyu', cat: 'İçecek', sub: 'Geleneksel', cal: 17, p: 0.5, c: 3.5, f: 0, fib: 0.3, servings: [S.bardak(200, '1 bardak'), S.sise(300), S.ml100], aliases: ['salgam', 'turnip juice', 'şalgam'] }),

  // ── Meyve Suyu (devam) ───────────────────────────────────
  food({ id: 'cat-visne-suyu', name: 'Vişne Suyu', cat: 'İçecek', sub: 'Meyve Suyu', cal: 50, p: 0.3, c: 12, f: 0.1, fib: 0.2, servings: [S.ml100, S.bardak(200), S.kutu(330)], aliases: ['sour cherry juice', 'visne suyu'] }),
  food({ id: 'cat-kayisi-nektari', name: 'Kayısı Nektarı', cat: 'İçecek', sub: 'Meyve Suyu', cal: 56, p: 0.4, c: 14, f: 0.1, fib: 0.4, servings: [S.ml100, S.bardak(200), S.kutu(330)], aliases: ['apricot nectar', 'kayisi nektari'] }),
  food({ id: 'cat-seftali-suyu', name: 'Şeftali Suyu', cat: 'İçecek', sub: 'Meyve Suyu', cal: 54, p: 0.3, c: 13, f: 0.1, fib: 0.3, servings: [S.ml100, S.bardak(200), S.kutu(330)], aliases: ['peach juice', 'seftali suyu'] }),
  food({ id: 'cat-karadut-suyu', name: 'Karadut Suyu', cat: 'İçecek', sub: 'Meyve Suyu', cal: 52, p: 0.5, c: 12, f: 0.2, fib: 0.4, servings: [S.ml100, S.bardak(200)], aliases: ['black mulberry juice', 'karadut suyu'] }),

  // ── Bitki Çayları ────────────────────────────────────────
  food({ id: 'cat-ihlamur', name: 'Ihlamur', cat: 'İçecek', sub: 'Bitki Çayı', cal: 2, p: 0, c: 0.4, f: 0, fib: 0, servings: [S.bardak(200, '1 bardak'), S.ml100], aliases: ['linden tea', 'ihlamur'] }),
  food({ id: 'cat-adacayi', name: 'Adaçayı', cat: 'İçecek', sub: 'Bitki Çayı', cal: 2, p: 0, c: 0.4, f: 0, fib: 0, servings: [S.bardak(200, '1 bardak'), S.ml100], aliases: ['sage tea', 'adacayi'] }),
  food({ id: 'cat-kusburnu-cayi', name: 'Kuşburnu Çayı', cat: 'İçecek', sub: 'Bitki Çayı', cal: 4, p: 0, c: 1, f: 0, fib: 0, servings: [S.bardak(200, '1 bardak'), S.ml100], aliases: ['rosehip tea', 'kusburnu cayi'] }),
  food({ id: 'cat-nane-limon', name: 'Nane Limon Çayı', cat: 'İçecek', sub: 'Bitki Çayı', cal: 3, p: 0, c: 0.7, f: 0, fib: 0, servings: [S.bardak(200, '1 bardak'), S.ml100], aliases: ['mint lemon tea', 'nane limon'] }),

  // ── İçecek (devam) ───────────────────────────────────────
  food({ id: 'cat-meyveli-soda', name: 'Meyveli Soda', cat: 'İçecek', sub: 'Gazlı', cal: 18, p: 0, c: 4.5, f: 0, fib: 0, servings: [S.ml100, S.sise(200, '1 şişe'), S.kutu(330)], aliases: ['flavored soda', 'meyveli soda', 'fruit soda'] }),
  food({ id: 'cat-greyfurt-suyu', name: 'Greyfurt Suyu', cat: 'İçecek', sub: 'Meyve Suyu', cal: 39, p: 0.5, c: 9, f: 0.1, fib: 0.1, servings: [S.ml100, S.bardak(200)], aliases: ['grapefruit juice', 'greyfurt suyu'] }),
  food({ id: 'cat-nar-suyu', name: 'Nar Suyu', cat: 'İçecek', sub: 'Meyve Suyu', cal: 54, p: 0.4, c: 13, f: 0.3, fib: 0.2, servings: [S.ml100, S.bardak(200)], aliases: ['pomegranate juice', 'nar suyu'] }),
  food({ id: 'cat-domates-suyu', name: 'Domates Suyu', cat: 'İçecek', sub: 'Meyve Suyu', cal: 17, p: 0.8, c: 3.5, f: 0.1, fib: 0.4, servings: [S.ml100, S.bardak(200), S.kutu(330)], aliases: ['tomato juice', 'domates suyu'] }),
  food({ id: 'cat-menengic-kahvesi', name: 'Menengiç Kahvesi', cat: 'Kahve', sub: 'Geleneksel', cal: 60, p: 1.5, c: 7, f: 3, fib: 0.5, servings: [S.custom('1 fincan', 'ml', undefined, 100), S.ml100], aliases: ['menengic coffee', 'menengic kahvesi', 'terebinth coffee'] }),
  food({ id: 'cat-dibek-kahvesi', name: 'Dibek Kahvesi', cat: 'Kahve', sub: 'Türk Kahvesi', cal: 10, p: 0.3, c: 1.5, f: 0.3, fib: 0, servings: [S.custom('1 fincan', 'ml', undefined, 60), S.ml100], aliases: ['dibek coffee', 'dibek kahvesi'] }),

  // ── Geleneksel Türk İçecekleri ───────────────────────────
  food({ id: 'cat-salgam-suyu', name: 'Şalgam Suyu', cat: 'İçecek', sub: 'Geleneksel', cal: 12, p: 0.3, c: 2.5, f: 0.1, fib: 0.3, servings: [S.bardak(200, '1 bardak'), S.kutu(330), S.ml100], aliases: ['turnip juice', 'salgam', 'salgam suyu'] }),
  food({ id: 'cat-kefir-icecek', name: 'Kefir İçeceği', cat: 'İçecek', sub: 'Süt İçecek', cal: 52, p: 3.3, c: 4, f: 2.5, fib: 0, servings: [S.bardak(200, '1 bardak'), S.sise(500), S.ml100], aliases: ['kefir', 'kefir drink'] }),

  // ── Modern İçecekler ─────────────────────────────────────
  food({ id: 'cat-matcha-latte', name: 'Matcha Latte', cat: 'Kahve', sub: 'Latte', cal: 55, p: 3, c: 7, f: 2.5, fib: 0.5, servings: [S.bardak(300, '1 bardak'), S.ml100], aliases: ['matcha latte', 'matcha'] }),
  food({ id: 'cat-chai-latte', name: 'Chai Latte', cat: 'Kahve', sub: 'Latte', cal: 60, p: 2, c: 10, f: 1.5, fib: 0, servings: [S.bardak(300, '1 bardak'), S.ml100], aliases: ['chai latte', 'chai tea latte', 'masala chai'] }),
  food({ id: 'cat-cold-brew', name: 'Cold Brew', cat: 'Kahve', sub: 'Soğuk Kahve', cal: 3, p: 0.3, c: 0, f: 0, fib: 0, servings: [S.bardak(350, '1 bardak'), S.ml100], aliases: ['cold brew', 'cold brew coffee'] }),
  food({ id: 'cat-smoothie-berry', name: 'Mixed Berry Smoothie', cat: 'İçecek', sub: 'Smoothie', cal: 50, p: 1, c: 11, f: 0.3, fib: 1.5, servings: [S.bardak(350, '1 bardak'), S.ml100], aliases: ['berry smoothie', 'smoothie', 'meyveli smoothie'] }),
  food({ id: 'cat-oat-milk', name: 'Yulaf Sütü', cat: 'İçecek', sub: 'Bitki Sütü', cal: 46, p: 1, c: 7, f: 1.5, fib: 0.8, servings: [S.bardak(200, '1 bardak'), S.ml100], aliases: ['oat milk', 'yulaf sutu'] }),
  food({ id: 'cat-badem-sutu', name: 'Badem Sütü', cat: 'İçecek', sub: 'Bitki Sütü', cal: 17, p: 0.6, c: 0.3, f: 1.5, fib: 0.2, servings: [S.bardak(200, '1 bardak'), S.ml100], aliases: ['almond milk', 'badem sutu'] }),
  food({ id: 'cat-iced-tea', name: 'Ice Tea', cat: 'İçecek', sub: 'Soğuk İçecek', cal: 30, p: 0, c: 7.5, f: 0, fib: 0, servings: [S.ml100, S.kutu(330), S.sise(500)], aliases: ['ice tea', 'iced tea', 'soguk cay'] }),
  food({ id: 'cat-maden-suyu', name: 'Maden Suyu', cat: 'İçecek', sub: 'Su', cal: 0, p: 0, c: 0, f: 0, fib: 0, servings: [S.ml100, S.sise(200, '1 şişe'), S.sise(330, '1 kutu')], aliases: ['mineral water', 'maden suyu', 'sparkling mineral'] }),
]
