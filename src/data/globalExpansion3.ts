import { food, S } from './catalog/helpers'
import type { FoodCatalogCategory, FoodCatalogItem } from '../types/food'

type Row = [
  id: string,
  name: string,
  cat: FoodCatalogCategory,
  sub: string,
  cal: number,
  p: number,
  c: number,
  f: number,
  fib: number,
  servingG: number,
  aliases?: string[],
]

const rows: Row[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // INDIAN CUISINE (25)
  // ══════════════════════════════════════════════════════════════════════════
  ['gx3-butter-chicken', 'Butter Chicken (Murgh Makhani)', 'Dünya Mutfağı', 'Indian', 150, 12, 7, 8, 1, 250, ['murgh makhani', 'butter chicken curry']],
  ['gx3-chicken-tikka-masala', 'Chicken Tikka Masala', 'Dünya Mutfağı', 'Indian', 155, 14, 8, 7, 1.5, 250, ['tikka masala']],
  ['gx3-palak-paneer', 'Palak Paneer', 'Dünya Mutfağı', 'Indian', 130, 7, 8, 8, 3, 200, ['saag paneer', 'spinach paneer']],
  ['gx3-dal-makhani', 'Dal Makhani', 'Dünya Mutfağı', 'Indian', 110, 6, 13, 4, 4, 250, ['black lentil dal', 'makhani dal']],
  ['gx3-chana-masala', 'Chana Masala', 'Dünya Mutfağı', 'Indian', 105, 6, 15, 3, 5, 250, ['chickpea curry', 'chole masala']],
  ['gx3-lamb-biryani', 'Lamb Biryani', 'Dünya Mutfağı', 'Indian', 180, 12, 22, 5, 1.5, 300, ['biryani', 'mutton biryani']],
  ['gx3-chicken-biryani', 'Chicken Biryani', 'Dünya Mutfağı', 'Indian', 165, 13, 21, 4, 1.5, 300, ['biryani rice', 'hyderabadi biryani']],
  ['gx3-samosa', 'Samosa (Vegetable)', 'Dünya Mutfağı', 'Indian', 260, 4, 30, 13, 3, 80, ['samosa fried', 'vegetable samosa']],
  ['gx3-naan-bread', 'Naan Bread', 'Ekmek & Unlu Mamuller', 'Flatbread', 290, 9, 50, 6, 2, 130, ['naan', 'garlic naan', 'tandoori naan']],
  ['gx3-roti-chapati', 'Roti / Chapati', 'Ekmek & Unlu Mamuller', 'Flatbread', 120, 3.5, 20, 3, 2, 55, ['chapati', 'roti bread', 'whole wheat roti']],
  ['gx3-aloo-gobi', 'Aloo Gobi', 'Dünya Mutfağı', 'Indian', 90, 3, 13, 3.5, 3, 200, ['potato cauliflower curry']],
  ['gx3-rajma', 'Rajma (Kidney Bean Curry)', 'Dünya Mutfağı', 'Indian', 115, 6.5, 16, 2.5, 5.5, 250, ['rajma curry', 'red kidney bean curry']],
  ['gx3-mango-lassi', 'Mango Lassi', 'İçecek', 'Yogurt Drink', 85, 3, 15, 1.5, 0.5, 300, ['lassi', 'mango yogurt drink']],
  ['gx3-gulab-jamun', 'Gulab Jamun', 'Tatlı & Çikolata', 'Dessert', 380, 5, 60, 13, 0.5, 70, ['gulab jamun sweet']],
  ['gx3-kheer', 'Kheer (Rice Pudding)', 'Tatlı & Çikolata', 'Pudding', 130, 4, 20, 4, 0.5, 200, ['indian rice pudding', 'kheer dessert']],
  ['gx3-idli', 'Idli (2 pieces)', 'Dünya Mutfağı', 'Indian', 58, 2, 11, 0.4, 0.5, 80, ['idli rice cake', 'steamed idli']],
  ['gx3-dosa', 'Dosa (Plain)', 'Dünya Mutfağı', 'Indian', 120, 3, 21, 2.5, 1, 100, ['masala dosa', 'crispy dosa']],
  ['gx3-paneer-tikka', 'Paneer Tikka', 'Dünya Mutfağı', 'Indian', 230, 14, 6, 16, 1, 150, ['tandoori paneer']],
  ['gx3-vindaloo', 'Chicken Vindaloo', 'Dünya Mutfağı', 'Indian', 145, 15, 5, 7, 1, 250, ['vindaloo curry', 'goan vindaloo']],
  ['gx3-korma', 'Lamb Korma', 'Dünya Mutfağı', 'Indian', 175, 13, 6, 11, 1, 250, ['korma curry', 'mughal korma']],
  ['gx3-pav-bhaji', 'Pav Bhaji', 'Dünya Mutfağı', 'Indian', 155, 5, 22, 5, 4, 200, ['mumbai pav bhaji']],
  ['gx3-halwa', 'Suji Halwa', 'Tatlı & Çikolata', 'Dessert', 220, 3, 32, 9, 1, 100, ['semolina halwa', 'indian halwa']],
  ['gx3-lassi-plain', 'Plain Lassi', 'İçecek', 'Yogurt Drink', 65, 3.5, 7, 2.5, 0, 300, ['yogurt lassi', 'salted lassi']],
  ['gx3-saag', 'Saag (Mustard Greens Curry)', 'Dünya Mutfağı', 'Indian', 75, 3, 7, 4, 3, 200, ['sarson ka saag', 'mustard greens']],
  ['gx3-poori', 'Puri (Fried Bread)', 'Ekmek & Unlu Mamuller', 'Flatbread', 185, 4, 22, 9, 1, 60, ['poori', 'puri bread']],

  // ══════════════════════════════════════════════════════════════════════════
  // JAPANESE DISHES (20)
  // ══════════════════════════════════════════════════════════════════════════
  ['gx3-tonkatsu-ramen', 'Tonkotsu Ramen', 'Sushi & Asya Mutfağı', 'Ramen', 450, 20, 55, 15, 2, 500, ['pork bone ramen', 'ramen tonkotsu']],
  ['gx3-shoyu-ramen', 'Shoyu Ramen', 'Sushi & Asya Mutfağı', 'Ramen', 370, 18, 50, 9, 2, 500, ['soy sauce ramen', 'tokyo ramen']],
  ['gx3-miso-ramen', 'Miso Ramen', 'Sushi & Asya Mutfağı', 'Ramen', 400, 18, 52, 12, 3, 500, ['miso soup ramen']],
  ['gx3-gyoza', 'Gyoza (Pork Dumplings, 6pc)', 'Sushi & Asya Mutfağı', 'Dumpling', 235, 10, 24, 11, 1.5, 150, ['potstickers', 'pan fried gyoza', 'jiaozi']],
  ['gx3-katsu-curry', 'Katsu Curry with Rice', 'Sushi & Asya Mutfağı', 'Japanese', 480, 20, 65, 14, 3, 450, ['chicken katsu curry', 'tonkatsu curry']],
  ['gx3-takoyaki', 'Takoyaki (6 pcs)', 'Sushi & Asya Mutfağı', 'Japanese', 195, 8, 22, 8, 1, 150, ['octopus balls', 'osaka takoyaki']],
  ['gx3-onigiri-salmon', 'Onigiri Salmon', 'Sushi & Asya Mutfağı', 'Onigiri', 185, 8, 30, 4, 0.5, 130, ['rice ball salmon', 'salmon onigiri']],
  ['gx3-onigiri-tuna', 'Onigiri Tuna Mayo', 'Sushi & Asya Mutfağı', 'Onigiri', 195, 7, 31, 5, 0.5, 130, ['tuna rice ball', 'tuna mayo onigiri']],
  ['gx3-yakitori', 'Yakitori (Chicken Skewer)', 'Sushi & Asya Mutfağı', 'Japanese', 170, 20, 6, 7, 0, 120, ['chicken skewer yakitori', 'grilled yakitori']],
  ['gx3-edamame-salted', 'Salted Edamame', 'Sushi & Asya Mutfağı', 'Japanese', 121, 11, 9, 5, 5, 150, ['boiled edamame', 'edamame snack']],
  ['gx3-mochi', 'Mochi Ice Cream', 'Tatlı & Çikolata', 'Japanese Sweets', 120, 1.5, 20, 4, 0.5, 45, ['mochi', 'japanese rice cake ice cream']],
  ['gx3-dorayaki', 'Dorayaki', 'Tatlı & Çikolata', 'Japanese Sweets', 170, 3.5, 30, 4, 1, 80, ['japanese pancake cake', 'red bean dorayaki']],
  ['gx3-matcha-cake', 'Matcha Roll Cake', 'Tatlı & Çikolata', 'Japanese Sweets', 210, 4, 28, 9, 0.5, 100, ['green tea cake roll', 'matcha swiss roll']],
  ['gx3-japanese-curry', 'Japanese Beef Curry', 'Sushi & Asya Mutfağı', 'Japanese', 230, 12, 28, 7, 3, 300, ['japanese curry rice', 'kare raisu']],
  ['gx3-udon', 'Udon Noodle Soup', 'Sushi & Asya Mutfağı', 'Noodle', 260, 9, 48, 2.5, 2, 400, ['udon soup', 'kake udon']],
  ['gx3-soba', 'Soba Noodles (Cold)', 'Sushi & Asya Mutfağı', 'Noodle', 180, 8, 34, 1, 2, 200, ['zaru soba', 'buckwheat noodles cold']],
  ['gx3-okonomiyaki', 'Okonomiyaki', 'Sushi & Asya Mutfağı', 'Japanese', 225, 9, 26, 9, 2, 250, ['japanese pancake savory', 'osaka okonomiyaki']],
  ['gx3-yakisoba', 'Yakisoba', 'Sushi & Asya Mutfağı', 'Noodle', 195, 7, 28, 6, 2, 250, ['japanese fried noodles', 'stir fried yakisoba']],
  ['gx3-chawanmushi', 'Chawanmushi', 'Sushi & Asya Mutfağı', 'Japanese', 80, 6, 5, 3, 0, 150, ['japanese steamed egg custard']],
  ['gx3-tempura-udon', 'Tempura Udon', 'Sushi & Asya Mutfağı', 'Noodle', 380, 13, 58, 10, 2.5, 450, ['shrimp tempura udon']],

  // ══════════════════════════════════════════════════════════════════════════
  // KOREAN DISHES (15)
  // ══════════════════════════════════════════════════════════════════════════
  ['gx3-tteokbokki', 'Tteokbokki', 'Sushi & Asya Mutfağı', 'Korean', 175, 4, 35, 2.5, 1.5, 200, ['spicy rice cake', 'korean rice cake']],
  ['gx3-japchae', 'Japchae (Glass Noodles)', 'Sushi & Asya Mutfağı', 'Korean', 165, 4, 26, 5, 1.5, 200, ['korean glass noodles', 'stir fried japchae']],
  ['gx3-sundubu-jjigae', 'Sundubu Jjigae', 'Sushi & Asya Mutfağı', 'Korean', 100, 7, 5, 5.5, 1.5, 350, ['soft tofu stew', 'korean tofu stew']],
  ['gx3-doenjang-jjigae', 'Doenjang Jjigae', 'Sushi & Asya Mutfağı', 'Korean', 85, 5, 7, 3.5, 2, 350, ['miso soybean paste stew', 'korean bean paste soup']],
  ['gx3-kimchi-fried-rice', 'Kimchi Fried Rice', 'Sushi & Asya Mutfağı', 'Korean', 215, 6, 36, 5, 2, 250, ['kimchi bokkeumbap', 'korean fried rice']],
  ['gx3-korean-fried-chicken', 'Korean Fried Chicken', 'Sushi & Asya Mutfağı', 'Korean', 310, 22, 18, 16, 0.5, 150, ['korean crispy chicken', 'yangnyeom chicken']],
  ['gx3-haemul-pajeon', 'Haemul Pajeon (Seafood Pancake)', 'Sushi & Asya Mutfağı', 'Korean', 190, 9, 22, 7, 1, 200, ['korean seafood pancake', 'pajeon']],
  ['gx3-galbi', 'Galbi (Korean BBQ Ribs)', 'Sushi & Asya Mutfağı', 'Korean', 300, 22, 8, 19, 0, 200, ['korean bbq beef ribs', 'short ribs galbi']],
  ['gx3-samgyeopsal', 'Samgyeopsal (Pork Belly BBQ)', 'Sushi & Asya Mutfağı', 'Korean', 330, 18, 0, 29, 0, 150, ['korean pork belly bbq', 'grilled pork belly']],
  ['gx3-hotteok', 'Hotteok (Sweet Pancake)', 'Tatlı & Çikolata', 'Korean Sweets', 195, 3.5, 32, 6, 1, 100, ['korean sweet pancake', 'cinnamon sugar pancake']],
  ['gx3-patbingsu', 'Patbingsu (Shaved Ice)', 'Tatlı & Çikolata', 'Korean Sweets', 190, 4, 38, 2.5, 2, 300, ['korean shaved ice dessert', 'bingsu']],
  ['gx3-bibim-guksu', 'Bibim Guksu (Spicy Cold Noodles)', 'Sushi & Asya Mutfağı', 'Korean', 220, 7, 38, 4, 3, 300, ['korean cold noodles spicy', 'guksu']],
  ['gx3-dakgalbi', 'Dakgalbi (Spicy Chicken Stir-Fry)', 'Sushi & Asya Mutfağı', 'Korean', 195, 18, 14, 7, 2, 250, ['korean spicy chicken', 'chuncheon dakgalbi']],
  ['gx3-korean-corn-dog', 'Korean Corn Dog', 'Fast Food', 'Street Food', 310, 10, 38, 13, 1, 130, ['gamja dog', 'korean hot dog cheese']],
  ['gx3-kimbap', 'Kimbap', 'Sushi & Asya Mutfağı', 'Korean', 175, 6, 29, 4, 1.5, 200, ['gimbap', 'korean rice roll']],

  // ══════════════════════════════════════════════════════════════════════════
  // SOUTHEAST ASIAN (12)
  // ══════════════════════════════════════════════════════════════════════════
  ['gx3-pho-beef', 'Pho Bo (Beef Pho)', 'Dünya Mutfağı', 'Vietnamese', 240, 16, 28, 5, 2, 500, ['vietnamese beef noodle soup', 'beef pho']],
  ['gx3-pho-chicken', 'Pho Ga (Chicken Pho)', 'Dünya Mutfağı', 'Vietnamese', 195, 14, 25, 4, 1.5, 500, ['chicken pho', 'vietnamese chicken soup']],
  ['gx3-banh-mi', 'Bánh Mì Sandwich', 'Dünya Mutfağı', 'Vietnamese', 350, 18, 40, 12, 2.5, 230, ['banh mi', 'vietnamese baguette sandwich']],
  ['gx3-spring-rolls-fried', 'Fried Spring Rolls', 'Dünya Mutfağı', 'Asian', 185, 5, 22, 9, 1.5, 100, ['crispy spring rolls', 'imperial rolls']],
  ['gx3-fresh-spring-rolls', 'Fresh Rice Paper Spring Rolls', 'Dünya Mutfağı', 'Vietnamese', 70, 4, 12, 1, 1, 100, ['goi cuon', 'rice paper rolls', 'fresh spring rolls']],
  ['gx3-tom-yum', 'Tom Yum Soup', 'Dünya Mutfağı', 'Thai', 95, 7, 7, 4, 1.5, 350, ['thai hot sour soup', 'tom yam']],
  ['gx3-green-curry', 'Thai Green Curry', 'Dünya Mutfağı', 'Thai', 185, 12, 10, 11, 2, 250, ['thai green curry chicken']],
  ['gx3-red-curry', 'Thai Red Curry', 'Dünya Mutfağı', 'Thai', 175, 10, 11, 10, 2, 250, ['thai red curry', 'gaeng daeng']],
  ['gx3-mango-sticky-rice', 'Mango Sticky Rice', 'Tatlı & Çikolata', 'Thai', 265, 3.5, 50, 7, 2, 250, ['khao niew mamuang', 'thai mango dessert']],
  ['gx3-nasi-goreng', 'Nasi Goreng', 'Dünya Mutfağı', 'Indonesian', 225, 8, 32, 7, 1.5, 300, ['indonesian fried rice']],
  ['gx3-rendang', 'Beef Rendang', 'Dünya Mutfağı', 'Indonesian', 260, 20, 6, 17, 2, 200, ['rendang daging', 'slow cooked beef rendang']],
  ['gx3-laksa', 'Laksa (Coconut Noodle Soup)', 'Dünya Mutfağı', 'Malaysian', 310, 14, 35, 12, 2, 450, ['singapore laksa', 'curry laksa noodle']],

  // ══════════════════════════════════════════════════════════════════════════
  // MIDDLE EASTERN & MEDITERRANEAN (18)
  // ══════════════════════════════════════════════════════════════════════════
  ['gx3-hummus-pita', 'Hummus with Pita', 'Dünya Mutfağı', 'Middle Eastern', 285, 11, 36, 10, 7, 200, ['hummus bread', 'chickpea dip pita']],
  ['gx3-falafel-wrap', 'Falafel Wrap', 'Dünya Mutfağı', 'Middle Eastern', 385, 13, 48, 14, 7, 280, ['falafel pita', 'falafel sandwich']],
  ['gx3-shawarma-chicken', 'Chicken Shawarma', 'Dünya Mutfağı', 'Middle Eastern', 400, 26, 38, 14, 3, 300, ['shawarma wrap', 'chicken döner wrap']],
  ['gx3-shawarma-lamb', 'Lamb Shawarma', 'Dünya Mutfağı', 'Middle Eastern', 430, 24, 38, 16, 3, 300, ['lamb shawarma wrap']],
  ['gx3-baba-ganoush', 'Baba Ganoush', 'Dünya Mutfağı', 'Middle Eastern', 75, 2, 7, 4.5, 2.5, 100, ['eggplant dip', 'smoked aubergine dip']],
  ['gx3-fattoush', 'Fattoush Salad', 'Dünya Mutfağı', 'Lebanese', 100, 2.5, 13, 4.5, 3, 200, ['lebanese bread salad']],
  ['gx3-tabbouleh', 'Tabbouleh', 'Dünya Mutfağı', 'Lebanese', 85, 2, 13, 3.5, 2.5, 200, ['tabbouli', 'parsley bulgur salad']],
  ['gx3-dolma', 'Stuffed Vine Leaves (Dolma)', 'Dünya Mutfağı', 'Mediterranean', 90, 3, 14, 3, 1.5, 100, ['dolmades', 'grape leaves stuffed rice']],
  ['gx3-spanakopita', 'Spanakopita', 'Dünya Mutfağı', 'Greek', 235, 8, 22, 13, 2, 150, ['spinach feta pie', 'greek spinach pastry']],
  ['gx3-moussaka', 'Moussaka', 'Dünya Mutfağı', 'Greek', 195, 11, 12, 11, 2.5, 250, ['greek moussaka', 'baked eggplant beef']],
  ['gx3-souvlaki', 'Chicken Souvlaki', 'Dünya Mutfağı', 'Greek', 195, 22, 8, 8, 1, 200, ['greek chicken skewer', 'souvlaki pita']],
  ['gx3-shakshuka', 'Shakshuka', 'Dünya Mutfağı', 'Middle Eastern', 115, 8, 8, 6, 2, 250, ['eggs in tomato sauce', 'shakshouka']],
  ['gx3-kibbeh', 'Kibbeh (Baked)', 'Dünya Mutfağı', 'Lebanese', 220, 14, 18, 9, 2, 150, ['kubbe', 'baked lamb bulgur']],
  ['gx3-mansaf', 'Mansaf (Lamb Rice)', 'Dünya Mutfağı', 'Middle Eastern', 320, 20, 30, 13, 1.5, 350, ['jordanian mansaf', 'lamb yogurt rice']],
  ['gx3-kunafa', 'Kunafa', 'Tatlı & Çikolata', 'Middle Eastern', 380, 7, 48, 18, 1, 150, ['knafeh', 'middle eastern cheese pastry']],
  ['gx3-halva-sesame', 'Halva (Sesame)', 'Tatlı & Çikolata', 'Middle Eastern', 470, 10, 55, 26, 3, 100, ['tahini halva', 'sesame halva']],
  ['gx3-ma-amoul', "Ma'amoul", 'Tatlı & Çikolata', 'Middle Eastern', 165, 2.5, 22, 7.5, 1.5, 50, ['date stuffed cookie', 'arabic date cookie']],
  ['gx3-fatayer', 'Fatayer (Spinach Pie)', 'Dünya Mutfağı', 'Lebanese', 175, 5, 22, 7, 2, 80, ['spinach fatayer', 'lebanese pastry']],

  // ══════════════════════════════════════════════════════════════════════════
  // EUROPEAN PASTRIES & BAKERY (18)
  // ══════════════════════════════════════════════════════════════════════════
  ['gx3-croissant-butter', 'Butter Croissant', 'Kahvaltı', 'Pastry', 406, 8, 45, 21, 2, 60, ['croissant', 'french croissant']],
  ['gx3-croissant-almond', 'Almond Croissant', 'Kahvaltı', 'Pastry', 490, 10, 49, 28, 2.5, 85, ['frangipane croissant']],
  ['gx3-pain-au-chocolat', 'Pain au Chocolat', 'Kahvaltı', 'Pastry', 370, 7, 41, 20, 2, 70, ['chocolate croissant', 'pain chocolat']],
  ['gx3-cinnamon-roll', 'Cinnamon Roll', 'Tatlı & Çikolata', 'Pastry', 450, 7, 63, 19, 2, 120, ['cinnamon bun', 'cinnabon']],
  ['gx3-danish-pastry', 'Danish Pastry', 'Kahvaltı', 'Pastry', 370, 6, 45, 18, 1.5, 90, ['danish', 'butter danish']],
  ['gx3-eclair', 'Chocolate Éclair', 'Tatlı & Çikolata', 'Pastry', 295, 5, 35, 15, 0.5, 80, ['eclair', 'cream puff eclair']],
  ['gx3-macaron', 'French Macaron', 'Tatlı & Çikolata', 'Pastry', 105, 2, 16, 4, 0.5, 25, ['macaroon', 'paris macaron']],
  ['gx3-tiramisu', 'Tiramisu', 'Tatlı & Çikolata', 'Dessert', 240, 5, 22, 14, 0.5, 120, ['italian tiramisu dessert']],
  ['gx3-cannoli', 'Cannoli (Sicilian)', 'Tatlı & Çikolata', 'Dessert', 320, 7, 33, 18, 0.5, 100, ['sicilian cannoli', 'ricotta cannoli']],
  ['gx3-panna-cotta', 'Panna Cotta', 'Tatlı & Çikolata', 'Dessert', 210, 3, 20, 13, 0, 120, ['italian cream dessert']],
  ['gx3-tarte-tatin', 'Tarte Tatin', 'Tatlı & Çikolata', 'Pastry', 285, 3, 38, 13, 2, 120, ['french apple tart', 'upside down apple tart']],
  ['gx3-crepe-suzette', 'Crêpe Suzette', 'Tatlı & Çikolata', 'Crepe', 220, 4, 30, 9, 0.5, 120, ['orange crepe', 'french crepe dessert']],
  ['gx3-soft-pretzel', 'Soft Pretzel', 'Ekmek & Unlu Mamuller', 'Bread', 340, 9, 67, 4, 2.5, 115, ['salted pretzel', 'german pretzel']],
  ['gx3-bagel-plain', 'Plain Bagel', 'Ekmek & Unlu Mamuller', 'Bread', 270, 10, 53, 1.5, 2, 98, ['new york bagel', 'bagel bread']],
  ['gx3-bagel-sesame', 'Sesame Bagel', 'Ekmek & Unlu Mamuller', 'Bread', 280, 11, 54, 2.5, 2.5, 105, ['sesame seed bagel']],
  ['gx3-brioche', 'Brioche', 'Ekmek & Unlu Mamuller', 'Bread', 365, 8, 42, 18, 1.5, 80, ['french brioche bread']],
  ['gx3-focaccia', 'Focaccia', 'Ekmek & Unlu Mamuller', 'Bread', 270, 7, 38, 10, 2, 100, ['italian focaccia bread', 'rosemary focaccia']],
  ['gx3-sourdough-toast', 'Sourdough Toast', 'Ekmek & Unlu Mamuller', 'Bread', 80, 3, 15, 0.6, 0.5, 30, ['sourdough bread toasted']],

  // ══════════════════════════════════════════════════════════════════════════
  // PROTEIN BARS & HEALTH SNACKS (18)
  // ══════════════════════════════════════════════════════════════════════════
  ['gx3-quest-bar', 'Quest Protein Bar', 'Sporcu Besinleri', 'Protein Bar', 190, 21, 21, 7, 14, 60, ['quest bar', 'protein bar quest']],
  ['gx3-rxbar', 'RXBAR Protein Bar', 'Sporcu Besinleri', 'Protein Bar', 210, 12, 23, 9, 5, 52, ['rx bar', 'egg white protein bar']],
  ['gx3-clif-bar', 'Clif Bar (Chocolate Chip)', 'Sporcu Besinleri', 'Energy Bar', 250, 9, 43, 6, 5, 68, ['clif energy bar', 'cliff bar']],
  ['gx3-kind-bar', 'KIND Nut Bar', 'Sporcu Besinleri', 'Snack Bar', 200, 5, 18, 14, 3, 40, ['kind bar', 'nut and honey bar']],
  ['gx3-lara-bar', 'Larabar (Date & Nut)', 'Sporcu Besinleri', 'Snack Bar', 215, 4, 26, 11, 4, 47, ['larabar', 'date nut bar whole food']],
  ['gx3-greens-powder', 'Greens Powder (1 scoop)', 'Sporcu Besinleri', 'Supplement', 30, 2, 5, 0.5, 2, 10, ['super greens powder', 'green drink']],
  ['gx3-collagen-peptides', 'Collagen Peptides (1 scoop)', 'Sporcu Besinleri', 'Supplement', 35, 9, 0, 0, 0, 10, ['collagen powder', 'hydrolyzed collagen']],
  ['gx3-beef-jerky', 'Beef Jerky', 'Atıştırmalık', 'Jerky', 285, 33, 10, 11, 1, 50, ['dried beef jerky', 'jerky snack']],
  ['gx3-turkey-jerky', 'Turkey Jerky', 'Atıştırmalık', 'Jerky', 260, 36, 10, 9, 0.5, 50, ['dried turkey snack']],
  ['gx3-pork-rinds', 'Pork Rinds (Chicharrones)', 'Atıştırmalık', 'Chips', 544, 61, 0, 31, 0, 30, ['chicharrones', 'pork cracklings', 'pork skins']],
  ['gx3-protein-cookie', 'Protein Cookie', 'Sporcu Besinleri', 'Protein Snack', 250, 16, 28, 8, 4, 75, ['lenny larrys cookie', 'muscle cookie']],
  ['gx3-rice-cakes-plain', 'Rice Cakes (Plain)', 'Atıştırmalık', 'Snack', 35, 0.7, 7.5, 0.3, 0.5, 9, ['rice cake snack', 'quaker rice cakes']],
  ['gx3-edamame-chips', 'Edamame Chips', 'Atıştırmalık', 'Chips', 415, 18, 44, 16, 8, 40, ['soy chips', 'edamame snack chips']],
  ['gx3-protein-pudding', 'Protein Pudding', 'Sporcu Besinleri', 'Protein Snack', 145, 15, 14, 3.5, 1.5, 140, ['high protein pudding snack pack']],
  ['gx3-oat-bar', 'Oat & Honey Bar', 'Sporcu Besinleri', 'Snack Bar', 190, 4, 30, 6, 2, 55, ['granola bar oat honey', 'nature valley bar']],
  ['gx3-dark-choc-almonds', 'Dark Chocolate Almonds', 'Tatlı & Çikolata', 'Chocolate', 520, 12, 43, 36, 7, 40, ['chocolate covered almonds', 'dark choc almond snack']],
  ['gx3-fruit-leather', 'Fruit Leather', 'Atıştırmalık', 'Snack', 95, 0.5, 22, 0.5, 1, 28, ['fruit roll up', 'strawberry fruit leather']],
  ['gx3-seaweed-snack', 'Roasted Seaweed Snack', 'Atıştırmalık', 'Snack', 35, 1.5, 3, 2, 1, 10, ['nori snack', 'seaweed chips', 'gimMe seaweed']],

  // ══════════════════════════════════════════════════════════════════════════
  // COFFEE SHOP & SPECIALTY DRINKS (18)
  // ══════════════════════════════════════════════════════════════════════════
  ['gx3-matcha-latte', 'Matcha Latte', 'Kahve', 'Matcha', 120, 5, 16, 4, 0, 355, ['green tea latte', 'matcha oat latte']],
  ['gx3-chai-latte', 'Chai Latte', 'Kahve', 'Tea Latte', 140, 5, 24, 3.5, 0.5, 355, ['spiced chai latte', 'masala chai latte']],
  ['gx3-dirty-chai', 'Dirty Chai Latte', 'Kahve', 'Tea Latte', 165, 6, 25, 5, 0.5, 355, ['chai espresso latte', 'double shot chai']],
  ['gx3-cold-brew', 'Cold Brew Coffee (Black)', 'Kahve', 'Cold Coffee', 5, 0.5, 0, 0, 0, 355, ['cold brew black', 'slow steep coffee']],
  ['gx3-cold-brew-milk', 'Cold Brew with Milk', 'Kahve', 'Cold Coffee', 65, 3, 8, 2, 0, 355, ['cold brew oat milk', 'cold brew latte']],
  ['gx3-iced-matcha', 'Iced Matcha Latte', 'Kahve', 'Matcha', 100, 4, 13, 3, 0, 355, ['iced green tea latte', 'cold matcha']],
  ['gx3-cortado', 'Cortado', 'Kahve', 'Espresso', 50, 2.5, 4, 2.5, 0, 120, ['gibraltar coffee', 'espresso milk cortado']],
  ['gx3-affogato', 'Affogato', 'Kahve', 'Espresso', 165, 3, 18, 8, 0, 120, ['espresso over ice cream', 'italian affogato']],
  ['gx3-nitro-coffee', 'Nitro Cold Brew', 'Kahve', 'Cold Coffee', 5, 0.3, 0, 0, 0, 325, ['nitrogen coffee', 'nitro brew']],
  ['gx3-boba-milk-tea', 'Boba Milk Tea (Whole)', 'İçecek', 'Bubble Tea', 250, 3, 48, 4, 0, 500, ['bubble tea', 'tapioca milk tea']],
  ['gx3-taro-boba', 'Taro Bubble Tea', 'İçecek', 'Bubble Tea', 270, 4, 52, 5, 1, 500, ['taro milk tea boba', 'purple taro tea']],
  ['gx3-golden-milk', 'Golden Milk (Turmeric Latte)', 'İçecek', 'Wellness Drink', 100, 3.5, 12, 3.5, 0.5, 300, ['turmeric latte', 'golden latte']],
  ['gx3-adaptogen-latte', 'Mushroom Coffee Latte', 'Kahve', 'Wellness Coffee', 55, 2, 8, 2, 0.5, 250, ['mushroom coffee', 'lion mane latte chaga']],
  ['gx3-sparkling-tea', 'Sparkling Tea', 'İçecek', 'Tea', 10, 0, 2, 0, 0, 355, ['fizzy tea', 'sparkling green tea']],
  ['gx3-lemonade-fresh', 'Fresh Lemonade', 'İçecek', 'Juice', 50, 0.2, 13, 0.1, 0.2, 300, ['homemade lemonade', 'squeezed lemon drink']],
  ['gx3-rose-latte', 'Rose Latte', 'Kahve', 'Specialty Latte', 120, 4, 16, 4, 0, 300, ['rose milk latte', 'floral latte']],
  ['gx3-protein-shake-vanilla', 'Vanilla Protein Shake', 'Sporcu Besinleri', 'Protein Shake', 160, 25, 10, 3, 1, 350, ['vanilla whey shake', 'protein shake ready to drink']],
  ['gx3-green-smoothie', 'Green Detox Smoothie', 'İçecek', 'Smoothie', 120, 3, 22, 2, 4, 400, ['spinach kale smoothie', 'detox green drink']],

  // ══════════════════════════════════════════════════════════════════════════
  // DAIRY & PLANT-BASED ALTERNATIVES (15)
  // ══════════════════════════════════════════════════════════════════════════
  ['gx3-oat-milk', 'Oat Milk (Unsweetened)', 'İçecek', 'Plant Milk', 45, 1, 8, 1.5, 1, 240, ['oat milk drink', 'oatly milk']],
  ['gx3-almond-milk', 'Almond Milk (Unsweetened)', 'İçecek', 'Plant Milk', 15, 0.6, 0.6, 1.2, 0.5, 240, ['unsweetened almond milk', 'almond breeze']],
  ['gx3-coconut-milk-carton', 'Coconut Milk (Carton)', 'İçecek', 'Plant Milk', 50, 0.5, 7, 2.5, 0, 240, ['coconut beverage', 'so delicious coconut milk']],
  ['gx3-skyr', 'Skyr (Icelandic Yogurt)', 'Süt Ürünleri', 'Yogurt', 65, 11, 4, 0.2, 0, 150, ['icelandic yogurt', 'siggi skyr']],
  ['gx3-kefir', 'Kefir (Plain)', 'Süt Ürünleri', 'Yogurt Drink', 55, 3.5, 5, 2, 0, 240, ['kefir drink probiotic', 'cultured milk kefir']],
  ['gx3-cottage-cheese-low', 'Low-Fat Cottage Cheese', 'Süt Ürünleri', 'Cheese', 82, 12, 3, 2, 0, 125, ['1% cottage cheese', 'diet cottage cheese']],
  ['gx3-ricotta', 'Ricotta Cheese', 'Süt Ürünleri', 'Cheese', 170, 10, 3, 13, 0, 125, ['whole milk ricotta', 'italian ricotta']],
  ['gx3-burrata', 'Burrata Cheese', 'Süt Ürünleri', 'Cheese', 290, 14, 2, 26, 0, 100, ['fresh burrata mozzarella']],
  ['gx3-labneh', 'Labneh (Strained Yogurt)', 'Süt Ürünleri', 'Yogurt', 135, 7, 4, 10, 0, 100, ['strained yogurt cheese', 'lebanese labneh']],
  ['gx3-coconut-yogurt', 'Coconut Yogurt', 'Süt Ürünleri', 'Plant Yogurt', 110, 1, 16, 5, 0.5, 150, ['dairy free coconut yogurt', 'vegan yogurt coconut']],
  ['gx3-oat-yogurt', 'Oat Yogurt', 'Süt Ürünleri', 'Plant Yogurt', 70, 3, 11, 1.5, 1, 150, ['oat based yogurt', 'oatly yogurt']],
  ['gx3-soy-milk', 'Soy Milk (Unsweetened)', 'İçecek', 'Plant Milk', 33, 3.3, 1.2, 1.9, 0.4, 240, ['soy beverage unsweetened', 'silk soy milk']],
  ['gx3-cream-cheese-lt', 'Light Cream Cheese', 'Süt Ürünleri', 'Cheese', 120, 5, 4, 10, 0, 60, ['reduced fat cream cheese', 'neufchatel']],
  ['gx3-cashew-cheese', 'Cashew Cheese Spread', 'Süt Ürünleri', 'Plant Cheese', 160, 4, 9, 12, 1, 50, ['vegan cheese cashew', 'dairy free cheese spread']],
  ['gx3-plant-butter', 'Plant-Based Butter', 'Soslar', 'Spread', 720, 0.5, 0.5, 80, 0, 14, ['vegan butter', 'earth balance', 'dairy free butter']],

  // ══════════════════════════════════════════════════════════════════════════
  // HEALTH & FUNCTIONAL FOODS (15)
  // ══════════════════════════════════════════════════════════════════════════
  ['gx3-cauliflower-rice', 'Cauliflower Rice', 'Sebze', 'Vegetable', 25, 2, 5, 0.3, 2, 200, ['riced cauliflower', 'low carb rice alternative']],
  ['gx3-zucchini-noodles', 'Zucchini Noodles (Zoodles)', 'Sebze', 'Vegetable', 20, 1.5, 3.5, 0.4, 1.2, 200, ['zoodles', 'courgette noodles', 'spiralized zucchini']],
  ['gx3-shirataki', 'Shirataki Noodles', 'Pilav & Makarna', 'Noodle', 9, 0.1, 3, 0.1, 2, 200, ['konjac noodles', 'miracle noodles zero calorie']],
  ['gx3-jackfruit', 'Jackfruit (Young, Cooked)', 'Sebze', 'Fruit Vegetable', 35, 1.5, 7, 0.2, 1.5, 150, ['green jackfruit', 'jackfruit pulled pork alternative']],
  ['gx3-nutritional-yeast', 'Nutritional Yeast (1 tbsp)', 'Soslar', 'Supplement', 50, 5, 5, 0.5, 3, 15, ['nooch', 'vegan cheese seasoning']],
  ['gx3-acai-packet', 'Acai Puree Pack', 'Meyve', 'Berry', 70, 1, 8, 4, 3, 100, ['frozen acai', 'sambazon acai']],
  ['gx3-spirulina', 'Spirulina Powder (1 tsp)', 'Sporcu Besinleri', 'Supplement', 20, 4, 1.5, 0.5, 0.5, 5, ['blue green algae powder', 'spirulina tablet']],
  ['gx3-hemp-seeds', 'Hemp Seeds (Shelled)', 'Kuruyemiş', 'Seeds', 553, 31, 8.7, 48, 4, 30, ['hemp hearts', 'hulled hemp seeds']],
  ['gx3-flax-seeds', 'Ground Flaxseed', 'Kuruyemiş', 'Seeds', 534, 18, 29, 42, 27, 28, ['flaxseed meal', 'linseed ground']],
  ['gx3-black-seed', 'Black Seed (Nigella)', 'Sporcu Besinleri', 'Supplement', 345, 18, 44, 15, 15, 30, ['black cumin seed', 'nigella sativa kalonji']],
  ['gx3-tempeh-strips', 'Tempeh Bacon Strips', 'Et & Tavuk', 'Plant Protein', 160, 11, 8, 9, 0.5, 85, ['smoked tempeh', 'tempeh rashers']],
  ['gx3-tofu-silken', 'Silken Tofu', 'Et & Tavuk', 'Plant Protein', 55, 5, 2.5, 2, 0, 100, ['smooth tofu', 'soft silk tofu']],
  ['gx3-miso-paste', 'Miso Paste (1 tbsp)', 'Soslar', 'Paste', 35, 2, 5, 1, 0.5, 20, ['japanese miso', 'fermented soybean paste']],
  ['gx3-tahini', 'Tahini', 'Soslar', 'Spread', 595, 17, 21, 53, 9, 30, ['sesame paste', 'sesame butter tahini']],
  ['gx3-ghee', 'Ghee (Clarified Butter)', 'Soslar', 'Fat', 900, 0, 0, 100, 0, 14, ['clarified butter', 'indian ghee']],
]

export const GLOBAL_EXPANSION_3: FoodCatalogItem[] = rows.map(
  ([id, name, cat, sub, cal, p, c, f, fib, servingG, aliases]) =>
    food({
      id,
      name,
      cat,
      sub,
      cal,
      p,
      c,
      f,
      fib,
      servings: [S.porsiyon(servingG, '1 serving'), S.g100],
      aliases,
    })
)
