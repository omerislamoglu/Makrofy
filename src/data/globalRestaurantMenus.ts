/**
 * Global / English restaurant menu data for non-Turkish locales.
 *
 * Shown in the "Restaurant" tab when the app locale is NOT Turkish, so foreign
 * users browse international chains with fully English category & item names
 * (the Turkish `restaurants` list in restaurantMenus.ts is never shown to them).
 *
 * Nutrition values are per single menu item, sourced from each chain's public
 * nutrition information (US/global menus, 2024-2025). `grams` is the approximate
 * served weight where published.
 */

import type { Restaurant, RestaurantCategory, RestaurantMenuItem } from './restaurantMenus'

// ─── Compact item / category / restaurant builders ──────────────────────────
let _id = 0
/** menu item */
const m = (
  name: string,
  cal: number,
  p: number,
  c: number,
  f: number,
  fib: number,
  grams?: number,
): RestaurantMenuItem => ({
  id: `grm-${++_id}`,
  name,
  calories: cal,
  protein: p,
  carbs: c,
  fat: f,
  fiber: fib,
  ...(grams !== undefined && { grams }),
})
const cat = (category: string, items: RestaurantMenuItem[]): RestaurantCategory => ({ category, items })
const R = (
  id: string,
  name: string,
  logo: string,
  color: string,
  categories: RestaurantCategory[],
): Restaurant => ({ id, name, logo, color, categories })

