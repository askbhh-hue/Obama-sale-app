import { GOOGLE_SCRIPT_URL, WHATSAPP_NUMBER } from '../config/siteConfig';
import { trackPixelEvent } from './pixel';
import {
  buildGoogleSheetsPayload,
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  type AttributionParams,
} from './tracking';
import type { OrderFormValues } from './validation';

export interface LeadSubmissionResult {
  sheetsSaved: boolean;
  whatsappUrl: string;
  whatsappMessage: string;
}

export function isGoogleScriptConfigured(url = GOOGLE_SCRIPT_URL): boolean {
  return Boolean(
    url &&
      !url.includes('YOUR_GOOGLE_APPS_SCRIPT_ID') &&
      url.startsWith('https://script.google.com/')
  );
}

export async function submitLeadOrder(
  values: OrderFormValues,
  attribution: AttributionParams,
  pageUrl: string
): Promise<LeadSubmissionResult> {
  const payload = buildGoogleSheetsPayload(values, attribution, pageUrl);
  const whatsappMessage = buildWhatsAppOrderMessage(values, attribution);
  const whatsappUrl = buildWhatsAppUrl(WHATSAPP_NUMBER, whatsappMessage);

  let sheetsSaved = false;

  if (isGoogleScriptConfigured()) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      sheetsSaved = true;
    } catch {
      // Fail silently so WhatsApp conversion still executes and no lead is lost
      sheetsSaved = false;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  trackPixelEvent('Lead', {
    content_name: values.selectedProducts.join(', '),
    governorate: values.governorate,
    crop: values.cropType,
  });

  return {
    sheetsSaved,
    whatsappUrl,
    whatsappMessage,
  };
}
