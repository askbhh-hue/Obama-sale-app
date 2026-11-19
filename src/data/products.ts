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

// 1.25 = +25%. Change this number only to change all prices
const PRICE_MARKUP = 1 ;

const withMarkup = (product: Product): Product => ({
  ...product,
  priceEgp:
    product.priceEgp === null
      ? null
      : Math.round((product.priceEgp * PRICE_MARKUP) / 5) * 5,
});

const norm = (s: string) =>
  String(s || '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\s\-()]/g, '')
    .toLowerCase();

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
  if (slug.startsWith('new-') || n.startsWith('نيو')) return null;
  const hit = PHOTO_RULES.find(
    ([, prefix, keys]) => slug.startsWith(prefix) || keys.every((k) => n.includes(k))
  );
  return hit ? hit[0] : null;
};

const withPhoto = (product: Product): Product => {
  const name = photoFor(product);
  return name ? { ...product, image: `/${name}.jpg` } : product;
};

const withName = (product: Product): Product => {
  const n = norm(product.name);
  const isSteda =
    String(product.slug || '').startsWith('stedasilver') ||
    n.includes('ستداسلفر') ||
    n.includes('ستداسيلفر') ||
    (n.includes('ستدا') && n.includes('لفر'));
  return isSteda ? { ...product, name: 'ستساسيلفر' } : product;
};

export const PRODUCTS: Product[] = (rawCatalog.products as Product[])
  .map(withMarkup)
  .map(withPhoto)
  .map(withName);

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  pesticides: 'مبيدات',
  fertilizers: 'أسمدة',
};

