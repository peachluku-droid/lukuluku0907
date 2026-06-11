/**
 * seo.js — Peach Luku SEO Module v2
 * Đặt tại: /seo.js (root)
 * Load trong <head> của tất cả trang public (trước supabase-js)
 *
 * Export: window.PlSEO
 *   .updateMeta(opts)
 *   .injectBookJsonLd(story, chapters, totalVotes)
 *   .injectChapterJsonLd(chapter, storyTitle, storyCover, storyId)
 *   .injectWebSiteJsonLd()
 *   .injectCollectionPageJsonLd(name, url, desc)
 *   .injectBreadcrumb(items)
 *   .noindex()
 */
(function (w) {
  'use strict';

  const BASE   = 'https://peachluku.com';
  const SITE   = 'Peach Luku';
  const OG_IMG = 'https://jnlqzqtavfptkfvnndxq.supabase.co/storage/v1/object/public/avatars/og-cover.png';

  // ── DOM helpers ────────────────────────────────────────────────────────

  function _meta(selector) {
    return document.querySelector(selector);
  }

  function _setMeta(selector, value) {
    let el = _meta(selector);
    if (!el) {
      el = document.createElement('meta');
      // parse selector: [property="og:title"] or [name="description"]
      const propMatch = selector.match(/\[property="([^"]+)"\]/);
      const nameMatch = selector.match(/\[name="([^"]+)"\]/);
      if (propMatch) el.setAttribute('property', propMatch[1]);
      else if (nameMatch) el.setAttribute('name', nameMatch[1]);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  }

  function _setCanonical(url) {
    let el = document.querySelector('link[rel="canonical"]');
    if (!el) {
      el = document.createElement('link');
      el.rel = 'canonical';
      document.head.appendChild(el);
    }
    el.href = url;
  }

  function _injectJsonLd(id, obj) {
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = id;
    // Compact JSON — không pretty-print ở production
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }

  // ── Text utils ─────────────────────────────────────────────────────────

  function _strip(html) {
    if (!html) return '';
    return String(html).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  }

  function _truncate(str, max) {
    str = _strip(str);
    return str.length > max ? str.slice(0, max - 1) + '…' : str;
  }

  function _isoDate(d) {
    if (!d) return undefined;
    try { return new Date(d).toISOString().split('T')[0]; } catch { return undefined; }
  }

  // Xóa key undefined khỏi object (schema.org không chấp nhận null/undefined)
  function _clean(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );
  }

  // ── Core: updateMeta ───────────────────────────────────────────────────

  /**
   * @param {object} opts
   * @param {string}  opts.title        - Tiêu đề (không cần " — Peach Luku")
   * @param {string}  [opts.description]
   * @param {string}  [opts.image]       - URL ảnh OG (tuyệt đối)
   * @param {string}  [opts.url]         - Canonical URL tuyệt đối
   * @param {string}  [opts.type]        - og:type: website|book|article
   * @param {boolean} [opts.noindex]     - true → noindex,follow
   */
  function updateMeta(opts) {
    const title   = opts.title ? `${opts.title} — ${SITE}` : SITE;
    const desc    = _truncate(opts.description, 160) || 'Web đọc truyện chữ cute & thơm 🍑';
    const image   = opts.image  || OG_IMG;
    const url     = opts.url    || (BASE + location.pathname + location.search).replace(/\?$/, '');
    const type    = opts.type   || 'website';
    const robots  = opts.noindex ? 'noindex, follow' : 'index, follow';

    // <title>
    document.title = title;

    // Canonical
    _setCanonical(url);

    // Standard
    _setMeta('[name="description"]', desc);
    _setMeta('[name="robots"]', robots);

    // Open Graph
    _setMeta('[property="og:site_name"]', SITE);
    _setMeta('[property="og:type"]',        type);
    _setMeta('[property="og:url"]',         url);
    _setMeta('[property="og:title"]',       title);
    _setMeta('[property="og:description"]', desc);
    _setMeta('[property="og:image"]',       image);
    _setMeta('[property="og:image:width"]', '1200');
    _setMeta('[property="og:image:height"]','630');
    _setMeta('[property="og:locale"]',      'vi_VN');

    // Twitter Card
    _setMeta('[name="twitter:card"]',        'summary_large_image');
    _setMeta('[name="twitter:title"]',       title);
    _setMeta('[name="twitter:description"]', desc);
    _setMeta('[name="twitter:image"]',       image);
  }

  function noindex() {
    _setMeta('[name="robots"]', 'noindex, follow');
  }

  // ── JSON-LD: WebSite (index.html) ──────────────────────────────────────

  function injectWebSiteJsonLd() {
    _injectJsonLd('ld-website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': BASE + '/#website',
      name: SITE,
      url: BASE,
      description: 'Web đọc truyện chữ tiếng Việt online miễn phí',
      inLanguage: 'vi',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: BASE + '/search.html?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    });
  }

  // ── JSON-LD: Book (story.html) ─────────────────────────────────────────

  /**
   * @param {object} story       - Row từ Supabase stories table
   * @param {Array}  chapters    - Mảng chapters đã published
   * @param {number} totalVotes  - Tổng votes của tất cả chương
   */
  function injectBookJsonLd(story, chapters, totalVotes) {
    if (!story) return;

    const storyUrl = `${BASE}/story.html?story=${encodeURIComponent(story.id)}`;
    const tags = story.tags
      ? story.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];
    const isDone  = story.status === 'done' || story.status === 'completed' || !!story.completed;
    const chapCount = Array.isArray(chapters) ? chapters.length : undefined;

    const jsonLd = _clean({
      '@context': 'https://schema.org',
      '@type': 'Book',
      '@id': storyUrl,
      name: _strip(story.title),
      description: _truncate(story.description, 500),
      url: storyUrl,
      image: story.cover_url || OG_IMG,
      author: _clean({
        '@type': 'Person',
        name: story.author || 'Ẩn danh',
      }),
      publisher: {
        '@type': 'Organization',
        name: SITE,
        url: BASE,
      },
      inLanguage: 'vi',
      datePublished: _isoDate(story.created_at),
      dateModified:  _isoDate(story.updated_at),
      genre: tags[0] || undefined,
      keywords: tags.length ? tags.join(', ') : undefined,
      bookFormat: 'EBook',
      numberOfPages: chapCount,
      bookEdition: isDone ? 'Hoàn thành' : 'Đang ra',
      // AggregateRating chỉ inject khi có votes thực
      aggregateRating: (totalVotes && totalVotes > 0 && chapCount && chapCount > 0)
        ? _clean({
            '@type': 'AggregateRating',
            ratingValue: Math.min(5, Math.max(1, (totalVotes / chapCount / 10))).toFixed(1),
            reviewCount: String(totalVotes),
            bestRating: '5',
            worstRating: '1',
          })
        : undefined,
    });

    _injectJsonLd('ld-book', jsonLd);

    injectBreadcrumb([
      { name: SITE, url: BASE + '/' },
      { name: _strip(story.title), url: storyUrl },
    ]);
  }

  // ── JSON-LD: Chapter (chapter.html) ────────────────────────────────────

  /**
   * @param {object} chapter
   * @param {string} storyTitle
   * @param {string} storyCover
   * @param {string} storyId
   */
  function injectChapterJsonLd(chapter, storyTitle, storyCover, storyId) {
    if (!chapter) return;

    const storyUrl   = `${BASE}/story.html?story=${encodeURIComponent(storyId)}`;
    const chapterUrl = `${BASE}/chapter.html?story=${encodeURIComponent(storyId)}&chapter=${encodeURIComponent(chapter.id)}`;
    const chTitle    = chapter.title
      ? `Chương ${chapter.chapter_number} — ${chapter.title}`
      : `Chương ${chapter.chapter_number}`;

    const jsonLd = _clean({
      '@context': 'https://schema.org',
      '@type': 'Chapter',
      '@id': chapterUrl,
      name: chTitle,
      url: chapterUrl,
      image: storyCover || OG_IMG,
      isPartOf: _clean({
        '@type': 'Book',
        '@id': storyUrl,
        name: storyTitle || SITE,
        url: storyUrl,
      }),
      position: chapter.chapter_number,
      inLanguage: 'vi',
      datePublished: _isoDate(chapter.created_at),
      dateModified:  _isoDate(chapter.updated_at),
    });

    _injectJsonLd('ld-chapter', jsonLd);

    injectBreadcrumb([
      { name: SITE, url: BASE + '/' },
      { name: storyTitle || 'Truyện', url: storyUrl },
      { name: chTitle, url: chapterUrl },
    ]);
  }

  // ── JSON-LD: CollectionPage (library, search) ──────────────────────────

  function injectCollectionPageJsonLd(name, url, desc) {
    _injectJsonLd('ld-collection', _clean({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name,
      url,
      description: _truncate(desc, 200),
      isPartOf: { '@type': 'WebSite', '@id': BASE + '/#website', name: SITE, url: BASE },
      inLanguage: 'vi',
    }));
  }

  // ── JSON-LD: BreadcrumbList ────────────────────────────────────────────

  function injectBreadcrumb(items) {
    _injectJsonLd('ld-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  // ── Export ─────────────────────────────────────────────────────────────

  w.PlSEO = {
    updateMeta,
    noindex,
    injectBookJsonLd,
    injectChapterJsonLd,
    injectWebSiteJsonLd,
    injectCollectionPageJsonLd,
    injectBreadcrumb,
  };

}(window));
