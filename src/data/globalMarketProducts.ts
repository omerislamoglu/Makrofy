import { food, S } from './catalog/helpers'
import type { FoodCatalogItem } from '../types/food'

export const GLOBAL_MARKET_PRODUCTS: FoodCatalogItem[] = [
  // ── Breakfast Cereals ───────────────────────────────────────
  food({ id: 'gm-cheerios', name: 'Cheerios', brand: 'General Mills', cat: 'Kahvaltı', sub: 'Cereal', cal: 375, p: 7, c: 74, f: 6, fib: 10, servings: [S.g100, S.custom('1 bowl', 'porsiyon', 30)], aliases: ['original cheerios'] }),
  food({ id: 'gm-corn-flakes', name: 'Corn Flakes', brand: "Kellogg's", cat: 'Kahvaltı', sub: 'Cereal', cal: 357, p: 7, c: 84, f: 0.6, fib: 3, servings: [S.g100, S.custom('1 bowl', 'porsiyon', 30)], aliases: ['kelloggs corn flakes'] }),
  food({ id: 'gm-weetabix', name: 'Weetabix', brand: 'Weetabix', cat: 'Kahvaltı', sub: 'Cereal', cal: 362, p: 12, c: 68, f: 2, fib: 10, servings: [S.g100, S.custom('2 biscuits', 'adet', 37.5)], aliases: ['weetbix'] }),
  food({ id: 'gm-special-k', name: 'Special K', brand: "Kellogg's", cat: 'Kahvaltı', sub: 'Cereal', cal: 375, p: 16, c: 72, f: 1.5, fib: 3, servings: [S.g100, S.custom('1 bowl', 'porsiyon', 30)], aliases: ['kelloggs special k'] }),
  food({ id: 'gm-crunchy-nut', name: 'Crunchy Nut', brand: "Kellogg's", cat: 'Kahvaltı', sub: 'Cereal', cal: 419, p: 7, c: 74, f: 11, fib: 3, servings: [S.g100, S.custom('1 bowl', 'porsiyon', 30)], aliases: ['crunchy nut cornflakes'] }),

  // ── Drinks ──────────────────────────────────────────────────
  food({ id: 'gm-coca-cola', name: 'Coca-Cola', brand: 'Coca-Cola', cat: 'İçecek', sub: 'Soda', cal: 42, p: 0, c: 10.6, f: 0, fib: 0, servings: [S.ml100, S.custom('1 can', 'kutu', undefined, 330), S.custom('1 bottle', 'sise', undefined, 500)], aliases: ['coke', 'cola'] }),
  food({ id: 'gm-diet-coke', name: 'Diet Coke', brand: 'Coca-Cola', cat: 'İçecek', sub: 'Soda', cal: 0.4, p: 0, c: 0, f: 0, fib: 0, servings: [S.ml100, S.custom('1 can', 'kutu', undefined, 330)], aliases: ['diet cola', 'sugar free coke'] }),
  food({ id: 'gm-coke-zero', name: 'Coca-Cola Zero', brand: 'Coca-Cola', cat: 'İçecek', sub: 'Soda', cal: 0.3, p: 0, c: 0, f: 0, fib: 0, servings: [S.ml100, S.custom('1 can', 'kutu', undefined, 330)], aliases: ['coke zero', 'zero sugar coke'] }),
  food({ id: 'gm-pepsi', name: 'Pepsi', brand: 'PepsiCo', cat: 'İçecek', sub: 'Soda', cal: 43, p: 0, c: 11, f: 0, fib: 0, servings: [S.ml100, S.custom('1 can', 'kutu', undefined, 330)], aliases: ['pepsi cola'] }),
  food({ id: 'gm-sprite', name: 'Sprite', brand: 'Coca-Cola', cat: 'İçecek', sub: 'Soda', cal: 40, p: 0, c: 10, f: 0, fib: 0, servings: [S.ml100, S.custom('1 can', 'kutu', undefined, 330)], aliases: ['lemon lime soda'] }),
  food({ id: 'gm-fanta-orange', name: 'Fanta Orange', brand: 'Coca-Cola', cat: 'İçecek', sub: 'Soda', cal: 46, p: 0, c: 11, f: 0, fib: 0, servings: [S.ml100, S.custom('1 can', 'kutu', undefined, 330)], aliases: ['fanta', 'orange fanta'] }),
  food({ id: 'gm-red-bull', name: 'Red Bull', brand: 'Red Bull', cat: 'İçecek', sub: 'Energy', cal: 45, p: 0, c: 11, f: 0, fib: 0, servings: [S.ml100, S.custom('1 can', 'kutu', undefined, 250)], aliases: ['redbull', 'red bull energy'] }),
  food({ id: 'gm-monster-energy', name: 'Monster Energy', brand: 'Monster', cat: 'İçecek', sub: 'Energy', cal: 43, p: 0, c: 11, f: 0, fib: 0, servings: [S.ml100, S.custom('1 can', 'kutu', undefined, 500)], aliases: ['monster', 'monster drink'] }),
  food({ id: 'gm-orange-juice', name: 'Orange Juice (Fresh)', brand: undefined, cat: 'İçecek', sub: 'Juice', cal: 45, p: 0.7, c: 10, f: 0.2, fib: 0.2, servings: [S.ml100, S.custom('1 glass', 'ml', undefined, 250)], aliases: ['fresh oj', 'squeezed orange juice'] }),
  food({ id: 'gm-apple-juice', name: 'Apple Juice', brand: undefined, cat: 'İçecek', sub: 'Juice', cal: 46, p: 0.1, c: 11, f: 0.1, fib: 0.1, servings: [S.ml100, S.custom('1 glass', 'ml', undefined, 250)], aliases: ['pure apple juice'] }),
  food({ id: 'gm-iced-coffee', name: 'Iced Coffee (Sweetened)', brand: undefined, cat: 'Kahve', sub: 'Cold Coffee', cal: 50, p: 1, c: 9, f: 1.2, fib: 0, servings: [S.ml100, S.custom('1 cup', 'ml', undefined, 350)], aliases: ['iced latte sweetened', 'sweet iced coffee'] }),

  // ── Protein Products ────────────────────────────────────────
  food({ id: 'gm-on-gold-standard', name: 'Optimum Nutrition Gold Standard Whey', brand: 'Optimum Nutrition', cat: 'Sporcu Besinleri', sub: 'Protein', cal: 375, p: 79, c: 8, f: 4, fib: 0, servings: [S.g100, S.custom('1 scoop', 'adet', 30)], aliases: ['on whey', 'gold standard whey', 'on gold standard'] }),
  food({ id: 'gm-quest-bar', name: 'Quest Protein Bar', brand: 'Quest', cat: 'Sporcu Besinleri', sub: 'Bar', cal: 333, p: 33, c: 38, f: 12, fib: 14, servings: [S.g100, S.custom('1 bar', 'bar', 60)], aliases: ['quest bar'] }),
  food({ id: 'gm-clif-bar', name: 'Clif Bar', brand: 'Clif', cat: 'Sporcu Besinleri', sub: 'Bar', cal: 400, p: 10, c: 68, f: 10, fib: 4, servings: [S.g100, S.custom('1 bar', 'bar', 68)], aliases: ['clif energy bar'] }),
  food({ id: 'gm-kind-bar', name: 'KIND Bar', brand: 'KIND', cat: 'Atıştırmalık', sub: 'Bar', cal: 400, p: 12, c: 40, f: 22, fib: 7, servings: [S.g100, S.custom('1 bar', 'bar', 40)], aliases: ['kind snack bar'] }),
  food({ id: 'gm-fairlife-shake', name: 'Fairlife Protein Shake', brand: 'Fairlife', cat: 'Sporcu Besinleri', sub: 'Shake', cal: 60, p: 13, c: 2, f: 0.4, fib: 0, servings: [S.ml100, S.custom('1 bottle', 'sise', undefined, 340)], aliases: ['fairlife shake', 'fairlife protein'] }),

  // ── Dairy ───────────────────────────────────────────────────
  food({ id: 'gm-chobani', name: 'Chobani Greek Yogurt', brand: 'Chobani', cat: 'Süt Ürünleri', sub: 'Yogurt', cal: 97, p: 17, c: 6, f: 0, fib: 0, servings: [S.g100, S.custom('1 cup', 'porsiyon', 170)], aliases: ['chobani yogurt', 'chobani plain'] }),
  food({ id: 'gm-fage-0', name: 'Fage Total 0%', brand: 'Fage', cat: 'Süt Ürünleri', sub: 'Yogurt', cal: 54, p: 10, c: 3, f: 0, fib: 0, servings: [S.g100, S.custom('1 cup', 'porsiyon', 170)], aliases: ['fage yogurt', 'fage 0 percent'] }),
  food({ id: 'gm-oikos-triple-zero', name: 'Oikos Triple Zero', brand: 'Oikos', cat: 'Süt Ürünleri', sub: 'Yogurt', cal: 55, p: 10, c: 5, f: 0, fib: 0, servings: [S.g100, S.custom('1 cup', 'porsiyon', 150)], aliases: ['dannon oikos', 'triple zero yogurt'] }),
  food({ id: 'gm-philadelphia', name: 'Philadelphia Cream Cheese', brand: 'Philadelphia', cat: 'Süt Ürünleri', sub: 'Cheese', cal: 342, p: 6, c: 4, f: 34, fib: 0, servings: [S.g100, S.custom('1 tbsp', 'adet', 14), S.g(30)], aliases: ['philly cream cheese', 'philadelphia'] }),

  // ── Snacks ──────────────────────────────────────────────────
  food({ id: 'gm-lays-classic', name: "Lay's Classic Chips", brand: "Lay's", cat: 'Cips & Paketli Gıda', sub: 'Chips', cal: 536, p: 7, c: 50, f: 35, fib: 4, servings: [S.g100, S.custom('1 bag', 'paket', 28)], aliases: ['lays chips', 'lays original', 'potato chips'] }),
  food({ id: 'gm-doritos', name: 'Doritos Nacho Cheese', brand: 'Doritos', cat: 'Cips & Paketli Gıda', sub: 'Chips', cal: 479, p: 6, c: 59, f: 24, fib: 3, servings: [S.g100, S.custom('1 bag', 'paket', 28)], aliases: ['doritos', 'nacho cheese doritos'] }),
  food({ id: 'gm-pringles', name: 'Pringles Original', brand: 'Pringles', cat: 'Cips & Paketli Gıda', sub: 'Chips', cal: 536, p: 4, c: 50, f: 36, fib: 3, servings: [S.g100, S.custom('1 serving', 'porsiyon', 30)], aliases: ['pringles', 'pringles original'] }),
  food({ id: 'gm-oreo', name: 'Oreo Cookies', brand: 'Oreo', cat: 'Tatlı & Çikolata', sub: 'Cookies', cal: 480, p: 4, c: 68, f: 20, fib: 2, servings: [S.g100, S.custom('3 cookies', 'adet', 34)], aliases: ['oreos', 'oreo biscuits'] }),
  food({ id: 'gm-kitkat', name: 'KitKat', brand: "Nestlé", cat: 'Tatlı & Çikolata', sub: 'Chocolate', cal: 518, p: 7, c: 60, f: 28, fib: 1, servings: [S.g100, S.custom('1 bar', 'bar', 42)], aliases: ['kit kat', 'kitkat bar'] }),
  food({ id: 'gm-snickers', name: 'Snickers', brand: 'Mars', cat: 'Tatlı & Çikolata', sub: 'Chocolate', cal: 488, p: 8, c: 59, f: 23, fib: 1.5, servings: [S.g100, S.custom('1 bar', 'bar', 52)], aliases: ['snickers bar'] }),
  food({ id: 'gm-mms', name: "M&M's", brand: 'Mars', cat: 'Tatlı & Çikolata', sub: 'Chocolate', cal: 479, p: 4, c: 70, f: 20, fib: 1.5, servings: [S.g100, S.custom('1 bag', 'paket', 42)], aliases: ['m and ms', 'mms', 'peanut mms'] }),
  food({ id: 'gm-nutella', name: 'Nutella', brand: 'Ferrero', cat: 'Tatlı & Çikolata', sub: 'Spread', cal: 539, p: 6, c: 56, f: 31, fib: 1.5, servings: [S.g100, S.custom('1 tbsp', 'adet', 19)], aliases: ['hazelnut spread', 'nutella spread'] }),
  food({ id: 'gm-nature-valley', name: 'Nature Valley Granola Bar', brand: 'Nature Valley', cat: 'Atıştırmalık', sub: 'Bar', cal: 471, p: 7, c: 64, f: 20, fib: 3, servings: [S.g100, S.custom('1 bar', 'bar', 42)], aliases: ['nature valley bar', 'nature valley crunchy'] }),

  // ── Bread ───────────────────────────────────────────────────
  food({ id: 'gm-daves-killer-bread', name: "Dave's Killer Bread (21 Whole Grains)", brand: "Dave's Killer Bread", cat: 'Ekmek & Unlu Mamuller', sub: 'Bread', cal: 269, p: 13, c: 44, f: 4, fib: 5, servings: [S.g100, S.custom('1 slice', 'dilim', 45)], aliases: ['daves killer bread', 'dkb 21 grains'] }),
  food({ id: 'gm-wonder-bread', name: 'Wonder Bread', brand: 'Wonder', cat: 'Ekmek & Unlu Mamuller', sub: 'Bread', cal: 267, p: 8, c: 50, f: 3, fib: 2, servings: [S.g100, S.custom('1 slice', 'dilim', 25)], aliases: ['wonder white bread'] }),
  food({ id: 'gm-thomas-english-muffin', name: "Thomas' English Muffin", brand: "Thomas'", cat: 'Ekmek & Unlu Mamuller', sub: 'Bread', cal: 227, p: 9, c: 44, f: 2, fib: 2, servings: [S.g100, S.custom('1 piece', 'adet', 57)], aliases: ['thomas english muffin', 'thomas muffin'] }),

  // ── Ready Meals ─────────────────────────────────────────────
  food({ id: 'gm-amys-mac-cheese', name: "Amy's Frozen Mac & Cheese", brand: "Amy's", cat: 'Ana Yemek', sub: 'Frozen Meal', cal: 200, p: 7, c: 24, f: 8, fib: 2, servings: [S.g100, S.custom('1 serving', 'porsiyon', 255)], aliases: ['amys mac and cheese', 'amys frozen mac'] }),
  food({ id: 'gm-lean-cuisine-chicken', name: 'Lean Cuisine Chicken Alfredo', brand: 'Lean Cuisine', cat: 'Ana Yemek', sub: 'Frozen Meal', cal: 110, p: 8, c: 12, f: 3, fib: 1, servings: [S.g100, S.custom('1 meal', 'porsiyon', 241)], aliases: ['lean cuisine alfredo'] }),
]
