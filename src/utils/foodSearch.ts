import type { CustomFoodInput, FoodCatalogCategory, FoodCatalogItem, FoodServingOption } from '../types/food'
import { createServing } from './foodCalculation'
import { createId } from './id'

const FAVORITES_KEY = 'makrofy_food_favorites'
const RECENTS_KEY = 'makrofy_recent_foods'
const CUSTOM_FOODS_KEY = 'makrofy_custom_foods'

// ─── Common misspellings → correct form (normalized, no diacritics) ────────
const COMMON_MISSPELLINGS: Record<string, string> = {
  // Turkish food typos
  yuurta: 'yumurta', yumuta: 'yumurta', yumruta: 'yumurta', yuurmta: 'yumurta', yumurt: 'yumurta', yumrota: 'yumurta',
  ekmk: 'ekmek', ekemk: 'ekmek', ekmke: 'ekmek', ekmekk: 'ekmek',
  peyir: 'peynir', peynr: 'peynir', peynri: 'peynir', peyinr: 'peynir',
  tavk: 'tavuk', tvuk: 'tavuk', tavuuk: 'tavuk', tauvk: 'tavuk', tavku: 'tavuk',
  makrna: 'makarna', maakrna: 'makarna', makrana: 'makarna', makarrna: 'makarna',
  plav: 'pilav', pilavv: 'pilav', pialv: 'pilav', piilav: 'pilav',
  yourt: 'yogurt', yogrt: 'yogurt', yogutr: 'yogurt', yoourt: 'yogurt',
  cikoata: 'cikolata', cioklata: 'cikolata', cikoalat: 'cikolata', ciklata: 'cikolata',
  somn: 'somon', smoon: 'somon', somoon: 'somon',
  baklva: 'baklava', baklavaa: 'baklava', baklav: 'baklava',
  donr: 'doner', donerr: 'doner', donre: 'doner', dooner: 'doner',
  hambrger: 'hamburger', hambuger: 'hamburger', hamburgr: 'hamburger', haamburger: 'hamburger',
  lahmcun: 'lahmacun', lahmajun: 'lahmacun', lahamcun: 'lahmacun',
  kofte: 'kofte', koft: 'kofte', koftee: 'kofte',
  ispnak: 'ispanak', ispanakk: 'ispanak',
  manti: 'manti', mantii: 'manti',
  borek: 'borek', borekk: 'borek', bork: 'borek',
  corba: 'corba', corb: 'corba', coorba: 'corba',
  patats: 'patates', pataes: 'patates', patattes: 'patates',
  simit: 'simit', simitt: 'simit', simt: 'simit',
  pogca: 'pogaca', pogacaa: 'pogaca',
  sucuk: 'sucuk', scuk: 'sucuk', sucukk: 'sucuk',
  pastirma: 'pastirma', pastrma: 'pastirma',
  kunfe: 'kunefe', kunefee: 'kunefe', kuenfe: 'kunefe',
  sutlc: 'sutlac', sutlacv: 'sutlac', sutlacc: 'sutlac',
  menenm: 'menemen', menemn: 'menemen',
  // English food typos
  chiken: 'chicken', chcken: 'chicken', chicke: 'chicken', chikcen: 'chicken',
  salomon: 'salmon', salmn: 'salmon', samon: 'salmon',
  brocoli: 'broccoli', brocolli: 'broccoli', broccolli: 'broccoli',
  avacado: 'avocado', avocdo: 'avocado', avacodo: 'avocado',
  banan: 'banana', bananna: 'banana', bannana: 'banana',
  tomatoe: 'tomato', tomto: 'tomato', tomatoo: 'tomato',
  cucmber: 'cucumber', cucumbr: 'cucumber',
  sandwch: 'sandwich', sandwhich: 'sandwich', sanwich: 'sandwich',
  omlette: 'omlet', omeltte: 'omlet',
  piza: 'pizza', pizzaa: 'pizza', pzza: 'pizza',
  burgr: 'burger', buger: 'burger', brger: 'burger',
  cofee: 'coffee', coffie: 'coffee', coffe: 'coffee',
  chocolte: 'chocolate', choclate: 'chocolate', chocolat: 'chocolate',
  yougurt: 'yogurt', youghurt: 'yogurt', yoghrt: 'yogurt',
  protien: 'protein', protin: 'protein', protine: 'protein',
  straberry: 'strawberry', stawberry: 'strawberry',
  bluberry: 'blueberry', bluebarry: 'blueberry',
  // German food typos (corrected forms feed the multilingual synonym map)
  hanchen: 'hahnchen', hahchen: 'hahnchen', hnchen: 'hahnchen',
  hun: 'huhn',
  fleish: 'fleisch', flesich: 'fleisch', fleisc: 'fleisch',
  kaes: 'kase', kse: 'kase',
  brto: 'brot',
  kartofel: 'kartoffel', katoffel: 'kartoffel', kartofeln: 'kartoffel',
  nudln: 'nudeln',
  apfl: 'apfel', aplel: 'apfel',
  gemse: 'gemuse',
  joghrt: 'joghurt', jogurt: 'joghurt',
  schoklade: 'schokolade', schokoade: 'schokolade',
  // French food typos
  poullet: 'poulet', poluet: 'poulet', poulett: 'poulet',
  boef: 'boeuf', beouf: 'boeuf',
  fromaje: 'fromage', fromge: 'fromage', frommage: 'fromage',
  pome: 'pomme', pommme: 'pomme',
  poson: 'poisson', poisons: 'poisson',
  oef: 'oeuf', euf: 'oeuf',
  fraisse: 'fraise', fraize: 'fraise',
  legme: 'legume', legums: 'legume',
  // Spanish food typos
  poyo: 'pollo', pllo: 'pollo',
  keso: 'queso', qeso: 'queso', quezo: 'queso',
  uevo: 'huevo', huebo: 'huevo', guevo: 'huevo',
  pescao: 'pescado', pscado: 'pescado',
  mananza: 'manzana', manzna: 'manzana',
  jamn: 'jamon', jaom: 'jamon',
  aroz: 'arroz', arros: 'arroz',
  // Italian food typos
  formagio: 'formaggio', fromaggio: 'formaggio', formaggo: 'formaggio',
  ouvo: 'uovo',
  rriso: 'riso', rizo: 'riso',
  prosciuto: 'prosciutto', prociutto: 'prosciutto',
}

