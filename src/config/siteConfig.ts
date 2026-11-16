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

// رابط صفحة فيسبوك الخاصة بك (استبدله برابط صفحتك الحقيقي في الخطوة الثانية)
export const FACEBOOK_PAGE_URL =
  viteEnv.VITE_FACEBOOK_PAGE_URL || '';

// الاسم التجاري الظاهر في الترويسة
export const BRAND_NAME = 'خضرة الصعيد';

// بيانات الشركة والترخيص (ثوابت قابلة للتعديل — تظهر في تذييل الموقع)
export const COMPANY_LEGAL_NAME =
  '[أدخل اسم الشركة / المستودع الزراعي الرسمي هنا]';
export const PESTICIDE_LICENSE_NUMBER =
  '[أدخل رقم ترخيص الاتجار في المبيدات والأسمدة / السجل التجاري هنا]';

export const DELIVERY_GOVERNORATES = ['بني سويف', 'الفيوم', 'المنيا'] as const;
export type Governorate = (typeof DELIVERY_GOVERNORATES)[number];

export const WORKING_HOURS = 'السبت إلى الخميس: من 8:00 صباحاً حتى 6:00 مساءً';

export const HERO_IMAGE_URL =
  '/src/assets/images/hero_egypt_agriculture_1794845721723.jpg';
export const OG_IMAGE_URL =
  '/src/assets/images/og_share_banner_1794845722828.jpg';
