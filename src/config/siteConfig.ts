/**
 * إعدادات الموقع الثابتة — عدّل هذه القيم مباشرة قبل النشر
 * يمكن أيضاً تمريرها عبر متغيرات البيئة (VITE_*) على Vercel أو Netlify
 */

const viteEnv: Record<string, string | undefined> =
  typeof import.meta !== 'undefined' &&
  (import.meta as unknown as { env?: Record<string, string | undefined> }).env
    ? ((import.meta as unknown as { env: Record<string, string | undefined> }).env)
    : {};

export const GOOGLE_SCRIPT_URL =
  viteEnv.VITE_GOOGLE_SCRIPT_URL ||
  'https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_ID/exec';

export const FB_PIXEL_ID =
  viteEnv.VITE_FB_PIXEL_ID || 'YOUR_FB_PIXEL_ID';

// رقم الواتساب بصيغة دولية بدون علامة + (مصر: 201092935779)
export const WHATSAPP_NUMBER =
  viteEnv.VITE_WHATSAPP_NUMBER || '201092935779';

// رقم الاتصال المباشر للمزارعين
export const PHONE_NUMBER =
  viteEnv.VITE_PHONE_NUMBER || '01092935779';

// رابط صفحة فيسبوك الخاصة بك (استبدله برابط صفحتك الحقيقي عند النشر)
export const FACEBOOK_PAGE_URL =
  viteEnv.VITE_FACEBOOK_PAGE_URL || '';

// الاسم التجاري الظاهر في الترويسة
export const BRAND_NAME = 'أبو عمة ';

// اسم المهندس المسؤول الظاهر في البروشور
export const AGRONOMIST_NAME = 'مهندس / محمود أحمد';

// بيانات الشركة والترخيص (تظهر في تذييل الموقع)
export const COMPANY_LEGAL_NAME =
  'شركة أبو عمة وجرين للتجارة والكيماويات الزراعية';
export const PESTICIDE_LICENSE_NUMBER =
  '[أدخل رقم ترخيص الاتجار في المبيدات والأسمدة / السجل التجاري هنا]';

export const DELIVERY_GOVERNORATES = ['بني سويف', 'الفيوم', 'المنيا'] as const;
export type Governorate = (typeof DELIVERY_GOVERNORATES)[number];

export const WORKING_HOURS = 'السبت إلى الخميس: من 8:00 صباحاً حتى 6:00 مساءً';

export const HERO_IMAGE_URL =
  '/src/assets/images/hero_egypt_agriculture_1794845721723.jpg';
export const OG_IMAGE_URL =
  '/src/assets/images/og_share_banner_1794845722828.jpg';

export const BROCHURE_SHEETS = [
  {
    title: 'قائمة أسعار المبيدات الفطرية والحشرية',
    src: '/assets/aistudio/0a6e137e-4606-4a47-9914-5a6fd921ab82_9ec55075.jpeg',
  },
  {
    title: 'قائمة أسعار الأسمدة والمغذيات',
    src: '/assets/aistudio/386a8d33-6f31-481f-b25b-9ec331909c0a_038eca1f.jpeg',
  },
  {
    title: 'البروشور التفصيلي للمنتجات — م. محمود أحمد',
    src: '/assets/aistudio/IMG_0813_90baecca.jpeg',
  },
] as const;