function correctMisspelling(text: string): string {
  // Try full text first
  if (COMMON_MISSPELLINGS[text]) return COMMON_MISSPELLINGS[text]
  // Try each word
  const words = text.split(' ')
  let changed = false
  const corrected = words.map(w => {
    if (COMMON_MISSPELLINGS[w]) { changed = true; return COMMON_MISSPELLINGS[w] }
    return w
  })
  return changed ? corrected.join(' ') : text
}

const SYNONYMS: Record<string, string[]> = {
  // ── Protein — bilingual ──
  tavuk: ['chicken', 'kanat', 'but', 'gogus', 'piliç', 'pilic'],
  chicken: ['tavuk', 'poultry', 'pilic'],
  yumurta: ['egg', 'haslama', 'sahanda', 'omlet'],
  egg: ['yumurta', 'eggs'],
  eggs: ['egg', 'yumurta'],
  balik: ['fish', 'somon', 'levrek', 'hamsi', 'cipura'],
  fish: ['balik', 'seafood'],
  salmon: ['somon'],
  somon: ['salmon'],
  tuna: ['ton baligi', 'ton'],
  shrimp: ['karides'],
  karides: ['shrimp', 'prawn'],
  steak: ['biftek', 'antrikot', 'bonfile'],
  turkey: ['hindi'],
  hindi: ['turkey'],
  beef: ['dana', 'et', 'sigir'],
  dana: ['beef', 'sigir', 'et'],
  kuzu: ['lamb', 'mutton'],
  lamb: ['kuzu'],
  pork: ['domuz'],
  tofu: ['tofu', 'soy'],
  et: ['meat', 'dana', 'sigir', 'kuzu'],
  meat: ['et', 'beef', 'dana'],
  // ── Carbs ──
  pirinc: ['rice', 'pilav'],
  rice: ['pirinc', 'pilav'],
  pilav: ['pirinc', 'rice'],
  bulgur: ['bulgur pilav', 'bulgur pilavi'],
  ekmek: ['beyaz ekmek', 'tam bugday ekmek', 'bread', 'dilim'],
  bread: ['white bread', 'whole wheat bread', 'ekmek', 'toast', 'loaf'],
  pasta: ['makarna', 'spaghetti', 'noodle'],
  makarna: ['pasta', 'spaghetti', 'noodle'],
  noodle: ['makarna', 'noodles', 'eriste'],
  oatmeal: ['yulaf', 'porridge', 'oats'],
  yulaf: ['oatmeal', 'oats'],
  quinoa: ['kinoa'],
  kinoa: ['quinoa'],
  potato: ['patates'],
  patates: ['potato'],
  simit: ['simit', 'gevrek', 'turkish bagel'],
  // ── Fruits ──
  muz: ['banana'],
  banana: ['muz'],
  apple: ['elma'],
  elma: ['apple'],
  orange: ['portakal'],
  portakal: ['orange'],
  strawberry: ['cilek', 'strawberries'],
  cilek: ['strawberry'],
  blueberry: ['yaban mersini', 'blueberries'],
  pear: ['armut'],
  armut: ['pear'],
  peach: ['seftali'],
  seftali: ['peach'],
  cherry: ['kiraz', 'visne'],
  kiraz: ['cherry'],
  visne: ['sour cherry', 'cherry'],
  grape: ['uzum', 'grapes'],
  uzum: ['grape'],
  watermelon: ['karpuz'],
  karpuz: ['watermelon'],
  kavun: ['melon', 'cantaloupe'],
  melon: ['kavun'],
  apricot: ['kayisi'],
  kayisi: ['apricot'],
  fig: ['incir'],
  incir: ['fig'],
  pomegranate: ['nar'],
  nar: ['pomegranate'],
  lemon: ['limon'],
  limon: ['lemon'],
  mango: ['mango'],
  ananas: ['pineapple'],
  pineapple: ['ananas'],
  avokado: ['avocado'],
  avocado: ['avokado'],
  kivi: ['kiwi'],
  kiwi: ['kivi'],
  // ── Vegetables ──
  sebze: ['vegetable', 'vegetables', 'veggie'],
  vegetable: ['sebze'],
  domates: ['tomato'],
  tomato: ['domates'],
  salatalik: ['cucumber'],
  cucumber: ['salatalik'],
  havuc: ['carrot'],
  carrot: ['havuc'],
  brokoli: ['broccoli'],
  broccoli: ['brokoli'],
  ispanak: ['spinach'],
  spinach: ['ispanak'],
  biber: ['pepper', 'capsicum'],
  pepper: ['biber'],
  sogan: ['onion'],
  onion: ['sogan'],
  mantar: ['mushroom'],
  mushroom: ['mantar'],
  patlican: ['eggplant', 'aubergine'],
  eggplant: ['patlican'],
  kabak: ['zucchini', 'squash'],
  zucchini: ['kabak'],
  marul: ['lettuce'],
  lettuce: ['marul'],
  // ── Dairy ──
  yogurt: ['yogurt', 'suzme', 'kefir', 'greek yogurt'],
  'greek yogurt': ['yogurt', 'suzme yogurt'],
  cheese: ['peynir', 'cheddar', 'mozzarella'],
  peynir: ['cheese', 'beyaz peynir', 'kasar'],
  kasar: ['cheddar', 'cheese', 'kasar peynir'],
  milk: ['sut'],
  sut: ['milk'],
  butter: ['tereyagi'],
  tereyagi: ['butter'],
  kaymak: ['cream', 'clotted cream'],
  cream: ['kaymak', 'krema'],
  // ── Drinks ──
  ayran: ['yogurt drink', 'ayran', 'sutlu icecek'],
  kahve: ['coffee', 'latte', 'espresso', 'americano'],
  coffee: ['kahve', 'latte', 'espresso', 'americano'],
  latte: ['coffee', 'kahve'],
  kola: ['cola', 'coke'],
  cola: ['kola', 'coke'],
  coke: ['cola', 'kola'],
  juice: ['meyve suyu', 'su'],
  smoothie: ['smoothie'],
  cay: ['tea', 'cay'],
  tea: ['cay'],
  su: ['water'],
  water: ['su'],
  bira: ['beer'],
  beer: ['bira'],
  sarap: ['wine'],
  wine: ['sarap'],
  // ── Nuts ──
  badem: ['almond'],
  almond: ['badem', 'almonds'],
  ceviz: ['walnut'],
  walnut: ['ceviz', 'walnuts'],
  findik: ['hazelnut'],
  hazelnut: ['findik'],
  'peanut butter': ['fistik ezmesi'],
  'fistik ezmesi': ['peanut butter'],
  fistik: ['peanut', 'yer fistigi'],
  peanut: ['fistik', 'yer fistigi'],
  kaju: ['cashew'],
  cashew: ['kaju'],
  // ── Sweets ──
  cikolata: ['chocolate', 'cacao'],
  chocolate: ['cikolata'],
  cips: ['chips'],
  chips: ['cips', 'crisps'],
  dondurma: ['ice cream', 'gelato'],
  'ice cream': ['dondurma'],
  kek: ['cake'],
  cake: ['kek', 'pasta'],
  kurabiye: ['cookie', 'biscuit'],
  cookie: ['kurabiye', 'biskuvi'],
  // ── Turkish dishes ──
  doner: ['doner kebab', 'kebab', 'tavuk doner', 'et doner'],
  kebab: ['doner', 'kebap', 'sis', 'adana'],
  kebap: ['kebab', 'doner', 'sis', 'adana'],
  corba: ['soup', 'corbasi', 'mercimek', 'yayla'],
  soup: ['corba'],
  lahmacun: ['lahmacun', 'turkish pizza'],
  pide: ['pide', 'turkish flatbread'],
  gozleme: ['gozleme', 'turkish crepe'],
  borek: ['borek', 'pastry'],
  manti: ['manti', 'turkish dumpling', 'ravioli'],
  dolma: ['dolma', 'sarma', 'stuffed'],
  sarma: ['dolma', 'wrap', 'roll'],
  baklava: ['baklava'],
  kunefe: ['kunefe', 'kanafeh'],
  sutlac: ['rice pudding', 'sutlac'],
  'rice pudding': ['sutlac'],
  lokma: ['lokma', 'fried dough'],
  // ── Fast food ──
  bigmac: ['big mac', 'hamburger'],
  'big mac': ['bigmac', 'hamburger', 'mcdonalds'],
  whopper: ['burger', 'hamburger', 'burger king'],
  burger: ['hamburger', 'cheeseburger'],
  hamburger: ['burger', 'cheeseburger'],
  pizza: ['pizza'],
  burrito: ['burrito'],
  taco: ['taco'],
  sushi: ['sushi', 'nigiri', 'roll'],
  nugget: ['nuggets', 'chicken nugget'],
  nuggets: ['nugget', 'chicken nuggets'],
  // ── Meals ──
  salad: ['salata'],
  salata: ['salad', 'coban salata'],
  sandwich: ['sandvic', 'tost'],
  sandvic: ['sandwich', 'tost'],
  tost: ['toast', 'sandwich', 'sandvic'],
  wrap: ['durum', 'wrap'],
  durum: ['wrap', 'durum'],
  bowl: ['bowl', 'kase'],
  // ── Cooking methods (cross-reference) ──
  izgara: ['grilled', 'grill'],
  grilled: ['izgara'],
  haslama: ['boiled'],
  boiled: ['haslama'],
  kizartma: ['fried'],
  fried: ['kizartma', 'tava'],
  tava: ['pan fried', 'fried', 'kizartma'],
  firin: ['baked', 'oven', 'firinda'],
  baked: ['firin', 'firinda'],
  buharda: ['steamed'],
  steamed: ['buharda'],
  // ── Supplements ──
  whey: ['whey protein', 'protein shake'],
  'protein shake': ['whey', 'protein'],
  'protein bar': ['protein bar'],
  protein: ['protein', 'whey'],
  // ── Brand shortcuts ──
  mc: ['mcdonalds', 'big mac', 'mcchicken'],
  mcdonalds: ['big mac', 'mcchicken', 'mc'],
  bk: ['burger king', 'whopper'],
  'burger king': ['whopper', 'bk'],
  sbux: ['starbucks', 'latte', 'frappuccino'],
  starbucks: ['sbux', 'latte', 'frappuccino'],
}

