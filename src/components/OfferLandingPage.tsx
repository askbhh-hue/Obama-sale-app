import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageCircle,
  Phone,
  ShieldAlert,
  Sprout,
  Truck,
} from 'lucide-react';
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '../config/siteConfig';
import { CATEGORY_LABELS, type Product } from '../data/products';
import { trackPixelEvent } from '../utils/pixel';
import type { AttributionParams } from '../utils/tracking';
import { buildWhatsAppUrl } from '../utils/tracking';
import { OrderForm } from './OrderForm';

interface OfferLandingPageProps {
  product: Product | undefined;
  allProducts: Product[];
  attribution: AttributionParams;
  onNavigateHome: () => void;
}

export function OfferLandingPage({
  product,
  allProducts,
  attribution,
  onNavigateHome,
}: OfferLandingPageProps) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
    if (product) {
      trackPixelEvent('ViewContent', {
        content_name: product.name,
        content_category: product.category,
        value: product.priceEgp ?? 0,
        currency: 'EGP',
      });
    }
  }, [product]);

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl font-extrabold text-[#17201A]">
          هذا العرض غير متاح حالياً
        </h1>
        <p className="mt-3 text-base text-[#425246]">
          يمكنك تصفح جميع المبيدات والأسمدة المتاحة في الكتالوج الرئيسي أو التواصل معنا
          مباشرة.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-[#14532D] px-6 py-3 text-base font-bold text-white hover:bg-[#166534] cursor-pointer"
          >
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
            <span>العودة للكتالوج الكامل</span>
          </button>
        </div>
      </main>
    );
  }

  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    `السلام عليكم، جاي من صفحة عرض المنتج:\n- ${product.name}\n- العبوة: ${product.packSize}\nأرجو تأكيد السعر والتوصيل.`
  );

  return (
    <main>
      {/* Breadcrumb back to full catalog */}
      <div className="border-b border-[#D6DFD0] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#14532D] hover:underline underline-offset-4 cursor-pointer"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            <span>العودة إلى كل المنتجات</span>
          </button>
          <span className="text-xs font-medium text-[#4A5D4F]">
            توصيل لبني سويف · الفيوم · المنيا
          </span>
        </div>
      </div>

      {/* Dedicated Product Offer Hero */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#D6DFD0] bg-[#EFF3EC]">
              {!imgFailed ? (
                <img
                  src={product.image}
                  alt={product.name}
                  fetchPriority="high"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#14532D]">
                  <Sprout className="h-14 w-14" aria-hidden="true" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="text-sm font-bold text-[#15803D]">
              {CATEGORY_LABELS[product.category]} · {product.packSize} · الدفع عند
              الاستلام
            </p>

            <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight text-[#17201A] sm:text-4xl [text-wrap:balance]">
              {product.name}
            </h1>

            {product.offerHeadline && (
              <p className="mt-3 text-base font-medium leading-relaxed text-[#37483C]">
                {product.offerHeadline}
              </p>
            )}

            <p className="mt-2 text-base leading-relaxed text-[#425246]">
              {product.shortUsageNote}
            </p>

            <div className="mt-6 flex flex-wrap items-baseline gap-3 border-y border-[#D6DFD0] py-4">
              {product.priceEgp !== null ? (
                <p className="font-display text-3xl font-extrabold text-[#14532D] tabular-nums">
                  {product.priceEgp.toLocaleString('ar-EG')}{' '}
                  <span className="text-lg font-bold">جنيه مصري</span>
                </p>
              ) : (
                <p className="text-lg font-bold text-[#9A3412]">
                  يُحدَّث السعر من البروشور
                </p>
              )}
              <span className="text-sm text-[#4A5D4F]">
                / {product.packSize}
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href="#offer-order-form"
                className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-3.5 text-base font-extrabold text-white transition-colors hover:bg-[#166534] sm:w-fit whitespace-nowrap"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>اطلب العرض الآن (الدفع عند الاستلام)</span>
              </a>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:w-fit">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackPixelEvent('Contact', {
                      channel: 'whatsapp_offer_hero',
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
                      channel: 'phone_offer_hero',
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

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-bold text-[#37483C]">
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-[#14532D]" aria-hidden="true" />
                توصيل مباشر لبني سويف والفيوم والمنيا
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section
        id="offer-specs"
        className="scroll-mt-20 border-y border-[#D6DFD0] bg-white py-10 sm:py-12"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-extrabold text-[#17201A]">
            المواصفات الفنية والجرعة الموصى بها
          </h2>

          <dl className="mt-5 divide-y divide-[#E6ECE1] rounded-2xl border border-[#D6DFD0] bg-[#F8F9F6]">
            <div className="p-4 sm:p-5">
              <dt className="text-xs font-bold text-[#4A5D4F]">المادة الفعالة</dt>
              <dd className="mt-1 text-base font-bold text-[#17201A]">
                {product.activeIngredient}
              </dd>
            </div>
            <div className="p-4 sm:p-5">
              <dt className="text-xs font-bold text-[#4A5D4F]">
                المحاصيل والآفات المستهدفة
              </dt>
              <dd className="mt-1 text-base text-[#17201A]">
                {product.targetCropPest}
              </dd>
            </div>
            <div className="p-4 sm:p-5">
              <dt className="text-xs font-bold text-[#4A5D4F]">الجرعة</dt>
              <dd className="mt-1 text-base font-bold text-[#14532D]">
                {product.dose}
              </dd>
            </div>
            <div className="p-4 sm:p-5">
              <dt className="text-xs font-bold text-[#4A5D4F]">طريقة الاستخدام</dt>
              <dd className="mt-1 text-base leading-relaxed text-[#17201A]">
                {product.applicationMethod}
              </dd>
            </div>

            {product.preHarvestInterval && (
              <div className="flex items-start gap-3 p-4 sm:p-5">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-[#14532D]" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-bold text-[#4A5D4F]">
                    فترة ما قبل الحصاد (PHI)
                  </dt>
                  <dd className="mt-1 text-base font-bold text-[#17201A]">
                    {product.preHarvestInterval}
                  </dd>
                </div>
              </div>
            )}

            {product.safetyWarnings && (
              <div className="flex items-start gap-3 bg-[#FEF3C7]/40 p-4 sm:p-5">
                <ShieldAlert
                  className="mt-1 h-5 w-5 shrink-0 text-[#9A3412]"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs font-bold text-[#9A3412]">
                    تحذيرات الأمان والاستخدام
                  </dt>
                  <dd className="mt-1 text-base leading-relaxed text-[#17201A]">
                    {product.safetyWarnings}
                  </dd>
                </div>
              </div>
            )}
          </dl>
        </div>
      </section>

      {/* Pre-selected Lead Form */}
      <section
        id="offer-order-form"
        className="scroll-mt-20 mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14"
      >
        <div className="mb-6">
          <h2 className="font-display text-2xl font-extrabold text-[#17201A] sm:text-3xl">
            سجّل طلبك الآن — الدفع عند الاستلام
          </h2>
          <p className="mt-2 text-base text-[#425246]">
            اخترنا لك المنتج تلقائياً في النموذج، أكمل بيانات قريتك ومحصولك وسنتواصل معك
            فوراً.
          </p>
        </div>

        <OrderForm
          products={allProducts}
          preselectedProductNames={[product.name]}
          attribution={attribution}
        />
      </section>
    </main>
  );
}
