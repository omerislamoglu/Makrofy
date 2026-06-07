import { food, S } from './helpers'
import type { FoodCatalogItem } from '../../types/food'

export const TURKISH_DISHES: FoodCatalogItem[] = [
  // ── Çorbalar ─────────────────────────────────────────────
  food({ id: 'cat-mercimek-corba', name: 'Mercimek Çorbası', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 60, p: 3.2, c: 8.8, f: 1.2, fib: 2, servings: [S.kase(250, '1 kase'), S.ml100], aliases: ['lentil soup', 'mercimek corbasi', 'red lentil'] }),
  food({ id: 'cat-ezogelin-corba', name: 'Ezogelin Çorbası', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 56, p: 2, c: 9.6, f: 1.2, fib: 1.5, servings: [S.kase(250), S.ml100], aliases: ['ezogelin', 'ezogelin corbasi'] }),
  food({ id: 'cat-domates-corba', name: 'Domates Çorbası', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 36, p: 0.8, c: 5.6, f: 1.2, fib: 0.5, servings: [S.kase(250), S.ml100], aliases: ['tomato soup', 'domates corbasi'] }),
  food({ id: 'cat-tavuk-corba', name: 'Tavuk Çorbası', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 32, p: 2.4, c: 3.2, f: 1.2, fib: 0.3, servings: [S.kase(250), S.ml100], aliases: ['chicken soup', 'tavuk suyu', 'tavuk corbasi'] }),
  food({ id: 'cat-tarhana-corba', name: 'Tarhana Çorbası', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 52, p: 2, c: 8, f: 1.2, fib: 1, servings: [S.kase(250), S.ml100], aliases: ['tarhana soup', 'tarhana corbasi'] }),
  food({ id: 'cat-yayla-corba', name: 'Yayla Çorbası', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 48, p: 1.6, c: 6.4, f: 2, fib: 0.5, servings: [S.kase(250), S.ml100], aliases: ['yayla corbasi', 'yogurt soup'] }),
  food({ id: 'cat-iskembe-corba', name: 'İşkembe Çorbası', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 68, p: 4.8, c: 3.2, f: 4, fib: 0, servings: [S.kase(250), S.ml100], aliases: ['tripe soup', 'iskembe'] }),

  // ── Ev Yemekleri ─────────────────────────────────────────
  food({ id: 'cat-kuru-fasulye', name: 'Kuru Fasulye', cat: 'Ev Yemekleri', sub: 'Bakliyat', cal: 93, p: 5.3, c: 13.3, f: 2, fib: 4, servings: [S.porsiyon(300, '1 porsiyon'), S.g100], aliases: ['white beans', 'kuru fasulye', 'bean stew'] }),
  food({ id: 'cat-nohut-yemegi', name: 'Nohut Yemeği', cat: 'Ev Yemekleri', sub: 'Bakliyat', cal: 107, p: 5, c: 14, f: 3.3, fib: 3.5, servings: [S.porsiyon(300), S.g100], aliases: ['chickpea stew', 'nohut', 'nohut yemegi'] }),
  food({ id: 'cat-etli-nohut', name: 'Etli Nohut', cat: 'Ev Yemekleri', sub: 'Bakliyat', cal: 127, p: 7.3, c: 11.7, f: 5.3, fib: 3, servings: [S.porsiyon(300), S.g100], aliases: ['chickpea with meat', 'etli nohut'] }),
  food({ id: 'cat-yesil-mercimek', name: 'Yeşil Mercimek', cat: 'Ev Yemekleri', sub: 'Bakliyat', cal: 83, p: 5, c: 13.3, f: 1.3, fib: 4, servings: [S.porsiyon(300), S.g100], aliases: ['green lentil', 'yesil mercimek'] }),
  food({ id: 'cat-karniyarik', name: 'Karnıyarık', cat: 'Ev Yemekleri', sub: 'Et Yemekleri', cal: 112, p: 4.8, c: 6, f: 8, fib: 2, servings: [S.adet(250, '1 adet'), S.g100], aliases: ['karniyarik', 'stuffed eggplant'] }),
  food({ id: 'cat-imam-bayildi', name: 'İmam Bayıldı', cat: 'Ev Yemekleri', sub: 'Zeytinyağlı', cal: 90, p: 1.5, c: 7.5, f: 6, fib: 2.5, servings: [S.adet(200, '1 adet'), S.g100], aliases: ['imam bayildi', 'stuffed eggplant olive oil'] }),
  food({ id: 'cat-musakka', name: 'Musakka', cat: 'Ev Yemekleri', sub: 'Et Yemekleri', cal: 113, p: 5, c: 6, f: 8, fib: 1.5, servings: [S.porsiyon(300), S.g100], aliases: ['moussaka', 'musakka'] }),
  food({ id: 'cat-hunkar-begendi', name: 'Hünkarbeğendi', cat: 'Ev Yemekleri', sub: 'Et Yemekleri', cal: 127, p: 7.3, c: 6.7, f: 8, fib: 1, servings: [S.porsiyon(300), S.g100], aliases: ['hunkar begendi', 'sultan delight'] }),
  food({ id: 'cat-ali-nazik', name: 'Ali Nazik', cat: 'Ev Yemekleri', sub: 'Et Yemekleri', cal: 117, p: 9.3, c: 4, f: 7.3, fib: 0.5, servings: [S.porsiyon(300), S.g100], aliases: ['ali nazik'] }),
  food({ id: 'cat-et-sote', name: 'Et Sote', cat: 'Ev Yemekleri', sub: 'Et Yemekleri', cal: 130, p: 10, c: 5, f: 8, fib: 1, servings: [S.porsiyon(250), S.g100], aliases: ['beef stew', 'et sote'] }),
  food({ id: 'cat-tavuk-sote', name: 'Tavuk Sote', cat: 'Ev Yemekleri', sub: 'Tavuk Yemekleri', cal: 110, p: 12, c: 4, f: 5, fib: 1, servings: [S.porsiyon(250), S.g100], aliases: ['chicken stew', 'tavuk sote'] }),
  food({ id: 'cat-sebzeli-tavuk', name: 'Sebzeli Tavuk', cat: 'Ev Yemekleri', sub: 'Tavuk Yemekleri', cal: 95, p: 10, c: 5, f: 4, fib: 1.5, servings: [S.porsiyon(300), S.g100], aliases: ['chicken with vegetables', 'sebzeli tavuk'] }),
  food({ id: 'cat-turlu', name: 'Türlü', cat: 'Ev Yemekleri', sub: 'Sebze Yemekleri', cal: 60, p: 1.3, c: 6.7, f: 3.3, fib: 2, servings: [S.porsiyon(300), S.g100], aliases: ['turlu', 'mixed vegetable stew'] }),
  food({ id: 'cat-ispanak-yemegi', name: 'Ispanak Yemeği (Zeytinyağlı)', cat: 'Ev Yemekleri', sub: 'Sebze Yemekleri', cal: 55, p: 2, c: 4, f: 4, fib: 2, servings: [S.porsiyon(250), S.g100], aliases: ['spinach dish', 'ispanak'] }),
  food({ id: 'cat-fasulye-pilaki', name: 'Barbunya Pilaki', cat: 'Ev Yemekleri', sub: 'Zeytinyağlı', cal: 95, p: 4.5, c: 12, f: 3.5, fib: 4, servings: [S.porsiyon(250), S.g100], aliases: ['bean pilaki', 'barbunya'] }),

  // ── Dolma & Sarma ────────────────────────────────────────
  food({ id: 'cat-yaprak-dolma-etli', name: 'Yaprak Dolma (Etli)', cat: 'Ev Yemekleri', sub: 'Dolma/Sarma', cal: 160, p: 8, c: 16, f: 7, fib: 1.5, servings: [S.adet(50, '1 adet'), S.custom('5 adet', 'adet', 250), S.g100], aliases: ['stuffed grape leaves', 'yaprak dolma', 'dolma'] }),
  food({ id: 'cat-yaprak-dolma-zy', name: 'Yaprak Dolma (Zeytinyağlı)', cat: 'Ev Yemekleri', sub: 'Dolma/Sarma', cal: 125, p: 2.5, c: 17.5, f: 5, fib: 1.5, servings: [S.adet(40, '1 adet'), S.custom('5 adet', 'adet', 200), S.g100], aliases: ['sarma', 'zeytinyagli dolma'] }),
  food({ id: 'cat-biber-dolma', name: 'Biber Dolma (Etli)', cat: 'Ev Yemekleri', sub: 'Dolma/Sarma', cal: 125, p: 6.7, c: 11.7, f: 5.8, fib: 1.5, servings: [S.adet(120, '1 adet'), S.g100], aliases: ['stuffed pepper', 'biber dolma'] }),
  food({ id: 'cat-lahana-sarma', name: 'Lahana Sarması (Etli)', cat: 'Ev Yemekleri', sub: 'Dolma/Sarma', cal: 150, p: 8.3, c: 13.3, f: 6.7, fib: 1.5, servings: [S.adet(60, '1 adet'), S.custom('4 adet', 'adet', 240), S.g100], aliases: ['cabbage roll', 'lahana sarma'] }),

  // ── Hamur İşleri ─────────────────────────────────────────
  food({ id: 'cat-manti', name: 'Mantı (Yoğurtlu)', cat: 'Ev Yemekleri', sub: 'Hamur İşleri', cal: 180, p: 8, c: 22, f: 7, fib: 1, servings: [S.porsiyon(300, '1 porsiyon'), S.g100], aliases: ['manti', 'turkish ravioli', 'turkish dumplings'] }),
  food({ id: 'cat-su-boregi', name: 'Su Böreği (Peynirli)', cat: 'Ev Yemekleri', sub: 'Hamur İşleri', cal: 250, p: 8, c: 25, f: 13, fib: 1, servings: [S.dilim(150, '1 dilim'), S.g100], aliases: ['su boregi', 'water borek', 'cheese borek'] }),
  food({ id: 'cat-sigara-borek', name: 'Sigara Böreği', cat: 'Ev Yemekleri', sub: 'Hamur İşleri', cal: 225, p: 7.5, c: 20, f: 12.5, fib: 0.5, servings: [S.adet(40, '1 adet'), S.custom('3 adet', 'adet', 120), S.g100], aliases: ['sigara boregi', 'cigar borek', 'fried borek'] }),
  food({ id: 'cat-gozleme-peynir', name: 'Gözleme (Peynirli)', cat: 'Ev Yemekleri', sub: 'Hamur İşleri', cal: 190, p: 6, c: 21, f: 9, fib: 1, servings: [S.adet(200, '1 adet'), S.g100], aliases: ['gozleme', 'turkish crepe', 'cheese gozleme'] }),
  food({ id: 'cat-gozleme-kiyma', name: 'Gözleme (Kıymalı)', cat: 'Ev Yemekleri', sub: 'Hamur İşleri', cal: 191, p: 7.3, c: 18.2, f: 10, fib: 1, servings: [S.adet(220, '1 adet'), S.g100], aliases: ['meat gozleme', 'kiyma gozleme'] }),

  // ── Kebap & Döner ────────────────────────────────────────
  food({ id: 'cat-adana-kebap', name: 'Adana Kebap', cat: 'Ana Yemek', sub: 'Kebap', cal: 240, p: 17, c: 3, f: 18, fib: 0.5, servings: [S.g100, S.porsiyon(200, '1 porsiyon'), S.adet(100, '1 şiş')], aliases: ['adana kebab', 'adana kebap', 'spicy kebab'] }),
  food({ id: 'cat-urfa-kebap', name: 'Urfa Kebap', cat: 'Ana Yemek', sub: 'Kebap', cal: 235, p: 17, c: 4, f: 17, fib: 0.5, servings: [S.g100, S.porsiyon(200), S.adet(100, '1 şiş')], aliases: ['urfa kebab', 'urfa kebap'] }),
  food({ id: 'cat-iskender', name: 'İskender Kebap', cat: 'Ana Yemek', sub: 'Kebap', cal: 186, p: 10, c: 12.9, f: 10.9, fib: 0.5, servings: [S.porsiyon(350, '1 porsiyon'), S.g100], aliases: ['iskender', 'iskender kebab', 'alexander kebab'] }),
  food({ id: 'cat-beyti-sarma', name: 'Beyti Sarma', cat: 'Ana Yemek', sub: 'Kebap', cal: 183, p: 10, c: 9.3, f: 11.7, fib: 0.5, servings: [S.porsiyon(300, '1 porsiyon'), S.g100], aliases: ['beyti', 'beyti sarma', 'beyti kebab'] }),
  food({ id: 'cat-tavuk-doner', name: 'Tavuk Döner (Et)', cat: 'Fast Food', sub: 'Döner', cal: 190, p: 20, c: 5, f: 10, fib: 0, servings: [S.g100, S.porsiyon(150, '1 porsiyon et')], aliases: ['chicken doner', 'tavuk doner'] }),
  food({ id: 'cat-et-doner', name: 'Et Döner (Et)', cat: 'Fast Food', sub: 'Döner', cal: 230, p: 18, c: 4, f: 16, fib: 0, servings: [S.g100, S.porsiyon(150, '1 porsiyon et')], aliases: ['beef doner', 'et doner', 'doner kebab'] }),
  food({ id: 'cat-tavuk-doner-durum', name: 'Tavuk Döner Dürüm', cat: 'Fast Food', sub: 'Döner', cal: 210, p: 14, c: 17.5, f: 9, fib: 1, servings: [S.adet(200, '1 adet'), S.g100], aliases: ['chicken doner wrap', 'tavuk durum'] }),
  food({ id: 'cat-et-doner-durum', name: 'Et Döner Dürüm', cat: 'Fast Food', sub: 'Döner', cal: 250, p: 12.5, c: 17.5, f: 14, fib: 1, servings: [S.adet(200, '1 adet'), S.g100], aliases: ['beef doner wrap', 'et durum'] }),

  // ── Türk Sokak Yemekleri ─────────────────────────────────
  food({ id: 'cat-lahmacun', name: 'Lahmacun', cat: 'Fast Food', sub: 'Hamur İşleri', cal: 159, p: 7.6, c: 17.6, f: 6.5, fib: 1, servings: [S.adet(170, '1 adet'), S.custom('2 adet', 'adet', 340), S.g100], aliases: ['lahmacun', 'turkish pizza'] }),
  food({ id: 'cat-pide-peynirli', name: 'Pide (Peynirli)', cat: 'Fast Food', sub: 'Hamur İşleri', cal: 240, p: 10, c: 28, f: 10, fib: 1, servings: [S.porsiyon(350, '1 bütün'), S.dilim(175, 'Yarım'), S.g100], aliases: ['cheese pide', 'peynirli pide'] }),
  food({ id: 'cat-pide-kiymali', name: 'Pide (Kıymalı)', cat: 'Fast Food', sub: 'Hamur İşleri', cal: 250, p: 12, c: 27, f: 11, fib: 1, servings: [S.porsiyon(350, '1 bütün'), S.g100], aliases: ['minced meat pide', 'kiymali pide'] }),
  food({ id: 'cat-tantuni', name: 'Tantuni Dürüm', cat: 'Fast Food', sub: 'Sokak Yemekleri', cal: 152, p: 8.8, c: 12, f: 8, fib: 0.5, servings: [S.adet(250, '1 adet'), S.g100], aliases: ['tantuni', 'tantuni durum'] }),
  food({ id: 'cat-kokorec', name: 'Kokoreç (Yarım Ekmek)', cat: 'Fast Food', sub: 'Sokak Yemekleri', cal: 225, p: 12.5, c: 15, f: 13, fib: 0.5, servings: [S.adet(200, '1 yarım ekmek'), S.g100], aliases: ['kokorec', 'kokoreç'] }),
  food({ id: 'cat-cig-kofte-durum', name: 'Çiğ Köfte Dürüm', cat: 'Fast Food', sub: 'Sokak Yemekleri', cal: 167, p: 4.7, c: 25.3, f: 5.3, fib: 3, servings: [S.adet(150, '1 adet'), S.g100], aliases: ['cig kofte', 'raw meatball wrap'] }),
  food({ id: 'cat-tost-kasarli', name: 'Kaşarlı Tost', cat: 'Fast Food', sub: 'Tost', cal: 267, p: 11.7, c: 25, f: 13.3, fib: 1, servings: [S.adet(120, '1 adet'), S.g100], aliases: ['kasarli tost', 'grilled cheese', 'toast'] }),
  food({ id: 'cat-kumru', name: 'Kumru', cat: 'Fast Food', sub: 'Sokak Yemekleri', cal: 192, p: 8, c: 15.2, f: 11.2, fib: 1, servings: [S.adet(250, '1 adet'), S.g100], aliases: ['kumru', 'izmir sandwich'] }),
  food({ id: 'cat-kumpir', name: 'Kumpir', cat: 'Fast Food', sub: 'Sokak Yemekleri', cal: 125, p: 3, c: 13.8, f: 6.5, fib: 2, servings: [S.porsiyon(400, '1 porsiyon'), S.g100], aliases: ['kumpir', 'loaded baked potato'] }),
  food({ id: 'cat-midye-dolma', name: 'Midye Dolma', cat: 'Fast Food', sub: 'Sokak Yemekleri', cal: 140, p: 8, c: 16, f: 6, fib: 0.5, servings: [S.adet(25, '1 adet'), S.custom('6 adet', 'adet', 150), S.custom('10 adet', 'adet', 250), S.g100], aliases: ['midye dolma', 'stuffed mussels'] }),
  food({ id: 'cat-kisir', name: 'Kısır', cat: 'Ev Yemekleri', sub: 'Salata/Meze', cal: 130, p: 3, c: 20, f: 4.5, fib: 3, servings: [S.porsiyon(150), S.g100], aliases: ['kisir', 'bulgur salad'] }),
  food({ id: 'cat-cacik', name: 'Cacık', cat: 'Ev Yemekleri', sub: 'Salata/Meze', cal: 40, p: 2, c: 3, f: 2, fib: 0.3, servings: [S.kase(200), S.g100], aliases: ['cacik', 'tzatziki', 'yogurt dip'] }),
  food({ id: 'cat-humus', name: 'Humus', cat: 'Ev Yemekleri', sub: 'Salata/Meze', cal: 166, p: 7.9, c: 14, f: 9.6, fib: 6, servings: [S.porsiyon(80, '1 porsiyon'), S.g100], aliases: ['hummus', 'humus'] }),

  // ── Pilavlar ─────────────────────────────────────────────
  food({ id: 'cat-tavuk-pilav', name: 'Tavuk Pilav (Porsiyon)', cat: 'Ana Yemek', sub: 'Pilav', cal: 150, p: 8, c: 18, f: 5, fib: 0.5, servings: [S.porsiyon(350, '1 porsiyon'), S.g100], aliases: ['chicken and rice', 'tavuk pilav', 'pilav ustu tavuk'] }),
  food({ id: 'cat-etli-pilav', name: 'Etli Pilav', cat: 'Ana Yemek', sub: 'Pilav', cal: 160, p: 8, c: 18, f: 6, fib: 0.5, servings: [S.porsiyon(350), S.g100], aliases: ['meat rice', 'etli pilav'] }),
  food({ id: 'cat-ic-pilav', name: 'İç Pilav', cat: 'Ev Yemekleri', sub: 'Pilav', cal: 185, p: 4, c: 26, f: 7, fib: 1.5, servings: [S.porsiyon(200), S.g100], aliases: ['ic pilav', 'stuffing rice', 'liver rice'] }),

  // ── Yumurtalı Kahvaltılıklar ─────────────────────────────
  food({ id: 'cat-cilbir', name: 'Çılbır (Yoğurtlu Yumurta)', cat: 'Kahvaltı', sub: 'Yumurta', cal: 130, p: 8, c: 4, f: 9, fib: 0.3, servings: [S.porsiyon(200, '1 porsiyon'), S.g100], aliases: ['cilbir', 'turkish poached eggs', 'yogurtlu yumurta'] }),
  food({ id: 'cat-pastirmali-yumurta', name: 'Pastırmalı Yumurta', cat: 'Kahvaltı', sub: 'Yumurta', cal: 180, p: 13, c: 1.5, f: 14, fib: 0, servings: [S.porsiyon(150, '1 porsiyon'), S.g100], aliases: ['pastirmali yumurta', 'eggs with pastrami'] }),

  // ── Sebze & Zeytinyağlı Yemekler ─────────────────────────
  food({ id: 'cat-etli-bamya', name: 'Etli Bamya', cat: 'Ev Yemekleri', sub: 'Et Yemekleri', cal: 75, p: 5, c: 6, f: 3.5, fib: 2.5, servings: [S.porsiyon(300), S.g100], aliases: ['etli bamya', 'okra with meat'] }),
  food({ id: 'cat-etli-taze-fasulye', name: 'Etli Taze Fasulye', cat: 'Ev Yemekleri', sub: 'Et Yemekleri', cal: 80, p: 4.5, c: 7, f: 4, fib: 2.5, servings: [S.porsiyon(300), S.g100], aliases: ['etli taze fasulye', 'green beans with meat'] }),
  food({ id: 'cat-zeytinyagli-taze-fasulye', name: 'Zeytinyağlı Taze Fasulye', cat: 'Ev Yemekleri', sub: 'Zeytinyağlı', cal: 65, p: 1.8, c: 7, f: 3.5, fib: 3, servings: [S.porsiyon(250), S.g100], aliases: ['zeytinyagli fasulye', 'green beans olive oil'] }),
  food({ id: 'cat-zeytinyagli-kabak', name: 'Zeytinyağlı Kabak', cat: 'Ev Yemekleri', sub: 'Zeytinyağlı', cal: 60, p: 1.5, c: 6, f: 3.5, fib: 1.5, servings: [S.porsiyon(250), S.g100], aliases: ['zeytinyagli kabak', 'zucchini olive oil'] }),
  food({ id: 'cat-kabak-dolmasi', name: 'Kabak Dolması', cat: 'Ev Yemekleri', sub: 'Dolma/Sarma', cal: 100, p: 4, c: 9, f: 5.5, fib: 1.5, servings: [S.adet(150, '1 adet'), S.g100], aliases: ['kabak dolmasi', 'stuffed zucchini'] }),
  food({ id: 'cat-kiymali-ispanak', name: 'Kıymalı Ispanak', cat: 'Ev Yemekleri', sub: 'Sebze Yemekleri', cal: 85, p: 6, c: 5, f: 5, fib: 2.5, servings: [S.porsiyon(300), S.g100], aliases: ['kiymali ispanak', 'spinach with minced meat'] }),
  food({ id: 'cat-pirasa-yemegi', name: 'Zeytinyağlı Pırasa', cat: 'Ev Yemekleri', sub: 'Zeytinyağlı', cal: 55, p: 1.8, c: 8, f: 2.5, fib: 2.5, servings: [S.porsiyon(250), S.g100], aliases: ['pirasa yemegi', 'leek dish'] }),
  food({ id: 'cat-kereviz-yemegi', name: 'Zeytinyağlı Kereviz', cat: 'Ev Yemekleri', sub: 'Zeytinyağlı', cal: 60, p: 1.5, c: 7, f: 3, fib: 2, servings: [S.porsiyon(250), S.g100], aliases: ['kereviz yemegi', 'celeriac dish'] }),
  food({ id: 'cat-zeytinyagli-enginar', name: 'Zeytinyağlı Enginar', cat: 'Ev Yemekleri', sub: 'Zeytinyağlı', cal: 70, p: 2, c: 8, f: 3.5, fib: 4, servings: [S.adet(150, '1 adet'), S.g100], aliases: ['zeytinyagli enginar', 'artichoke olive oil'] }),
  food({ id: 'cat-mucver', name: 'Mücver (Kabak)', cat: 'Ev Yemekleri', sub: 'Sebze Yemekleri', cal: 175, p: 5, c: 12, f: 12, fib: 1.5, servings: [S.adet(50, '1 adet'), S.custom('3 adet', 'adet', 150), S.g100], aliases: ['mucver', 'zucchini fritter'] }),

  // ── Et & Tavuk Yemekleri ─────────────────────────────────
  food({ id: 'cat-cerkez-tavugu', name: 'Çerkez Tavuğu', cat: 'Ev Yemekleri', sub: 'Tavuk Yemekleri', cal: 165, p: 14, c: 6, f: 10, fib: 1, servings: [S.porsiyon(200), S.g100], aliases: ['cerkez tavugu', 'circassian chicken'] }),
  food({ id: 'cat-tas-kebabi', name: 'Tas Kebabı', cat: 'Ana Yemek', sub: 'Et Yemekleri', cal: 140, p: 11, c: 5, f: 8.5, fib: 0.5, servings: [S.porsiyon(300), S.g100], aliases: ['tas kebabi', 'stewed meat'] }),
  food({ id: 'cat-orman-kebabi', name: 'Orman Kebabı', cat: 'Ana Yemek', sub: 'Et Yemekleri', cal: 135, p: 10, c: 6, f: 8, fib: 1, servings: [S.porsiyon(300), S.g100], aliases: ['orman kebabi', 'forest kebab'] }),
  food({ id: 'cat-begendili-kebap', name: 'Beğendili Kebap', cat: 'Ana Yemek', sub: 'Et Yemekleri', cal: 150, p: 9, c: 8, f: 9, fib: 1, servings: [S.porsiyon(300), S.g100], aliases: ['begendili kebap', 'kebab with eggplant puree'] }),

  // ── Köfteler ─────────────────────────────────────────────
  food({ id: 'cat-icli-kofte', name: 'İçli Köfte', cat: 'Ev Yemekleri', sub: 'Köfte', cal: 215, p: 8, c: 22, f: 11, fib: 2, servings: [S.adet(80, '1 adet'), S.custom('3 adet', 'adet', 240), S.g100], aliases: ['icli kofte', 'kibbeh', 'stuffed meatball'] }),
  food({ id: 'cat-eksili-kofte', name: 'Ekşili Köfte', cat: 'Ev Yemekleri', sub: 'Köfte', cal: 120, p: 7, c: 8, f: 6.5, fib: 1, servings: [S.porsiyon(300), S.g100], aliases: ['eksili kofte', 'sour meatball'] }),
  food({ id: 'cat-sulu-kofte', name: 'Sulu Köfte', cat: 'Ev Yemekleri', sub: 'Köfte', cal: 110, p: 7, c: 8, f: 5.5, fib: 1, servings: [S.porsiyon(300), S.g100], aliases: ['sulu kofte', 'meatball stew'] }),

  // ── Pilav & Diğer ────────────────────────────────────────
  food({ id: 'cat-hamsili-pilav', name: 'Hamsili Pilav', cat: 'Ana Yemek', sub: 'Pilav', cal: 175, p: 8, c: 22, f: 6, fib: 1, servings: [S.porsiyon(300), S.g100], aliases: ['hamsili pilav', 'anchovy rice'] }),

  // ── Çorbalar (devam) ─────────────────────────────────────
  food({ id: 'cat-dugun-corbasi', name: 'Düğün Çorbası', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 70, p: 3, c: 5, f: 4, fib: 0.3, servings: [S.kase(250), S.ml100], aliases: ['dugun corbasi', 'wedding soup'] }),
  food({ id: 'cat-yogurt-corbasi', name: 'Yoğurt Çorbası', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 55, p: 2.5, c: 6, f: 2.5, fib: 0.5, servings: [S.kase(250), S.ml100], aliases: ['yogurt corbasi', 'yogurt soup'] }),
  food({ id: 'cat-brokoli-corbasi', name: 'Brokoli Çorbası', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 48, p: 2, c: 5, f: 2.5, fib: 1.5, servings: [S.kase(250), S.ml100], aliases: ['brokoli corbasi', 'broccoli soup'] }),

  // ── Ev Yemekleri & Köfteler (devam 2) ────────────────────
  food({ id: 'cat-izmir-kofte', name: 'İzmir Köfte', cat: 'Ev Yemekleri', sub: 'Köfte', cal: 145, p: 9, c: 8, f: 9, fib: 1, servings: [S.porsiyon(300), S.g100], aliases: ['izmir kofte', 'izmir meatballs'] }),
  food({ id: 'cat-kuru-kofte', name: 'Kuru Köfte (Tava)', cat: 'Ev Yemekleri', sub: 'Köfte', cal: 250, p: 17, c: 6, f: 17, fib: 0.5, servings: [S.adet(30, '1 adet'), S.custom('5 adet', 'adet', 150), S.g100], aliases: ['kuru kofte', 'pan meatballs'] }),
  food({ id: 'cat-mercimek-koftesi', name: 'Mercimek Köftesi', cat: 'Ev Yemekleri', sub: 'Salata/Meze', cal: 130, p: 5, c: 22, f: 2.5, fib: 4, servings: [S.adet(30, '1 adet'), S.custom('4 adet', 'adet', 120), S.g100], aliases: ['mercimek koftesi', 'lentil balls'] }),
  food({ id: 'cat-tavuk-guvec', name: 'Tavuk Güveç', cat: 'Ev Yemekleri', sub: 'Tavuk Yemekleri', cal: 105, p: 11, c: 6, f: 4, fib: 1.5, servings: [S.porsiyon(350), S.g100], aliases: ['tavuk guvec', 'chicken casserole'] }),

  // ── Hamur İşleri (devam) ─────────────────────────────────
  food({ id: 'cat-pacanga-boregi', name: 'Paçanga Böreği', cat: 'Ev Yemekleri', sub: 'Hamur İşleri', cal: 270, p: 10, c: 22, f: 16, fib: 1, servings: [S.adet(60, '1 adet'), S.g100], aliases: ['pacanga boregi', 'pastrami borek'] }),
  food({ id: 'cat-kol-boregi', name: 'Kol Böreği', cat: 'Ev Yemekleri', sub: 'Hamur İşleri', cal: 245, p: 7, c: 26, f: 12, fib: 1, servings: [S.dilim(120, '1 dilim'), S.g100], aliases: ['kol boregi', 'rolled borek'] }),

  // ── Mezeler (devam) ──────────────────────────────────────
  food({ id: 'cat-haydari', name: 'Haydari', cat: 'Ev Yemekleri', sub: 'Salata/Meze', cal: 110, p: 4, c: 4, f: 9, fib: 0.3, servings: [S.porsiyon(80, '1 porsiyon'), S.g100], aliases: ['haydari', 'thick yogurt dip'] }),
  food({ id: 'cat-piyaz', name: 'Piyaz (Fasulye)', cat: 'Ev Yemekleri', sub: 'Salata/Meze', cal: 120, p: 5, c: 15, f: 4.5, fib: 4, servings: [S.porsiyon(200), S.g100], aliases: ['piyaz', 'bean salad'] }),
  food({ id: 'cat-fava', name: 'Fava', cat: 'Ev Yemekleri', sub: 'Salata/Meze', cal: 130, p: 6, c: 18, f: 4, fib: 5, servings: [S.porsiyon(120, '1 porsiyon'), S.g100], aliases: ['fava', 'broad bean puree'] }),
  food({ id: 'cat-semizotu-yogurtlu', name: 'Semizotu Salatası (Yoğurtlu)', cat: 'Ev Yemekleri', sub: 'Salata/Meze', cal: 55, p: 2.5, c: 4, f: 3.5, fib: 1.5, servings: [S.porsiyon(150), S.g100], aliases: ['semizotu salatasi', 'purslane salad'] }),

  // ── Çorbalar (devam 3) ───────────────────────────────────
  food({ id: 'cat-balik-corbasi', name: 'Balık Çorbası', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 55, p: 4, c: 4, f: 2.5, fib: 0.3, servings: [S.kase(250), S.ml100], aliases: ['balik corbasi', 'fish soup'] }),
  food({ id: 'cat-paca-corbasi', name: 'Paça Çorbası', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 65, p: 5, c: 3, f: 3.5, fib: 0, servings: [S.kase(250), S.ml100], aliases: ['paca corbasi', 'trotter soup'] }),
  food({ id: 'cat-sehriye-corbasi', name: 'Şehriye Çorbası', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 40, p: 1.5, c: 7, f: 1, fib: 0.3, servings: [S.kase(250), S.ml100], aliases: ['sehriye corbasi', 'vermicelli soup'] }),
  food({ id: 'cat-kremali-mantar-corbasi', name: 'Kremalı Mantar Çorbası', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 58, p: 2, c: 5, f: 3.5, fib: 0.5, servings: [S.kase(250), S.ml100], aliases: ['kremali mantar corbasi', 'cream of mushroom soup'] }),
  food({ id: 'cat-beyran', name: 'Beyran', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 80, p: 6, c: 5, f: 4, fib: 0.3, servings: [S.kase(350, '1 kase'), S.ml100], aliases: ['beyran', 'spicy lamb soup'] }),

  // ── Sebze & Et Yemekleri (devam 3) ───────────────────────
  food({ id: 'cat-patates-oturtma', name: 'Patates Oturtma', cat: 'Ev Yemekleri', sub: 'Et Yemekleri', cal: 130, p: 5, c: 12, f: 7, fib: 1.5, servings: [S.porsiyon(300), S.g100], aliases: ['patates oturtma', 'potato casserole'] }),
  food({ id: 'cat-karnabahar-graten', name: 'Karnabahar Graten', cat: 'Ev Yemekleri', sub: 'Sebze Yemekleri', cal: 95, p: 5, c: 6, f: 6, fib: 2, servings: [S.porsiyon(250), S.g100], aliases: ['karnabahar graten', 'cauliflower gratin'] }),
  food({ id: 'cat-kozlenmis-patlican-salatasi', name: 'Közlenmiş Patlıcan Salatası', cat: 'Ev Yemekleri', sub: 'Salata/Meze', cal: 70, p: 1.5, c: 5, f: 5, fib: 2, servings: [S.porsiyon(150), S.g100], aliases: ['kozlenmis patlican', 'roasted eggplant salad'] }),
  food({ id: 'cat-cicek-bamya', name: 'Çiçek Bamya (Zeytinyağlı)', cat: 'Ev Yemekleri', sub: 'Zeytinyağlı', cal: 50, p: 1.5, c: 6, f: 2.5, fib: 3, servings: [S.porsiyon(250), S.g100], aliases: ['cicek bamya', 'okra olive oil'] }),
  food({ id: 'cat-kuzu-guvec', name: 'Kuzu Güveç', cat: 'Ana Yemek', sub: 'Et Yemekleri', cal: 155, p: 12, c: 7, f: 9, fib: 1.5, servings: [S.porsiyon(350), S.g100], aliases: ['kuzu guvec', 'lamb casserole'] }),
  food({ id: 'cat-kuzu-tandir-yemek', name: 'Kuzu Tandır (Yemek)', cat: 'Ana Yemek', sub: 'Et Yemekleri', cal: 200, p: 18, c: 5, f: 12, fib: 1, servings: [S.porsiyon(350), S.g100], aliases: ['kuzu tandir yemek', 'lamb tandoor dish'] }),

  // ── Hamur İşleri & Kebap (devam 3) ───────────────────────
  food({ id: 'cat-atom-boregi', name: 'Atom Böreği', cat: 'Ev Yemekleri', sub: 'Hamur İşleri', cal: 310, p: 8, c: 30, f: 18, fib: 1, servings: [S.adet(50, '1 adet'), S.custom('3 adet', 'adet', 150), S.g100], aliases: ['atom boregi', 'atom pastry'] }),
  food({ id: 'cat-tas-firin-boregi', name: 'Taş Fırın Böreği', cat: 'Ev Yemekleri', sub: 'Hamur İşleri', cal: 260, p: 8, c: 28, f: 13, fib: 1, servings: [S.dilim(130, '1 dilim'), S.g100], aliases: ['tas firin boregi', 'stone oven borek'] }),
  food({ id: 'cat-patlican-kebabi', name: 'Patlıcan Kebabı', cat: 'Ana Yemek', sub: 'Kebap', cal: 160, p: 10, c: 6, f: 11, fib: 2, servings: [S.porsiyon(300), S.g100], aliases: ['patlican kebabi', 'eggplant kebab'] }),

  // ── Ek Çorbalar ──────────────────────────────────────────
  food({ id: 'cat-mantar-corbasi', name: 'Mantar Çorbası', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 45, p: 2, c: 5, f: 2, fib: 1, servings: [S.kase(250), S.ml100], aliases: ['mantar corbasi', 'mushroom soup'] }),
  food({ id: 'cat-tavuk-suyu-corba', name: 'Tavuk Suyu Çorbası', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 22, p: 1.8, c: 1, f: 1, fib: 0, servings: [S.kase(250), S.ml100], aliases: ['tavuk suyu', 'chicken broth'] }),
  food({ id: 'cat-sogan-corbasi', name: 'Soğan Çorbası', cat: 'Ev Yemekleri', sub: 'Çorbalar', cal: 42, p: 1, c: 6, f: 1.5, fib: 0.8, servings: [S.kase(250), S.ml100], aliases: ['sogan corbasi', 'onion soup'] }),

  // ── Ek Zeytinyağlı Yemekler ──────────────────────────────
  food({ id: 'cat-zeytinyagli-bakla', name: 'Zeytinyağlı Bakla', cat: 'Ev Yemekleri', sub: 'Zeytinyağlı', cal: 70, p: 4, c: 8, f: 2.5, fib: 3, servings: [S.porsiyon(250), S.g100], aliases: ['zeytinyagli bakla', 'broad beans olive oil'] }),
  food({ id: 'cat-zeytinyagli-barbunya', name: 'Zeytinyağlı Barbunya', cat: 'Ev Yemekleri', sub: 'Zeytinyağlı', cal: 90, p: 4.5, c: 12, f: 3, fib: 4, servings: [S.porsiyon(250), S.g100], aliases: ['zeytinyagli barbunya', 'borlotti beans olive oil'] }),
  food({ id: 'cat-zeytinyagli-bezelye', name: 'Zeytinyağlı Bezelye', cat: 'Ev Yemekleri', sub: 'Zeytinyağlı', cal: 65, p: 3.5, c: 8, f: 2.5, fib: 3, servings: [S.porsiyon(250), S.g100], aliases: ['zeytinyagli bezelye', 'peas olive oil'] }),

  // ── Ek Ev Yemekleri ──────────────────────────────────────
  food({ id: 'cat-etli-kapuska', name: 'Etli Kapuska', cat: 'Ev Yemekleri', sub: 'Et Yemekleri', cal: 85, p: 5, c: 6, f: 4.5, fib: 2, servings: [S.porsiyon(300), S.g100], aliases: ['etli kapuska', 'cabbage stew with meat'] }),
  food({ id: 'cat-kiymali-patates', name: 'Kıymalı Patates', cat: 'Ev Yemekleri', sub: 'Et Yemekleri', cal: 110, p: 5.5, c: 11, f: 5, fib: 1.5, servings: [S.porsiyon(300), S.g100], aliases: ['kiymali patates', 'minced meat with potatoes'] }),
  food({ id: 'cat-patates-yemegi', name: 'Patates Yemeği (Zeytinyağlı)', cat: 'Ev Yemekleri', sub: 'Sebze Yemekleri', cal: 80, p: 1.5, c: 12, f: 3, fib: 1.5, servings: [S.porsiyon(300), S.g100], aliases: ['patates yemegi', 'potato dish'] }),
  food({ id: 'cat-etli-kereviz', name: 'Etli Kereviz', cat: 'Ev Yemekleri', sub: 'Et Yemekleri', cal: 85, p: 5, c: 7, f: 4.5, fib: 2, servings: [S.porsiyon(300), S.g100], aliases: ['etli kereviz', 'celeriac with meat'] }),
  food({ id: 'cat-etli-pirasa', name: 'Etli Pırasa', cat: 'Ev Yemekleri', sub: 'Et Yemekleri', cal: 80, p: 5, c: 7, f: 4, fib: 2, servings: [S.porsiyon(300), S.g100], aliases: ['etli pirasa', 'leek with meat'] }),
  food({ id: 'cat-etli-bezelye', name: 'Etli Bezelye', cat: 'Ev Yemekleri', sub: 'Et Yemekleri', cal: 90, p: 5.5, c: 8, f: 4, fib: 3, servings: [S.porsiyon(300), S.g100], aliases: ['etli bezelye', 'peas with meat', 'bezelye yemegi'] }),
  food({ id: 'cat-yogurtlu-kabak', name: 'Yoğurtlu Kabak', cat: 'Ev Yemekleri', sub: 'Sebze Yemekleri', cal: 55, p: 2.5, c: 5, f: 3, fib: 1, servings: [S.porsiyon(200), S.g100], aliases: ['yogurtlu kabak', 'zucchini with yogurt'] }),
  food({ id: 'cat-karalahana-sarmasi', name: 'Karalahana Sarması', cat: 'Ev Yemekleri', sub: 'Dolma/Sarma', cal: 145, p: 7, c: 14, f: 7, fib: 2, servings: [S.adet(60, '1 adet'), S.custom('4 adet', 'adet', 240), S.g100], aliases: ['karalahana sarmasi', 'black cabbage roll'] }),
  food({ id: 'cat-etli-lahana', name: 'Etli Lahana', cat: 'Ev Yemekleri', sub: 'Et Yemekleri', cal: 75, p: 5, c: 5, f: 4, fib: 2, servings: [S.porsiyon(300), S.g100], aliases: ['etli lahana', 'cabbage with meat'] }),
  food({ id: 'cat-sebzeli-guvec', name: 'Sebzeli Güveç', cat: 'Ev Yemekleri', sub: 'Sebze Yemekleri', cal: 65, p: 1.5, c: 7, f: 3.5, fib: 2, servings: [S.porsiyon(300), S.g100], aliases: ['sebzeli guvec', 'vegetable casserole'] }),

  // ── Ek Dolma ─────────────────────────────────────────────
  food({ id: 'cat-patlican-dolmasi', name: 'Patlıcan Dolması', cat: 'Ev Yemekleri', sub: 'Dolma/Sarma', cal: 115, p: 5, c: 8, f: 7, fib: 2, servings: [S.adet(200, '1 adet'), S.g100], aliases: ['patlican dolmasi', 'stuffed eggplant dolma'] }),

  // ── Ek Hamur İşleri ──────────────────────────────────────
  food({ id: 'cat-tepsi-boregi', name: 'Tepsi Böreği (Peynirli)', cat: 'Ev Yemekleri', sub: 'Hamur İşleri', cal: 255, p: 8, c: 25, f: 14, fib: 1, servings: [S.dilim(150, '1 dilim'), S.g100], aliases: ['tepsi boregi', 'tray borek'] }),
  food({ id: 'cat-kayseri-mantisi', name: 'Kayseri Mantısı', cat: 'Ev Yemekleri', sub: 'Hamur İşleri', cal: 175, p: 8, c: 21, f: 7, fib: 1, servings: [S.porsiyon(300, '1 porsiyon'), S.g100], aliases: ['kayseri mantisi', 'kayseri dumplings'] }),
  food({ id: 'cat-acma-borek', name: 'Açma Börek', cat: 'Ev Yemekleri', sub: 'Hamur İşleri', cal: 330, p: 7, c: 35, f: 18, fib: 1, servings: [S.adet(80, '1 adet'), S.g100], aliases: ['acma borek', 'soft borek roll'] }),
  food({ id: 'cat-cig-borek', name: 'Çiğ Börek', cat: 'Ev Yemekleri', sub: 'Hamur İşleri', cal: 290, p: 10, c: 28, f: 15, fib: 1, servings: [S.adet(100, '1 adet'), S.g100], aliases: ['cig borek', 'fried meat pastry'] }),

  // ── Ek Kebap Çeşitleri ───────────────────────────────────
  food({ id: 'cat-cop-sis', name: 'Çöp Şiş', cat: 'Ana Yemek', sub: 'Kebap', cal: 210, p: 18, c: 2, f: 14, fib: 0.5, servings: [S.g100, S.porsiyon(200, '1 porsiyon')], aliases: ['cop sis', 'diced kebab'] }),
  food({ id: 'cat-ciger-kebabi', name: 'Ciğer Kebabı', cat: 'Ana Yemek', sub: 'Kebap', cal: 185, p: 22, c: 5, f: 8, fib: 0.5, servings: [S.g100, S.porsiyon(200)], aliases: ['ciger kebabi', 'liver kebab'] }),
  food({ id: 'cat-kusbasi-kebap', name: 'Kuşbaşı Kebap', cat: 'Ana Yemek', sub: 'Kebap', cal: 195, p: 20, c: 3, f: 11, fib: 0.5, servings: [S.g100, S.porsiyon(250)], aliases: ['kusbasi kebap', 'diced meat kebab'] }),
  food({ id: 'cat-tandir-kebabi', name: 'Tandır Kebabı', cat: 'Ana Yemek', sub: 'Kebap', cal: 220, p: 22, c: 3, f: 13, fib: 0.5, servings: [S.g100, S.porsiyon(250)], aliases: ['tandir kebabi', 'tandoori kebab'] }),

  // ── Ek Balık Yemekleri ───────────────────────────────────
  food({ id: 'cat-hamsi-kizartma', name: 'Hamsi Kızartma', cat: 'Ev Yemekleri', sub: 'Balık Yemekleri', cal: 225, p: 18, c: 5, f: 15, fib: 0, servings: [S.porsiyon(150), S.g100], aliases: ['hamsi kizartma', 'fried anchovies'] }),
  food({ id: 'cat-balik-bugulama', name: 'Balık Buğulama', cat: 'Ev Yemekleri', sub: 'Balık Yemekleri', cal: 95, p: 16, c: 3, f: 2, fib: 0.5, servings: [S.porsiyon(250), S.g100], aliases: ['balik bugulama', 'steamed fish'] }),
  food({ id: 'cat-levrek-bugulama', name: 'Levrek Buğulama', cat: 'Ev Yemekleri', sub: 'Balık Yemekleri', cal: 90, p: 17, c: 2, f: 1.5, fib: 0.5, servings: [S.porsiyon(250), S.g100], aliases: ['levrek bugulama', 'steamed sea bass'] }),

  // ── Diğer Ev Yemekleri ───────────────────────────────────
  food({ id: 'cat-kuyu-tandir', name: 'Kuyu Tandır', cat: 'Ana Yemek', sub: 'Et Yemekleri', cal: 230, p: 22, c: 2, f: 15, fib: 0, servings: [S.porsiyon(250), S.g100], aliases: ['kuyu tandir', 'pit roasted lamb'] }),
  food({ id: 'cat-testi-kebabi', name: 'Testi Kebabı', cat: 'Ana Yemek', sub: 'Et Yemekleri', cal: 145, p: 10, c: 7, f: 8, fib: 1, servings: [S.porsiyon(350), S.g100], aliases: ['testi kebabi', 'pottery kebab'] }),
  food({ id: 'cat-kasarli-kofte', name: 'Kaşarlı Köfte', cat: 'Ev Yemekleri', sub: 'Köfte', cal: 265, p: 18, c: 6, f: 19, fib: 0.5, servings: [S.adet(70, '1 adet'), S.custom('3 adet', 'adet', 210), S.g100], aliases: ['kasarli kofte', 'cheese meatball'] }),
  food({ id: 'cat-etli-yaprak-sarma', name: 'Etli Yaprak Sarma (Taze)', cat: 'Ev Yemekleri', sub: 'Dolma/Sarma', cal: 155, p: 7, c: 15, f: 8, fib: 1.5, servings: [S.adet(50, '1 adet'), S.custom('5 adet', 'adet', 250), S.g100], aliases: ['etli yaprak sarma', 'fresh vine leaves with meat'] }),
  food({ id: 'cat-domates-dolmasi', name: 'Domates Dolması', cat: 'Ev Yemekleri', sub: 'Dolma/Sarma', cal: 90, p: 3, c: 10, f: 4, fib: 1.5, servings: [S.adet(150, '1 adet'), S.g100], aliases: ['domates dolmasi', 'stuffed tomato'] }),
]
