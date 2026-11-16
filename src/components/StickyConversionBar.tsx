import { MessageCircle, Phone } from 'lucide-react';
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '../config/siteConfig';
import { trackPixelEvent } from '../utils/pixel';
import { buildWhatsAppUrl } from '../utils/tracking';

export function StickyConversionBar() {
  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    'السلام عليكم، أريد الاستفسار عن أسعار المبيدات والأسمدة والتوصيل.'
  );

  return (
    <>
      {/* Desktop floating WhatsApp button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackPixelEvent('Contact', { channel: 'floating_whatsapp_desktop' })
        }
        aria-label="تواصل معنا عبر واتساب"
        className="fixed bottom-6 left-6 z-40 hidden md:inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#15803D] px-5 py-3 text-sm font-extrabold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-[#166534] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803D]"
      >
        <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span>واتساب المبيعات</span>
      </a>

      {/* Mobile sticky bottom conversion bar (<= 15% viewport height: 56px) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#D6DFD0] bg-white md:hidden">
        <div className="grid h-14 grid-cols-2 divide-x divide-x-reverse divide-[#D6DFD0]">
          <a
            href={`tel:${PHONE_NUMBER}`}
            onClick={() =>
              trackPixelEvent('Contact', { channel: 'sticky_call_mobile' })
            }
            className="inline-flex h-full items-center justify-center gap-2 bg-[#14532D] text-sm font-extrabold text-white active:bg-[#166534]"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>اتصل الآن</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackPixelEvent('Contact', { channel: 'sticky_whatsapp_mobile' })
            }
            className="inline-flex h-full items-center justify-center gap-2 bg-[#15803D] text-sm font-extrabold text-white active:bg-[#166534]"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>اطلب على واتساب</span>
          </a>
        </div>
      </div>
    </>
  );
}