// ═══════════════════════════════════════════════════════════════════════════
// McDonald's
// ═══════════════════════════════════════════════════════════════════════════
const mcdonalds = R('gr-mcdonalds', "McDonald's", '🍟', '#FFC72C', [
  cat('Burgers', [
    m('Big Mac', 563, 26, 45, 33, 3, 240),
    m('Quarter Pounder with Cheese', 520, 30, 42, 26, 2, 202),
    m('Double Quarter Pounder with Cheese', 740, 48, 43, 42, 2, 281),
    m('McDouble', 400, 22, 33, 20, 2, 155),
    m('Double Cheeseburger', 450, 25, 34, 24, 2, 173),
    m('Cheeseburger', 300, 15, 32, 13, 2, 119),
    m('Hamburger', 250, 12, 31, 9, 2, 100),
    m('McChicken', 400, 14, 39, 21, 2, 143),
    m('McCrispy', 470, 25, 46, 20, 3, 219),
    m('Spicy McCrispy', 530, 26, 48, 26, 3, 226),
    m('Filet-O-Fish', 390, 16, 39, 19, 2, 142),
  ]),
  cat('Chicken & Nuggets', [
    m('Chicken McNuggets (4 pc)', 170, 9, 10, 10, 1, 65),
    m('Chicken McNuggets (6 pc)', 250, 14, 16, 15, 1, 97),
    m('Chicken McNuggets (10 pc)', 410, 23, 26, 24, 2, 162),
    m('Chicken McNuggets (20 pc)', 820, 47, 51, 49, 3, 323),
  ]),
  cat('Fries & Sides', [
    m('French Fries (Small)', 230, 3, 30, 11, 3, 71),
    m('French Fries (Medium)', 320, 4, 43, 15, 4, 117),
    m('French Fries (Large)', 480, 6, 64, 23, 6, 154),
    m('Apple Slices', 15, 0, 4, 0, 0, 34),
  ]),
  cat('Breakfast', [
    m('Egg McMuffin', 310, 17, 30, 13, 2, 135),
    m('Sausage McMuffin with Egg', 480, 20, 30, 31, 2, 163),
    m('Bacon, Egg & Cheese Biscuit', 460, 19, 38, 26, 2, 156),
    m('Sausage Burrito', 300, 12, 26, 16, 2, 110),
    m('Hotcakes', 580, 9, 102, 15, 4, 221),
    m('Hash Browns', 140, 2, 17, 8, 2, 53),
  ]),
  cat('Desserts & Shakes', [
    m('McFlurry with Oreo Cookies', 510, 12, 80, 16, 1, 300),
    m('Vanilla Cone', 200, 5, 32, 5, 0, 130),
    m('Baked Apple Pie', 230, 2, 33, 11, 4, 77),
    m('Chocolate Shake (Medium)', 620, 14, 99, 18, 2, 473),
    m('Strawberry Shake (Medium)', 610, 13, 98, 17, 0, 473),
  ]),
  cat('Drinks', [
    m('Coca-Cola (Medium)', 200, 0, 55, 0, 0, 470),
    m('Sprite (Medium)', 200, 0, 54, 0, 0, 470),
    m('Iced Coffee (Medium)', 140, 1, 24, 5, 0, 350),
    m('Diet Coke (Medium)', 0, 0, 0, 0, 0, 470),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Burger King
// ═══════════════════════════════════════════════════════════════════════════
const burgerKing = R('gr-burger-king', 'Burger King', '🍔', '#D62300', [
  cat('Burgers', [
    m('Whopper', 657, 28, 49, 40, 2, 290),
    m('Double Whopper', 900, 48, 49, 58, 2, 374),
    m('Triple Whopper', 1130, 67, 49, 75, 2, 458),
    m('Bacon King', 1150, 61, 49, 79, 2, 376),
    m('Whopper Jr.', 310, 13, 27, 18, 1, 133),
    m('Cheeseburger', 300, 15, 28, 14, 1, 124),
    m('Double Cheeseburger', 400, 22, 28, 22, 1, 152),
    m('Bacon Cheeseburger', 320, 16, 28, 16, 1, 134),
    m('Impossible Whopper', 630, 25, 58, 34, 4, 297),
  ]),
  cat('Chicken', [
    m('Original Chicken Sandwich', 660, 28, 48, 40, 2, 219),
    m('Ch’King Sandwich', 800, 32, 56, 49, 3, 240),
    m('Chicken Fries (9 pc)', 280, 14, 19, 17, 1, 116),
    m('Chicken Nuggets (8 pc)', 340, 17, 19, 22, 1, 116),
    m('Royal Crispy Chicken', 670, 26, 53, 39, 3, 230),
  ]),
  cat('Sides', [
    m('French Fries (Medium)', 380, 4, 53, 17, 4, 117),
    m('French Fries (Large)', 430, 5, 60, 19, 5, 134),
    m('Onion Rings (Medium)', 410, 5, 50, 21, 4, 91),
    m('Mozzarella Sticks (4 pc)', 281, 12, 24, 15, 1, 100),
  ]),
  cat('Breakfast', [
    m('Croissan’wich (Sausage, Egg & Cheese)', 500, 19, 28, 33, 1, 167),
    m('Bacon, Egg & Cheese Biscuit', 410, 14, 30, 26, 1, 134),
    m('French Toast Sticks (5 pc)', 380, 6, 47, 18, 2, 110),
    m('Hash Browns (Medium)', 350, 3, 38, 21, 4, 105),
  ]),
  cat('Desserts & Drinks', [
    m('Hershey’s Sundae Pie', 310, 3, 30, 19, 2, 79),
    m('Soft Serve Cup', 170, 4, 28, 5, 0, 113),
    m('Chocolate Shake (Medium)', 580, 12, 90, 18, 1, 397),
    m('Coca-Cola (Medium)', 220, 0, 60, 0, 0, 500),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// KFC
// ═══════════════════════════════════════════════════════════════════════════
const kfc = R('gr-kfc', 'KFC', '🍗', '#A6192E', [
  cat('Fried Chicken', [
    m('Original Recipe Chicken Breast', 390, 39, 11, 21, 0, 161),
    m('Original Recipe Drumstick', 130, 13, 4, 7, 0, 59),
    m('Original Recipe Thigh', 280, 19, 9, 19, 0, 126),
    m('Original Recipe Wing', 130, 10, 4, 8, 0, 47),
    m('Extra Crispy Chicken Breast', 530, 35, 19, 35, 1, 176),
    m('Kentucky Fried Chicken Tenders (3 pc)', 410, 32, 18, 24, 1, 151),
    m('Nashville Hot Tenders (3 pc)', 480, 32, 19, 31, 1, 158),
  ]),
  cat('Sandwiches', [
    m('KFC Chicken Sandwich', 640, 30, 55, 33, 3, 199),
    m('Spicy Chicken Sandwich', 650, 30, 55, 35, 3, 199),
    m('Chicken Little', 310, 12, 25, 17, 1, 95),
  ]),
  cat('Popcorn & Bowls', [
    m('Popcorn Chicken (Large)', 620, 32, 41, 36, 2, 170),
    m('Famous Bowl', 710, 26, 80, 32, 6, 482),
    m('Mac & Cheese Bowl', 670, 24, 72, 32, 5, 470),
  ]),
  cat('Sides', [
    m('Mashed Potatoes with Gravy', 130, 2, 19, 4, 1, 136),
    m('Cole Slaw', 170, 1, 22, 9, 3, 130),
    m('Mac & Cheese', 140, 4, 15, 6, 1, 120),
    m('Biscuit', 180, 4, 23, 8, 1, 57),
    m('Secret Recipe Fries', 320, 4, 39, 16, 4, 110),
    m('Corn on the Cob', 70, 2, 16, 1, 2, 90),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Subway
// ═══════════════════════════════════════════════════════════════════════════
const subway = R('gr-subway', 'Subway', '🥪', '#008C15', [
  cat('Footlong Subs', [
    m('Turkey Breast (Footlong)', 560, 40, 92, 11, 10, 440),
    m('Italian B.M.T. (Footlong)', 760, 38, 90, 30, 9, 460),
    m('Tuna (Footlong)', 940, 46, 86, 50, 8, 480),
    m('Meatball Marinara (Footlong)', 920, 42, 100, 38, 12, 540),
    m('Chicken Teriyaki (Footlong)', 660, 48, 100, 12, 9, 540),
    m('Steak & Cheese (Footlong)', 740, 48, 90, 24, 9, 536),
    m('Veggie Delite (Footlong)', 460, 16, 84, 6, 8, 336),
    m('Spicy Italian (Footlong)', 940, 38, 88, 50, 9, 460),
  ]),
  cat('6-Inch Subs', [
    m('Turkey Breast (6-inch)', 280, 20, 46, 5, 5, 220),
    m('Italian B.M.T. (6-inch)', 380, 19, 45, 15, 5, 230),
    m('Tuna (6-inch)', 470, 23, 43, 25, 4, 240),
    m('Meatball Marinara (6-inch)', 460, 21, 50, 19, 6, 270),
    m('Chicken & Bacon Ranch (6-inch)', 540, 32, 44, 28, 4, 280),
    m('Rotisserie Chicken (6-inch)', 320, 29, 45, 5, 5, 250),
  ]),
  cat('Sides & Drinks', [
    m('Chocolate Chip Cookie', 220, 2, 30, 11, 1, 45),
    m('Raspberry Cheesecake Cookie', 220, 2, 29, 11, 1, 45),
    m('Lay’s Classic Chips', 240, 2, 23, 15, 1, 43),
    m('Coca-Cola (Medium)', 200, 0, 55, 0, 0, 470),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Starbucks
// ═══════════════════════════════════════════════════════════════════════════
const starbucks = R('gr-starbucks', 'Starbucks', '☕', '#00704A', [
  cat('Hot Coffee', [
    m('Caffè Latte (Grande)', 190, 13, 19, 7, 0, 473),
    m('Cappuccino (Grande)', 140, 9, 14, 5, 0, 473),
    m('Caffè Americano (Grande)', 15, 1, 3, 0, 0, 473),
    m('Caffè Mocha (Grande)', 370, 14, 44, 16, 3, 473),
    m('Caramel Macchiato (Grande)', 250, 10, 35, 7, 0, 473),
    m('Flat White (Grande)', 220, 12, 18, 11, 0, 473),
    m('Pumpkin Spice Latte (Grande)', 390, 14, 52, 14, 0, 473),
  ]),
  cat('Cold Coffee', [
    m('Iced Caffè Latte (Grande)', 130, 8, 13, 4.5, 0, 473),
    m('Iced Caramel Macchiato (Grande)', 250, 10, 37, 7, 0, 473),
    m('Caramel Frappuccino (Grande)', 380, 4, 54, 16, 0, 473),
    m('Mocha Frappuccino (Grande)', 370, 5, 54, 15, 2, 473),
    m('Java Chip Frappuccino (Grande)', 440, 6, 63, 19, 2, 473),
    m('Vanilla Sweet Cream Cold Brew (Grande)', 110, 1, 14, 6, 0, 473),
    m('Iced Brown Sugar Oat Shaken Espresso (Grande)', 120, 1, 19, 5, 1, 473),
  ]),
  cat('Tea & Refreshers', [
    m('Chai Tea Latte (Grande)', 240, 8, 45, 4.5, 0, 473),
    m('Matcha Green Tea Latte (Grande)', 240, 12, 34, 7, 1, 473),
    m('Mango Dragonfruit Refresher (Grande)', 90, 0, 21, 0, 1, 473),
    m('Strawberry Açaí Refresher (Grande)', 90, 0, 22, 0, 1, 473),
  ]),
  cat('Food', [
    m('Butter Croissant', 250, 5, 26, 14, 1, 71),
    m('Chocolate Croissant', 360, 6, 39, 21, 2, 89),
    m('Bacon, Gouda & Egg Sandwich', 360, 18, 33, 18, 1, 137),
    m('Spinach, Feta & Egg White Wrap', 290, 20, 34, 8, 6, 170),
    m('Blueberry Muffin', 360, 6, 53, 14, 1, 113),
    m('Cake Pop', 150, 1, 21, 7, 0, 31),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Wendy's
// ═══════════════════════════════════════════════════════════════════════════
const wendys = R('gr-wendys', "Wendy's", '🍔', '#E2203B', [
  cat('Burgers', [
    m('Dave’s Single', 580, 30, 39, 34, 2, 219),
    m('Dave’s Double', 810, 48, 40, 51, 2, 295),
    m('Dave’s Triple', 1040, 67, 41, 67, 2, 371),
    m('Baconator', 950, 56, 39, 62, 2, 297),
    m('Jr. Bacon Cheeseburger', 380, 19, 26, 22, 1, 129),
    m('Jr. Cheeseburger', 290, 15, 26, 13, 1, 113),
    m('Pretzel Bacon Pub Cheeseburger', 800, 41, 50, 48, 2, 290),
  ]),
  cat('Chicken', [
    m('Spicy Chicken Sandwich', 510, 29, 49, 22, 2, 225),
    m('Classic Chicken Sandwich', 490, 28, 47, 21, 2, 220),
    m('Crispy Chicken Sandwich', 340, 15, 35, 16, 1, 130),
    m('Chicken Nuggets (10 pc)', 420, 21, 24, 27, 1, 160),
    m('Spicy Chicken Nuggets (10 pc)', 440, 22, 26, 28, 1, 162),
  ]),
  cat('Sides & Frosty', [
    m('Fries (Medium)', 420, 5, 56, 20, 6, 130),
    m('Fries (Large)', 520, 7, 70, 24, 7, 160),
    m('Baked Potato (Plain)', 270, 7, 61, 0, 7, 312),
    m('Chili (Small)', 240, 17, 23, 9, 6, 227),
    m('Chocolate Frosty (Medium)', 470, 12, 79, 13, 0, 298),
    m('Vanilla Frosty (Medium)', 460, 11, 76, 13, 0, 298),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Taco Bell
// ═══════════════════════════════════════════════════════════════════════════
const tacoBell = R('gr-taco-bell', 'Taco Bell', '🌮', '#702082', [
  cat('Tacos', [
    m('Crunchy Taco', 170, 8, 13, 10, 3, 78),
    m('Crunchy Taco Supreme', 190, 8, 15, 11, 3, 92),
    m('Soft Taco', 180, 9, 18, 9, 3, 99),
    m('Doritos Locos Tacos', 170, 8, 13, 9, 3, 78),
    m('Chicken Soft Taco', 160, 11, 16, 6, 2, 92),
  ]),
  cat('Burritos', [
    m('Bean Burrito', 350, 13, 54, 9, 9, 198),
    m('Beefy 5-Layer Burrito', 490, 18, 60, 19, 7, 248),
    m('Burrito Supreme', 390, 16, 51, 14, 7, 248),
    m('Quesarito', 650, 21, 67, 33, 5, 248),
    m('Grilled Cheese Burrito', 710, 27, 64, 38, 5, 305),
  ]),
  cat('Specialties', [
    m('Crunchwrap Supreme', 530, 16, 71, 21, 6, 254),
    m('Chalupa Supreme', 350, 13, 30, 19, 4, 153),
    m('Mexican Pizza', 540, 19, 47, 31, 6, 218),
    m('Quesadilla (Chicken)', 510, 26, 38, 28, 4, 184),
  ]),
  cat('Nachos & Sides', [
    m('Nachos BellGrande', 740, 16, 82, 38, 12, 482),
    m('Nacho Fries', 320, 4, 35, 18, 3, 130),
    m('Cheesy Fiesta Potatoes', 250, 5, 27, 13, 3, 142),
    m('Cinnamon Twists', 170, 1, 27, 6, 1, 35),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Chipotle
// ═══════════════════════════════════════════════════════════════════════════
const chipotle = R('gr-chipotle', 'Chipotle', '🌯', '#A81612', [
  cat('Burritos & Bowls', [
    m('Chicken Burrito', 1060, 53, 99, 45, 11, 638),
    m('Steak Burrito', 1040, 47, 99, 44, 11, 638),
    m('Carnitas Burrito', 1080, 47, 98, 49, 11, 638),
    m('Barbacoa Burrito', 1020, 50, 98, 41, 11, 638),
    m('Sofritas Burrito', 985, 32, 105, 42, 14, 638),
    m('Chicken Burrito Bowl', 625, 45, 51, 26, 9, 510),
    m('Steak Burrito Bowl', 605, 39, 51, 25, 9, 510),
  ]),
  cat('Tacos', [
    m('Chicken Tacos (3, soft)', 530, 41, 53, 18, 7, 300),
    m('Steak Tacos (3, soft)', 510, 35, 53, 17, 7, 300),
    m('Carnitas Tacos (3, soft)', 540, 35, 52, 21, 7, 300),
  ]),
  cat('Sides & Extras', [
    m('Chips & Guacamole', 770, 9, 73, 51, 13, 230),
    m('Chips & Queso Blanco', 770, 14, 73, 47, 8, 220),
    m('Side of Guacamole', 230, 2, 8, 22, 6, 113),
    m('Chips', 540, 7, 73, 25, 7, 113),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Chick-fil-A
// ═══════════════════════════════════════════════════════════════════════════
const chickFilA = R('gr-chick-fil-a', 'Chick-fil-A', '🐔', '#E51636', [
  cat('Chicken', [
    m('Chick-fil-A Chicken Sandwich', 420, 28, 41, 19, 2, 183),
    m('Spicy Chicken Sandwich', 450, 28, 41, 20, 2, 183),
    m('Deluxe Chicken Sandwich', 490, 31, 43, 23, 3, 208),
    m('Grilled Chicken Sandwich', 390, 28, 44, 12, 4, 200),
    m('Chick-fil-A Nuggets (8 pc)', 250, 27, 11, 11, 0, 113),
    m('Chick-fil-A Nuggets (12 pc)', 380, 40, 16, 17, 0, 170),
    m('Grilled Nuggets (8 pc)', 130, 25, 2, 3, 0, 105),
    m('Chick-n-Strips (3 pc)', 360, 32, 18, 18, 1, 130),
  ]),
  cat('Sides', [
    m('Waffle Potato Fries (Medium)', 420, 5, 45, 24, 5, 125),
    m('Mac & Cheese (Medium)', 450, 19, 30, 28, 1, 227),
    m('Side Salad', 160, 11, 8, 9, 2, 137),
    m('Fruit Cup (Medium)', 60, 1, 15, 0, 2, 156),
  ]),
  cat('Breakfast', [
    m('Chicken Biscuit', 460, 17, 45, 23, 2, 152),
    m('Egg White Grill', 290, 25, 30, 8, 1, 165),
    m('Hash Brown Scramble Bowl', 470, 26, 24, 30, 3, 248),
    m('Chick-fil-A Chicken Biscuit', 460, 17, 45, 23, 2, 152),
  ]),
  cat('Treats & Drinks', [
    m('Chocolate Chunk Cookie', 370, 4, 49, 17, 2, 90),
    m('Icedream Cone', 180, 4, 35, 4.5, 0, 113),
    m('Cookies & Cream Milkshake', 590, 13, 81, 23, 1, 397),
    m('Frosted Lemonade', 320, 7, 65, 4.5, 0, 397),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Popeyes
// ═══════════════════════════════════════════════════════════════════════════
const popeyes = R('gr-popeyes', 'Popeyes', '🍗', '#FF7E00', [
  cat('Chicken', [
    m('Classic Chicken Sandwich', 700, 28, 50, 42, 2, 240),
    m('Spicy Chicken Sandwich', 700, 28, 50, 42, 2, 240),
    m('Bonafide Chicken Breast (Mild)', 380, 35, 16, 20, 1, 156),
    m('Bonafide Chicken Thigh (Mild)', 280, 15, 9, 20, 0, 96),
    m('Chicken Tenders (3 pc)', 340, 23, 19, 19, 1, 130),
    m('Spicy Chicken Tenders (3 pc)', 360, 24, 21, 20, 1, 132),
  ]),
  cat('Sides', [
    m('Cajun Fries (Regular)', 280, 4, 36, 14, 4, 110),
    m('Red Beans & Rice (Regular)', 230, 7, 25, 11, 6, 150),
    m('Mashed Potatoes with Cajun Gravy', 120, 2, 18, 4, 1, 136),
    m('Mac & Cheese', 230, 7, 18, 14, 1, 120),
    m('Biscuit', 200, 3, 26, 9, 1, 60),
    m('Coleslaw', 200, 1, 14, 16, 3, 113),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Domino's
// ═══════════════════════════════════════════════════════════════════════════
const dominos = R('gr-dominos', "Domino's", '🍕', '#0078AE', [
  cat('Pizza (per slice, medium)', [
    m('Pepperoni Pizza', 210, 9, 24, 9, 1, 95),
    m('Cheese Pizza', 200, 8, 25, 8, 1, 92),
    m('Margherita Pizza', 190, 8, 24, 7, 1, 90),
    m('MeatZZa Pizza', 280, 13, 25, 15, 1, 116),
    m('ExtravaganZZa Pizza', 250, 11, 25, 12, 2, 122),
    m('Buffalo Chicken Pizza', 220, 11, 24, 9, 1, 105),
    m('Veggie Pizza', 200, 8, 25, 8, 2, 100),
  ]),
  cat('Sides', [
    m('Stuffed Cheesy Bread (1 pc)', 140, 5, 16, 6, 1, 47),
    m('Garlic Bread Twists (1 pc)', 130, 3, 16, 6, 1, 42),
    m('Boneless Chicken (4 pc)', 200, 13, 14, 10, 1, 100),
    m('Hot Buffalo Wings (4 pc)', 220, 21, 4, 14, 0, 120),
  ]),
  cat('Desserts & Drinks', [
    m('Chocolate Lava Crunch Cake', 350, 4, 47, 17, 2, 100),
    m('Cinnamon Bread Twists (1 pc)', 130, 3, 18, 6, 1, 42),
    m('Coca-Cola (500ml)', 210, 0, 58, 0, 0, 500),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Pizza Hut
// ═══════════════════════════════════════════════════════════════════════════
const pizzaHut = R('gr-pizza-hut', 'Pizza Hut', '🍕', '#EE3124', [
  cat('Pizza (per slice, medium)', [
    m('Pepperoni Pan Pizza', 250, 11, 26, 11, 1, 105),
    m('Cheese Pan Pizza', 240, 10, 27, 10, 1, 100),
    m('Meat Lover’s Pan Pizza', 320, 14, 26, 18, 1, 124),
    m('Supreme Pan Pizza', 290, 12, 27, 15, 2, 122),
    m('Veggie Lover’s Pan Pizza', 230, 9, 27, 9, 2, 108),
    m('BBQ Chicken Pizza (Thin)', 220, 11, 27, 7, 1, 100),
  ]),
  cat('Sides', [
    m('Breadsticks (1 stick)', 140, 4, 19, 5, 1, 43),
    m('Cheese Sticks (1 stick)', 150, 6, 16, 7, 1, 47),
    m('Traditional Wings (2 pc)', 160, 14, 1, 11, 0, 70),
    m('Boneless Wings (2 pc)', 160, 9, 11, 8, 0, 66),
  ]),
  cat('Desserts', [
    m('Hershey’s Cookie', 180, 3, 24, 8, 1, 50),
    m('Cinnamon Sticks (2 pc)', 150, 3, 24, 5, 1, 50),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Papa John's
// ═══════════════════════════════════════════════════════════════════════════
const papaJohns = R('gr-papa-johns', "Papa John's", '🍕', '#0F8B3D', [
  cat('Pizza (per slice, large)', [
    m('Pepperoni Pizza', 230, 9, 26, 10, 1, 102),
    m('Cheese Pizza', 210, 8, 27, 8, 1, 96),
    m('The Works Pizza', 230, 10, 27, 10, 2, 113),
    m('BBQ Chicken Bacon Pizza', 270, 12, 31, 10, 1, 120),
    m('Garden Fresh Pizza', 200, 8, 28, 7, 2, 110),
  ]),
  cat('Sides', [
    m('Garlic Knots (2 pc)', 160, 4, 21, 7, 1, 57),
    m('Cheesesticks (2 pc)', 180, 7, 20, 8, 1, 62),
    m('Chicken Poppers (4 pc)', 140, 10, 9, 7, 0, 70),
    m('Papadias (Philly Cheesesteak, half)', 290, 14, 27, 13, 1, 130),
  ]),
  cat('Desserts', [
    m('Chocolate Chip Cookie', 190, 2, 26, 9, 1, 57),
    m('Cinnamon Pull Aparts (2 pc)', 160, 2, 24, 6, 1, 50),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Dunkin'
// ═══════════════════════════════════════════════════════════════════════════
const dunkin = R('gr-dunkin', "Dunkin'", '🍩', '#FF6E0C', [
  cat('Coffee & Drinks', [
    m('Original Blend Hot Coffee (Medium)', 5, 0, 0, 0, 0, 414),
    m('Latte (Medium)', 120, 6, 12, 6, 0, 414),
    m('Iced Latte (Medium)', 90, 5, 8, 4.5, 0, 414),
    m('Caramel Iced Macchiato (Medium)', 200, 7, 35, 5, 0, 414),
    m('Frozen Coffee (Medium)', 460, 8, 86, 9, 0, 470),
    m('Vanilla Chai (Medium)', 270, 7, 51, 5, 0, 414),
  ]),
  cat('Donuts', [
    m('Glazed Donut', 240, 3, 33, 11, 1, 65),
    m('Chocolate Frosted Donut', 270, 3, 35, 13, 1, 70),
    m('Boston Kreme Donut', 300, 3, 40, 14, 1, 88),
    m('Jelly Donut', 280, 4, 38, 12, 1, 85),
    m('Old Fashioned Donut', 280, 3, 30, 17, 1, 67),
    m('Munchkins (5 pc)', 260, 3, 31, 14, 1, 80),
  ]),
  cat('Food', [
    m('Bacon, Egg & Cheese Wake-Up Wrap', 200, 8, 14, 12, 0, 75),
    m('Sausage, Egg & Cheese Sandwich', 600, 21, 41, 39, 2, 168),
    m('Bagel with Cream Cheese', 470, 14, 73, 13, 3, 156),
    m('Hash Browns', 130, 1, 14, 8, 2, 60),
    m('Stuffed Biscuit Bites (3 pc)', 280, 8, 25, 16, 1, 90),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Five Guys
// ═══════════════════════════════════════════════════════════════════════════
const fiveGuys = R('gr-five-guys', 'Five Guys', '🍔', '#ED174F', [
  cat('Burgers', [
    m('Hamburger', 700, 39, 39, 43, 2, 303),
    m('Cheeseburger', 840, 47, 40, 55, 2, 333),
    m('Bacon Cheeseburger', 920, 51, 40, 62, 2, 348),
    m('Little Hamburger', 480, 23, 39, 26, 2, 217),
    m('Little Cheeseburger', 550, 27, 40, 32, 2, 232),
  ]),
  cat('Dogs & Sandwiches', [
    m('Hot Dog', 545, 19, 40, 35, 2, 175),
    m('Cheese Dog', 615, 23, 41, 41, 2, 190),
    m('Bacon Cheese Dog', 695, 27, 41, 48, 2, 205),
    m('Grilled Cheese', 470, 16, 41, 26, 2, 152),
  ]),
  cat('Fries & Shakes', [
    m('Five Guys Fries (Regular)', 953, 15, 124, 41, 15, 411),
    m('Cajun Fries (Regular)', 953, 15, 124, 41, 15, 411),
    m('Little Fries', 526, 8, 69, 23, 8, 227),
    m('Vanilla Milkshake', 670, 15, 92, 27, 0, 350),
    m('Oreo Milkshake', 780, 16, 100, 36, 1, 380),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Shake Shack
// ═══════════════════════════════════════════════════════════════════════════
const shakeShack = R('gr-shake-shack', 'Shake Shack', '🍔', '#5BC2A8', [
  cat('Burgers', [
    m('ShackBurger (Single)', 530, 28, 27, 33, 1, 200),
    m('ShackBurger (Double)', 770, 47, 28, 50, 1, 280),
    m('SmokeShack (Single)', 590, 31, 28, 38, 1, 215),
    m('Hamburger (Single)', 430, 24, 26, 24, 1, 170),
    m('’Shroom Burger', 530, 17, 47, 31, 3, 200),
  ]),
  cat('Chicken', [
    m('Chicken Shack', 590, 30, 46, 31, 2, 220),
    m('Chick’n Bites (6 pc)', 360, 21, 25, 19, 1, 130),
    m('Hot Chick’n', 600, 30, 47, 32, 2, 225),
  ]),
  cat('Fries & Shakes', [
    m('Crinkle Cut Fries', 470, 6, 56, 25, 5, 140),
    m('Cheese Fries', 600, 13, 58, 36, 5, 200),
    m('Vanilla Shake', 580, 12, 75, 26, 0, 350),
    m('Chocolate Shake', 590, 12, 80, 25, 1, 350),
    m('Black & White Shake', 590, 12, 79, 26, 1, 350),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Panera Bread
// ═══════════════════════════════════════════════════════════════════════════
const panera = R('gr-panera', 'Panera Bread', '🥖', '#3F8E2C', [
  cat('Sandwiches', [
    m('Bacon Turkey Bravo (Whole)', 800, 44, 86, 30, 4, 380),
    m('Napa Almond Chicken Salad (Whole)', 640, 27, 76, 26, 5, 340),
    m('Chipotle Chicken Avocado Melt (Whole)', 950, 51, 86, 45, 6, 400),
    m('Smokehouse BBQ Chicken (Whole)', 730, 45, 88, 23, 4, 360),
    m('Mediterranean Veggie (Whole)', 580, 19, 96, 14, 9, 360),
  ]),
  cat('Soups & Bowls', [
    m('Broccoli Cheddar Soup (Cup)', 230, 9, 16, 14, 3, 227),
    m('Creamy Tomato Soup (Cup)', 240, 4, 26, 14, 3, 227),
    m('Chicken Noodle Soup (Cup)', 110, 8, 14, 2.5, 1, 227),
    m('Mac & Cheese (Small)', 480, 18, 38, 28, 1, 227),
    m('Baja Bowl with Chicken', 700, 39, 75, 28, 11, 480),
  ]),
  cat('Salads', [
    m('Caesar Salad with Chicken (Whole)', 470, 34, 19, 29, 4, 320),
    m('Greek Salad (Whole)', 380, 9, 18, 31, 6, 300),
    m('Green Goddess Cobb with Chicken (Whole)', 530, 39, 24, 32, 7, 360),
  ]),
  cat('Bakery', [
    m('Cinnamon Roll', 620, 11, 88, 24, 3, 170),
    m('Chocolate Chip Cookie', 410, 5, 56, 19, 2, 100),
    m('Bear Claw', 470, 9, 53, 24, 3, 120),
    m('Bagel with Cream Cheese', 390, 12, 60, 11, 2, 145),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Panda Express
// ═══════════════════════════════════════════════════════════════════════════
const pandaExpress = R('gr-panda-express', 'Panda Express', '🥡', '#D02B27', [
  cat('Entrées', [
    m('Orange Chicken', 490, 25, 51, 23, 2, 165),
    m('Beijing Beef', 470, 14, 46, 26, 2, 165),
    m('Broccoli Beef', 150, 9, 13, 7, 2, 165),
    m('Kung Pao Chicken', 290, 16, 14, 19, 3, 165),
    m('Honey Walnut Shrimp', 360, 13, 35, 19, 2, 110),
    m('Mushroom Chicken', 220, 13, 11, 14, 1, 165),
    m('Grilled Teriyaki Chicken', 300, 33, 8, 13, 0, 145),
    m('SweetFire Chicken Breast', 380, 13, 47, 16, 1, 165),
  ]),
  cat('Sides', [
    m('Chow Mein', 510, 13, 80, 20, 6, 270),
    m('Fried Rice', 520, 11, 85, 16, 5, 290),
    m('White Steamed Rice', 380, 7, 87, 0, 0, 250),
    m('Super Greens', 90, 6, 10, 3, 5, 195),
    m('Chicken Egg Roll (1 pc)', 200, 6, 20, 10, 2, 75),
    m('Cream Cheese Rangoon (3 pc)', 190, 5, 24, 8, 1, 70),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Wingstop
// ═══════════════════════════════════════════════════════════════════════════
const wingstop = R('gr-wingstop', 'Wingstop', '🍗', '#00543D', [
  cat('Wings', [
    m('Classic Wings (5 pc, Original Hot)', 470, 39, 5, 32, 1, 165),
    m('Boneless Wings (5 pc, Lemon Pepper)', 380, 22, 27, 20, 1, 150),
    m('Boneless Wings (5 pc, Garlic Parmesan)', 420, 23, 28, 24, 1, 150),
    m('Classic Wings (5 pc, Mango Habanero)', 500, 39, 12, 32, 1, 170),
    m('Classic Wings (5 pc, Louisiana Rub)', 450, 39, 2, 31, 1, 160),
  ]),
  cat('Tenders & Sides', [
    m('Chicken Tenders (3 pc)', 330, 30, 16, 16, 1, 150),
    m('Cajun Fried Corn', 230, 5, 28, 12, 3, 140),
    m('Seasoned Fries (Regular)', 410, 5, 50, 21, 5, 130),
    m('Cheese Fries', 630, 13, 56, 39, 5, 200),
    m('Coleslaw', 150, 1, 16, 9, 2, 110),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// In-N-Out
// ═══════════════════════════════════════════════════════════════════════════
const innOut = R('gr-in-n-out', 'In-N-Out', '🍔', '#E2231A', [
  cat('Burgers', [
    m('Hamburger', 390, 16, 39, 19, 3, 243),
    m('Cheeseburger', 480, 22, 39, 27, 3, 268),
    m('Double-Double', 670, 37, 39, 41, 3, 330),
    m('Hamburger (Protein Style)', 240, 13, 11, 17, 3, 300),
    m('Cheeseburger (Protein Style)', 330, 18, 11, 25, 3, 325),
  ]),
  cat('Fries & Shakes', [
    m('French Fries', 395, 7, 54, 18, 2, 125),
    m('Vanilla Shake', 590, 9, 78, 29, 0, 425),
    m('Chocolate Shake', 590, 9, 83, 29, 0, 425),
    m('Strawberry Shake', 590, 8, 87, 27, 0, 425),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Dairy Queen
// ═══════════════════════════════════════════════════════════════════════════
const dairyQueen = R('gr-dairy-queen', 'Dairy Queen', '🍦', '#E01A22', [
  cat('Blizzards', [
    m('Oreo Blizzard (Medium)', 780, 14, 102, 35, 1, 411),
    m('Choco Brownie Extreme Blizzard (Medium)', 940, 16, 124, 43, 2, 411),
    m('Reese’s Blizzard (Medium)', 800, 18, 95, 39, 2, 411),
    m('Chocolate Chip Cookie Dough Blizzard (Medium)', 990, 16, 137, 42, 1, 411),
  ]),
  cat('Cones & Sundaes', [
    m('Vanilla Cone (Medium)', 340, 8, 53, 11, 0, 213),
    m('Chocolate Dipped Cone (Medium)', 470, 8, 56, 24, 1, 220),
    m('Hot Fudge Sundae (Medium)', 440, 8, 70, 14, 1, 234),
    m('Banana Split', 510, 9, 96, 12, 3, 369),
  ]),
  cat('Food', [
    m('1/4 lb GrillBurger with Cheese', 600, 30, 42, 33, 3, 245),
    m('Chicken Strip Basket (4 pc)', 1010, 35, 102, 50, 6, 425),
    m('Chili Cheese Dog', 380, 15, 28, 23, 2, 152),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Arby's
// ═══════════════════════════════════════════════════════════════════════════
const arbys = R('gr-arbys', "Arby's", '🥪', '#E31837', [
  cat('Sandwiches', [
    m('Classic Roast Beef', 360, 23, 37, 14, 2, 154),
    m('Beef ’n Cheddar (Classic)', 450, 23, 45, 20, 2, 195),
    m('Double Roast Beef', 500, 36, 38, 24, 2, 210),
    m('Smokehouse Brisket', 600, 36, 48, 30, 3, 280),
    m('Crispy Chicken Sandwich', 530, 25, 53, 25, 3, 218),
    m('Classic French Dip & Swiss', 490, 30, 52, 17, 3, 280),
  ]),
  cat('Sides', [
    m('Curly Fries (Medium)', 550, 6, 67, 28, 6, 142),
    m('Crinkle Fries (Medium)', 420, 5, 55, 20, 5, 140),
    m('Mozzarella Sticks (4 pc)', 510, 22, 42, 28, 2, 150),
    m('Loaded Curly Fries', 640, 16, 72, 33, 6, 220),
    m('Jalapeño Bites (5 pc)', 310, 5, 33, 18, 2, 110),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Nando's
// ═══════════════════════════════════════════════════════════════════════════
const nandos = R('gr-nandos', "Nando's", '🐔', '#DA291C', [
  cat('PERi-PERi Chicken', [
    m('1/4 Chicken (Breast)', 280, 44, 1, 11, 0, 180),
    m('1/4 Chicken (Leg)', 290, 33, 1, 17, 0, 175),
    m('1/2 Chicken', 575, 77, 2, 28, 0, 360),
    m('Boneless Chicken Breast', 215, 41, 1, 5, 0, 150),
    m('Chicken Butterfly', 415, 78, 2, 11, 0, 280),
  ]),
  cat('Wraps, Burgers & Pitas', [
    m('Chicken Breast Burger', 530, 45, 50, 16, 4, 260),
    m('Chicken Wrap', 510, 40, 52, 15, 4, 250),
    m('Chicken Pitta', 450, 39, 45, 12, 4, 230),
    m('Sunset Burger', 600, 48, 52, 22, 5, 290),
  ]),
  cat('Sides', [
    m('PERi-PERi Chips (Regular)', 400, 6, 55, 17, 5, 150),
    m('Spicy Rice', 290, 6, 54, 5, 2, 200),
    m('Garlic Bread', 330, 8, 42, 14, 3, 110),
    m('Macho Peas', 130, 8, 17, 3, 7, 150),
    m('Corn on the Cob', 130, 4, 22, 4, 3, 130),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Greggs (UK)
// ═══════════════════════════════════════════════════════════════════════════
const greggs = R('gr-greggs', 'Greggs', '🥐', '#00539F', [
  cat('Savoury Bakes', [
    m('Sausage Roll', 329, 9, 25, 22, 1, 100),
    m('Vegan Sausage Roll', 311, 12, 24, 19, 3, 100),
    m('Steak Bake', 408, 11, 30, 27, 1, 138),
    m('Chicken Bake', 463, 14, 32, 30, 1, 153),
    m('Cheese & Onion Bake', 419, 9, 33, 27, 2, 130),
    m('Festive Bake', 446, 14, 35, 28, 2, 153),
  ]),
  cat('Sandwiches & Wraps', [
    m('Chicken Club Baguette', 488, 28, 47, 21, 3, 215),
    m('Ham & Cheese Baguette', 449, 23, 48, 18, 3, 200),
    m('Tuna Crunch Baguette', 416, 21, 49, 15, 3, 200),
    m('Mexican Chicken Wrap', 360, 21, 38, 14, 4, 180),
  ]),
  cat('Sweet Treats & Drinks', [
    m('Glazed Ring Doughnut', 199, 3, 26, 9, 1, 56),
    m('Yum Yum', 281, 4, 31, 16, 1, 70),
    m('Belgian Bun', 350, 6, 56, 11, 2, 110),
    m('Latte (Regular)', 130, 7, 13, 6, 0, 350),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Pret a Manger (UK / global)
// ═══════════════════════════════════════════════════════════════════════════
const pret = R('gr-pret', 'Pret a Manger', '🥗', '#862633', [
  cat('Sandwiches & Baguettes', [
    m('Chicken & Avocado Sandwich', 449, 27, 33, 23, 5, 220),
    m('Tuna Mayo Baguette', 521, 26, 56, 21, 4, 230),
    m('Ham & Greve Cheese Baguette', 528, 27, 52, 24, 3, 225),
    m('Egg Mayo & Spinach Sandwich', 400, 18, 32, 22, 4, 200),
    m('Falafel & Houmous Wrap', 466, 13, 54, 22, 8, 230),
  ]),
  cat('Salads & Soups', [
    m('Chicken Caesar & Bacon Salad', 425, 32, 12, 28, 3, 280),
    m('Superfood Salad', 350, 11, 38, 17, 9, 290),
    m('Chicken Noodle Soup', 180, 14, 22, 4, 2, 300),
    m('Tomato & Red Pepper Soup', 160, 4, 22, 6, 4, 300),
  ]),
  cat('Coffee & Treats', [
    m('Cappuccino (Regular)', 130, 8, 11, 7, 0, 350),
    m('Flat White', 150, 9, 11, 8, 0, 240),
    m('Almond Croissant', 460, 10, 44, 27, 4, 110),
    m('Chocolate Chunk Cookie', 290, 4, 36, 15, 2, 70),
    m('Pain au Chocolat', 290, 6, 30, 16, 2, 75),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Costa Coffee (UK / global)
// ═══════════════════════════════════════════════════════════════════════════
const costa = R('gr-costa', 'Costa Coffee', '☕', '#6E1E3C', [
  cat('Hot Drinks', [
    m('Latte (Medium)', 184, 10, 18, 7, 0, 360),
    m('Cappuccino (Medium)', 130, 8, 13, 5, 0, 360),
    m('Flat White (Primo)', 169, 11, 13, 8, 0, 240),
    m('Caramel Latte (Medium)', 268, 10, 38, 8, 0, 360),
    m('Hot Chocolate (Medium)', 359, 13, 45, 14, 3, 360),
    m('Mocha (Medium)', 290, 11, 36, 11, 2, 360),
  ]),
  cat('Cold Drinks', [
    m('Iced Latte (Medium)', 96, 6, 11, 3, 0, 360),
    m('Frostino Coffee (Medium)', 312, 7, 49, 9, 0, 400),
    m('Iced Caramel Latte (Medium)', 188, 6, 32, 4, 0, 360),
  ]),
  cat('Food', [
    m('Ham & Cheese Toastie', 380, 21, 36, 17, 2, 170),
    m('All Day Breakfast Wrap', 470, 20, 44, 24, 3, 200),
    m('Belgian Chocolate Twist', 350, 5, 40, 18, 2, 90),
    m('Chocolate Chunk Muffin', 460, 6, 58, 23, 2, 110),
    m('Fruit Toast', 230, 5, 42, 4, 3, 90),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Tim Hortons
// ═══════════════════════════════════════════════════════════════════════════
const timHortons = R('gr-tim-hortons', 'Tim Hortons', '☕', '#C8102E', [
  cat('Coffee & Drinks', [
    m('Original Blend Coffee (Medium)', 5, 0, 1, 0, 0, 414),
    m('Double Double (Medium)', 230, 5, 28, 11, 0, 414),
    m('Latte (Medium)', 180, 10, 17, 8, 0, 414),
    m('French Vanilla (Medium)', 320, 4, 52, 11, 0, 414),
    m('Iced Capp (Medium)', 350, 5, 53, 14, 0, 470),
  ]),
  cat('Donuts & Timbits', [
    m('Boston Cream Donut', 260, 4, 36, 11, 1, 76),
    m('Apple Fritter', 300, 4, 49, 11, 1, 95),
    m('Chocolate Dip Donut', 230, 4, 33, 9, 1, 70),
    m('Honey Cruller', 290, 2, 33, 18, 0, 75),
    m('Timbits (10 pc, assorted)', 600, 8, 90, 24, 2, 200),
  ]),
  cat('Food', [
    m('Bacon, Egg & Cheese Biscuit', 450, 17, 35, 27, 1, 150),
    m('Sausage Farmer’s Wrap', 470, 16, 38, 28, 2, 165),
    m('Chicken Bacon Ranch Wrap', 410, 22, 41, 18, 2, 200),
    m('Bagel B.E.L.T.', 460, 21, 49, 20, 2, 190),
    m('Chili (Small)', 250, 18, 22, 9, 5, 250),
  ]),
])

// ═══════════════════════════════════════════════════════════════════════════
// Exported list — order roughly by global familiarity
// ═══════════════════════════════════════════════════════════════════════════
export const globalRestaurants: Restaurant[] = [
  mcdonalds,
  burgerKing,
  kfc,
  subway,
  starbucks,
  wendys,
  tacoBell,
  chipotle,
  chickFilA,
  popeyes,
  dominos,
  pizzaHut,
  papaJohns,
  dunkin,
  fiveGuys,
  shakeShack,
  panera,
  pandaExpress,
  wingstop,
  innOut,
  dairyQueen,
  arbys,
  nandos,
  greggs,
  pret,
  costa,
  timHortons,
]
