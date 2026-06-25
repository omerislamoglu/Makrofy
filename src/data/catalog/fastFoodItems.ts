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
  food({ id: 'cat-whopper', name: 'Whopper', brand: 'Burger King', cat: 'Fast Food', sub: 'Burger', cal: 231, p: 10, c: 16, f: 14, fib: 1, servings: [S.adet(291, '1 adet'), S.g100], aliases: ['whopper', 'burger king whopper'] }),
  food({ id: 'cat-double-whopper', name: 'Double Whopper', brand: 'Burger King', cat: 'Fast Food', sub: 'Burger', cal: 241, p: 14, c: 13, f: 16, fib: 1, servings: [S.adet(374, '1 adet'), S.g100], aliases: ['double whopper'] }),

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

  // ── Çıtır Tavuk ──────────────────────────────────────────
  food({ id: 'cat-citir-tavuk', name: 'Çıtır Tavuk (Kızartma)', cat: 'Fast Food', sub: 'Tavuk', cal: 290, p: 22, c: 14, f: 17, fib: 0.5, servings: [S.g100, S.porsiyon(150, '1 porsiyon'), S.adet(80, '1 parça')], aliases: ['fried chicken', 'citir tavuk', 'crispy chicken'] }),
  food({ id: 'cat-popcorn-chicken', name: 'Popcorn Chicken', cat: 'Fast Food', sub: 'Tavuk', cal: 296, p: 16, c: 18, f: 18, fib: 0.5, servings: [S.g100, S.porsiyon(120, '1 porsiyon')], aliases: ['popcorn chicken', 'tavuk popcorn'] }),
  food({ id: 'cat-chicken-tenders', name: 'Chicken Tenders', cat: 'Fast Food', sub: 'Tavuk', cal: 271, p: 17, c: 16, f: 15, fib: 0.5, servings: [S.adet(40, '1 adet'), S.custom('3 adet', 'adet', 120), S.g100], aliases: ['chicken tenders', 'chicken strips', 'tavuk strip'] }),
  food({ id: 'cat-mozzarella-stick', name: 'Mozzarella Stick', cat: 'Fast Food', sub: 'Kızartma', cal: 320, p: 13, c: 26, f: 18, fib: 1, servings: [S.adet(25, '1 adet'), S.custom('4 adet', 'adet', 100), S.g100], aliases: ['mozzarella sticks', 'cheese sticks'] }),

  // ── Burger & Sandviç (devam) ─────────────────────────────
  food({ id: 'cat-balik-burger', name: 'Balık Burger', cat: 'Fast Food', sub: 'Burger', cal: 240, p: 11, c: 24, f: 11, fib: 1.5, servings: [S.adet(160, '1 adet'), S.g100], aliases: ['fish burger', 'filet-o-fish', 'balik burger'] }),
  food({ id: 'cat-veggie-burger', name: 'Veggie Burger', cat: 'Fast Food', sub: 'Burger', cal: 215, p: 9, c: 28, f: 8, fib: 4, servings: [S.adet(170, '1 adet'), S.g100], aliases: ['veggie burger', 'vegetarian burger', 'sebze burger'] }),
  food({ id: 'cat-club-sandvic', name: 'Club Sandviç', cat: 'Fast Food', sub: 'Sandviç', cal: 230, p: 13, c: 20, f: 11, fib: 1.5, servings: [S.adet(250, '1 adet'), S.g100], aliases: ['club sandwich', 'kulüp sandvic'] }),

  // ── Patates & Kızartma (devam) ───────────────────────────
  food({ id: 'cat-fish-and-chips', name: 'Fish & Chips', cat: 'Fast Food', sub: 'Balık', cal: 230, p: 11, c: 24, f: 11, fib: 2, servings: [S.porsiyon(300, '1 porsiyon'), S.g100], aliases: ['fish and chips', 'balik patates'] }),
  food({ id: 'cat-loaded-fries', name: 'Loaded Fries (Soslu)', cat: 'Fast Food', sub: 'Patates', cal: 290, p: 7, c: 32, f: 15, fib: 3, servings: [S.porsiyon(250, '1 porsiyon'), S.g100], aliases: ['loaded fries', 'cheese fries', 'soslu patates'] }),
  food({ id: 'cat-chili-fries', name: 'Chili Fries', cat: 'Fast Food', sub: 'Patates', cal: 270, p: 8, c: 33, f: 12, fib: 3.5, servings: [S.porsiyon(250, '1 porsiyon'), S.g100], aliases: ['chili fries', 'acili patates'] }),
  food({ id: 'cat-corn-dog', name: 'Corn Dog', cat: 'Fast Food', sub: 'Sandviç', cal: 290, p: 9, c: 28, f: 16, fib: 1, servings: [S.adet(100, '1 adet'), S.g100], aliases: ['corn dog', 'corndog'] }),
  food({ id: 'cat-jalapeno-popper', name: 'Jalapeño Popper', cat: 'Fast Food', sub: 'Kızartma', cal: 240, p: 6, c: 20, f: 15, fib: 1.5, servings: [S.adet(22, '1 adet'), S.custom('4 adet', 'adet', 88), S.g100], aliases: ['jalapeno popper', 'jalapeno'] }),

  // ── Döner & Türk Fast Food ───────────────────────────────
  food({ id: 'cat-lahmacun-fast', name: 'Lahmacun', cat: 'Fast Food', sub: 'Pizza', cal: 210, p: 9, c: 27, f: 7, fib: 2, servings: [S.adet(170, '1 adet'), S.custom('2 adet', 'adet', 340), S.g100], aliases: ['lahmacun', 'turkish pizza'] }),
  food({ id: 'cat-pide-karisik', name: 'Pide (Karışık)', cat: 'Fast Food', sub: 'Pizza', cal: 220, p: 10, c: 25, f: 9, fib: 1.5, servings: [S.porsiyon(300, '1 dilim'), S.custom('tam boy', 'porsiyon', 600), S.g100], aliases: ['pide', 'turkish pide', 'flatbread'] }),

  // ── Uluslararası Fast Food ───────────────────────────────
  food({ id: 'cat-chicken-wings', name: 'Tavuk Kanat (Buffalo)', cat: 'Fast Food', sub: 'Tavuk', cal: 247, p: 19, c: 4, f: 17, fib: 0.5, servings: [S.adet(30, '1 adet'), S.custom('6 adet', 'adet', 180), S.custom('12 adet', 'adet', 360), S.g100], aliases: ['chicken wings', 'buffalo wings', 'tavuk kanat'] }),
  food({ id: 'cat-doner-kebab', name: 'Döner Kebab (Ekmek Arası)', cat: 'Fast Food', sub: 'Döner', cal: 225, p: 13, c: 22, f: 10, fib: 1.5, servings: [S.adet(350, '1 adet'), S.g100], aliases: ['doner kebab', 'kebab sandwich'] }),
  food({ id: 'cat-gyros', name: 'Gyros', cat: 'Fast Food', sub: 'Sandwich', cal: 215, p: 12, c: 20, f: 10, fib: 1.5, servings: [S.adet(300, '1 adet'), S.g100], aliases: ['gyros', 'greek gyros'] }),
]