// ─── Çok dilli yiyecek sözlüğü (FR / DE / ES / IT → katalog terimleri) ─────────
// Katalogdaki yiyecek adları İngilizce/Türkçe. Fransa/Almanya/İspanya/İtalya'daki
// kullanıcılar kendi dillerinde yazınca da bulabilmeleri için, her yaygın yiyeceği
// 4 dildeki karşılıklarıyla katalogdaki İngilizce/Türkçe terime eşliyoruz.
// `words` aksansız-normalize edilmiş biçimde yazılır (normalizeFoodText ile aynı).
// Aynı kelime birden çok grupta geçse bile builder onları birleştirir.
const FOOD_TRANSLATIONS: Array<{ words: string[]; targets: string[] }> = [
  // ── Et & Protein ──
  { words: ['poulet', 'huhn', 'hahnchen', 'haehnchen', 'pollo'], targets: ['chicken', 'tavuk'] },
  { words: ['boeuf', 'rind', 'rindfleisch', 'ternera', 'res', 'manzo'], targets: ['beef', 'dana', 'et'] },
  { words: ['viande', 'fleisch', 'carne'], targets: ['meat', 'et'] },
  { words: ['porc', 'schwein', 'schweinefleisch', 'cerdo', 'maiale'], targets: ['pork', 'domuz'] },
  { words: ['agneau', 'lamm', 'cordero', 'agnello'], targets: ['lamb', 'kuzu'] },
  { words: ['dinde', 'pute', 'truthahn', 'pavo', 'tacchino'], targets: ['turkey', 'hindi'] },
  { words: ['poisson', 'fisch', 'pescado', 'pesce'], targets: ['fish', 'balik'] },
  { words: ['saumon', 'lachs', 'salmone'], targets: ['salmon', 'somon'] },
  { words: ['thon', 'thunfisch', 'atun', 'tonno'], targets: ['tuna', 'ton baligi'] },
  { words: ['crevette', 'crevettes', 'garnele', 'garnelen', 'gamba', 'gambas', 'camaron', 'gambero', 'gamberi', 'gamberetto'], targets: ['shrimp', 'karides'] },
  { words: ['oeuf', 'oeufs', 'ei', 'eier', 'huevo', 'huevos', 'uovo', 'uova'], targets: ['egg', 'yumurta'] },
  { words: ['jambon', 'schinken', 'jamon', 'prosciutto'], targets: ['ham', 'jambon'] },
  { words: ['saucisse', 'wurst', 'salchicha', 'salsiccia'], targets: ['sausage', 'sosis', 'sucuk'] },
  { words: ['bacon', 'speck', 'tocino', 'pancetta', 'lard'], targets: ['bacon', 'pastirma'] },
  { words: ['steak', 'bistec', 'filete', 'bistecca'], targets: ['steak', 'biftek'] },
  { words: ['boulette', 'frikadelle', 'albondiga', 'albondigas', 'polpetta', 'polpette'], targets: ['meatball', 'kofte'] },
  { words: ['tofu'], targets: ['tofu'] },
  // ── Süt ürünleri ──
  { words: ['lait', 'milch', 'leche', 'latte'], targets: ['milk', 'sut'] },
  { words: ['fromage', 'kase', 'kaese', 'queso', 'formaggio'], targets: ['cheese', 'peynir'] },
  { words: ['yaourt', 'joghurt', 'yogur', 'yogurt'], targets: ['yogurt'] },
  { words: ['beurre', 'butter', 'mantequilla', 'burro'], targets: ['butter', 'tereyagi'] },
  { words: ['creme', 'sahne', 'nata', 'crema', 'panna'], targets: ['cream', 'krema', 'kaymak'] },
  // ── Tahıl & Karbonhidrat ──
  { words: ['pain', 'brot', 'pan', 'pane'], targets: ['bread', 'ekmek'] },
  { words: ['riz', 'reis', 'arroz', 'riso'], targets: ['rice', 'pirinc', 'pilav'] },
  { words: ['pates', 'nudeln', 'nudel', 'pasta'], targets: ['pasta', 'makarna'] },
  { words: ['spaghetti', 'spaghettis'], targets: ['spaghetti', 'makarna'] },
  { words: ['pomme de terre', 'patate', 'kartoffel', 'kartoffeln', 'patata', 'papa', 'patatas'], targets: ['potato', 'patates'] },
  { words: ['avoine', 'hafer', 'haferflocken', 'avena'], targets: ['oatmeal', 'oats', 'yulaf'] },
  { words: ['farine', 'mehl', 'harina', 'farina'], targets: ['flour', 'un'] },
  { words: ['mais', 'maiz'], targets: ['corn', 'misir'] },
  { words: ['couscous', 'cuscus'], targets: ['couscous', 'kuskus'] },
  // ── Meyveler ──
  { words: ['pomme', 'apfel', 'aepfel', 'manzana', 'mela', 'mele'], targets: ['apple', 'elma'] },
  { words: ['banane', 'platano', 'banana'], targets: ['banana', 'muz'] },
  { words: ['naranja', 'arancia', 'arance'], targets: ['orange', 'portakal'] },
  { words: ['fraise', 'fraises', 'erdbeere', 'erdbeeren', 'fresa', 'fresas', 'fragola', 'fragole'], targets: ['strawberry', 'cilek'] },
  { words: ['raisin', 'traube', 'trauben', 'weintraube', 'uva', 'uvas'], targets: ['grape', 'uzum'] },
  { words: ['poire', 'birne', 'pera', 'birne'], targets: ['pear', 'armut'] },
  { words: ['peche', 'pfirsich', 'melocoton', 'durazno', 'pesca'], targets: ['peach', 'seftali'] },
  { words: ['cerise', 'cerises', 'kirsche', 'kirschen', 'cereza', 'cerezas', 'ciliegia', 'ciliegie'], targets: ['cherry', 'kiraz'] },
  { words: ['pasteque', 'wassermelone', 'sandia', 'anguria', 'cocomero'], targets: ['watermelon', 'karpuz'] },
  { words: ['melon', 'melone', 'melon'], targets: ['melon', 'kavun'] },
  { words: ['citron', 'zitrone', 'limon', 'limone'], targets: ['lemon', 'limon'] },
  { words: ['ananas', 'pina'], targets: ['pineapple', 'ananas'] },
  { words: ['kiwi'], targets: ['kiwi'] },
  { words: ['mangue', 'mango'], targets: ['mango'] },
  { words: ['abricot', 'aprikose', 'albaricoque', 'albicocca'], targets: ['apricot', 'kayisi'] },
  { words: ['figue', 'feige', 'higo', 'fico'], targets: ['fig', 'incir'] },
  { words: ['grenade', 'granatapfel', 'granada', 'melagrana', 'melograno'], targets: ['pomegranate', 'nar'] },
  { words: ['prune', 'pflaume', 'ciruela', 'prugna', 'susina'], targets: ['plum', 'erik'] },
  { words: ['framboise', 'framboises', 'himbeere', 'frambuesa', 'lampone', 'lamponi'], targets: ['raspberry', 'ahududu'] },
  { words: ['myrtille', 'myrtilles', 'blaubeere', 'heidelbeere', 'arandano', 'mirtillo', 'mirtilli'], targets: ['blueberry', 'yaban mersini'] },
  { words: ['avocat', 'aguacate', 'avocado'], targets: ['avocado', 'avokado'] },
  // ── Sebzeler ──
  { words: ['legume', 'legumes', 'gemuse', 'gemuese', 'verdura', 'verduras', 'verdure', 'ortaggio'], targets: ['vegetable', 'sebze'] },
  { words: ['tomate', 'pomodoro', 'pomodori'], targets: ['tomato', 'domates'] },
  { words: ['concombre', 'gurke', 'pepino', 'cetriolo'], targets: ['cucumber', 'salatalik'] },
  { words: ['carotte', 'carottes', 'karotte', 'mohre', 'moehre', 'zanahoria', 'carota', 'carote'], targets: ['carrot', 'havuc'] },
  { words: ['oignon', 'zwiebel', 'cebolla', 'cipolla'], targets: ['onion', 'sogan'] },
  { words: ['ail', 'knoblauch', 'ajo', 'aglio'], targets: ['garlic', 'sarimsak'] },
  { words: ['poivron', 'paprika', 'pimiento', 'peperone'], targets: ['pepper', 'biber'] },
  { words: ['brocoli', 'brokkoli', 'broccoli', 'broccolo'], targets: ['broccoli', 'brokoli'] },
  { words: ['epinard', 'epinards', 'spinat', 'espinaca', 'espinacas', 'spinaci', 'spinacio'], targets: ['spinach', 'ispanak'] },
  { words: ['laitue', 'lechuga', 'lattuga'], targets: ['lettuce', 'marul'] },
  { words: ['champignon', 'champignons', 'pilz', 'pilze', 'champinon', 'seta', 'hongo', 'fungo', 'funghi'], targets: ['mushroom', 'mantar'] },
  { words: ['aubergine', 'berenjena', 'melanzana', 'melanzane'], targets: ['eggplant', 'patlican'] },
  { words: ['courgette', 'zucchini', 'calabacin', 'zucchina', 'zucchine', 'zucchino'], targets: ['zucchini', 'kabak'] },
  { words: ['chou', 'kohl', 'col', 'repollo', 'cavolo'], targets: ['cabbage', 'lahana'] },
  { words: ['chou fleur', 'blumenkohl', 'coliflor', 'cavolfiore'], targets: ['cauliflower', 'karnabahar'] },
  { words: ['petit pois', 'pois', 'erbse', 'erbsen', 'guisante', 'guisantes', 'pisello', 'piselli'], targets: ['peas', 'bezelye'] },
  { words: ['haricot', 'haricots', 'bohne', 'bohnen', 'frijol', 'frijoles', 'judia', 'alubia', 'fagiolo', 'fagioli'], targets: ['beans', 'fasulye'] },
  { words: ['citrouille', 'potiron', 'kurbis', 'kuerbis', 'calabaza', 'zucca'], targets: ['pumpkin', 'balkabagi'] },
  // ── Kuruyemiş ──
  { words: ['amande', 'amandes', 'mandel', 'mandeln', 'almendra', 'almendras', 'mandorla', 'mandorle'], targets: ['almond', 'badem'] },
  { words: ['noix', 'walnuss', 'nuez', 'nueces', 'noce', 'noci'], targets: ['walnut', 'ceviz'] },
  { words: ['noisette', 'noisettes', 'haselnuss', 'avellana', 'nocciola', 'nocciole'], targets: ['hazelnut', 'findik'] },
  { words: ['cacahuete', 'cacahuetes', 'erdnuss', 'erdnusse', 'mani', 'arachide', 'arachidi', 'nocciolina'], targets: ['peanut', 'fistik'] },
  { words: ['noix de cajou', 'cajou', 'cashew', 'anacardo', 'anacardi'], targets: ['cashew', 'kaju'] },
  { words: ['pistache', 'pistazie', 'pistacho', 'pistacchio', 'pistacchi'], targets: ['pistachio', 'antep fistigi'] },
  // ── İçecekler ──
  { words: ['eau', 'wasser', 'agua', 'acqua'], targets: ['water', 'su'] },
  { words: ['cafe', 'kaffee', 'caffe'], targets: ['coffee', 'kahve'] },
  { words: ['the', 'tee', 'te'], targets: ['tea', 'cay'] },
  { words: ['jus', 'saft', 'zumo', 'jugo', 'succo'], targets: ['juice', 'meyve suyu'] },
  { words: ['biere', 'bier', 'cerveza', 'birra'], targets: ['beer', 'bira'] },
  { words: ['vin', 'wein', 'vino'], targets: ['wine', 'sarap'] },
  // ── Tatlılar ──
  { words: ['chocolat', 'schokolade', 'cioccolato', 'cioccolata'], targets: ['chocolate', 'cikolata'] },
  { words: ['gateau', 'kuchen', 'pastel', 'tarta', 'torta', 'dolce'], targets: ['cake', 'kek', 'pasta'] },
  { words: ['biscuit', 'biscuits', 'keks', 'galleta', 'galletas', 'biscotto', 'biscotti'], targets: ['cookie', 'kurabiye', 'biskuvi'] },
  { words: ['glace', 'eis', 'helado', 'gelato'], targets: ['ice cream', 'dondurma'] },
  { words: ['bonbon', 'bonbons', 'caramelo', 'dulce', 'caramella', 'caramelle'], targets: ['candy', 'seker'] },
  { words: ['miel', 'honig', 'miele'], targets: ['honey', 'bal'] },
  { words: ['confiture', 'marmelade', 'mermelada', 'marmellata'], targets: ['jam', 'recel'] },
  { words: ['sucre', 'zucker', 'azucar', 'zucchero'], targets: ['sugar', 'seker'] },
  // ── Yemekler ──
  { words: ['soupe', 'suppe', 'sopa', 'zuppa', 'minestra'], targets: ['soup', 'corba'] },
  { words: ['salade', 'salat', 'ensalada', 'insalata'], targets: ['salad', 'salata'] },
  { words: ['sandwich', 'bocadillo', 'emparedado', 'panino', 'tramezzino'], targets: ['sandwich', 'sandvic', 'tost'] },
  { words: ['frites', 'pommes', 'pommes frites', 'patatas fritas', 'papas fritas', 'patatine', 'patatine fritte'], targets: ['fries', 'french fries', 'patates kizartmasi'] },
  { words: ['omelette', 'omelett', 'tortilla', 'frittata'], targets: ['omelette', 'omlet'] },
  { words: ['pizza'], targets: ['pizza'] },
  { words: ['hamburger', 'burger'], targets: ['burger', 'hamburger'] },
  // ── Diğer ──
  { words: ['huile', 'ol', 'oel', 'aceite', 'olio'], targets: ['oil', 'yag'] },
  { words: ['huile d olive', 'olivenol', 'olivenoel', 'aceite de oliva', 'olio d oliva', 'olio di oliva'], targets: ['olive oil', 'zeytinyagi'] },
  { words: ['sel', 'salz', 'sal', 'sale'], targets: ['salt', 'tuz'] },
  { words: ['olive', 'olives', 'olive', 'aceituna', 'aceitunas', 'oliva', 'olive'], targets: ['olive', 'zeytin'] },
  { words: ['lentille', 'lentilles', 'linse', 'linsen', 'lenteja', 'lentejas', 'lenticchia', 'lenticchie'], targets: ['lentil', 'mercimek'] },
  { words: ['pois chiche', 'pois chiches', 'kichererbse', 'garbanzo', 'garbanzos', 'cece', 'ceci'], targets: ['chickpea', 'nohut'] },
  { words: ['miel'], targets: ['honey', 'bal'] },
]

