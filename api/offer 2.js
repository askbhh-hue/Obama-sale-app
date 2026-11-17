// Vercel serverless function: gives every product page its own Facebook preview (no prices)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const CATALOG = JSON.parse(
  readFileSync(join(process.cwd(), 'src/data/products.json'), 'utf8')
).products;

const norm = (s) =>
  String(s || '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\s\-()]/g, '')
    .toLowerCase();

const PHOTO_RULES = [
  ['agromil-phosphite', 'agromil-phosphite', ['اجروميل', 'فوسفيت']],
  ['agromil', 'agromil', ['اجروميل']],
  ['hostamic', 'hostamic', ['هوستاميك']],
  ['garlic-twist', 'garlic-twist', ['جارليتوريست']],
  ['potassco', 'potassco', ['بوتاسكو']],
  ['mixafos', 'mixafos', ['ميكسافوس']],
  ['vitogreen', 'vitogreen', ['فيتوجرين']],
  ['boronium', 'boronium', ['بورونيوم']],
  ['cytoflora', 'cytoflora', ['سيتوفلورا']],
  ['chip-curan', 'chip-curan', ['كيوران']],
  ['mantoral', 'mantoral', ['مانتورال']],
  ['amino-flower', 'amino-flower', ['امينو', 'فلاور']],
  ['saftogreen', 'saftogreen', ['سيفتو']],
  ['oglan', 'oglan', ['اوجلان']],
  ['dantela', 'dantela', ['دانتلا']],
  ['copa-plus', 'copa-plus', ['كوبا']],
  ['biophos', 'biophos', ['بايوفوس']],
  ['sportage', 'sportage', ['سبورتاج']],
  ['bilison', 'bilison', ['بليزون']],
  ['cycostar', 'cycostar', ['سيكو']],
  ['apatchi', 'apatchi', ['اباتشي']],
  ['voltan', 'voltan', ['فولتان']],
  ['nefertity', 'nefertity', ['نفرتيتي']],
];

const NAME_FIXES = { 'stedasilver-250': 'ستساسيلفر' };

const photoFor = (product) => {
  const n = norm(product.name);
  const slug = String(product.slug || '').toLowerCase();
  if (slug.startsWith('new-') || n.startsWith('نيو')) return null;
  const hit = PHOTO_RULES.find(
    ([, prefix, keys]) => slug.startsWith(prefix) || keys.every((k) => n.includes(k))
  );
  return hit ? hit[0] : null;
};

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const cut = (s, n) => (String(s).length > n ? String(s).slice(0, n - 1) + '…' : String(s));

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

  const p = CATALOG.find((x) => String(x.slug).toLowerCase() === slug);
  if (p) {
    const name = NAME_FIXES[p.slug] || p.name;
    const img = photoFor(p) || (p.category === 'fertilizers' ? 'generic-foliar' : 'generic-pesticide');
    const title = cut(`${name} — ${p.activeIngredient}`, 110);
    const desc = cut(
      `الاستخدامات: ${p.targetCropPest} | الفائدة: ${p.shortUsageNote} | العبوة: ${p.packSize}`,
      230
    );
    const image = `${origin}/og-${img}.jpg`;
    const url = `${origin}/offer/${p.slug}`;
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
