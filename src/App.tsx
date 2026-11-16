import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Sprout,
  Truck,
  UserCheck,
  Wallet,
} from 'lucide-react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { OfferLandingPage } from './components/OfferLandingPage';
import { OrderForm } from './components/OrderForm';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { StickyConversionBar } from './components/StickyConversionBar';
import {
  DELIVERY_GOVERNORATES,
  HERO_IMAGE_URL,
  PHONE_NUMBER,
  WHATSAPP_NUMBER,
} from './config/siteConfig';
import { PRODUCTS, type Product } from './data/products';
import { filterProducts, findProductBySlug, type CatalogFilterCategory } from './utils/catalog';
import { initFacebookPixel, trackPixelEvent } from './utils/pixel';
import { buildOfferPath, parseOfferSlugFromPath } from './utils/router';
import {
  buildWhatsAppUrl,
  captureAndGetAttribution,
  EMPTY_ATTRIBUTION,
  type AttributionParams,
} from './utils/tracking';

const FAQ_ITEMS = [
  {
    q: 'ما هي المحافظات التي يصل إليها التوصيل؟',
    a: 'نوفر خدمة التوصيل المباشر لمراكز وقرى محافظات بني سويف والفيوم والمنيا فقط لضمان سرعة الوصول وجودة المتابعة.',
  },
  {
    q: 'هل الدفع مقدم أم عند الاستلام؟',
    a: 'الدفع نقداً عند الاستلام بعد فحص العبوات والتأكد من أنها أصلية ومختومة وسارية الصلاحية، كما يمكنك التنسيق معنا عبر واتساب أو الهاتف.',
  },
  {
    q: 'كيف أعرف الجرعة المناسبة لمحصولي؟',
    a: 'بعد تسجيل طلبك أو عند الاتصال بنا، يراجع معك مهندس زراعي حالة المحصول والمساحة بالفدان ويحدد لك الجرعة وميعاد الرش المناسبين.',
  },
  {
    q: 'هل المنتجات أصلية ومضمونة؟',
    a: 'نعم، جميع المبيدات والأسمدة أصلية ومن مصادر معتمدة ومختومة ببيانات الشركة وتاريخ الإنتاج والانتهاء.',
  },
];

