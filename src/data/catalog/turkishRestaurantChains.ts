import { food, S } from './helpers'
import type { FoodCatalogItem } from '../../types/food'

export const TURKISH_RESTAURANT_CHAINS: FoodCatalogItem[] = [
  // ── Simit Sarayi ──────────────────────────────────────────
  food({ id: 'cat-r-simit-sarayi-simit', name: 'Simit', brand: 'Simit Sarayi', cat: 'Ekmek & Unlu Mamuller', sub: 'Hamur Isi', cal: 277, p: 8, c: 50, f: 4, fib: 2, servings: [S.adet(120, '1 adet'), S.g100], aliases: ['simit sarayi simit', 'turkish bagel', 'simit'] }),
  food({ id: 'cat-r-simit-sarayi-pogaca', name: 'Peynirli Pogaca', brand: 'Simit Sarayi', cat: 'Ekmek & Unlu Mamuller', sub: 'Hamur Isi', cal: 310, p: 8, c: 35, f: 15, fib: 1.5, servings: [S.adet(80, '1 adet'), S.g100], aliases: ['simit sarayi pogaca', 'cheese pastry', 'peynirli pogaca'] }),
  food({ id: 'cat-r-simit-sarayi-acma', name: 'Acma', brand: 'Simit Sarayi', cat: 'Ekmek & Unlu Mamuller', sub: 'Hamur Isi', cal: 290, p: 7, c: 38, f: 12, fib: 1, servings: [S.adet(80, '1 adet'), S.g100], aliases: ['simit sarayi acma', 'soft roll', 'acma'] }),
  food({ id: 'cat-r-simit-sarayi-borek', name: 'Peynirli Borek', brand: 'Simit Sarayi', cat: 'Ekmek & Unlu Mamuller', sub: 'Hamur Isi', cal: 270, p: 9, c: 28, f: 14, fib: 1, servings: [S.dilim(150, '1 dilim'), S.g100], aliases: ['simit sarayi borek', 'cheese borek', 'peynirli borek'] }),
  food({ id: 'cat-r-simit-sarayi-menemen', name: 'Menemen Porsiyon', brand: 'Simit Sarayi', cat: 'Kahvaltı', sub: 'Yumurta', cal: 88, p: 5, c: 4, f: 6, fib: 0.5, servings: [S.porsiyon(250, '1 porsiyon'), S.g100], aliases: ['simit sarayi menemen', 'menemen', 'turkish scrambled eggs'] }),
  food({ id: 'cat-r-simit-sarayi-cay', name: 'Cay', brand: 'Simit Sarayi', cat: 'İçecek', sub: 'Cay', cal: 1, p: 0, c: 0.2, f: 0, fib: 0, servings: [S.bardak(100, '1 bardak'), S.ml100], aliases: ['simit sarayi cay', 'turkish tea', 'cay'] }),

  // ── Kofteci Yusuf ─────────────────────────────────────────
  food({ id: 'cat-r-kofteci-kofte', name: 'Izgara Kofte', brand: 'Kofteci Yusuf', cat: 'Ana Yemek', sub: 'Kofte', cal: 220, p: 18, c: 5, f: 14, fib: 0, servings: [S.porsiyon(300, '1 porsiyon (6 adet)'), S.g100], aliases: ['kofteci yusuf kofte', 'grilled meatballs', 'izgara kofte'] }),
  food({ id: 'cat-r-kofteci-pilav', name: 'Tereyagli Pilav', brand: 'Kofteci Yusuf', cat: 'Pilav & Makarna', sub: 'Pilav', cal: 170, p: 3, c: 28, f: 5, fib: 0.5, servings: [S.porsiyon(200, '1 porsiyon'), S.g100], aliases: ['kofteci yusuf pilav', 'butter rice', 'tereyagli pilav'] }),
  food({ id: 'cat-r-kofteci-piyaz', name: 'Piyaz', brand: 'Kofteci Yusuf', cat: 'Ana Yemek', sub: 'Salata', cal: 95, p: 4, c: 14, f: 2.5, fib: 3, servings: [S.porsiyon(200, '1 porsiyon'), S.g100], aliases: ['kofteci yusuf piyaz', 'bean salad', 'piyaz'] }),
  food({ id: 'cat-r-kofteci-ayran', name: 'Kofteci Yusuf Ayran', brand: 'Kofteci Yusuf', cat: 'İçecek', sub: 'Sut Icecek', cal: 38, p: 1.8, c: 2.4, f: 1.8, fib: 0, servings: [S.bardak(300, '1 bardak'), S.ml100], aliases: ['kofteci yusuf ayran', 'ayran', 'yogurt drink'] }),

  // ── Tavuk Dunyasi ─────────────────────────────────────────
  food({ id: 'cat-r-td-izgara-tavuk', name: 'Izgara Tavuk Menu', brand: 'Tavuk Dunyasi', cat: 'Ana Yemek', sub: 'Tavuk', cal: 165, p: 31, c: 0, f: 3.6, fib: 0, servings: [S.porsiyon(200, '1 porsiyon'), S.g100], aliases: ['tavuk dunyasi izgara', 'grilled chicken', 'izgara tavuk'] }),
  food({ id: 'cat-r-td-tavuk-sis', name: 'Tavuk Sis', brand: 'Tavuk Dunyasi', cat: 'Ana Yemek', sub: 'Tavuk', cal: 175, p: 28, c: 2, f: 6, fib: 0, servings: [S.porsiyon(200, '1 porsiyon'), S.g100], aliases: ['tavuk dunyasi sis', 'chicken skewer', 'tavuk sis'] }),
  food({ id: 'cat-r-td-kanat', name: 'Tavuk Kanat (6 adet)', brand: 'Tavuk Dunyasi', cat: 'Fast Food', sub: 'Tavuk', cal: 266, p: 27, c: 0, f: 17, fib: 0, servings: [S.porsiyon(180, '6 adet'), S.g100], aliases: ['tavuk dunyasi kanat', 'chicken wings', 'tavuk kanat'] }),
  food({ id: 'cat-r-td-nugget', name: 'Tavuk Nugget', brand: 'Tavuk Dunyasi', cat: 'Fast Food', sub: 'Tavuk', cal: 270, p: 14, c: 17, f: 16, fib: 0.5, servings: [S.adet(108, '6 adet'), S.g100], aliases: ['tavuk dunyasi nugget', 'chicken nuggets', 'tavuk nugget'] }),
  food({ id: 'cat-r-td-pilav', name: 'Pilav Porsiyon', brand: 'Tavuk Dunyasi', cat: 'Pilav & Makarna', sub: 'Pilav', cal: 160, p: 3, c: 28, f: 4, fib: 0.5, servings: [S.porsiyon(200, '1 porsiyon'), S.g100], aliases: ['tavuk dunyasi pilav', 'rice portion', 'pilav'] }),

  // ── Baydoner ──────────────────────────────────────────────
  food({ id: 'cat-r-baydoner-tavuk', name: 'Tavuk Doner Durum', brand: 'Baydoner', cat: 'Fast Food', sub: 'Doner', cal: 210, p: 14, c: 18, f: 9, fib: 1, servings: [S.adet(250, '1 adet'), S.g100], aliases: ['baydoner tavuk durum', 'chicken doner wrap', 'tavuk doner durum'] }),
  food({ id: 'cat-r-baydoner-et', name: 'Et Doner Durum', brand: 'Baydoner', cat: 'Fast Food', sub: 'Doner', cal: 250, p: 13, c: 18, f: 14, fib: 1, servings: [S.adet(250, '1 adet'), S.g100], aliases: ['baydoner et durum', 'beef doner wrap', 'et doner durum'] }),
  food({ id: 'cat-r-baydoner-iskender', name: 'Iskender', brand: 'Baydoner', cat: 'Ana Yemek', sub: 'Kebap', cal: 186, p: 10, c: 13, f: 11, fib: 0.5, servings: [S.porsiyon(400, '1 porsiyon'), S.g100], aliases: ['baydoner iskender', 'iskender kebab', 'iskender'] }),
  food({ id: 'cat-r-baydoner-pilav', name: 'Tereyagli Pilav', brand: 'Baydoner', cat: 'Pilav & Makarna', sub: 'Pilav', cal: 168, p: 3, c: 27, f: 5.5, fib: 0.5, servings: [S.porsiyon(200, '1 porsiyon'), S.g100], aliases: ['baydoner pilav', 'butter rice', 'tereyagli pilav'] }),

  // ── Komagene ──────────────────────────────────────────────
  food({ id: 'cat-r-komagene-durum', name: 'Cig Kofte Durum', brand: 'Komagene', cat: 'Fast Food', sub: 'Sokak Yemekleri', cal: 167, p: 4.7, c: 25, f: 5.3, fib: 3, servings: [S.adet(150, '1 adet'), S.g100], aliases: ['komagene durum', 'raw meatball wrap', 'cig kofte durum'] }),
  food({ id: 'cat-r-komagene-cig-kofte', name: 'Cig Kofte Porsiyon', brand: 'Komagene', cat: 'Fast Food', sub: 'Sokak Yemekleri', cal: 175, p: 5, c: 28, f: 4.5, fib: 3.5, servings: [S.porsiyon(200, '1 porsiyon'), S.g100], aliases: ['komagene cig kofte', 'raw meatball portion', 'cig kofte'] }),
  food({ id: 'cat-r-komagene-ayran', name: 'Komagene Ayran', brand: 'Komagene', cat: 'İçecek', sub: 'Sut Icecek', cal: 38, p: 1.8, c: 2.4, f: 1.8, fib: 0, servings: [S.bardak(250, '1 bardak'), S.ml100], aliases: ['komagene ayran', 'ayran', 'yogurt drink'] }),

  // ── Mado ──────────────────────────────────────────────────
  food({ id: 'cat-r-mado-dondurma', name: 'Maras Dondurma (Sade)', brand: 'Mado', cat: 'Tatlı & Çikolata', sub: 'Dondurma', cal: 200, p: 4, c: 24, f: 10, fib: 0, servings: [S.custom('1 top', 'porsiyon', 80), S.g100], aliases: ['mado dondurma', 'maras ice cream', 'maras dondurmasi'] }),
  food({ id: 'cat-r-mado-kazandibi', name: 'Kazandibi', brand: 'Mado', cat: 'Tatlı & Çikolata', sub: 'Sutlu Tatli', cal: 130, p: 3, c: 21, f: 4, fib: 0, servings: [S.porsiyon(200, '1 porsiyon'), S.g100], aliases: ['mado kazandibi', 'caramelized milk pudding', 'kazandibi'] }),
  food({ id: 'cat-r-mado-sutlac', name: 'Sutlac', brand: 'Mado', cat: 'Tatlı & Çikolata', sub: 'Sutlu Tatli', cal: 125, p: 3, c: 20, f: 3.5, fib: 0, servings: [S.porsiyon(200, '1 porsiyon'), S.g100], aliases: ['mado sutlac', 'rice pudding', 'sutlac'] }),
  food({ id: 'cat-r-mado-kunefe', name: 'Kunefe', brand: 'Mado', cat: 'Tatlı & Çikolata', sub: 'Serbetli Tatli', cal: 300, p: 5, c: 33, f: 17, fib: 0.5, servings: [S.porsiyon(180, '1 porsiyon'), S.g100], aliases: ['mado kunefe', 'kunefe dessert', 'kunefe'] }),

  // ── Big Chefs ─────────────────────────────────────────────
  food({ id: 'cat-r-bigchefs-burger', name: 'Classic Burger', brand: 'Big Chefs', cat: 'Fast Food', sub: 'Burger', cal: 250, p: 15, c: 16, f: 14, fib: 1, servings: [S.adet(250, '1 adet'), S.g100], aliases: ['big chefs burger', 'classic burger', 'bigchefs hamburger'] }),
  food({ id: 'cat-r-bigchefs-salata', name: 'Caesar Salata', brand: 'Big Chefs', cat: 'Ana Yemek', sub: 'Salata', cal: 100, p: 5, c: 7, f: 6, fib: 1.5, servings: [S.porsiyon(250, '1 porsiyon'), S.g100], aliases: ['big chefs salata', 'caesar salad', 'sezar salata'] }),
  food({ id: 'cat-r-bigchefs-pasta', name: 'Fettuccine Alfredo', brand: 'Big Chefs', cat: 'Pilav & Makarna', sub: 'Makarna', cal: 200, p: 8, c: 22, f: 9, fib: 1, servings: [S.porsiyon(350, '1 porsiyon'), S.g100], aliases: ['big chefs pasta', 'fettuccine alfredo', 'makarna alfredo'] }),

  // ── Nusr-Et ───────────────────────────────────────────────
  food({ id: 'cat-r-nusret-burger', name: 'Nusret Burger', brand: 'Nusr-Et', cat: 'Fast Food', sub: 'Burger', cal: 280, p: 18, c: 14, f: 17, fib: 0.5, servings: [S.adet(300, '1 adet'), S.g100], aliases: ['nusret burger', 'nusr-et burger', 'salt bae burger'] }),
  food({ id: 'cat-r-nusret-lokum', name: 'Lokum Steak', brand: 'Nusr-Et', cat: 'Ana Yemek', sub: 'Et', cal: 250, p: 26, c: 0, f: 16, fib: 0, servings: [S.porsiyon(200, '1 porsiyon'), S.g100], aliases: ['nusret lokum', 'lokum steak', 'turkish delight steak'] }),
  food({ id: 'cat-r-nusret-kaburga', name: 'Kaburga', brand: 'Nusr-Et', cat: 'Ana Yemek', sub: 'Et', cal: 290, p: 20, c: 2, f: 23, fib: 0, servings: [S.porsiyon(250, '1 porsiyon'), S.g100], aliases: ['nusret kaburga', 'beef ribs', 'kaburga'] }),

  // ── Hatay Medeniyetler Sofrasi ─────────────────────────────
  food({ id: 'cat-r-hatay-kebap', name: 'Kagit Kebabi', brand: 'Hatay Medeniyetler Sofrasi', cat: 'Ana Yemek', sub: 'Kebap', cal: 160, p: 12, c: 6, f: 10, fib: 1, servings: [S.porsiyon(300, '1 porsiyon'), S.g100], aliases: ['hatay kagit kebabi', 'paper kebab', 'kagit kebap'] }),
  food({ id: 'cat-r-hatay-kunefe', name: 'Kunefe', brand: 'Hatay Medeniyetler Sofrasi', cat: 'Tatlı & Çikolata', sub: 'Serbetli Tatli', cal: 300, p: 5, c: 33, f: 17, fib: 0.5, servings: [S.porsiyon(200, '1 porsiyon'), S.g100], aliases: ['hatay kunefe', 'hatay dessert', 'kunefe'] }),
  food({ id: 'cat-r-hatay-humus', name: 'Humus', brand: 'Hatay Medeniyetler Sofrasi', cat: 'Ana Yemek', sub: 'Meze', cal: 166, p: 8, c: 14, f: 10, fib: 6, servings: [S.porsiyon(120, '1 porsiyon'), S.g100], aliases: ['hatay humus', 'hummus', 'humus'] }),
]
