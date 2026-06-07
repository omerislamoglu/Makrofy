import { food, S } from './helpers'
import type { FoodCatalogItem } from '../../types/food'

export const WORLD_CUISINE: FoodCatalogItem[] = [
  // ── Sushi & Japon ────────────────────────────────────────
  food({ id: 'cat-nigiri-somon', name: 'Somon Nigiri', cat: 'Sushi & Asya Mutfağı', sub: 'Sushi', cal: 140, p: 8, c: 18, f: 3.5, fib: 0.2, servings: [S.adet(30, '1 parça'), S.custom('6 parça', 'adet', 180), S.custom('8 parça', 'adet', 240), S.g100], aliases: ['salmon nigiri', 'somon nigiri', 'nigiri'] }),
  food({ id: 'cat-nigiri-ton', name: 'Ton Nigiri', cat: 'Sushi & Asya Mutfağı', sub: 'Sushi', cal: 130, p: 9, c: 18, f: 2, fib: 0.2, servings: [S.adet(30, '1 parça'), S.custom('6 parça', 'adet', 180), S.g100], aliases: ['tuna nigiri', 'ton nigiri'] }),
  food({ id: 'cat-california-roll', name: 'California Roll', cat: 'Sushi & Asya Mutfağı', sub: 'Sushi', cal: 150, p: 5.5, c: 22, f: 4.5, fib: 1, servings: [S.adet(35, '1 parça'), S.custom('6 parça', 'adet', 210), S.custom('8 parça', 'adet', 280), S.g100], aliases: ['california roll', 'california maki'] }),
  food({ id: 'cat-somon-roll', name: 'Somon Roll', cat: 'Sushi & Asya Mutfağı', sub: 'Sushi', cal: 155, p: 6.5, c: 20, f: 5, fib: 0.5, servings: [S.adet(35, '1 parça'), S.custom('8 parça', 'adet', 280), S.g100], aliases: ['salmon roll', 'somon roll'] }),
  food({ id: 'cat-maki', name: 'Maki Roll', cat: 'Sushi & Asya Mutfağı', sub: 'Sushi', cal: 140, p: 5, c: 22, f: 3, fib: 1, servings: [S.adet(25, '1 parça'), S.custom('6 parça', 'adet', 150), S.g100], aliases: ['maki', 'maki roll', 'hosomaki'] }),
  food({ id: 'cat-sashimi-somon', name: 'Somon Sashimi', cat: 'Sushi & Asya Mutfağı', sub: 'Sushi', cal: 182, p: 25, c: 0, f: 8, fib: 0, servings: [S.adet(15, '1 dilim'), S.custom('5 dilim', 'dilim', 75), S.g100], aliases: ['salmon sashimi', 'sashimi'] }),
  food({ id: 'cat-ramen', name: 'Ramen', cat: 'Sushi & Asya Mutfağı', sub: 'Japon', cal: 80, p: 4, c: 10, f: 2.5, fib: 0.5, servings: [S.kase(500, '1 kase'), S.ml100], aliases: ['ramen', 'japanese noodle soup'] }),
  food({ id: 'cat-udon', name: 'Udon Noodle', cat: 'Sushi & Asya Mutfağı', sub: 'Japon', cal: 105, p: 3, c: 22, f: 0.3, fib: 1, servings: [S.porsiyon(250), S.g100], aliases: ['udon', 'udon noodle'] }),
  food({ id: 'cat-edamame', name: 'Edamame', cat: 'Sushi & Asya Mutfağı', sub: 'Meze', cal: 121, p: 12, c: 9, f: 5, fib: 5, servings: [S.porsiyon(100), S.g100], aliases: ['edamame', 'soybean'] }),

  // ── Çin/Kore ─────────────────────────────────────────────
  food({ id: 'cat-fried-rice', name: 'Fried Rice (Karışık)', cat: 'Sushi & Asya Mutfağı', sub: 'Çin', cal: 163, p: 4.5, c: 22, f: 6, fib: 1, servings: [S.porsiyon(250), S.g100], aliases: ['fried rice', 'cin pilavi', 'egg fried rice'] }),
  food({ id: 'cat-tavuklu-noodle', name: 'Tavuklu Noodle', cat: 'Sushi & Asya Mutfağı', sub: 'Çin', cal: 130, p: 8, c: 16, f: 4, fib: 1, servings: [S.porsiyon(300), S.g100], aliases: ['chicken noodle', 'tavuklu noodle', 'stir fry noodle'] }),
  food({ id: 'cat-spring-roll', name: 'Spring Roll (Kızartma)', cat: 'Sushi & Asya Mutfağı', sub: 'Çin', cal: 220, p: 5, c: 25, f: 11, fib: 1.5, servings: [S.adet(60, '1 adet'), S.custom('3 adet', 'adet', 180), S.g100], aliases: ['spring roll', 'egg roll'] }),
  food({ id: 'cat-pad-thai', name: 'Pad Thai', cat: 'Sushi & Asya Mutfağı', sub: 'Tayland', cal: 150, p: 6, c: 20, f: 5, fib: 1, servings: [S.porsiyon(300), S.g100], aliases: ['pad thai', 'thai noodle'] }),
  food({ id: 'cat-bibimbap', name: 'Bibimbap', cat: 'Sushi & Asya Mutfağı', sub: 'Kore', cal: 120, p: 6, c: 16, f: 4, fib: 1.5, servings: [S.porsiyon(400, '1 kase'), S.g100], aliases: ['bibimbap', 'korean rice bowl'] }),

  // ── İtalyan ──────────────────────────────────────────────
  food({ id: 'cat-lasagna', name: 'Lazanya', cat: 'Dünya Mutfağı', sub: 'İtalyan', cal: 135, p: 8, c: 12, f: 6, fib: 1, servings: [S.porsiyon(300, '1 porsiyon'), S.g100], aliases: ['lasagna', 'lazanya', 'lasagne'] }),
  food({ id: 'cat-risotto', name: 'Risotto', cat: 'Dünya Mutfağı', sub: 'İtalyan', cal: 140, p: 3.5, c: 20, f: 5, fib: 0.5, servings: [S.porsiyon(250), S.g100], aliases: ['risotto', 'italian rice'] }),
  food({ id: 'cat-penne-arrabiata', name: 'Penne Arrabiata', cat: 'Dünya Mutfağı', sub: 'İtalyan', cal: 145, p: 5, c: 24, f: 3.5, fib: 2, servings: [S.porsiyon(280), S.g100], aliases: ['arrabiata', 'penne arrabiata'] }),

  // ── Meksika ──────────────────────────────────────────────
  food({ id: 'cat-taco', name: 'Taco (Et)', cat: 'Dünya Mutfağı', sub: 'Meksika', cal: 210, p: 10, c: 18, f: 11, fib: 2, servings: [S.adet(100, '1 adet'), S.custom('3 adet', 'adet', 300), S.g100], aliases: ['taco', 'beef taco'] }),
  food({ id: 'cat-burrito', name: 'Burrito (Tavuklu)', cat: 'Dünya Mutfağı', sub: 'Meksika', cal: 180, p: 9, c: 22, f: 6, fib: 3, servings: [S.adet(300, '1 adet'), S.g100], aliases: ['burrito', 'chicken burrito'] }),
  food({ id: 'cat-quesadilla', name: 'Quesadilla', cat: 'Dünya Mutfağı', sub: 'Meksika', cal: 260, p: 11, c: 22, f: 14, fib: 1.5, servings: [S.adet(150, '1 adet'), S.g100], aliases: ['quesadilla', 'cheese quesadilla'] }),
  food({ id: 'cat-nachos', name: 'Nachos (Peynirli)', cat: 'Dünya Mutfağı', sub: 'Meksika', cal: 350, p: 8, c: 38, f: 18, fib: 3, servings: [S.porsiyon(150), S.g100], aliases: ['nachos', 'cheese nachos'] }),

  // ── Salata ───────────────────────────────────────────────
  food({ id: 'cat-caesar-salata', name: 'Caesar Salata (Tavuklu)', cat: 'Dünya Mutfağı', sub: 'Salata', cal: 120, p: 8, c: 5, f: 8, fib: 1.5, servings: [S.porsiyon(250, '1 porsiyon'), S.g100], aliases: ['caesar salad', 'sezar salata'] }),
  food({ id: 'cat-greek-salata', name: 'Greek Salata', cat: 'Dünya Mutfağı', sub: 'Salata', cal: 90, p: 3, c: 5, f: 7, fib: 1.5, servings: [S.porsiyon(200), S.g100], aliases: ['greek salad', 'yunan salatasi'] }),
  food({ id: 'cat-coban-salata', name: 'Çoban Salatası', cat: 'Ev Yemekleri', sub: 'Salata', cal: 22, p: 1, c: 4.5, f: 0.2, fib: 1, servings: [S.porsiyon(150), S.g100], aliases: ['shepherd salad', 'coban salatasi', 'turkish salad'] }),

  // ── Japon & Asya (devam) ─────────────────────────────────
  food({ id: 'cat-temaki', name: 'Temaki (El Rulosu)', cat: 'Sushi & Asya Mutfağı', sub: 'Sushi', cal: 145, p: 6, c: 20, f: 4.5, fib: 1, servings: [S.adet(70, '1 adet'), S.g100], aliases: ['temaki', 'hand roll'] }),
  food({ id: 'cat-gyoza', name: 'Gyoza (Tavuklu)', cat: 'Sushi & Asya Mutfağı', sub: 'Japon', cal: 200, p: 8, c: 22, f: 9, fib: 1, servings: [S.adet(20, '1 adet'), S.custom('5 adet', 'adet', 100), S.g100], aliases: ['gyoza', 'japanese dumplings', 'potsticker'] }),
  food({ id: 'cat-dim-sum', name: 'Dim Sum (Buğulama)', cat: 'Sushi & Asya Mutfağı', sub: 'Çin', cal: 165, p: 9, c: 20, f: 5.5, fib: 1, servings: [S.adet(30, '1 adet'), S.custom('4 adet', 'adet', 120), S.g100], aliases: ['dim sum', 'dumpling'] }),
  food({ id: 'cat-pho', name: 'Pho (Vietnam Çorbası)', cat: 'Sushi & Asya Mutfağı', sub: 'Vietnam', cal: 65, p: 5, c: 9, f: 1.2, fib: 0.5, servings: [S.kase(500, '1 kase'), S.ml100], aliases: ['pho', 'vietnamese noodle soup'] }),
  food({ id: 'cat-green-curry', name: 'Yeşil Köri (Tavuklu)', cat: 'Sushi & Asya Mutfağı', sub: 'Tayland', cal: 130, p: 7, c: 8, f: 8, fib: 1, servings: [S.porsiyon(300), S.g100], aliases: ['green curry', 'thai curry', 'yesil kori'] }),
  food({ id: 'cat-butter-chicken', name: 'Butter Chicken', cat: 'Dünya Mutfağı', sub: 'Hint', cal: 160, p: 11, c: 6, f: 10, fib: 1, servings: [S.porsiyon(300), S.g100], aliases: ['butter chicken', 'murgh makhani'] }),
  food({ id: 'cat-tikka-masala', name: 'Chicken Tikka Masala', cat: 'Dünya Mutfağı', sub: 'Hint', cal: 150, p: 12, c: 7, f: 8, fib: 1, servings: [S.porsiyon(300), S.g100], aliases: ['tikka masala', 'chicken tikka'] }),
  food({ id: 'cat-naan', name: 'Naan Ekmeği', cat: 'Dünya Mutfağı', sub: 'Hint', cal: 310, p: 9, c: 50, f: 7, fib: 2, servings: [S.adet(90, '1 adet'), S.g100], aliases: ['naan', 'naan bread'] }),
  food({ id: 'cat-samosa', name: 'Samosa', cat: 'Dünya Mutfağı', sub: 'Hint', cal: 260, p: 5, c: 28, f: 14, fib: 2, servings: [S.adet(50, '1 adet'), S.custom('2 adet', 'adet', 100), S.g100], aliases: ['samosa', 'samsa'] }),
  food({ id: 'cat-falafel', name: 'Falafel', cat: 'Dünya Mutfağı', sub: 'Orta Doğu', cal: 333, p: 13, c: 32, f: 18, fib: 5, servings: [S.adet(17, '1 adet'), S.custom('4 adet', 'adet', 68), S.g100], aliases: ['falafel', 'felafel'] }),
  food({ id: 'cat-shawarma', name: 'Shawarma (Tavuklu)', cat: 'Dünya Mutfağı', sub: 'Orta Doğu', cal: 215, p: 14, c: 17, f: 10, fib: 1, servings: [S.adet(250, '1 adet'), S.g100], aliases: ['shawarma', 'shaurma'] }),
  food({ id: 'cat-paella', name: 'Paella (Deniz Ürünlü)', cat: 'Dünya Mutfağı', sub: 'İspanyol', cal: 158, p: 8, c: 22, f: 4, fib: 1, servings: [S.porsiyon(350), S.g100], aliases: ['paella', 'spanish rice'] }),
  food({ id: 'cat-gnocchi', name: 'Gnocchi', cat: 'Dünya Mutfağı', sub: 'İtalyan', cal: 170, p: 4, c: 33, f: 2.5, fib: 2, servings: [S.porsiyon(250), S.g100], aliases: ['gnocchi', 'potato dumplings'] }),
  food({ id: 'cat-bruschetta', name: 'Bruschetta', cat: 'Dünya Mutfağı', sub: 'İtalyan', cal: 195, p: 5, c: 26, f: 8, fib: 1.5, servings: [S.adet(40, '1 dilim'), S.custom('3 dilim', 'adet', 120), S.g100], aliases: ['bruschetta'] }),
  food({ id: 'cat-churros', name: 'Churros', cat: 'Dünya Mutfağı', sub: 'İspanyol', cal: 365, p: 4, c: 45, f: 19, fib: 1.5, servings: [S.adet(40, '1 adet'), S.custom('3 adet', 'adet', 120), S.g100], aliases: ['churros', 'churro'] }),

  // ── Hint (devam) ─────────────────────────────────────────
  food({ id: 'cat-biryani', name: 'Chicken Biryani', cat: 'Dünya Mutfağı', sub: 'Hint', cal: 175, p: 9, c: 22, f: 6, fib: 1.5, servings: [S.porsiyon(350), S.g100], aliases: ['biryani', 'chicken biryani', 'tavuklu biryani'] }),
  food({ id: 'cat-palak-paneer', name: 'Palak Paneer', cat: 'Dünya Mutfağı', sub: 'Hint', cal: 155, p: 8, c: 6, f: 11, fib: 2, servings: [S.porsiyon(250), S.g100], aliases: ['palak paneer', 'spinach paneer', 'ispanakli panir'] }),
  food({ id: 'cat-dal', name: 'Dal (Mercimek)', cat: 'Dünya Mutfağı', sub: 'Hint', cal: 90, p: 5.5, c: 13, f: 1.5, fib: 4, servings: [S.porsiyon(250), S.g100], aliases: ['dal', 'daal', 'lentil curry'] }),
  food({ id: 'cat-tandoori-chicken', name: 'Tandoori Chicken', cat: 'Dünya Mutfağı', sub: 'Hint', cal: 165, p: 25, c: 3, f: 6, fib: 0.5, servings: [S.porsiyon(200), S.g100], aliases: ['tandoori', 'tandoori chicken', 'tandori tavuk'] }),
  food({ id: 'cat-vindaloo', name: 'Vindaloo', cat: 'Dünya Mutfağı', sub: 'Hint', cal: 145, p: 12, c: 8, f: 7, fib: 2, servings: [S.porsiyon(300), S.g100], aliases: ['vindaloo', 'chicken vindaloo'] }),

  // ── Kore ─────────────────────────────────────────────────
  food({ id: 'cat-kimchi-jjigae', name: 'Kimchi Jjigae', cat: 'Dünya Mutfağı', sub: 'Kore', cal: 60, p: 5, c: 5, f: 2.5, fib: 1.5, servings: [S.kase(400, '1 kase'), S.g100], aliases: ['kimchi stew', 'kimchi jjigae'] }),
  food({ id: 'cat-japchae', name: 'Japchae', cat: 'Sushi & Asya Mutfağı', sub: 'Kore', cal: 130, p: 3, c: 20, f: 4.5, fib: 1.5, servings: [S.porsiyon(200), S.g100], aliases: ['japchae', 'glass noodles', 'korean noodles'] }),
  food({ id: 'cat-tteokbokki', name: 'Tteokbokki', cat: 'Sushi & Asya Mutfağı', sub: 'Kore', cal: 175, p: 4, c: 35, f: 2.5, fib: 1, servings: [S.porsiyon(250), S.g100], aliases: ['tteokbokki', 'rice cakes', 'korean rice cakes'] }),
  food({ id: 'cat-korean-fried-chicken', name: 'Korean Fried Chicken', cat: 'Dünya Mutfağı', sub: 'Kore', cal: 265, p: 18, c: 16, f: 14, fib: 0.5, servings: [S.porsiyon(200), S.g100], aliases: ['korean chicken', 'kore usulu tavuk'] }),

  // ── Tayland & Vietnam (devam) ────────────────────────────
  food({ id: 'cat-tom-yum', name: 'Tom Yum Çorbası', cat: 'Sushi & Asya Mutfağı', sub: 'Tayland', cal: 45, p: 4, c: 4, f: 1.5, fib: 0.5, servings: [S.kase(400, '1 kase'), S.g100], aliases: ['tom yum', 'tom yam', 'thai soup'] }),
  food({ id: 'cat-massaman-curry', name: 'Massaman Curry', cat: 'Sushi & Asya Mutfağı', sub: 'Tayland', cal: 155, p: 8, c: 12, f: 9, fib: 2, servings: [S.porsiyon(300), S.g100], aliases: ['massaman', 'massaman curry'] }),
  food({ id: 'cat-banh-mi', name: 'Bánh Mì', cat: 'Dünya Mutfağı', sub: 'Vietnam', cal: 210, p: 9, c: 28, f: 7, fib: 2, servings: [S.adet(250, '1 adet'), S.g100], aliases: ['banh mi', 'vietnamese sandwich'] }),

  // ── Orta Doğu & Afrika ───────────────────────────────────
  food({ id: 'cat-hummus', name: 'Humus', cat: 'Dünya Mutfağı', sub: 'Orta Doğu', cal: 166, p: 8, c: 14, f: 10, fib: 6, servings: [S.custom('2 yemek kaşığı', 'porsiyon', 30), S.porsiyon(100), S.g100], aliases: ['hummus', 'humus', 'nohut ezmesi'] }),
  food({ id: 'cat-baba-ganoush', name: 'Baba Ganoush', cat: 'Dünya Mutfağı', sub: 'Orta Doğu', cal: 130, p: 3, c: 12, f: 8, fib: 3, servings: [S.custom('2 yemek kaşığı', 'porsiyon', 30), S.g100], aliases: ['baba ganoush', 'patlican ezmesi', 'mutabal'] }),
  food({ id: 'cat-couscous', name: 'Couscous', cat: 'Dünya Mutfağı', sub: 'Kuzey Afrika', cal: 112, p: 4, c: 23, f: 0.2, fib: 1.5, servings: [S.porsiyon(200), S.g100], aliases: ['couscous', 'kuskus'] }),
  food({ id: 'cat-tagine', name: 'Tagine (Tavuklu)', cat: 'Dünya Mutfağı', sub: 'Kuzey Afrika', cal: 115, p: 10, c: 8, f: 5, fib: 2, servings: [S.porsiyon(300), S.g100], aliases: ['tagine', 'tajine', 'moroccan stew'] }),

  // ── İtalyan (devam) ──────────────────────────────────────
  food({ id: 'cat-carbonara', name: 'Spaghetti Carbonara', cat: 'Dünya Mutfağı', sub: 'İtalyan', cal: 190, p: 9, c: 22, f: 7.5, fib: 1, servings: [S.porsiyon(300), S.g100], aliases: ['carbonara', 'spaghetti carbonara'] }),
  food({ id: 'cat-bolognese', name: 'Spaghetti Bolognese', cat: 'Dünya Mutfağı', sub: 'İtalyan', cal: 145, p: 8, c: 16, f: 5, fib: 1.5, servings: [S.porsiyon(350), S.g100], aliases: ['bolognese', 'spaghetti bolognese', 'bolonez'] }),
  food({ id: 'cat-ravioli', name: 'Ravioli', cat: 'Dünya Mutfağı', sub: 'İtalyan', cal: 180, p: 7, c: 25, f: 5.5, fib: 1.5, servings: [S.porsiyon(250), S.g100], aliases: ['ravioli', 'filled pasta'] }),
  food({ id: 'cat-panna-cotta', name: 'Panna Cotta', cat: 'Dünya Mutfağı', sub: 'İtalyan', cal: 240, p: 3, c: 22, f: 16, fib: 0, servings: [S.porsiyon(120, '1 porsiyon'), S.g100], aliases: ['panna cotta', 'pannacotta'] }),

  // ── Meksika (devam) ──────────────────────────────────────
  food({ id: 'cat-enchilada', name: 'Enchilada (Tavuklu)', cat: 'Dünya Mutfağı', sub: 'Meksika', cal: 165, p: 9, c: 16, f: 8, fib: 2, servings: [S.adet(150, '1 adet'), S.custom('2 adet', 'adet', 300), S.g100], aliases: ['enchilada', 'chicken enchilada'] }),
  food({ id: 'cat-guacamole', name: 'Guacamole', cat: 'Dünya Mutfağı', sub: 'Meksika', cal: 160, p: 2, c: 9, f: 15, fib: 7, servings: [S.custom('2 yemek kaşığı', 'porsiyon', 30), S.g100], aliases: ['guacamole', 'avokado sos'] }),
  food({ id: 'cat-chimichanga', name: 'Chimichanga', cat: 'Dünya Mutfağı', sub: 'Meksika', cal: 250, p: 10, c: 24, f: 13, fib: 2, servings: [S.adet(200, '1 adet'), S.g100], aliases: ['chimichanga'] }),
  food({ id: 'cat-elote', name: 'Elote (Meksika Mısırı)', cat: 'Dünya Mutfağı', sub: 'Meksika', cal: 135, p: 4, c: 18, f: 6, fib: 2.5, servings: [S.adet(150, '1 koçan'), S.g100], aliases: ['elote', 'mexican corn', 'street corn'] }),
]
