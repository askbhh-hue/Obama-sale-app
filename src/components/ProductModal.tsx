import { useEffect, useState } from 'react';
import {
  X,
  MessageCircle,
  Phone,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Sprout,
} from 'lucide-react';
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '../config/siteConfig';
import { CATEGORY_LABELS, type Product } from '../data/products';
import { trackPixelEvent } from '../utils/pixel';
import { buildWhatsAppUrl } from '../utils/tracking';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onOrderProduct: (productName: string) => void;
}

export function ProductModal({
  product,
  onClose,
  onOrderProduct,
}: ProductModalProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const [variantIdx, setVariantIdx] = useState(0);

  useEffect(() => {
    setImgFailed(false);
    setVariantIdx(0);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;

    trackPixelEvent('ViewContent', {
      content_name: product.name,
      content_category: product.category,
      value: product.priceEgp ?? 0,
      currency: 'EGP',
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const activeVariant =
    product.variants && product.variants.length > 0
      ? product.variants[variantIdx] ?? product.variants[0]
      : null;

  const displayPackSize = activeVariant
    ? activeVariant.packSize
    : product.packSize;
  const displayPrice = activeVariant
    ? activeVariant.priceEgp
    : product.priceEgp;

  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    `السلام عليكم، أريد الاستفسار وطلب المنتج:\n- ${product.name}\n- العبوة: ${displayPackSize}${
      displayPrice !== null ? `\n- السعر: ${displayPrice} جنيه` : ''
    }`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#D6DFD0] bg-white px-5 py-4">
          <div className="text-xs font-medium text-[#4A5D4F]">
            <span>{product.subCategory || CATEGORY_LABELS[product.category]}</span>
            <span aria-hidden="true"> · </span>
            <span>{displayPackSize}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق تفاصيل المنتج"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#D6DFD0] text-[#17201A] hover:bg-[#EFF3EC] cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-[200px_1fr] sm:items-start">
            <div className="aspect-[4/3] overflow-hidden rounded-xl border border-[#D6DFD0] bg-[#EFF3EC]">
              {!imgFailed ? (
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#14532D]">
                  <Sprout className="h-10 w-10" aria-hidden="true" />
                </div>
              )}
            </div>

            <div>
              <h2
                id="product-modal-title"
                className="font-display text-2xl font-extrabold leading-snug text-[#17201A]"
              >
                {product.name}
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-[#425246]">
                {product.shortUsageNote}
              </p>

              {product.variants && product.variants.length > 1 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.variants.map((variant, idx) => {
                    const active = idx === variantIdx;
                    return (
                      <button
                        key={variant.packSize}
                        type="button"
                        onClick={() => setVariantIdx(idx)}
                        className={`min-h-[36px] rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                          active
                            ? 'border-[#14532D] bg-[#14532D] text-white'
                            : 'border-[#D6DFD0] bg-[#F8F9F6] text-[#17201A] hover:border-[#14532D]'
                        }`}
                      >
                        {variant.packSize} — {variant.priceEgp} ج.م
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 flex items-baseline gap-2">
                {displayPrice !== null ? (
                  <p className="font-display text-2xl font-extrabold text-[#14532D] tabular-nums">
                    {displayPrice.toLocaleString('ar-EG')} ج.م
                  </p>
                ) : (
                  <p className="text-base font-bold text-[#9A3412]">
                    السعر يُحدَّث عند التأكيد
                  </p>
                )}
                <span className="text-xs text-[#4A5D4F]">
                  / {displayPackSize} (الدفع عند الاستلام)
                </span>
              </div>
            </div>
          </div>

          {/* Technical agronomic details */}
          <dl className="mt-6 divide-y divide-[#E6ECE1] rounded-xl border border-[#D6DFD0] bg-[#F8F9F6]">
            <div className="p-4">
              <dt className="text-xs font-bold text-[#4A5D4F]">المادة الفعالة / التركيب</dt>
              <dd className="mt-1 text-sm font-medium text-[#17201A]">
                {product.activeIngredient}
              </dd>
            </div>

            <div className="p-4">
              <dt className="text-xs font-bold text-[#4A5D4F]">
                المحاصيل والآفات / الاستخدام المستهدف
              </dt>
              <dd className="mt-1 text-sm font-medium text-[#17201A]">
                {product.targetCropPest}
              </dd>
            </div>

            <div className="p-4">
              <dt className="text-xs font-bold text-[#4A5D4F]">الجرعة الموصى بها</dt>
              <dd className="mt-1 text-sm font-bold text-[#14532D]">
                {product.dose}
              </dd>
            </div>

            <div className="p-4">
              <dt className="text-xs font-bold text-[#4A5D4F]">طريقة الاستخدام والتطبيق</dt>
              <dd className="mt-1 text-sm leading-relaxed text-[#17201A]">
                {product.applicationMethod}
              </dd>
            </div>

            {/* Conditionally shown ONLY if present in brochure/JSON */}
            {product.preHarvestInterval && (
              <div className="flex items-start gap-2.5 p-4">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#14532D]" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-bold text-[#4A5D4F]">
                    فترة ما قبل الحصاد (PHI)
                  </dt>
                  <dd className="mt-1 text-sm font-bold text-[#17201A]">
                    {product.preHarvestInterval}
                  </dd>
                </div>
              </div>
            )}

            {product.safetyWarnings && (
              <div className="flex items-start gap-2.5 bg-[#FEF3C7]/40 p-4">
                <ShieldAlert
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#9A3412]"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs font-bold text-[#9A3412]">
                    تحذيرات الأمان والاستخدام
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-[#17201A]">
                    {product.safetyWarnings}
                  </dd>
                </div>
              </div>
            )}
          </dl>

          {/* CTA buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onOrderProduct(product.name)}
              className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3 text-base font-bold text-white transition-colors hover:bg-[#166534] cursor-pointer whitespace-nowrap"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>سجّل طلب لهذا المنتج</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackPixelEvent('Contact', {
                  channel: 'whatsapp_modal',
                  product: product.name,
                })
              }
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#15803D] px-5 py-3 text-base font-bold text-white transition-colors hover:bg-[#166534] whitespace-nowrap"
            >
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>اطلب على واتساب</span>
            </a>

            <a
              href={`tel:${PHONE_NUMBER}`}
              onClick={() =>
                trackPixelEvent('Contact', {
                  channel: 'phone_modal',
                  product: product.name,
                })
              }
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#14532D] bg-white px-5 py-3 text-base font-bold text-[#14532D] transition-colors hover:bg-[#EFF3EC] whitespace-nowrap"
            >
              <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>اتصل الآن</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