// FOOD_TRANSLATIONS'ı çalışma anında {kelime → hedefler} haritasına dönüştür.
// Bir kelime birden çok grupta geçerse hedefler birleştirilir.
const MULTILINGUAL_SYNONYMS: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {}
  for (const { words, targets } of FOOD_TRANSLATIONS) {
    for (const word of words) {
      const key = word // zaten normalize biçimde yazıldı
      const existing = map[key] ?? []
      map[key] = Array.from(new Set([...existing, ...targets, ...words.filter((w) => w !== word)]))
    }
  }
  return map
})()

/** Bir terim için hem TR/EN hem çok dilli eş anlamlıları birleştirip döndürür. */
function getMergedSynonyms(term: string): string[] {
  const a = SYNONYMS[term] ?? []
  const b = MULTILINGUAL_SYNONYMS[term] ?? []
  if (a.length === 0) return b
  if (b.length === 0) return a
  return Array.from(new Set([...a, ...b]))
}

export function normalizeFoodText(text: string): string {
  return text
    .replace(/İ/g, 'i')
    .replace(/ı/g, 'i')
    .toLowerCase()
    .replace(/ß/g, 'ss')
    // Unicode NFD ile tüm aksanları (é, è, ñ, ä, ö, ü, ç, ş, ğ, à, ô …) ayrıştırıp
    // birleşik aksan işaretlerini kaldır. Böylece Fransızca/Almanca/İspanyolca/
    // İtalyanca kelimeler ("café", "jamón", "käse", "pâtes") doğru normalize olur.
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 3) return 99
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j += 1) dp[0][j] = j
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
    }
  }
  return dp[a.length][b.length]
}

