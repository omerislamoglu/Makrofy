# Makrofy Food Catalog Status

Son kontrol tarihi: 2026-05-30

## Mevcut Kapsam

- Ana food catalog: 2071 ürün
- Restoran sekmesi: 28 restoran
- Restoran menü ürünleri: 636 ürün
- Toplam erişilebilir kayıt: yaklaşık 2707 ürün / menü öğesi

## Kaynak Dağılımı

- `src/data/turkishFoods.ts`: ana katalog kaynağı
- `src/data/comprehensiveFoodExpansion.ts`: 296 ek kapsamlı ürün
- `src/data/marketAndRestaurantFoods.ts`: market ve restoran kaynaklı genişletmeler
- `src/data/restaurantMenus.ts`: restoran sekmesindeki 636 menü ürünü
- `src/data/foodCatalog.ts`: tüm veriyi yeni katalog modeline dönüştüren katman

## Ana Kategori Dağılımı

- Et & Tavuk: 229
- Balık & Deniz Ürünleri: 45
- Pilav & Makarna: 118
- Ekmek & Unlu Mamuller: 46
- Ev Yemekleri: 39
- Süt Ürünleri: 169
- İçecek: 160
- Meyve: 78
- Sebze: 87
- Kuruyemiş: 45
- Soslar: 75
- Tatlı & Çikolata: 226
- Cips & Paketli Gıda: 182
- Ana Yemek: 194
- Atıştırmalık: 89
- Bakliyat: 38
- Fast Food: 61
- Kahvaltı: 36
- Kahve: 51
- Sporcu Besinleri: 54
- Sushi & Asya Mutfağı: 31
- Dünya Mutfağı: 18

## Notlar

- Manuel yemek ekleme ekranı artık yeni food catalog modeliyle çalışır.
- Arama Türkçe karakter duyarsızdır ve İngilizce alias destekler.
- Gram, adet, porsiyon, ml, paket, dilim, bar, kutu ve şişe ölçüleri desteklenir.
- Favoriler, son eklenenler ve özel yemekler localStorage üzerinden saklanır.
- Günlüğe kayıtta `foodId`, seçilen porsiyon, miktar, gram/ml karşılığı ve hesaplanan makrolar tutulur.
