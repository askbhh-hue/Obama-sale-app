import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import type { Product } from '../data/products';
import { trackPixelEvent } from '../utils/pixel';

export function ShareButton({ product }: { product: Product }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/offer/${product.slug}`;
    const text = [
      product.name,
      `المادة الفعالة: ${product.activeIngredient}`,
      `الاستخدامات: ${product.targetCropPest}`,
      `الفائدة: ${product.shortUsageNote}`,
      `العبوة: ${product.packSize}`,
      `للطلب والتفاصيل: ${url}`,
    ].join('\n');

    try {
      navigator.clipboard?.writeText(text).catch(() => {});
      setCopied(true);
      window.setTimeout(() => setCopied(false), 5000);
    } catch {
      // ignore
    }

    trackPixelEvent('Contact', { channel: 'share_facebook', product: product.name });

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-lg bg-[#1877F2] px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-[#166FE0] cursor-pointer"
      >
        {copied ? (
          <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
        ) : (
          <Share2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        <span>نشر المنتج على فيس بوك</span>
      </button>
      {copied && (
        <p className="mt-1.5 text-center text-xs font-bold text-[#14532D]">
          تم نسخ نص المنتج (من غير سعر). لو ما ظهرش في المنشور الصقه بنفسك.
        </p>
      )}
    </div>
  );
}
