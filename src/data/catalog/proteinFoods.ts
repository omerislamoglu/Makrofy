import { food, S } from './helpers'
import type { FoodCatalogItem } from '../../types/food'

export const PROTEIN_FOODS: FoodCatalogItem[] = [
  // ── Tavuk ────────────────────────────────────────────────
  food({ id: 'cat-tavuk-gogsu-izgara', name: 'Tavuk Göğsü (Izgara, Derisiz)', cat: 'Et & Tavuk', sub: 'Tavuk', cal: 165, p: 31, c: 0, f: 3.6, fib: 0, servings: [S.g100, S.porsiyon(150), S.g(200)], aliases: ['chicken breast', 'grilled chicken', 'tavuk gogsu'] }),
  food({ id: 'cat-tavuk-gogsu-haslama', name: 'Tavuk Göğsü (Haşlama)', cat: 'Et & Tavuk', sub: 'Tavuk', cal: 148, p: 30, c: 0, f: 3.1, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['boiled chicken', 'haslama tavuk'] }),
  food({ id: 'cat-tavuk-gogsu-tava', name: 'Tavuk Göğsü (Tava)', cat: 'Et & Tavuk', sub: 'Tavuk', cal: 187, p: 29.5, c: 0.5, f: 7.3, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['pan fried chicken'] }),
  food({ id: 'cat-tavuk-but', name: 'Tavuk But (Fırın, Derisiz)', cat: 'Et & Tavuk', sub: 'Tavuk', cal: 209, p: 26, c: 0, f: 10.9, fib: 0, servings: [S.g100, S.adet(180, '1 adet (kemikli)'), S.porsiyon(130, '1 porsiyon (kemiksiz)')], aliases: ['chicken thigh', 'tavuk but'] }),
  food({ id: 'cat-tavuk-but-derili', name: 'Tavuk But (Fırın, Derili)', cat: 'Et & Tavuk', sub: 'Tavuk', cal: 229, p: 24, c: 0, f: 14.2, fib: 0, servings: [S.g100, S.adet(200)], aliases: ['chicken thigh skin'] }),
  food({ id: 'cat-tavuk-kanat', name: 'Tavuk Kanat (Fırın)', cat: 'Et & Tavuk', sub: 'Tavuk', cal: 266, p: 27, c: 0, f: 17, fib: 0, servings: [S.g100, S.adet(30, '1 adet'), S.custom('6 adet', 'adet', 180)], aliases: ['chicken wings', 'tavuk kanat'] }),
  food({ id: 'cat-tavuk-kanat-soslu', name: 'Tavuk Kanat (Kızartma, Soslu)', cat: 'Et & Tavuk', sub: 'Tavuk', cal: 321, p: 22, c: 11, f: 22, fib: 0, servings: [S.g100, S.adet(35), S.custom('6 adet', 'adet', 210)], aliases: ['buffalo wings', 'soslu kanat'] }),
  food({ id: 'cat-tavuk-sis', name: 'Tavuk Şiş (Izgara)', cat: 'Et & Tavuk', sub: 'Tavuk', cal: 175, p: 28, c: 2, f: 6, fib: 0, servings: [S.g100, S.porsiyon(200), S.adet(25, '1 parça')], aliases: ['chicken skewer', 'tavuk sis'] }),
  food({ id: 'cat-tavuk-nugget', name: 'Tavuk Nugget', cat: 'Fast Food', sub: 'Tavuk', cal: 267, p: 14, c: 17, f: 16, fib: 0.5, servings: [S.g100, S.adet(18, '1 adet'), S.custom('6 adet', 'adet', 108), S.custom('10 adet', 'adet', 180)], aliases: ['chicken nuggets', 'nugget'] }),

  // ── Hindi ────────────────────────────────────────────────
  food({ id: 'cat-hindi-gogsu', name: 'Hindi Göğsü (Fırın)', cat: 'Et & Tavuk', sub: 'Hindi', cal: 135, p: 30, c: 0, f: 0.7, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['turkey breast', 'hindi'] }),
  food({ id: 'cat-hindi-fume', name: 'Hindi Füme', cat: 'Et & Tavuk', sub: 'Hindi', cal: 120, p: 20, c: 2, f: 3.5, fib: 0, servings: [S.g100, S.dilim(20), S.custom('3 dilim', 'dilim', 60)], aliases: ['smoked turkey', 'hindi fume'] }),

  // ── Dana ─────────────────────────────────────────────────
  food({ id: 'cat-dana-bonfile', name: 'Dana Bonfile (Izgara)', cat: 'Et & Tavuk', sub: 'Dana', cal: 206, p: 26, c: 0, f: 10.6, fib: 0, servings: [S.g100, S.porsiyon(180), S.g(200)], aliases: ['beef tenderloin', 'bonfile', 'steak'] }),
  food({ id: 'cat-dana-antrikot', name: 'Dana Antrikot (Izgara)', cat: 'Et & Tavuk', sub: 'Dana', cal: 271, p: 26, c: 0, f: 18, fib: 0, servings: [S.g100, S.porsiyon(200)], aliases: ['ribeye', 'entrecote', 'antrikot'] }),
  food({ id: 'cat-dana-kontrfile', name: 'Dana Kontrfile (Izgara)', cat: 'Et & Tavuk', sub: 'Dana', cal: 223, p: 27, c: 0, f: 12, fib: 0, servings: [S.g100, S.porsiyon(200)], aliases: ['sirloin', 'kontrfile'] }),
  food({ id: 'cat-dana-kiyma', name: 'Dana Kıyma (Pişmiş)', cat: 'Et & Tavuk', sub: 'Dana', cal: 254, p: 17.2, c: 0, f: 20, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['ground beef', 'kiyma', 'minced meat'] }),
  food({ id: 'cat-dana-kiyma-yagsiz', name: 'Dana Kıyma Yağsız (Pişmiş)', cat: 'Et & Tavuk', sub: 'Dana', cal: 217, p: 21.4, c: 0, f: 14, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['lean ground beef', 'yagsiz kiyma'] }),
  food({ id: 'cat-kofte-izgara', name: 'Izgara Köfte', cat: 'Et & Tavuk', sub: 'Dana', cal: 220, p: 18, c: 5, f: 14, fib: 0, servings: [S.g100, S.adet(60, '1 adet'), S.custom('3 adet', 'adet', 180)], aliases: ['grilled meatball', 'kofte', 'meatballs'] }),
  food({ id: 'cat-dana-kavurma', name: 'Dana Kavurma', cat: 'Et & Tavuk', sub: 'Dana', cal: 230, p: 24, c: 1, f: 14, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['beef saute', 'kavurma'] }),

  // ── Kuzu ─────────────────────────────────────────────────
  food({ id: 'cat-kuzu-pirzola', name: 'Kuzu Pirzola (Izgara)', cat: 'Et & Tavuk', sub: 'Kuzu', cal: 250, p: 25, c: 0, f: 16, fib: 0, servings: [S.g100, S.adet(80, '1 adet'), S.custom('3 adet', 'adet', 240)], aliases: ['lamb chop', 'kuzu pirzola'] }),
  food({ id: 'cat-kuzu-sis', name: 'Kuzu Şiş (Izgara)', cat: 'Et & Tavuk', sub: 'Kuzu', cal: 220, p: 24, c: 1, f: 13, fib: 0, servings: [S.g100, S.porsiyon(200)], aliases: ['lamb skewer', 'kuzu sis'] }),
  food({ id: 'cat-kuzu-incik', name: 'Kuzu İncik (Fırın)', cat: 'Et & Tavuk', sub: 'Kuzu', cal: 240, p: 25, c: 0, f: 15, fib: 0, servings: [S.g100, S.adet(350, '1 adet (kemikli)')], aliases: ['lamb shank', 'kuzu incik'] }),

  // ── Sakatat ──────────────────────────────────────────────
  food({ id: 'cat-ciger-tava', name: 'Ciğer (Tava)', cat: 'Et & Tavuk', sub: 'Sakatat', cal: 200, p: 26, c: 4, f: 8, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['liver', 'ciger', 'arnavut cigeri'] }),
  food({ id: 'cat-sucuk', name: 'Sucuk', cat: 'Et & Tavuk', sub: 'İşlenmiş Et', cal: 380, p: 18, c: 2, f: 33, fib: 0, servings: [S.g100, S.dilim(10), S.custom('5 dilim', 'dilim', 50)], aliases: ['turkish sausage', 'sucuk'] }),
  food({ id: 'cat-pastirma', name: 'Pastırma', cat: 'Et & Tavuk', sub: 'İşlenmiş Et', cal: 200, p: 33, c: 1, f: 7, fib: 0, servings: [S.g100, S.dilim(8), S.custom('5 dilim', 'dilim', 40)], aliases: ['pastrami', 'pastirma'] }),
  food({ id: 'cat-sosis', name: 'Sosis (Dana/Tavuk)', cat: 'Et & Tavuk', sub: 'İşlenmiş Et', cal: 270, p: 12, c: 3, f: 24, fib: 0, servings: [S.g100, S.adet(40, '1 adet'), S.custom('3 adet', 'adet', 120)], aliases: ['sausage', 'sosis', 'hot dog'] }),

  // ── Balık & Deniz Ürünleri ───────────────────────────────
  food({ id: 'cat-somon-izgara', name: 'Somon (Izgara)', cat: 'Balık & Deniz Ürünleri', sub: 'Balık', cal: 182, p: 25, c: 0, f: 8, fib: 0, servings: [S.g100, S.porsiyon(180)], aliases: ['grilled salmon', 'somon'] }),
  food({ id: 'cat-somon-firin', name: 'Somon (Fırın)', cat: 'Balık & Deniz Ürünleri', sub: 'Balık', cal: 208, p: 20, c: 0, f: 13.4, fib: 0, servings: [S.g100, S.porsiyon(180)], aliases: ['baked salmon'] }),
  food({ id: 'cat-levrek-izgara', name: 'Levrek (Izgara)', cat: 'Balık & Deniz Ürünleri', sub: 'Balık', cal: 124, p: 23.6, c: 0, f: 2.6, fib: 0, servings: [S.g100, S.porsiyon(200)], aliases: ['sea bass', 'levrek'] }),
  food({ id: 'cat-cipura-izgara', name: 'Çipura (Izgara)', cat: 'Balık & Deniz Ürünleri', sub: 'Balık', cal: 135, p: 24, c: 0, f: 4, fib: 0, servings: [S.g100, S.porsiyon(200)], aliases: ['sea bream', 'cipura'] }),
  food({ id: 'cat-hamsi-tava', name: 'Hamsi (Tava)', cat: 'Balık & Deniz Ürünleri', sub: 'Balık', cal: 210, p: 20, c: 2, f: 13, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['anchovy', 'hamsi'] }),
  food({ id: 'cat-ton-konserve-su', name: 'Ton Balığı (Konserve, Suda)', cat: 'Balık & Deniz Ürünleri', sub: 'Balık', cal: 116, p: 25.5, c: 0, f: 0.8, fib: 0, servings: [S.g100, S.paket(160, '1 kutu')], aliases: ['canned tuna', 'ton baligi', 'tuna'] }),
  food({ id: 'cat-ton-konserve-yag', name: 'Ton Balığı (Konserve, Yağda)', cat: 'Balık & Deniz Ürünleri', sub: 'Balık', cal: 198, p: 29, c: 0, f: 8, fib: 0, servings: [S.g100, S.paket(160, '1 kutu')], aliases: ['tuna in oil'] }),
  food({ id: 'cat-karides-haslama', name: 'Karides (Haşlama)', cat: 'Balık & Deniz Ürünleri', sub: 'Deniz Ürünleri', cal: 99, p: 24, c: 0.2, f: 0.3, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['shrimp', 'karides', 'prawn'] }),
  food({ id: 'cat-karides-sote', name: 'Karides (Sote)', cat: 'Balık & Deniz Ürünleri', sub: 'Deniz Ürünleri', cal: 145, p: 22, c: 1, f: 6, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['sauteed shrimp'] }),
  food({ id: 'cat-kalamar-tava', name: 'Kalamar (Tava)', cat: 'Balık & Deniz Ürünleri', sub: 'Deniz Ürünleri', cal: 175, p: 18, c: 8, f: 7.5, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['calamari', 'kalamar', 'squid'] }),
  food({ id: 'cat-midye-tava', name: 'Midye (Tava, Paneli)', cat: 'Balık & Deniz Ürünleri', sub: 'Deniz Ürünleri', cal: 172, p: 12, c: 10, f: 9, fib: 0, servings: [S.g100, S.adet(25, '1 adet'), S.custom('6 adet', 'adet', 150)], aliases: ['mussel', 'midye'] }),

  // ── Yumurta ──────────────────────────────────────────────
  food({ id: 'cat-yumurta-haslama', name: 'Haşlanmış Yumurta', cat: 'Kahvaltı', sub: 'Yumurta', cal: 155, p: 13, c: 1.1, f: 11, fib: 0, servings: [S.g100, S.adet(50, '1 adet'), S.custom('2 adet', 'adet', 100), S.custom('3 adet', 'adet', 150)], aliases: ['boiled egg', 'haslama yumurta', 'egg'] }),
  food({ id: 'cat-yumurta-sahanda', name: 'Sahanda Yumurta', cat: 'Kahvaltı', sub: 'Yumurta', cal: 196, p: 13.6, c: 0.7, f: 15.3, fib: 0, servings: [S.adet(65, '1 adet'), S.custom('2 adet', 'adet', 130), S.g100], aliases: ['fried egg', 'sahanda'] }),
  food({ id: 'cat-omlet-sade', name: 'Omlet (Sade, 2 Yumurta)', cat: 'Kahvaltı', sub: 'Yumurta', cal: 185, p: 13, c: 1, f: 14, fib: 0, servings: [S.adet(120, '1 porsiyon'), S.g100], aliases: ['omelet', 'omelette', 'omlet'] }),
  food({ id: 'cat-omlet-peynirli', name: 'Omlet (Peynirli)', cat: 'Kahvaltı', sub: 'Yumurta', cal: 217, p: 15, c: 1.5, f: 17, fib: 0, servings: [S.adet(140, '1 porsiyon'), S.g100], aliases: ['cheese omelet'] }),
  food({ id: 'cat-menemen', name: 'Menemen', cat: 'Kahvaltı', sub: 'Yumurta', cal: 88, p: 4.8, c: 4, f: 6, fib: 0.5, servings: [S.porsiyon(250), S.g100], aliases: ['menemen', 'turkish scrambled eggs'] }),
  food({ id: 'cat-sucuklu-yumurta', name: 'Sucuklu Yumurta', cat: 'Kahvaltı', sub: 'Yumurta', cal: 233, p: 12, c: 2, f: 20, fib: 0, servings: [S.porsiyon(150), S.g100], aliases: ['sucuklu yumurta', 'eggs with sausage'] }),

  // ── Süt Ürünleri ─────────────────────────────────────────
  food({ id: 'cat-yogurt-tam', name: 'Yoğurt (Tam Yağlı)', cat: 'Süt Ürünleri', sub: 'Yoğurt', cal: 63, p: 3.5, c: 4.7, f: 3.3, fib: 0, servings: [S.g100, S.kase(200), S.g(150)], aliases: ['yogurt', 'yoghurt', 'yogurt tam yag'] }),
  food({ id: 'cat-suzme-yogurt', name: 'Süzme Yoğurt (Tam Yağlı)', cat: 'Süt Ürünleri', sub: 'Yoğurt', cal: 97, p: 9, c: 3.6, f: 5, fib: 0, servings: [S.g100, S.kase(200), S.g(150)], aliases: ['strained yogurt', 'greek yogurt', 'suzme yogurt'] }),
  food({ id: 'cat-suzme-yogurt-light', name: 'Süzme Yoğurt (Light)', cat: 'Süt Ürünleri', sub: 'Yoğurt', cal: 59, p: 10.2, c: 3.6, f: 0.4, fib: 0, servings: [S.g100, S.kase(200)], aliases: ['light greek yogurt', 'yagsiz suzme'] }),
  food({ id: 'cat-beyaz-peynir', name: 'Beyaz Peynir', cat: 'Süt Ürünleri', sub: 'Peynir', cal: 264, p: 14, c: 4.1, f: 21, fib: 0, servings: [S.g100, S.dilim(30), S.custom('2 dilim', 'dilim', 60)], aliases: ['white cheese', 'feta', 'beyaz peynir'] }),
  food({ id: 'cat-kasar-peynir', name: 'Kaşar Peyniri', cat: 'Süt Ürünleri', sub: 'Peynir', cal: 356, p: 25, c: 1.5, f: 28, fib: 0, servings: [S.g100, S.dilim(25), S.custom('3 dilim', 'dilim', 75)], aliases: ['kashar', 'kasar', 'cheddar', 'yellow cheese'] }),
  food({ id: 'cat-lor-peynir', name: 'Lor Peyniri', cat: 'Süt Ürünleri', sub: 'Peynir', cal: 86, p: 12, c: 3.6, f: 2.3, fib: 0, servings: [S.g100, S.porsiyon(50)], aliases: ['cottage cheese', 'lor peyniri', 'lor'] }),
  food({ id: 'cat-mozzarella', name: 'Mozzarella', cat: 'Süt Ürünleri', sub: 'Peynir', cal: 280, p: 28, c: 3.1, f: 17, fib: 0, servings: [S.g100, S.dilim(30)], aliases: ['mozzarella'] }),
  food({ id: 'cat-sut-tam', name: 'Süt (Tam Yağlı)', cat: 'Süt Ürünleri', sub: 'Süt', cal: 61, p: 3.2, c: 4.8, f: 3.3, fib: 0, servings: [S.ml100, S.bardak(200), S.sise(500)], aliases: ['whole milk', 'sut', 'milk'] }),
  food({ id: 'cat-sut-yarim', name: 'Süt (Yarım Yağlı)', cat: 'Süt Ürünleri', sub: 'Süt', cal: 46, p: 3.3, c: 4.8, f: 1.6, fib: 0, servings: [S.ml100, S.bardak(200)], aliases: ['semi-skimmed milk'] }),
  food({ id: 'cat-kefir', name: 'Kefir', cat: 'Süt Ürünleri', sub: 'Süt', cal: 45, p: 3.3, c: 4, f: 1.5, fib: 0, servings: [S.ml100, S.bardak(200), S.sise(500)], aliases: ['kefir'] }),

  // ── Sporcu Besinleri ─────────────────────────────────────
  food({ id: 'cat-whey-protein', name: 'Whey Protein (1 Ölçek)', cat: 'Sporcu Besinleri', sub: 'Protein Tozu', cal: 120, p: 24, c: 3, f: 1.5, fib: 0, servings: [S.adet(30, '1 ölçek'), S.custom('2 ölçek', 'adet', 60), S.g100], aliases: ['whey protein', 'protein powder', 'protein tozu'] }),
  food({ id: 'cat-protein-bar', name: 'Protein Bar', cat: 'Sporcu Besinleri', sub: 'Bar', cal: 350, p: 20, c: 35, f: 14, fib: 3, servings: [S.bar(60, '1 bar'), S.g100], aliases: ['protein bar'] }),
  food({ id: 'cat-kazein-protein', name: 'Kazein Protein (1 Ölçek)', cat: 'Sporcu Besinleri', sub: 'Protein Tozu', cal: 110, p: 22, c: 4, f: 1, fib: 0, servings: [S.adet(33, '1 ölçek'), S.g100], aliases: ['casein protein', 'kazein'] }),

  // ── Dana & Kuzu (devam) ──────────────────────────────────
  food({ id: 'cat-dana-rosto', name: 'Dana Rosto (Fırın)', cat: 'Et & Tavuk', sub: 'Dana', cal: 215, p: 28, c: 1, f: 11, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['roast beef', 'dana rosto'] }),
  food({ id: 'cat-dana-haslama', name: 'Dana Haşlama', cat: 'Et & Tavuk', sub: 'Dana', cal: 185, p: 28, c: 0, f: 8, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['boiled beef', 'dana haslama', 'haslama et'] }),
  food({ id: 'cat-kuzu-tandir', name: 'Kuzu Tandır', cat: 'Et & Tavuk', sub: 'Kuzu', cal: 265, p: 26, c: 0, f: 18, fib: 0, servings: [S.g100, S.porsiyon(200)], aliases: ['lamb tandoor', 'kuzu tandir'] }),
  food({ id: 'cat-kuzu-kapama', name: 'Kuzu Kapama', cat: 'Et & Tavuk', sub: 'Kuzu', cal: 195, p: 22, c: 3, f: 11, fib: 0.5, servings: [S.g100, S.porsiyon(250)], aliases: ['lamb kapama', 'kuzu kapama'] }),
  food({ id: 'cat-tavuk-pirzola', name: 'Tavuk Pirzola (Izgara)', cat: 'Et & Tavuk', sub: 'Tavuk', cal: 170, p: 27, c: 0, f: 7, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['chicken cutlet', 'tavuk pirzola'] }),

  // ── Balık (devam) ────────────────────────────────────────
  food({ id: 'cat-palamut-izgara', name: 'Palamut (Izgara)', cat: 'Balık & Deniz Ürünleri', sub: 'Balık', cal: 168, p: 23, c: 0, f: 8, fib: 0, servings: [S.g100, S.porsiyon(180)], aliases: ['bonito', 'palamut'] }),
  food({ id: 'cat-lufer-izgara', name: 'Lüfer (Izgara)', cat: 'Balık & Deniz Ürünleri', sub: 'Balık', cal: 124, p: 20, c: 0, f: 4.5, fib: 0, servings: [S.g100, S.porsiyon(180)], aliases: ['bluefish', 'lufer'] }),
  food({ id: 'cat-istavrit-tava', name: 'İstavrit (Tava)', cat: 'Balık & Deniz Ürünleri', sub: 'Balık', cal: 158, p: 20, c: 2, f: 8, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['horse mackerel', 'istavrit'] }),
  food({ id: 'cat-sardalya-izgara', name: 'Sardalya (Izgara)', cat: 'Balık & Deniz Ürünleri', sub: 'Balık', cal: 208, p: 25, c: 0, f: 11.5, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['sardine', 'sardalya'] }),
  food({ id: 'cat-alabalik-izgara', name: 'Alabalık (Izgara)', cat: 'Balık & Deniz Ürünleri', sub: 'Balık', cal: 148, p: 21, c: 0, f: 7, fib: 0, servings: [S.g100, S.porsiyon(200)], aliases: ['trout', 'alabalik'] }),
  food({ id: 'cat-uskumru-izgara', name: 'Uskumru (Izgara)', cat: 'Balık & Deniz Ürünleri', sub: 'Balık', cal: 205, p: 19, c: 0, f: 14, fib: 0, servings: [S.g100, S.porsiyon(180)], aliases: ['mackerel', 'uskumru'] }),
  food({ id: 'cat-kalkan-izgara', name: 'Kalkan (Izgara)', cat: 'Balık & Deniz Ürünleri', sub: 'Balık', cal: 118, p: 21, c: 0, f: 3.5, fib: 0, servings: [S.g100, S.porsiyon(200)], aliases: ['turbot', 'kalkan'] }),
  food({ id: 'cat-barbun-tava', name: 'Barbun (Tava)', cat: 'Balık & Deniz Ürünleri', sub: 'Balık', cal: 155, p: 19, c: 1.5, f: 8, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['red mullet', 'barbun', 'barbunya baligi'] }),
  food({ id: 'cat-mezgit-tava', name: 'Mezgit (Tava)', cat: 'Balık & Deniz Ürünleri', sub: 'Balık', cal: 135, p: 18, c: 3, f: 5.5, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['whiting', 'mezgit'] }),
  food({ id: 'cat-ahtapot-izgara', name: 'Ahtapot (Izgara)', cat: 'Balık & Deniz Ürünleri', sub: 'Deniz Ürünleri', cal: 139, p: 25, c: 4, f: 1.8, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['octopus', 'ahtapot'] }),

  // ── Tavuk & Kümes (devam) ────────────────────────────────
  food({ id: 'cat-tavuk-ciger', name: 'Tavuk Ciğeri (Sote)', cat: 'Et & Tavuk', sub: 'Sakatat', cal: 172, p: 24, c: 1, f: 8, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['chicken liver', 'tavuk ciger'] }),
  food({ id: 'cat-bildircin', name: 'Bıldırcın (Izgara)', cat: 'Et & Tavuk', sub: 'Tavuk', cal: 227, p: 25, c: 0, f: 14, fib: 0, servings: [S.g100, S.adet(120, '1 adet')], aliases: ['quail', 'bildircin'] }),
  food({ id: 'cat-hindi-but', name: 'Hindi But (Fırın)', cat: 'Et & Tavuk', sub: 'Hindi', cal: 184, p: 28, c: 0, f: 7.5, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['turkey leg', 'hindi but'] }),

  // ── Deniz Ürünleri (devam) ───────────────────────────────
  food({ id: 'cat-yengec', name: 'Yengeç (Haşlama)', cat: 'Balık & Deniz Ürünleri', sub: 'Deniz Ürünleri', cal: 97, p: 19, c: 0, f: 1.5, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['crab', 'yengec'] }),
  food({ id: 'cat-istakoz', name: 'Istakoz (Haşlama)', cat: 'Balık & Deniz Ürünleri', sub: 'Deniz Ürünleri', cal: 89, p: 19, c: 0, f: 0.9, fib: 0, servings: [S.g100, S.porsiyon(200)], aliases: ['lobster', 'istakoz'] }),
  food({ id: 'cat-deniz-taragi', name: 'Deniz Tarağı (Haşlama)', cat: 'Balık & Deniz Ürünleri', sub: 'Deniz Ürünleri', cal: 86, p: 15, c: 3, f: 1, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['clams', 'deniz taragi'] }),

  // ── Tavuk & Et (devam 3) ─────────────────────────────────
  food({ id: 'cat-tavuk-baget', name: 'Tavuk Baget (Fırın)', cat: 'Et & Tavuk', sub: 'Tavuk', cal: 210, p: 18, c: 2, f: 15, fib: 0, servings: [S.g100, S.adet(120, '1 adet')], aliases: ['chicken drumstick', 'tavuk baget'] }),
  food({ id: 'cat-tavuk-schnitzel', name: 'Tavuk Schnitzel', cat: 'Et & Tavuk', sub: 'Tavuk', cal: 230, p: 18, c: 12, f: 13, fib: 0.5, servings: [S.g100, S.porsiyon(150)], aliases: ['chicken schnitzel', 'tavuk schnitzel', 'tavuk pane'] }),
  food({ id: 'cat-biftek-tava', name: 'Biftek (Tava)', cat: 'Et & Tavuk', sub: 'Dana', cal: 250, p: 26, c: 0, f: 16, fib: 0, servings: [S.g100, S.porsiyon(180)], aliases: ['pan seared steak', 'biftek'] }),
  food({ id: 'cat-dana-ciger', name: 'Dana Ciğer (Izgara)', cat: 'Et & Tavuk', sub: 'Sakatat', cal: 175, p: 27, c: 4, f: 5, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['beef liver', 'dana ciger'] }),
  food({ id: 'cat-dana-but', name: 'Dana But (Fırın)', cat: 'Et & Tavuk', sub: 'Dana', cal: 195, p: 30, c: 0, f: 8, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['beef round', 'dana but'] }),
  food({ id: 'cat-dana-fileto', name: 'Dana Fileto (Izgara)', cat: 'Et & Tavuk', sub: 'Dana', cal: 188, p: 28, c: 0, f: 8, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['beef fillet', 'dana fileto'] }),
  food({ id: 'cat-dana-kusbasi', name: 'Dana Kuşbaşı (Sote)', cat: 'Et & Tavuk', sub: 'Dana', cal: 210, p: 25, c: 2, f: 12, fib: 0.5, servings: [S.g100, S.porsiyon(200)], aliases: ['diced beef', 'dana kusbasi'] }),
  food({ id: 'cat-kuzu-kusbasi', name: 'Kuzu Kuşbaşı (Sote)', cat: 'Et & Tavuk', sub: 'Kuzu', cal: 230, p: 24, c: 2, f: 14, fib: 0.5, servings: [S.g100, S.porsiyon(200)], aliases: ['diced lamb', 'kuzu kusbasi'] }),
  food({ id: 'cat-kuzu-karin', name: 'Kuzu Karın (Fırın)', cat: 'Et & Tavuk', sub: 'Kuzu', cal: 280, p: 18, c: 0, f: 23, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['lamb belly', 'kuzu karin'] }),
  food({ id: 'cat-kuzu-gerdan', name: 'Kuzu Gerdan', cat: 'Et & Tavuk', sub: 'Kuzu', cal: 215, p: 22, c: 0, f: 14, fib: 0, servings: [S.g100, S.porsiyon(200)], aliases: ['lamb neck', 'kuzu gerdan'] }),
  food({ id: 'cat-kuzu-bobrek', name: 'Kuzu Böbrek (Izgara)', cat: 'Et & Tavuk', sub: 'Sakatat', cal: 137, p: 17, c: 1, f: 7, fib: 0, servings: [S.g100, S.porsiyon(120)], aliases: ['lamb kidney', 'kuzu bobrek'] }),
  food({ id: 'cat-hindi-pirzola', name: 'Hindi Pirzola (Izgara)', cat: 'Et & Tavuk', sub: 'Hindi', cal: 152, p: 29, c: 0, f: 3.5, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['turkey chop', 'hindi pirzola'] }),
  food({ id: 'cat-sigir-dil', name: 'Sığır Dil (Haşlama)', cat: 'Et & Tavuk', sub: 'Sakatat', cal: 224, p: 16, c: 0, f: 17, fib: 0, servings: [S.g100, S.porsiyon(100)], aliases: ['beef tongue', 'sigir dil'] }),
  food({ id: 'cat-jambon', name: 'Jambon (Dana)', cat: 'Et & Tavuk', sub: 'İşlenmiş Et', cal: 145, p: 18, c: 2, f: 7, fib: 0, servings: [S.g100, S.dilim(20), S.custom('3 dilim', 'dilim', 60)], aliases: ['ham', 'jambon'] }),
  food({ id: 'cat-kaz-eti', name: 'Kaz Eti (Fırın)', cat: 'Et & Tavuk', sub: 'Tavuk', cal: 305, p: 25, c: 0, f: 22, fib: 0, servings: [S.g100, S.porsiyon(150)], aliases: ['goose meat', 'kaz eti'] }),
]
