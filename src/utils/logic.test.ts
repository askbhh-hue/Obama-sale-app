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
  assert.equal(validateEgyptianPhone('01092935779'), true);
  assert.equal(validateEgyptianPhone('011-9876-5432'), true);
  assert.equal(validateEgyptianPhone('01234567890'), true);
  assert.equal(validateEgyptianPhone('01555555555'), true);
  assert.equal(validateEgyptianPhone('٠١٠٩٢٩٣٥٧٧٩'), true);

  assert.equal(validateEgyptianPhone('01312345678'), false);
  assert.equal(validateEgyptianPhone('0101234'), false);
  assert.equal(validateEgyptianPhone('010123456789'), false);
  assert.equal(validateEgyptianPhone('0223456789'), false);
  assert.equal(normalizeDigits('٠١٢-٣٤٥'), '012345');
});

test('validateOrderForm requires valid governorate, name, phone, address, crop, products, quantity', () => {
  const invalid: OrderFormValues = {
    fullName: '',
    phone: '123',
    email: 'bad-email',
    governorate: 'القاهرة',
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
    phone: '01092935779',
    email: '',
    governorate: 'بني سويف',
    address: 'مركز ببا - قرية قمبش',
    cropType: 'طماطم',
    selectedProducts: ['بليزون (Bilison SC)'],
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
    selectedProducts: ['هوستاميك جرين (Hostamic Green)'],
    quantity: '2 جركن',
    notes: '',
  };
  const attribution = extractAttributionFromSearch(
    '?utm_source=fb&utm_campaign=fayoum_onion&utm_content=video_2'
  );

  const payload = buildGoogleSheetsPayload(
    order,
    attribution,
    'https://example.com/offer/hostamic-green',
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

  const url = buildWhatsAppUrl('+20 109-293-5779', msg);
  assert.ok(url.startsWith('https://wa.me/201092935779?text='));
});

test('catalog holds all 28 brochure products including variants and optional price placeholders', () => {
  assert.equal(PRODUCTS.length, 28);

  const pesticides = filterProducts(PRODUCTS, 'pesticides', '');
  assert.equal(pesticides.length, 15);
  assert.ok(pesticides.every((p) => p.category === 'pesticides'));

  const fertilizers = filterProducts(PRODUCTS, 'fertilizers', '');
  assert.equal(fertilizers.length, 13);
  assert.ok(fertilizers.every((p) => p.category === 'fertilizers'));

  const dantela = findProductBySlug(PRODUCTS, 'dantela-green');
  assert.ok(dantela);
  assert.equal(dantela.variants?.length, 2);
  assert.equal(dantela.variants?.[0]?.priceEgp, 135);
  assert.equal(dantela.variants?.[1]?.priceEgp, 260);

  const sentamora = findProductBySlug(PRODUCTS, 'sentamora-x');
  assert.ok(sentamora);
  assert.equal(sentamora.priceEgp, null);
});

test('catalog filtering supports Arabic normalization and subCategory/crop search', () => {
  assert.equal(normalizeArabicText('أزوكسي أسمدة'), 'ازوكسي اسمده');

  const beetMatches = filterProducts(PRODUCTS, 'all', 'بنجر السكر');
  assert.ok(beetMatches.length >= 2);

  const fungalMatches = filterProducts(PRODUCTS, 'pesticides', 'فطري');
  assert.equal(fungalMatches.length, 9);

  const emptySearch = filterProducts(PRODUCTS, 'all', 'منتج_غير_موجود_نهائيا');
  assert.equal(emptySearch.length, 0);
});

test('router parses /offer/:slug paths and finds matching brochure product', () => {
  assert.equal(parseOfferSlugFromPath('/'), null);
  assert.equal(parseOfferSlugFromPath('/offer/bilison'), 'bilison');
  assert.equal(parseOfferSlugFromPath('/offer/sportage-green/'), 'sportage-green');
  assert.equal(buildOfferPath('hostamic-green'), '/offer/hostamic-green');

  const found = findProductBySlug(PRODUCTS, 'bilison');
  assert.ok(found);
  assert.equal(found.id, 'fungicide-bilison');
  assert.equal(found.priceEgp, 550);
});