function scoreFood(food: FoodCatalogItem, query: string): number {
  if (!query) return 1
  // Try misspelling correction first
  const correctedQuery = correctMisspelling(query)
  // Tam sorguyu VE her kelimeyi ayrı ayrı eş anlamlılarla genişlet. Böylece
  // "poulet grille" gibi çok kelimeli aramalarda "poulet" → "chicken" eşlenir.
  const expandedSet = new Set<string>()
  const addWithSynonyms = (value: string) => {
    if (!value) return
    expandedSet.add(value)
    for (const syn of getMergedSynonyms(value)) expandedSet.add(syn)
  }
  addWithSynonyms(query)
  for (const token of query.split(' ').filter(Boolean)) addWithSynonyms(token)
  // Also expand corrected form if different
  if (correctedQuery !== query) {
    addWithSynonyms(correctedQuery)
    for (const token of correctedQuery.split(' ').filter(Boolean)) addWithSynonyms(token)
  }
  const expandedTerms = [...expandedSet]
  const haystack = food.searchableText
  const name = normalizeFoodText(food.name)
  const brand = normalizeFoodText(food.brand ?? '')
  const aliases = food.aliases.map(normalizeFoodText)
  const compact = (value: string) => value.replace(/\s+/g, '')
  const compactQuery = compact(query)
  const compactName = compact(name)
  const compactBrand = compact(brand)
  const compactAliases = aliases.map(compact)
  let score = 0

  for (const term of expandedTerms) {
    const compactTerm = compact(term)
    if (name === term) score = Math.max(score, 100)
    if (brand === term) score = Math.max(score, 98)
    if (aliases.some((alias) => alias === term)) score = Math.max(score, 96)
    if (compactBrand === compactTerm || compactBrand === compactQuery) score = Math.max(score, 98)
    if (compactName === compactTerm || compactName.startsWith(compactTerm)) score = Math.max(score, 92)
    if (compactAliases.some((alias) => alias === compactTerm)) score = Math.max(score, 96)
    if (aliases.some((alias) => alias.startsWith(`${term} `) || alias.endsWith(` ${term}`))) score = Math.max(score, 88)
    if (name.startsWith(term)) score = Math.max(score, 85)
    if (haystack.includes(term)) score = Math.max(score, 70)
  }

  const queryTokens = query.split(' ').filter(Boolean)
  const hayTokens = haystack.split(' ').filter(Boolean)
  const tokenHits = queryTokens.filter((token) =>
    hayTokens.some((hayToken) => hayToken.includes(token) || editDistance(token, hayToken) <= (token.length > 5 ? 3 : 2))
  ).length

  if (queryTokens.length > 0 && tokenHits === queryTokens.length) score = Math.max(score, 55 + tokenHits * 5)
  return score
}

