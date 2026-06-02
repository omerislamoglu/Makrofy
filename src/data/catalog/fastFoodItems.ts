import { food, S } from './helpers'
import type { FoodCatalogItem } from '../../types/food'

export const FAST_FOOD_ITEMS: FoodCatalogItem[] = [
  // ── Burger ───────────────────────────────────────────────
  food({ id: 'cat-hamburger', name: 'Hamburger (Tek Katlı)', cat: 'Fast Food', sub: 'Burger', cal: 250, p: 12.1, c: 21.4, f: 12.9, fib: 1.3, servings: [S.adet(140, '1 adet'), S.g100], aliases: ['hamburger', 'burger', 'tek katli burger'] }),
  food({ id: 'cat-cheeseburger', name: 'Cheeseburger', cat: 'Fast Food', sub: 'Burger', cal: 267, p: 13.3, c: 21.3, f: 14.7, fib: 1.2, servings: [S.adet(150, '1 adet'), S.g100], aliases: ['cheeseburger', 'cheese burger'] }),
  food({ id: 'cat-double-burger', name: 'Double Cheeseburger', cat: 'Fast Food', sub: 'Burger', cal: 275, p: 15, c: 17.5, f: 16, fib: 1, servings: [S.adet(200, '1 adet'), S.g100], aliases: ['double burger', 'double cheeseburger', 'cift katli'] }),
  food({ id: 'cat-tavuk-burger', name: 'Tavuk Burger', cat: 'Fast Food', sub: 'Burger', cal: 233, p: 12.2, c: 22.2, f: 11.1, fib: 1.5, servings: [S.adet(180, '1 adet'), S.g100], aliases: ['chicken burger', 'tavuk burger', 'chicken sandwich'] }),
  // ── McDonald's ───────────────────────────────────────────
  food({ id: 'cat-big-mac', name: 'Big Mac', brand: "McDonald's", cat: 'Fast Food', sub: 'Burger', cal: 257, p: 13, c: 23, f: 13, fib: 2, servings: [S.adet(214, '1 adet'), S.g100], aliases: ['big mac', 'bigmac', 'mcdonalds burger'] }),
  food({ id: 'cat-double-big-mac', name: 'Double Big Mac', brand: "McDonald's", cat: 'Fast Food', sub: 'Burger', cal: 346, p: 20, c: 23, f: 20, fib: 2, servings: [S.adet(285, '1 adet'), S.g100], aliases: ['double big mac', 'double bigmac'] }),
  food({ id: 'cat-mcchicken', name: 'McChicken', brand: "McDonald's", cat: 'Fast Food', sub: 'Burger', cal: 244, p: 11, c: 25, f: 11, fib: 1.5, servings: [S.adet(175, '1 adet'), S.g100], aliases: ['mcchicken', 'mc chicken'] }),
  food({ id: 'cat-quarter-pounder', name: 'Quarter Pounder', brand: "McDonald's", cat: 'Fast Food', sub: 'Burger', cal: 267, p: 16, c: 17, f: 16, fib: 1, servings: [S.adet(195, '1 adet'), S.g100], aliases: ['quarter pounder', 'quarterpounder', 'qpc'] }),
  // ── Burger King ──────────────────────────────────────────
  food({ id: 'cat-whopper', name: 'Whopper', brand: 'Burger King', cat: 'Fast Food', sub: 'Burger', cal: 253, p: 14, c: 20, f: 14, fib: 1.5, servings: [S.adet(302, '1 adet'), S.g100], aliases: ['whopper', 'burger king whopper'] }),
  food({ id: 'cat-double-whopper', name: 'Double Whopper', brand: 'Burger King', cat: 'Fast Food', sub: 'Burger', cal: 386, p: 22, c: 21, f: 23, fib: 1.5, servings: [S.adet(285, '1 adet'), S.g100], aliases: ['double whopper'] }),

  // ── Pizza ────────────────────────────────────────────────
  food({ id: 'cat-pizza-margherita', name: 'Pizza Margherita (1 Dilim)', cat: 'Fast Food', sub: 'Pizza', cal: 230, p: 10, c: 28, f: 9, fib: 1.5, servings: [S.dilim(120, '1 dilim'), S.custom('2 dilim', 'dilim', 240), S.g100], aliases: ['margherita', 'margarita pizza', 'plain pizza'] }),
  food({ id: 'cat-pizza-pepperoni', name: 'Pepperoni Pizza (1 Dilim)', cat: 'Fast Food', sub: 'Pizza', cal: 275, p: 12, c: 28, f: 13, fib: 1.5, servings: [S.dilim(130, '1 dilim'), S.custom('2 dilim', 'dilim', 260), S.g100], aliases: ['pepperoni pizza', 'pepperoni'] }),
  food({ id: 'cat-pizza-karisik', name: 'Karışık Pizza (1 Dilim)', cat: 'Fast Food', sub: 'Pizza', cal: 260, p: 11, c: 27, f: 12, fib: 1.5, servings: [S.dilim(140, '1 dilim'), S.custom('2 dilim', 'dilim', 280), S.g100], aliases: ['mixed pizza', 'supreme pizza', 'karisik pizza'] }),

  // ── Patates ──────────────────────────────────────────────
  food({ id: 'cat-patates-kizartma', name: 'Patates Kızartması', cat: 'Fast Food', sub: 'Patates', cal: 312, p: 3.4, c: 41, f: 15, fib: 3.8, servings: [S.g100, S.porsiyon(100, 'Küçük boy'), S.porsiyon(150, 'Orta boy'), S.porsiyon(200, 'Büyük boy')], aliases: ['french fries', 'fries', 'patates kizartmasi', 'chips'] }),
  food({ id: 'cat-sogan-halkasi', name: 'Soğan Halkası', cat: 'Fast Food', sub: 'Kızartma', cal: 330, p: 4, c: 38, f: 18, fib: 2, servings: [S.g100, S.porsiyon(100, '6-8 adet')], aliases: ['onion rings', 'sogan halkasi'] }),

  // ── Sandviç & Wrap ───────────────────────────────────────
  food({ id: 'cat-sandvic-tavuk', name: 'Tavuklu Sandviç', cat: 'Fast Food', sub: 'Sandviç', cal: 230, p: 14, c: 22, f: 10, fib: 1.5, servings: [S.adet(180, '1 adet'), S.g100], aliases: ['chicken sandwich', 'tavuk sandvic'] }),
  food({ id: 'cat-wrap-tavuk', name: 'Tavuklu Wrap', cat: 'Fast Food', sub: 'Sandviç', cal: 211, p: 12.2, c: 19.4, f: 8.9, fib: 1.5, servings: [S.adet(180, '1 adet'), S.g100], aliases: ['chicken wrap', 'tavuk wrap', 'wrap'] }),
  food({ id: 'cat-hot-dog', name: 'Hot Dog', cat: 'Fast Food', sub: 'Sandviç', cal: 247, p: 9, c: 22, f: 13.5, fib: 1, servings: [S.adet(100, '1 adet'), S.g100], aliases: ['hot dog', 'hotdog', 'sosisli sandvic'] }),
]
