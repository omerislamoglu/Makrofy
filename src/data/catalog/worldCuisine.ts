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
  food({ id: 'cat-fettuccine-alfredo', name: 'Fettuccine Alfredo', cat: 'Dünya Mutfağı', sub: 'İtalyan', cal: 170, p: 5, c: 18, f: 8, fib: 0.8, servings: [S.porsiyon(280), S.g100], aliases: ['fettuccine alfredo', 'alfredo pasta'] }),
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
]
