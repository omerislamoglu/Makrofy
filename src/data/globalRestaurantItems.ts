import { food, S } from './catalog/helpers'
import type { FoodCatalogItem } from '../types/food'

export const GLOBAL_RESTAURANT_ITEMS: FoodCatalogItem[] = [
  // ── McDonald's ──────────────────────────────────────────────
  food({ id: 'gr-mcd-big-mac', name: 'Big Mac', brand: "McDonald's", cat: 'Fast Food', sub: 'Burger', cal: 229, p: 13, c: 20, f: 12, fib: 1.5, servings: [S.g100, S.custom('1 burger', 'adet', 200)], aliases: ['big mac', 'mcdonalds big mac'] }),
  food({ id: 'gr-mcd-mcchicken', name: 'McChicken', brand: "McDonald's", cat: 'Fast Food', sub: 'Sandwich', cal: 231, p: 12, c: 22, f: 11, fib: 1, servings: [S.g100, S.custom('1 sandwich', 'adet', 167)], aliases: ['mc chicken'] }),
  food({ id: 'gr-mcd-nuggets-6', name: 'Chicken McNuggets (6pc)', brand: "McDonald's", cat: 'Fast Food', sub: 'Chicken', cal: 265, p: 14, c: 16, f: 16, fib: 0.5, servings: [S.g100, S.custom('6 pieces', 'adet', 96)], aliases: ['mcnuggets', 'chicken mcnuggets'] }),
  food({ id: 'gr-mcd-quarter-pounder', name: 'Quarter Pounder with Cheese', brand: "McDonald's", cat: 'Fast Food', sub: 'Burger', cal: 255, p: 15, c: 16, f: 15, fib: 1, servings: [S.g100, S.custom('1 burger', 'adet', 202)], aliases: ['quarter pounder', 'qpc'] }),
  food({ id: 'gr-mcd-egg-mcmuffin', name: 'Egg McMuffin', brand: "McDonald's", cat: 'Fast Food', sub: 'Breakfast', cal: 196, p: 13, c: 19, f: 8, fib: 1, servings: [S.g100, S.custom('1 sandwich', 'adet', 136)], aliases: ['egg mcmuffin', 'mcmuffin'] }),
  food({ id: 'gr-mcd-mcflurry-oreo', name: 'McFlurry (Oreo)', brand: "McDonald's", cat: 'Fast Food', sub: 'Dessert', cal: 180, p: 3, c: 28, f: 6, fib: 0.3, servings: [S.g100, S.custom('1 cup', 'porsiyon', 200)], aliases: ['oreo mcflurry', 'mcflurry'] }),
  food({ id: 'gr-mcd-fries', name: "McDonald's Fries (Medium)", brand: "McDonald's", cat: 'Fast Food', sub: 'Sides', cal: 312, p: 3.4, c: 41, f: 15, fib: 3.8, servings: [S.g100, S.custom('1 serving', 'porsiyon', 117)], aliases: ['mcdonalds fries', 'mcd fries', 'medium fries'] }),
  food({ id: 'gr-mcd-filet-o-fish', name: 'Filet-O-Fish', brand: "McDonald's", cat: 'Fast Food', sub: 'Sandwich', cal: 243, p: 10, c: 23, f: 13, fib: 0.5, servings: [S.g100, S.custom('1 sandwich', 'adet', 142)], aliases: ['filet o fish', 'fish sandwich mcdonalds'] }),
  food({ id: 'gr-mcd-big-breakfast', name: 'Big Breakfast', brand: "McDonald's", cat: 'Fast Food', sub: 'Breakfast', cal: 210, p: 11, c: 13, f: 13, fib: 0.5, servings: [S.g100, S.custom('1 serving', 'porsiyon', 273)], aliases: ['mcdonalds big breakfast'] }),

  // ── Burger King ─────────────────────────────────────────────
  food({ id: 'gr-bk-whopper', name: 'Whopper', brand: 'Burger King', cat: 'Fast Food', sub: 'Burger', cal: 230, p: 11, c: 16, f: 14, fib: 1, servings: [S.g100, S.custom('1 burger', 'adet', 291)], aliases: ['bk whopper', 'whopper burger'] }),
  food({ id: 'gr-bk-chicken-royale', name: 'Chicken Royale', brand: 'Burger King', cat: 'Fast Food', sub: 'Sandwich', cal: 235, p: 10, c: 22, f: 12, fib: 1, servings: [S.g100, S.custom('1 sandwich', 'adet', 200)], aliases: ['bk chicken royale', 'chicken sandwich bk'] }),
  food({ id: 'gr-bk-chicken-fries', name: 'BK Chicken Fries', brand: 'Burger King', cat: 'Fast Food', sub: 'Chicken', cal: 290, p: 13, c: 22, f: 17, fib: 0.5, servings: [S.g100, S.custom('9 pieces', 'adet', 85)], aliases: ['burger king chicken fries'] }),
  food({ id: 'gr-bk-onion-rings', name: 'Onion Rings', brand: 'Burger King', cat: 'Fast Food', sub: 'Sides', cal: 350, p: 4, c: 44, f: 18, fib: 2, servings: [S.g100, S.custom('1 serving', 'porsiyon', 91)], aliases: ['bk onion rings'] }),

  // ── KFC ─────────────────────────────────────────────────────
  food({ id: 'gr-kfc-original', name: 'Original Recipe Chicken (Thigh)', brand: 'KFC', cat: 'Fast Food', sub: 'Chicken', cal: 260, p: 18, c: 9, f: 17, fib: 0.5, servings: [S.g100, S.custom('1 piece', 'adet', 130)], aliases: ['kfc chicken', 'kfc original recipe'] }),
  food({ id: 'gr-kfc-zinger', name: 'Zinger Burger', brand: 'KFC', cat: 'Fast Food', sub: 'Burger', cal: 240, p: 12, c: 22, f: 12, fib: 1, servings: [S.g100, S.custom('1 burger', 'adet', 200)], aliases: ['kfc zinger', 'zinger sandwich'] }),
  food({ id: 'gr-kfc-popcorn-chicken', name: 'Popcorn Chicken', brand: 'KFC', cat: 'Fast Food', sub: 'Chicken', cal: 285, p: 16, c: 18, f: 16, fib: 0.5, servings: [S.g100, S.custom('1 serving', 'porsiyon', 114)], aliases: ['kfc popcorn chicken'] }),
  food({ id: 'gr-kfc-coleslaw', name: 'Coleslaw', brand: 'KFC', cat: 'Fast Food', sub: 'Sides', cal: 82, p: 1, c: 11, f: 4, fib: 1.5, servings: [S.g100, S.custom('1 serving', 'porsiyon', 130)], aliases: ['kfc coleslaw'] }),

  // ── Subway ──────────────────────────────────────────────────
  food({ id: 'gr-subway-turkey', name: 'Turkey Breast Sub (6")', brand: 'Subway', cat: 'Fast Food', sub: 'Sub', cal: 134, p: 9, c: 18, f: 2.5, fib: 1.5, servings: [S.g100, S.custom('1 sub', 'adet', 220)], aliases: ['subway turkey', 'turkey sub'] }),
  food({ id: 'gr-subway-tuna', name: 'Tuna Sub (6")', brand: 'Subway', cat: 'Fast Food', sub: 'Sub', cal: 168, p: 8, c: 16, f: 8, fib: 1, servings: [S.g100, S.custom('1 sub', 'adet', 240)], aliases: ['subway tuna', 'tuna sub'] }),
  food({ id: 'gr-subway-italian-bmt', name: 'Italian BMT (6")', brand: 'Subway', cat: 'Fast Food', sub: 'Sub', cal: 170, p: 9, c: 16, f: 8, fib: 1, servings: [S.g100, S.custom('1 sub', 'adet', 230)], aliases: ['subway bmt', 'italian bmt'] }),
  food({ id: 'gr-subway-chicken-teriyaki', name: 'Chicken Teriyaki Sub (6")', brand: 'Subway', cat: 'Fast Food', sub: 'Sub', cal: 149, p: 10, c: 18, f: 3, fib: 1.5, servings: [S.g100, S.custom('1 sub', 'adet', 270)], aliases: ['subway teriyaki', 'chicken teriyaki sub'] }),
  food({ id: 'gr-subway-veggie', name: 'Veggie Delite (6")', brand: 'Subway', cat: 'Fast Food', sub: 'Sub', cal: 107, p: 4, c: 18, f: 1.5, fib: 2, servings: [S.g100, S.custom('1 sub', 'adet', 168)], aliases: ['subway veggie', 'veggie sub'] }),
  food({ id: 'gr-subway-meatball', name: 'Meatball Marinara (6")', brand: 'Subway', cat: 'Fast Food', sub: 'Sub', cal: 175, p: 9, c: 18, f: 7, fib: 2, servings: [S.g100, S.custom('1 sub', 'adet', 260)], aliases: ['subway meatball', 'meatball sub'] }),

  // ── Starbucks ───────────────────────────────────────────────
  food({ id: 'gr-sbux-latte', name: 'Caffè Latte (Grande)', brand: 'Starbucks', cat: 'Kahve', sub: 'Coffee', cal: 25, p: 1.7, c: 2.4, f: 0.9, fib: 0, servings: [S.ml100, S.custom('1 cup', 'ml', undefined, 473)], aliases: ['starbucks latte', 'grande latte'] }),
  food({ id: 'gr-sbux-cappuccino', name: 'Cappuccino (Grande)', brand: 'Starbucks', cat: 'Kahve', sub: 'Coffee', cal: 17, p: 1.4, c: 1.7, f: 0.5, fib: 0, servings: [S.ml100, S.custom('1 cup', 'ml', undefined, 473)], aliases: ['starbucks cappuccino', 'grande cappuccino'] }),
  food({ id: 'gr-sbux-caramel-frap', name: 'Caramel Frappuccino (Grande)', brand: 'Starbucks', cat: 'Kahve', sub: 'Frappuccino', cal: 56, p: 0.8, c: 10, f: 1.5, fib: 0, servings: [S.ml100, S.custom('1 cup', 'ml', undefined, 473)], aliases: ['caramel frap', 'caramel frappuccino'] }),
  food({ id: 'gr-sbux-iced-americano', name: 'Iced Americano (Grande)', brand: 'Starbucks', cat: 'Kahve', sub: 'Coffee', cal: 3, p: 0.2, c: 0.5, f: 0, fib: 0, servings: [S.ml100, S.custom('1 cup', 'ml', undefined, 473)], aliases: ['starbucks iced americano', 'iced coffee americano'] }),
  food({ id: 'gr-sbux-hot-choc', name: 'Hot Chocolate (Grande)', brand: 'Starbucks', cat: 'Kahve', sub: 'Hot Drink', cal: 68, p: 2, c: 8, f: 3, fib: 0.5, servings: [S.ml100, S.custom('1 cup', 'ml', undefined, 473)], aliases: ['starbucks hot chocolate', 'grande hot choc'] }),
  food({ id: 'gr-sbux-chai-latte', name: 'Chai Tea Latte (Grande)', brand: 'Starbucks', cat: 'Kahve', sub: 'Tea', cal: 50, p: 1, c: 9, f: 1, fib: 0, servings: [S.ml100, S.custom('1 cup', 'ml', undefined, 473)], aliases: ['starbucks chai', 'chai latte'] }),
  food({ id: 'gr-sbux-mocha', name: 'Mocha (Grande)', brand: 'Starbucks', cat: 'Kahve', sub: 'Coffee', cal: 63, p: 2, c: 8, f: 2.5, fib: 0.5, servings: [S.ml100, S.custom('1 cup', 'ml', undefined, 473)], aliases: ['starbucks mocha', 'cafe mocha'] }),

  // ── Pizza ───────────────────────────────────────────────────
  food({ id: 'gr-pizza-pepperoni', name: 'Pepperoni Pizza', brand: undefined, cat: 'Fast Food', sub: 'Pizza', cal: 266, p: 11, c: 28, f: 12, fib: 1.5, servings: [S.g100, S.custom('1 slice', 'dilim', 107)], aliases: ['pepperoni slice', 'pepperoni pizza slice'] }),
  food({ id: 'gr-pizza-margherita', name: 'Margherita Pizza', brand: undefined, cat: 'Fast Food', sub: 'Pizza', cal: 233, p: 10, c: 28, f: 9, fib: 1.5, servings: [S.g100, S.custom('1 slice', 'dilim', 100)], aliases: ['cheese pizza', 'margarita pizza'] }),
  food({ id: 'gr-pizza-bbq-chicken', name: 'BBQ Chicken Pizza', brand: undefined, cat: 'Fast Food', sub: 'Pizza', cal: 245, p: 12, c: 29, f: 9, fib: 1.5, servings: [S.g100, S.custom('1 slice', 'dilim', 115)], aliases: ['bbq pizza', 'barbecue chicken pizza'] }),
  food({ id: 'gr-pizza-hawaiian', name: 'Hawaiian Pizza', brand: undefined, cat: 'Fast Food', sub: 'Pizza', cal: 240, p: 11, c: 28, f: 9, fib: 1.5, servings: [S.g100, S.custom('1 slice', 'dilim', 105)], aliases: ['ham and pineapple pizza'] }),
  food({ id: 'gr-pizza-meat-lovers', name: 'Meat Lovers Pizza', brand: undefined, cat: 'Fast Food', sub: 'Pizza', cal: 285, p: 14, c: 25, f: 14, fib: 1, servings: [S.g100, S.custom('1 slice', 'dilim', 120)], aliases: ['meat feast pizza', 'all meat pizza'] }),
  food({ id: 'gr-garlic-bread', name: 'Garlic Bread', brand: undefined, cat: 'Fast Food', sub: 'Sides', cal: 350, p: 8, c: 40, f: 18, fib: 1.5, servings: [S.g100, S.custom('1 slice', 'dilim', 50)], aliases: ['cheesy garlic bread'] }),

  // ── Chipotle Style ──────────────────────────────────────────
  food({ id: 'gr-chipotle-chicken-bowl', name: 'Chicken Burrito Bowl', brand: 'Chipotle', cat: 'Dünya Mutfağı', sub: 'Mexican', cal: 140, p: 10, c: 14, f: 5, fib: 3, servings: [S.g100, S.custom('1 bowl', 'porsiyon', 510)], aliases: ['chipotle bowl', 'burrito bowl'] }),
  food({ id: 'gr-chipotle-steak-burrito', name: 'Steak Burrito', brand: 'Chipotle', cat: 'Dünya Mutfağı', sub: 'Mexican', cal: 165, p: 9, c: 17, f: 7, fib: 2.5, servings: [S.g100, S.custom('1 burrito', 'adet', 450)], aliases: ['chipotle steak burrito'] }),
  food({ id: 'gr-chipotle-guacamole', name: 'Guacamole', brand: 'Chipotle', cat: 'Soslar', sub: 'Dip', cal: 160, p: 2, c: 9, f: 15, fib: 7, servings: [S.g100, S.custom('1 serving', 'porsiyon', 60)], aliases: ['guac', 'avocado guacamole'] }),
  food({ id: 'gr-chipotle-chicken-burrito', name: 'Chicken Burrito', brand: 'Chipotle', cat: 'Dünya Mutfağı', sub: 'Mexican', cal: 170, p: 10, c: 18, f: 6, fib: 2.5, servings: [S.g100, S.custom('1 burrito', 'adet', 450)], aliases: ['chipotle chicken burrito'] }),
  food({ id: 'gr-chipotle-chips-salsa', name: 'Chips & Salsa', brand: 'Chipotle', cat: 'Atıştırmalık', sub: 'Snack', cal: 450, p: 5, c: 55, f: 23, fib: 3, servings: [S.g100, S.custom('1 serving', 'porsiyon', 100)], aliases: ['tortilla chips and salsa'] }),

  // ── Taco Bell Style ─────────────────────────────────────────
  food({ id: 'gr-taco-bell-crunchy', name: 'Crunchy Taco', brand: 'Taco Bell', cat: 'Dünya Mutfağı', sub: 'Mexican', cal: 218, p: 10, c: 19, f: 12, fib: 2, servings: [S.g100, S.custom('1 taco', 'adet', 78)], aliases: ['taco bell crunchy taco', 'hard shell taco'] }),
  food({ id: 'gr-taco-bell-quesadilla', name: 'Chicken Quesadilla', brand: 'Taco Bell', cat: 'Dünya Mutfağı', sub: 'Mexican', cal: 240, p: 14, c: 20, f: 12, fib: 1, servings: [S.g100, S.custom('1 piece', 'adet', 184)], aliases: ['taco bell quesadilla'] }),
  food({ id: 'gr-taco-bell-bean-burrito', name: 'Bean Burrito', brand: 'Taco Bell', cat: 'Dünya Mutfağı', sub: 'Mexican', cal: 180, p: 7, c: 23, f: 6, fib: 4, servings: [S.g100, S.custom('1 burrito', 'adet', 198)], aliases: ['taco bell bean burrito'] }),
  food({ id: 'gr-taco-bell-nachos', name: 'Nachos BellGrande', brand: 'Taco Bell', cat: 'Dünya Mutfağı', sub: 'Mexican', cal: 250, p: 7, c: 25, f: 13, fib: 2.5, servings: [S.g100, S.custom('1 serving', 'porsiyon', 308)], aliases: ['taco bell nachos', 'nachos bell grande'] }),

  // ── Sushi ───────────────────────────────────────────────────
  food({ id: 'gr-salmon-nigiri', name: 'Salmon Nigiri', brand: undefined, cat: 'Sushi & Asya Mutfağı', sub: 'Sushi', cal: 170, p: 9, c: 19, f: 6, fib: 0, servings: [S.g100, S.custom('2 pieces', 'adet', 60)], aliases: ['sake nigiri', 'salmon sushi'] }),
  food({ id: 'gr-california-roll', name: 'California Roll', brand: undefined, cat: 'Sushi & Asya Mutfağı', sub: 'Sushi', cal: 140, p: 4, c: 22, f: 4, fib: 1, servings: [S.g100, S.custom('6 pieces', 'adet', 180)], aliases: ['cali roll', 'california maki'] }),
  food({ id: 'gr-tuna-roll', name: 'Tuna Roll', brand: undefined, cat: 'Sushi & Asya Mutfağı', sub: 'Sushi', cal: 150, p: 7, c: 22, f: 3, fib: 0.5, servings: [S.g100, S.custom('6 pieces', 'adet', 170)], aliases: ['tekka maki', 'tuna maki'] }),
  food({ id: 'gr-salmon-avocado-roll', name: 'Salmon Avocado Roll', brand: undefined, cat: 'Sushi & Asya Mutfağı', sub: 'Sushi', cal: 175, p: 6, c: 22, f: 7, fib: 1.5, servings: [S.g100, S.custom('6 pieces', 'adet', 180)], aliases: ['salmon avo roll'] }),
  food({ id: 'gr-edamame', name: 'Edamame', brand: undefined, cat: 'Sushi & Asya Mutfağı', sub: 'Appetizer', cal: 121, p: 12, c: 9, f: 5, fib: 5, servings: [S.g100, S.custom('1 serving', 'porsiyon', 155)], aliases: ['steamed edamame', 'soy beans'] }),
  food({ id: 'gr-miso-soup', name: 'Miso Soup', brand: undefined, cat: 'Sushi & Asya Mutfağı', sub: 'Soup', cal: 21, p: 1.3, c: 2.5, f: 0.6, fib: 0.5, servings: [S.g100, S.custom('1 bowl', 'porsiyon', 240)], aliases: ['miso broth'] }),
  food({ id: 'gr-chicken-teriyaki', name: 'Chicken Teriyaki', brand: undefined, cat: 'Sushi & Asya Mutfağı', sub: 'Main', cal: 155, p: 16, c: 11, f: 5, fib: 0.5, servings: [S.g100, S.custom('1 serving', 'porsiyon', 250)], aliases: ['teriyaki chicken', 'chicken teriyaki plate'] }),

  // ── Other Restaurants ───────────────────────────────────────
  food({ id: 'gr-fish-and-chips', name: 'Fish and Chips', brand: undefined, cat: 'Dünya Mutfağı', sub: 'British', cal: 200, p: 10, c: 17, f: 10, fib: 1.5, servings: [S.g100, S.custom('1 serving', 'porsiyon', 300)], aliases: ['fish n chips', 'battered fish and chips'] }),
  food({ id: 'gr-beef-burger-restaurant', name: 'Beef Burger (Restaurant)', brand: undefined, cat: 'Fast Food', sub: 'Burger', cal: 250, p: 15, c: 16, f: 14, fib: 1, servings: [S.g100, S.custom('1 burger', 'adet', 250)], aliases: ['gourmet burger', 'classic burger'] }),
  food({ id: 'gr-chicken-caesar-wrap', name: 'Chicken Caesar Wrap', brand: undefined, cat: 'Ana Yemek', sub: 'Wrap', cal: 190, p: 11, c: 15, f: 10, fib: 1.5, servings: [S.g100, S.custom('1 wrap', 'adet', 250)], aliases: ['caesar wrap', 'chicken wrap caesar'] }),
  food({ id: 'gr-greek-salad', name: 'Greek Salad', brand: undefined, cat: 'Dünya Mutfağı', sub: 'Mediterranean', cal: 92, p: 3, c: 5, f: 7, fib: 1.5, servings: [S.g100, S.custom('1 serving', 'porsiyon', 300)], aliases: ['horiatiki', 'feta salad'] }),
  food({ id: 'gr-pad-thai', name: 'Pad Thai', brand: undefined, cat: 'Dünya Mutfağı', sub: 'Thai', cal: 150, p: 7, c: 19, f: 5, fib: 1.5, servings: [S.g100, S.custom('1 plate', 'porsiyon', 300)], aliases: ['thai noodles', 'pad thai noodles'] }),
  food({ id: 'gr-butter-chicken', name: 'Butter Chicken', brand: undefined, cat: 'Dünya Mutfağı', sub: 'Indian', cal: 130, p: 10, c: 6, f: 8, fib: 1, servings: [S.g100, S.custom('1 serving', 'porsiyon', 300)], aliases: ['murgh makhani', 'chicken tikka masala'] }),
  food({ id: 'gr-falafel-wrap', name: 'Falafel Wrap', brand: undefined, cat: 'Dünya Mutfağı', sub: 'Middle Eastern', cal: 195, p: 6, c: 22, f: 9, fib: 3, servings: [S.g100, S.custom('1 wrap', 'adet', 250)], aliases: ['falafel pita', 'falafel sandwich'] }),
  food({ id: 'gr-shawarma', name: 'Shawarma', brand: undefined, cat: 'Dünya Mutfağı', sub: 'Middle Eastern', cal: 180, p: 12, c: 14, f: 9, fib: 1.5, servings: [S.g100, S.custom('1 wrap', 'adet', 300)], aliases: ['chicken shawarma', 'shawarma wrap', 'doner'] }),
]
