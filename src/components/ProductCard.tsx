import { useState } from 'react';
import { Phone, MessageCircle, Info, ExternalLink, Sprout } from 'lucide-react';
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '../config/siteConfig';
import { CATEGORY_LABELS, type Product } from '../data/products';
import { trackPixelEvent } from '../utils/pixel';
import { buildOfferPath } from '../utils/router';
import { buildWhatsAppUrl } from '../utils/tracking';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onOpenOffer: (slug: string) => void;
}

export function ProductCard({
  product,
  onOpenDetails,
  onOpenOffer,
}: ProductCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const [variantIdx, setVariantIdx] = useState(0);

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

  const whatsappMessage = `السلام عليكم، أريد طلب المنتج التالي:\n- ${product.name}\n- العبوة: ${displayPackSize}${
    displayPrice !== null ? `\n- السعر المعلن: ${displayPrice} جنيه` : ''
  }\nيرجى تأكيد التوفر والتوصيل.`;
  const whatsappUrl = buildWhatsAppUrl(WHATSAPP_NUMBER, whatsappMessage);
  const offerPath = buildOfferPath(product.slug);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-[#D6DFD0] bg-white transition-transform duration-150 hover:-translate-y-0.5">
      {/* Uniform 4:3 product image */}
      <button
        type="button"
        onClick={() => onOpenDetails(product)}
        aria-label={`عرض تفاصيل ${product.name}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFF3EC] text-right cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532D]"
      >
        {!imgFailed ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#EFF3EC] p-4 text-[#14532D]">
            <Sprout className="h-10 w-10" aria-hidden="true" />
            <span className="text-sm font-bold text-center">{product.name}</span>
          </div>
        )}
      </button>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Clean unboxed metadata (Zero-pill discipline) */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#4A5D4F]">
          <span>{product.subCategory || CATEGORY_LABELS[product.category]}</span>
          <span aria-hidden="true">·</span>
          <span>العبوة: {displayPackSize}</span>
          {product.isBestSeller && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-bold text-[#9A3412]">الأكثر طلباً</span>
            </>
          )}
        </div>

        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-[#17201A]">
          {product.name}
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-[#425246]">
          {product.shortUsageNote}
        </p>

        {/* Optional multi-size selector when product has multiple pack sizes */}
        {product.variants && product.variants.length > 1 && (
          <div
            className="mt-3 flex flex-wrap gap-1.5"
            role="group"
            aria-label={`اختر حجم العبوة لـ ${product.name}`}
          >
            {product.variants.map((variant, idx) => {
              const active = idx === variantIdx;
              return (
                <button
                  key={variant.packSize}
                  type="button"
                  onClick={() => setVariantIdx(idx)}
                  aria-pressed={active}
                  className={`min-h-[32px] rounded-md border px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                    active
                      ? 'border-[#14532D] bg-[#14532D] text-white'
                      : 'border-[#D6DFD0] bg-[#F8F9F6] text-[#37483C] hover:border-[#14532D]'
                  }`}
                >
                  {variant.packSize}
                </button>
              );
            })}
          </div>
        )}

        {/* Price in EGP */}
        <div className="mt-4 flex items-baseline justify-between border-t border-[#E6ECE1] pt-3">
          <span className="text-xs font-medium text-[#4A5D4F]">السعر للعبوة</span>
          {displayPrice !== null ? (
            <p className="font-display text-xl font-extrabold text-[#14532D] tabular-nums">
              {displayPrice.toLocaleString('ar-EG')}{' '}
              <span className="text-sm font-bold">ج.م</span>
            </p>
          ) : (
            <p className="text-sm font-bold text-[#9A3412]">
              يُحدَّث السعر عند التأكيد
            </p>
          )}
        </div>

        {/* Primary conversion buttons: WhatsApp & Call Now */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackPixelEvent('Contact', {
                channel: 'whatsapp',
                product: product.name,
              })
            }
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-[#15803D] px-3 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#166534] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803D] whitespace-nowrap"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>اطلب على واتساب</span>
          </a>

          <a
            href={`tel:${PHONE_NUMBER}`}
            onClick={() =>
              trackPixelEvent('Contact', {
                channel: 'phone',
                product: product.name,
              })
            }
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-[#14532D] bg-white px-3 py-2.5 text-sm font-bold text-[#14532D] transition-colors hover:bg-[#EFF3EC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532D] whitespace-nowrap"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>اتصل الآن</span>
          </a>
        </div>

        {/* Secondary product info & dedicated ad landing route */}
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#EFF3EC] pt-3 text-xs font-bold">
          <button
            type="button"
            onClick={() => onOpenDetails(product)}
            className="inline-flex min-h-[36px] items-center gap-1 text-[#14532D] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
          >
            <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>التفاصيل والجرعة</span>
          </button>

          <a
            href={offerPath}
            onClick={(e) => {
              e.preventDefault();
              onOpenOffer(product.slug);
            }}
            className="inline-flex min-h-[36px] items-center gap-1 text-[#4A5D4F] hover:text-[#14532D] hover:underline underline-offset-4 whitespace-nowrap"
          >
            <span>رابط العرض</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
