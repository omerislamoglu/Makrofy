/**
 * Mega global expansion — additional world-cuisine dishes and international
 * market/brand products for non-Turkish locales. Appended to GLOBAL_CATALOG.
 *
 * All macro values are PER 100 g (or per 100 ml for liquids), consistent with
 * the rest of the catalog. `amount` is a typical single-serving size.
 */

import { food, S } from './catalog/helpers'
import type { FoodCatalogCategory, FoodCatalogItem } from '../types/food'

interface RowOpts {
  ml?: boolean
  brand?: string
  label?: string
  aliases?: string[]
}

type Row = [
  id: string,
  name: string,
  cat: FoodCatalogCategory,
  sub: string,
  cal: number,
  p: number,
  c: number,
  f: number,
  fib: number,
  amount: number,
  opts?: RowOpts,
]

function build(rows: Row[]): FoodCatalogItem[] {
  return rows.map(([id, name, cat, sub, cal, p, c, f, fib, amount, opts]) => {
    const o = opts ?? {}
    const servings = o.ml
      ? [S.custom(o.label ?? '1 serving', 'ml', undefined, amount), S.ml100]
      : [S.custom(o.label ?? '1 serving', 'porsiyon', amount), S.g100]
    return food({ id, name, brand: o.brand, cat, sub, cal, p, c, f, fib, servings, aliases: o.aliases })
  })
}

