// Vercel serverless function: gives every product page its own Facebook preview (no prices)
const PRODUCTS = {
 "scoral-150": ["سكورال", "150 جرام", "مبيد فطري حيوي يحتوي على بكتيريا نافعة للوقاية من الأمراض الفطرية.", "generic-pesticide"],
 "voltan-series-400": ["فولتان سيرس", "400 جرام", "مبيد فطري جهازي جاهز لمكافحة البياض الزغبي واللطعة الأرجوانية والتبقعات والندوات في المحاصيل والخضر والفاكهة.", "voltan"],
 "voltan-series-800": ["فولتان سيرس", "800 جرام", "مبيد فطري جهازي جاهز لمكافحة البياض الزغبي واللطعة الأرجوانية والتبقعات والندوات في المحاصيل والخضر والفاكهة.", "voltan"],
 "agromil-450": ["أجروميل", "450 جرام (كيس)", "مبيد فطري جهازي جاهز لمكافحة البياض الزغبي واللطعة الأرجوانية والتبقعات والندوات في الخضر والفاكهة.", "agromil"],
 "agromil-900": ["أجروميل", "900 جرام", "مبيد فطري جهازي جاهز لمكافحة البياض الزغبي واللطعة الأرجوانية والتبقعات والندوات في الخضر والفاكهة.", "agromil"],
 "cycostar-250": ["سيكوستار", "250 سم", "وقائي وعلاجي للعفن الرمادي والبياض الدقيقي والزغبي والندوة المبكرة والمتأخرة ولفحة الساق الصمغية.", "cycostar"],
 "bilison-300": ["بليزون", "300 سم", "علاج ووقاية من البياض الزغبي والدقيقي وتبقعات الأوراق والندوة في الخضر والفاكهة والعنب.", "bilison"],
 "oglan-300": ["أوجلان", "300 سم", "مبيد فطري جهازي قوي لعلاج ووقاية من أعفان الجذور والندوة والبياض الدقيقي والزغبي.", "oglan"],
 "apatchi-500": ["أباتشي جرين", "500 جرام", "مبيد فطري للقضاء على أعفان الجذور واللفحة وأمراض البياض الزغبي في الخضر والمحاصيل.", "apatchi"],
 "dantela-400": ["دانتلا جرين", "400 جرام", "مبيد فطري وقائي وعلاجي للبياض الدقيقي والأصداء واللفحة والعفن الرمادي في الخضر والفاكهة.", "dantela"],
 "dantela-200": ["دانتلا جرين", "200 جرام", "مبيد فطري وقائي وعلاجي للبياض الدقيقي والأصداء واللفحة والعفن الرمادي في الخضر والفاكهة.", "dantela"],
 "copa-plus-500": ["كوبا بلس", "500 جرام", "مبيد فطري وقائي وعلاجي للبياض الزغبي واللطعة الأرجوانية وأعفان الجذور والأمراض البكتيرية، ويعالج نقص النحاس.", "copa-plus"],
 "stedasilver-250": ["ستساسيلفر", "250 سم", "مبيد حشري بثلاث مواد فعالة.", "generic-pesticide"],
 "brokley-1l": ["بروكلي", "1 لتر", "مبيد حشري جهازي.", "generic-pesticide"],
 "sportage-quarter": ["سبورتاج جرين", "ربع لتر", "مبيد حشري لمكافحة دودة ورق القطن والذبابة البيضاء والمن في الخضر والمحاصيل.", "sportage"],
 "sportage-half": ["سبورتاج جرين", "نصف لتر", "مبيد حشري لمكافحة دودة ورق القطن والذبابة البيضاء والمن في الخضر والمحاصيل.", "sportage"],
 "new-nefertity-quarter": ["نيو نفرتيتي", "ربع لتر", "مبيد حشري ثنائي المفعول.", "generic-pesticide"],
 "nefertity-quarter": ["نفرتيتي جرين", "ربع لتر", "مبيد حشري فوسفوري قوي لدودة الحشد الخريفية في الذرة والدودة القارضة وحفار الساق والذبابة البيضاء.", "nefertity"],
 "nefertity-half": ["نفرتيتي جرين", "نصف لتر", "مبيد حشري فوسفوري قوي لدودة الحشد الخريفية في الذرة والدودة القارضة وحفار الساق والذبابة البيضاء.", "nefertity"],
 "biophos-quarter": ["بايوفوس", "ربع لتر", "لمكافحة دودة ورق القطن ودودة الحشد الخريفية والذبابة البيضاء والمن والتربس.", "biophos"],
 "garlic-twist-1l": ["جارليتوريست", "1 لتر", "يزيد نسبة التفريع وينشط نمو الشعيرات الجذرية، مناسب للثوم والبصل.", "garlic-twist"],
 "chip-curan-1l": ["شيب كيوران", "1 لتر", "يعالج الأمراض الفسيولوجية الناتجة عن نقص الكالسيوم ويقوي الثمار ويزيد عقد الثمار.", "chip-curan"],
 "agromil-phosphite-1l": ["أجروميل بوتاسيوم فوسفيت", "1 لتر", "سماد سائل غني بالعناصر الكبرى لنمو وقوة النبات، يحتوي على 30% أحماض عضوية.", "agromil-phosphite"],
 "mantoral-1l": ["مانتورال", "1 لتر", "يزيد مقاومة النبات للأمراض مثل البياض الدقيقي والزغبي ويقوي الأنسجة.", "mantoral"],
 "saftogreen-250": ["سيفتوجرين", "250 سم", "منشط نمو قوي يزيد التزهير وعقد الثمار دون إجهاد للنبات.", "saftogreen"],
 "vitogreen-quarter": ["فيتوجرين", "ربع لتر", "أحماض أمينية 24% + طحالب بحرية 20% + عناصر صغرى؛ يعالج نقص العناصر وينشط النمو الخضري.", "vitogreen"],
 "vitogreen-half": ["فيتوجرين", "نصف لتر", "أحماض أمينية 24% + طحالب بحرية 20% + عناصر صغرى؛ يعالج نقص العناصر وينشط النمو الخضري.", "vitogreen"],
 "amino-flower-quarter": ["أمينو فلاور جرين", "ربع لتر", "وجبة متكاملة لجميع المحاصيل الزراعية غنية بالسيتوكينين والعناصر المنشطة.", "amino-flower"],
 "cytoflora-1l": ["سيتوفلوراجرين", "1 لتر", "يقوي منشط الجذور ويعالج الملوحة والنيماتودا وأعفان الجذور.", "cytoflora"],
 "boronium-top-250": ["بورونيوم توب", "250 سم", "يمنع تراكم النيتروجين في الأوراق، ويزيد نمو حبوب اللقاح، ويرفع نسبة السكر.", "boronium"],
 "potassco-1l": ["بوتاسكوجرين", "1 لتر", "بوتاسيوم في صورة نترات، سهل الامتصاص وسريع المفعول.", "potassco"],
 "mixafos-zinka-half-kg": ["ميكسافوس زنكاجرين", "نصف كيلو", "مجموعة متكاملة من العناصر الصغرى والكبرى مع سكريات كحولية.", "mixafos"],
 "hostamic-green-5l": ["هوستاميك جرين", "جركن 5 لتر", "أقوى بديل للكيماوي بمصر، يغنيك عن 60% من الكيماوي.", "hostamic"],
};

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default async function handler(req, res) {
  const slug = String(req.query.slug || '').trim().toLowerCase();
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const origin = `https://${host}`;

  let html;
  try {
    const r = await fetch(`${origin}/index.html`);
    html = await r.text();
  } catch (e) {
    res.status(500).send('Error');
    return;
  }

  const p = PRODUCTS[slug];
  if (p) {
    const [name, pack, note, img] = p;
    const title = `${name} (${pack}) | أبو عمة`;
    const desc = `${note} اطلب الآن والدفع عند الاستلام.`;
    const image = `${origin}/og-${img}.jpg`;
    const url = `${origin}/offer/${slug}`;
    const tags = [
      `<meta property="og:type" content="product" />`,
      `<meta property="og:locale" content="ar_EG" />`,
      `<meta property="og:site_name" content="أبو عمة" />`,
      `<meta property="og:title" content="${esc(title)}" />`,
      `<meta property="og:description" content="${esc(desc)}" />`,
      `<meta property="og:image" content="${image}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${esc(title)}" />`,
      `<meta name="twitter:description" content="${esc(desc)}" />`,
      `<meta name="twitter:image" content="${image}" />`,
    ].join('\n    ');
    html = html
      .replace(/<meta\s+(?:property|name)="(?:og|twitter):[^"]*"[^>]*>/g, '')
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
      .replace('</head>', `    ${tags}\n  </head>`);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.status(200).send(html);
}