export interface SearchBoostOptions {
  favoriteIds?: string[]
  recentIds?: string[]
  popularIds?: string[]
}

export function searchFoodCatalog(
  foods: FoodCatalogItem[],
  query: string,
  category?: FoodCatalogCategory | 'Tümü' | 'All',
  limit = 50,
  boosts?: SearchBoostOptions
): FoodCatalogItem[] {
  const normalizedQuery = normalizeFoodText(query)
  const favSet = boosts?.favoriteIds ? new Set(boosts.favoriteIds) : null
  const recSet = boosts?.recentIds ? new Set(boosts.recentIds) : null
  const popSet = boosts?.popularIds ? new Set(boosts.popularIds) : null

  return foods
    .filter((food) => !category || category === 'Tümü' || category === 'All' || food.category === category)
    .map((food) => {
      let score = scoreFood(food, normalizedQuery)
      if (score > 0 || !normalizedQuery) {
        if (favSet?.has(food.id)) score += 15
        if (recSet?.has(food.id)) score += 10
        if (popSet?.has(food.id)) score += 5
      }
      return { food, score }
    })
    .filter(({ score }) => !normalizedQuery || score > 0)
    .sort((a, b) => b.score - a.score || a.food.name.localeCompare(b.food.name))
    .slice(0, limit)
    .map(({ food }) => food)
}

