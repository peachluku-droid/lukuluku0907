/**
 * Vercel Serverless Function
 * Path: /api/sitemap
 * Truy cập: https://peachluku.com/sitemap.xml  (rewrite trong vercel.json)
 *
 * Tạo sitemap index động:
 *   /sitemap.xml            → index trỏ tới các sub-sitemap
 *   /sitemap.xml?type=static     → trang tĩnh
 *   /sitemap.xml?type=stories    → tất cả truyện
 *   /sitemap.xml?type=chapters&page=0 → chapters (50k/trang)
 *
 * Env vars cần set trong Vercel Dashboard:
 *   SUPABASE_URL=https://xxx.supabase.co
 *   SUPABASE_SERVICE_KEY=eyJ...   (service role key - không expose ra client)
 */

const BASE_URL = 'https://peachluku.com';
const CHAPTERS_PER_PAGE = 50000;

// ── Helpers ────────────────────────────────────────────────────────────────

function xmlEscape(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isoDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  try {
    return new Date(dateStr).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

async function sbFetch(url, key, path) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
      'Accept-Profile': 'public',
    },
    // Vercel edge timeout
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Supabase ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

// ── Generators ─────────────────────────────────────────────────────────────

function buildSitemapIndex(entries) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const e of entries) {
    xml += `  <sitemap>\n`;
    xml += `    <loc>${xmlEscape(e.loc)}</loc>\n`;
    if (e.lastmod) xml += `    <lastmod>${e.lastmod}</lastmod>\n`;
    xml += `  </sitemap>\n`;
  }
  xml += `</sitemapindex>`;
  return xml;
}

function buildUrlSet(urls) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const u of urls) {
    xml += `  <url>\n`;
    xml += `    <loc>${xmlEscape(u.loc)}</loc>\n`;
    if (u.lastmod) xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${u.changefreq || 'monthly'}</changefreq>\n`;
    xml += `    <priority>${u.priority || '0.5'}</priority>\n`;
    xml += `  </url>\n`;
  }
  xml += `</urlset>`;
  return xml;
}

function staticSitemap() {
  const pages = [
    { loc: `${BASE_URL}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${BASE_URL}/library.html`, changefreq: 'daily', priority: '0.9' },
    { loc: `${BASE_URL}/search.html`, changefreq: 'weekly', priority: '0.7' },
  ];
  return buildUrlSet(pages);
}

async function storiesSitemap(sbUrl, sbKey) {
  const rows = await sbFetch(
    sbUrl, sbKey,
    'stories?select=id,updated_at,created_at&is_published=eq.true&order=updated_at.desc&limit=10000'
  );
  const urls = rows.map(s => ({
    loc: `${BASE_URL}/story.html?story=${xmlEscape(s.id)}`,
    lastmod: isoDate(s.updated_at || s.created_at),
    changefreq: 'weekly',
    priority: '0.8',
  }));
  return buildUrlSet(urls);
}

async function chaptersSitemap(sbUrl, sbKey, page = 0) {
  const offset = page * CHAPTERS_PER_PAGE;
  const rows = await sbFetch(
    sbUrl, sbKey,
    `chapters?select=id,story_id,updated_at&is_published=eq.true&order=story_id.asc,id.asc&limit=${CHAPTERS_PER_PAGE}&offset=${offset}`
  );
  const urls = rows.map(c => ({
    loc: `${BASE_URL}/chapter.html?story=${xmlEscape(c.story_id)}&chapter=${xmlEscape(c.id)}`,
    lastmod: isoDate(c.updated_at),
    changefreq: 'monthly',
    priority: '0.6',
  }));
  return buildUrlSet(urls);
}

async function sitemapIndex(sbUrl, sbKey) {
  // Đếm tổng chapters để biết cần bao nhiêu trang
  const countRes = await sbFetch(
    sbUrl, sbKey,
    'chapters?select=id&is_published=eq.true&limit=1'
  );
  // Supabase không trả Content-Range qua REST khi select cụ thể; dùng count param
  const countRow = await sbFetch(
    sbUrl, sbKey,
    'chapters?select=id&is_published=eq.true&limit=1&offset=0'
  );
  // Ước tính: fetch count riêng
  let totalChapters = 0;
  try {
    const r = await fetch(`${sbUrl}/rest/v1/chapters?select=id&is_published=eq.true`, {
      method: 'HEAD',
      headers: {
        apikey: sbKey,
        Authorization: `Bearer ${sbKey}`,
        'Prefer': 'count=exact',
      },
    });
    const range = r.headers.get('content-range'); // e.g. "0-99/1500"
    if (range) totalChapters = parseInt(range.split('/')[1]) || 0;
  } catch {}

  const chapterPages = Math.max(1, Math.ceil(totalChapters / CHAPTERS_PER_PAGE));

  const entries = [
    { loc: `${BASE_URL}/sitemap.xml?type=static` },
    { loc: `${BASE_URL}/sitemap.xml?type=stories` },
  ];
  for (let i = 0; i < chapterPages; i++) {
    entries.push({ loc: `${BASE_URL}/sitemap.xml?type=chapters&page=${i}` });
  }

  return buildSitemapIndex(entries);
}

// ── Handler ────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('[sitemap] Missing env: SUPABASE_URL or SUPABASE_SERVICE_KEY');
    res.status(500).send('Server misconfigured: missing Supabase env vars');
    return;
  }

  const type = req.query?.type || 'index';
  const page = parseInt(req.query?.page || '0', 10) || 0;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=43200, stale-while-revalidate=86400');

  try {
    let xml = '';
    switch (type) {
      case 'static':
        xml = staticSitemap();
        break;
      case 'stories':
        xml = await storiesSitemap(SUPABASE_URL, SUPABASE_KEY);
        break;
      case 'chapters':
        xml = await chaptersSitemap(SUPABASE_URL, SUPABASE_KEY, page);
        break;
      case 'index':
      default:
        xml = await sitemapIndex(SUPABASE_URL, SUPABASE_KEY);
        break;
    }
    res.status(200).send(xml);
  } catch (err) {
    console.error('[sitemap] Error:', err.message);
    // Trả về XML rỗng hợp lệ thay vì 500 (tránh Google Search Console báo lỗi liên tục)
    res.status(200).send(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><!-- error: ${xmlEscape(err.message)} --></urlset>`
    );
  }
}
