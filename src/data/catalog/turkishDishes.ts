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
]