const rows: Row[] = [
  // ── Indian ──────────────────────────────────────────────────────────────
  ['gx-butter-chicken', 'Butter Chicken', 'Dünya Mutfağı', 'Indian', 160, 12, 6, 10, 1, 300, { aliases: ['murgh makhani'] }],
  ['gx-chicken-tikka-masala', 'Chicken Tikka Masala', 'Dünya Mutfağı', 'Indian', 155, 11, 7, 9, 1, 300, { aliases: ['tikka masala'] }],
  ['gx-palak-paneer', 'Palak Paneer', 'Dünya Mutfağı', 'Indian', 145, 7, 7, 10, 2, 250, { aliases: ['spinach paneer'] }],
  ['gx-chana-masala', 'Chana Masala', 'Dünya Mutfağı', 'Indian', 120, 6, 18, 3, 5, 250, { aliases: ['chickpea curry'] }],
  ['gx-dal-tadka', 'Dal Tadka', 'Dünya Mutfağı', 'Indian', 115, 6, 16, 3, 4, 250, { aliases: ['lentil dal', 'yellow dal'] }],
  ['gx-lamb-rogan-josh', 'Lamb Rogan Josh', 'Dünya Mutfağı', 'Indian', 165, 14, 5, 10, 1, 280, { aliases: ['rogan josh'] }],
  ['gx-chicken-biryani', 'Chicken Biryani', 'Dünya Mutfağı', 'Indian', 175, 9, 22, 6, 1, 350, { aliases: ['biryani'] }],
  ['gx-vegetable-samosa', 'Vegetable Samosa', 'Dünya Mutfağı', 'Indian', 260, 5, 32, 13, 3, 60, { aliases: ['samosa'] }],
  ['gx-onion-bhaji', 'Onion Bhaji', 'Dünya Mutfağı', 'Indian', 290, 5, 28, 18, 3, 60, { aliases: ['bhaji', 'pakora'] }],
  ['gx-naan', 'Naan Bread', 'Ekmek & Unlu Mamuller', 'Indian', 310, 9, 50, 8, 2, 90, { aliases: ['naan'] }],
  ['gx-garlic-naan', 'Garlic Naan', 'Ekmek & Unlu Mamuller', 'Indian', 320, 9, 49, 9, 2, 95, { aliases: ['garlic bread naan'] }],
  ['gx-tandoori-chicken', 'Tandoori Chicken', 'Et & Tavuk', 'Indian', 150, 25, 2, 5, 0, 200, { aliases: ['tandoori'] }],
  ['gx-aloo-gobi', 'Aloo Gobi', 'Dünya Mutfağı', 'Indian', 100, 3, 13, 5, 3, 250, { aliases: ['potato cauliflower curry'] }],
  ['gx-paneer-tikka', 'Paneer Tikka', 'Dünya Mutfağı', 'Indian', 200, 12, 6, 14, 1, 200, { aliases: ['grilled paneer'] }],
  ['gx-mango-lassi', 'Mango Lassi', 'İçecek', 'Indian', 90, 3, 16, 2, 0.3, 300, { ml: true, label: '1 glass', aliases: ['lassi'] }],
  ['gx-vegetable-korma', 'Vegetable Korma', 'Dünya Mutfağı', 'Indian', 140, 4, 12, 9, 3, 250, { aliases: ['korma'] }],
  ['gx-saag-aloo', 'Saag Aloo', 'Dünya Mutfağı', 'Indian', 110, 3, 13, 5, 3, 220, { aliases: ['spinach potato'] }],

  // ── Mexican / Latin ──────────────────────────────────────────────────────
  ['gx-chicken-fajitas', 'Chicken Fajitas', 'Dünya Mutfağı', 'Mexican', 150, 14, 9, 6, 2, 280, { aliases: ['fajitas'] }],
  ['gx-carnitas', 'Pork Carnitas', 'Dünya Mutfağı', 'Mexican', 200, 22, 1, 12, 0, 150, { aliases: ['carnitas'] }],
  ['gx-al-pastor', 'Al Pastor', 'Dünya Mutfağı', 'Mexican', 190, 18, 4, 11, 0.5, 150, { aliases: ['tacos al pastor'] }],
  ['gx-carne-asada', 'Carne Asada', 'Dünya Mutfağı', 'Mexican', 215, 26, 2, 11, 0, 180, { aliases: ['grilled steak'] }],
  ['gx-elote', 'Elote (Mexican Street Corn)', 'Sebze', 'Mexican', 170, 4, 22, 8, 3, 150, { aliases: ['street corn', 'elote'] }],
  ['gx-refried-beans', 'Refried Beans', 'Bakliyat', 'Mexican', 90, 5, 14, 1.5, 5, 130, { aliases: ['frijoles refritos'] }],
  ['gx-tamale', 'Tamale', 'Dünya Mutfağı', 'Mexican', 220, 6, 26, 10, 3, 120, { aliases: ['tamales'] }],
  ['gx-pozole', 'Pozole', 'Dünya Mutfağı', 'Mexican', 75, 6, 8, 2.5, 2, 350, { aliases: ['posole'] }],
  ['gx-huevos-rancheros', 'Huevos Rancheros', 'Kahvaltı', 'Mexican', 160, 8, 14, 8, 2, 250, { aliases: ['ranch eggs'] }],
  ['gx-churros', 'Churros', 'Tatlı & Çikolata', 'Mexican', 350, 4, 45, 18, 1, 80, { aliases: ['churro'] }],
  ['gx-horchata', 'Horchata', 'İçecek', 'Mexican', 75, 0.5, 15, 1.5, 0.2, 300, { ml: true, label: '1 glass', aliases: ['rice milk drink'] }],
  ['gx-tostada', 'Tostada', 'Dünya Mutfağı', 'Mexican', 200, 9, 22, 9, 4, 130, { aliases: ['tostadas'] }],
  ['gx-empanada-chicken', 'Chicken Empanada', 'Dünya Mutfağı', 'Latin', 270, 11, 27, 13, 2, 120, { aliases: ['empanadas'] }],
  ['gx-ceviche', 'Ceviche', 'Balık & Deniz Ürünleri', 'Latin', 95, 14, 6, 1.5, 0.5, 200, { aliases: ['fish ceviche'] }],
  ['gx-pupusa', 'Pupusa', 'Dünya Mutfağı', 'Latin', 230, 7, 30, 9, 3, 120, { aliases: ['pupusas'] }],

  // ── Japanese ─────────────────────────────────────────────────────────────
  ['gx-chicken-katsu', 'Chicken Katsu', 'Sushi & Asya Mutfağı', 'Japanese', 240, 17, 16, 12, 1, 200, { aliases: ['katsu', 'tonkatsu chicken'] }],
  ['gx-katsu-curry', 'Katsu Curry', 'Sushi & Asya Mutfağı', 'Japanese', 160, 8, 18, 6, 2, 400, { aliases: ['japanese curry'] }],
  ['gx-tonkatsu', 'Tonkatsu (Pork Cutlet)', 'Sushi & Asya Mutfağı', 'Japanese', 270, 18, 14, 16, 1, 180, { aliases: ['pork katsu'] }],
  ['gx-gyudon', 'Gyudon (Beef Bowl)', 'Sushi & Asya Mutfağı', 'Japanese', 150, 8, 18, 5, 1, 400, { aliases: ['beef rice bowl'] }],
  ['gx-chicken-teriyaki-don', 'Chicken Teriyaki Don', 'Sushi & Asya Mutfağı', 'Japanese', 160, 11, 20, 4, 1, 400, { aliases: ['teriyaki bowl'] }],
  ['gx-ramen-tonkotsu', 'Tonkotsu Ramen', 'Sushi & Asya Mutfağı', 'Japanese', 90, 5, 11, 3, 1, 500, { aliases: ['ramen', 'pork ramen'] }],
  ['gx-shoyu-ramen', 'Shoyu Ramen', 'Sushi & Asya Mutfağı', 'Japanese', 75, 4, 11, 2, 1, 500, { aliases: ['soy ramen'] }],
  ['gx-udon-soup', 'Udon Noodle Soup', 'Sushi & Asya Mutfağı', 'Japanese', 70, 3, 13, 0.8, 1, 450, { aliases: ['udon'] }],
  ['gx-soba-noodles', 'Soba Noodles', 'Sushi & Asya Mutfağı', 'Japanese', 99, 5, 21, 0.1, 1.5, 200, { aliases: ['buckwheat noodles'] }],
  ['gx-shrimp-tempura', 'Shrimp Tempura', 'Sushi & Asya Mutfağı', 'Japanese', 230, 13, 18, 12, 1, 150, { aliases: ['tempura shrimp'] }],
  ['gx-onigiri', 'Onigiri (Rice Ball)', 'Sushi & Asya Mutfağı', 'Japanese', 160, 3, 34, 1, 0.5, 110, { aliases: ['rice ball'] }],
  ['gx-yakitori', 'Yakitori (Chicken Skewer)', 'Sushi & Asya Mutfağı', 'Japanese', 170, 20, 5, 8, 0, 90, { aliases: ['chicken skewer'] }],
  ['gx-takoyaki', 'Takoyaki', 'Sushi & Asya Mutfağı', 'Japanese', 180, 7, 20, 8, 1, 150, { aliases: ['octopus balls'] }],
  ['gx-sashimi-salmon', 'Salmon Sashimi', 'Sushi & Asya Mutfağı', 'Japanese', 180, 20, 0, 11, 0, 90, { aliases: ['sashimi'] }],
  ['gx-dragon-roll', 'Dragon Roll', 'Sushi & Asya Mutfağı', 'Sushi', 175, 6, 26, 5, 1.5, 200, { aliases: ['eel avocado roll'] }],
  ['gx-spicy-tuna-roll', 'Spicy Tuna Roll', 'Sushi & Asya Mutfağı', 'Sushi', 155, 7, 24, 3.5, 1, 180, { aliases: ['tuna roll'] }],
  ['gx-mochi', 'Mochi Ice Cream', 'Tatlı & Çikolata', 'Japanese', 250, 3, 45, 6, 1, 40, { aliases: ['mochi'] }],

  // ── Chinese ──────────────────────────────────────────────────────────────
  ['gx-sweet-sour-chicken', 'Sweet and Sour Chicken', 'Sushi & Asya Mutfağı', 'Chinese', 200, 10, 24, 8, 1, 250, { aliases: ['sweet sour chicken'] }],
  ['gx-general-tso', 'General Tso’s Chicken', 'Sushi & Asya Mutfağı', 'Chinese', 250, 12, 26, 11, 1, 250, { aliases: ['general tso chicken'] }],
  ['gx-beef-lo-mein', 'Beef Lo Mein', 'Sushi & Asya Mutfağı', 'Chinese', 160, 8, 20, 6, 2, 350, { aliases: ['lo mein'] }],
  ['gx-veg-fried-rice', 'Vegetable Fried Rice', 'Sushi & Asya Mutfağı', 'Chinese', 165, 4, 28, 4, 1.5, 250, { aliases: ['fried rice'] }],
  ['gx-wonton-soup', 'Wonton Soup', 'Sushi & Asya Mutfağı', 'Chinese', 50, 3, 6, 1.5, 0.5, 350, { aliases: ['wonton'] }],
  ['gx-hot-sour-soup', 'Hot and Sour Soup', 'Sushi & Asya Mutfağı', 'Chinese', 45, 3, 5, 1.5, 0.8, 350, { aliases: ['hot sour soup'] }],
  ['gx-char-siu', 'Char Siu (BBQ Pork)', 'Et & Tavuk', 'Chinese', 230, 21, 11, 11, 0, 150, { aliases: ['bbq pork', 'chinese bbq pork'] }],
  ['gx-mapo-tofu', 'Mapo Tofu', 'Sushi & Asya Mutfağı', 'Chinese', 130, 9, 6, 8, 1, 250, { aliases: ['mapo'] }],
  ['gx-shumai', 'Shumai (Pork Dumplings)', 'Sushi & Asya Mutfağı', 'Dim Sum', 200, 11, 18, 9, 1, 120, { aliases: ['siu mai', 'dim sum'] }],
  ['gx-peking-duck', 'Peking Duck', 'Et & Tavuk', 'Chinese', 240, 19, 5, 16, 0, 150, { aliases: ['roast duck'] }],
  ['gx-kung-pao-chicken', 'Kung Pao Chicken', 'Sushi & Asya Mutfağı', 'Chinese', 175, 13, 8, 10, 1.5, 250, { aliases: ['kung pao'] }],
  ['gx-orange-chicken', 'Orange Chicken', 'Sushi & Asya Mutfağı', 'Chinese', 250, 11, 28, 11, 1, 200, { aliases: ['orange chicken'] }],

  // ── Korean ───────────────────────────────────────────────────────────────
  ['gx-japchae', 'Japchae', 'Sushi & Asya Mutfağı', 'Korean', 150, 4, 24, 4, 1.5, 250, { aliases: ['glass noodles'] }],
  ['gx-tteokbokki', 'Tteokbokki', 'Sushi & Asya Mutfağı', 'Korean', 180, 4, 38, 2, 1, 250, { aliases: ['spicy rice cakes'] }],
  ['gx-korean-fried-chicken', 'Korean Fried Chicken', 'Sushi & Asya Mutfağı', 'Korean', 290, 18, 20, 16, 1, 200, { aliases: ['kfc korean', 'yangnyeom'] }],
  ['gx-kimbap', 'Kimbap', 'Sushi & Asya Mutfağı', 'Korean', 150, 4, 28, 3, 1.5, 200, { aliases: ['gimbap', 'korean roll'] }],
  ['gx-galbi', 'Galbi (Short Ribs)', 'Et & Tavuk', 'Korean', 250, 18, 8, 16, 0.5, 180, { aliases: ['kalbi', 'short ribs'] }],
  ['gx-sundubu', 'Sundubu Jjigae', 'Sushi & Asya Mutfağı', 'Korean', 65, 5, 4, 3.5, 1, 400, { aliases: ['soft tofu stew'] }],

  // ── Thai ─────────────────────────────────────────────────────────────────
  ['gx-massaman-curry', 'Massaman Curry', 'Sushi & Asya Mutfağı', 'Thai', 165, 8, 12, 10, 2, 300, { aliases: ['massaman'] }],
  ['gx-tom-yum', 'Tom Yum Soup', 'Sushi & Asya Mutfağı', 'Thai', 45, 4, 4, 1.5, 0.8, 350, { aliases: ['tom yum'] }],
  ['gx-tom-kha-gai', 'Tom Kha Gai', 'Sushi & Asya Mutfağı', 'Thai', 90, 5, 5, 6, 1, 350, { aliases: ['coconut chicken soup'] }],
  ['gx-mango-sticky-rice', 'Mango Sticky Rice', 'Tatlı & Çikolata', 'Thai', 200, 3, 38, 5, 1.5, 200, { aliases: ['sticky rice mango'] }],
  ['gx-pad-see-ew', 'Pad See Ew', 'Sushi & Asya Mutfağı', 'Thai', 175, 7, 25, 5, 1.5, 350, { aliases: ['pad see ew'] }],
  ['gx-drunken-noodles', 'Drunken Noodles', 'Sushi & Asya Mutfağı', 'Thai', 170, 8, 24, 5, 2, 350, { aliases: ['pad kee mao'] }],

  // ── Vietnamese ───────────────────────────────────────────────────────────
  ['gx-bun-cha', 'Bun Cha', 'Sushi & Asya Mutfağı', 'Vietnamese', 130, 9, 14, 4, 1, 350, { aliases: ['grilled pork noodles'] }],
  ['gx-pho-ga', 'Pho Ga (Chicken Pho)', 'Sushi & Asya Mutfağı', 'Vietnamese', 60, 5, 8, 1, 0.5, 500, { aliases: ['chicken pho'] }],
  ['gx-vietnamese-coffee', 'Vietnamese Iced Coffee', 'Kahve', 'Vietnamese', 80, 1.5, 14, 2, 0, 200, { ml: true, label: '1 glass', aliases: ['ca phe sua da'] }],

  // ── Middle Eastern / Mediterranean ───────────────────────────────────────
  ['gx-hummus', 'Hummus', 'Soslar', 'Middle Eastern', 175, 5, 16, 10, 5, 60, { aliases: ['houmous', 'chickpea dip'] }],
  ['gx-baba-ganoush', 'Baba Ganoush', 'Soslar', 'Middle Eastern', 130, 3, 9, 9, 4, 60, { aliases: ['eggplant dip'] }],
  ['gx-tabbouleh', 'Tabbouleh', 'Dünya Mutfağı', 'Middle Eastern', 120, 3, 16, 6, 3, 150, { aliases: ['tabouli'] }],
  ['gx-fattoush', 'Fattoush Salad', 'Dünya Mutfağı', 'Middle Eastern', 90, 2, 11, 5, 2.5, 200, { aliases: ['fattoush'] }],
  ['gx-shakshuka', 'Shakshuka', 'Kahvaltı', 'Middle Eastern', 100, 6, 7, 6, 1.5, 250, { aliases: ['eggs in tomato sauce'] }],
  ['gx-chicken-kebab', 'Chicken Kebab', 'Et & Tavuk', 'Middle Eastern', 175, 24, 3, 7, 0.5, 200, { aliases: ['shish kebab', 'chicken skewer'] }],
  ['gx-lamb-kofta', 'Lamb Kofta', 'Et & Tavuk', 'Middle Eastern', 240, 17, 4, 17, 0.5, 150, { aliases: ['kofta', 'kefta'] }],
  ['gx-tzatziki', 'Tzatziki', 'Soslar', 'Greek', 80, 3, 5, 5, 0.3, 60, { aliases: ['cucumber yogurt dip'] }],
  ['gx-dolma', 'Dolma (Stuffed Grape Leaves)', 'Dünya Mutfağı', 'Mediterranean', 150, 3, 18, 8, 3, 120, { aliases: ['stuffed vine leaves'] }],
  ['gx-labneh', 'Labneh', 'Süt Ürünleri', 'Middle Eastern', 150, 6, 5, 12, 0, 60, { aliases: ['strained yogurt cheese'] }],
  ['gx-mujadara', 'Mujadara', 'Bakliyat', 'Middle Eastern', 150, 6, 24, 4, 5, 250, { aliases: ['lentils and rice'] }],
  ['gx-pita-bread', 'Pita Bread', 'Ekmek & Unlu Mamuller', 'Mediterranean', 275, 9, 55, 1.2, 2, 60, { aliases: ['pita', 'flatbread'] }],
  ['gx-manakish', 'Manakish (Zaatar)', 'Ekmek & Unlu Mamuller', 'Middle Eastern', 290, 8, 38, 12, 2, 120, { aliases: ['zaatar flatbread'] }],

  // ── Italian ──────────────────────────────────────────────────────────────
  ['gx-spaghetti-bolognese', 'Spaghetti Bolognese', 'Dünya Mutfağı', 'Italian', 150, 8, 18, 5, 1.5, 350, { aliases: ['spag bol', 'bolognese'] }],
  ['gx-fettuccine-alfredo', 'Fettuccine Alfredo', 'Dünya Mutfağı', 'Italian', 215, 7, 24, 10, 1, 300, { aliases: ['alfredo pasta'] }],
  ['gx-penne-arrabbiata', 'Penne Arrabbiata', 'Dünya Mutfağı', 'Italian', 155, 5, 27, 3, 2, 300, { aliases: ['arrabbiata'] }],
  ['gx-mushroom-risotto', 'Mushroom Risotto', 'Dünya Mutfağı', 'Italian', 150, 4, 22, 5, 1, 300, { aliases: ['risotto'] }],
  ['gx-ravioli-cheese', 'Cheese Ravioli', 'Dünya Mutfağı', 'Italian', 180, 8, 24, 6, 1.5, 250, { aliases: ['ravioli'] }],
  ['gx-tortellini', 'Tortellini', 'Dünya Mutfağı', 'Italian', 190, 8, 26, 6, 1.5, 250, { aliases: ['cheese tortellini'] }],
  ['gx-tiramisu', 'Tiramisu', 'Tatlı & Çikolata', 'Italian', 290, 5, 30, 17, 0.5, 120, { aliases: ['tiramisu'] }],
  ['gx-bruschetta', 'Bruschetta', 'Atıştırmalık', 'Italian', 190, 5, 26, 7, 2, 100, { aliases: ['tomato bruschetta'] }],
  ['gx-eggplant-parmesan', 'Eggplant Parmesan', 'Dünya Mutfağı', 'Italian', 160, 6, 14, 9, 3, 250, { aliases: ['melanzane parmigiana'] }],
  ['gx-focaccia', 'Focaccia', 'Ekmek & Unlu Mamuller', 'Italian', 290, 7, 42, 10, 2, 90, { aliases: ['focaccia bread'] }],
  ['gx-calzone', 'Calzone', 'Fast Food', 'Italian', 270, 12, 30, 11, 2, 250, { aliases: ['calzone'] }],
  ['gx-cacio-e-pepe', 'Cacio e Pepe', 'Dünya Mutfağı', 'Italian', 200, 8, 26, 7, 1, 300, { aliases: ['cheese pepper pasta'] }],
  ['gx-gelato', 'Gelato', 'Tatlı & Çikolata', 'Italian', 215, 5, 30, 9, 0.5, 100, { aliases: ['italian ice cream'] }],

  // ── British / European comfort ───────────────────────────────────────────
  ['gx-bangers-mash', 'Bangers and Mash', 'Ana Yemek', 'British', 160, 7, 14, 9, 1.5, 350, { aliases: ['sausage and mash'] }],
  ['gx-full-english', 'Full English Breakfast', 'Kahvaltı', 'British', 180, 11, 10, 11, 2, 350, { aliases: ['english breakfast', 'fry up'] }],
  ['gx-toad-in-the-hole', 'Toad in the Hole', 'Ana Yemek', 'British', 230, 9, 18, 13, 1, 250, { aliases: ['sausage batter'] }],
  ['gx-cornish-pasty', 'Cornish Pasty', 'Ana Yemek', 'British', 270, 8, 26, 15, 2, 200, { aliases: ['pasty'] }],
  ['gx-beef-wellington', 'Beef Wellington', 'Ana Yemek', 'British', 290, 17, 16, 18, 1, 200, { aliases: ['wellington'] }],
  ['gx-yorkshire-pudding', 'Yorkshire Pudding', 'Ekmek & Unlu Mamuller', 'British', 210, 7, 26, 9, 1, 50, { aliases: ['yorkshire pud'] }],
  ['gx-scotch-egg', 'Scotch Egg', 'Atıştırmalık', 'British', 240, 14, 10, 16, 1, 120, { aliases: ['scotch egg'] }],
  ['gx-schnitzel', 'Wiener Schnitzel', 'Et & Tavuk', 'German', 250, 18, 14, 13, 1, 180, { aliases: ['schnitzel', 'veal cutlet'] }],
  ['gx-bratwurst', 'Bratwurst', 'Et & Tavuk', 'German', 300, 12, 3, 27, 0, 85, { aliases: ['german sausage'] }],
  ['gx-currywurst', 'Currywurst', 'Fast Food', 'German', 250, 10, 12, 18, 1, 200, { aliases: ['curry sausage'] }],
  ['gx-goulash', 'Goulash', 'Dünya Mutfağı', 'Hungarian', 110, 11, 6, 5, 1, 350, { aliases: ['beef goulash'] }],
  ['gx-pierogi', 'Pierogi', 'Dünya Mutfağı', 'Polish', 180, 5, 28, 5, 1.5, 150, { aliases: ['polish dumplings'] }],
  ['gx-paella', 'Paella', 'Dünya Mutfağı', 'Spanish', 160, 9, 20, 4.5, 1, 350, { aliases: ['seafood paella'] }],
  ['gx-tortilla-espanola', 'Tortilla Española', 'Kahvaltı', 'Spanish', 165, 6, 13, 10, 1.5, 200, { aliases: ['spanish omelette', 'potato omelette'] }],
  ['gx-croque-monsieur', 'Croque Monsieur', 'Kahvaltı', 'French', 270, 14, 22, 14, 1, 180, { aliases: ['ham cheese toastie'] }],
  ['gx-beef-bourguignon', 'Beef Bourguignon', 'Dünya Mutfağı', 'French', 140, 13, 5, 7, 0.5, 350, { aliases: ['boeuf bourguignon'] }],
  ['gx-fondue', 'Cheese Fondue', 'Dünya Mutfağı', 'Swiss', 270, 16, 4, 20, 0, 100, { aliases: ['fondue'] }],

  // ── American comfort ─────────────────────────────────────────────────────
  ['gx-meatloaf', 'Meatloaf', 'Ana Yemek', 'American', 230, 16, 9, 14, 0.5, 200, { aliases: ['meat loaf'] }],
  ['gx-chicken-fried-steak', 'Chicken Fried Steak', 'Ana Yemek', 'American', 280, 15, 16, 17, 1, 200, { aliases: ['country fried steak'] }],
  ['gx-sloppy-joe', 'Sloppy Joe', 'Fast Food', 'American', 220, 11, 22, 10, 1.5, 200, { aliases: ['sloppy joes'] }],
  ['gx-chili-con-carne', 'Chili con Carne', 'Ana Yemek', 'American', 115, 9, 9, 5, 3, 350, { aliases: ['chili', 'beef chili'] }],
  ['gx-jambalaya', 'Jambalaya', 'Dünya Mutfağı', 'Cajun', 150, 9, 18, 5, 1, 350, { aliases: ['jambalaya'] }],
  ['gx-gumbo', 'Gumbo', 'Dünya Mutfağı', 'Cajun', 95, 7, 9, 4, 1, 350, { aliases: ['seafood gumbo'] }],
  ['gx-cornbread', 'Cornbread', 'Ekmek & Unlu Mamuller', 'American', 330, 6, 50, 11, 2, 80, { aliases: ['corn bread'] }],
  ['gx-biscuits-gravy', 'Biscuits and Gravy', 'Kahvaltı', 'American', 230, 6, 24, 12, 1, 200, { aliases: ['sausage gravy biscuits'] }],
  ['gx-buffalo-chicken-dip', 'Buffalo Chicken Dip', 'Soslar', 'American', 215, 11, 4, 17, 0.5, 60, { aliases: ['buffalo dip'] }],
  ['gx-deviled-eggs', 'Deviled Eggs', 'Atıştırmalık', 'American', 190, 9, 1, 16, 0, 60, { aliases: ['deviled egg'] }],
  ['gx-potato-salad', 'Potato Salad', 'Sebze', 'American', 145, 2.5, 13, 9, 1.5, 150, { aliases: ['potato salad'] }],
  ['gx-mac-salad', 'Macaroni Salad', 'Pilav & Makarna', 'American', 200, 4, 22, 11, 1, 150, { aliases: ['macaroni salad'] }],
  ['gx-eggs-benedict', 'Eggs Benedict', 'Kahvaltı', 'American', 190, 11, 13, 11, 0.8, 220, { aliases: ['eggs benedict'] }],
  ['gx-frittata', 'Frittata', 'Kahvaltı', 'Italian', 155, 11, 3, 11, 0.5, 200, { aliases: ['frittata', 'baked omelette'] }],
  ['gx-grits', 'Grits', 'Kahvaltı', 'American', 60, 1.4, 13, 0.3, 0.5, 250, { aliases: ['corn grits'] }],
  ['gx-clam-bake', 'New England Lobster Roll', 'Balık & Deniz Ürünleri', 'American', 220, 12, 18, 11, 1, 180, { aliases: ['lobster roll'] }],

  // ── Salads & bowls ───────────────────────────────────────────────────────
  ['gx-greek-salad-2', 'Mediterranean Bowl', 'Ana Yemek', 'Salad', 130, 6, 14, 6, 4, 350, { aliases: ['mediterranean grain bowl'] }],
  ['gx-buddha-bowl', 'Buddha Bowl', 'Ana Yemek', 'Salad', 125, 6, 16, 4.5, 4, 400, { aliases: ['grain bowl', 'veggie bowl'] }],
  ['gx-kale-salad', 'Kale Caesar Salad', 'Ana Yemek', 'Salad', 120, 5, 8, 8, 2.5, 250, { aliases: ['kale salad'] }],
  ['gx-tuna-nicoise', 'Niçoise Salad', 'Ana Yemek', 'Salad', 130, 9, 8, 7, 2, 300, { aliases: ['nicoise'] }],
  ['gx-waldorf-salad', 'Waldorf Salad', 'Ana Yemek', 'Salad', 160, 3, 12, 11, 2, 200, { aliases: ['waldorf'] }],

  // ── International market — Candy & Chocolate (brands) ─────────────────────
  ['gx-snickers', 'Snickers Bar', 'Tatlı & Çikolata', 'Chocolate', 491, 8, 60, 24, 2, 52, { brand: 'Mars', aliases: ['snickers'] }],
  ['gx-twix', 'Twix', 'Tatlı & Çikolata', 'Chocolate', 502, 4.5, 64, 24, 1, 50, { brand: 'Mars', aliases: ['twix bar'] }],
  ['gx-mars-bar', 'Mars Bar', 'Tatlı & Çikolata', 'Chocolate', 449, 4, 70, 17, 0.8, 51, { brand: 'Mars', aliases: ['mars'] }],
  ['gx-milky-way', 'Milky Way', 'Tatlı & Çikolata', 'Chocolate', 456, 3.8, 72, 17, 0.7, 52, { brand: 'Mars', aliases: ['milky way bar'] }],
  ['gx-kitkat', 'Kit Kat', 'Tatlı & Çikolata', 'Chocolate', 518, 6.5, 63, 27, 1, 42, { brand: 'Nestlé', aliases: ['kitkat', 'kit kat bar'] }],
  ['gx-mms-peanut', 'M&M’s Peanut', 'Tatlı & Çikolata', 'Chocolate', 514, 9.4, 58, 27, 3, 47, { brand: 'Mars', aliases: ['peanut mms'] }],
  ['gx-reeses-cups', 'Reese’s Peanut Butter Cups', 'Tatlı & Çikolata', 'Chocolate', 515, 11, 51, 30, 3, 42, { brand: 'Hershey', aliases: ['reeses', 'peanut butter cups'] }],
  ['gx-hershey-bar', 'Hershey’s Milk Chocolate', 'Tatlı & Çikolata', 'Chocolate', 535, 7.7, 59, 30, 2, 43, { brand: 'Hershey', aliases: ['hershey bar'] }],
  ['gx-cadbury-dairy-milk', 'Cadbury Dairy Milk', 'Tatlı & Çikolata', 'Chocolate', 534, 7.3, 57, 30, 1, 45, { brand: 'Cadbury', aliases: ['dairy milk'] }],
  ['gx-toblerone', 'Toblerone', 'Tatlı & Çikolata', 'Chocolate', 535, 5.4, 60, 30, 2, 50, { brand: 'Toblerone', aliases: ['toblerone bar'] }],
  ['gx-ferrero-rocher', 'Ferrero Rocher', 'Tatlı & Çikolata', 'Chocolate', 580, 8.5, 44, 42, 3, 38, { brand: 'Ferrero', aliases: ['rocher'] }],
  ['gx-kinder-bueno', 'Kinder Bueno', 'Tatlı & Çikolata', 'Chocolate', 572, 9.4, 50, 37, 2, 43, { brand: 'Kinder', aliases: ['bueno'] }],
  ['gx-lindt-lindor', 'Lindt Lindor Truffles', 'Tatlı & Çikolata', 'Chocolate', 600, 6, 47, 43, 2, 36, { brand: 'Lindt', aliases: ['lindor', 'lindt truffle'] }],
  ['gx-butterfinger', 'Butterfinger', 'Tatlı & Çikolata', 'Chocolate', 478, 4.4, 70, 19, 1, 60, { brand: 'Nestlé', aliases: ['butterfinger bar'] }],
  ['gx-skittles', 'Skittles', 'Tatlı & Çikolata', 'Candy', 405, 0, 91, 4.4, 0, 62, { brand: 'Mars', aliases: ['skittles'] }],
  ['gx-starburst', 'Starburst', 'Tatlı & Çikolata', 'Candy', 410, 0.4, 83, 8, 0, 58, { brand: 'Mars', aliases: ['starburst'] }],
  ['gx-sour-patch', 'Sour Patch Kids', 'Tatlı & Çikolata', 'Candy', 350, 0, 88, 0, 0, 56, { brand: 'Mondelēz', aliases: ['sour patch'] }],
  ['gx-haribo', 'Haribo Goldbears', 'Tatlı & Çikolata', 'Candy', 343, 6.9, 77, 0.5, 0, 50, { brand: 'Haribo', aliases: ['gummy bears', 'haribo'] }],
  ['gx-twizzlers', 'Twizzlers', 'Tatlı & Çikolata', 'Candy', 351, 2.6, 80, 1.8, 0, 45, { brand: 'Hershey', aliases: ['twizzlers'] }],

  // ── International market — Chips / Crackers / Cookies (brands) ────────────
  ['gx-doritos-nacho', 'Doritos Nacho Cheese', 'Cips & Paketli Gıda', 'Chips', 498, 7, 64, 25, 4, 28, { brand: 'Frito-Lay', aliases: ['doritos'] }],
  ['gx-doritos-cool-ranch', 'Doritos Cool Ranch', 'Cips & Paketli Gıda', 'Chips', 500, 7, 63, 25, 4, 28, { brand: 'Frito-Lay', aliases: ['cool ranch doritos'] }],
  ['gx-cheetos', 'Cheetos Crunchy', 'Cips & Paketli Gıda', 'Chips', 535, 7, 54, 32, 1, 28, { brand: 'Frito-Lay', aliases: ['cheetos'] }],
  ['gx-pringles', 'Pringles Original', 'Cips & Paketli Gıda', 'Chips', 536, 4, 52, 35, 3, 28, { brand: 'Pringles', aliases: ['pringles'] }],
  ['gx-ruffles', 'Ruffles Cheddar & Sour Cream', 'Cips & Paketli Gıda', 'Chips', 536, 6, 50, 35, 3, 28, { brand: 'Frito-Lay', aliases: ['ruffles'] }],
  ['gx-tostitos', 'Tostitos Tortilla Chips', 'Cips & Paketli Gıda', 'Chips', 500, 7, 64, 25, 4, 28, { brand: 'Frito-Lay', aliases: ['tortilla chips'] }],
  ['gx-sun-chips', 'Sun Chips', 'Cips & Paketli Gıda', 'Chips', 464, 7, 64, 21, 6, 28, { brand: 'Frito-Lay', aliases: ['sunchips'] }],
  ['gx-goldfish', 'Goldfish Crackers', 'Cips & Paketli Gıda', 'Crackers', 500, 11, 64, 21, 3, 30, { brand: 'Pepperidge Farm', aliases: ['goldfish'] }],
  ['gx-ritz', 'Ritz Crackers', 'Cips & Paketli Gıda', 'Crackers', 500, 6, 63, 25, 2, 32, { brand: 'Nabisco', aliases: ['ritz'] }],
  ['gx-triscuit', 'Triscuit', 'Cips & Paketli Gıda', 'Crackers', 440, 10, 70, 13, 11, 28, { brand: 'Nabisco', aliases: ['triscuits'] }],
  ['gx-wheat-thins', 'Wheat Thins', 'Cips & Paketli Gıda', 'Crackers', 467, 6.7, 73, 17, 7, 31, { brand: 'Nabisco', aliases: ['wheat thins'] }],
  ['gx-oreo', 'Oreo Cookies', 'Tatlı & Çikolata', 'Cookies', 480, 4.5, 71, 20, 2.5, 34, { brand: 'Oreo', aliases: ['oreos'] }],
  ['gx-chips-ahoy', 'Chips Ahoy!', 'Tatlı & Çikolata', 'Cookies', 484, 5, 67, 22, 2, 33, { brand: 'Nabisco', aliases: ['chips ahoy'] }],
  ['gx-pop-tarts', 'Pop-Tarts (Frosted Strawberry)', 'Kahvaltı', 'Pastry', 396, 4, 72, 10, 1, 52, { brand: "Kellogg's", aliases: ['poptarts', 'pop tarts'] }],
  ['gx-nature-valley', 'Nature Valley Granola Bar', 'Atıştırmalık', 'Bar', 471, 7, 64, 19, 5, 42, { brand: 'Nature Valley', aliases: ['nature valley'] }],
  ['gx-nutri-grain', 'Nutri-Grain Bar', 'Atıştırmalık', 'Bar', 357, 4, 70, 8, 4, 37, { brand: "Kellogg's", aliases: ['nutrigrain'] }],
  ['gx-pretzels', 'Pretzels', 'Cips & Paketli Gıda', 'Snack', 380, 10, 80, 3, 3, 30, { aliases: ['pretzel', 'salted pretzels'] }],
  ['gx-microwave-popcorn', 'Microwave Popcorn (Butter)', 'Cips & Paketli Gıda', 'Snack', 500, 8, 55, 28, 10, 30, { brand: 'Orville Redenbacher', aliases: ['butter popcorn'] }],
  ['gx-trail-mix', 'Trail Mix', 'Kuruyemiş', 'Snack', 462, 14, 45, 29, 6, 40, { aliases: ['trail mix'] }],

  // ── International market — Dairy / Yogurt (brands) ───────────────────────
  ['gx-chobani', 'Chobani Greek Yogurt', 'Süt Ürünleri', 'Yogurt', 73, 9.4, 6, 0, 0, 150, { brand: 'Chobani', aliases: ['chobani'] }],
  ['gx-oikos', 'Oikos Triple Zero', 'Süt Ürünleri', 'Yogurt', 64, 10, 6, 0, 0.6, 150, { brand: 'Danone', aliases: ['oikos'] }],
  ['gx-yoplait', 'Yoplait Original', 'Süt Ürünleri', 'Yogurt', 95, 3.5, 18, 1.3, 0, 170, { brand: 'Yoplait', aliases: ['yoplait'] }],
  ['gx-activia', 'Activia', 'Süt Ürünleri', 'Yogurt', 80, 4.5, 13, 1.5, 0, 113, { brand: 'Danone', aliases: ['activia'] }],
  ['gx-babybel', 'Mini Babybel', 'Süt Ürünleri', 'Cheese', 300, 22, 0, 24, 0, 20, { brand: 'Babybel', aliases: ['babybel'] }],
  ['gx-laughing-cow', 'Laughing Cow Cheese', 'Süt Ürünleri', 'Cheese', 230, 9, 9, 18, 0, 20, { brand: 'The Laughing Cow', aliases: ['laughing cow'] }],
  ['gx-string-cheese', 'String Cheese', 'Süt Ürünleri', 'Cheese', 300, 24, 2, 22, 0, 28, { brand: 'Polly-O', aliases: ['mozzarella string cheese'] }],
  ['gx-philadelphia', 'Philadelphia Cream Cheese', 'Süt Ürünleri', 'Cheese', 342, 6, 5, 34, 0, 30, { brand: 'Philadelphia', aliases: ['philadelphia', 'cream cheese'] }],
  ['gx-haagen-dazs', 'Häagen-Dazs Vanilla', 'Tatlı & Çikolata', 'Ice Cream', 244, 4.3, 21, 16, 0, 100, { brand: 'Häagen-Dazs', aliases: ['haagen dazs'] }],
  ['gx-ben-jerry', 'Ben & Jerry’s Half Baked', 'Tatlı & Çikolata', 'Ice Cream', 270, 4, 32, 14, 1, 100, { brand: "Ben & Jerry's", aliases: ['ben and jerrys'] }],
  ['gx-breyers', 'Breyers Vanilla', 'Tatlı & Çikolata', 'Ice Cream', 200, 3.5, 22, 11, 0, 100, { brand: 'Breyers', aliases: ['breyers'] }],
  ['gx-halo-top', 'Halo Top Vanilla', 'Tatlı & Çikolata', 'Ice Cream', 110, 6, 18, 3, 4, 100, { brand: 'Halo Top', aliases: ['halo top'] }],

  // ── International market — Frozen / Ready meals ───────────────────────────
  ['gx-hot-pockets', 'Hot Pockets (Pepperoni Pizza)', 'Fast Food', 'Frozen', 250, 9, 31, 10, 2, 127, { brand: 'Hot Pockets', aliases: ['hot pocket'] }],
  ['gx-digiorno', 'DiGiorno Frozen Pizza', 'Fast Food', 'Frozen', 270, 12, 30, 11, 2, 140, { brand: 'DiGiorno', aliases: ['digiorno pizza'] }],
  ['gx-bagel-bites', 'Bagel Bites', 'Fast Food', 'Frozen', 230, 9, 33, 7, 2, 88, { brand: 'Bagel Bites', aliases: ['bagel bites'] }],
  ['gx-eggo-waffles', 'Eggo Waffles', 'Kahvaltı', 'Frozen', 280, 6, 39, 11, 2, 70, { brand: "Kellogg's", aliases: ['eggo'] }],
  ['gx-lean-cuisine', 'Lean Cuisine (Chicken Alfredo)', 'Ana Yemek', 'Frozen', 110, 8, 14, 3, 1.5, 280, { brand: 'Lean Cuisine', aliases: ['lean cuisine'] }],
  ['gx-stouffers-lasagna', 'Stouffer’s Lasagna', 'Dünya Mutfağı', 'Frozen', 130, 7, 13, 5, 1.5, 280, { brand: "Stouffer's", aliases: ['stouffers lasagna'] }],
  ['gx-tgif-mozz', 'Frozen Mozzarella Sticks', 'Fast Food', 'Frozen', 290, 12, 28, 15, 2, 100, { aliases: ['mozzarella sticks frozen'] }],
  ['gx-frozen-pizza-rolls', 'Pizza Rolls', 'Fast Food', 'Frozen', 270, 8, 35, 11, 2, 85, { brand: 'Totino’s', aliases: ['pizza rolls', 'totinos'] }],

  // ── International market — Condiments / Sauces (brands) ───────────────────
  ['gx-heinz-ketchup', 'Heinz Ketchup', 'Soslar', 'Condiment', 101, 1.2, 25, 0.1, 0.3, 17, { brand: 'Heinz', aliases: ['ketchup', 'catsup'] }],
  ['gx-hellmanns-mayo', "Hellmann's Mayonnaise", 'Soslar', 'Condiment', 680, 1, 0.6, 75, 0, 14, { brand: "Hellmann's", aliases: ['mayonnaise', 'mayo'] }],
  ['gx-frenchs-mustard', 'French’s Yellow Mustard', 'Soslar', 'Condiment', 60, 4, 5, 3, 2, 5, { brand: "French's", aliases: ['mustard'] }],
  ['gx-sriracha', 'Sriracha', 'Soslar', 'Hot Sauce', 100, 2, 19, 1, 1, 9, { brand: 'Huy Fong', aliases: ['sriracha sauce'] }],
  ['gx-tabasco', 'Tabasco Sauce', 'Soslar', 'Hot Sauce', 12, 1.3, 0.8, 0.8, 0.6, 5, { brand: 'Tabasco', aliases: ['tabasco', 'hot sauce'] }],
  ['gx-bbq-sauce', 'BBQ Sauce', 'Soslar', 'Condiment', 172, 0.8, 41, 0.6, 0.7, 17, { brand: "Sweet Baby Ray's", aliases: ['barbecue sauce'] }],
  ['gx-ranch-dressing', 'Ranch Dressing', 'Soslar', 'Dressing', 430, 1.5, 6, 45, 0, 30, { brand: 'Hidden Valley', aliases: ['ranch'] }],
  ['gx-soy-sauce', 'Soy Sauce', 'Soslar', 'Condiment', 53, 8, 5, 0.6, 0.8, 15, { brand: 'Kikkoman', aliases: ['soy sauce', 'shoyu'] }],
  ['gx-nutella', 'Nutella', 'Tatlı & Çikolata', 'Spread', 539, 6, 57, 31, 0, 20, { brand: 'Ferrero', aliases: ['nutella', 'hazelnut spread'] }],
  ['gx-peanut-butter-jif', 'Jif Peanut Butter', 'Soslar', 'Spread', 588, 22, 22, 50, 5, 32, { brand: 'Jif', aliases: ['peanut butter'] }],
  ['gx-maple-syrup', 'Maple Syrup', 'Soslar', 'Syrup', 260, 0, 67, 0.1, 0, 60, { brand: 'Aunt Jemima', aliases: ['pancake syrup', 'maple syrup'] }],

  // ── International market — Drinks (brands) ────────────────────────────────
  ['gx-dr-pepper', 'Dr Pepper', 'İçecek', 'Soda', 42, 0, 10.3, 0, 0, 355, { brand: 'Dr Pepper', ml: true, label: '1 can (355ml)', aliases: ['dr pepper'] }],
  ['gx-7up', '7UP', 'İçecek', 'Soda', 42, 0, 10.5, 0, 0, 355, { brand: '7UP', ml: true, label: '1 can (355ml)', aliases: ['seven up'] }],
  ['gx-root-beer', 'A&W Root Beer', 'İçecek', 'Soda', 46, 0, 12, 0, 0, 355, { brand: 'A&W', ml: true, label: '1 can (355ml)', aliases: ['root beer'] }],
  ['gx-arizona-tea', 'Arizona Green Tea', 'İçecek', 'Iced Tea', 35, 0, 8.8, 0, 0, 500, { brand: 'Arizona', ml: true, label: '1 bottle', aliases: ['arizona', 'green tea drink'] }],
  ['gx-snapple', 'Snapple Peach Tea', 'İçecek', 'Iced Tea', 40, 0, 10, 0, 0, 473, { brand: 'Snapple', ml: true, label: '1 bottle', aliases: ['snapple'] }],
  ['gx-lipton-tea', 'Lipton Iced Tea', 'İçecek', 'Iced Tea', 30, 0, 8, 0, 0, 500, { brand: 'Lipton', ml: true, label: '1 bottle', aliases: ['lipton', 'iced tea'] }],
  ['gx-capri-sun', 'Capri Sun', 'İçecek', 'Juice', 35, 0, 8, 0, 0, 177, { brand: 'Capri Sun', ml: true, label: '1 pouch', aliases: ['capri sun'] }],
  ['gx-sunny-d', 'Sunny D', 'İçecek', 'Juice', 35, 0, 8.5, 0, 0, 350, { brand: 'Sunny Delight', ml: true, label: '1 bottle', aliases: ['sunnyd', 'sunny delight'] }],
  ['gx-welchs-grape', "Welch's Grape Juice", 'İçecek', 'Juice', 67, 0.3, 17, 0, 0.2, 250, { brand: "Welch's", ml: true, label: '1 glass', aliases: ['grape juice'] }],
  ['gx-cranberry-juice', 'Cranberry Juice', 'İçecek', 'Juice', 46, 0.4, 12, 0.1, 0, 250, { brand: 'Ocean Spray', ml: true, label: '1 glass', aliases: ['cranberry juice'] }],
  ['gx-san-pellegrino', 'San Pellegrino Sparkling', 'İçecek', 'Sparkling Water', 0, 0, 0, 0, 0, 500, { brand: 'San Pellegrino', ml: true, label: '1 bottle', aliases: ['sparkling water', 'pellegrino'] }],
  ['gx-lacroix', 'LaCroix Sparkling Water', 'İçecek', 'Sparkling Water', 0, 0, 0, 0, 0, 355, { brand: 'LaCroix', ml: true, label: '1 can', aliases: ['lacroix', 'seltzer'] }],
  ['gx-smartwater', 'Smartwater', 'İçecek', 'Water', 0, 0, 0, 0, 0, 600, { brand: 'Smartwater', ml: true, label: '1 bottle', aliases: ['smart water'] }],
  ['gx-yoohoo', 'Yoo-hoo Chocolate Drink', 'İçecek', 'Chocolate Drink', 54, 1, 11, 0.5, 0.4, 296, { brand: 'Yoo-hoo', ml: true, label: '1 box', aliases: ['yoohoo', 'chocolate milk drink'] }],
  ['gx-kombucha', 'Kombucha', 'İçecek', 'Fermented', 25, 0, 6, 0, 0, 350, { brand: 'GT’s', ml: true, label: '1 bottle', aliases: ['kombucha'] }],

  // ── Nuts / Spreads / Misc ─────────────────────────────────────────────────
  ['gx-trail-cashews', 'Roasted Cashews', 'Kuruyemiş', 'Nuts', 574, 15, 33, 46, 3, 30, { aliases: ['cashews', 'cashew nuts'] }],
  ['gx-pistachios', 'Pistachios', 'Kuruyemiş', 'Nuts', 562, 20, 28, 45, 10, 30, { aliases: ['pistachio'] }],
  ['gx-mixed-nuts', 'Mixed Nuts', 'Kuruyemiş', 'Nuts', 607, 20, 21, 54, 7, 30, { aliases: ['mixed nuts'] }],
  ['gx-pecans', 'Pecans', 'Kuruyemiş', 'Nuts', 691, 9, 14, 72, 10, 30, { aliases: ['pecan'] }],
  ['gx-macadamia', 'Macadamia Nuts', 'Kuruyemiş', 'Nuts', 718, 8, 14, 76, 9, 30, { aliases: ['macadamia'] }],
  ['gx-sunflower-seeds', 'Sunflower Seeds', 'Kuruyemiş', 'Seeds', 584, 21, 20, 51, 9, 30, { aliases: ['sunflower seeds'] }],
  ['gx-pumpkin-seeds', 'Pumpkin Seeds', 'Kuruyemiş', 'Seeds', 559, 30, 11, 49, 6, 30, { aliases: ['pepitas', 'pumpkin seeds'] }],
  ['gx-almond-butter', 'Almond Butter', 'Soslar', 'Spread', 614, 21, 19, 56, 10, 32, { aliases: ['almond butter'] }],
]

export const GLOBAL_EXPANSION_MEGA: FoodCatalogItem[] = build(rows)
