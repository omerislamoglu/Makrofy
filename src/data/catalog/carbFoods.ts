import { food, S } from './helpers'
import type { FoodCatalogItem } from '../../types/food'

export const CARB_FOODS: FoodCatalogItem[] = [
  // ── Pirinç & Pilav ───────────────────────────────────────
  food({ id: 'cat-pirinc-sade', name: 'Pirinç (Pişmiş, Sade)', cat: 'Pilav & Makarna', sub: 'Pirinç', cal: 130, p: 2.7, c: 28, f: 0.3, fib: 0.4, servings: [S.g100, S.porsiyon(180), S.custom('1 yemek kaşığı', 'porsiyon', 25)], aliases: ['rice', 'pirinc', 'white rice', 'beyaz pirinc'] }),
  food({ id: 'cat-pirinc-pilav', name: 'Tereyağlı Pirinç Pilavı', cat: 'Pilav & Makarna', sub: 'Pirinç', cal: 160, p: 3, c: 28, f: 4, fib: 0.5, servings: [S.g100, S.porsiyon(180), S.custom('1 yemek kaşığı', 'porsiyon', 25)], aliases: ['pilav', 'turkish rice', 'butter rice', 'pilaf'] }),
  food({ id: 'cat-pirinc-pilav-sehriyeli', name: 'Şehriyeli Pirinç Pilavı', cat: 'Pilav & Makarna', sub: 'Pirinç', cal: 175, p: 3.5, c: 30, f: 5, fib: 0.5, servings: [S.g100, S.porsiyon(180)], aliases: ['sehriyeli pilav', 'noodle rice'] }),
  food({ id: 'cat-esmer-pirinc', name: 'Esmer Pirinç (Pişmiş)', cat: 'Pilav & Makarna', sub: 'Pirinç', cal: 111, p: 2.6, c: 23, f: 0.9, fib: 1.8, servings: [S.g100, S.porsiyon(180)], aliases: ['brown rice', 'esmer pirinc'] }),

  // ── Bulgur ───────────────────────────────────────────────
  food({ id: 'cat-bulgur-pilav', name: 'Bulgur Pilavı (Sade)', cat: 'Pilav & Makarna', sub: 'Bulgur', cal: 83, p: 3.1, c: 18.6, f: 0.2, fib: 4.5, servings: [S.g100, S.porsiyon(180)], aliases: ['bulgur', 'bulgur pilavi', 'bulgur wheat'] }),
  food({ id: 'cat-bulgur-domatesli', name: 'Bulgur Pilavı (Domatesli)', cat: 'Pilav & Makarna', sub: 'Bulgur', cal: 120, p: 3, c: 20, f: 3.5, fib: 4, servings: [S.g100, S.porsiyon(180)], aliases: ['tomato bulgur'] }),

  // ── Makarna ──────────────────────────────────────────────
  food({ id: 'cat-makarna-sade', name: 'Makarna (Haşlama, Sade)', cat: 'Pilav & Makarna', sub: 'Makarna', cal: 131, p: 5, c: 25, f: 1.1, fib: 1.8, servings: [S.g100, S.porsiyon(200)], aliases: ['pasta', 'makarna', 'spaghetti', 'penne'] }),
  food({ id: 'cat-makarna-domates', name: 'Makarna (Domates Soslu)', cat: 'Pilav & Makarna', sub: 'Makarna', cal: 160, p: 5.5, c: 26, f: 4, fib: 2, servings: [S.g100, S.porsiyon(250)], aliases: ['pasta with tomato sauce'] }),
  food({ id: 'cat-makarna-kiyma', name: 'Makarna (Kıymalı Sos)', cat: 'Pilav & Makarna', sub: 'Makarna', cal: 195, p: 8, c: 25, f: 7, fib: 2, servings: [S.g100, S.porsiyon(280)], aliases: ['bolognese', 'spaghetti bolognese', 'kiyma soslu makarna'] }),
  food({ id: 'cat-makarna-krema', name: 'Makarna (Kremalı Sos)', cat: 'Pilav & Makarna', sub: 'Makarna', cal: 210, p: 6, c: 24, f: 10, fib: 1, servings: [S.g100, S.porsiyon(280)], aliases: ['alfredo', 'fettuccine alfredo', 'kremali makarna'] }),
  food({ id: 'cat-noodle', name: 'Noodle (Pişmiş)', cat: 'Pilav & Makarna', sub: 'Makarna', cal: 138, p: 4.5, c: 25, f: 2.1, fib: 1, servings: [S.g100, S.porsiyon(200)], aliases: ['noodle', 'noodles', 'eriste'] }),

  // ── Patates ──────────────────────────────────────────────
  food({ id: 'cat-patates-haslama', name: 'Haşlanmış Patates', cat: 'Pilav & Makarna', sub: 'Patates', cal: 87, p: 1.9, c: 20, f: 0.1, fib: 1.8, servings: [S.g100, S.adet(150, '1 orta boy'), S.g(200)], aliases: ['boiled potato', 'haslama patates'] }),
  food({ id: 'cat-patates-firin', name: 'Fırın Patates (Zeytinyağlı)', cat: 'Pilav & Makarna', sub: 'Patates', cal: 150, p: 2, c: 22, f: 6, fib: 2, servings: [S.g100, S.porsiyon(200)], aliases: ['baked potato', 'firin patates', 'roasted potato'] }),
  food({ id: 'cat-patates-pure', name: 'Patates Püresi', cat: 'Pilav & Makarna', sub: 'Patates', cal: 110, p: 2, c: 16, f: 4.5, fib: 1.5, servings: [S.g100, S.porsiyon(200)], aliases: ['mashed potato', 'patates puresi', 'puree'] }),
  food({ id: 'cat-tatli-patates', name: 'Tatlı Patates (Fırın)', cat: 'Pilav & Makarna', sub: 'Patates', cal: 90, p: 2, c: 21, f: 0.1, fib: 3, servings: [S.g100, S.adet(130, '1 orta boy')], aliases: ['sweet potato', 'tatli patates'] }),

  // ── Ekmek ────────────────────────────────────────────────
  food({ id: 'cat-beyaz-ekmek', name: 'Beyaz Ekmek', cat: 'Ekmek & Unlu Mamuller', sub: 'Ekmek', cal: 265, p: 9, c: 49, f: 3.2, fib: 2.7, servings: [S.g100, S.dilim(30, '1 dilim'), S.custom('2 dilim', 'dilim', 60), S.custom('1 yarım ekmek', 'porsiyon', 150)], aliases: ['white bread', 'ekmek', 'bread'] }),
  food({ id: 'cat-tam-bugday-ekmek', name: 'Tam Buğday Ekmeği', cat: 'Ekmek & Unlu Mamuller', sub: 'Ekmek', cal: 247, p: 13, c: 43, f: 3.4, fib: 7, servings: [S.g100, S.dilim(35, '1 dilim'), S.custom('2 dilim', 'dilim', 70)], aliases: ['whole wheat bread', 'tam bugday', 'whole grain'] }),
  food({ id: 'cat-lavas', name: 'Lavaş', cat: 'Ekmek & Unlu Mamuller', sub: 'Ekmek', cal: 250, p: 8.8, c: 48, f: 2.5, fib: 2, servings: [S.adet(80, '1 adet'), S.g100], aliases: ['lavash', 'lavas', 'wrap bread'] }),
  food({ id: 'cat-bazlama', name: 'Bazlama', cat: 'Ekmek & Unlu Mamuller', sub: 'Ekmek', cal: 250, p: 7.3, c: 45, f: 4, fib: 2, servings: [S.adet(150, '1 adet'), S.g100], aliases: ['bazlama', 'flatbread'] }),
  food({ id: 'cat-simit', name: 'Simit', cat: 'Ekmek & Unlu Mamuller', sub: 'Hamur İşleri', cal: 283, p: 8.3, c: 50, f: 5, fib: 2.5, servings: [S.adet(120, '1 adet'), S.g100], aliases: ['simit', 'turkish bagel', 'sesame ring'] }),
  food({ id: 'cat-pogaca', name: 'Poğaça (Peynirli)', cat: 'Ekmek & Unlu Mamuller', sub: 'Hamur İşleri', cal: 325, p: 6.3, c: 38, f: 17.5, fib: 1, servings: [S.adet(80, '1 adet'), S.g100], aliases: ['pogaca', 'pastry'] }),
  food({ id: 'cat-kruvasan', name: 'Kruvasan', cat: 'Ekmek & Unlu Mamuller', sub: 'Hamur İşleri', cal: 406, p: 8, c: 46, f: 21, fib: 2, servings: [S.adet(60, '1 adet'), S.g100], aliases: ['croissant', 'kruvasan'] }),
  food({ id: 'cat-acma', name: 'Açma', cat: 'Ekmek & Unlu Mamuller', sub: 'Hamur İşleri', cal: 314, p: 7.1, c: 40, f: 14.3, fib: 1.5, servings: [S.adet(70, '1 adet'), S.g100], aliases: ['acma', 'soft roll'] }),

  // ── Tahıl ────────────────────────────────────────────────
  food({ id: 'cat-yulaf', name: 'Yulaf Ezmesi (Pişmiş)', cat: 'Kahvaltı', sub: 'Tahıl', cal: 68, p: 2.4, c: 12, f: 1.4, fib: 1.7, servings: [S.g100, S.kase(240), S.porsiyon(40, '1 porsiyon (kuru)')], aliases: ['oatmeal', 'oats', 'yulaf', 'yulaf ezmesi'] }),
  food({ id: 'cat-granola', name: 'Granola', cat: 'Kahvaltı', sub: 'Tahıl', cal: 471, p: 10, c: 62, f: 20, fib: 5, servings: [S.g100, S.porsiyon(45, '1 porsiyon'), S.kase(60)], aliases: ['granola', 'musli', 'muesli'] }),
  food({ id: 'cat-misir-gevrek', name: 'Mısır Gevreği', cat: 'Kahvaltı', sub: 'Tahıl', cal: 379, p: 7, c: 84, f: 0.9, fib: 3.3, servings: [S.g100, S.kase(30)], aliases: ['corn flakes', 'cornflakes', 'cereal', 'misir gevregi'] }),
  food({ id: 'cat-kuskus', name: 'Kuskus (Pişmiş)', cat: 'Pilav & Makarna', sub: 'Tahıl', cal: 112, p: 3.8, c: 23, f: 0.2, fib: 1.4, servings: [S.g100, S.porsiyon(180)], aliases: ['couscous', 'kuskus'] }),
  food({ id: 'cat-kinoa', name: 'Kinoa (Pişmiş)', cat: 'Pilav & Makarna', sub: 'Tahıl', cal: 120, p: 4.4, c: 21, f: 1.9, fib: 2.8, servings: [S.g100, S.porsiyon(180)], aliases: ['quinoa', 'kinoa'] }),
  food({ id: 'cat-firik-pilavi', name: 'Firik Pilavı (Pişmiş)', cat: 'Pilav & Makarna', sub: 'Tahıl', cal: 115, p: 4, c: 22, f: 1.5, fib: 4, servings: [S.g100, S.porsiyon(180)], aliases: ['freekeh', 'firik', 'firik pilavi'] }),
  food({ id: 'cat-basmati-pirinc', name: 'Basmati Pirinç (Pişmiş)', cat: 'Pilav & Makarna', sub: 'Pirinç', cal: 121, p: 3.5, c: 25, f: 0.4, fib: 0.6, servings: [S.g100, S.porsiyon(180)], aliases: ['basmati rice', 'basmati'] }),

  // ── Makarna & Erişte (devam) ─────────────────────────────
  food({ id: 'cat-eriste', name: 'Erişte (Pişmiş)', cat: 'Pilav & Makarna', sub: 'Makarna', cal: 145, p: 5, c: 28, f: 1.8, fib: 1.5, servings: [S.g100, S.porsiyon(200)], aliases: ['eriste', 'turkish noodles', 'homemade noodles'] }),
  food({ id: 'cat-makarna-tam-bugday', name: 'Tam Buğday Makarna (Haşlama)', cat: 'Pilav & Makarna', sub: 'Makarna', cal: 124, p: 5.3, c: 26, f: 0.5, fib: 3.9, servings: [S.g100, S.porsiyon(200)], aliases: ['whole wheat pasta', 'tam bugday makarna'] }),

  // ── Ekmek & Unlu Mamuller (devam) ────────────────────────
  food({ id: 'cat-kepekli-ekmek', name: 'Kepekli Ekmek', cat: 'Ekmek & Unlu Mamuller', sub: 'Ekmek', cal: 248, p: 9.5, c: 45, f: 3, fib: 6, servings: [S.g100, S.dilim(35, '1 dilim'), S.custom('2 dilim', 'dilim', 70)], aliases: ['bran bread', 'kepekli ekmek'] }),
  food({ id: 'cat-cavdar-ekmek', name: 'Çavdar Ekmeği', cat: 'Ekmek & Unlu Mamuller', sub: 'Ekmek', cal: 259, p: 8.5, c: 48, f: 3.3, fib: 5.8, servings: [S.g100, S.dilim(35, '1 dilim'), S.custom('2 dilim', 'dilim', 70)], aliases: ['rye bread', 'cavdar ekmegi'] }),
  food({ id: 'cat-misir-ekmegi', name: 'Mısır Ekmeği', cat: 'Ekmek & Unlu Mamuller', sub: 'Ekmek', cal: 280, p: 6.5, c: 52, f: 5, fib: 3, servings: [S.g100, S.dilim(50, '1 dilim')], aliases: ['cornbread', 'misir ekmegi'] }),
  food({ id: 'cat-ramazan-pidesi', name: 'Ramazan Pidesi', cat: 'Ekmek & Unlu Mamuller', sub: 'Ekmek', cal: 275, p: 8.5, c: 53, f: 3, fib: 2.5, servings: [S.g100, S.custom('1/4 pide', 'porsiyon', 100), S.adet(400, '1 bütün')], aliases: ['ramadan bread', 'ramazan pidesi', 'pide ekmek'] }),
  food({ id: 'cat-yufka', name: 'Yufka', cat: 'Ekmek & Unlu Mamuller', sub: 'Hamur', cal: 274, p: 8, c: 56, f: 1.5, fib: 2, servings: [S.g100, S.adet(60, '1 yaprak')], aliases: ['yufka', 'phyllo', 'thin dough'] }),
  food({ id: 'cat-kete', name: 'Kete', cat: 'Ekmek & Unlu Mamuller', sub: 'Hamur İşleri', cal: 360, p: 7, c: 45, f: 17, fib: 1.5, servings: [S.adet(100, '1 adet'), S.g100], aliases: ['kete', 'kerde'] }),

  // ── Tahıl & Bulgur (devam) ───────────────────────────────
  food({ id: 'cat-ince-bulgur', name: 'İnce Bulgur (Pişmiş)', cat: 'Pilav & Makarna', sub: 'Bulgur', cal: 83, p: 3, c: 19, f: 0.2, fib: 5, servings: [S.g100, S.porsiyon(180)], aliases: ['fine bulgur', 'ince bulgur', 'kislik bulgur'] }),
  food({ id: 'cat-nohut-pilavi', name: 'Nohutlu Pilav', cat: 'Pilav & Makarna', sub: 'Pirinç', cal: 170, p: 5, c: 28, f: 4.5, fib: 2, servings: [S.g100, S.porsiyon(200)], aliases: ['nohutlu pilav', 'chickpea rice'] }),
  food({ id: 'cat-domatesli-pirinc', name: 'Domatesli Pirinç Pilavı', cat: 'Pilav & Makarna', sub: 'Pirinç', cal: 155, p: 3, c: 28, f: 3.5, fib: 1, servings: [S.g100, S.porsiyon(200)], aliases: ['domatesli pirinc', 'tomato rice'] }),
  food({ id: 'cat-tarhana-kuru', name: 'Tarhana (Kuru)', cat: 'Pilav & Makarna', sub: 'Tahıl', cal: 334, p: 11, c: 60, f: 5, fib: 4, servings: [S.g100, S.custom('1 yemek kaşığı', 'porsiyon', 15)], aliases: ['tarhana', 'dried tarhana'] }),
  food({ id: 'cat-yulaf-kepegi', name: 'Yulaf Kepeği', cat: 'Kahvaltı', sub: 'Tahıl', cal: 246, p: 17, c: 66, f: 7, fib: 15, servings: [S.g100, S.custom('1 yemek kaşığı', 'porsiyon', 10), S.porsiyon(30, '1 porsiyon')], aliases: ['oat bran', 'yulaf kepegi'] }),

  // ── Makarna (devam) ──────────────────────────────────────
  food({ id: 'cat-makarna-fiyonk', name: 'Fiyonk Makarna (Haşlama)', cat: 'Pilav & Makarna', sub: 'Makarna', cal: 131, p: 5, c: 25, f: 1.1, fib: 1.8, servings: [S.g100, S.porsiyon(200)], aliases: ['farfalle', 'fiyonk makarna', 'bow tie pasta'] }),
  food({ id: 'cat-makarna-kalem', name: 'Kalem Makarna (Haşlama)', cat: 'Pilav & Makarna', sub: 'Makarna', cal: 131, p: 5, c: 25, f: 1.1, fib: 1.8, servings: [S.g100, S.porsiyon(200)], aliases: ['rigatoni', 'kalem makarna', 'tube pasta'] }),
  food({ id: 'cat-glutensiz-makarna', name: 'Glutensiz Makarna (Haşlama)', cat: 'Pilav & Makarna', sub: 'Makarna', cal: 128, p: 2, c: 29, f: 0.4, fib: 1, servings: [S.g100, S.porsiyon(200)], aliases: ['gluten free pasta', 'glutensiz makarna'] }),

  // ── Ekmek (devam) ────────────────────────────────────────
  food({ id: 'cat-tortilla', name: 'Tortilla', cat: 'Ekmek & Unlu Mamuller', sub: 'Ekmek', cal: 305, p: 8, c: 50, f: 8, fib: 3, servings: [S.adet(40, '1 adet'), S.g100], aliases: ['tortilla', 'wrap bread'] }),
  food({ id: 'cat-pita-ekmegi', name: 'Pita Ekmeği', cat: 'Ekmek & Unlu Mamuller', sub: 'Ekmek', cal: 275, p: 9, c: 55, f: 1.2, fib: 2, servings: [S.adet(60, '1 adet'), S.g100], aliases: ['pita bread', 'pita ekmegi'] }),
  food({ id: 'cat-somun-ekmek', name: 'Somun Ekmek', cat: 'Ekmek & Unlu Mamuller', sub: 'Ekmek', cal: 270, p: 9, c: 52, f: 2.5, fib: 2.5, servings: [S.g100, S.dilim(40, '1 dilim')], aliases: ['loaf bread', 'somun ekmek'] }),
  food({ id: 'cat-tahilli-ekmek', name: 'Tahıllı Ekmek', cat: 'Ekmek & Unlu Mamuller', sub: 'Ekmek', cal: 260, p: 12, c: 42, f: 4.5, fib: 8, servings: [S.g100, S.dilim(40, '1 dilim')], aliases: ['multigrain bread', 'tahilli ekmek', 'seeded bread'] }),
  food({ id: 'cat-pide-hamuru', name: 'Pide Hamuru (Çiğ)', cat: 'Ekmek & Unlu Mamuller', sub: 'Hamur', cal: 280, p: 8, c: 53, f: 3, fib: 2, servings: [S.g100, S.porsiyon(200, '1 porsiyon')], aliases: ['pide hamuru', 'pide dough'] }),
  food({ id: 'cat-manti-hamuru', name: 'Mantı Hamuru (Çiğ)', cat: 'Ekmek & Unlu Mamuller', sub: 'Hamur', cal: 290, p: 9, c: 55, f: 3, fib: 2, servings: [S.g100, S.porsiyon(150)], aliases: ['manti hamuru', 'dumpling dough'] }),
]
