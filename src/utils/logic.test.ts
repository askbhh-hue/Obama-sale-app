import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../data/products';
import { filterProducts, findProductBySlug, normalizeArabicText } from './catalog';
import { parseOfferSlugFromPath, buildOfferPath } from './router';
import {
  buildGoogleSheetsPayload,
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  EMPTY_ATTRIBUTION,
  extractAttributionFromSearch,
  mergeAttribution,
} from './tracking';
import {
  normalizeDigits,
  validateEgyptianPhone,
  validateOrderForm,
  type OrderFormValues,
} from './validation';

test('validateEgyptianPhone accepts valid 11-digit Egyptian numbers including Arabic-Indic digits', () => {
  assert.equal(validateEgyptianPhone('01012345678'), true);
  assert.equal(validateEgyptianPhone('011-9876-5432'), true);
  assert.equal(validateEgyptianPhone('01234567890'), true);
  assert.equal(validateEgyptianPhone('01555555555'), true);
  assert.equal(validateEgyptianPhone('٠١٠١٢٣٤٥٦٧٨'), true);

  assert.equal(validateEgyptianPhone('01312345678'), false); // invalid operator prefix
  assert.equal(validateEgyptianPhone('0101234'), false); // too short
  assert.equal(validateEgyptianPhone('010123456789'), false); // too long
  assert.equal(validateEgyptianPhone('0223456789'), false); // landline
  assert.equal(normalizeDigits('٠١٢-٣٤٥'), '012345');
});

test('validateOrderForm requires valid governorate, name, phone, address, crop, products, quantity', () => {
  const invalid: OrderFormValues = {
    fullName: '',
    phone: '123',
    email: 'bad-email',
    governorate: 'القاهرة', // outside Beni Suef / Fayoum / Minya
    address: '',
    cropType: '',
    selectedProducts: [],
    quantity: '',
    notes: '',
  };

  const errors = validateOrderForm(invalid);
  assert.ok(errors.fullName);
  assert.ok(errors.phone);
  assert.ok(errors.email);
  assert.ok(errors.governorate);
  assert.ok(errors.address);
  assert.ok(errors.cropType);
  assert.ok(errors.selectedProducts);
  assert.ok(errors.quantity);

  const valid: OrderFormValues = {
    fullName: 'أحمد محمد علي',
    phone: '01012345678',
    email: '',
    governorate: 'بني سويف',
    address: 'مركز ببا - قرية قمبش',
    cropType: 'طماطم',
    selectedProducts: ['مبيد حشري لامبدا ستار 5% (نموذج كتالوج)'],
    quantity: '3 عبوات',
    notes: 'التوصيل عصراً',
  };

  const noErrors = validateOrderForm(valid);
  assert.deepEqual(noErrors, {});
});

test('extractAttributionFromSearch and mergeAttribution preserve UTM and fbclid parameters', () => {
  const incoming = extractAttributionFromSearch(
    '?utm_source=facebook&utm_campaign=minya_tomato&utm_content=ad_09&fbclid=IwAR123'
  );
  assert.equal(incoming.utm_source, 'facebook');
  assert.equal(incoming.utm_campaign, 'minya_tomato');
  assert.equal(incoming.utm_content, 'ad_09');
  assert.equal(incoming.fbclid, 'IwAR123');

  const merged = mergeAttribution(incoming, EMPTY_ATTRIBUTION);
  assert.equal(merged.utm_campaign, 'minya_tomato');
  assert.equal(merged.fbclid, 'IwAR123');
});

test('buildGoogleSheetsPayload and buildWhatsAppOrderMessage format all required fields', () => {
  const order: OrderFormValues = {
    fullName: 'محمود حسن',
    phone: '٠١١٢٢٣٣٤٤٥٥',
    email: 'farmer@example.com',
    governorate: 'الفيوم',
    address: 'إطسا - قرية دفنو',
    cropType: 'بصل',
    selectedProducts: ['مبيد فطري وقائي وعلاجي أزوكسي شيلد (نموذج كتالوج)'],
    quantity: '2 عبوة',
    notes: '',
  };
  const attribution = extractAttributionFromSearch(
    '?utm_source=fb&utm_campaign=fayoum_onion&utm_content=video_2'
  );

  const payload = buildGoogleSheetsPayload(
    order,
    attribution,
    'https://example.com/offer/azoxy-shield-25',
    '2026-11-16T10:00:00.000Z'
  );

  assert.equal(payload.phone, '01122334455');
  assert.equal(payload.governorate, 'الفيوم');
  assert.equal(payload.utm_source, 'fb');
  assert.equal(payload.utm_campaign, 'fayoum_onion');
  assert.equal(payload.utm_content, 'video_2');

  const msg = buildWhatsAppOrderMessage(order, attribution);
  assert.match(msg, /محمود حسن/);
  assert.match(msg, /01122334455/);
  assert.match(msg, /الفيوم/);
  assert.match(msg, /fayoum_onion/);

  const url = buildWhatsAppUrl('+20 100-000-0000', msg);
  assert.ok(url.startsWith('https://wa.me/201000000000?text='));
});

test('catalog filtering supports category tabs and Arabic normalization', () => {
  assert.equal(normalizeArabicText('أزوكسي أسمدة'), 'ازوكسي اسمده');

  const pesticides = filterProducts(PRODUCTS, 'pesticides', '');
  assert.ok(pesticides.length > 0);
  assert.ok(pesticides.every((p) => p.category === 'pesticides'));

  const fertilizers = filterProducts(PRODUCTS, 'fertilizers', '');
  assert.ok(fertilizers.length > 0);
  assert.ok(fertilizers.every((p) => p.category === 'fertilizers'));

  const searchMatches = filterProducts(PRODUCTS, 'all', 'طماطم');
  assert.ok(searchMatches.length >= 2);

  const emptySearch = filterProducts(PRODUCTS, 'all', 'منتج_غير_موجود_نهائيا');
  assert.equal(emptySearch.length, 0);
});

test('router parses /offer/:slug paths and finds matching product', () => {
  assert.equal(parseOfferSlugFromPath('/'), null);
  assert.equal(parseOfferSlugFromPath('/offer/lambda-star-5'), 'lambda-star-5');
  assert.equal(parseOfferSlugFromPath('/offer/lambda-star-5/'), 'lambda-star-5');
  assert.equal(buildOfferPath('lambda-star-5'), '/offer/lambda-star-5');

  const found = findProductBySlug(PRODUCTS, 'lambda-star-5');
  assert.ok(found);
  assert.equal(found.id, 'pesticide-lambda-5');
});
