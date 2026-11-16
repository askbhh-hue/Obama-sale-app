import { BRAND_NAME } from '../config/siteConfig';

interface HeaderProps {
  isOfferPage: boolean;
  onNavigateHome: () => void;
  onScrollToOrder: () => void;
}

export function Header({
  isOfferPage,
  onNavigateHome,
  onScrollToOrder,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#D6DFD0] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:gap-8 sm:px-6">
        {/* Zone 1: Single text brand wordmark */}
        <a
          href="/"
          onClick={(e) => {
            if (isOfferPage) {
              e.preventDefault();
              onNavigateHome();
            }
          }}
          className="font-display text-xl font-extrabold tracking-tight text-[#14532D] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D]"
        >
          {BRAND_NAME}
        </a>

        {/* Zone 2: Concise single-line nav links */}
        {!isOfferPage ? (
          <nav
            aria-label="التنقل الرئيسي"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#37483C]"
          >
            <a
              href="#best-sellers"
              className="hover:text-[#14532D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              الأكثر طلباً
            </a>
            <a
              href="#catalog"
              className="hover:text-[#14532D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              المنتجات
            </a>
            <a
              href="#how-to-order"
              className="hover:text-[#14532D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              طريقة الطلب
            </a>
            <a
              href="#faq"
              className="hover:text-[#14532D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              الأسئلة
            </a>
          </nav>
        ) : (
          <nav
            aria-label="التنقل الرئيسي"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#37483C]"
          >
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigateHome();
              }}
              className="hover:text-[#14532D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              كل المنتجات
            </a>
            <a
              href="#offer-specs"
              className="hover:text-[#14532D] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              الجرعة والمواصفات
            </a>
          </nav>
        )}

        {/* Zone 3: 1 primary CTA */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onScrollToOrder}
            className="min-h-[42px] rounded-lg bg-[#14532D] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#166534] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532D] whitespace-nowrap shrink-0 cursor-pointer"
          >
            اطلب الآن
          </button>
        </div>
      </div>
    </header>
  );
}
