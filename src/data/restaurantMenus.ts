/**
 * Fast food restaurant nutritional data.
 *
 * Sources:
 * - Burger King Türkiye: burgerking.com.tr/besin-degerleri (resmi site, Mayıs 2026)
 * - McDonald's: mcdonalds.com global nutritional calculator + TR menü eşleştirme
 * - Starbucks: starbucks.com nutritional info (global) + TR menü eşleştirme
 * - Subway: subway.com nutritional info (global) + TR porsiyon boyutları
 * - Domino's: dominos.com nutritional info (global, per slice/medium)
 * - KFC: kfc.com nutritional info (global) + TR menü eşleştirme
 * - Popeyes: popeyes.com nutritional info (global)
 * - Wendy's: wendys.com nutritional info (global)
 * - Simit Sarayı / Komagene / Mado: TR zincir ortalama porsiyon değerleri
 *
 * fiber: çoğu fast food restoranı lif değerini yayınlamıyor, 0 olarak bırakılan
 * yerlerde veri mevcut değildir.
 */

export interface RestaurantMenuItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  /** Porsiyon gramajı (varsa) */
  grams?: number
}

export interface RestaurantCategory {
  category: string
  items: RestaurantMenuItem[]
}

export interface Restaurant {
  id: string
  name: string
  logo: string // emoji as logo placeholder
  color: string // brand accent color
  categories: RestaurantCategory[]
}

// ─── Yardımcı: benzersiz ID üreteci ────────────────────────────────────────
let _idCounter = 0
function rid(prefix: string): string {
  return `${prefix}-${++_idCounter}`
}

// ═══════════════════════════════════════════════════════════════════════════════
// BURGER KING — Resmi burgerking.com.tr/besin-degerleri verileri
// ═══════════════════════════════════════════════════════════════════════════════

