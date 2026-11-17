import rawCatalog from './products.json';

export type ProductCategory = 'pesticides' | 'fertilizers';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  isBestSeller: boolean;
  priceEgp: number | null;
  packSize: string;
  shortUsageNote: string;
  image: string;
  offerHeadline?: string;
  activeIngredient: string;
  targetCropPest: string;
  dose: string;
  applicationMethod: string;
  safetyWarnings?: string;
  preHarvestInterval?: string;
}

// نسبة الزيادة على الأسعار: 1.25 = زيادة 25%. غيّر الرقم ده بس لتغيير كل الأسعار
const PRICE_MARKUP = 1.25;

const withMarkup = (product: Product): Product => ({
  ...product,
  priceEgp:
    product.priceEgp === null
      ? null
      : Math.round((product.priceEgp * PRICE_MARKUP) / 5) * 5,
});

// صور المنتجات: الصورة في public/ واسمها نفس بداية كود المنتج (slug)
// صور المنتجات: الصورة في public/ . بتتعرف على المنتج من كود المنتج أو من اسمه بالعربي
const norm = (s: string) =>
  String(s || '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\s\-()]/g, '')
    .toLowerCase();

// [اسم ملف الصورة، بداية كود المنتج، كلمات عربي لازم تكون في الاسم]
const PHOTO_RULES: [string, string, string[]][] = [
  ['agromil-phosphite', 'agromil-phosphite', ['اجروميل', 'فوسفيت']],
  ['agromil', 'agromil', ['اجروميل']],
  ['hostamic', 'hostamic', ['هوستاميك']],
  ['garlic-twist', 'garlic-twist', ['جارليتوريست']],
  ['potassco', 'potassco', ['بوتاسكو']],
  ['mixafos', 'mixafos', ['ميكسافوس']],
  ['vitogreen', 'vitogreen', ['فيتوجرين']],
  ['boronium', 'boronium', ['بورونيوم']],
  ['cytoflora', 'cytoflora', ['سيتوفلورا']],
  ['chip-curan', 'chip-curan', ['كيوران']],
  ['mantoral', 'mantoral', ['مانتورال']],
  ['amino-flower', 'amino-flower', ['امينو', 'فلاور']],
  ['saftogreen', 'saftogreen', ['سيفتو']],
  ['oglan', 'oglan', ['اوجلان']],
  ['dantela', 'dantela', ['دانتلا']],
  ['copa-plus', 'copa-plus', ['كوبا']],
  ['biophos', 'biophos', ['بايوفوس']],
  ['sportage', 'sportage', ['سبورتاج']],
  ['bilison', 'bilison', ['بليزون']],
  ['cycostar', 'cycostar', ['سيكو']],
  ['apatchi', 'apatchi', ['اباتشي']],
  ['voltan', 'voltan', ['فولتان']],
  ['nefertity', 'nefertity', ['نفرتيتي']],
];

const photoFor = (product: Product): string | null => {
  const n = norm(product.name);
  const slug = String(product.slug || '').toLowerCase();
  if (slug.startsWith('new-') || n.startsWith('نيو')) return null; // نيو نفرتيتي مالوش صورة
  const hit = PHOTO_RULES.find(
    ([, prefix, keys]) => slug.startsWith(prefix) || keys.every((k) => n.includes(k))
  );
  return hit ? hit[0] : null;
};

const withPhoto = (product: Product): Product => {
  const name = photoFor(product);
  return name ? { ...product, image: `/${name}.jpg` } : product;
};

const NAME_FIXES: Record<string, string> = {
  'stedasilver-250': 'ستساسيلفر',
};

const withName = (product: Product): Product =>
  NAME_FIXES[product.slug] ? { ...product, name: NAME_FIXES[product.slug] } : product;

export const PRODUCTS: Product[] = (rawCatalog.products as Product[])
  .map(withMarkup)
  .map(withPhoto)
  .map(withName);

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  pesticides: 'مبيدات',
  fertilizers: 'أسمدة',
};
