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

export const PRODUCTS: Product[] = rawCatalog.products as Product[];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  pesticides: 'مبيدات',
  fertilizers: 'أسمدة',
};