export default function App() {
  const [pathname, setPathname] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [attribution, setAttribution] =
    useState<AttributionParams>(EMPTY_ATTRIBUTION);

  const [category, setCategory] = useState<CatalogFilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalProduct, setSelectedModalProduct] =
    useState<Product | null>(null);
  const [preselectedOrderProducts, setPreselectedOrderProducts] = useState<
    string[]
  >([]);
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  useEffect(() => {
    setAttribution(captureAndGetAttribution());
    initFacebookPixel();
    trackPixelEvent('PageView');

    const onPopState = () => {
      setPathname(window.location.pathname);
      setAttribution(captureAndGetAttribution());
      trackPixelEvent('PageView');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const offerSlug = useMemo(() => parseOfferSlugFromPath(pathname), [pathname]);
  const activeOfferProduct = useMemo(
    () => (offerSlug ? findProductBySlug(PRODUCTS, offerSlug) : undefined),
    [offerSlug]
  );

  const navigateTo = useCallback((nextPath: string) => {
    if (typeof window === 'undefined') return;
    const search = window.location.search;
    window.history.pushState({}, '', `${nextPath}${search}`);
    setPathname(nextPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackPixelEvent('PageView');
  }, []);

  const handleOpenOffer = useCallback(
    (slug: string) => {
      navigateTo(buildOfferPath(slug));
    },
    [navigateTo]
  );

  const handleNavigateHome = useCallback(() => {
    navigateTo('/');
  }, [navigateTo]);

  const scrollToOrderSection = useCallback(() => {
    const targetId = offerSlug ? 'offer-order-form' : 'order-form';
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [offerSlug]);

  const handleOrderProductFromModal = useCallback((productName: string) => {
    setPreselectedOrderProducts((prev) =>
      prev.includes(productName) ? prev : [...prev, productName]
    );
    setSelectedModalProduct(null);
    setTimeout(() => {
      document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  }, []);

  const bestSellers = useMemo(
    () => PRODUCTS.filter((p) => p.isBestSeller),
    []
  );

  const filteredProducts = useMemo(
    () => filterProducts(PRODUCTS, category, searchQuery),
    [category, searchQuery]
  );

  const counts = useMemo(
    () => ({
      all: PRODUCTS.length,
      pesticides: PRODUCTS.filter((p) => p.category === 'pesticides').length,
      fertilizers: PRODUCTS.filter((p) => p.category === 'fertilizers').length,
    }),
    []
  );

  const heroWhatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    'السلام عليكم، أريد طلب مبيدات/أسمدة أو استشارة مهندس زراعي لمحصولي.'
  );

  return (
    <div className="min-h-screen bg-[#F8F9F6] text-[#17201A]">
      <Header
        isOfferPage={Boolean(offerSlug)}
        onNavigateHome={handleNavigateHome}
        onScrollToOrder={scrollToOrderSection}
      />

      {offerSlug ? (
        <OfferLandingPage
          product={activeOfferProduct}
          allProducts={PRODUCTS}
          attribution={attribution}
          onNavigateHome={handleNavigateHome}
        />
      ) : (
        <main>
          {/* 1. Hero Section */}
          <section className="border-b border-[#D6DFD0] bg-white">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
                <div className="flex flex-col justify-center lg:col-span-6">
                  <p className="text-sm font-bold text-[#15803D]">
                    حصرياً لمزارعي {DELIVERY_GOVERNORATES.join(' · ')}
                  </p>

                  <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-[#17201A] sm:text-4xl lg:text-[2.65rem] [text-wrap:balance]">
                    مبيدات وأسمدة أصلية تصلك لباب أرضك مع الدفع عند الاستلام
                  </h1>

                  <p className="mt-4 text-base leading-relaxed text-[#425246] sm:text-lg">
                    احمِ محصولك من الآفات والأمراض وزد إنتاجية الفدان بمنتجات
                    أصلية مختومة وإرشاد مجاني من مهندس زراعي قبل الرش أو التسميد.
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    <a
                      href="#order-form"
                      className="inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[#14532D] px-6 py-3.5 text-base font-extrabold text-white transition-colors hover:bg-[#166534] sm:w-fit whitespace-nowrap"
                    >
                      سجّل طلبك الآن (الدفع عند الاستلام)
                    </a>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:w-fit">
                      <a
                        href={heroWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackPixelEvent('Contact', { channel: 'hero_whatsapp' })
                        }
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#15803D] px-5 py-3 text-base font-bold text-white transition-colors hover:bg-[#166534] whitespace-nowrap"
                      >
                        <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                        <span>اطلب على واتساب</span>
                      </a>

                      <a
                        href={`tel:${PHONE_NUMBER}`}
                        onClick={() =>
                          trackPixelEvent('Contact', { channel: 'hero_phone' })
                        }
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#14532D] bg-white px-5 py-3 text-base font-bold text-[#14532D] transition-colors hover:bg-[#EFF3EC] whitespace-nowrap"
                      >
                        <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
                        <span>اتصل الآن</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#D6DFD0] bg-[#EFF3EC]">
                    {!heroImgFailed ? (
                      <img
                        src={HERO_IMAGE_URL}
                        alt="حقول خضراء مزروعة في صعيد مصر"
                        fetchPriority="high"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() => setHeroImgFailed(true)}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#EFF3EC] text-[#14532D]">
                        <Sprout className="h-16 w-16" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 4-column trust bar directly below hero split */}
              <div className="mt-8 grid grid-cols-2 gap-3 border-t border-[#E6ECE1] pt-6 sm:grid-cols-4 sm:gap-4">
                <div className="flex items-center gap-2.5 text-sm font-bold text-[#17201A]">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-[#15803D]" aria-hidden="true" />
                  <span>منتجات أصلية مضمونة</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-bold text-[#17201A]">
                  <Truck className="h-5 w-5 shrink-0 text-[#15803D]" aria-hidden="true" />
                  <span>توصيل لبني سويف والفيوم والمنيا</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-bold text-[#17201A]">
                  <UserCheck className="h-5 w-5 shrink-0 text-[#15803D]" aria-hidden="true" />
                  <span>متابعة مهندس زراعي</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-bold text-[#17201A]">
                  <Wallet className="h-5 w-5 shrink-0 text-[#15803D]" aria-hidden="true" />
                  <span>الدفع نقداً عند الاستلام</span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Best-Selling Products */}
          <section
            id="best-sellers"
            className="scroll-mt-20 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
          >
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-[#17201A] sm:text-3xl">
                  الأكثر طلباً هذا الموسم
                </h2>
                <p className="mt-1.5 text-base text-[#425246]">
                  أشهر المبيدات والأسمدة التي يعتمد عليها مزارعو الصعيد في العروة
                  الحالية.
                </p>
              </div>
              <a
                href="#catalog"
                className="text-sm font-bold text-[#14532D] hover:underline underline-offset-4 whitespace-nowrap"
              >
                عرض الكتالوج بالكامل
              </a>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bestSellers.map((product) => (
                <ProductCard
                  key={`best-${product.id}`}
                  product={product}
                  onOpenDetails={setSelectedModalProduct}
                  onOpenOffer={handleOpenOffer}
                />
              ))}
            </div>
          </section>

          {/* 3. Full Product Catalog with Tabs & Search */}
          <section
            id="catalog"
            className="scroll-mt-20 border-y border-[#D6DFD0] bg-white py-10 sm:py-14"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="font-display text-2xl font-extrabold text-[#17201A] sm:text-3xl">
                    كتالوج المبيدات والأسمدة
                  </h2>
                  <p className="mt-1.5 text-base text-[#425246]">
                    تصفح المنتجات حسب القسم أو ابحث باسم المحصول والآفة لمعرفة السعر
                    والجرعة.
                  </p>
                </div>

                {/* Filter tabs & search */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div
                    role="tablist"
                    aria-label="تصنيف المنتجات"
                    className="inline-flex items-center gap-1 rounded-xl border border-[#D6DFD0] bg-[#EFF3EC] p-1"
                  >
                    {(
                      [
                        { key: 'all', label: `الكل (${counts.all})` },
                        { key: 'pesticides', label: `مبيدات (${counts.pesticides})` },
                        { key: 'fertilizers', label: `أسمدة (${counts.fertilizers})` },
                      ] as const
                    ).map((tab) => {
                      const active = category === tab.key;
                      return (
                        <button
                          key={tab.key}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => setCategory(tab.key)}
                          className={`min-h-[40px] rounded-lg px-3.5 py-1.5 text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            active
                              ? 'bg-[#14532D] text-white'
                              : 'text-[#37483C] hover:text-[#14532D]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative min-w-[240px]">
                    <label htmlFor="catalog-search" className="sr-only">
                      ابحث عن منتج أو محصول
                    </label>
                    <Search
                      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A5D4F]"
                      aria-hidden="true"
                    />
                    <input
                      id="catalog-search"
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث (طماطم، بطاطس، مبيد، بوتاسيوم...)"
                      className="min-h-[46px] w-full rounded-xl border border-[#C6D3BE] bg-[#F8F9F6] pr-10 pl-4 text-sm text-[#17201A] placeholder:text-[#6B7C6F] focus:border-[#14532D] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenDetails={setSelectedModalProduct}
                      onOpenOffer={handleOpenOffer}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-[#D6DFD0] bg-[#F8F9F6] p-8 text-center">
                  <p className="font-display text-lg font-bold text-[#17201A]">
                    لم نجد منتجات مطابقة لبحثك &quot;{searchQuery}&quot;
                  </p>
                  <p className="mt-2 text-sm text-[#425246]">
                    جرّب مسح كلمة البحث أو اسألنا مباشرة عن الصنف المطلوب لأرضك.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('all');
                      setSearchQuery('');
                    }}
                    className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#14532D] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#166534] cursor-pointer"
                  >
                    عرض جميع المنتجات
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* 4. Why Us & How to Order in 3 Steps */}
          <section
            id="how-to-order"
            className="scroll-mt-20 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
          >
            <div className="grid gap-10 lg:grid-cols-2">
              {/* Why Us */}
              <div className="rounded-2xl border border-[#D6DFD0] bg-white p-6 sm:p-8">
                <h2 className="font-display text-2xl font-extrabold text-[#17201A]">
                  لماذا يطلب المزارعون منا؟
                </h2>
                <ul className="mt-5 space-y-4">
                  {[
                    {
                      title: 'عبوات أصلية ومختومة 100%',
                      desc: 'لا نتعامل مع أي أصناف مجهولة المصدر؛ كل عبوة تحمل اسم الشركة وتاريخ الصلاحية.',
                    },
                    {
                      title: 'توصيل مخصص لمحافظات شمال الصعيد',
                      desc: 'تغطية سريعة ومنتظمة لمراكز وقرى بني سويف والفيوم والمنيا فقط.',
                    },
                    {
                      title: 'توجيه مهندس زراعي للجرعة الصحيحة',
                      desc: 'نؤكد معك الجرعة المناسبة لعمر الزرع ونوع الإصابة قبل الرش لتوفر فلوسك وتحمي محصولك.',
                    },
                    {
                      title: 'الدفع عند الاستلام بعد المعاينة',
                      desc: 'عاين طلبك بنفسك عند المندوب قبل دفع أي جنيه.',
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#EFF3EC] text-[#14532D]">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-display text-base font-bold text-[#17201A]">
                          {item.title}
                        </h3>
                        <p className="mt-0.5 text-sm leading-relaxed text-[#425246]">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3 Steps */}
              <div className="rounded-2xl border border-[#D6DFD0] bg-[#14532D] p-6 text-white sm:p-8">
                <h2 className="font-display text-2xl font-extrabold">
                  اطلب في 3 خطوات بسيطة
                </h2>
                <p className="mt-2 text-sm text-[#D1E4D7]">
                  سواء عن طريق النموذج بالأسفل أو برسالة واتساب أو مكالمة سريعة.
                </p>

                <ol className="mt-6 space-y-5">
                  <li className="border-b border-white/15 pb-4">
                    <span className="font-display text-sm font-bold text-[#86EFAC]">
                      01. اختر المنتج أو سجّل بياناتك
                    </span>
                    <p className="mt-1 text-base font-medium leading-relaxed text-white">
                      اختر المبيد أو السماد من الكتالوج، أو اكتب نوع محصولك في نموذج
                      الطلب لنرشح لك الأنسب.
                    </p>
                  </li>
                  <li className="border-b border-white/15 pb-4">
                    <span className="font-display text-sm font-bold text-[#86EFAC]">
                      02. مكالمة التأكيد وتحديد الجرعة
                    </span>
                    <p className="mt-1 text-base font-medium leading-relaxed text-white">
                      يتصل بك فريقنا لتأكيد السعر الإجمالي والجرعة الدقيقة وموعد
                      الوصول لقريتك.
                    </p>
                  </li>
                  <li>
                    <span className="font-display text-sm font-bold text-[#86EFAC]">
                      03. الاستلام والدفع عند الباب
                    </span>
                    <p className="mt-1 text-base font-medium leading-relaxed text-white">
                      تستلم العبوات الأصلية في قريتك أو مركزك وتدفع نقداً عند
                      الاستلام.
                    </p>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* 5. Lead Capture Order Form */}
          <section
            id="order-form"
            className="scroll-mt-20 border-t border-[#D6DFD0] bg-[#EFF3EC]/60 py-10 sm:py-14"
          >
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
              <div className="mb-6">
                <h2 className="font-display text-2xl font-extrabold text-[#17201A] sm:text-3xl">
                  سجّل طلبك أو اطلب استشارة زراعية
                </h2>
                <p className="mt-2 text-base text-[#425246]">
                  اكتب بياناتك وسيظهر لك ملخص الطلب للتحويل الفوري على واتساب وتأكيد
                  التوصيل.
                </p>
              </div>

              <OrderForm
                products={PRODUCTS}
                preselectedProductNames={preselectedOrderProducts}
                attribution={attribution}
              />
            </div>
          </section>

          {/* 6. FAQ */}
          <section
            id="faq"
            className="scroll-mt-20 mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14"
          >
            <h2 className="font-display text-2xl font-extrabold text-[#17201A] sm:text-3xl">
              الأسئلة الشائعة
            </h2>
            <div className="mt-6 space-y-3">
              {FAQ_ITEMS.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-[#D6DFD0] bg-white p-4 sm:p-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold text-[#17201A]">
                    <span>{item.q}</span>
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-[#14532D] transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="mt-3 border-t border-[#EFF3EC] pt-3 text-sm leading-relaxed text-[#425246]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </main>
      )}

      <Footer />
      <StickyConversionBar />

      <ProductModal
        product={selectedModalProduct}
        onClose={() => setSelectedModalProduct(null)}
        onOrderProduct={handleOrderProductFromModal}
      />
    </div>
  );
}
