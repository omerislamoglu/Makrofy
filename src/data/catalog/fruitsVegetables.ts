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
]
