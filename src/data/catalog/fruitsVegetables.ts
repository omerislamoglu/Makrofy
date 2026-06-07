import { food, S } from './helpers'
import type { FoodCatalogItem } from '../../types/food'

export const FRUITS_VEGETABLES: FoodCatalogItem[] = [
  // ── Meyveler ────────────────────────────────────────────
  food({ id: 'cat-muz', name: 'Muz', cat: 'Meyve', sub: 'Tropikal', cal: 89, p: 1.1, c: 23, f: 0.3, fib: 2.6, servings: [S.adet(120, '1 orta boy'), S.adet(150, '1 büyük boy'), S.g100], aliases: ['banana', 'muz'] }),
  food({ id: 'cat-elma', name: 'Elma', cat: 'Meyve', sub: 'Sert', cal: 52, p: 0.3, c: 14, f: 0.2, fib: 2.4, servings: [S.adet(180, '1 orta boy'), S.adet(220, '1 büyük boy'), S.g100], aliases: ['apple', 'elma'] }),
  food({ id: 'cat-portakal', name: 'Portakal', cat: 'Meyve', sub: 'Narenciye', cal: 47, p: 0.9, c: 12, f: 0.1, fib: 2.4, servings: [S.adet(180, '1 orta boy'), S.g100], aliases: ['orange', 'portakal'] }),
  food({ id: 'cat-mandalina', name: 'Mandalina', cat: 'Meyve', sub: 'Narenciye', cal: 53, p: 0.8, c: 13, f: 0.3, fib: 1.8, servings: [S.adet(80, '1 adet'), S.custom('3 adet', 'adet', 240), S.g100], aliases: ['tangerine', 'mandarin', 'mandalina'] }),
  food({ id: 'cat-cilek', name: 'Çilek', cat: 'Meyve', sub: 'Yumuşak', cal: 32, p: 0.7, c: 7.7, f: 0.3, fib: 2, servings: [S.kase(150, '1 kase'), S.adet(12, '1 adet'), S.g100], aliases: ['strawberry', 'cilek'] }),
  food({ id: 'cat-uzum', name: 'Üzüm', cat: 'Meyve', sub: 'Yumuşak', cal: 69, p: 0.7, c: 18, f: 0.2, fib: 0.9, servings: [S.custom('1 salkım', 'porsiyon', 150), S.custom('1 avuç', 'porsiyon', 80), S.g100], aliases: ['grape', 'uzum'] }),
  food({ id: 'cat-karpuz', name: 'Karpuz', cat: 'Meyve', sub: 'Kavun/Karpuz', cal: 30, p: 0.6, c: 7.6, f: 0.2, fib: 0.4, servings: [S.dilim(300, '1 dilim'), S.kase(150), S.g100], aliases: ['watermelon', 'karpuz'] }),
  food({ id: 'cat-kavun', name: 'Kavun', cat: 'Meyve', sub: 'Kavun/Karpuz', cal: 34, p: 0.8, c: 8.2, f: 0.2, fib: 0.9, servings: [S.dilim(200, '1 dilim'), S.kase(150), S.g100], aliases: ['melon', 'kavun', 'cantaloupe'] }),
  food({ id: 'cat-armut', name: 'Armut', cat: 'Meyve', sub: 'Sert', cal: 57, p: 0.4, c: 15, f: 0.1, fib: 3.1, servings: [S.adet(180, '1 orta boy'), S.g100], aliases: ['pear', 'armut'] }),
  food({ id: 'cat-seftali', name: 'Şeftali', cat: 'Meyve', sub: 'Çekirdekli', cal: 39, p: 0.9, c: 10, f: 0.3, fib: 1.5, servings: [S.adet(150, '1 orta boy'), S.g100], aliases: ['peach', 'seftali'] }),
  food({ id: 'cat-kivi', name: 'Kivi', cat: 'Meyve', sub: 'Tropikal', cal: 61, p: 1.1, c: 15, f: 0.5, fib: 3, servings: [S.adet(75, '1 adet'), S.custom('2 adet', 'adet', 150), S.g100], aliases: ['kiwi', 'kivi'] }),
  food({ id: 'cat-avokado', name: 'Avokado', cat: 'Meyve', sub: 'Tropikal', cal: 160, p: 2, c: 9, f: 15, fib: 7, servings: [S.adet(150, '1 bütün'), S.custom('Yarım', 'adet', 75), S.g100], aliases: ['avocado', 'avokado'] }),
  food({ id: 'cat-ananas', name: 'Ananas', cat: 'Meyve', sub: 'Tropikal', cal: 50, p: 0.5, c: 13, f: 0.1, fib: 1.4, servings: [S.dilim(80, '1 dilim'), S.kase(150), S.g100], aliases: ['pineapple', 'ananas'] }),
  food({ id: 'cat-mango', name: 'Mango', cat: 'Meyve', sub: 'Tropikal', cal: 60, p: 0.8, c: 15, f: 0.4, fib: 1.6, servings: [S.adet(200, '1 bütün'), S.custom('Yarım', 'adet', 100), S.g100], aliases: ['mango'] }),
  food({ id: 'cat-yaban-mersini', name: 'Yaban Mersini', cat: 'Meyve', sub: 'Yumuşak', cal: 57, p: 0.7, c: 14, f: 0.3, fib: 2.4, servings: [S.kase(100, '1 avuç'), S.g100], aliases: ['blueberry', 'yaban mersini', 'maviyemiş'] }),
  food({ id: 'cat-visne', name: 'Vişne', cat: 'Meyve', sub: 'Çekirdekli', cal: 50, p: 1, c: 12, f: 0.3, fib: 1.6, servings: [S.kase(100), S.g100], aliases: ['sour cherry', 'visne', 'cherry'] }),
  food({ id: 'cat-incir', name: 'İncir (Taze)', cat: 'Meyve', sub: 'Yumuşak', cal: 74, p: 0.8, c: 19, f: 0.3, fib: 2.9, servings: [S.adet(50, '1 adet'), S.custom('3 adet', 'adet', 150), S.g100], aliases: ['fig', 'incir'] }),
  food({ id: 'cat-kayisi', name: 'Kayısı', cat: 'Meyve', sub: 'Çekirdekli', cal: 48, p: 1.4, c: 11, f: 0.4, fib: 2, servings: [S.adet(35, '1 adet'), S.custom('4 adet', 'adet', 140), S.g100], aliases: ['apricot', 'kayisi'] }),
  food({ id: 'cat-nar', name: 'Nar', cat: 'Meyve', sub: 'Yumuşak', cal: 83, p: 1.7, c: 19, f: 1.2, fib: 4, servings: [S.adet(200, '1 bütün'), S.custom('Yarım', 'adet', 100), S.g100], aliases: ['pomegranate', 'nar'] }),

  // ── Sebzeler ────────────────────────────────────────────
  food({ id: 'cat-domates', name: 'Domates', cat: 'Sebze', sub: 'Meyvemsi', cal: 18, p: 0.9, c: 3.9, f: 0.2, fib: 1.2, servings: [S.adet(120, '1 orta boy'), S.g100], aliases: ['tomato', 'domates'] }),
  food({ id: 'cat-salatalik', name: 'Salatalık', cat: 'Sebze', sub: 'Meyvemsi', cal: 16, p: 0.7, c: 3.6, f: 0.1, fib: 0.5, servings: [S.adet(200, '1 adet'), S.g100], aliases: ['cucumber', 'salatalik'] }),
  food({ id: 'cat-marul', name: 'Marul', cat: 'Sebze', sub: 'Yapraklı', cal: 15, p: 1.4, c: 2.9, f: 0.2, fib: 1.3, servings: [S.kase(50, '1 avuç'), S.g100], aliases: ['lettuce', 'marul'] }),
  food({ id: 'cat-brokoli', name: 'Brokoli (Haşlanmış)', cat: 'Sebze', sub: 'Çiçek', cal: 35, p: 2.4, c: 7.2, f: 0.4, fib: 3.3, servings: [S.porsiyon(150, '1 porsiyon'), S.g100], aliases: ['broccoli', 'brokoli'] }),
  food({ id: 'cat-havuc', name: 'Havuç', cat: 'Sebze', sub: 'Kök', cal: 41, p: 0.9, c: 10, f: 0.2, fib: 2.8, servings: [S.adet(70, '1 orta boy'), S.g100], aliases: ['carrot', 'havuc'] }),
  food({ id: 'cat-kabak', name: 'Kabak (Pişmiş)', cat: 'Sebze', sub: 'Meyvemsi', cal: 17, p: 1.2, c: 3.4, f: 0.3, fib: 1, servings: [S.porsiyon(200), S.g100], aliases: ['zucchini', 'kabak', 'squash'] }),
  food({ id: 'cat-patlican', name: 'Patlıcan (Közlenmiş)', cat: 'Sebze', sub: 'Meyvemsi', cal: 25, p: 1, c: 6, f: 0.2, fib: 3, servings: [S.porsiyon(200), S.g100], aliases: ['eggplant', 'patlican', 'aubergine'] }),
  food({ id: 'cat-biber-yesil', name: 'Yeşil Biber', cat: 'Sebze', sub: 'Meyvemsi', cal: 20, p: 0.9, c: 4.6, f: 0.2, fib: 1.7, servings: [S.adet(30, '1 adet'), S.g100], aliases: ['green pepper', 'yesil biber'] }),
  food({ id: 'cat-mantar', name: 'Mantar', cat: 'Sebze', sub: 'Mantar', cal: 22, p: 3.1, c: 3.3, f: 0.3, fib: 1, servings: [S.porsiyon(100), S.g100], aliases: ['mushroom', 'mantar'] }),
  food({ id: 'cat-sogan', name: 'Soğan', cat: 'Sebze', sub: 'Kök', cal: 40, p: 1.1, c: 9.3, f: 0.1, fib: 1.7, servings: [S.adet(100, '1 orta boy'), S.g100], aliases: ['onion', 'sogan'] }),
  food({ id: 'cat-misir-haslama', name: 'Mısır (Haşlanmış)', cat: 'Sebze', sub: 'Tahıl Sebze', cal: 96, p: 3.4, c: 21, f: 1.5, fib: 2.4, servings: [S.adet(150, '1 koçan'), S.g100], aliases: ['corn', 'misir', 'sweet corn'] }),
  food({ id: 'cat-bezelye', name: 'Bezelye', cat: 'Sebze', sub: 'Baklagil', cal: 81, p: 5.4, c: 14, f: 0.4, fib: 5.1, servings: [S.porsiyon(80), S.g100], aliases: ['peas', 'bezelye', 'green peas'] }),
  food({ id: 'cat-ispanak-cig', name: 'Ispanak (Çiğ)', cat: 'Sebze', sub: 'Yapraklı', cal: 23, p: 2.9, c: 3.6, f: 0.4, fib: 2.2, servings: [S.kase(30, '1 avuç'), S.g100], aliases: ['spinach', 'ispanak'] }),
  food({ id: 'cat-karnabahar', name: 'Karnabahar (Haşlanmış)', cat: 'Sebze', sub: 'Çiçek', cal: 23, p: 1.8, c: 4.1, f: 0.5, fib: 2.3, servings: [S.porsiyon(150), S.g100], aliases: ['cauliflower', 'karnabahar'] }),

  // ── Kuru Meyveler ───────────────────────────────────────
  food({ id: 'cat-kuru-kayisi', name: 'Kuru Kayısı', cat: 'Meyve', sub: 'Kuru Meyve', cal: 241, p: 3.4, c: 63, f: 0.5, fib: 7.3, servings: [S.adet(8, '1 adet'), S.custom('5 adet', 'adet', 40), S.g100], aliases: ['dried apricot', 'kuru kayisi'] }),
  food({ id: 'cat-kuru-incir', name: 'Kuru İncir', cat: 'Meyve', sub: 'Kuru Meyve', cal: 249, p: 3.3, c: 64, f: 0.9, fib: 10, servings: [S.adet(20, '1 adet'), S.custom('3 adet', 'adet', 60), S.g100], aliases: ['dried fig', 'kuru incir'] }),
  food({ id: 'cat-hurma', name: 'Hurma', cat: 'Meyve', sub: 'Kuru Meyve', cal: 277, p: 1.8, c: 75, f: 0.2, fib: 7, servings: [S.adet(24, '1 adet'), S.custom('3 adet', 'adet', 72), S.g100], aliases: ['date', 'hurma', 'dates'] }),
  food({ id: 'cat-kuru-uzum', name: 'Kuru Üzüm', cat: 'Meyve', sub: 'Kuru Meyve', cal: 299, p: 3.1, c: 79, f: 0.5, fib: 3.7, servings: [S.custom('1 avuç', 'porsiyon', 30), S.g100], aliases: ['raisin', 'kuru uzum', 'sultana'] }),

  // ── Meyveler (devam) ────────────────────────────────────
  food({ id: 'cat-erik', name: 'Erik', cat: 'Meyve', sub: 'Çekirdekli', cal: 46, p: 0.7, c: 11, f: 0.3, fib: 1.4, servings: [S.adet(65, '1 adet'), S.custom('4 adet', 'adet', 260), S.g100], aliases: ['plum', 'erik'] }),
  food({ id: 'cat-kiraz', name: 'Kiraz', cat: 'Meyve', sub: 'Çekirdekli', cal: 63, p: 1.1, c: 16, f: 0.2, fib: 2.1, servings: [S.kase(150, '1 kase'), S.custom('1 avuç', 'porsiyon', 80), S.g100], aliases: ['cherry', 'kiraz'] }),
  food({ id: 'cat-dut', name: 'Dut', cat: 'Meyve', sub: 'Yumuşak', cal: 43, p: 1.4, c: 9.8, f: 0.4, fib: 1.7, servings: [S.kase(140, '1 kase'), S.g100], aliases: ['mulberry', 'dut'] }),
  food({ id: 'cat-bogurtlen', name: 'Böğürtlen', cat: 'Meyve', sub: 'Yumuşak', cal: 43, p: 1.4, c: 10, f: 0.5, fib: 5.3, servings: [S.kase(140, '1 kase'), S.g100], aliases: ['blackberry', 'bogurtlen'] }),
  food({ id: 'cat-greyfurt', name: 'Greyfurt', cat: 'Meyve', sub: 'Narenciye', cal: 42, p: 0.8, c: 11, f: 0.1, fib: 1.6, servings: [S.adet(250, '1 bütün'), S.custom('Yarım', 'adet', 125), S.g100], aliases: ['grapefruit', 'greyfurt'] }),
  food({ id: 'cat-limon', name: 'Limon', cat: 'Meyve', sub: 'Narenciye', cal: 29, p: 1.1, c: 9.3, f: 0.3, fib: 2.8, servings: [S.adet(80, '1 adet'), S.custom('Yarım', 'adet', 40), S.g100], aliases: ['lemon', 'limon'] }),
  food({ id: 'cat-ayva', name: 'Ayva', cat: 'Meyve', sub: 'Sert', cal: 57, p: 0.4, c: 15, f: 0.1, fib: 1.9, servings: [S.adet(200, '1 orta boy'), S.g100], aliases: ['quince', 'ayva'] }),
  food({ id: 'cat-trabzon-hurmasi', name: 'Trabzon Hurması (Cennet Hurması)', cat: 'Meyve', sub: 'Yumuşak', cal: 70, p: 0.6, c: 18, f: 0.2, fib: 3.6, servings: [S.adet(150, '1 adet'), S.g100], aliases: ['persimmon', 'trabzon hurmasi', 'cennet hurmasi'] }),

  // ── Sebzeler (devam) ────────────────────────────────────
  food({ id: 'cat-bamya-sebze', name: 'Bamya (Taze)', cat: 'Sebze', sub: 'Meyvemsi', cal: 33, p: 1.9, c: 7.5, f: 0.2, fib: 3.2, servings: [S.porsiyon(150), S.g100], aliases: ['okra', 'bamya'] }),
  food({ id: 'cat-pirasa-sebze', name: 'Pırasa (Çiğ)', cat: 'Sebze', sub: 'Kök', cal: 61, p: 1.5, c: 14, f: 0.3, fib: 1.8, servings: [S.porsiyon(150), S.g100], aliases: ['leek', 'pirasa'] }),
  food({ id: 'cat-kereviz-sebze', name: 'Kereviz (Çiğ)', cat: 'Sebze', sub: 'Kök', cal: 42, p: 1.5, c: 9.2, f: 0.3, fib: 1.8, servings: [S.porsiyon(150), S.g100], aliases: ['celeriac', 'kereviz', 'celery root'] }),
  food({ id: 'cat-taze-fasulye-sebze', name: 'Taze Fasulye (Çiğ)', cat: 'Sebze', sub: 'Baklagil', cal: 31, p: 1.8, c: 7, f: 0.2, fib: 2.7, servings: [S.porsiyon(150), S.g100], aliases: ['green beans', 'taze fasulye', 'string beans'] }),
  food({ id: 'cat-lahana', name: 'Lahana (Çiğ)', cat: 'Sebze', sub: 'Yapraklı', cal: 25, p: 1.3, c: 5.8, f: 0.1, fib: 2.5, servings: [S.porsiyon(100), S.g100], aliases: ['cabbage', 'lahana'] }),
  food({ id: 'cat-turp', name: 'Turp', cat: 'Sebze', sub: 'Kök', cal: 16, p: 0.7, c: 3.4, f: 0.1, fib: 1.6, servings: [S.adet(20, '1 adet'), S.g100], aliases: ['radish', 'turp'] }),
  food({ id: 'cat-roka', name: 'Roka', cat: 'Sebze', sub: 'Yapraklı', cal: 25, p: 2.6, c: 3.7, f: 0.7, fib: 1.6, servings: [S.kase(30, '1 avuç'), S.g100], aliases: ['arugula', 'rocket', 'roka'] }),

  // ── Sebzeler (devam 2) ──────────────────────────────────
  food({ id: 'cat-bakla', name: 'Bakla (Taze)', cat: 'Sebze', sub: 'Baklagil', cal: 88, p: 7.9, c: 12, f: 0.7, fib: 5, servings: [S.porsiyon(150), S.g100], aliases: ['fava beans', 'bakla', 'broad beans'] }),
  food({ id: 'cat-kuskonmaz', name: 'Kuşkonmaz', cat: 'Sebze', sub: 'Gövde', cal: 20, p: 2.2, c: 3.9, f: 0.1, fib: 2.1, servings: [S.porsiyon(100), S.g100], aliases: ['asparagus', 'kuskonmaz'] }),
  food({ id: 'cat-pancar', name: 'Pancar (Haşlanmış)', cat: 'Sebze', sub: 'Kök', cal: 44, p: 1.7, c: 10, f: 0.2, fib: 2, servings: [S.porsiyon(100), S.g100], aliases: ['beetroot', 'pancar', 'beet'] }),
  food({ id: 'cat-pazi', name: 'Pazı', cat: 'Sebze', sub: 'Yapraklı', cal: 19, p: 1.8, c: 3.7, f: 0.2, fib: 1.6, servings: [S.porsiyon(100), S.g100], aliases: ['chard', 'pazi', 'swiss chard'] }),
  food({ id: 'cat-semizotu', name: 'Semizotu (Çiğ)', cat: 'Sebze', sub: 'Yapraklı', cal: 16, p: 1.3, c: 3.4, f: 0.1, fib: 0.9, servings: [S.kase(50, '1 avuç'), S.g100], aliases: ['purslane', 'semizotu'] }),
  food({ id: 'cat-taze-sogan', name: 'Taze Soğan', cat: 'Sebze', sub: 'Kök', cal: 32, p: 1.8, c: 7.3, f: 0.2, fib: 2.6, servings: [S.adet(15, '1 adet'), S.g100], aliases: ['spring onion', 'taze sogan', 'scallion'] }),
  food({ id: 'cat-maydanoz', name: 'Maydanoz', cat: 'Sebze', sub: 'Yeşillik', cal: 36, p: 3, c: 6.3, f: 0.8, fib: 3.3, servings: [S.kase(30, '1 demet'), S.g100], aliases: ['parsley', 'maydanoz'] }),
  food({ id: 'cat-dereotu', name: 'Dereotu', cat: 'Sebze', sub: 'Yeşillik', cal: 43, p: 3.5, c: 7, f: 1.1, fib: 2.1, servings: [S.kase(20, '1 demet'), S.g100], aliases: ['dill', 'dereotu'] }),
  food({ id: 'cat-nane', name: 'Nane (Taze)', cat: 'Sebze', sub: 'Yeşillik', cal: 44, p: 3.3, c: 8.4, f: 0.7, fib: 6.8, servings: [S.kase(15, '1 demet'), S.g100], aliases: ['mint', 'nane', 'fresh mint'] }),
  food({ id: 'cat-bektasi-uzumu', name: 'Bektaşi Üzümü', cat: 'Meyve', sub: 'Yumuşak', cal: 44, p: 0.9, c: 10, f: 0.6, fib: 4.3, servings: [S.kase(100, '1 avuç'), S.g100], aliases: ['gooseberry', 'bektasi uzumu'] }),

  // ── Meyveler (devam 3) ──────────────────────────────────
  food({ id: 'cat-nektarin', name: 'Nektarin', cat: 'Meyve', sub: 'Çekirdekli', cal: 44, p: 1.1, c: 11, f: 0.3, fib: 1.7, servings: [S.adet(140, '1 adet'), S.g100], aliases: ['nectarine', 'nektarin'] }),
  food({ id: 'cat-ahududu', name: 'Ahududu', cat: 'Meyve', sub: 'Yumuşak', cal: 52, p: 1.2, c: 12, f: 0.7, fib: 6.5, servings: [S.kase(120, '1 kase'), S.g100], aliases: ['raspberry', 'ahududu', 'frambuaz'] }),
  food({ id: 'cat-hindistan-cevizi', name: 'Hindistan Cevizi (Taze)', cat: 'Meyve', sub: 'Tropikal', cal: 354, p: 3.3, c: 15, f: 33, fib: 9, servings: [S.porsiyon(40, '1 parça'), S.g100], aliases: ['coconut', 'hindistan cevizi'] }),
  food({ id: 'cat-kestane', name: 'Kestane (Haşlanmış)', cat: 'Meyve', sub: 'Sert', cal: 131, p: 2, c: 28, f: 1.4, fib: 5, servings: [S.g100, S.custom('5 adet', 'adet', 50)], aliases: ['chestnut', 'kestane'] }),

  // ── Sebzeler (devam 3) ──────────────────────────────────
  food({ id: 'cat-zeytin-yesil', name: 'Zeytin (Yeşil)', cat: 'Sebze', sub: 'Meyvemsi', cal: 145, p: 1, c: 3.8, f: 15, fib: 3.3, servings: [S.g100, S.adet(4, '1 adet'), S.custom('5 adet', 'adet', 20)], aliases: ['green olive', 'yesil zeytin'] }),
  food({ id: 'cat-zeytin-siyah', name: 'Zeytin (Siyah)', cat: 'Sebze', sub: 'Meyvemsi', cal: 115, p: 0.8, c: 6, f: 11, fib: 3.2, servings: [S.g100, S.adet(3, '1 adet'), S.custom('5 adet', 'adet', 15)], aliases: ['black olive', 'siyah zeytin'] }),
  food({ id: 'cat-tursu', name: 'Turşu (Karışık)', cat: 'Sebze', sub: 'Fermente', cal: 15, p: 0.5, c: 3, f: 0.1, fib: 1, servings: [S.porsiyon(50, '1 porsiyon'), S.g100], aliases: ['pickle', 'tursu', 'mixed pickles'] }),
  food({ id: 'cat-sarimsak', name: 'Sarımsak', cat: 'Sebze', sub: 'Kök', cal: 149, p: 6.4, c: 33, f: 0.5, fib: 2.1, servings: [S.adet(3, '1 diş'), S.g100], aliases: ['garlic', 'sarimsak'] }),
  food({ id: 'cat-zencefil', name: 'Zencefil (Taze)', cat: 'Sebze', sub: 'Kök', cal: 80, p: 1.8, c: 18, f: 0.8, fib: 2, servings: [S.custom('1 dilim', 'porsiyon', 5), S.g100], aliases: ['ginger', 'zencefil'] }),
  food({ id: 'cat-kurutulmus-domates', name: 'Kurutulmuş Domates', cat: 'Sebze', sub: 'Kurutulmuş', cal: 258, p: 14, c: 56, f: 3, fib: 12, servings: [S.g100, S.porsiyon(20, '3-4 adet')], aliases: ['sun dried tomato', 'kurutulmus domates'] }),
  food({ id: 'cat-kurutulmus-biber', name: 'Kurutulmuş Biber', cat: 'Sebze', sub: 'Kurutulmuş', cal: 282, p: 12, c: 50, f: 14, fib: 28, servings: [S.g100, S.adet(5, '1 adet')], aliases: ['dried pepper', 'kurutulmus biber'] }),
  food({ id: 'cat-aci-biber', name: 'Acı Biber (Taze)', cat: 'Sebze', sub: 'Meyvemsi', cal: 40, p: 2, c: 9, f: 0.4, fib: 1.5, servings: [S.adet(15, '1 adet'), S.g100], aliases: ['hot pepper', 'chili pepper', 'aci biber'] }),
  food({ id: 'cat-enginar-sebze', name: 'Enginar (Taze)', cat: 'Sebze', sub: 'Çiçek', cal: 47, p: 3.3, c: 11, f: 0.2, fib: 5.4, servings: [S.adet(120, '1 adet'), S.g100], aliases: ['artichoke', 'enginar'] }),
  food({ id: 'cat-ceviz-ici-taze', name: 'Ceviz İçi (Taze)', cat: 'Meyve', sub: 'Sert', cal: 654, p: 15, c: 14, f: 65, fib: 7, servings: [S.custom('5 yarım', 'porsiyon', 25), S.g100], aliases: ['fresh walnut', 'taze ceviz'] }),

  // ── Meyveler (devam 4) ──────────────────────────────────
  food({ id: 'cat-kus-uzumu', name: 'Kuş Üzümü', cat: 'Meyve', sub: 'Yumuşak', cal: 56, p: 1.4, c: 14, f: 0.2, fib: 4.3, servings: [S.kase(110, '1 kase'), S.g100], aliases: ['currant', 'kus uzumu', 'frenk uzumu'] }),
  food({ id: 'cat-karadut', name: 'Karadut', cat: 'Meyve', sub: 'Yumuşak', cal: 43, p: 1.4, c: 9.8, f: 0.4, fib: 1.7, servings: [S.kase(140, '1 kase'), S.g100], aliases: ['black mulberry', 'karadut'] }),
  food({ id: 'cat-yeni-dunya', name: 'Yeni Dünya', cat: 'Meyve', sub: 'Çekirdekli', cal: 47, p: 0.4, c: 12, f: 0.2, fib: 1.7, servings: [S.adet(30, '1 adet'), S.custom('5 adet', 'adet', 150), S.g100], aliases: ['loquat', 'yeni dunya', 'malta eriği'] }),
  food({ id: 'cat-beyaz-dut', name: 'Beyaz Dut', cat: 'Meyve', sub: 'Yumuşak', cal: 43, p: 1.4, c: 9.8, f: 0.4, fib: 1.7, servings: [S.kase(140, '1 kase'), S.g100], aliases: ['white mulberry', 'beyaz dut'] }),
  food({ id: 'cat-mandarin', name: 'Mandarin (Satsuma)', cat: 'Meyve', sub: 'Narenciye', cal: 47, p: 0.8, c: 12, f: 0.2, fib: 1.8, servings: [S.adet(90, '1 adet'), S.custom('3 adet', 'adet', 270), S.g100], aliases: ['satsuma', 'mandarin', 'satsuma mandalina'] }),
  food({ id: 'cat-galia-kavun', name: 'Galia Kavun', cat: 'Meyve', sub: 'Kavun/Karpuz', cal: 28, p: 0.7, c: 6.5, f: 0.2, fib: 0.8, servings: [S.dilim(180, '1 dilim'), S.kase(150), S.g100], aliases: ['galia melon', 'galia kavun'] }),
  food({ id: 'cat-mini-muz', name: 'Mini Muz (Bebe Muz)', cat: 'Meyve', sub: 'Tropikal', cal: 89, p: 1.1, c: 23, f: 0.3, fib: 2.6, servings: [S.adet(70, '1 adet'), S.custom('3 adet', 'adet', 210), S.g100], aliases: ['baby banana', 'mini muz', 'bebe muz'] }),
  food({ id: 'cat-kirmizi-muz', name: 'Kırmızı Muz', cat: 'Meyve', sub: 'Tropikal', cal: 90, p: 1.1, c: 21, f: 0.3, fib: 2.9, servings: [S.adet(100, '1 adet'), S.g100], aliases: ['red banana', 'kirmizi muz'] }),

  // ── Sebzeler (devam 4) ──────────────────────────────────
  food({ id: 'cat-tere', name: 'Tere', cat: 'Sebze', sub: 'Yapraklı', cal: 32, p: 2.6, c: 5.5, f: 0.7, fib: 1.1, servings: [S.kase(25, '1 avuç'), S.g100], aliases: ['watercress', 'tere', 'garden cress'] }),
  food({ id: 'cat-kuzu-kulagi', name: 'Kuzu Kulağı', cat: 'Sebze', sub: 'Yapraklı', cal: 22, p: 2, c: 3.2, f: 0.7, fib: 2.9, servings: [S.kase(50, '1 avuç'), S.g100], aliases: ['sorrel', 'kuzu kulagi'] }),
  food({ id: 'cat-sakiz-kabagi', name: 'Sakız Kabağı', cat: 'Sebze', sub: 'Meyvemsi', cal: 26, p: 1, c: 6.5, f: 0.1, fib: 1.5, servings: [S.porsiyon(200), S.g100], aliases: ['chayote', 'sakiz kabagi'] }),
  food({ id: 'cat-sivri-biber', name: 'Sivri Biber', cat: 'Sebze', sub: 'Meyvemsi', cal: 22, p: 0.9, c: 5, f: 0.2, fib: 1.7, servings: [S.adet(15, '1 adet'), S.g100], aliases: ['sivri biber', 'pointed pepper'] }),
  food({ id: 'cat-dolmalik-biber', name: 'Dolmalık Biber', cat: 'Sebze', sub: 'Meyvemsi', cal: 26, p: 1, c: 6.3, f: 0.2, fib: 2, servings: [S.adet(150, '1 adet'), S.g100], aliases: ['bell pepper', 'dolmalik biber', 'stuffing pepper'] }),
  food({ id: 'cat-kapya-biber', name: 'Kapya Biber', cat: 'Sebze', sub: 'Meyvemsi', cal: 31, p: 1, c: 6, f: 0.3, fib: 2.1, servings: [S.adet(120, '1 adet'), S.g100], aliases: ['capia pepper', 'kapya biber', 'red sweet pepper'] }),
  food({ id: 'cat-carliston-biber', name: 'Çarliston Biber', cat: 'Sebze', sub: 'Meyvemsi', cal: 20, p: 0.9, c: 4.6, f: 0.2, fib: 1.7, servings: [S.adet(25, '1 adet'), S.g100], aliases: ['charleston pepper', 'carliston biber'] }),
  food({ id: 'cat-kivircik-marul', name: 'Kıvırcık Marul', cat: 'Sebze', sub: 'Yapraklı', cal: 13, p: 1.3, c: 2.2, f: 0.2, fib: 1.1, servings: [S.kase(50, '1 avuç'), S.g100], aliases: ['curly lettuce', 'kivircik marul', 'frisee'] }),
  food({ id: 'cat-kirmizi-lahana', name: 'Kırmızı Lahana', cat: 'Sebze', sub: 'Yapraklı', cal: 31, p: 1.4, c: 7.4, f: 0.2, fib: 2.1, servings: [S.porsiyon(100), S.g100], aliases: ['red cabbage', 'kirmizi lahana', 'mor lahana'] }),
  food({ id: 'cat-taze-feslegen', name: 'Taze Fesleğen', cat: 'Sebze', sub: 'Yeşillik', cal: 23, p: 3.2, c: 2.7, f: 0.6, fib: 1.6, servings: [S.kase(10, '1 demet'), S.g100], aliases: ['basil', 'feslegen', 'fresh basil'] }),
  food({ id: 'cat-taze-kisnis', name: 'Taze Kişniş', cat: 'Sebze', sub: 'Yeşillik', cal: 23, p: 2.1, c: 3.7, f: 0.5, fib: 2.8, servings: [S.kase(10, '1 demet'), S.g100], aliases: ['cilantro', 'coriander', 'kisnis', 'taze kisnis'] }),
]
