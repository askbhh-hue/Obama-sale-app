import { DELIVERY_GOVERNORATES } from '../config/siteConfig';

export interface OrderFormValues {
  fullName: string;
  phone: string;
  email: string;
  governorate: string;
  address: string;
  cropType: string;
  selectedProducts: string[];
  quantity: string;
  notes: string;
}

export type OrderFormErrors = Partial<Record<keyof OrderFormValues, string>>;

const ARABIC_DIGIT_MAP: Record<string, string> = {
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
  '۰': '0',
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
};

export function normalizeDigits(input: string): string {
  return input
    .split('')
    .map((ch) => ARABIC_DIGIT_MAP[ch] ?? ch)
    .join('')
    .replace(/[\s\-()]/g, '');
}

export function validateEgyptianPhone(phone: string): boolean {
  const normalized = normalizeDigits(phone.trim());
  return /^01[0125][0-9]{8}$/.test(normalized);
}

export function validateOptionalEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function validateOrderForm(values: OrderFormValues): OrderFormErrors {
  const errors: OrderFormErrors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = 'يرجى كتابة الاسم الثلاثي أو الاسم الكامل';
  }

  if (!validateEgyptianPhone(values.phone)) {
    errors.phone =
      'يرجى إدخال رقم موبايل مصري صحيح مكون من 11 رقم يبدأ بـ 01 (مثل 01012345678)';
  }

  if (!validateOptionalEmail(values.email)) {
    errors.email = 'البريد الإلكتروني غير صحيح (أو اتركه فارغاً)';
  }

  if (
    !DELIVERY_GOVERNORATES.includes(
      values.governorate as (typeof DELIVERY_GOVERNORATES)[number]
    )
  ) {
    errors.governorate = 'يرجى اختيار المحافظة (بني سويف أو الفيوم أو المنيا)';
  }

  if (values.address.trim().length < 3) {
    errors.address = 'يرجى كتابة المركز والقرية أو العنوان بالتفصيل';
  }

  if (values.cropType.trim().length < 2) {
    errors.cropType = 'يرجى كتابة نوع المحصول (مثل: طماطم، بطاطس، قمح)';
  }

  if (values.selectedProducts.length === 0) {
    errors.selectedProducts = 'يرجى اختيار منتج واحد على الأقل من القائمة';
  }

  if (values.quantity.trim().length < 1) {
    errors.quantity = 'يرجى تحديد الكمية المطلوبة (مثال: 2 عبوة أو 3 شيكارة)';
  }

  return errors;
}