const burgerKing: Restaurant = {
  id: 'burger-king',
  name: 'Burger King',
  logo: '🍔',
  color: '#FF8800',
  categories: [
    {
      category: 'Burgerler',
      items: [
        { id: rid('bk'), name: 'Whopper', calories: 765, protein: 30, carbs: 58, fat: 66, fiber: 2 },
        { id: rid('bk'), name: 'Double Whopper', calories: 1100, protein: 51, carbs: 59, fat: 73, fiber: 2 },
        { id: rid('bk'), name: 'Whopper Jr.', calories: 332, protein: 11, carbs: 34, fat: 25, fiber: 1 },
        { id: rid('bk'), name: 'Rodeo Whopper', calories: 988, protein: 38, carbs: 60, fat: 87, fiber: 2 },
        { id: rid('bk'), name: 'Big King', calories: 601, protein: 29, carbs: 44, fat: 47, fiber: 2 },
        { id: rid('bk'), name: 'Big King XXL', calories: 1205, protein: 60, carbs: 57, fat: 82, fiber: 2 },
        { id: rid('bk'), name: 'King Beef Burger', calories: 1283, protein: 47, carbs: 51, fat: 120, fiber: 2 },
        { id: rid('bk'), name: 'BK Steakhouse', calories: 938, protein: 36, carbs: 61, fat: 61, fiber: 2 },
        { id: rid('bk'), name: 'Texas Smokehouse', calories: 899, protein: 47, carbs: 67, fat: 49, fiber: 3 },
        { id: rid('bk'), name: 'Hamburger', calories: 246, protein: 11, carbs: 29, fat: 15, fiber: 1 },
        { id: rid('bk'), name: 'Cheeseburger', calories: 292, protein: 13, carbs: 30, fat: 21, fiber: 1 },
        { id: rid('bk'), name: 'Double Cheeseburger', calories: 465, protein: 29, carbs: 30, fat: 26, fiber: 1 },
        { id: rid('bk'), name: 'Mega Double Cheeseburger', calories: 1024, protein: 55, carbs: 58, fat: 64, fiber: 2 },
        { id: rid('bk'), name: 'Köfteburger', calories: 358, protein: 12, carbs: 29, fat: 22, fiber: 1 },
        { id: rid('bk'), name: 'Chicken Royale', calories: 595, protein: 21, carbs: 45, fat: 42, fiber: 2 },
        { id: rid('bk'), name: 'King Chicken', calories: 491, protein: 19, carbs: 40, fat: 33, fiber: 2 },
        { id: rid('bk'), name: 'Tavukburger', calories: 436, protein: 16, carbs: 34, fat: 30, fiber: 1 },
        { id: rid('bk'), name: 'Chicken Big King', calories: 671, protein: 28, carbs: 55, fat: 37, fiber: 2 },
        { id: rid('bk'), name: 'Klasik Gurme Tavuk', calories: 699, protein: 32, carbs: 62, fat: 45, fiber: 2 },
        { id: rid('bk'), name: 'Spicy Gurme Tavuk', calories: 632, protein: 32, carbs: 63, fat: 37, fiber: 2 },
        { id: rid('bk'), name: 'Fish Royale', calories: 515, protein: 18, carbs: 53, fat: 33, fiber: 2 },
        { id: rid('bk'), name: 'Plant-Based Whopper', calories: 583, protein: 24, carbs: 57, fat: 36, fiber: 4 },
      ],
    },
    {
      category: 'Çıtır Lezzetler',
      items: [
        { id: rid('bk'), name: 'Patates (Küçük)', calories: 214, protein: 2, carbs: 30, fat: 9, fiber: 2 },
        { id: rid('bk'), name: 'Patates (Orta)', calories: 335, protein: 4, carbs: 47, fat: 15, fiber: 3 },
        { id: rid('bk'), name: 'Patates (Büyük)', calories: 410, protein: 5, carbs: 57, fat: 18, fiber: 4 },
        { id: rid('bk'), name: 'Patates (King Boy)', calories: 491, protein: 6, carbs: 69, fat: 22, fiber: 5 },
        { id: rid('bk'), name: 'Soğan Halkası (8\'li)', calories: 259, protein: 4, carbs: 32, fat: 13, fiber: 2 },
        { id: rid('bk'), name: 'Soğan Halkası (12\'li)', calories: 388, protein: 6, carbs: 48, fat: 19, fiber: 3 },
        { id: rid('bk'), name: 'Nuggets (6\'lı)', calories: 206, protein: 15, carbs: 9, fat: 12, fiber: 0 },
        { id: rid('bk'), name: 'Nuggets (9\'lu)', calories: 309, protein: 23, carbs: 14, fat: 18, fiber: 0 },
        { id: rid('bk'), name: 'Chicken Tenders (6\'lı)', calories: 237, protein: 12, carbs: 17, fat: 13, fiber: 1 },
        { id: rid('bk'), name: 'Chicken Tenders (9\'lu)', calories: 356, protein: 19, carbs: 25, fat: 20, fiber: 1 },
        { id: rid('bk'), name: 'Çıtır Peynir (6\'lı)', calories: 414, protein: 16, carbs: 31, fat: 25, fiber: 1 },
      ],
    },
    {
      category: 'Tatlılar',
      items: [
        { id: rid('bk'), name: 'Sufle', calories: 477, protein: 6, carbs: 42, fat: 32, fiber: 1 },
        { id: rid('bk'), name: 'Çikolatalı Cookie', calories: 210, protein: 3, carbs: 25, fat: 11, fiber: 1 },
        { id: rid('bk'), name: 'Elmalı Tatlı', calories: 450, protein: 3, carbs: 64, fat: 20, fiber: 2 },
        { id: rid('bk'), name: 'Vişneli Tatlı', calories: 194, protein: 2, carbs: 32, fat: 6, fiber: 1 },
        { id: rid('bk'), name: 'Sundae (Çikolata)', calories: 254, protein: 5, carbs: 38, fat: 9, fiber: 0 },
        { id: rid('bk'), name: 'Sundae (Karamel)', calories: 247, protein: 4, carbs: 42, fat: 7, fiber: 0 },
        { id: rid('bk'), name: 'Külah Dondurma', calories: 130, protein: 2, carbs: 21, fat: 4, fiber: 0 },
      ],
    },
    {
      category: 'İçecekler',
      items: [
        { id: rid('bk'), name: 'Ayran (300ml)', calories: 107, protein: 9, carbs: 8, fat: 5, fiber: 0 },
        { id: rid('bk'), name: 'Coca-Cola (Orta)', calories: 180, protein: 0, carbs: 45, fat: 0, fiber: 0 },
        { id: rid('bk'), name: 'Coca-Cola Zero (Orta)', calories: 1, protein: 0, carbs: 0, fat: 0, fiber: 0 },
        { id: rid('bk'), name: 'Fanta (Orta)', calories: 120, protein: 0, carbs: 29, fat: 0, fiber: 0 },
        { id: rid('bk'), name: 'Fuse Tea Şeftali (Orta)', calories: 80, protein: 0, carbs: 19, fat: 0, fiber: 0 },
      ],
    },
    {
      category: 'Kahvaltı',
      items: [
        { id: rid('bk'), name: '2 Peynirli Brioche Tost', calories: 437, protein: 19, carbs: 49, fat: 19, fiber: 1 },
        { id: rid('bk'), name: 'Panini Füme Etli Tost', calories: 604, protein: 26, carbs: 49, fat: 33, fiber: 1 },
        { id: rid('bk'), name: 'Panini Kavurmalı Tost', calories: 625, protein: 21, carbs: 49, fat: 37, fiber: 1 },
        { id: rid('bk'), name: 'Çift Peynirli BK Tost', calories: 249, protein: 12, carbs: 26, fat: 11, fiber: 0 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// McDONALD'S — Global nutrition calculator verileri, TR menüye eşleştirildi
// ═══════════════════════════════════════════════════════════════════════════════

const mcdonalds: Restaurant = {
  id: 'mcdonalds',
  name: "McDonald's",
  logo: '🍟',
  color: '#FFC72C',
  categories: [
    {
      category: 'Burgerler',
      items: [
        { id: rid('mc'), name: 'Big Mac', calories: 550, protein: 25, carbs: 45, fat: 30, fiber: 3 },
        { id: rid('mc'), name: 'Double Big Mac', calories: 740, protein: 43, carbs: 46, fat: 43, fiber: 3 },
        { id: rid('mc'), name: 'Quarter Pounder', calories: 520, protein: 30, carbs: 42, fat: 26, fiber: 2 },
        { id: rid('mc'), name: 'McChicken', calories: 400, protein: 14, carbs: 39, fat: 21, fiber: 2 },
        { id: rid('mc'), name: 'Çıtır Tavuk Burger', calories: 470, protein: 18, carbs: 46, fat: 24, fiber: 2 },
        { id: rid('mc'), name: 'Cheeseburger', calories: 300, protein: 15, carbs: 32, fat: 13, fiber: 1 },
        { id: rid('mc'), name: 'Double Cheeseburger', calories: 450, protein: 25, carbs: 34, fat: 24, fiber: 2 },
        { id: rid('mc'), name: 'Triple Cheeseburger', calories: 590, protein: 36, carbs: 35, fat: 34, fiber: 2 },
        { id: rid('mc'), name: 'Hamburger', calories: 250, protein: 12, carbs: 31, fat: 9, fiber: 1 },
        { id: rid('mc'), name: 'McRoyal', calories: 520, protein: 28, carbs: 40, fat: 28, fiber: 2 },
        { id: rid('mc'), name: 'McRoyal Deluxe', calories: 580, protein: 29, carbs: 44, fat: 32, fiber: 3 },
        { id: rid('mc'), name: 'Filet-O-Fish', calories: 390, protein: 16, carbs: 39, fat: 19, fiber: 2 },
      ],
    },
    {
      category: 'Çıtır Lezzetler',
      items: [
        { id: rid('mc'), name: 'Patates (Küçük)', calories: 220, protein: 3, carbs: 29, fat: 11, fiber: 2 },
        { id: rid('mc'), name: 'Patates (Orta)', calories: 320, protein: 4, carbs: 43, fat: 15, fiber: 4 },
        { id: rid('mc'), name: 'Patates (Büyük)', calories: 430, protein: 5, carbs: 57, fat: 20, fiber: 5 },
        { id: rid('mc'), name: 'McNuggets (6\'lı)', calories: 250, protein: 15, carbs: 15, fat: 15, fiber: 1 },
        { id: rid('mc'), name: 'McNuggets (9\'lu)', calories: 380, protein: 22, carbs: 23, fat: 22, fiber: 1 },
        { id: rid('mc'), name: 'McNuggets (20\'li)', calories: 830, protein: 49, carbs: 51, fat: 49, fiber: 2 },
      ],
    },
    {
      category: 'Tatlılar',
      items: [
        { id: rid('mc'), name: 'McFlurry Oreo', calories: 510, protein: 11, carbs: 72, fat: 19, fiber: 1 },
        { id: rid('mc'), name: 'McFlurry M&M', calories: 620, protein: 13, carbs: 89, fat: 23, fiber: 1 },
        { id: rid('mc'), name: 'Sundae (Çikolata)', calories: 340, protein: 8, carbs: 52, fat: 11, fiber: 1 },
        { id: rid('mc'), name: 'Sundae (Karamel)', calories: 330, protein: 7, carbs: 53, fat: 10, fiber: 0 },
        { id: rid('mc'), name: 'Elmalı Turta', calories: 230, protein: 2, carbs: 32, fat: 11, fiber: 1 },
        { id: rid('mc'), name: 'Çikolatalı Cookie', calories: 170, protein: 2, carbs: 22, fat: 8, fiber: 1 },
      ],
    },
    {
      category: 'Kahvaltı',
      items: [
        { id: rid('mc'), name: 'McMuffin (Yumurtalı)', calories: 300, protein: 17, carbs: 29, fat: 13, fiber: 2 },
        { id: rid('mc'), name: 'McMuffin (Sosis)', calories: 400, protein: 14, carbs: 29, fat: 25, fiber: 2 },
        { id: rid('mc'), name: 'McToast', calories: 340, protein: 16, carbs: 28, fat: 18, fiber: 1 },
        { id: rid('mc'), name: 'Pancake (3\'lü)', calories: 350, protein: 9, carbs: 58, fat: 9, fiber: 2 },
      ],
    },
    {
      category: 'İçecekler',
      items: [
        { id: rid('mc'), name: 'Coca-Cola (Orta)', calories: 180, protein: 0, carbs: 45, fat: 0, fiber: 0 },
        { id: rid('mc'), name: 'Coca-Cola Zero (Orta)', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
        { id: rid('mc'), name: 'Fanta (Orta)', calories: 150, protein: 0, carbs: 37, fat: 0, fiber: 0 },
        { id: rid('mc'), name: 'Ayran', calories: 70, protein: 6, carbs: 5, fat: 3, fiber: 0 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// STARBUCKS — Global Starbucks nutrition data, TR menüye eşleştirildi
// ═══════════════════════════════════════════════════════════════════════════════

const starbucks: Restaurant = {
  id: 'starbucks',
  name: 'Starbucks',
  logo: '☕',
  color: '#00704A',
  categories: [
    {
      category: 'Kahveler',
      items: [
        { id: rid('sb'), name: 'Caffè Latte (Grande)', calories: 190, protein: 13, carbs: 19, fat: 7, fiber: 0 },
        { id: rid('sb'), name: 'Cappuccino (Grande)', calories: 140, protein: 10, carbs: 14, fat: 5, fiber: 0 },
        { id: rid('sb'), name: 'Caramel Macchiato (Grande)', calories: 250, protein: 10, carbs: 35, fat: 7, fiber: 0 },
        { id: rid('sb'), name: 'Mocha (Grande)', calories: 360, protein: 14, carbs: 50, fat: 13, fiber: 2 },
        { id: rid('sb'), name: 'White Mocha (Grande)', calories: 420, protein: 14, carbs: 55, fat: 16, fiber: 0 },
        { id: rid('sb'), name: 'Americano (Grande)', calories: 15, protein: 1, carbs: 2, fat: 0, fiber: 0 },
        { id: rid('sb'), name: 'Espresso (Doppio)', calories: 10, protein: 1, carbs: 1, fat: 0, fiber: 0 },
        { id: rid('sb'), name: 'Flat White (Grande)', calories: 220, protein: 15, carbs: 18, fat: 11, fiber: 0 },
      ],
    },
    {
      category: 'Soğuk İçecekler',
      items: [
        { id: rid('sb'), name: 'Iced Caffe Latte (Grande)', calories: 130, protein: 8, carbs: 13, fat: 5, fiber: 0 },
        { id: rid('sb'), name: 'Iced Americano (Grande)', calories: 15, protein: 1, carbs: 2, fat: 0, fiber: 0 },
        { id: rid('sb'), name: 'Frappuccino Caramel (Grande)', calories: 380, protein: 5, carbs: 57, fat: 15, fiber: 0 },
        { id: rid('sb'), name: 'Frappuccino Mocha (Grande)', calories: 400, protein: 6, carbs: 61, fat: 15, fiber: 1 },
        { id: rid('sb'), name: 'Frappuccino Java Chip (Grande)', calories: 440, protein: 6, carbs: 65, fat: 18, fiber: 2 },
        { id: rid('sb'), name: 'Strawberry Açaí Refresha (Grande)', calories: 100, protein: 0, carbs: 24, fat: 0, fiber: 1 },
        { id: rid('sb'), name: 'Mango Dragonfruit Refresha (Grande)', calories: 90, protein: 0, carbs: 22, fat: 0, fiber: 1 },
      ],
    },
    {
      category: 'Yiyecekler',
      items: [
        { id: rid('sb'), name: 'Tavuklu Sandviç', calories: 420, protein: 28, carbs: 38, fat: 16, fiber: 3 },
        { id: rid('sb'), name: 'Hindi Füme Sandviç', calories: 390, protein: 25, carbs: 40, fat: 14, fiber: 3 },
        { id: rid('sb'), name: 'Peynirli Tost', calories: 340, protein: 14, carbs: 30, fat: 18, fiber: 1 },
        { id: rid('sb'), name: 'Çikolatalı Muffin', calories: 430, protein: 6, carbs: 57, fat: 20, fiber: 2 },
        { id: rid('sb'), name: 'Blueberry Muffin', calories: 380, protein: 5, carbs: 54, fat: 16, fiber: 1 },
        { id: rid('sb'), name: 'Cheesecake Dilimi', calories: 350, protein: 6, carbs: 34, fat: 21, fiber: 0 },
        { id: rid('sb'), name: 'Croissant', calories: 260, protein: 5, carbs: 31, fat: 14, fiber: 1 },
        { id: rid('sb'), name: 'Cookie (Çikolatalı)', calories: 310, protein: 4, carbs: 43, fat: 14, fiber: 2 },
        { id: rid('sb'), name: 'Banana Bread', calories: 390, protein: 5, carbs: 52, fat: 18, fiber: 1 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUBWAY — Global Subway nutrition data (30cm / Footlong)
// ═══════════════════════════════════════════════════════════════════════════════

const subway: Restaurant = {
  id: 'subway',
  name: 'Subway',
  logo: '🥖',
  color: '#008C15',
  categories: [
    {
      category: 'Sandviçler (30cm)',
      items: [
        { id: rid('sw'), name: 'Tavuk Teriyaki', calories: 530, protein: 36, carbs: 72, fat: 9, fiber: 5, grams: 365 },
        { id: rid('sw'), name: 'Italian B.M.T.', calories: 620, protein: 26, carbs: 70, fat: 26, fiber: 5, grams: 300 },
        { id: rid('sw'), name: 'Subway Club', calories: 520, protein: 32, carbs: 67, fat: 12, fiber: 5, grams: 350 },
        { id: rid('sw'), name: 'Ton Balığı', calories: 640, protein: 26, carbs: 68, fat: 28, fiber: 5, grams: 330 },
        { id: rid('sw'), name: 'Hindi & Jambon', calories: 460, protein: 26, carbs: 68, fat: 8, fiber: 5, grams: 340 },
        { id: rid('sw'), name: 'Tavuk Göğsü', calories: 480, protein: 30, carbs: 70, fat: 9, fiber: 5, grams: 340 },
        { id: rid('sw'), name: 'Steak & Cheese', calories: 600, protein: 36, carbs: 72, fat: 16, fiber: 5, grams: 370 },
        { id: rid('sw'), name: 'Veggie Delite', calories: 360, protein: 14, carbs: 66, fat: 5, fiber: 5, grams: 240 },
        { id: rid('sw'), name: 'Meatball Marinara', calories: 810, protein: 36, carbs: 88, fat: 34, fiber: 8, grams: 380 },
        { id: rid('sw'), name: 'Spicy Italian', calories: 660, protein: 24, carbs: 70, fat: 30, fiber: 5, grams: 300 },
      ],
    },
    {
      category: 'Sandviçler (15cm)',
      items: [
        { id: rid('sw'), name: 'Tavuk Teriyaki (15cm)', calories: 265, protein: 18, carbs: 36, fat: 5, fiber: 3, grams: 183 },
        { id: rid('sw'), name: 'Italian B.M.T. (15cm)', calories: 310, protein: 13, carbs: 35, fat: 13, fiber: 3, grams: 150 },
        { id: rid('sw'), name: 'Subway Club (15cm)', calories: 260, protein: 16, carbs: 34, fat: 6, fiber: 3, grams: 175 },
        { id: rid('sw'), name: 'Veggie Delite (15cm)', calories: 180, protein: 7, carbs: 33, fat: 3, fiber: 3, grams: 120 },
        { id: rid('sw'), name: 'Meatball Marinara (15cm)', calories: 405, protein: 18, carbs: 44, fat: 17, fiber: 4, grams: 190 },
      ],
    },
    {
      category: 'Ekstralar',
      items: [
        { id: rid('sw'), name: 'Cookie (Çikolata Parçacıklı)', calories: 210, protein: 2, carbs: 30, fat: 10, fiber: 1 },
        { id: rid('sw'), name: 'Cookie (Double Çikolata)', calories: 210, protein: 2, carbs: 30, fat: 10, fiber: 1 },
        { id: rid('sw'), name: 'Ayran', calories: 70, protein: 6, carbs: 5, fat: 3, fiber: 0 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOMINO'S — Global verileri, dilim başına (orta boy, klasik hamur)
// ═══════════════════════════════════════════════════════════════════════════════

const dominos: Restaurant = {
  id: 'dominos',
  name: "Domino's",
  logo: '🍕',
  color: '#006491',
  categories: [
    {
      category: 'Pizzalar (1 dilim / Orta Boy)',
      items: [
        { id: rid('dm'), name: 'Margarita (1 dilim)', calories: 200, protein: 9, carbs: 25, fat: 7, fiber: 2 },
        { id: rid('dm'), name: 'Pepperoni (1 dilim)', calories: 240, protein: 10, carbs: 26, fat: 10, fiber: 2 },
        { id: rid('dm'), name: 'Sucuklu (1 dilim)', calories: 260, protein: 11, carbs: 26, fat: 12, fiber: 2 },
        { id: rid('dm'), name: 'Karışık (1 dilim)', calories: 270, protein: 12, carbs: 27, fat: 13, fiber: 2 },
        { id: rid('dm'), name: 'BBQ Tavuk (1 dilim)', calories: 250, protein: 13, carbs: 28, fat: 9, fiber: 2 },
        { id: rid('dm'), name: 'Vejeteryan (1 dilim)', calories: 210, protein: 9, carbs: 27, fat: 7, fiber: 3 },
        { id: rid('dm'), name: '4 Peynirli (1 dilim)', calories: 280, protein: 13, carbs: 25, fat: 14, fiber: 1 },
        { id: rid('dm'), name: 'Ton Balıklı (1 dilim)', calories: 240, protein: 11, carbs: 26, fat: 10, fiber: 2 },
      ],
    },
    {
      category: 'Yan Ürünler',
      items: [
        { id: rid('dm'), name: 'Chicken Wings (8\'li)', calories: 480, protein: 36, carbs: 4, fat: 36, fiber: 0 },
        { id: rid('dm'), name: 'Chicken Kickers (8\'li)', calories: 420, protein: 28, carbs: 28, fat: 20, fiber: 2 },
        { id: rid('dm'), name: 'Çıtır Tavuk Parçaları (6\'lı)', calories: 320, protein: 18, carbs: 22, fat: 18, fiber: 1 },
        { id: rid('dm'), name: 'Peynirli Ekmek (4 parça)', calories: 340, protein: 12, carbs: 40, fat: 14, fiber: 2 },
        { id: rid('dm'), name: 'Sarımsaklı Ekmek (4 parça)', calories: 300, protein: 8, carbs: 38, fat: 14, fiber: 2 },
      ],
    },
    {
      category: 'Tatlılar',
      items: [
        { id: rid('dm'), name: 'Çikolatalı Lava Kek', calories: 350, protein: 4, carbs: 46, fat: 18, fiber: 2 },
        { id: rid('dm'), name: 'Çikolatalı Cookie (2\'li)', calories: 360, protein: 4, carbs: 48, fat: 18, fiber: 2 },
        { id: rid('dm'), name: 'Sufle', calories: 380, protein: 5, carbs: 44, fat: 20, fiber: 1 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// KFC — Global KFC nutrition data, TR menüye eşleştirildi
// ═══════════════════════════════════════════════════════════════════════════════

const kfc: Restaurant = {
  id: 'kfc',
  name: 'KFC',
  logo: '🍗',
  color: '#E4002B',
  categories: [
    {
      category: 'Tavuk',
      items: [
        { id: rid('kf'), name: 'Original Tavuk (1 parça)', calories: 260, protein: 19, carbs: 9, fat: 17, fiber: 0 },
        { id: rid('kf'), name: 'Crispy Tavuk (1 parça)', calories: 290, protein: 18, carbs: 12, fat: 19, fiber: 1 },
        { id: rid('kf'), name: 'Hot Wings (5\'li)', calories: 370, protein: 22, carbs: 14, fat: 25, fiber: 1 },
        { id: rid('kf'), name: 'Strips (3\'lü)', calories: 330, protein: 24, carbs: 18, fat: 18, fiber: 1 },
        { id: rid('kf'), name: 'Strips (5\'li)', calories: 550, protein: 40, carbs: 30, fat: 30, fiber: 2 },
        { id: rid('kf'), name: 'Popcorn Chicken (Küçük)', calories: 280, protein: 16, carbs: 16, fat: 17, fiber: 1 },
        { id: rid('kf'), name: 'Popcorn Chicken (Büyük)', calories: 560, protein: 32, carbs: 32, fat: 34, fiber: 2 },
      ],
    },
    {
      category: 'Burgerler & Wrap',
      items: [
        { id: rid('kf'), name: 'Zinger Burger', calories: 490, protein: 24, carbs: 42, fat: 25, fiber: 2 },
        { id: rid('kf'), name: 'Double Zinger', calories: 680, protein: 40, carbs: 44, fat: 38, fiber: 2 },
        { id: rid('kf'), name: 'Tower Burger', calories: 620, protein: 27, carbs: 50, fat: 34, fiber: 3 },
        { id: rid('kf'), name: 'Twister Wrap', calories: 520, protein: 22, carbs: 46, fat: 28, fiber: 3 },
        { id: rid('kf'), name: 'Chicken Burger', calories: 380, protein: 18, carbs: 36, fat: 18, fiber: 2 },
        { id: rid('kf'), name: 'Kentucky Burger', calories: 550, protein: 28, carbs: 40, fat: 30, fiber: 2 },
      ],
    },
    {
      category: 'Yan Ürünler',
      items: [
        { id: rid('kf'), name: 'Patates (Orta)', calories: 320, protein: 4, carbs: 42, fat: 15, fiber: 4 },
        { id: rid('kf'), name: 'Patates (Büyük)', calories: 430, protein: 6, carbs: 56, fat: 20, fiber: 5 },
        { id: rid('kf'), name: 'Coleslaw (Küçük)', calories: 140, protein: 1, carbs: 14, fat: 9, fiber: 2 },
        { id: rid('kf'), name: 'Mısır (Büyük)', calories: 160, protein: 5, carbs: 28, fat: 4, fiber: 4 },
        { id: rid('kf'), name: 'Biscuit', calories: 180, protein: 4, carbs: 22, fat: 8, fiber: 1 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// POPEYES — Global Popeyes nutrition data
// ═══════════════════════════════════════════════════════════════════════════════

const popeyes: Restaurant = {
  id: 'popeyes',
  name: 'Popeyes',
  logo: '🐔',
  color: '#FF6600',
  categories: [
    {
      category: 'Bonafide Tavuk',
      items: [
        { id: rid('pp'), name: 'Klasik Tavuk – Göğüs (1 parça)', calories: 380, protein: 33, carbs: 16, fat: 20, fiber: 1 },
        { id: rid('pp'), name: 'Klasik Tavuk – But (1 parça)', calories: 280, protein: 15, carbs: 9, fat: 20, fiber: 0 },
        { id: rid('pp'), name: 'Klasik Tavuk – Baget (1 parça)', calories: 160, protein: 12, carbs: 5, fat: 9, fiber: 0 },
        { id: rid('pp'), name: 'Klasik Tavuk – Kanat (1 parça)', calories: 150, protein: 9, carbs: 5, fat: 10, fiber: 0 },
        { id: rid('pp'), name: 'Acılı Tavuk – Göğüs (1 parça)', calories: 390, protein: 33, carbs: 17, fat: 21, fiber: 1 },
        { id: rid('pp'), name: 'Acılı Tavuk – But (1 parça)', calories: 290, protein: 15, carbs: 10, fat: 20, fiber: 1 },
        { id: rid('pp'), name: '3 Parça Tavuk Menü (göğüs+but+baget)', calories: 820, protein: 60, carbs: 30, fat: 49, fiber: 1, grams: 380 },
      ],
    },
    {
      category: 'Çıtır & Deniz',
      items: [
        { id: rid('pp'), name: 'Chicken Tenders (3\'lü)', calories: 340, protein: 22, carbs: 20, fat: 19, fiber: 1 },
        { id: rid('pp'), name: 'Chicken Tenders (5\'li)', calories: 570, protein: 37, carbs: 34, fat: 31, fiber: 2 },
        { id: rid('pp'), name: 'Nuggets (8\'li)', calories: 360, protein: 18, carbs: 22, fat: 22, fiber: 1 },
        { id: rid('pp'), name: 'Nuggets (12\'li)', calories: 540, protein: 27, carbs: 33, fat: 33, fiber: 2 },
        { id: rid('pp'), name: 'Ghost Pepper Wings (6\'lı)', calories: 480, protein: 28, carbs: 22, fat: 31, fiber: 1 },
        { id: rid('pp'), name: 'Popcorn Shrimp (Normal)', calories: 330, protein: 14, carbs: 26, fat: 20, fiber: 1 },
        { id: rid('pp'), name: 'Butterfly Shrimp (8\'li)', calories: 240, protein: 12, carbs: 20, fat: 13, fiber: 1 },
      ],
    },
    {
      category: 'Sandviç & Dürüm',
      items: [
        { id: rid('pp'), name: 'Chicken Sandwich (Klasik)', calories: 700, protein: 28, carbs: 50, fat: 42, fiber: 2 },
        { id: rid('pp'), name: 'Chicken Sandwich (Acılı)', calories: 700, protein: 28, carbs: 50, fat: 42, fiber: 2 },
        { id: rid('pp'), name: 'Chicken Sandwich Deluxe (Bacon & Cheese)', calories: 870, protein: 38, carbs: 51, fat: 57, fiber: 2 },
        { id: rid('pp'), name: 'Fish Sandwich', calories: 590, protein: 22, carbs: 52, fat: 32, fiber: 2 },
        { id: rid('pp'), name: 'Tavuklu Wrap (Tender Wrap)', calories: 420, protein: 20, carbs: 38, fat: 21, fiber: 2 },
      ],
    },
    {
      category: 'Yan Ürünler',
      items: [
        { id: rid('pp'), name: 'Cajun Patates (Normal)', calories: 260, protein: 3, carbs: 36, fat: 12, fiber: 3 },
        { id: rid('pp'), name: 'Cajun Patates (Büyük)', calories: 430, protein: 5, carbs: 60, fat: 20, fiber: 5 },
        { id: rid('pp'), name: 'Mac & Cheese', calories: 230, protein: 8, carbs: 19, fat: 14, fiber: 1 },
        { id: rid('pp'), name: 'Püre + Cajun Soslu (Mashed Potatoes)', calories: 130, protein: 3, carbs: 18, fat: 5, fiber: 1 },
        { id: rid('pp'), name: 'Coleslaw', calories: 200, protein: 1, carbs: 15, fat: 16, fiber: 2 },
        { id: rid('pp'), name: 'Mısır Koçanı', calories: 190, protein: 4, carbs: 22, fat: 10, fiber: 2 },
        { id: rid('pp'), name: 'Red Beans & Rice', calories: 230, protein: 9, carbs: 32, fat: 7, fiber: 5 },
        { id: rid('pp'), name: 'Biscuit (Galeta)', calories: 190, protein: 4, carbs: 26, fat: 8, fiber: 1 },
      ],
    },
    {
      category: 'Tatlılar',
      items: [
        { id: rid('pp'), name: 'Cinnamon Apple Pie', calories: 220, protein: 2, carbs: 30, fat: 10, fiber: 1 },
        { id: rid('pp'), name: 'Chocolate Beignets (3\'lü)', calories: 290, protein: 5, carbs: 38, fat: 14, fiber: 2 },
        { id: rid('pp'), name: 'Strawberry Biscuit', calories: 290, protein: 4, carbs: 42, fat: 12, fiber: 1 },
      ],
    },
    {
      category: 'İçecekler',
      items: [
        { id: rid('pp'), name: 'Coca-Cola (Orta)', calories: 180, protein: 0, carbs: 45, fat: 0, fiber: 0 },
        { id: rid('pp'), name: 'Coca-Cola Zero (Orta)', calories: 1, protein: 0, carbs: 0, fat: 0, fiber: 0 },
        { id: rid('pp'), name: 'Fanta (Orta)', calories: 160, protein: 0, carbs: 44, fat: 0, fiber: 0 },
        { id: rid('pp'), name: 'Ayran (300ml)', calories: 107, protein: 9, carbs: 8, fat: 5, fiber: 0 },
        { id: rid('pp'), name: 'Su (500ml)', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// Export
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// CARL'S JR. — fastfoodnutrition.org verileri
// ═══════════════════════════════════════════════════════════════════════════════

const carlsJr: Restaurant = {
  id: 'carls-jr',
  name: "Carl's Jr.",
  logo: '⭐',
  color: '#FFD700',
  categories: [
    {
      category: 'Burgerler',
      items: [
        { id: rid('cj'), name: 'Famous Star with Cheese', calories: 670, protein: 28, carbs: 57, fat: 37, fiber: 3, grams: 286 },
        { id: rid('cj'), name: 'Super Star with Cheese', calories: 940, protein: 48, carbs: 59, fat: 57, fiber: 3, grams: 392 },
        { id: rid('cj'), name: 'Western Bacon Cheeseburger', calories: 740, protein: 33, carbs: 74, fat: 34, fiber: 4, grams: 268 },
        { id: rid('cj'), name: 'Double Western Bacon', calories: 1020, protein: 53, carbs: 75, fat: 56, fiber: 4, grams: 378 },
        { id: rid('cj'), name: 'Big Hamburger', calories: 480, protein: 24, carbs: 47, fat: 22, fiber: 3 },
        { id: rid('cj'), name: 'Big Cheeseburger', calories: 530, protein: 27, carbs: 48, fat: 26, fiber: 3 },
        { id: rid('cj'), name: 'Jalapeño Burger', calories: 730, protein: 30, carbs: 53, fat: 44, fiber: 3 },
        { id: rid('cj'), name: 'BBQ Ranch Burger', calories: 710, protein: 28, carbs: 60, fat: 39, fiber: 3 },
        { id: rid('cj'), name: 'Guacamole Bacon Burger', calories: 780, protein: 32, carbs: 55, fat: 46, fiber: 5 },
      ],
    },
    {
      category: 'Tavuk',
      items: [
        { id: rid('cj'), name: 'Charbroiled BBQ Chicken Sandwich', calories: 390, protein: 34, carbs: 48, fat: 7, fiber: 3 },
        { id: rid('cj'), name: 'Spicy Chicken Sandwich', calories: 460, protein: 16, carbs: 45, fat: 24, fiber: 3 },
        { id: rid('cj'), name: 'Hand-Breaded Chicken Tenders (3\'lü)', calories: 330, protein: 23, carbs: 18, fat: 18, fiber: 1 },
        { id: rid('cj'), name: 'Hand-Breaded Chicken Tenders (5\'li)', calories: 550, protein: 39, carbs: 30, fat: 30, fiber: 2 },
      ],
    },
    {
      category: 'Yan Ürünler',
      items: [
        { id: rid('cj'), name: 'Natural-Cut Fries (Küçük)', calories: 300, protein: 4, carbs: 37, fat: 15, fiber: 3 },
        { id: rid('cj'), name: 'Natural-Cut Fries (Orta)', calories: 430, protein: 6, carbs: 53, fat: 22, fiber: 4 },
        { id: rid('cj'), name: 'Natural-Cut Fries (Büyük)', calories: 550, protein: 7, carbs: 67, fat: 28, fiber: 6 },
        { id: rid('cj'), name: 'Onion Rings (Küçük)', calories: 320, protein: 5, carbs: 40, fat: 16, fiber: 2 },
        { id: rid('cj'), name: 'CrissCut Fries (Küçük)', calories: 340, protein: 3, carbs: 37, fat: 20, fiber: 3 },
      ],
    },
    {
      category: 'Tatlılar & İçecekler',
      items: [
        { id: rid('cj'), name: 'Chocolate Shake (Orta)', calories: 700, protein: 15, carbs: 82, fat: 34, fiber: 1 },
        { id: rid('cj'), name: 'Vanilla Shake (Orta)', calories: 680, protein: 15, carbs: 76, fat: 34, fiber: 0 },
        { id: rid('cj'), name: 'Strawberry Shake (Orta)', calories: 690, protein: 14, carbs: 79, fat: 34, fiber: 0 },
        { id: rid('cj'), name: 'Chocolate Chip Cookie', calories: 350, protein: 4, carbs: 46, fat: 17, fiber: 2 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// LITTLE CAESARS — fastfoodnutrition.org verileri (dilim başına)
// ═══════════════════════════════════════════════════════════════════════════════

const littleCaesars: Restaurant = {
  id: 'little-caesars',
  name: 'Little Caesars',
  logo: '🏛️',
  color: '#F26522',
  categories: [
    {
      category: 'Pizzalar (1 dilim)',
      items: [
        { id: rid('lc'), name: 'Peynirli Pizza (1 dilim)', calories: 244, protein: 12, carbs: 31, fat: 8, fiber: 2 },
        { id: rid('lc'), name: 'Pepperoni Pizza (1 dilim)', calories: 276, protein: 13, carbs: 31, fat: 11, fiber: 2 },
        { id: rid('lc'), name: 'Sosis & Pepperoni (1 dilim)', calories: 290, protein: 14, carbs: 31, fat: 13, fiber: 2 },
        { id: rid('lc'), name: 'Veggie Pizza (1 dilim)', calories: 250, protein: 11, carbs: 32, fat: 9, fiber: 2 },
        { id: rid('lc'), name: '3 Meat Treat (1 dilim)', calories: 300, protein: 15, carbs: 30, fat: 14, fiber: 2 },
        { id: rid('lc'), name: 'Ultimate Supreme (1 dilim)', calories: 290, protein: 14, carbs: 31, fat: 12, fiber: 2 },
        { id: rid('lc'), name: 'Hula Hawaiian (1 dilim)', calories: 260, protein: 13, carbs: 33, fat: 9, fiber: 2 },
        { id: rid('lc'), name: 'ExtraMostBestest Pepperoni (1 dilim)', calories: 320, protein: 16, carbs: 31, fat: 15, fiber: 2 },
        { id: rid('lc'), name: 'Deep Dish Pepperoni (1 dilim)', calories: 360, protein: 15, carbs: 38, fat: 17, fiber: 2 },
        { id: rid('lc'), name: 'Thin Crust Pepperoni (1 dilim)', calories: 200, protein: 10, carbs: 17, fat: 10, fiber: 1 },
      ],
    },
    {
      category: 'Yan Ürünler',
      items: [
        { id: rid('lc'), name: 'Crazy Bread (1 adet)', calories: 100, protein: 3, carbs: 15, fat: 3, fiber: 1 },
        { id: rid('lc'), name: 'Italian Cheese Bread (1 adet)', calories: 140, protein: 6, carbs: 15, fat: 6, fiber: 1 },
        { id: rid('lc'), name: 'Caesar Wings (BBQ, 1 adet)', calories: 80, protein: 6, carbs: 4, fat: 4, fiber: 0 },
        { id: rid('lc'), name: 'Caesar Wings (Buffalo, 1 adet)', calories: 70, protein: 6, carbs: 1, fat: 5, fiber: 0 },
        { id: rid('lc'), name: 'Pepperoni Cheese Bread (1 adet)', calories: 150, protein: 7, carbs: 15, fat: 7, fiber: 1 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOYUYO — Türk dürüm zinciri, genel dürüm beslenme verileri
// (Resmi site besin değeri yayınlamıyor, USDA eşdeğer besin hesaplaması)
// ═══════════════════════════════════════════════════════════════════════════════

const doyuyo: Restaurant = {
  id: 'doyuyo',
  name: 'Doyuyo Dürüm',
  logo: '🌯',
  color: '#C62828',
  categories: [
    {
      category: 'Dürümler',
      items: [
        { id: rid('dy'), name: 'Tavuk Dürüm', calories: 480, protein: 30, carbs: 42, fat: 20, fiber: 3, grams: 300 },
        { id: rid('dy'), name: 'Adana Dürüm', calories: 550, protein: 26, carbs: 44, fat: 30, fiber: 3, grams: 320 },
        { id: rid('dy'), name: 'Döner Dürüm', calories: 520, protein: 28, carbs: 42, fat: 26, fiber: 2, grams: 310 },
        { id: rid('dy'), name: 'Karışık Dürüm', calories: 570, protein: 32, carbs: 44, fat: 28, fiber: 3, grams: 340 },
        { id: rid('dy'), name: 'Köfte Dürüm', calories: 510, protein: 24, carbs: 45, fat: 24, fiber: 3, grams: 300 },
        { id: rid('dy'), name: 'Tantuni Dürüm', calories: 460, protein: 28, carbs: 40, fat: 20, fiber: 3, grams: 280 },
        { id: rid('dy'), name: 'Kaşarlı Tavuk Dürüm', calories: 540, protein: 32, carbs: 44, fat: 26, fiber: 2, grams: 320 },
        { id: rid('dy'), name: 'Acılı Tavuk Dürüm', calories: 490, protein: 30, carbs: 42, fat: 22, fiber: 3, grams: 300 },
        { id: rid('dy'), name: 'Falafel Dürüm', calories: 420, protein: 14, carbs: 52, fat: 18, fiber: 6, grams: 280 },
      ],
    },
    {
      category: 'Yan Ürünler',
      items: [
        { id: rid('dy'), name: 'Patates Kızartması', calories: 320, protein: 4, carbs: 42, fat: 15, fiber: 3 },
        { id: rid('dy'), name: 'Soğan Halkası', calories: 280, protein: 4, carbs: 34, fat: 14, fiber: 2 },
        { id: rid('dy'), name: 'Ayran', calories: 70, protein: 6, carbs: 5, fat: 3, fiber: 0 },
        { id: rid('dy'), name: 'Şalgam', calories: 15, protein: 0, carbs: 3, fat: 0, fiber: 1 },
        { id: rid('dy'), name: 'Cacık', calories: 60, protein: 4, carbs: 4, fat: 3, fiber: 0 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// PIZZA HUT — Global nutrition data, dilim başına (orta boy, pan hamur)
// ═══════════════════════════════════════════════════════════════════════════════

const pizzaHut: Restaurant = {
  id: 'pizza-hut',
  name: 'Pizza Hut',
  logo: '🛖',
  color: '#EE3A23',
  categories: [
    {
      category: 'Pizzalar (1 dilim / Orta Boy)',
      items: [
        { id: rid('ph'), name: 'Cheese Lover\'s (1 dilim)', calories: 280, protein: 12, carbs: 29, fat: 13, fiber: 2 },
        { id: rid('ph'), name: 'Pepperoni Lover\'s (1 dilim)', calories: 300, protein: 14, carbs: 28, fat: 14, fiber: 2 },
        { id: rid('ph'), name: 'Meat Lover\'s (1 dilim)', calories: 340, protein: 16, carbs: 28, fat: 18, fiber: 2 },
        { id: rid('ph'), name: 'Supreme (1 dilim)', calories: 300, protein: 13, carbs: 29, fat: 15, fiber: 2 },
        { id: rid('ph'), name: 'Veggie Lover\'s (1 dilim)', calories: 240, protein: 10, carbs: 29, fat: 10, fiber: 3 },
        { id: rid('ph'), name: 'BBQ Chicken (1 dilim)', calories: 280, protein: 14, carbs: 32, fat: 10, fiber: 2 },
        { id: rid('ph'), name: 'Hawaiian (1 dilim)', calories: 260, protein: 12, carbs: 31, fat: 10, fiber: 2 },
        { id: rid('ph'), name: 'Margarita (1 dilim)', calories: 240, protein: 10, carbs: 28, fat: 9, fiber: 2 },
      ],
    },
    {
      category: 'Yan Ürünler',
      items: [
        { id: rid('ph'), name: 'Breadstick (1 adet)', calories: 140, protein: 4, carbs: 20, fat: 5, fiber: 1 },
        { id: rid('ph'), name: 'Garlic Bread (2 dilim)', calories: 280, protein: 8, carbs: 34, fat: 12, fiber: 2 },
        { id: rid('ph'), name: 'Chicken Wings (5\'li, Classic)', calories: 370, protein: 26, carbs: 0, fat: 28, fiber: 0 },
        { id: rid('ph'), name: 'Chicken Wings (5\'li, BBQ)', calories: 400, protein: 26, carbs: 12, fat: 26, fiber: 0 },
        { id: rid('ph'), name: 'Mozzarella Sticks (4\'lü)', calories: 320, protein: 14, carbs: 28, fat: 16, fiber: 2 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// ARBY'S — Global nutrition data
// ═══════════════════════════════════════════════════════════════════════════════

const arbys: Restaurant = {
  id: 'arbys',
  name: "Arby's",
  logo: '🤠',
  color: '#D2172A',
  categories: [
    {
      category: 'Sandviçler',
      items: [
        { id: rid('ab'), name: 'Classic Roast Beef', calories: 360, protein: 23, carbs: 37, fat: 14, fiber: 2 },
        { id: rid('ab'), name: 'Double Roast Beef', calories: 510, protein: 34, carbs: 38, fat: 24, fiber: 2 },
        { id: rid('ab'), name: 'Beef \'n Cheddar (Classic)', calories: 450, protein: 23, carbs: 45, fat: 20, fiber: 2 },
        { id: rid('ab'), name: 'Smokehouse Brisket', calories: 600, protein: 28, carbs: 51, fat: 31, fiber: 2 },
        { id: rid('ab'), name: 'Crispy Chicken Sandwich', calories: 530, protein: 23, carbs: 48, fat: 27, fiber: 3 },
        { id: rid('ab'), name: 'Spicy Crispy Chicken', calories: 570, protein: 23, carbs: 50, fat: 30, fiber: 3 },
        { id: rid('ab'), name: 'Classic Crispy Chicken', calories: 490, protein: 22, carbs: 46, fat: 24, fiber: 3 },
        { id: rid('ab'), name: 'Turkey Gyro', calories: 470, protein: 24, carbs: 49, fat: 20, fiber: 3 },
      ],
    },
    {
      category: 'Yan Ürünler',
      items: [
        { id: rid('ab'), name: 'Curly Fries (Küçük)', calories: 250, protein: 3, carbs: 29, fat: 14, fiber: 3 },
        { id: rid('ab'), name: 'Curly Fries (Orta)', calories: 410, protein: 5, carbs: 47, fat: 23, fiber: 5 },
        { id: rid('ab'), name: 'Mozzarella Sticks (4\'lü)', calories: 420, protein: 18, carbs: 35, fat: 23, fiber: 2 },
        { id: rid('ab'), name: 'Jalapeño Bites (5\'li)', calories: 290, protein: 7, carbs: 30, fat: 16, fiber: 2 },
        { id: rid('ab'), name: 'Onion Rings (4\'lü)', calories: 330, protein: 4, carbs: 45, fat: 15, fiber: 2 },
      ],
    },
    {
      category: 'Tatlılar & İçecekler',
      items: [
        { id: rid('ab'), name: 'Chocolate Shake (Orta)', calories: 510, protein: 13, carbs: 65, fat: 22, fiber: 1 },
        { id: rid('ab'), name: 'Vanilla Shake (Orta)', calories: 470, protein: 13, carbs: 59, fat: 20, fiber: 0 },
        { id: rid('ab'), name: 'Turnover (Elmalı)', calories: 250, protein: 3, carbs: 28, fat: 14, fiber: 1 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAVUK DÜNYASI — Türk tavuk zinciri, tahmini USDA eşdeğer besin hesabı
// ═══════════════════════════════════════════════════════════════════════════════

const tavukDunyasi: Restaurant = {
  id: 'tavuk-dunyasi',
  name: 'Tavuk Dünyası',
  logo: '🍗',
  color: '#E65100',
  categories: [
    {
      category: 'Tavuk Menüleri',
      items: [
        { id: rid('td'), name: 'Izgara Tavuk Menü (200g)', calories: 420, protein: 48, carbs: 2, fat: 24, fiber: 0, grams: 200 },
        { id: rid('td'), name: 'Çıtır Tavuk (4 parça)', calories: 520, protein: 32, carbs: 28, fat: 32, fiber: 2 },
        { id: rid('td'), name: 'Tavuk Şiş (6 adet)', calories: 360, protein: 42, carbs: 4, fat: 18, fiber: 1 },
        { id: rid('td'), name: 'Kanat (6\'lı)', calories: 450, protein: 30, carbs: 12, fat: 32, fiber: 1 },
        { id: rid('td'), name: 'Tavuk Burger', calories: 470, protein: 24, carbs: 42, fat: 22, fiber: 2 },
        { id: rid('td'), name: 'Çıtır Tavuk Burger', calories: 530, protein: 22, carbs: 48, fat: 28, fiber: 2 },
        { id: rid('td'), name: 'Tavuk Dürüm', calories: 450, protein: 28, carbs: 40, fat: 20, fiber: 2 },
        { id: rid('td'), name: 'Nugget (6\'lı)', calories: 280, protein: 16, carbs: 16, fat: 16, fiber: 1 },
        { id: rid('td'), name: 'Nugget (9\'lu)', calories: 420, protein: 24, carbs: 24, fat: 24, fiber: 1 },
      ],
    },
    {
      category: 'Yan Ürünler',
      items: [
        { id: rid('td'), name: 'Patates (Orta)', calories: 320, protein: 4, carbs: 42, fat: 15, fiber: 3 },
        { id: rid('td'), name: 'Pirinç Pilavı', calories: 220, protein: 4, carbs: 46, fat: 2, fiber: 1, grams: 180 },
        { id: rid('td'), name: 'Makarna', calories: 280, protein: 8, carbs: 44, fat: 8, fiber: 2, grams: 200 },
        { id: rid('td'), name: 'Coleslaw', calories: 140, protein: 1, carbs: 14, fat: 9, fiber: 2 },
        { id: rid('td'), name: 'Ayran', calories: 70, protein: 6, carbs: 5, fat: 3, fiber: 0 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// SBARRO — Global nutrition data (dilim başına)
// ═══════════════════════════════════════════════════════════════════════════════

const sbarro: Restaurant = {
  id: 'sbarro',
  name: 'Sbarro',
  logo: '🇮🇹',
  color: '#D32F2F',
  categories: [
    {
      category: 'Pizzalar (1 dilim)',
      items: [
        { id: rid('sb2'), name: 'NY Style Cheese (1 dilim)', calories: 410, protein: 16, carbs: 50, fat: 16, fiber: 3 },
        { id: rid('sb2'), name: 'NY Style Pepperoni (1 dilim)', calories: 480, protein: 19, carbs: 50, fat: 22, fiber: 3 },
        { id: rid('sb2'), name: 'Supreme (1 dilim)', calories: 510, protein: 21, carbs: 52, fat: 24, fiber: 4 },
        { id: rid('sb2'), name: 'Meat Delight (1 dilim)', calories: 550, protein: 24, carbs: 50, fat: 28, fiber: 3 },
        { id: rid('sb2'), name: 'Veggie (1 dilim)', calories: 430, protein: 17, carbs: 52, fat: 17, fiber: 4 },
        { id: rid('sb2'), name: 'Stuffed Pepperoni (1 dilim)', calories: 690, protein: 30, carbs: 60, fat: 36, fiber: 3 },
        { id: rid('sb2'), name: 'White Pizza (1 dilim)', calories: 480, protein: 20, carbs: 48, fat: 24, fiber: 2 },
      ],
    },
    {
      category: 'Diğer',
      items: [
        { id: rid('sb2'), name: 'Stromboli (Pepperoni)', calories: 680, protein: 28, carbs: 58, fat: 36, fiber: 3 },
        { id: rid('sb2'), name: 'Garlic Roll (1 adet)', calories: 170, protein: 5, carbs: 24, fat: 6, fiber: 1 },
        { id: rid('sb2'), name: 'Caesar Salad', calories: 270, protein: 10, carbs: 14, fat: 20, fiber: 3 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// COFFY — Türk kahve zinciri, genel kahve/pastane besin değerleri
// ═══════════════════════════════════════════════════════════════════════════════

const coffy: Restaurant = {
  id: 'coffy',
  name: 'Kahve Dünyası',
  logo: '☕',
  color: '#4E342E',
  categories: [
    {
      category: 'Kahveler',
      items: [
        { id: rid('kd'), name: 'Türk Kahvesi', calories: 10, protein: 0, carbs: 1, fat: 0, fiber: 0 },
        { id: rid('kd'), name: 'Latte (Orta)', calories: 180, protein: 12, carbs: 18, fat: 7, fiber: 0 },
        { id: rid('kd'), name: 'Cappuccino (Orta)', calories: 130, protein: 9, carbs: 13, fat: 5, fiber: 0 },
        { id: rid('kd'), name: 'Mocha (Orta)', calories: 340, protein: 12, carbs: 46, fat: 12, fiber: 2 },
        { id: rid('kd'), name: 'Caramel Latte (Orta)', calories: 250, protein: 10, carbs: 36, fat: 7, fiber: 0 },
        { id: rid('kd'), name: 'Americano (Orta)', calories: 15, protein: 1, carbs: 2, fat: 0, fiber: 0 },
        { id: rid('kd'), name: 'Filtre Kahve (Orta)', calories: 5, protein: 0, carbs: 1, fat: 0, fiber: 0 },
        { id: rid('kd'), name: 'Sıcak Çikolata (Orta)', calories: 380, protein: 14, carbs: 48, fat: 14, fiber: 3 },
      ],
    },
    {
      category: 'Soğuk İçecekler',
      items: [
        { id: rid('kd'), name: 'Frappe Mocha (Orta)', calories: 380, protein: 6, carbs: 56, fat: 15, fiber: 1 },
        { id: rid('kd'), name: 'Frappe Caramel (Orta)', calories: 360, protein: 5, carbs: 54, fat: 14, fiber: 0 },
        { id: rid('kd'), name: 'Ice Latte (Orta)', calories: 120, protein: 8, carbs: 12, fat: 5, fiber: 0 },
        { id: rid('kd'), name: 'Limonata', calories: 140, protein: 0, carbs: 34, fat: 0, fiber: 0 },
      ],
    },
    {
      category: 'Yiyecekler',
      items: [
        { id: rid('kd'), name: 'Çikolatalı Sufle', calories: 440, protein: 6, carbs: 48, fat: 26, fiber: 2 },
        { id: rid('kd'), name: 'San Sebastian Cheesecake', calories: 380, protein: 7, carbs: 30, fat: 26, fiber: 0 },
        { id: rid('kd'), name: 'Brownie', calories: 350, protein: 5, carbs: 40, fat: 20, fiber: 2 },
        { id: rid('kd'), name: 'Cookie (Çikolatalı)', calories: 300, protein: 4, carbs: 40, fat: 14, fiber: 1 },
        { id: rid('kd'), name: 'Tost (Kaşarlı)', calories: 320, protein: 14, carbs: 30, fat: 16, fiber: 1 },
        { id: rid('kd'), name: 'Sandviç (Tavuklu)', calories: 400, protein: 26, carbs: 36, fat: 16, fiber: 2 },
        { id: rid('kd'), name: 'Croissant (Sade)', calories: 260, protein: 5, carbs: 28, fat: 14, fiber: 1 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOUSE OF B — Gourmet Burger Chain (USDA malzeme bazlı hesaplama, Mayıs 2026)
// Menü: houseofb.com.tr — brioche ekmek + 150-200g beef patty + özel soslar
// ═══════════════════════════════════════════════════════════════════════════════
const houseOfB: Restaurant = {
  id: 'houseofb',
  name: 'House of B',
  logo: '🏠',
  color: '#D4A853',
  categories: [
    {
      category: 'Burgerler',
      items: [
        { id: rid('hob'), name: 'Classic B Burger', calories: 680, protein: 38, carbs: 46, fat: 36, fiber: 2, grams: 300 },
        { id: rid('hob'), name: 'Double B Burger', calories: 920, protein: 56, carbs: 48, fat: 52, fiber: 2, grams: 420 },
        { id: rid('hob'), name: 'Smash B Burger', calories: 620, protein: 34, carbs: 44, fat: 32, fiber: 1, grams: 270 },
        { id: rid('hob'), name: 'Double Smash B Burger', calories: 860, protein: 52, carbs: 46, fat: 48, fiber: 1, grams: 390 },
        { id: rid('hob'), name: 'BBQ Burger', calories: 740, protein: 40, carbs: 54, fat: 38, fiber: 2, grams: 330 },
        { id: rid('hob'), name: 'Mushroom Swiss Burger', calories: 720, protein: 42, carbs: 46, fat: 38, fiber: 2, grams: 320 },
        { id: rid('hob'), name: 'Spicy B Burger', calories: 700, protein: 38, carbs: 48, fat: 36, fiber: 2, grams: 310 },
        { id: rid('hob'), name: 'Cheeseburger', calories: 640, protein: 36, carbs: 44, fat: 34, fiber: 1, grams: 280 },
        { id: rid('hob'), name: 'Chicken Burger', calories: 600, protein: 36, carbs: 50, fat: 26, fiber: 2, grams: 290 },
        { id: rid('hob'), name: 'Crispy Chicken Burger', calories: 660, protein: 34, carbs: 58, fat: 28, fiber: 2, grams: 310 },
        { id: rid('hob'), name: 'Veggie Burger', calories: 540, protein: 18, carbs: 58, fat: 24, fiber: 5, grams: 280 },
      ],
    },
    {
      category: 'Patates & Yanlar',
      items: [
        { id: rid('hob'), name: 'Klasik Patates (Orta)', calories: 340, protein: 5, carbs: 46, fat: 16, fiber: 4, grams: 150 },
        { id: rid('hob'), name: 'Loaded Fries (Peynirli)', calories: 520, protein: 14, carbs: 52, fat: 30, fiber: 4, grams: 220 },
        { id: rid('hob'), name: 'Trüflü Patates', calories: 380, protein: 5, carbs: 46, fat: 20, fiber: 4, grams: 160 },
        { id: rid('hob'), name: 'Onion Rings', calories: 420, protein: 6, carbs: 50, fat: 22, fiber: 3, grams: 150 },
        { id: rid('hob'), name: 'Coleslaw', calories: 160, protein: 2, carbs: 14, fat: 10, fiber: 2, grams: 120 },
      ],
    },
    {
      category: 'İçecekler',
      items: [
        { id: rid('hob'), name: 'Milkshake Çikolata', calories: 560, protein: 12, carbs: 80, fat: 22, fiber: 1 },
        { id: rid('hob'), name: 'Milkshake Çilek', calories: 520, protein: 10, carbs: 78, fat: 18, fiber: 1 },
        { id: rid('hob'), name: 'Milkshake Vanilya', calories: 500, protein: 10, carbs: 74, fat: 20, fiber: 0 },
        { id: rid('hob'), name: 'Limonata', calories: 120, protein: 0, carbs: 30, fat: 0, fiber: 0 },
        { id: rid('hob'), name: 'Ayran (300ml)', calories: 75, protein: 5, carbs: 6, fat: 3, fiber: 0 },
        { id: rid('hob'), name: 'Kola (Orta)', calories: 170, protein: 0, carbs: 44, fat: 0, fiber: 0 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// WHITE BURGER — Türk Burger Zinciri (USDA malzeme bazlı hesaplama, Mayıs 2026)
// Menü: whiteburgertürkiye — brioche ekmek + 130-170g beef patty
// ═══════════════════════════════════════════════════════════════════════════════
const whiteBurger: Restaurant = {
  id: 'whiteburger',
  name: 'White Burger',
  logo: '⬜',
  color: '#F5F5F5',
  categories: [
    {
      category: 'Burgerler',
      items: [
        { id: rid('wb'), name: 'White Classic', calories: 620, protein: 34, carbs: 44, fat: 32, fiber: 1, grams: 280 },
        { id: rid('wb'), name: 'White Double', calories: 840, protein: 52, carbs: 46, fat: 46, fiber: 1, grams: 380 },
        { id: rid('wb'), name: 'White Smash', calories: 580, protein: 32, carbs: 42, fat: 30, fiber: 1, grams: 260 },
        { id: rid('wb'), name: 'White BBQ', calories: 700, protein: 36, carbs: 54, fat: 36, fiber: 2, grams: 310 },
        { id: rid('wb'), name: 'White Spicy', calories: 660, protein: 34, carbs: 46, fat: 34, fiber: 2, grams: 295 },
        { id: rid('wb'), name: 'White Cheese', calories: 640, protein: 36, carbs: 44, fat: 34, fiber: 1, grams: 285 },
        { id: rid('wb'), name: 'Crispy Chicken White', calories: 630, protein: 32, carbs: 56, fat: 26, fiber: 2, grams: 300 },
        { id: rid('wb'), name: 'White Mushroom', calories: 680, protein: 38, carbs: 44, fat: 36, fiber: 2, grams: 305 },
        { id: rid('wb'), name: 'Truffle White', calories: 720, protein: 38, carbs: 46, fat: 40, fiber: 2, grams: 315 },
      ],
    },
    {
      category: 'Patates & Yanlar',
      items: [
        { id: rid('wb'), name: 'Klasik Patates (Orta)', calories: 320, protein: 4, carbs: 44, fat: 14, fiber: 3, grams: 140 },
        { id: rid('wb'), name: 'Kaşarlı Patates', calories: 480, protein: 14, carbs: 48, fat: 26, fiber: 3, grams: 200 },
        { id: rid('wb'), name: 'Trüflü Patates', calories: 360, protein: 4, carbs: 44, fat: 18, fiber: 3, grams: 150 },
        { id: rid('wb'), name: 'Onion Rings', calories: 400, protein: 5, carbs: 48, fat: 20, fiber: 2, grams: 140 },
      ],
    },
    {
      category: 'İçecekler',
      items: [
        { id: rid('wb'), name: 'Milkshake (Çikolata)', calories: 540, protein: 11, carbs: 76, fat: 20, fiber: 1 },
        { id: rid('wb'), name: 'Milkshake (Çilek)', calories: 500, protein: 10, carbs: 72, fat: 18, fiber: 1 },
        { id: rid('wb'), name: 'Limonata', calories: 110, protein: 0, carbs: 28, fat: 0, fiber: 0 },
        { id: rid('wb'), name: 'Ayran (300ml)', calories: 75, protein: 5, carbs: 6, fat: 3, fiber: 0 },
        { id: rid('wb'), name: 'Kola (Orta)', calories: 170, protein: 0, carbs: 44, fat: 0, fiber: 0 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// COOKSHOP — Café & Restoran Zinciri (USDA malzeme bazlı hesaplama, Mayıs 2026)
// Türkiye'deki AVM'lerde bulunan geniş menülü café-restoran
// ═══════════════════════════════════════════════════════════════════════════════
const cookshop: Restaurant = {
  id: 'cookshop',
  name: 'Cookshop',
  logo: '🍳',
  color: '#8B6F47',
  categories: [
    {
      category: 'Kahvaltı',
      items: [
        { id: rid('cs'), name: 'Serpme Kahvaltı (kişi başı)', calories: 680, protein: 28, carbs: 52, fat: 38, fiber: 4 },
        { id: rid('cs'), name: 'Avokadolu Yumurta & Ekmek', calories: 520, protein: 18, carbs: 40, fat: 30, fiber: 6, grams: 280 },
        { id: rid('cs'), name: 'Eggs Benedict', calories: 580, protein: 24, carbs: 36, fat: 34, fiber: 2, grams: 300 },
        { id: rid('cs'), name: 'Omlet (Kaşarlı & Sebzeli)', calories: 380, protein: 22, carbs: 8, fat: 28, fiber: 2, grams: 220 },
        { id: rid('cs'), name: 'French Toast', calories: 480, protein: 14, carbs: 56, fat: 22, fiber: 2, grams: 240 },
        { id: rid('cs'), name: 'Granola & Yoğurt', calories: 380, protein: 12, carbs: 54, fat: 12, fiber: 4, grams: 260 },
        { id: rid('cs'), name: 'Pancake (3 Adet)', calories: 520, protein: 12, carbs: 70, fat: 20, fiber: 2, grams: 300 },
      ],
    },
    {
      category: 'Salatalar',
      items: [
        { id: rid('cs'), name: 'Caesar Salata (Tavuklu)', calories: 420, protein: 30, carbs: 20, fat: 24, fiber: 3, grams: 320 },
        { id: rid('cs'), name: 'Akdeniz Salatası', calories: 280, protein: 8, carbs: 22, fat: 18, fiber: 5, grams: 280 },
        { id: rid('cs'), name: 'Keçi Peynirli Roka Salatası', calories: 320, protein: 12, carbs: 16, fat: 22, fiber: 3, grams: 240 },
        { id: rid('cs'), name: 'Ton Balıklı Salata', calories: 340, protein: 28, carbs: 14, fat: 18, fiber: 4, grams: 290 },
        { id: rid('cs'), name: 'Quinoa Salatası', calories: 360, protein: 14, carbs: 42, fat: 14, fiber: 6, grams: 300 },
      ],
    },
    {
      category: 'Ana Yemekler',
      items: [
        { id: rid('cs'), name: 'Club Sandwich', calories: 620, protein: 36, carbs: 52, fat: 28, fiber: 3, grams: 380 },
        { id: rid('cs'), name: 'Cookshop Burger', calories: 700, protein: 38, carbs: 50, fat: 36, fiber: 2, grams: 340 },
        { id: rid('cs'), name: 'Izgara Tavuk & Pilav', calories: 520, protein: 42, carbs: 48, fat: 16, fiber: 2, grams: 380 },
        { id: rid('cs'), name: 'Makarna (Arabiata)', calories: 560, protein: 16, carbs: 80, fat: 18, fiber: 4, grams: 350 },
        { id: rid('cs'), name: 'Makarna (Carbonara)', calories: 680, protein: 24, carbs: 76, fat: 30, fiber: 2, grams: 380 },
        { id: rid('cs'), name: 'Somon (Izgara)', calories: 480, protein: 42, carbs: 14, fat: 28, fiber: 2, grams: 300 },
        { id: rid('cs'), name: 'Çıtır Tavuk & Patates', calories: 680, protein: 36, carbs: 60, fat: 30, fiber: 4, grams: 380 },
        { id: rid('cs'), name: 'Wrap (Tavuklu)', calories: 520, protein: 30, carbs: 54, fat: 20, fiber: 4, grams: 310 },
      ],
    },
    {
      category: 'Tatlılar',
      items: [
        { id: rid('cs'), name: 'Cheesecake (Dilim)', calories: 420, protein: 7, carbs: 42, fat: 26, fiber: 1, grams: 150 },
        { id: rid('cs'), name: 'Brownie & Dondurma', calories: 480, protein: 6, carbs: 56, fat: 26, fiber: 2, grams: 180 },
        { id: rid('cs'), name: 'Tiramisu', calories: 400, protein: 7, carbs: 44, fat: 22, fiber: 1, grams: 160 },
        { id: rid('cs'), name: 'Sufle (Çikolatalı)', calories: 440, protein: 7, carbs: 50, fat: 24, fiber: 2, grams: 160 },
      ],
    },
    {
      category: 'Kahve & İçecekler',
      items: [
        { id: rid('cs'), name: 'Latte (Orta)', calories: 180, protein: 9, carbs: 18, fat: 8, fiber: 0 },
        { id: rid('cs'), name: 'Cappuccino (Orta)', calories: 120, protein: 7, carbs: 12, fat: 5, fiber: 0 },
        { id: rid('cs'), name: 'Filtre Kahve', calories: 10, protein: 0, carbs: 2, fat: 0, fiber: 0 },
        { id: rid('cs'), name: 'Limonata (Ev Yapımı)', calories: 130, protein: 0, carbs: 32, fat: 0, fiber: 0 },
        { id: rid('cs'), name: 'Fresh Portakal Suyu', calories: 120, protein: 2, carbs: 28, fat: 0, fiber: 1 },
        { id: rid('cs'), name: 'Smoothie (Karışık Meyve)', calories: 200, protein: 3, carbs: 44, fat: 2, fiber: 3 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// BIG CHEFS — Türk Upscale Casual Dining (USDA malzeme bazlı hesaplama, Mayıs 2026)
// Menü: bigchefs.com.tr — geniş menü, burger + steak + pasta + kahvaltı
// ═══════════════════════════════════════════════════════════════════════════════
const bigChefs: Restaurant = {
  id: 'bigchefs',
  name: 'Big Chefs',
  logo: '👨‍🍳',
  color: '#C0392B',
  categories: [
    {
      category: 'Kahvaltı',
      items: [
        { id: rid('bc'), name: 'Big Chefs Serpme Kahvaltısı (kişi başı)', calories: 720, protein: 30, carbs: 56, fat: 40, fiber: 4 },
        { id: rid('bc'), name: 'Menemen', calories: 340, protein: 16, carbs: 14, fat: 24, fiber: 2, grams: 280 },
        { id: rid('bc'), name: 'Peynirli Omlet', calories: 360, protein: 24, carbs: 4, fat: 28, fiber: 1, grams: 220 },
        { id: rid('bc'), name: 'Avokado Toast', calories: 480, protein: 14, carbs: 42, fat: 28, fiber: 7, grams: 260 },
        { id: rid('bc'), name: 'Pancake (Meyveli)', calories: 580, protein: 12, carbs: 84, fat: 20, fiber: 3, grams: 340 },
        { id: rid('bc'), name: 'Eggs Benny (Somon)', calories: 620, protein: 30, carbs: 38, fat: 36, fiber: 2, grams: 320 },
      ],
    },
    {
      category: 'Salatalar',
      items: [
        { id: rid('bc'), name: 'Big Chefs Caesar (Tavuklu)', calories: 440, protein: 32, carbs: 22, fat: 26, fiber: 3, grams: 340 },
        { id: rid('bc'), name: 'Çoban Salatası', calories: 180, protein: 4, carbs: 18, fat: 10, fiber: 4, grams: 280 },
        { id: rid('bc'), name: 'Roka & Parmesan Salatası', calories: 300, protein: 10, carbs: 14, fat: 22, fiber: 3, grams: 240 },
        { id: rid('bc'), name: 'Somon Salatası', calories: 380, protein: 28, carbs: 16, fat: 22, fiber: 4, grams: 300 },
        { id: rid('bc'), name: 'Ton Balıklı Nicoise', calories: 360, protein: 26, carbs: 20, fat: 20, fiber: 4, grams: 310 },
        { id: rid('bc'), name: 'Keçi Peynirli Salata', calories: 320, protein: 12, carbs: 18, fat: 22, fiber: 3, grams: 250 },
      ],
    },
    {
      category: 'Burgerler',
      items: [
        { id: rid('bc'), name: 'Big Chefs Classic Burger', calories: 740, protein: 42, carbs: 50, fat: 38, fiber: 2, grams: 360 },
        { id: rid('bc'), name: 'Big Chefs Double Burger', calories: 980, protein: 60, carbs: 52, fat: 56, fiber: 2, grams: 480 },
        { id: rid('bc'), name: 'Truffle Burger', calories: 800, protein: 42, carbs: 52, fat: 44, fiber: 2, grams: 380 },
        { id: rid('bc'), name: 'BBQ Pulled Burger', calories: 820, protein: 44, carbs: 62, fat: 40, fiber: 3, grams: 400 },
        { id: rid('bc'), name: 'Crispy Chicken Burger', calories: 680, protein: 36, carbs: 62, fat: 30, fiber: 2, grams: 340 },
        { id: rid('bc'), name: 'Mushroom Swiss Burger', calories: 760, protein: 44, carbs: 50, fat: 40, fiber: 2, grams: 360 },
        { id: rid('bc'), name: 'Veggie Burger', calories: 580, protein: 20, carbs: 62, fat: 26, fiber: 5, grams: 320 },
      ],
    },
    {
      category: 'Ana Yemekler',
      items: [
        { id: rid('bc'), name: 'Izgara Dana Biftek (200g)', calories: 520, protein: 48, carbs: 2, fat: 34, fiber: 0, grams: 240 },
        { id: rid('bc'), name: 'Izgara Somon (200g)', calories: 460, protein: 44, carbs: 4, fat: 28, fiber: 0, grams: 250 },
        { id: rid('bc'), name: 'Tavuk Schnitzel & Patates', calories: 680, protein: 40, carbs: 62, fat: 28, fiber: 4, grams: 400 },
        { id: rid('bc'), name: 'Makarna Carbonara', calories: 720, protein: 26, carbs: 80, fat: 32, fiber: 3, grams: 400 },
        { id: rid('bc'), name: 'Makarna Arabiata', calories: 580, protein: 18, carbs: 84, fat: 18, fiber: 5, grams: 380 },
        { id: rid('bc'), name: 'Pesto Makarna (Tavuklu)', calories: 640, protein: 34, carbs: 74, fat: 22, fiber: 4, grams: 390 },
        { id: rid('bc'), name: 'Pizza Margarita', calories: 760, protein: 28, carbs: 88, fat: 30, fiber: 4, grams: 380 },
        { id: rid('bc'), name: 'Pizza (Karışık)', calories: 840, protein: 36, carbs: 90, fat: 36, fiber: 4, grams: 420 },
        { id: rid('bc'), name: 'Köfte & Pilav', calories: 620, protein: 38, carbs: 52, fat: 26, fiber: 2, grams: 380 },
        { id: rid('bc'), name: 'Club Sandwich', calories: 650, protein: 38, carbs: 56, fat: 28, fiber: 3, grams: 400 },
      ],
    },
    {
      category: 'Tatlılar',
      items: [
        { id: rid('bc'), name: 'Cheesecake (Dilim)', calories: 440, protein: 8, carbs: 46, fat: 26, fiber: 1, grams: 160 },
        { id: rid('bc'), name: 'Çikolatalı Sufle & Dondurma', calories: 520, protein: 8, carbs: 58, fat: 28, fiber: 2, grams: 200 },
        { id: rid('bc'), name: 'Tiramisu', calories: 420, protein: 7, carbs: 46, fat: 22, fiber: 1, grams: 170 },
        { id: rid('bc'), name: 'Brownie', calories: 400, protein: 6, carbs: 48, fat: 22, fiber: 2, grams: 150 },
        { id: rid('bc'), name: 'Dondurma (2 Top)', calories: 260, protein: 4, carbs: 32, fat: 12, fiber: 0, grams: 120 },
      ],
    },
    {
      category: 'Kahve & İçecekler',
      items: [
        { id: rid('bc'), name: 'Espresso', calories: 5, protein: 0, carbs: 1, fat: 0, fiber: 0 },
        { id: rid('bc'), name: 'Americano', calories: 15, protein: 1, carbs: 2, fat: 0, fiber: 0 },
        { id: rid('bc'), name: 'Latte (Büyük)', calories: 210, protein: 10, carbs: 20, fat: 9, fiber: 0 },
        { id: rid('bc'), name: 'Cappuccino', calories: 130, protein: 8, carbs: 13, fat: 5, fiber: 0 },
        { id: rid('bc'), name: 'Flat White', calories: 150, protein: 9, carbs: 14, fat: 6, fiber: 0 },
        { id: rid('bc'), name: 'Limonata (Ev Yapımı)', calories: 130, protein: 0, carbs: 32, fat: 0, fiber: 0 },
        { id: rid('bc'), name: 'Fresh Portakal Suyu', calories: 120, protein: 2, carbs: 28, fat: 0, fiber: 1 },
        { id: rid('bc'), name: 'Ayran (300ml)', calories: 75, protein: 5, carbs: 6, fat: 3, fiber: 0 },
        { id: rid('bc'), name: 'Çay', calories: 5, protein: 0, carbs: 1, fat: 0, fiber: 0 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// GREEN SALADS — Türk Salata & Sağlıklı Beslenme Zinciri
// (USDA malzeme bazlı hesaplama, Mayıs 2026)
// ═══════════════════════════════════════════════════════════════════════════════
const greenSalads: Restaurant = {
  id: 'greensalads',
  name: 'Green Salads',
  logo: '🥗',
  color: '#4CAF50',
  categories: [
    {
      category: 'Salatalar',
      items: [
        { id: rid('gs'), name: 'Classic Caesar', calories: 320, protein: 10, carbs: 24, fat: 20, fiber: 3, grams: 280 },
        { id: rid('gs'), name: 'Caesar (Tavuklu)', calories: 440, protein: 32, carbs: 26, fat: 24, fiber: 3, grams: 340 },
        { id: rid('gs'), name: 'Greek Salad', calories: 260, protein: 8, carbs: 16, fat: 18, fiber: 4, grams: 280 },
        { id: rid('gs'), name: 'Tuna Nicoise', calories: 380, protein: 30, carbs: 20, fat: 20, fiber: 5, grams: 320 },
        { id: rid('gs'), name: 'Roka & Parmesan', calories: 300, protein: 10, carbs: 12, fat: 22, fiber: 3, grams: 240 },
        { id: rid('gs'), name: 'Cobb Salad', calories: 420, protein: 30, carbs: 10, fat: 28, fiber: 4, grams: 320 },
        { id: rid('gs'), name: 'Quinoa Power Bowl', calories: 400, protein: 16, carbs: 50, fat: 14, fiber: 7, grams: 340 },
        { id: rid('gs'), name: 'Somon & Avokado', calories: 440, protein: 30, carbs: 14, fat: 30, fiber: 5, grams: 320 },
        { id: rid('gs'), name: 'Keçi Peyniri & Roka', calories: 320, protein: 12, carbs: 16, fat: 22, fiber: 3, grams: 260 },
        { id: rid('gs'), name: 'Falafel Bowl', calories: 420, protein: 14, carbs: 52, fat: 16, fiber: 8, grams: 340 },
        { id: rid('gs'), name: 'Izgara Tavuk Bowl', calories: 460, protein: 38, carbs: 40, fat: 16, fiber: 5, grams: 360 },
        { id: rid('gs'), name: 'Detox Yeşil Salata', calories: 180, protein: 6, carbs: 18, fat: 10, fiber: 6, grams: 240 },
      ],
    },
    {
      category: 'Wrap & Sandviç',
      items: [
        { id: rid('gs'), name: 'Tavuk Wrap', calories: 480, protein: 30, carbs: 52, fat: 16, fiber: 4, grams: 300 },
        { id: rid('gs'), name: 'Falafel Wrap', calories: 440, protein: 14, carbs: 58, fat: 16, fiber: 6, grams: 290 },
        { id: rid('gs'), name: 'Ton Balıklı Wrap', calories: 420, protein: 28, carbs: 48, fat: 14, fiber: 4, grams: 280 },
        { id: rid('gs'), name: 'Avokado & Sebze Wrap', calories: 400, protein: 10, carbs: 48, fat: 18, fiber: 7, grams: 270 },
        { id: rid('gs'), name: 'Somon Sandviç', calories: 480, protein: 30, carbs: 46, fat: 18, fiber: 3, grams: 300 },
      ],
    },
    {
      category: 'Çorbalar',
      items: [
        { id: rid('gs'), name: 'Mercimek Çorbası', calories: 200, protein: 10, carbs: 30, fat: 4, fiber: 6, grams: 300 },
        { id: rid('gs'), name: 'Domates Çorbası', calories: 160, protein: 4, carbs: 22, fat: 6, fiber: 3, grams: 280 },
        { id: rid('gs'), name: 'Brokoli Çorbası', calories: 180, protein: 6, carbs: 18, fat: 8, fiber: 4, grams: 280 },
        { id: rid('gs'), name: 'Tavuk & Sebze Çorbası', calories: 220, protein: 16, carbs: 20, fat: 8, fiber: 3, grams: 300 },
      ],
    },
    {
      category: 'Smoothie & İçecekler',
      items: [
        { id: rid('gs'), name: 'Green Detox Smoothie', calories: 160, protein: 4, carbs: 32, fat: 3, fiber: 4 },
        { id: rid('gs'), name: 'Berry Smoothie', calories: 200, protein: 4, carbs: 42, fat: 2, fiber: 4 },
        { id: rid('gs'), name: 'Mango Tropical', calories: 220, protein: 3, carbs: 50, fat: 2, fiber: 3 },
        { id: rid('gs'), name: 'Protein Smoothie', calories: 280, protein: 20, carbs: 36, fat: 4, fiber: 2 },
        { id: rid('gs'), name: 'Fresh Portakal Suyu', calories: 120, protein: 2, carbs: 28, fat: 0, fiber: 1 },
        { id: rid('gs'), name: 'Limonata (Nane & Zencefil)', calories: 80, protein: 0, carbs: 20, fat: 0, fiber: 0 },
        { id: rid('gs'), name: 'Kombucha', calories: 60, protein: 0, carbs: 14, fat: 0, fiber: 0 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZULA BURGER — Türk Smash Burger Zinciri
// (USDA malzeme bazlı hesaplama, Mayıs 2026)
// ═══════════════════════════════════════════════════════════════════════════════
const zulaBurger: Restaurant = {
  id: 'zulaburger',
  name: 'Zula Burger',
  logo: '🔥',
  color: '#E64A19',
  categories: [
    {
      category: 'Smash Burgerler',
      items: [
        { id: rid('zb'), name: 'Zula Classic Smash', calories: 600, protein: 34, carbs: 44, fat: 30, fiber: 1, grams: 270 },
        { id: rid('zb'), name: 'Zula Double Smash', calories: 820, protein: 52, carbs: 46, fat: 46, fiber: 1, grams: 380 },
        { id: rid('zb'), name: 'Zula Triple Smash', calories: 1040, protein: 70, carbs: 48, fat: 62, fiber: 1, grams: 490 },
        { id: rid('zb'), name: 'Spicy Smash', calories: 640, protein: 34, carbs: 46, fat: 34, fiber: 1, grams: 285 },
        { id: rid('zb'), name: 'Truffle Smash', calories: 680, protein: 36, carbs: 46, fat: 38, fiber: 1, grams: 295 },
        { id: rid('zb'), name: 'BBQ Smash', calories: 700, protein: 36, carbs: 54, fat: 36, fiber: 2, grams: 310 },
        { id: rid('zb'), name: 'Mushroom Smash', calories: 660, protein: 38, carbs: 44, fat: 36, fiber: 2, grams: 295 },
        { id: rid('zb'), name: 'Bacon Smash', calories: 740, protein: 42, carbs: 44, fat: 42, fiber: 1, grams: 320 },
        { id: rid('zb'), name: 'Crispy Chicken Smash', calories: 620, protein: 32, carbs: 56, fat: 26, fiber: 2, grams: 295 },
        { id: rid('zb'), name: 'Veggie Smash', calories: 540, protein: 16, carbs: 58, fat: 24, fiber: 5, grams: 275 },
      ],
    },
    {
      category: 'Loaded Patates & Yanlar',
      items: [
        { id: rid('zb'), name: 'Klasik Patates (Orta)', calories: 330, protein: 4, carbs: 44, fat: 16, fiber: 4, grams: 145 },
        { id: rid('zb'), name: 'Zula Loaded Fries (Kaşar + Brisket)', calories: 620, protein: 24, carbs: 52, fat: 36, fiber: 4, grams: 260 },
        { id: rid('zb'), name: 'Spicy Loaded Fries', calories: 560, protein: 16, carbs: 54, fat: 30, fiber: 4, grams: 240 },
        { id: rid('zb'), name: 'Trüflü Patates', calories: 370, protein: 5, carbs: 46, fat: 20, fiber: 4, grams: 155 },
        { id: rid('zb'), name: 'Onion Rings (6 Adet)', calories: 380, protein: 5, carbs: 46, fat: 20, fiber: 2, grams: 140 },
        { id: rid('zb'), name: 'Coleslaw', calories: 150, protein: 2, carbs: 12, fat: 10, fiber: 2, grams: 110 },
        { id: rid('zb'), name: 'Zula Sauce (Dip)', calories: 120, protein: 0, carbs: 4, fat: 12, fiber: 0, grams: 40 },
      ],
    },
    {
      category: 'İçecekler',
      items: [
        { id: rid('zb'), name: 'Smash Milkshake Çikolata', calories: 580, protein: 12, carbs: 82, fat: 22, fiber: 1 },
        { id: rid('zb'), name: 'Smash Milkshake Çilek', calories: 540, protein: 11, carbs: 78, fat: 18, fiber: 1 },
        { id: rid('zb'), name: 'Smash Milkshake Vanilya', calories: 520, protein: 11, carbs: 76, fat: 20, fiber: 0 },
        { id: rid('zb'), name: 'Lemonade (Ev Yapımı)', calories: 110, protein: 0, carbs: 28, fat: 0, fiber: 0 },
        { id: rid('zb'), name: 'Kola (Orta)', calories: 170, protein: 0, carbs: 44, fat: 0, fiber: 0 },
        { id: rid('zb'), name: 'Ayran (300ml)', calories: 75, protein: 5, carbs: 6, fat: 3, fiber: 0 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// GLORIA JEAN'S COFFEES — Avustralya Kökenli Kahve Zinciri (TR şubeleri)
// (Resmi Gloria Jean's global menü + USDA porsiyon hesabı, Mayıs 2026)
// ═══════════════════════════════════════════════════════════════════════════════
const gloriaJeans: Restaurant = {
  id: 'gloriajeans',
  name: "Gloria Jean's",
  logo: '☕',
  color: '#6D3B2E',
  categories: [
    {
      category: 'Sıcak Kahveler',
      items: [
        { id: rid('gj'), name: 'Espresso', calories: 5, protein: 0, carbs: 1, fat: 0, fiber: 0 },
        { id: rid('gj'), name: 'Double Espresso', calories: 10, protein: 0, carbs: 2, fat: 0, fiber: 0 },
        { id: rid('gj'), name: 'Americano (Orta)', calories: 15, protein: 1, carbs: 2, fat: 0, fiber: 0 },
        { id: rid('gj'), name: 'Latte (Orta)', calories: 190, protein: 10, carbs: 18, fat: 8, fiber: 0 },
        { id: rid('gj'), name: 'Latte (Büyük)', calories: 240, protein: 13, carbs: 22, fat: 10, fiber: 0 },
        { id: rid('gj'), name: 'Cappuccino (Orta)', calories: 130, protein: 8, carbs: 13, fat: 5, fiber: 0 },
        { id: rid('gj'), name: 'Flat White', calories: 160, protein: 10, carbs: 14, fat: 7, fiber: 0 },
        { id: rid('gj'), name: 'Macchiato', calories: 35, protein: 2, carbs: 4, fat: 1, fiber: 0 },
        { id: rid('gj'), name: 'Mocha (Orta)', calories: 290, protein: 10, carbs: 36, fat: 10, fiber: 1 },
        { id: rid('gj'), name: 'Caramel Latte (Orta)', calories: 260, protein: 9, carbs: 34, fat: 9, fiber: 0 },
        { id: rid('gj'), name: 'Hazelnut Latte (Orta)', calories: 260, protein: 9, carbs: 34, fat: 8, fiber: 0 },
        { id: rid('gj'), name: 'Chai Latte (Orta)', calories: 220, protein: 8, carbs: 32, fat: 6, fiber: 0 },
        { id: rid('gj'), name: 'Sıcak Çikolata (Orta)', calories: 360, protein: 12, carbs: 50, fat: 13, fiber: 2 },
        { id: rid('gj'), name: 'Matcha Latte (Orta)', calories: 240, protein: 9, carbs: 32, fat: 8, fiber: 1 },
      ],
    },
    {
      category: 'Soğuk Kahveler',
      items: [
        { id: rid('gj'), name: 'Iced Latte (Orta)', calories: 140, protein: 7, carbs: 14, fat: 6, fiber: 0 },
        { id: rid('gj'), name: 'Iced Americano', calories: 15, protein: 1, carbs: 2, fat: 0, fiber: 0 },
        { id: rid('gj'), name: 'Iced Mocha', calories: 260, protein: 8, carbs: 36, fat: 9, fiber: 1 },
        { id: rid('gj'), name: 'Iced Caramel Latte', calories: 230, protein: 7, carbs: 32, fat: 8, fiber: 0 },
        { id: rid('gj'), name: 'Cold Brew (Orta)', calories: 20, protein: 1, carbs: 3, fat: 0, fiber: 0 },
        { id: rid('gj'), name: 'Cold Brew Latte', calories: 130, protein: 6, carbs: 14, fat: 5, fiber: 0 },
      ],
    },
    {
      category: 'Chillers (Blended)',
      items: [
        { id: rid('gj'), name: 'Mocha Chiller (Orta)', calories: 400, protein: 8, carbs: 60, fat: 16, fiber: 1 },
        { id: rid('gj'), name: 'Caramel Chiller (Orta)', calories: 380, protein: 7, carbs: 58, fat: 14, fiber: 0 },
        { id: rid('gj'), name: 'Hazelnut Chiller (Orta)', calories: 380, protein: 7, carbs: 56, fat: 14, fiber: 0 },
        { id: rid('gj'), name: 'Cookies & Cream Chiller', calories: 440, protein: 8, carbs: 66, fat: 18, fiber: 1 },
        { id: rid('gj'), name: 'Mango Chiller (Meyve)', calories: 280, protein: 2, carbs: 66, fat: 1, fiber: 2 },
        { id: rid('gj'), name: 'Strawberry Chiller (Meyve)', calories: 260, protein: 2, carbs: 62, fat: 1, fiber: 2 },
        { id: rid('gj'), name: 'Vanilla Chiller', calories: 360, protein: 7, carbs: 54, fat: 14, fiber: 0 },
      ],
    },
    {
      category: 'Yiyecekler',
      items: [
        { id: rid('gj'), name: 'Butter Croissant', calories: 280, protein: 5, carbs: 30, fat: 16, fiber: 1, grams: 90 },
        { id: rid('gj'), name: 'Almond Croissant', calories: 380, protein: 8, carbs: 40, fat: 22, fiber: 2, grams: 120 },
        { id: rid('gj'), name: 'Blueberry Muffin', calories: 380, protein: 5, carbs: 54, fat: 16, fiber: 2, grams: 130 },
        { id: rid('gj'), name: 'Çikolatalı Muffin', calories: 400, protein: 6, carbs: 56, fat: 18, fiber: 2, grams: 135 },
        { id: rid('gj'), name: 'Cheesecake (Dilim)', calories: 430, protein: 7, carbs: 44, fat: 26, fiber: 1, grams: 155 },
        { id: rid('gj'), name: 'Brownie', calories: 360, protein: 5, carbs: 46, fat: 20, fiber: 2, grams: 130 },
        { id: rid('gj'), name: 'Sandviç (Tavuklu)', calories: 420, protein: 26, carbs: 42, fat: 16, fiber: 2, grams: 220 },
        { id: rid('gj'), name: 'Tost (Kaşarlı & Domates)', calories: 340, protein: 14, carbs: 36, fat: 16, fiber: 2, grams: 180 },
        { id: rid('gj'), name: 'Cookie (Çikolatalı Parçacıklı)', calories: 320, protein: 4, carbs: 44, fat: 14, fiber: 1, grams: 100 },
        { id: rid('gj'), name: 'Waffle (Meyveli)', calories: 480, protein: 8, carbs: 66, fat: 20, fiber: 3, grams: 230 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// NUSR-ET — Premium Steakhouse (USDA malzeme bazlı hesaplama, Mayıs 2026)
// ═══════════════════════════════════════════════════════════════════════════════
const nusret: Restaurant = {
  id: 'nusret',
  name: 'Nusr-Et',
  logo: '🥩',
  color: '#8B0000',
  categories: [
    {
      category: 'Steakler',
      items: [
        { id: rid('nr'), name: 'Ribeye Steak (300g)', calories: 750, protein: 60, carbs: 0, fat: 56, fiber: 0, grams: 300 },
        { id: rid('nr'), name: 'Ribeye Steak (500g)', calories: 1250, protein: 100, carbs: 0, fat: 94, fiber: 0, grams: 500 },
        { id: rid('nr'), name: 'Tenderloin (200g)', calories: 440, protein: 48, carbs: 0, fat: 28, fiber: 0, grams: 200 },
        { id: rid('nr'), name: 'Tenderloin (300g)', calories: 660, protein: 72, carbs: 0, fat: 42, fiber: 0, grams: 300 },
        { id: rid('nr'), name: 'New York Strip (300g)', calories: 680, protein: 64, carbs: 0, fat: 46, fiber: 0, grams: 300 },
        { id: rid('nr'), name: 'T-Bone (400g)', calories: 920, protein: 84, carbs: 0, fat: 64, fiber: 0, grams: 400 },
        { id: rid('nr'), name: 'Tomahawk (800g)', calories: 1840, protein: 162, carbs: 0, fat: 130, fiber: 0, grams: 800 },
        { id: rid('nr'), name: 'Wagyu Burger', calories: 920, protein: 52, carbs: 50, fat: 56, fiber: 2, grams: 420 },
        { id: rid('nr'), name: 'Saltbae Burger', calories: 860, protein: 48, carbs: 48, fat: 52, fiber: 2, grams: 390 },
      ],
    },
    {
      category: 'Deniz Ürünleri',
      items: [
        { id: rid('nr'), name: 'Izgara Somon (200g)', calories: 460, protein: 44, carbs: 0, fat: 30, fiber: 0, grams: 220 },
        { id: rid('nr'), name: 'Karides (200g)', calories: 260, protein: 40, carbs: 4, fat: 8, fiber: 0, grams: 200 },
        { id: rid('nr'), name: 'Ahtapot (200g)', calories: 320, protein: 36, carbs: 8, fat: 14, fiber: 0, grams: 200 },
        { id: rid('nr'), name: 'Levrek (Tüm)', calories: 380, protein: 52, carbs: 0, fat: 18, fiber: 0, grams: 350 },
      ],
    },
    {
      category: 'Başlangıçlar & Yanlar',
      items: [
        { id: rid('nr'), name: 'Nusr-Et Salatası', calories: 280, protein: 8, carbs: 16, fat: 20, fiber: 4, grams: 260 },
        { id: rid('nr'), name: 'Izgara Sebzeler', calories: 160, protein: 4, carbs: 20, fat: 8, fiber: 5, grams: 200 },
        { id: rid('nr'), name: 'Patates (Füme Tereyağlı)', calories: 460, protein: 6, carbs: 50, fat: 28, fiber: 5, grams: 220 },
        { id: rid('nr'), name: 'Mac & Cheese', calories: 520, protein: 18, carbs: 54, fat: 26, fiber: 2, grams: 280 },
        { id: rid('nr'), name: 'Mantar (Sote)', calories: 200, protein: 5, carbs: 10, fat: 16, fiber: 3, grams: 180 },
        { id: rid('nr'), name: 'Ekmek Sepeti', calories: 360, protein: 10, carbs: 62, fat: 8, fiber: 3, grams: 160 },
      ],
    },
    {
      category: 'Tatlılar',
      items: [
        { id: rid('nr'), name: 'Cheesecake', calories: 480, protein: 8, carbs: 50, fat: 28, fiber: 1, grams: 170 },
        { id: rid('nr'), name: 'Çikolatalı Lav Kek', calories: 520, protein: 8, carbs: 58, fat: 30, fiber: 2, grams: 180 },
        { id: rid('nr'), name: 'Tiramisu', calories: 440, protein: 8, carbs: 48, fat: 24, fiber: 1, grams: 180 },
        { id: rid('nr'), name: 'Dondurma (3 Top)', calories: 360, protein: 6, carbs: 46, fat: 16, fiber: 0, grams: 150 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUNSET GRILL & BAR — İstanbul Premium Restoran
// (USDA malzeme bazlı hesaplama, Mayıs 2026)
// ═══════════════════════════════════════════════════════════════════════════════
const sunsetGrill: Restaurant = {
  id: 'sunsetgrill',
  name: 'Sunset Grill & Bar',
  logo: '🌅',
  color: '#FF6B35',
  categories: [
    {
      category: 'Başlangıçlar',
      items: [
        { id: rid('sg'), name: 'Ceviche (Somon)', calories: 220, protein: 24, carbs: 12, fat: 8, fiber: 2, grams: 180 },
        { id: rid('sg'), name: 'Karides Kokteyli', calories: 240, protein: 28, carbs: 14, fat: 6, fiber: 1, grams: 200 },
        { id: rid('sg'), name: 'Bruschetta (4 Adet)', calories: 320, protein: 8, carbs: 44, fat: 12, fiber: 3, grams: 180 },
        { id: rid('sg'), name: 'Kiremitte Kaşar', calories: 380, protein: 20, carbs: 4, fat: 32, fiber: 0, grams: 160 },
        { id: rid('sg'), name: 'Kalamar Tava', calories: 420, protein: 24, carbs: 36, fat: 18, fiber: 1, grams: 220 },
        { id: rid('sg'), name: 'Hamsi Tarator', calories: 360, protein: 28, carbs: 14, fat: 22, fiber: 2, grams: 200 },
      ],
    },
    {
      category: 'Salatalar',
      items: [
        { id: rid('sg'), name: 'Sunset Caesar', calories: 460, protein: 34, carbs: 24, fat: 26, fiber: 3, grams: 340 },
        { id: rid('sg'), name: 'Akdeniz Salatası', calories: 300, protein: 10, carbs: 22, fat: 20, fiber: 5, grams: 300 },
        { id: rid('sg'), name: 'Arugula & Parmesan', calories: 320, protein: 12, carbs: 14, fat: 24, fiber: 3, grams: 260 },
        { id: rid('sg'), name: 'Somon & Avokado', calories: 460, protein: 30, carbs: 16, fat: 32, fiber: 5, grams: 320 },
      ],
    },
    {
      category: 'Ana Yemekler',
      items: [
        { id: rid('sg'), name: 'Ribeye Steak (250g)', calories: 620, protein: 50, carbs: 0, fat: 46, fiber: 0, grams: 280 },
        { id: rid('sg'), name: 'Tenderloin (200g)', calories: 440, protein: 48, carbs: 0, fat: 28, fiber: 0, grams: 220 },
        { id: rid('sg'), name: 'Rack of Lamb (300g)', calories: 680, protein: 54, carbs: 4, fat: 48, fiber: 0, grams: 320 },
        { id: rid('sg'), name: 'Izgara Somon (200g)', calories: 460, protein: 44, carbs: 2, fat: 30, fiber: 0, grams: 230 },
        { id: rid('sg'), name: 'Sea Bass (Tüm)', calories: 400, protein: 52, carbs: 2, fat: 20, fiber: 0, grams: 360 },
        { id: rid('sg'), name: 'Izgara Ahtapot', calories: 340, protein: 36, carbs: 8, fat: 16, fiber: 0, grams: 220 },
        { id: rid('sg'), name: 'Chicken Supreme', calories: 520, protein: 48, carbs: 14, fat: 28, fiber: 2, grams: 320 },
        { id: rid('sg'), name: 'Duck Confit', calories: 620, protein: 44, carbs: 8, fat: 46, fiber: 1, grams: 300 },
        { id: rid('sg'), name: 'Risotto (Mantarlı)', calories: 580, protein: 14, carbs: 72, fat: 24, fiber: 3, grams: 380 },
        { id: rid('sg'), name: 'Pasta (Truffle & Parmesan)', calories: 640, protein: 18, carbs: 78, fat: 28, fiber: 3, grams: 380 },
      ],
    },
    {
      category: 'Tatlılar',
      items: [
        { id: rid('sg'), name: 'Crème Brûlée', calories: 380, protein: 6, carbs: 38, fat: 24, fiber: 0, grams: 160 },
        { id: rid('sg'), name: 'Tiramisu', calories: 440, protein: 8, carbs: 48, fat: 24, fiber: 1, grams: 180 },
        { id: rid('sg'), name: 'Chocolate Fondant', calories: 520, protein: 8, carbs: 58, fat: 30, fiber: 2, grams: 180 },
        { id: rid('sg'), name: 'Panna Cotta (Çilekli)', calories: 320, protein: 5, carbs: 34, fat: 18, fiber: 1, grams: 160 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// WENDY'S — wendys.com nutritional info (global)
// ═══════════════════════════════════════════════════════════════════════════════

const wendys: Restaurant = {
  id: 'wendys',
  name: "Wendy's",
  logo: '🍔',
  color: '#E2203B',
  categories: [
    {
      category: 'Burgerler',
      items: [
        { id: rid('wd'), name: "Dave's Single", calories: 590, protein: 30, carbs: 39, fat: 34, fiber: 2 },
        { id: rid('wd'), name: "Dave's Double", calories: 850, protein: 48, carbs: 40, fat: 54, fiber: 2 },
        { id: rid('wd'), name: "Dave's Triple", calories: 1090, protein: 68, carbs: 41, fat: 73, fiber: 2 },
        { id: rid('wd'), name: 'Baconator', calories: 950, protein: 56, carbs: 39, fat: 62, fiber: 2 },
        { id: rid('wd'), name: 'Son of Baconator', calories: 620, protein: 34, carbs: 38, fat: 37, fiber: 2 },
        { id: rid('wd'), name: 'Jr. Cheeseburger', calories: 290, protein: 15, carbs: 26, fat: 14, fiber: 1 },
        { id: rid('wd'), name: 'Jr. Bacon Cheeseburger', calories: 380, protein: 20, carbs: 26, fat: 22, fiber: 1 },
        { id: rid('wd'), name: 'Pretzel Bacon Pub Cheeseburger', calories: 800, protein: 42, carbs: 50, fat: 48, fiber: 2 },
      ],
    },
    {
      category: 'Tavuk',
      items: [
        { id: rid('wd'), name: 'Spicy Chicken Sandwich', calories: 490, protein: 28, carbs: 49, fat: 20, fiber: 2 },
        { id: rid('wd'), name: 'Crispy Chicken Sandwich', calories: 340, protein: 15, carbs: 38, fat: 15, fiber: 1 },
        { id: rid('wd'), name: 'Grilled Chicken Sandwich', calories: 350, protein: 34, carbs: 38, fat: 8, fiber: 2 },
        { id: rid('wd'), name: 'Classic Chicken Sandwich', calories: 490, protein: 29, carbs: 47, fat: 21, fiber: 2 },
        { id: rid('wd'), name: 'Nuggets (4\'lü)', calories: 170, protein: 8, carbs: 11, fat: 11, fiber: 0 },
        { id: rid('wd'), name: 'Nuggets (10\'lu)', calories: 420, protein: 20, carbs: 27, fat: 27, fiber: 1 },
        { id: rid('wd'), name: 'Spicy Nuggets (6\'lı)', calories: 250, protein: 13, carbs: 16, fat: 16, fiber: 1 },
      ],
    },
    {
      category: 'Yan Ürünler',
      items: [
        { id: rid('wd'), name: 'Patates (Küçük)', calories: 230, protein: 3, carbs: 30, fat: 11, fiber: 3 },
        { id: rid('wd'), name: 'Patates (Orta)', calories: 320, protein: 4, carbs: 42, fat: 15, fiber: 4 },
        { id: rid('wd'), name: 'Patates (Büyük)', calories: 420, protein: 6, carbs: 56, fat: 20, fiber: 5 },
        { id: rid('wd'), name: 'Baconlu Peynirli Patates', calories: 480, protein: 14, carbs: 50, fat: 25, fiber: 5 },
        { id: rid('wd'), name: 'Chili (Küçük)', calories: 240, protein: 17, carbs: 23, fat: 9, fiber: 6 },
        { id: rid('wd'), name: 'Fırın Patates (Sade)', calories: 270, protein: 7, carbs: 61, fat: 0, fiber: 7 },
      ],
    },
    {
      category: 'Tatlı & İçecek',
      items: [
        { id: rid('wd'), name: 'Frosty Çikolata (Küçük)', calories: 340, protein: 8, carbs: 57, fat: 9, fiber: 0 },
        { id: rid('wd'), name: 'Frosty Vanilya (Küçük)', calories: 340, protein: 8, carbs: 56, fat: 9, fiber: 0 },
        { id: rid('wd'), name: 'Coca-Cola (Orta)', calories: 200, protein: 0, carbs: 54, fat: 0, fiber: 0 },
        { id: rid('wd'), name: 'Coca-Cola Zero (Orta)', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// SİMİT SARAYI — TR fırın/kafe zinciri (ortalama porsiyon değerleri)
// ═══════════════════════════════════════════════════════════════════════════════

const simitSarayi: Restaurant = {
  id: 'simit-sarayi',
  name: 'Simit Sarayı',
  logo: '🥨',
  color: '#C8102E',
  categories: [
    {
      category: 'Fırın',
      items: [
        { id: rid('ss'), name: 'Simit', calories: 280, protein: 9, carbs: 53, fat: 4, fiber: 3, grams: 100 },
        { id: rid('ss'), name: 'Çikolatalı Simit', calories: 360, protein: 9, carbs: 60, fat: 11, fiber: 3, grams: 110 },
        { id: rid('ss'), name: 'Açma', calories: 290, protein: 6, carbs: 38, fat: 13, fiber: 1, grams: 90 },
        { id: rid('ss'), name: 'Peynirli Poğaça', calories: 270, protein: 8, carbs: 28, fat: 14, fiber: 1, grams: 90 },
        { id: rid('ss'), name: 'Patatesli Poğaça', calories: 250, protein: 5, carbs: 32, fat: 11, fiber: 2, grams: 90 },
        { id: rid('ss'), name: 'Zeytinli Poğaça', calories: 260, protein: 5, carbs: 30, fat: 13, fiber: 2, grams: 90 },
        { id: rid('ss'), name: 'Su Böreği (1 dilim)', calories: 320, protein: 12, carbs: 30, fat: 17, fiber: 1, grams: 150 },
        { id: rid('ss'), name: 'Sigara Böreği (3\'lü)', calories: 290, protein: 9, carbs: 26, fat: 16, fiber: 1, grams: 120 },
      ],
    },
    {
      category: 'Sandviç & Tost',
      items: [
        { id: rid('ss'), name: 'Kaşarlı Tost', calories: 420, protein: 18, carbs: 42, fat: 20, fiber: 2 },
        { id: rid('ss'), name: 'Karışık Tost (kaşar+sucuk)', calories: 510, protein: 23, carbs: 43, fat: 27, fiber: 2 },
        { id: rid('ss'), name: 'Simit Sandviç (peynir-domates)', calories: 430, protein: 16, carbs: 56, fat: 15, fiber: 4 },
        { id: rid('ss'), name: 'Kaşarlı Açma', calories: 380, protein: 12, carbs: 38, fat: 19, fiber: 1 },
      ],
    },
    {
      category: 'Tatlı',
      items: [
        { id: rid('ss'), name: 'Çikolatalı Kurabiye', calories: 210, protein: 3, carbs: 26, fat: 11, fiber: 1 },
        { id: rid('ss'), name: 'Brownie', calories: 340, protein: 5, carbs: 42, fat: 18, fiber: 2 },
        { id: rid('ss'), name: 'Cheesecake (1 dilim)', calories: 390, protein: 7, carbs: 36, fat: 24, fiber: 1 },
      ],
    },
    {
      category: 'İçecekler',
      items: [
        { id: rid('ss'), name: 'Çay', calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0 },
        { id: rid('ss'), name: 'Türk Kahvesi (sade)', calories: 5, protein: 0, carbs: 1, fat: 0, fiber: 0 },
        { id: rid('ss'), name: 'Sütlü Latte', calories: 150, protein: 8, carbs: 14, fat: 7, fiber: 0 },
        { id: rid('ss'), name: 'Ayran (300ml)', calories: 107, protein: 9, carbs: 8, fat: 5, fiber: 0 },
        { id: rid('ss'), name: 'Taze Portakal Suyu (300ml)', calories: 135, protein: 2, carbs: 31, fat: 0, fiber: 1 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// KOMAGENE — çiğ köfte zinciri (etsiz çiğ köfte, ortalama porsiyon değerleri)
// ═══════════════════════════════════════════════════════════════════════════════

const komagene: Restaurant = {
  id: 'komagene',
  name: 'Komagene',
  logo: '🌶️',
  color: '#8B0000',
  categories: [
    {
      category: 'Çiğ Köfte',
      items: [
        { id: rid('km'), name: 'Çiğ Köfte (100g)', calories: 150, protein: 4, carbs: 30, fat: 2, fiber: 3, grams: 100 },
        { id: rid('km'), name: 'Çiğ Köfte (250g porsiyon)', calories: 375, protein: 10, carbs: 75, fat: 5, fiber: 7, grams: 250 },
        { id: rid('km'), name: 'Çiğ Köfte (500g)', calories: 750, protein: 20, carbs: 150, fat: 10, fiber: 14, grams: 500 },
        { id: rid('km'), name: 'Çiğ Köfte Dürüm (orta)', calories: 420, protein: 11, carbs: 78, fat: 7, fiber: 6 },
        { id: rid('km'), name: 'Çiğ Köfte Dürüm (büyük)', calories: 560, protein: 14, carbs: 104, fat: 9, fiber: 8 },
        { id: rid('km'), name: 'Çiğ Köfte Wrap (marul-domates)', calories: 390, protein: 10, carbs: 72, fat: 6, fiber: 7 },
      ],
    },
    {
      category: 'Yan & Ekstra',
      items: [
        { id: rid('km'), name: 'Patso (patates-köfte)', calories: 480, protein: 9, carbs: 70, fat: 18, fiber: 5 },
        { id: rid('km'), name: 'Acılı Sos (ekstra)', calories: 30, protein: 0, carbs: 6, fat: 1, fiber: 1 },
        { id: rid('km'), name: 'Lavash (1 adet)', calories: 90, protein: 3, carbs: 18, fat: 1, fiber: 1 },
      ],
    },
    {
      category: 'İçecekler',
      items: [
        { id: rid('km'), name: 'Şalgam (300ml)', calories: 30, protein: 1, carbs: 6, fat: 0, fiber: 1 },
        { id: rid('km'), name: 'Ayran (300ml)', calories: 107, protein: 9, carbs: 8, fat: 5, fiber: 0 },
        { id: rid('km'), name: 'Limonata (300ml)', calories: 130, protein: 0, carbs: 33, fat: 0, fiber: 0 },
        { id: rid('km'), name: 'Soda', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// MADO — Maraş dondurması & geleneksel tatlı zinciri (ortalama porsiyon değerleri)
// ═══════════════════════════════════════════════════════════════════════════════

const mado: Restaurant = {
  id: 'mado',
  name: 'Mado',
  logo: '🍨',
  color: '#6D1F2C',
  categories: [
    {
      category: 'Dondurma',
      items: [
        { id: rid('md'), name: 'Maraş Dondurması (1 top)', calories: 140, protein: 4, carbs: 17, fat: 6, fiber: 0, grams: 70 },
        { id: rid('md'), name: 'Maraş Dondurması (3 top)', calories: 420, protein: 11, carbs: 50, fat: 19, fiber: 0, grams: 210 },
        { id: rid('md'), name: 'Kaymaklı Dondurma Tabağı', calories: 520, protein: 13, carbs: 56, fat: 27, fiber: 1, grams: 250 },
        { id: rid('md'), name: 'Çikolatalı Dondurma (2 top)', calories: 320, protein: 7, carbs: 38, fat: 15, fiber: 1, grams: 140 },
        { id: rid('md'), name: 'Dondurmalı Waffle', calories: 680, protein: 12, carbs: 84, fat: 33, fiber: 3 },
      ],
    },
    {
      category: 'Geleneksel Tatlı',
      items: [
        { id: rid('md'), name: 'Künefe (porsiyon)', calories: 560, protein: 14, carbs: 62, fat: 28, fiber: 1, grams: 200 },
        { id: rid('md'), name: 'Kazandibi', calories: 280, protein: 7, carbs: 44, fat: 8, fiber: 0, grams: 150 },
        { id: rid('md'), name: 'Sütlaç', calories: 250, protein: 7, carbs: 42, fat: 6, fiber: 0, grams: 180 },
        { id: rid('md'), name: 'Profiterol', calories: 470, protein: 8, carbs: 48, fat: 28, fiber: 2, grams: 180 },
        { id: rid('md'), name: 'Baklava (2 dilim)', calories: 380, protein: 6, carbs: 42, fat: 21, fiber: 2, grams: 120 },
        { id: rid('md'), name: 'Antep Fıstıklı Kadayıf', calories: 430, protein: 8, carbs: 50, fat: 22, fiber: 2, grams: 150 },
      ],
    },
    {
      category: 'İçecekler',
      items: [
        { id: rid('md'), name: 'Salep (sıcak)', calories: 190, protein: 6, carbs: 32, fat: 5, fiber: 0 },
        { id: rid('md'), name: 'Türk Kahvesi (sade)', calories: 5, protein: 0, carbs: 1, fat: 0, fiber: 0 },
        { id: rid('md'), name: 'Limonata (300ml)', calories: 130, protein: 0, carbs: 33, fat: 0, fiber: 0 },
        { id: rid('md'), name: 'Sıcak Çikolata', calories: 280, protein: 8, carbs: 38, fat: 11, fiber: 2 },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// Export — Tüm restoranlar
// ═══════════════════════════════════════════════════════════════════════════════

export const restaurants: Restaurant[] = [
  mcdonalds,
  burgerKing,
  kfc,
  popeyes,
  carlsJr,
  tavukDunyasi,
  subway,
  doyuyo,
  dominos,
  littleCaesars,
  pizzaHut,
  sbarro,
  arbys,
  starbucks,
  coffy,
  houseOfB,
  whiteBurger,
  cookshop,
  bigChefs,
  greenSalads,
  zulaBurger,
  gloriaJeans,
  nusret,
  sunsetGrill,
  wendys,
  simitSarayi,
  komagene,
  mado,
]
