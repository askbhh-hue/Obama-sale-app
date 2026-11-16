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
const PRICE_MARKUP = 1.25;

const withMarkup = (product: Product): Product => ({
  ...product,
  priceEgp:
    product.priceEgp === null
      ? null
      : Math.round((product.priceEgp * PRICE_MARKUP) / 5) * 5,
});

export const PRODUCTS: Product[] = (rawCatalog.products as Product[]).map(withMarkup);

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  pesticides: 'مبيدات',
  fertilizers: 'أسمدة',
};
