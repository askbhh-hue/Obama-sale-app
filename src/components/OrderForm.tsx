import { useEffect, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Phone,
  RotateCcw,
} from 'lucide-react';
import {
  DELIVERY_GOVERNORATES,
  PHONE_NUMBER,
} from '../config/siteConfig';
import type { Product } from '../data/products';
import { submitLeadOrder, type LeadSubmissionResult } from '../utils/leadSubmit';
import { trackPixelEvent } from '../utils/pixel';
import type { AttributionParams } from '../utils/tracking';
import {
  validateOrderForm,
  type OrderFormErrors,
  type OrderFormValues,
} from '../utils/validation';

interface OrderFormProps {
  products: Product[];
  preselectedProductNames?: string[];
  attribution: AttributionParams;
}

const CONSULTATION_OPTION = 'استشارة مهندس زراعي لاختيار المنتج المناسب';

export function OrderForm({
  products,
  preselectedProductNames = [],
  attribution,
}: OrderFormProps) {
  const [values, setValues] = useState<OrderFormValues>({
    fullName: '',
    phone: '',
    email: '',
    governorate: '',
    address: '',
    cropType: '',
    selectedProducts: preselectedProductNames,
    quantity: '',
    notes: '',
  });

  const [errors, setErrors] = useState<OrderFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] =
    useState<LeadSubmissionResult | null>(null);

  useEffect(() => {
    if (preselectedProductNames.length > 0) {
      setValues((prev) => ({
        ...prev,
        selectedProducts: Array.from(
          new Set([...prev.selectedProducts, ...preselectedProductNames])
        ),
      }));
      setErrors((prev) => ({ ...prev, selectedProducts: undefined }));
    }
  }, [preselectedProductNames]);

  const toggleProduct = (productName: string) => {
    setValues((prev) => {
      const exists = prev.selectedProducts.includes(productName);
      const next = exists
        ? prev.selectedProducts.filter((name) => name !== productName)
        : [...prev.selectedProducts, productName];
      return { ...prev, selectedProducts: next };
    });
    setErrors((prev) => ({ ...prev, selectedProducts: undefined }));
  };

  const handleFieldChange = (
    field: keyof OrderFormValues,
    value: string
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateOrderForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitLeadOrder(
        values,
        attribution,
        typeof window !== 'undefined' ? window.location.href : ''
      );
      setSubmittedResult(result);

      // Trigger WhatsApp via clean anchor link (avoids window.open popup blocks)
      const anchor = document.createElement('a');
      anchor.href = result.whatsappUrl;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedResult(null);
    setValues({
      fullName: '',
      phone: '',
      email: '',
      governorate: '',
      address: '',
      cropType: '',
      selectedProducts: preselectedProductNames,
      quantity: '',
      notes: '',
    });
    setErrors({});
  };

  if (submittedResult) {
    return (
      <div
        id="order-thank-you"
        className="rounded-2xl border border-[#15803D]/30 bg-white p-6 sm:p-8"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2
            className="mt-1 h-8 w-8 shrink-0 text-[#15803D]"
            aria-hidden="true"
          />
          <div>
            <h3 className="font-display text-2xl font-extrabold text-[#14532D]">
              تم استلام طلبك بنجاح!
            </h3>
            <p className="mt-2 text-base leading-relaxed text-[#37483C]">
              شكراً لك يا حاج <span className="font-bold">{values.fullName}</span>.
              تم تسجيل طلبك لمحافظة{' '}
              <span className="font-bold">{values.governorate}</span> وسيتواصل معك
              المهندس المختص لتأكيد الجرعة وموعد التوصيل (الدفع عند الاستلام).
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[#D6DFD0] bg-[#F8F9F6] p-4 text-sm text-[#17201A]">
          <p className="font-bold text-[#14532D]">ملخص الطلب المسجل:</p>
          <ul className="mt-2 space-y-1.5 leading-relaxed">
            <li>رقم الموبايل: {values.phone}</li>
            <li>
              العنوان: {values.governorate} - {values.address}
            </li>
            <li>المحصول: {values.cropType}</li>
            <li>المنتجات: {values.selectedProducts.join('، ')}</li>
            <li>الكمية: {values.quantity}</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={submittedResult.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackPixelEvent('Contact', { channel: 'whatsapp_thank_you' })
            }
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#15803D] px-5 py-3 text-base font-bold text-white transition-colors hover:bg-[#166534]"
          >
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>أرسل الطلب الآن على واتساب</span>
          </a>

          <a
            href={`tel:${PHONE_NUMBER}`}
            onClick={() =>
              trackPixelEvent('Contact', { channel: 'phone_thank_you' })
            }
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#14532D] bg-white px-5 py-3 text-base font-bold text-[#14532D] transition-colors hover:bg-[#EFF3EC]"
          >
            <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>اتصل بنا مباشرة</span>
          </a>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#D6DFD0] bg-[#F8F9F6] px-4 py-3 text-sm font-bold text-[#37483C] transition-colors hover:bg-[#EFF3EC] cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>طلب جديد</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-[#D6DFD0] bg-white p-5 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label
            htmlFor="order-fullName"
            className="block text-sm font-bold text-[#17201A]"
          >
            الاسم الكامل <span className="text-[#9A3412]">*</span>
          </label>
          <input
            id="order-fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            placeholder="مثال: أحمد محمد عبد الله"
            value={values.fullName}
            onChange={(e) => handleFieldChange('fullName', e.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[#C6D3BE] bg-[#F8F9F6] px-4 py-2.5 text-base text-[#17201A] placeholder:text-[#6B7C6F] focus:border-[#14532D] focus:bg-white focus:outline-none"
          />
          {errors.fullName && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#9A3412]">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* Egyptian Mobile */}
        <div>
          <label
            htmlFor="order-phone"
            className="block text-sm font-bold text-[#17201A]"
          >
            رقم الموبايل (عليه واتساب إن أمكن){' '}
            <span className="text-[#9A3412]">*</span>
          </label>
          <input
            id="order-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            dir="ltr"
            autoComplete="tel"
            required
            placeholder="01012345678"
            value={values.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[#C6D3BE] bg-[#F8F9F6] px-4 py-2.5 text-right text-base text-[#17201A] placeholder:text-[#6B7C6F] focus:border-[#14532D] focus:bg-white focus:outline-none tabular-nums"
          />
          {errors.phone && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#9A3412]">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        {/* Governorate */}
        <div>
          <label
            htmlFor="order-governorate"
            className="block text-sm font-bold text-[#17201A]"
          >
            المحافظة (نطاق التوصيل المتاح){' '}
            <span className="text-[#9A3412]">*</span>
          </label>
          <select
            id="order-governorate"
            name="governorate"
            required
            value={values.governorate}
            onChange={(e) => handleFieldChange('governorate', e.target.value)}
            aria-invalid={Boolean(errors.governorate)}
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[#C6D3BE] bg-[#F8F9F6] px-4 py-2.5 text-base text-[#17201A] focus:border-[#14532D] focus:bg-white focus:outline-none"
          >
            <option value="">اختر المحافظة...</option>
            {DELIVERY_GOVERNORATES.map((gov) => (
              <option key={gov} value={gov}>
                {gov}
              </option>
            ))}
          </select>
          {errors.governorate && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#9A3412]">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{errors.governorate}</span>
            </p>
          )}
        </div>

        {/* Village / Address */}
        <div>
          <label
            htmlFor="order-address"
            className="block text-sm font-bold text-[#17201A]"
          >
            المركز والقرية / العنوان <span className="text-[#9A3412]">*</span>
          </label>
          <input
            id="order-address"
            name="address"
            type="text"
            required
            placeholder="مثال: مركز ببا - قرية سدس"
            value={values.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            aria-invalid={Boolean(errors.address)}
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[#C6D3BE] bg-[#F8F9F6] px-4 py-2.5 text-base text-[#17201A] placeholder:text-[#6B7C6F] focus:border-[#14532D] focus:bg-white focus:outline-none"
          />
          {errors.address && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#9A3412]">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{errors.address}</span>
            </p>
          )}
        </div>

        {/* Crop Type */}
        <div>
          <label
            htmlFor="order-cropType"
            className="block text-sm font-bold text-[#17201A]"
          >
            نوع المحصول <span className="text-[#9A3412]">*</span>
          </label>
          <input
            id="order-cropType"
            name="cropType"
            type="text"
            required
            placeholder="مثال: طماطم، بطاطس، قمح، بصل، بنجر"
            value={values.cropType}
            onChange={(e) => handleFieldChange('cropType', e.target.value)}
            aria-invalid={Boolean(errors.cropType)}
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[#C6D3BE] bg-[#F8F9F6] px-4 py-2.5 text-base text-[#17201A] placeholder:text-[#6B7C6F] focus:border-[#14532D] focus:bg-white focus:outline-none"
          />
          {errors.cropType && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#9A3412]">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{errors.cropType}</span>
            </p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label
            htmlFor="order-quantity"
            className="block text-sm font-bold text-[#17201A]"
          >
            الكمية المطلوبة أو المساحة بالفدان{' '}
            <span className="text-[#9A3412]">*</span>
          </label>
          <input
            id="order-quantity"
            name="quantity"
            type="text"
            required
            placeholder="مثال: 3 عبوات أو يكفي 5 فدان"
            value={values.quantity}
            onChange={(e) => handleFieldChange('quantity', e.target.value)}
            aria-invalid={Boolean(errors.quantity)}
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[#C6D3BE] bg-[#F8F9F6] px-4 py-2.5 text-base text-[#17201A] placeholder:text-[#6B7C6F] focus:border-[#14532D] focus:bg-white focus:outline-none"
          />
          {errors.quantity && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#9A3412]">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{errors.quantity}</span>
            </p>
          )}
        </div>
      </div>

      {/* Multi-select Product Interest */}
      <fieldset className="mt-6">
        <legend className="text-sm font-bold text-[#17201A]">
          اختر المنتجات المطلوبة (يمكنك اختيار أكثر من منتج){' '}
          <span className="text-[#9A3412]">*</span>
        </legend>
        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
          {products.map((product) => {
            const checked = values.selectedProducts.includes(product.name);
            return (
              <label
                key={product.id}
                className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                  checked
                    ? 'border-[#14532D] bg-[#EFF3EC] font-bold text-[#14532D]'
                    : 'border-[#D6DFD0] bg-[#F8F9F6] text-[#17201A] hover:bg-[#EFF3EC]/60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleProduct(product.name)}
                  className="h-5 w-5 accent-[#14532D] shrink-0"
                />
                <span className="flex-1 leading-snug">{product.name}</span>
                {product.priceEgp !== null && (
                  <span className="text-xs font-bold text-[#4A5D4F] tabular-nums shrink-0">
                    {product.priceEgp} ج.م
                  </span>
                )}
              </label>
            );
          })}

          <label
            className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm sm:col-span-2 transition-colors ${
              values.selectedProducts.includes(CONSULTATION_OPTION)
                ? 'border-[#14532D] bg-[#EFF3EC] font-bold text-[#14532D]'
                : 'border-[#D6DFD0] bg-[#F8F9F6] text-[#17201A] hover:bg-[#EFF3EC]/60'
            }`}
          >
            <input
              type="checkbox"
              checked={values.selectedProducts.includes(CONSULTATION_OPTION)}
              onChange={() => toggleProduct(CONSULTATION_OPTION)}
              className="h-5 w-5 accent-[#14532D] shrink-0"
            />
            <span>{CONSULTATION_OPTION}</span>
          </label>
        </div>
        {errors.selectedProducts && (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#9A3412]">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{errors.selectedProducts}</span>
          </p>
        )}
      </fieldset>

      {/* Optional Email + Notes */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="order-email"
            className="block text-sm font-bold text-[#17201A]"
          >
            البريد الإلكتروني (اختياري)
          </label>
          <input
            id="order-email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder="name@example.com"
            value={values.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            aria-invalid={Boolean(errors.email)}
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[#C6D3BE] bg-[#F8F9F6] px-4 py-2.5 text-right text-base text-[#17201A] placeholder:text-[#6B7C6F] focus:border-[#14532D] focus:bg-white focus:outline-none"
          />
          {errors.email && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#9A3412]">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="order-notes"
            className="block text-sm font-bold text-[#17201A]"
          >
            ملاحظات أو وصف الإصابة (اختياري)
          </label>
          <input
            id="order-notes"
            name="notes"
            type="text"
            placeholder="مثال: ميعاد التوصيل المناسب أو سؤال عن الجرعة"
            value={values.notes}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[#C6D3BE] bg-[#F8F9F6] px-4 py-2.5 text-base text-[#17201A] placeholder:text-[#6B7C6F] focus:border-[#14532D] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-3.5 text-lg font-extrabold text-white transition-colors hover:bg-[#166534] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin shrink-0" aria-hidden="true" />
              <span>جاري تسجيل الطلب وفتح واتساب...</span>
            </>
          ) : (
            <span>تأكيد الطلب وإرساله عبر واتساب</span>
          )}
        </button>
        <p className="mt-2.5 text-center text-xs text-[#4A5D4F]">
          لا يوجد دفع إلكتروني — الدفع نقداً عند الاستلام بعد فحص العبوات الأصلية.
        </p>
      </div>
    </form>
  );
}
