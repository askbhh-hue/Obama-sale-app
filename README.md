# موقع خضرة الصعيد للمبيدات والأسمدة (بني سويف · الفيوم · المنيا)

موقع هبوط سريع وخفيف باللغة العربية (RTL) مخصص لتحويل زوار إعلانات فيسبوك من المزارعين إلى طلبات عبر النموذج أو واتساب أو الاتصال الهاتفي، مع صفحات هبوط مخصصة لكل عرض (`/offer/product-slug`).

---

## 1. تعديل المنتجات والأسعار (بعد رفع البروشور)

كل المنتجات والأسعار والمواد الفعالة والجرعات موجودة في ملف واحد فقط:
- `src/data/products.json`

يمكنك تعديل الأسماء أو الأسعار بالجنيه المصري (`priceEgp`) أو إضافة منتجات جديدة من البروشور دون لمس أي كود تصميم. الحقول الاختيارية (`safetyWarnings` و `preHarvestInterval`) تظهر تلقائياً فقط عند وجودها في الملف.

كما توجد جميع إعدادات الأرقام والترخيص والروابط في أعلى ملف:
- `src/config/siteConfig.ts` (`WHATSAPP_NUMBER`, `PHONE_NUMBER`, `COMPANY_LEGAL_NAME`, `PESTICIDE_LICENSE_NUMBER`, `GOOGLE_SCRIPT_URL`, `FB_PIXEL_ID`).

---

## 2. ربط نموذج الطلبات بجدول Google Sheets

1. افتح Google Sheets وأنشئ جدول بيانات جديد.
2. من القائمة العلوية اختر **Extensions > Apps Script**.
3. انسخ محتوى الملف `google-apps-script/Code.gs` بالكامل والصقه في المحرر ثم احفظ (`Ctrl + S`).
4. اضغط **Deploy > New deployment** ثم اختر النوع **Web app**.
5. اضبط:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
6. اضغط **Deploy** وانسخ رابط الـ Web App الذي ينتهي بـ `/exec`.
7. ضع الرابط في `GOOGLE_SCRIPT_URL` داخل `src/config/siteConfig.ts` (أو في متغير البيئة `VITE_GOOGLE_SCRIPT_URL` عند النشر).

> **ملاحظة**: إذا فشل الاتصال بـ Google Sheets لأي سبب (أو كان الرابط غير مفعّل بعد)، يستمر الموقع في فتح واتساب وعرض رسالة التأكيد للمزارع حتى لا يضيع أي طلب.

---

## 3. تفعيل Facebook Pixel

1. احصل على رقم الـ Pixel ID من مدير الأحداث في Meta (Facebook Events Manager).
2. ضع الرقم مكان `YOUR_FB_PIXEL_ID` في `FB_PIXEL_ID` داخل `src/config/siteConfig.ts` (أو عبر متغير البيئة `VITE_FB_PIXEL_ID`).
3. الأحداث المفعلة تلقائياً:
   - `PageView`: عند فتح الصفحة الرئيسية أو أي رابط عرض `/offer/:slug`.
   - `ViewContent`: عند فتح تفاصيل أي منتج أو فتح صفحة العرض الخاصة به.
   - `Lead`: عند إرسال نموذج الطلب بنجاح.
   - `Contact`: عند الضغط على أي زر واتساب أو اتصال هاتفي.
4. يلتقط الموقع تلقائياً `utm_source` و `utm_campaign` و `utm_content` و `fbclid` من رابط الإعلان ويرسلها مع كل طلب إلى Google Sheets ورسالة واتساب.

---

## 4. النشر على Vercel أو Netlify وربط الدومين

الموقع مبني كـ Static Build (`npm run build` ينتج مجلد `dist`) ولا يحتاج خادماً خلفياً، ومزود بملفات `vercel.json` و `netlify.toml` لدعم روابط الإعلانات المباشرة مثل `/offer/lambda-star-5`.

### النشر على Vercel
1. ارفع المشروع إلى GitHub.
2. افتح [vercel.com](https://vercel.com) واختر **Add New Project** ثم اختر المستودع.
3. تأكد أن Build Command هو `npm run build` و Output Directory هو `dist`.
4. (اختياري) أضف متغيرات البيئة (`VITE_GOOGLE_SCRIPT_URL`, `VITE_FB_PIXEL_ID`, `VITE_WHATSAPP_NUMBER`, `VITE_PHONE_NUMBER`) ثم اضغط **Deploy**.
5. لربط دومين خاص: من لوحة المشروع في Vercel ادخل **Settings > Domains** وأضف الدومين واتبع تعليمات DNS (سجل A أو CNAME).

### النشر على Netlify
1. افتح [app.netlify.com](https://app.netlify.com) واختر **Add new site > Import an existing project** (أو ارفع مجلد `dist` بعد تشغيل `npm run build`).
2. ملف `netlify.toml` مضبوط بالفعل على `npm run build` ومجلد `dist` وتوجيه كل الروابط إلى `index.html`.
3. لربط دومين خاص: ادخل **Domain management > Add a domain** واتبع خطوات DNS.