function readIds(key: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]') as string[]
  } catch {
    return []
  }
}

function writeIds(key: string, ids: string[]): void {
  localStorage.setItem(key, JSON.stringify(ids.slice(0, 30)))
}

export function getFavoriteFoodIds(): string[] {
  return readIds(FAVORITES_KEY)
}

export function toggleFavoriteFood(foodId: string): string[] {
  const ids = getFavoriteFoodIds()
  const next = ids.includes(foodId) ? ids.filter((id) => id !== foodId) : [foodId, ...ids]
  writeIds(FAVORITES_KEY, next)
  return next
}

export function getRecentFoodIds(): string[] {
  return readIds(RECENTS_KEY)
}

export function rememberRecentFood(foodId: string): void {
  writeIds(RECENTS_KEY, [foodId, ...getRecentFoodIds().filter((id) => id !== foodId)])
}

export function getCustomCatalogFoods(): FoodCatalogItem[] {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_FOODS_KEY) ?? '[]') as FoodCatalogItem[]
  } catch {
    return []
  }
}

export function saveCustomCatalogFood(input: CustomFoodInput): FoodCatalogItem {
  const now = new Date().toISOString()
  const amount = input.defaultAmount > 0 ? input.defaultAmount : 100
  const serving = createServing(
    input.defaultUnitType === 'ml' ? `${amount} ml` : `${amount} g`,
    input.defaultUnitType,
    amount,
    'default'
  )
  const hundred = createServing(input.defaultUnitType === 'ml' ? '100 ml' : '100 g', input.defaultUnitType, 100, '100')
  const servingOptions: FoodServingOption[] = serving.id === hundred.id ? [serving] : [serving, hundred]
  const food: FoodCatalogItem = {
    id: `custom-${createId()}`,
    name: input.name,
    ...(input.brand && { brand: input.brand }),
    category: input.category,
    subcategory: input.subcategory ?? 'Özel',
    servingOptions,
    defaultServing: serving,
    calories: input.calories,
    protein: input.protein,
    carbs: input.carbs,
    fat: input.fat,
    fiber: input.fiber,
    ...(input.sugar !== undefined && { sugar: input.sugar }),
    ...(input.saturatedFat !== undefined && { saturatedFat: input.saturatedFat }),
    ...(input.sodium !== undefined && { sodium: input.sodium }),
    unitTypes: [...new Set(servingOptions.map((option) => option.unitType))],
    aliases: input.note ? [input.note] : [],
    searchableText: normalizeFoodText([input.name, input.brand, input.category, input.subcategory, input.note].filter(Boolean).join(' ')),
    isCustom: true,
    createdAt: now,
    updatedAt: now,
  }
  localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify([food, ...getCustomCatalogFoods()]))
  return food
}

export function matchFoodToCatalog(
  foodName: string,
  catalog: FoodCatalogItem[],
  threshold = 40
): FoodCatalogItem | null {
  const normalized = normalizeFoodText(foodName)
  if (!normalized) return null

  let best: FoodCatalogItem | null = null
  let bestScore = 0

  for (const food of catalog) {
    const score = scoreFood(food, normalized)
    if (score > bestScore) {
      bestScore = score
      best = food
    }
  }

  // If no match, try misspelling correction as separate query
  if (bestScore < threshold) {
    const corrected = correctMisspelling(normalized)
    if (corrected !== normalized) {
      for (const food of catalog) {
        const score = scoreFood(food, corrected)
        if (score > bestScore) {
          bestScore = score
          best = food
        }
      }
    }
  }

  return bestScore >= threshold ? best : null
}
