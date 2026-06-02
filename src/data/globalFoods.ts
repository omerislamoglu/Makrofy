import { food, S } from './catalog/helpers'
import type { FoodCatalogItem } from '../types/food'

export const GLOBAL_FOODS: FoodCatalogItem[] = [
  // ── Breakfast ───────────────────────────────────────────────
  food({ id: 'gl-boiled-egg', name: 'Boiled Egg', cat: 'Kahvaltı', sub: 'Eggs', cal: 155, p: 13, c: 1.1, f: 11, fib: 0, servings: [S.g100, S.custom('1 piece', 'adet', 50), S.custom('2 pieces', 'adet', 100), S.custom('3 pieces', 'adet', 150)], aliases: ['hard boiled egg', 'soft boiled egg'] }),
  food({ id: 'gl-scrambled-eggs', name: 'Scrambled Eggs', cat: 'Kahvaltı', sub: 'Eggs', cal: 149, p: 10, c: 2, f: 11, fib: 0, servings: [S.g100, S.custom('1 serving', 'porsiyon', 150)], aliases: ['scramble eggs', 'eggs scrambled'] }),
  food({ id: 'gl-oatmeal', name: 'Oatmeal (Cooked)', cat: 'Kahvaltı', sub: 'Cereal', cal: 68, p: 2.4, c: 12, f: 1.4, fib: 1.7, servings: [S.g100, S.custom('1 bowl', 'porsiyon', 250)], aliases: ['porridge', 'oats', 'cooked oats'] }),
  food({ id: 'gl-granola', name: 'Granola', cat: 'Kahvaltı', sub: 'Cereal', cal: 471, p: 10, c: 64, f: 20, fib: 5, servings: [S.g100, S.custom('1 serving', 'porsiyon', 50), S.g(30)], aliases: ['muesli granola', 'crunchy granola'] }),
  food({ id: 'gl-pancakes', name: 'Pancakes', cat: 'Kahvaltı', sub: 'Baked', cal: 227, p: 6.4, c: 28, f: 10, fib: 1, servings: [S.g100, S.custom('1 piece', 'adet', 75), S.custom('3 pieces', 'adet', 225)], aliases: ['pancake', 'hotcakes', 'flapjacks'] }),
  food({ id: 'gl-french-toast', name: 'French Toast', cat: 'Kahvaltı', sub: 'Baked', cal: 200, p: 7, c: 24, f: 8, fib: 0.5, servings: [S.g100, S.custom('1 slice', 'dilim', 65), S.custom('2 slices', 'dilim', 130)], aliases: ['eggy bread'] }),
  food({ id: 'gl-bagel', name: 'Bagel', cat: 'Kahvaltı', sub: 'Bread', cal: 257, p: 10, c: 50, f: 1.5, fib: 2.3, servings: [S.g100, S.custom('1 piece', 'adet', 105)], aliases: ['plain bagel', 'everything bagel'] }),
  food({ id: 'gl-croissant', name: 'Croissant', cat: 'Kahvaltı', sub: 'Pastry', cal: 406, p: 8.2, c: 45, f: 21, fib: 1.5, servings: [S.g100, S.custom('1 piece', 'adet', 60)], aliases: ['butter croissant'] }),
  food({ id: 'gl-avocado-toast', name: 'Avocado Toast', cat: 'Kahvaltı', sub: 'Toast', cal: 210, p: 5, c: 18, f: 14, fib: 4, servings: [S.g100, S.custom('1 slice', 'dilim', 120)], aliases: ['avo toast', 'avocado on toast'] }),
  food({ id: 'gl-smoothie-bowl', name: 'Smoothie Bowl', cat: 'Kahvaltı', sub: 'Bowl', cal: 90, p: 2, c: 18, f: 1.5, fib: 2, servings: [S.g100, S.custom('1 bowl', 'porsiyon', 300)], aliases: ['acai bowl', 'fruit bowl'] }),
  food({ id: 'gl-greek-yogurt-granola', name: 'Greek Yogurt with Granola', cat: 'Kahvaltı', sub: 'Bowl', cal: 120, p: 8, c: 14, f: 4, fib: 1, servings: [S.g100, S.custom('1 bowl', 'porsiyon', 200)], aliases: ['yogurt granola bowl', 'yogurt parfait'] }),

  // ── Protein ─────────────────────────────────────────────────
  food({ id: 'gl-grilled-chicken', name: 'Grilled Chicken Breast', cat: 'Et & Tavuk', sub: 'Chicken', cal: 165, p: 31, c: 0, f: 3.6, fib: 0, servings: [S.g100, S.custom('1 piece', 'adet', 150), S.g(200)], aliases: ['chicken breast', 'grilled chicken'] }),
  food({ id: 'gl-turkey-slices', name: 'Turkey Breast Slices', cat: 'Et & Tavuk', sub: 'Turkey', cal: 104, p: 18, c: 4, f: 2, fib: 0, servings: [S.g100, S.custom('1 serving', 'porsiyon', 56)], aliases: ['deli turkey', 'turkey cold cuts', 'sliced turkey'] }),
  food({ id: 'gl-salmon-fillet', name: 'Salmon Fillet', cat: 'Balık & Deniz Ürünleri', sub: 'Fish', cal: 208, p: 20, c: 0, f: 13, fib: 0, servings: [S.g100, S.custom('1 fillet', 'adet', 170)], aliases: ['baked salmon', 'atlantic salmon', 'salmon'] }),
  food({ id: 'gl-canned-tuna', name: 'Tuna (Canned in Water)', cat: 'Balık & Deniz Ürünleri', sub: 'Fish', cal: 116, p: 26, c: 0, f: 1, fib: 0, servings: [S.g100, S.custom('1 can', 'kutu', 140)], aliases: ['tuna can', 'canned tuna', 'tuna in water'] }),
  food({ id: 'gl-beef-steak', name: 'Beef Steak', cat: 'Et & Tavuk', sub: 'Beef', cal: 271, p: 26, c: 0, f: 18, fib: 0, servings: [S.g100, S.custom('1 piece', 'adet', 200)], aliases: ['steak', 'sirloin steak', 'ribeye'] }),
  food({ id: 'gl-ground-beef-lean', name: 'Ground Beef (95% Lean)', cat: 'Et & Tavuk', sub: 'Beef', cal: 137, p: 21, c: 0, f: 5.5, fib: 0, servings: [S.g100, S.custom('1 serving', 'porsiyon', 113)], aliases: ['lean ground beef', 'minced beef', 'lean mince'] }),
  food({ id: 'gl-chicken-thigh', name: 'Chicken Thigh', cat: 'Et & Tavuk', sub: 'Chicken', cal: 209, p: 26, c: 0, f: 11, fib: 0, servings: [S.g100, S.custom('1 piece', 'adet', 115)], aliases: ['bone-in chicken thigh', 'dark meat chicken'] }),
  food({ id: 'gl-pork-chop', name: 'Pork Chop', cat: 'Et & Tavuk', sub: 'Pork', cal: 231, p: 25, c: 0, f: 14, fib: 0, servings: [S.g100, S.custom('1 piece', 'adet', 140)], aliases: ['grilled pork chop', 'pork loin chop'] }),
  food({ id: 'gl-tofu-firm', name: 'Tofu (Firm)', cat: 'Et & Tavuk', sub: 'Plant Protein', cal: 144, p: 17, c: 3, f: 9, fib: 0.3, servings: [S.g100, S.custom('1 block', 'adet', 120)], aliases: ['firm tofu', 'soy tofu', 'bean curd'] }),
  food({ id: 'gl-shrimp', name: 'Shrimp', cat: 'Balık & Deniz Ürünleri', sub: 'Seafood', cal: 99, p: 24, c: 0.2, f: 0.3, fib: 0, servings: [S.g100, S.custom('1 serving', 'porsiyon', 85)], aliases: ['prawns', 'cooked shrimp'] }),

  // ── Dairy ───────────────────────────────────────────────────
  food({ id: 'gl-greek-yogurt', name: 'Greek Yogurt (Plain)', cat: 'Süt Ürünleri', sub: 'Yogurt', cal: 97, p: 9, c: 3.6, f: 5, fib: 0, servings: [S.g100, S.custom('1 cup', 'ml', undefined, 245)], aliases: ['plain greek yogurt', 'full fat greek yogurt'] }),
  food({ id: 'gl-cottage-cheese', name: 'Cottage Cheese', cat: 'Süt Ürünleri', sub: 'Cheese', cal: 98, p: 11, c: 3.4, f: 4.3, fib: 0, servings: [S.g100, S.custom('1 cup', 'porsiyon', 226)], aliases: ['low fat cottage cheese'] }),
  food({ id: 'gl-skyr', name: 'Skyr', cat: 'Süt Ürünleri', sub: 'Yogurt', cal: 63, p: 11, c: 3.6, f: 0.2, fib: 0, servings: [S.g100, S.custom('1 cup', 'porsiyon', 170)], aliases: ['icelandic yogurt', 'icelandic skyr'] }),
  food({ id: 'gl-cheddar', name: 'Cheddar Cheese', cat: 'Süt Ürünleri', sub: 'Cheese', cal: 403, p: 25, c: 1.3, f: 33, fib: 0, servings: [S.g100, S.custom('1 slice', 'dilim', 28)], aliases: ['cheddar', 'sharp cheddar'] }),
  food({ id: 'gl-mozzarella', name: 'Mozzarella', cat: 'Süt Ürünleri', sub: 'Cheese', cal: 280, p: 28, c: 3.1, f: 17, fib: 0, servings: [S.g100, S.custom('1 slice', 'dilim', 28)], aliases: ['mozzarella cheese', 'fresh mozzarella'] }),
  food({ id: 'gl-almond-milk', name: 'Almond Milk (Unsweetened)', cat: 'Süt Ürünleri', sub: 'Plant Milk', cal: 15, p: 0.6, c: 0.3, f: 1.2, fib: 0, servings: [S.ml100, S.custom('1 cup', 'ml', undefined, 240)], aliases: ['unsweetened almond milk'] }),
  food({ id: 'gl-oat-milk', name: 'Oat Milk', cat: 'Süt Ürünleri', sub: 'Plant Milk', cal: 48, p: 1, c: 7, f: 1.5, fib: 0.8, servings: [S.ml100, S.custom('1 cup', 'ml', undefined, 240)], aliases: ['oatmilk', 'oat beverage'] }),
  food({ id: 'gl-whole-milk', name: 'Whole Milk', cat: 'Süt Ürünleri', sub: 'Milk', cal: 61, p: 3.2, c: 4.8, f: 3.3, fib: 0, servings: [S.ml100, S.custom('1 cup', 'ml', undefined, 244)], aliases: ['full cream milk', 'full fat milk'] }),
  food({ id: 'gl-butter', name: 'Butter', cat: 'Süt Ürünleri', sub: 'Fat', cal: 717, p: 0.9, c: 0.1, f: 81, fib: 0, servings: [S.g100, S.custom('1 tbsp', 'adet', 14), S.g(10)], aliases: ['unsalted butter', 'salted butter'] }),
  food({ id: 'gl-cream-cheese', name: 'Cream Cheese', cat: 'Süt Ürünleri', sub: 'Cheese', cal: 342, p: 6, c: 4, f: 34, fib: 0, servings: [S.g100, S.custom('1 tbsp', 'adet', 14), S.g(30)], aliases: ['spreadable cream cheese'] }),

  // ── Bread & Bakery ──────────────────────────────────────────
  food({ id: 'gl-whole-wheat-bread', name: 'Whole Wheat Bread', cat: 'Ekmek & Unlu Mamuller', sub: 'Bread', cal: 247, p: 13, c: 41, f: 3.4, fib: 7, servings: [S.g100, S.custom('1 slice', 'dilim', 30), S.custom('2 slices', 'dilim', 60)], aliases: ['wholemeal bread', 'brown bread', 'wheat bread'] }),
  food({ id: 'gl-white-bread', name: 'White Bread', cat: 'Ekmek & Unlu Mamuller', sub: 'Bread', cal: 265, p: 9, c: 49, f: 3.2, fib: 2.7, servings: [S.g100, S.custom('1 slice', 'dilim', 25), S.custom('2 slices', 'dilim', 50)], aliases: ['sandwich bread', 'sliced white bread'] }),
  food({ id: 'gl-sourdough', name: 'Sourdough Bread', cat: 'Ekmek & Unlu Mamuller', sub: 'Bread', cal: 274, p: 11, c: 51, f: 3.5, fib: 2, servings: [S.g100, S.custom('1 slice', 'dilim', 40)], aliases: ['sourdough loaf'] }),
  food({ id: 'gl-tortilla-wrap', name: 'Tortilla Wrap', cat: 'Ekmek & Unlu Mamuller', sub: 'Flatbread', cal: 312, p: 8.5, c: 52, f: 8, fib: 2.1, servings: [S.g100, S.custom('1 piece', 'adet', 60)], aliases: ['flour tortilla', 'wrap', 'burrito wrap'] }),
  food({ id: 'gl-pita-bread', name: 'Pita Bread', cat: 'Ekmek & Unlu Mamuller', sub: 'Flatbread', cal: 275, p: 9.1, c: 55, f: 1.2, fib: 2, servings: [S.g100, S.custom('1 piece', 'adet', 60)], aliases: ['pita', 'pitta bread'] }),
  food({ id: 'gl-english-muffin', name: 'English Muffin', cat: 'Ekmek & Unlu Mamuller', sub: 'Bread', cal: 227, p: 8.7, c: 44, f: 2, fib: 2.5, servings: [S.g100, S.custom('1 piece', 'adet', 57)], aliases: ['muffin bread'] }),
  food({ id: 'gl-rice-cake', name: 'Rice Cake', cat: 'Ekmek & Unlu Mamuller', sub: 'Snack', cal: 387, p: 8, c: 81, f: 2.8, fib: 1.2, servings: [S.g100, S.custom('1 piece', 'adet', 9)], aliases: ['puffed rice cake'] }),

  // ── Snacks ──────────────────────────────────────────────────
  food({ id: 'gl-peanut-butter', name: 'Peanut Butter', cat: 'Atıştırmalık', sub: 'Nut Butter', cal: 588, p: 25, c: 20, f: 50, fib: 6, servings: [S.g100, S.custom('1 tbsp', 'adet', 32), S.custom('2 tbsp', 'adet', 64)], aliases: ['pb', 'natural peanut butter', 'crunchy peanut butter'] }),
  food({ id: 'gl-trail-mix', name: 'Trail Mix', cat: 'Atıştırmalık', sub: 'Mixed', cal: 462, p: 14, c: 45, f: 29, fib: 4, servings: [S.g100, S.custom('1 serving', 'porsiyon', 40)], aliases: ['nut mix', 'mixed nuts and fruits'] }),
  food({ id: 'gl-pretzels', name: 'Pretzels', cat: 'Atıştırmalık', sub: 'Snack', cal: 381, p: 10, c: 79, f: 3.5, fib: 2.8, servings: [S.g100, S.custom('1 serving', 'porsiyon', 30)], aliases: ['pretzel sticks', 'hard pretzels'] }),
  food({ id: 'gl-popcorn', name: 'Popcorn (Air-Popped)', cat: 'Atıştırmalık', sub: 'Snack', cal: 387, p: 13, c: 78, f: 4.5, fib: 15, servings: [S.g100, S.custom('1 cup', 'porsiyon', 8)], aliases: ['plain popcorn', 'air popped popcorn'] }),
  food({ id: 'gl-dark-chocolate', name: 'Dark Chocolate (70%)', cat: 'Tatlı & Çikolata', sub: 'Chocolate', cal: 598, p: 8, c: 46, f: 43, fib: 11, servings: [S.g100, S.custom('1 piece', 'adet', 25), S.g(10)], aliases: ['dark choc', '70% cocoa chocolate'] }),
  food({ id: 'gl-protein-bar', name: 'Protein Bar', cat: 'Sporcu Besinleri', sub: 'Bar', cal: 350, p: 20, c: 38, f: 12, fib: 3, servings: [S.g100, S.custom('1 bar', 'bar', 60)], aliases: ['whey bar', 'fitness bar'] }),
  food({ id: 'gl-hummus', name: 'Hummus', cat: 'Atıştırmalık', sub: 'Dip', cal: 166, p: 8, c: 14, f: 10, fib: 6, servings: [S.g100, S.custom('2 tbsp', 'porsiyon', 30)], aliases: ['houmous', 'chickpea dip'] }),
  food({ id: 'gl-mixed-nuts', name: 'Mixed Nuts', cat: 'Kuruyemiş', sub: 'Nuts', cal: 607, p: 20, c: 21, f: 54, fib: 7, servings: [S.g100, S.custom('1 serving', 'porsiyon', 28)], aliases: ['nut mix', 'assorted nuts'] }),
  food({ id: 'gl-beef-jerky', name: 'Beef Jerky', cat: 'Atıştırmalık', sub: 'Meat Snack', cal: 410, p: 33, c: 11, f: 25, fib: 0, servings: [S.g100, S.custom('1 serving', 'porsiyon', 28)], aliases: ['dried beef', 'jerky'] }),

  // ── Fruits ──────────────────────────────────────────────────
  food({ id: 'gl-apple', name: 'Apple', cat: 'Meyve', sub: 'Fruit', cal: 52, p: 0.3, c: 14, f: 0.2, fib: 2.4, servings: [S.g100, S.custom('1 piece', 'adet', 182)], aliases: ['red apple', 'green apple', 'gala apple'] }),
  food({ id: 'gl-banana', name: 'Banana', cat: 'Meyve', sub: 'Fruit', cal: 89, p: 1.1, c: 23, f: 0.3, fib: 2.6, servings: [S.g100, S.custom('1 piece', 'adet', 118)], aliases: ['ripe banana'] }),
  food({ id: 'gl-orange', name: 'Orange', cat: 'Meyve', sub: 'Fruit', cal: 47, p: 0.9, c: 12, f: 0.1, fib: 2.4, servings: [S.g100, S.custom('1 piece', 'adet', 131)], aliases: ['navel orange', 'mandarin orange'] }),
  food({ id: 'gl-blueberries', name: 'Blueberries', cat: 'Meyve', sub: 'Berry', cal: 57, p: 0.7, c: 14, f: 0.3, fib: 2.4, servings: [S.g100, S.custom('1 cup', 'porsiyon', 148)], aliases: ['fresh blueberries'] }),
  food({ id: 'gl-strawberries', name: 'Strawberries', cat: 'Meyve', sub: 'Berry', cal: 32, p: 0.7, c: 7.7, f: 0.3, fib: 2, servings: [S.g100, S.custom('1 cup', 'porsiyon', 152)], aliases: ['fresh strawberries'] }),

  // ── Grains & Sides ──────────────────────────────────────────
  food({ id: 'gl-white-rice', name: 'White Rice (Cooked)', cat: 'Pilav & Makarna', sub: 'Rice', cal: 130, p: 2.7, c: 28, f: 0.3, fib: 0.4, servings: [S.g100, S.custom('1 cup', 'porsiyon', 186)], aliases: ['steamed rice', 'boiled rice', 'cooked white rice'] }),
  food({ id: 'gl-brown-rice', name: 'Brown Rice (Cooked)', cat: 'Pilav & Makarna', sub: 'Rice', cal: 112, p: 2.3, c: 24, f: 0.8, fib: 1.8, servings: [S.g100, S.custom('1 cup', 'porsiyon', 195)], aliases: ['whole grain rice', 'cooked brown rice'] }),
  food({ id: 'gl-pasta-cooked', name: 'Pasta (Cooked)', cat: 'Pilav & Makarna', sub: 'Pasta', cal: 131, p: 5, c: 25, f: 1.1, fib: 1.8, servings: [S.g100, S.custom('1 cup', 'porsiyon', 140)], aliases: ['spaghetti', 'penne', 'cooked pasta', 'macaroni'] }),
  food({ id: 'gl-quinoa', name: 'Quinoa (Cooked)', cat: 'Pilav & Makarna', sub: 'Grain', cal: 120, p: 4.4, c: 21, f: 1.9, fib: 2.8, servings: [S.g100, S.custom('1 cup', 'porsiyon', 185)], aliases: ['cooked quinoa'] }),
  food({ id: 'gl-sweet-potato', name: 'Sweet Potato', cat: 'Sebze', sub: 'Root Vegetable', cal: 86, p: 1.6, c: 20, f: 0.1, fib: 3, servings: [S.g100, S.custom('1 medium', 'adet', 130)], aliases: ['baked sweet potato', 'yam'] }),
  food({ id: 'gl-baked-potato', name: 'Baked Potato', cat: 'Sebze', sub: 'Root Vegetable', cal: 93, p: 2.5, c: 21, f: 0.1, fib: 2.2, servings: [S.g100, S.custom('1 medium', 'adet', 173)], aliases: ['jacket potato', 'baked russet'] }),
  food({ id: 'gl-french-fries', name: 'French Fries', cat: 'Fast Food', sub: 'Sides', cal: 312, p: 3.4, c: 41, f: 15, fib: 3.8, servings: [S.g100, S.custom('1 serving', 'porsiyon', 117)], aliases: ['fries', 'chips', 'potato fries'] }),
  food({ id: 'gl-couscous', name: 'Couscous (Cooked)', cat: 'Pilav & Makarna', sub: 'Grain', cal: 112, p: 3.8, c: 23, f: 0.2, fib: 1.4, servings: [S.g100, S.custom('1 cup', 'porsiyon', 157)], aliases: ['cooked couscous'] }),

  // ── Salads & Bowls ──────────────────────────────────────────
  food({ id: 'gl-caesar-salad', name: 'Caesar Salad', cat: 'Ana Yemek', sub: 'Salad', cal: 127, p: 6, c: 7, f: 9, fib: 1.5, servings: [S.g100, S.custom('1 serving', 'porsiyon', 200)], aliases: ['chicken caesar salad'] }),
  food({ id: 'gl-garden-salad', name: 'Garden Salad (No Dressing)', cat: 'Sebze', sub: 'Salad', cal: 20, p: 1.3, c: 3.6, f: 0.2, fib: 1.8, servings: [S.g100, S.custom('1 serving', 'porsiyon', 200)], aliases: ['side salad', 'mixed green salad', 'house salad'] }),
  food({ id: 'gl-chicken-rice-bowl', name: 'Chicken Rice Bowl', cat: 'Ana Yemek', sub: 'Bowl', cal: 150, p: 12, c: 16, f: 4, fib: 1, servings: [S.g100, S.custom('1 bowl', 'porsiyon', 350)], aliases: ['chicken and rice', 'teriyaki bowl'] }),
  food({ id: 'gl-poke-bowl', name: 'Poke Bowl', cat: 'Sushi & Asya Mutfağı', sub: 'Bowl', cal: 140, p: 10, c: 15, f: 5, fib: 2, servings: [S.g100, S.custom('1 bowl', 'porsiyon', 350)], aliases: ['ahi poke', 'salmon poke bowl'] }),

  // ── Protein Supplements ─────────────────────────────────────
  food({ id: 'gl-whey-protein', name: 'Whey Protein Shake', cat: 'Sporcu Besinleri', sub: 'Protein', cal: 112, p: 24, c: 1.5, f: 1, fib: 0, servings: [S.g100, S.custom('1 scoop', 'adet', 30)], aliases: ['whey shake', 'protein powder', 'whey powder'] }),
  food({ id: 'gl-protein-smoothie', name: 'Protein Smoothie', cat: 'Sporcu Besinleri', sub: 'Shake', cal: 130, p: 20, c: 10, f: 2, fib: 1, servings: [S.ml100, S.custom('1 cup', 'ml', undefined, 300)], aliases: ['high protein smoothie'] }),
  food({ id: 'gl-casein-protein', name: 'Casein Protein', cat: 'Sporcu Besinleri', sub: 'Protein', cal: 120, p: 24, c: 3, f: 1, fib: 0, servings: [S.g100, S.custom('1 scoop', 'adet', 33)], aliases: ['casein shake', 'slow release protein'] }),

  // ── Ready Meals ─────────────────────────────────────────────
  food({ id: 'gl-mac-and-cheese', name: 'Mac and Cheese', cat: 'Ana Yemek', sub: 'Pasta', cal: 164, p: 7, c: 18, f: 7, fib: 0.7, servings: [S.g100, S.custom('1 serving', 'porsiyon', 200)], aliases: ['macaroni and cheese', 'mac n cheese'] }),
  food({ id: 'gl-chicken-pasta', name: 'Chicken Pasta', cat: 'Ana Yemek', sub: 'Pasta', cal: 165, p: 10, c: 16, f: 7, fib: 1, servings: [S.g100, S.custom('1 serving', 'porsiyon', 300)], aliases: ['chicken alfredo', 'chicken penne'] }),
  food({ id: 'gl-tuna-sandwich', name: 'Tuna Sandwich', cat: 'Ana Yemek', sub: 'Sandwich', cal: 240, p: 14, c: 24, f: 10, fib: 1.5, servings: [S.g100, S.custom('1 sandwich', 'adet', 180)], aliases: ['tuna mayo sandwich', 'tuna salad sandwich'] }),
  food({ id: 'gl-turkey-sandwich', name: 'Turkey Sandwich', cat: 'Ana Yemek', sub: 'Sandwich', cal: 220, p: 16, c: 22, f: 8, fib: 1.5, servings: [S.g100, S.custom('1 sandwich', 'adet', 180)], aliases: ['turkey club', 'turkey sub'] }),
  food({ id: 'gl-chicken-wrap', name: 'Chicken Wrap', cat: 'Ana Yemek', sub: 'Wrap', cal: 230, p: 12, c: 26, f: 9, fib: 1.5, servings: [S.g100, S.custom('1 wrap', 'adet', 200)], aliases: ['grilled chicken wrap'] }),
  food({ id: 'gl-pb-toast', name: 'Peanut Butter Toast', cat: 'Kahvaltı', sub: 'Toast', cal: 290, p: 10, c: 30, f: 15, fib: 3, servings: [S.g100, S.custom('1 serving', 'porsiyon', 60)], aliases: ['pb toast', 'peanut butter on toast'] }),
  food({ id: 'gl-egg-salad-sandwich', name: 'Egg Salad Sandwich', cat: 'Ana Yemek', sub: 'Sandwich', cal: 270, p: 12, c: 24, f: 14, fib: 1, servings: [S.g100, S.custom('1 sandwich', 'adet', 180)], aliases: ['egg mayo sandwich'] }),

  // ── Frozen ──────────────────────────────────────────────────
  food({ id: 'gl-frozen-pizza', name: 'Frozen Pizza (Margherita)', cat: 'Fast Food', sub: 'Pizza', cal: 230, p: 10, c: 28, f: 9, fib: 1.5, servings: [S.g100, S.custom('1 slice', 'dilim', 100)], aliases: ['frozen margherita', 'microwave pizza'] }),
  food({ id: 'gl-chicken-nuggets', name: 'Chicken Nuggets', cat: 'Fast Food', sub: 'Frozen', cal: 296, p: 15, c: 18, f: 18, fib: 0.5, servings: [S.g100, S.custom('5 pieces', 'adet', 90), S.custom('10 pieces', 'adet', 180)], aliases: ['frozen nuggets', 'dino nuggets'] }),
  food({ id: 'gl-fish-fingers', name: 'Fish Fingers', cat: 'Fast Food', sub: 'Frozen', cal: 220, p: 13, c: 19, f: 10, fib: 0.5, servings: [S.g100, S.custom('4 pieces', 'adet', 100)], aliases: ['fish sticks', 'frozen fish fingers'] }),
  food({ id: 'gl-frozen-berries', name: 'Frozen Berries (Mix)', cat: 'Meyve', sub: 'Frozen Fruit', cal: 48, p: 1, c: 11, f: 0.3, fib: 3, servings: [S.g100, S.custom('1 cup', 'porsiyon', 140)], aliases: ['frozen mixed berries', 'frozen fruit mix'] }),
]
