import { food, S } from './helpers'
import type { FoodCatalogItem } from '../../types/food'

export const SNACK_SWEETS: FoodCatalogItem[] = [
  // ── Çikolata ─────────────────────────────────────────────
  food({ id: 'cat-sutlu-cikolata', name: 'Sütlü Çikolata', cat: 'Tatlı & Çikolata', sub: 'Çikolata', cal: 535, p: 8, c: 57, f: 31, fib: 2, servings: [S.g100, S.custom('1 kare', 'dilim', 5), S.custom('1 sıra (4 kare)', 'dilim', 20), S.paket(80, '1 tablet'), S.porsiyon(25, '1 porsiyon')], aliases: ['milk chocolate', 'sutlu cikolata', 'chocolate'] }),
  food({ id: 'cat-bitter-cikolata', name: 'Bitter Çikolata (%70)', cat: 'Tatlı & Çikolata', sub: 'Çikolata', cal: 560, p: 8, c: 40, f: 40, fib: 8, servings: [S.g100, S.custom('1 kare', 'dilim', 5), S.paket(80, '1 tablet'), S.porsiyon(25)], aliases: ['dark chocolate', 'bitter cikolata'] }),
  food({ id: 'cat-beyaz-cikolata', name: 'Beyaz Çikolata', cat: 'Tatlı & Çikolata', sub: 'Çikolata', cal: 539, p: 6, c: 59, f: 32, fib: 0, servings: [S.g100, S.custom('1 kare', 'dilim', 5), S.paket(80)], aliases: ['white chocolate', 'beyaz cikolata'] }),
  food({ id: 'cat-cikolatali-gofret', name: 'Çikolatalı Gofret', cat: 'Tatlı & Çikolata', sub: 'Gofret', cal: 517, p: 6.7, c: 60, f: 27, fib: 1.5, servings: [S.adet(30, '1 adet'), S.custom('2 adet', 'adet', 60), S.g100], aliases: ['wafer', 'gofret', 'chocolate wafer'] }),

  // ── Bisküvi & Kurabiye ───────────────────────────────────
  food({ id: 'cat-biskuvi-sade', name: 'Bisküvi (Sade)', cat: 'Tatlı & Çikolata', sub: 'Bisküvi', cal: 437, p: 6.3, c: 62.5, f: 18.8, fib: 2, servings: [S.adet(8, '1 adet'), S.custom('5 adet', 'adet', 40), S.g100], aliases: ['biscuit', 'biskuvi', 'cookie'] }),
  food({ id: 'cat-kurabiye', name: 'Kurabiye', cat: 'Tatlı & Çikolata', sub: 'Kurabiye', cal: 440, p: 6, c: 56, f: 22, fib: 1, servings: [S.adet(25, '1 adet'), S.custom('3 adet', 'adet', 75), S.g100], aliases: ['cookie', 'kurabiye', 'shortbread'] }),

  // ── Kek & Pasta ──────────────────────────────────────────
  food({ id: 'cat-kek-dilim', name: 'Kek (Kakaolu)', cat: 'Tatlı & Çikolata', sub: 'Kek', cal: 388, p: 5, c: 50, f: 18.8, fib: 2, servings: [S.dilim(80, '1 dilim'), S.g100], aliases: ['cake', 'kek', 'chocolate cake'] }),
  food({ id: 'cat-brownie', name: 'Brownie', cat: 'Tatlı & Çikolata', sub: 'Kek', cal: 405, p: 5, c: 50, f: 21, fib: 2.5, servings: [S.adet(65, '1 parça'), S.g100], aliases: ['brownie', 'chocolate brownie'] }),
  food({ id: 'cat-donut', name: 'Donut', cat: 'Tatlı & Çikolata', sub: 'Hamur Tatlısı', cal: 403, p: 5, c: 49, f: 21, fib: 1.5, servings: [S.adet(65, '1 adet'), S.g100], aliases: ['donut', 'doughnut'] }),
  food({ id: 'cat-cheesecake', name: 'Cheesecake (1 Dilim)', cat: 'Tatlı & Çikolata', sub: 'Pasta', cal: 321, p: 5.5, c: 25, f: 23, fib: 0.5, servings: [S.dilim(120, '1 dilim'), S.g100], aliases: ['cheesecake', 'san sebastian', 'cheese cake'] }),
  food({ id: 'cat-tiramisu', name: 'Tiramisu', cat: 'Tatlı & Çikolata', sub: 'Pasta', cal: 283, p: 5, c: 28, f: 17, fib: 0.5, servings: [S.porsiyon(120, '1 porsiyon'), S.g100], aliases: ['tiramisu'] }),
  food({ id: 'cat-waffle', name: 'Waffle (Sade)', cat: 'Tatlı & Çikolata', sub: 'Hamur Tatlısı', cal: 333, p: 6.7, c: 42.7, f: 16, fib: 1.5, servings: [S.adet(75, '1 adet'), S.g100], aliases: ['waffle', 'belgian waffle'] }),
  food({ id: 'cat-krep-cikolatali', name: 'Krep (Çikolatalı, Muzlu)', cat: 'Tatlı & Çikolata', sub: 'Hamur Tatlısı', cal: 250, p: 5, c: 32, f: 11.4, fib: 1, servings: [S.adet(140, '1 adet'), S.g100], aliases: ['crepe', 'krep', 'chocolate crepe'] }),

  // ── Türk Tatlıları ───────────────────────────────────────
  food({ id: 'cat-baklava', name: 'Baklava', cat: 'Tatlı & Çikolata', sub: 'Şerbetli Tatlı', cal: 383, p: 5, c: 42, f: 23, fib: 1.5, servings: [S.adet(60, '1 dilim'), S.custom('2 dilim', 'adet', 120), S.g100], aliases: ['baklava'] }),
  food({ id: 'cat-sutlac', name: 'Sütlaç', cat: 'Tatlı & Çikolata', sub: 'Sütlü Tatlı', cal: 125, p: 3, c: 20, f: 3.5, fib: 0, servings: [S.kase(200, '1 kase'), S.g100], aliases: ['rice pudding', 'sutlac'] }),
  food({ id: 'cat-kazandibi', name: 'Kazandibi', cat: 'Tatlı & Çikolata', sub: 'Sütlü Tatlı', cal: 130, p: 3, c: 21, f: 4, fib: 0, servings: [S.kase(200, '1 kase'), S.g100], aliases: ['kazandibi', 'caramelized pudding'] }),
  food({ id: 'cat-kunefe', name: 'Künefe', cat: 'Tatlı & Çikolata', sub: 'Şerbetli Tatlı', cal: 300, p: 5.3, c: 33.3, f: 16.7, fib: 0.5, servings: [S.porsiyon(150, '1 porsiyon'), S.g100], aliases: ['kunefe', 'künefe', 'knafeh'] }),
  food({ id: 'cat-profiterol', name: 'Profiterol', cat: 'Tatlı & Çikolata', sub: 'Pasta', cal: 253, p: 3.3, c: 23.3, f: 16.7, fib: 1, servings: [S.porsiyon(150, '1 porsiyon'), S.g100], aliases: ['profiterole', 'profiterol'] }),
  food({ id: 'cat-trilece', name: 'Trileçe', cat: 'Tatlı & Çikolata', sub: 'Sütlü Tatlı', cal: 208, p: 4.2, c: 29.2, f: 8.3, fib: 0, servings: [S.dilim(120, '1 dilim'), S.g100], aliases: ['tres leches', 'trilece'] }),
  food({ id: 'cat-lokma', name: 'Lokma', cat: 'Tatlı & Çikolata', sub: 'Şerbetli Tatlı', cal: 317, p: 3.3, c: 40, f: 16.7, fib: 0.5, servings: [S.adet(30, '1 adet'), S.custom('5 adet', 'adet', 150), S.g100], aliases: ['lokma', 'fried dough balls'] }),
  food({ id: 'cat-dondurma', name: 'Dondurma (Sade)', cat: 'Tatlı & Çikolata', sub: 'Dondurma', cal: 200, p: 3.5, c: 24, f: 10, fib: 0, servings: [S.custom('1 top', 'adet', 70), S.custom('2 top', 'adet', 140), S.kase(100), S.g100], aliases: ['ice cream', 'dondurma', 'gelato'] }),
  food({ id: 'cat-puding', name: 'Puding (Çikolatalı)', cat: 'Tatlı & Çikolata', sub: 'Sütlü Tatlı', cal: 120, p: 3, c: 18, f: 4, fib: 0.5, servings: [S.kase(130, '1 kase'), S.g100], aliases: ['pudding', 'puding', 'chocolate pudding'] }),

  // ── Cips ─────────────────────────────────────────────────
  food({ id: 'cat-patates-cipsi', name: 'Patates Cipsi', cat: 'Cips & Paketli Gıda', sub: 'Cips', cal: 536, p: 7, c: 50, f: 34, fib: 4.4, servings: [S.g100, S.paket(90, '1 büyük paket'), S.custom('1 avuç', 'porsiyon', 30), S.paket(30, '1 küçük paket')], aliases: ['potato chips', 'chips', 'cips', 'patates cipsi', 'lays', 'pringles'] }),
  food({ id: 'cat-misir-cipsi', name: 'Mısır Cipsi', cat: 'Cips & Paketli Gıda', sub: 'Cips', cal: 490, p: 6, c: 60, f: 25, fib: 4, servings: [S.g100, S.paket(80), S.custom('1 avuç', 'porsiyon', 30)], aliases: ['corn chips', 'doritos', 'misir cipsi'] }),
  food({ id: 'cat-tortilla-cips', name: 'Tortilla Cips', cat: 'Cips & Paketli Gıda', sub: 'Cips', cal: 489, p: 7, c: 63, f: 23, fib: 5, servings: [S.g100, S.paket(80), S.custom('1 avuç', 'porsiyon', 30)], aliases: ['tortilla chips', 'nachos chips'] }),
  food({ id: 'cat-kraker', name: 'Kraker', cat: 'Cips & Paketli Gıda', sub: 'Kraker', cal: 480, p: 9, c: 62, f: 22, fib: 3, servings: [S.g100, S.paket(70), S.adet(5, '1 adet')], aliases: ['cracker', 'kraker'] }),
  food({ id: 'cat-patlamis-misir', name: 'Patlamış Mısır (Tereyağlı)', cat: 'Cips & Paketli Gıda', sub: 'Atıştırmalık', cal: 520, p: 9, c: 55, f: 30, fib: 10, servings: [S.g100, S.paket(50, '1 küçük paket'), S.custom('1 avuç', 'porsiyon', 20)], aliases: ['popcorn', 'patlamis misir', 'misir patlagi'] }),

  // ── Kuruyemiş ────────────────────────────────────────────
  food({ id: 'cat-badem', name: 'Badem', cat: 'Kuruyemiş', sub: 'Sert Kabuklu', cal: 579, p: 21, c: 22, f: 50, fib: 12, servings: [S.g100, S.custom('1 avuç', 'porsiyon', 28), S.porsiyon(15, '10 adet')], aliases: ['almond', 'badem'] }),
  food({ id: 'cat-ceviz', name: 'Ceviz', cat: 'Kuruyemiş', sub: 'Sert Kabuklu', cal: 654, p: 15, c: 14, f: 65, fib: 7, servings: [S.g100, S.custom('1 avuç', 'porsiyon', 28), S.adet(5, '1 bütün (2 yarım)')], aliases: ['walnut', 'ceviz'] }),
  food({ id: 'cat-findik', name: 'Fındık', cat: 'Kuruyemiş', sub: 'Sert Kabuklu', cal: 628, p: 15, c: 17, f: 61, fib: 10, servings: [S.g100, S.custom('1 avuç', 'porsiyon', 28)], aliases: ['hazelnut', 'findik'] }),
  food({ id: 'cat-kaju', name: 'Kaju', cat: 'Kuruyemiş', sub: 'Sert Kabuklu', cal: 553, p: 18, c: 30, f: 44, fib: 3, servings: [S.g100, S.custom('1 avuç', 'porsiyon', 28)], aliases: ['cashew', 'kaju'] }),
  food({ id: 'cat-yer-fistigi', name: 'Yer Fıstığı', cat: 'Kuruyemiş', sub: 'Baklagil', cal: 567, p: 26, c: 16, f: 49, fib: 9, servings: [S.g100, S.custom('1 avuç', 'porsiyon', 28)], aliases: ['peanut', 'yer fistigi', 'yerfistigi'] }),
  food({ id: 'cat-antep-fistigi', name: 'Antep Fıstığı', cat: 'Kuruyemiş', sub: 'Sert Kabuklu', cal: 560, p: 20, c: 28, f: 45, fib: 10, servings: [S.g100, S.custom('1 avuç', 'porsiyon', 28)], aliases: ['pistachio', 'antep fistigi'] }),
  food({ id: 'cat-ay-cekirdegi', name: 'Ay Çekirdeği', cat: 'Kuruyemiş', sub: 'Çekirdek', cal: 584, p: 21, c: 20, f: 51, fib: 9, servings: [S.g100, S.custom('1 avuç', 'porsiyon', 30)], aliases: ['sunflower seeds', 'ay cekirdegi', 'cekirdek'] }),
  food({ id: 'cat-kabak-cekirdegi', name: 'Kabak Çekirdeği', cat: 'Kuruyemiş', sub: 'Çekirdek', cal: 559, p: 30, c: 11, f: 49, fib: 6, servings: [S.g100, S.custom('1 avuç', 'porsiyon', 28)], aliases: ['pumpkin seeds', 'kabak cekirdegi'] }),
  food({ id: 'cat-leblebi', name: 'Leblebi', cat: 'Kuruyemiş', sub: 'Baklagil', cal: 360, p: 20, c: 52, f: 6, fib: 12, servings: [S.g100, S.custom('1 avuç', 'porsiyon', 30)], aliases: ['roasted chickpeas', 'leblebi'] }),

  // ── Türk Tatlıları (devam) ───────────────────────────────
  food({ id: 'cat-tulumba', name: 'Tulumba Tatlısı', cat: 'Tatlı & Çikolata', sub: 'Şerbetli Tatlı', cal: 340, p: 3, c: 48, f: 15, fib: 0.5, servings: [S.adet(25, '1 adet'), S.custom('5 adet', 'adet', 125), S.g100], aliases: ['tulumba', 'fried dough syrup'] }),
  food({ id: 'cat-tel-kadayif', name: 'Tel Kadayıf', cat: 'Tatlı & Çikolata', sub: 'Şerbetli Tatlı', cal: 350, p: 5, c: 45, f: 17, fib: 1, servings: [S.porsiyon(150, '1 porsiyon'), S.g100], aliases: ['tel kadayif', 'shredded kadayif'] }),
  food({ id: 'cat-asure', name: 'Aşure', cat: 'Tatlı & Çikolata', sub: 'Şerbetli Tatlı', cal: 145, p: 3, c: 30, f: 2, fib: 2, servings: [S.kase(200, '1 kase'), S.g100], aliases: ['asure', 'noahs pudding'] }),
  food({ id: 'cat-keskul', name: 'Keşkül', cat: 'Tatlı & Çikolata', sub: 'Sütlü Tatlı', cal: 135, p: 3.5, c: 19, f: 5, fib: 0.5, servings: [S.kase(200, '1 kase'), S.g100], aliases: ['keskul', 'almond pudding'] }),
  food({ id: 'cat-tavuk-gogsu-tatlisi', name: 'Tavuk Göğsü Tatlısı', cat: 'Tatlı & Çikolata', sub: 'Sütlü Tatlı', cal: 140, p: 4, c: 24, f: 3, fib: 0, servings: [S.kase(200, '1 kase'), S.g100], aliases: ['tavuk gogsu tatlisi', 'chicken breast pudding'] }),
  food({ id: 'cat-sekerpare', name: 'Şekerpare', cat: 'Tatlı & Çikolata', sub: 'Şerbetli Tatlı', cal: 360, p: 4, c: 52, f: 15, fib: 0.5, servings: [S.adet(35, '1 adet'), S.custom('3 adet', 'adet', 105), S.g100], aliases: ['sekerpare', 'semolina cookie syrup'] }),
  food({ id: 'cat-revani', name: 'Revani', cat: 'Tatlı & Çikolata', sub: 'Şerbetli Tatlı', cal: 310, p: 4, c: 50, f: 11, fib: 0.5, servings: [S.dilim(80, '1 dilim'), S.g100], aliases: ['revani', 'semolina cake syrup'] }),
  food({ id: 'cat-gullac', name: 'Güllaç', cat: 'Tatlı & Çikolata', sub: 'Sütlü Tatlı', cal: 130, p: 3, c: 24, f: 2.5, fib: 0.5, servings: [S.porsiyon(150, '1 porsiyon'), S.g100], aliases: ['gullac', 'rosewater milk dessert'] }),
  food({ id: 'cat-hosmerim', name: 'Höşmerim', cat: 'Tatlı & Çikolata', sub: 'Sütlü Tatlı', cal: 250, p: 8, c: 28, f: 12, fib: 0.5, servings: [S.porsiyon(120, '1 porsiyon'), S.g100], aliases: ['hosmerim', 'cheese semolina dessert'] }),
  food({ id: 'cat-irmik-helvasi', name: 'İrmik Helvası', cat: 'Tatlı & Çikolata', sub: 'Helva', cal: 365, p: 5, c: 50, f: 16, fib: 1.5, servings: [S.porsiyon(120, '1 porsiyon'), S.g100], aliases: ['irmik helvasi', 'semolina halva'] }),
  food({ id: 'cat-un-helvasi', name: 'Un Helvası', cat: 'Tatlı & Çikolata', sub: 'Helva', cal: 410, p: 5, c: 48, f: 22, fib: 1, servings: [S.porsiyon(100, '1 porsiyon'), S.g100], aliases: ['un helvasi', 'flour halva'] }),
  food({ id: 'cat-tahin-helvasi', name: 'Tahin Helvası', cat: 'Tatlı & Çikolata', sub: 'Helva', cal: 516, p: 12, c: 50, f: 30, fib: 3, servings: [S.g100, S.dilim(40, '1 dilim')], aliases: ['tahin helvasi', 'tahini halva', 'helva'] }),
  food({ id: 'cat-kabak-tatlisi', name: 'Kabak Tatlısı', cat: 'Tatlı & Çikolata', sub: 'Şerbetli Tatlı', cal: 145, p: 1.5, c: 33, f: 1, fib: 2, servings: [S.porsiyon(150, '1 porsiyon'), S.g100], aliases: ['kabak tatlisi', 'candied pumpkin'] }),
  food({ id: 'cat-ayva-tatlisi', name: 'Ayva Tatlısı', cat: 'Tatlı & Çikolata', sub: 'Şerbetli Tatlı', cal: 140, p: 0.8, c: 34, f: 0.3, fib: 3, servings: [S.adet(150, '1 yarım'), S.g100], aliases: ['ayva tatlisi', 'quince dessert'] }),
  food({ id: 'cat-cevizli-sucuk', name: 'Cevizli Sucuk (Köme)', cat: 'Tatlı & Çikolata', sub: 'Geleneksel', cal: 410, p: 5, c: 58, f: 18, fib: 2, servings: [S.g100, S.dilim(30, '1 dilim')], aliases: ['cevizli sucuk', 'kome', 'churchkhela'] }),

  // ── Geleneksel Şekerleme & Tatlı (devam) ─────────────────
  food({ id: 'cat-lokum', name: 'Lokum (Türk Lokumu)', cat: 'Tatlı & Çikolata', sub: 'Şekerleme', cal: 330, p: 0.2, c: 82, f: 0.1, fib: 0.3, servings: [S.adet(15, '1 adet'), S.custom('3 adet', 'adet', 45), S.g100], aliases: ['turkish delight', 'lokum', 'rahat lokum'] }),
  food({ id: 'cat-pismaniye', name: 'Pişmaniye', cat: 'Tatlı & Çikolata', sub: 'Şekerleme', cal: 470, p: 5, c: 70, f: 18, fib: 0.5, servings: [S.g100, S.porsiyon(30, '1 avuç')], aliases: ['pismaniye', 'turkish cotton candy', 'floss halva'] }),
  food({ id: 'cat-cezerye', name: 'Cezerye', cat: 'Tatlı & Çikolata', sub: 'Geleneksel', cal: 340, p: 3, c: 65, f: 8, fib: 3, servings: [S.adet(15, '1 adet'), S.custom('4 adet', 'adet', 60), S.g100], aliases: ['cezerye', 'carrot delight'] }),
  food({ id: 'cat-supangle', name: 'Supangle', cat: 'Tatlı & Çikolata', sub: 'Sütlü Tatlı', cal: 165, p: 4, c: 24, f: 6, fib: 1, servings: [S.kase(150, '1 kase'), S.g100], aliases: ['supangle', 'chocolate pudding dessert'] }),
  food({ id: 'cat-sufle', name: 'Çikolatalı Sufle', cat: 'Tatlı & Çikolata', sub: 'Pasta', cal: 320, p: 6, c: 38, f: 16, fib: 2, servings: [S.adet(110, '1 adet'), S.g100], aliases: ['souffle', 'sufle', 'lava cake'] }),
  food({ id: 'cat-katmer', name: 'Katmer (Antep)', cat: 'Tatlı & Çikolata', sub: 'Hamur Tatlısı', cal: 390, p: 8, c: 40, f: 22, fib: 1.5, servings: [S.porsiyon(150, '1 porsiyon'), S.g100], aliases: ['katmer', 'pistachio pastry'] }),
  food({ id: 'cat-vezir-parmagi', name: 'Vezir Parmağı', cat: 'Tatlı & Çikolata', sub: 'Şerbetli Tatlı', cal: 345, p: 4, c: 50, f: 15, fib: 0.5, servings: [S.adet(40, '1 adet'), S.custom('3 adet', 'adet', 120), S.g100], aliases: ['vezir parmagi', 'fried syrup dessert'] }),
  food({ id: 'cat-magnolia', name: 'Magnolia (Bisküvili)', cat: 'Tatlı & Çikolata', sub: 'Sütlü Tatlı', cal: 175, p: 3, c: 24, f: 8, fib: 0.5, servings: [S.kase(150, '1 kase'), S.g100], aliases: ['magnolia', 'biscuit pudding'] }),

  // ── Tatlılar (devam 3) ───────────────────────────────────
  food({ id: 'cat-bici-bici', name: 'Bici Bici', cat: 'Tatlı & Çikolata', sub: 'Geleneksel', cal: 120, p: 0.5, c: 30, f: 0.1, fib: 0.5, servings: [S.porsiyon(200, '1 porsiyon'), S.g100], aliases: ['bici bici', 'starch dessert'] }),
  food({ id: 'cat-cennet-camuru', name: 'Cennet Çamuru', cat: 'Tatlı & Çikolata', sub: 'Sütlü Tatlı', cal: 160, p: 3, c: 22, f: 7, fib: 0.5, servings: [S.kase(150, '1 kase'), S.g100], aliases: ['cennet camuru', 'heavenly mud'] }),
  food({ id: 'cat-kemalpasa', name: 'Kemalpaşa Tatlısı', cat: 'Tatlı & Çikolata', sub: 'Şerbetli Tatlı', cal: 320, p: 5, c: 48, f: 12, fib: 0.3, servings: [S.adet(30, '1 adet'), S.custom('4 adet', 'adet', 120), S.g100], aliases: ['kemalpasa', 'cheese ball syrup'] }),
  food({ id: 'cat-sutlu-nuriye', name: 'Sütlü Nuriye', cat: 'Tatlı & Çikolata', sub: 'Sütlü Tatlı', cal: 220, p: 4, c: 28, f: 10, fib: 0.5, servings: [S.porsiyon(150, '1 porsiyon'), S.g100], aliases: ['sutlu nuriye', 'milk baklava'] }),
  food({ id: 'cat-dilber-dudagi', name: 'Dilber Dudağı', cat: 'Tatlı & Çikolata', sub: 'Şerbetli Tatlı', cal: 350, p: 4, c: 50, f: 15, fib: 0.5, servings: [S.adet(40, '1 adet'), S.custom('3 adet', 'adet', 120), S.g100], aliases: ['dilber dudagi', 'lips dessert'] }),
  food({ id: 'cat-hanim-gobegi', name: 'Hanım Göbeği', cat: 'Tatlı & Çikolata', sub: 'Şerbetli Tatlı', cal: 355, p: 4, c: 48, f: 16, fib: 0.5, servings: [S.adet(40, '1 adet'), S.custom('3 adet', 'adet', 120), S.g100], aliases: ['hanim gobegi', 'lady navel dessert'] }),
  food({ id: 'cat-irmik-tatlisi', name: 'İrmik Tatlısı', cat: 'Tatlı & Çikolata', sub: 'Sütlü Tatlı', cal: 190, p: 3, c: 32, f: 6, fib: 0.5, servings: [S.porsiyon(150, '1 porsiyon'), S.g100], aliases: ['irmik tatlisi', 'semolina dessert'] }),
  food({ id: 'cat-dondurma-cikolatali', name: 'Dondurma (Çikolatalı)', cat: 'Tatlı & Çikolata', sub: 'Dondurma', cal: 216, p: 3.8, c: 28, f: 11, fib: 1.2, servings: [S.custom('1 top', 'adet', 70), S.custom('2 top', 'adet', 140), S.g100], aliases: ['chocolate ice cream', 'cikolatali dondurma'] }),
  food({ id: 'cat-dondurma-kaymakli', name: 'Dondurma (Kaymaklı)', cat: 'Tatlı & Çikolata', sub: 'Dondurma', cal: 225, p: 3.5, c: 25, f: 13, fib: 0, servings: [S.custom('1 top', 'adet', 70), S.custom('2 top', 'adet', 140), S.g100], aliases: ['kaymak ice cream', 'kaymakli dondurma'] }),
  food({ id: 'cat-maras-dondurmasi', name: 'Maraş Dondurması', cat: 'Tatlı & Çikolata', sub: 'Dondurma', cal: 210, p: 4, c: 26, f: 10, fib: 0, servings: [S.custom('1 top', 'adet', 80), S.custom('2 top', 'adet', 160), S.g100], aliases: ['maras dondurmasi', 'stretchy ice cream'] }),
  food({ id: 'cat-mozaik-pasta', name: 'Mozaik Pasta', cat: 'Tatlı & Çikolata', sub: 'Pasta', cal: 420, p: 5, c: 48, f: 24, fib: 2, servings: [S.dilim(80, '1 dilim'), S.g100], aliases: ['mozaik pasta', 'mosaic cake'] }),
  food({ id: 'cat-san-sebastian', name: 'San Sebastian Cheesecake', cat: 'Tatlı & Çikolata', sub: 'Pasta', cal: 340, p: 6, c: 22, f: 26, fib: 0, servings: [S.dilim(110, '1 dilim'), S.g100], aliases: ['san sebastian', 'burnt cheesecake', 'basque cheesecake'] }),
  food({ id: 'cat-pankek', name: 'Pankek', cat: 'Tatlı & Çikolata', sub: 'Hamur Tatlısı', cal: 230, p: 6.5, c: 34, f: 8, fib: 1, servings: [S.adet(40, '1 adet'), S.custom('3 adet', 'adet', 120), S.g100], aliases: ['pancake', 'pankek'] }),
  food({ id: 'cat-kurabiye-cikolatali', name: 'Kurabiye (Çikolatalı)', cat: 'Tatlı & Çikolata', sub: 'Kurabiye', cal: 480, p: 5.5, c: 60, f: 25, fib: 2, servings: [S.adet(30, '1 adet'), S.custom('3 adet', 'adet', 90), S.g100], aliases: ['chocolate cookie', 'cikolatali kurabiye'] }),
  food({ id: 'cat-cizkek', name: 'Çizkek', cat: 'Tatlı & Çikolata', sub: 'Pasta', cal: 310, p: 5, c: 24, f: 22, fib: 0.3, servings: [S.dilim(120, '1 dilim'), S.g100], aliases: ['cheesecake', 'cizkek'] }),
]
