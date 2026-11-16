import {
  BRAND_NAME,
  COMPANY_LEGAL_NAME,
  DELIVERY_GOVERNORATES,
  FACEBOOK_PAGE_URL,
  PESTICIDE_LICENSE_NUMBER,
  PHONE_NUMBER,
  WHATSAPP_NUMBER,
  WORKING_HOURS,
} from '../config/siteConfig';
import { trackPixelEvent } from '../utils/pixel';
import { buildWhatsAppUrl } from '../utils/tracking';

export function Footer() {
  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    'السلام عليكم، أريد الاستفسار عن المبيدات والأسمدة المتوفرة.'
  );
  const hasFacebookUrl =
    Boolean(FACEBOOK_PAGE_URL) &&
    !FACEBOOK_PAGE_URL.includes('YOUR_FACEBOOK_PAGE');

  return (
    <footer className="border-t border-[#D6DFD0] bg-[#102619] pb-24 pt-12 text-[#E5EFE8] md:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-extrabold text-white">
              {BRAND_NAME}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#C2D3C8]">
              توريد المبيدات الزراعية والأسمدة الأصلية لمزارعي محافظات:{' '}
              {DELIVERY_GOVERNORATES.join(' · ')}.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[#A8BFB0]">
              {WORKING_HOURS}
            </p>
          </div>

          <div>
            <h2 className="font-display text-base font-bold text-white">
              تواصل معنا مباشرة
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li>
                <span className="text-[#A8BFB0]">رقم الهاتف: </span>
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  dir="ltr"
                  onClick={() =>
                    trackPixelEvent('Contact', { channel: 'footer_phone' })
                  }
                  className="font-bold text-white hover:underline underline-offset-4 tabular-nums"
                >
                  {PHONE_NUMBER}
                </a>
              </li>
              <li>
                <span className="text-[#A8BFB0]">واتساب المبيعات والاستشارات: </span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackPixelEvent('Contact', { channel: 'footer_whatsapp' })
                  }
                  className="font-bold text-[#86EFAC] hover:underline underline-offset-4"
                >
                  مراسلة عبر واتساب
                </a>
              </li>
              {hasFacebookUrl && (
                <li>
                  <span className="text-[#A8BFB0]">صفحة فيسبوك: </span>
                  <a
                    href={FACEBOOK_PAGE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-white hover:underline underline-offset-4"
                  >
                    زيارة صفحتنا على فيسبوك
                  </a>
                </li>
              )}
              <li>
                <span className="text-[#A8BFB0]">نطاق التوصيل: </span>
                <span>{DELIVERY_GOVERNORATES.join('، ')} فقط</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-base font-bold text-white">
              إرشادات السلامة والترخيص
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-[#C2D3C8]">
              جميع المنتجات أصلية ومختومة ويجب استخدامها طبقاً لتعليمات الملصق
              المرفق على العبوة؛ استشر المهندس الزراعي المختص لتحديد الجرعة
              المناسبة لمحصولك.
            </p>
            <div className="mt-4 space-y-1.5 border-t border-white/15 pt-3 text-xs text-[#C2D3C8]">
              <p>
                <span className="text-[#A8BFB0]">الكيان التجاري: </span>
                <span>{COMPANY_LEGAL_NAME}</span>
              </p>
              <p>
                <span className="text-[#A8BFB0]">رقم ترخيص تداول المبيدات: </span>
                <span>{PESTICIDE_LICENSE_NUMBER}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 text-center text-xs text-[#A8BFB0]">
          © {new Date().getFullYear()} {BRAND_NAME} — جميع الحقوق محفوظة. الدفع
          عند الاستلام في بني سويف والفيوم والمنيا.
        </div>
      </div>
    </footer>
  );
}
