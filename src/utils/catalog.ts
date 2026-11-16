import type { Product, ProductCategory } from '../data/products';

export type CatalogFilterCategory = 'all' | ProductCategory;

export function normalizeArabicText(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '');
}

export function filterProducts(
  products: Product[],
  category: CatalogFilterCategory,
  searchQuery: string
): Product[] {
  const normalizedQuery = normalizeArabicText(searchQuery);

  return products.filter((product) => {
    if (category !== 'all' && product.category !== category) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableText = normalizeArabicText(
      [
        product.name,
        product.shortUsageNote,
        product.activeIngredient,
        product.targetCropPest,
        product.packSize,
      ].join(' ')
    );

    return searchableText.includes(normalizedQuery);
  });
}

export function findProductBySlug(
  products: Product[],
  slug: string
): Product | undefined {
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  return products.find((p) => p.slug.toLowerCase() === decoded);
}
