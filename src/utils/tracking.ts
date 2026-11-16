import { normalizeDigits, type OrderFormValues } from './validation';

export interface AttributionParams {
  utm_source: string;
  utm_campaign: string;
  utm_content: string;
  utm_medium: string;
  fbclid: string;
}

const STORAGE_KEY = 'khodret_saeed_attribution_v1';

export const EMPTY_ATTRIBUTION: AttributionParams = {
  utm_source: '',
  utm_campaign: '',
  utm_content: '',
  utm_medium: '',
  fbclid: '',
};

export function extractAttributionFromSearch(search: string): AttributionParams {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  return {
    utm_source: params.get('utm_source')?.trim() || '',
    utm_campaign: params.get('utm_campaign')?.trim() || '',
    utm_content: params.get('utm_content')?.trim() || '',
    utm_medium: params.get('utm_medium')?.trim() || '',
    fbclid: params.get('fbclid')?.trim() || '',
  };
}

export function mergeAttribution(
  existing: AttributionParams,
  incoming: AttributionParams
): AttributionParams {
  return {
    utm_source: incoming.utm_source || existing.utm_source,
    utm_campaign: incoming.utm_campaign || existing.utm_campaign,
    utm_content: incoming.utm_content || existing.utm_content,
    utm_medium: incoming.utm_medium || existing.utm_medium,
    fbclid: incoming.fbclid || existing.fbclid,
  };
}

export function captureAndGetAttribution(): AttributionParams {
  if (typeof window === 'undefined') return EMPTY_ATTRIBUTION;

  let stored = EMPTY_ATTRIBUTION;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      stored = { ...EMPTY_ATTRIBUTION, ...JSON.parse(raw) };
    }
  } catch {
    stored = EMPTY_ATTRIBUTION;
  }

  const incoming = extractAttributionFromSearch(window.location.search);
  const merged = mergeAttribution(stored, incoming);

  try {
    const serialized = JSON.stringify(merged);
    window.sessionStorage.setItem(STORAGE_KEY, serialized);
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Ignore storage quota / privacy mode errors
  }

  return merged;
}

export interface GoogleSheetsLeadPayload {
  timestamp: string;
  name: string;
  phone: string;
  email: string;
  governorate: string;
  address: string;
  crop: string;
  product: string;
  quantity: string;
  notes: string;
  utm_source: string;
  utm_campaign: string;
  utm_content: string;
  fbclid: string;
  pageUrl: string;
}

export function buildGoogleSheetsPayload(
  values: OrderFormValues,
  attribution: AttributionParams,
  pageUrl: string,
  timestamp = new Date().toISOString()
): GoogleSheetsLeadPayload {
  return {
    timestamp,
    name: values.fullName.trim(),
    phone: normalizeDigits(values.phone.trim()),
    email: values.email.trim(),
    governorate: values.governorate,
    address: values.address.trim(),
    crop: values.cropType.trim(),
    product: values.selectedProducts.join('، '),
    quantity: values.quantity.trim(),
    notes: values.notes.trim(),
    utm_source: attribution.utm_source,
    utm_campaign: attribution.utm_campaign,
    utm_content: attribution.utm_content,
    fbclid: attribution.fbclid,
    pageUrl,
  };
}

export function buildWhatsAppOrderMessage(
  values: OrderFormValues,
  attribution: AttributionParams
): string {
  const lines = [
    'السلام عليكم، أريد تأكيد طلب / استشارة زراعية:',
    `الاسم: ${values.fullName.trim()}`,
    `الموبايل: ${normalizeDigits(values.phone.trim())}`,
    `المحافظة: ${values.governorate}`,
    `القرية / العنوان: ${values.address.trim()}`,
    `المحصول: ${values.cropType.trim()}`,
    `المنتجات المطلوبة: ${values.selectedProducts.join('، ')}`,
    `الكمية: ${values.quantity.trim()}`,
  ];

  if (values.notes.trim()) {
    lines.push(`ملاحظات: ${values.notes.trim()}`);
  }
  if (attribution.utm_campaign || attribution.utm_content) {
    const refParts = [attribution.utm_campaign, attribution.utm_content].filter(Boolean);
    lines.push(`مرجع العرض: ${refParts.join(' / ')}`);
  }

  return lines.join('\n');
}

export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
