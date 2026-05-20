/**
 * navbar.js — Shared navbar cho tất cả trang Peach Luku
 * 
 * Cách dùng: Thêm vào <head> của mỗi trang:
 *   <link rel="stylesheet" href="navbar.css">
 *   <script src="navbar.js" data-page="home"></script>
 *
 * data-page: "home" | "library" | "search" | "profile" | "write" | "story" | "chapter"
 * (dùng để đánh dấu link active trên navbar)
 */

(function () {
  // ── 1. Inject CSS ──────────────────────────────────────────────────────────
  const CSS = `
/* ─── TOPBAR ─────────────────────────────────────────────── */
.topbar {
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  padding: 0 2rem;
  display: flex; align-items: center;
  justify-content: space-between; height: 56px;
  position: sticky; top: 0; z-index: 100;
  transition: background .3s;
}
.logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
.logo img { width: 36px; height: 36px; object-fit: contain; border-radius: 50%; }
.logo-text { font-family: 'Nunito', sans-serif; font-size: 18px; font-weight: 800; color: var(--peach); }

.nav-center { display: flex; gap: 2px; align-items: center; }
.nav-center a {
  font-size: 13px; font-weight: 700; padding: 7px 14px;
  border-radius: 8px; color: var(--text-muted); text-decoration: none;
  transition: all .15s; display: flex; align-items: center; gap: 5px;
  position: relative;
}
.nav-center a:hover { color: var(--peach); }
.nav-center a.active { color: var(--peach); font-weight: 800; }
.nav-center a.active::after {
  content: ''; position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%);
  width: 20px; height: 2px; background: var(--peach); border-radius: 2px;
}
.nav-center a svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }

.nav-right { display: flex; gap: 6px; align-items: center; }

.icon-btn {
  background: none; border: none; cursor: pointer;
  width: 34px; height: 34px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted); transition: all .15s;
}
.icon-btn:hover { background: var(--peach-light); color: var(--peach); }
.icon-btn svg { width: 17px; height: 17px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* Theme button */
.theme-btn {
  background: none; border: none; cursor: pointer;
  width: 34px; height: 34px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted); transition: all .15s;
}
.theme-btn:hover { background: var(--peach-light); color: var(--peach); }
.theme-btn svg { width: 17px; height: 17px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* Avatar button */
.user-nav-btn {
  display: flex !important; align-items: center; justify-content: center;
  width: 34px !important; height: 34px !important;
  border-radius: 50% !important; overflow: hidden;
  background: var(--peach-light); color: var(--peach-dark);
  font-weight: 800; font-size: 14px; text-decoration: none;
  border: 2px solid var(--border-hover) !important;
  transition: all .15s; flex-shrink: 0; padding: 0 !important;
}
.user-nav-btn:hover { border-color: var(--peach) !important; }
.user-nav-btn img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 50%; }
.profile-menu-btn.has-avatar { border-radius: 50% !important; overflow: hidden; padding: 0 !important; }
.profile-menu-btn.has-avatar svg { display: none; }
.profile-menu-btn.has-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 50%; }

/* Notif dot */
.nav-notif-btn { position: relative; }
.notif-dot {
  position: absolute; top: 4px; right: 4px;
  width: 8px; height: 8px; background: var(--peach);
  border-radius: 50%; border: 2px solid var(--bg2);
}

/* Profile dropdown */
.profile-menu-wrap { position: relative; }
.profile-dropdown {
  display: none; flex-direction: column;
  position: absolute; right: 0; top: calc(100% + 8px);
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: 12px; min-width: 180px;
  box-shadow: 0 8px 32px rgba(0,0,0,.12); z-index: 200; overflow: hidden;
}
.profile-dropdown.open { display: flex; }
.profile-dropdown-item {
  display: flex; align-items: center; gap: 9px;
  padding: 10px 14px; font-size: 13px; font-weight: 700;
  color: var(--text); text-decoration: none; transition: background .12s;
}
.profile-dropdown-item:hover { background: var(--peach-light); color: var(--peach); }
.profile-dropdown-item svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; opacity: .7; }

/* Theme drawer */
.theme-drawer {
  display: none; position: absolute; right: 6rem; top: 56px;
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: 14px; padding: 14px; min-width: 200px;
  box-shadow: 0 8px 32px rgba(0,0,0,.12); z-index: 200;
}
.theme-drawer.open { display: block; }
.theme-drawer-title { font-size: 12px; font-weight: 800; color: var(--text-muted); margin-bottom: 10px; text-transform: uppercase; letter-spacing: .5px; }
.theme-swatches { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.swatch { width: 38px; height: 38px; border-radius: 50%; border: 3px solid transparent; cursor: pointer; transition: all .15s; }
.swatch.active { border-color: var(--peach); box-shadow: 0 0 0 2px var(--bg2), 0 0 0 4px var(--peach); }
.swatch:hover { transform: scale(1.12); }
.swatch-label { font-size: 10px; text-align: center; color: var(--text-muted); margin-top: 3px; font-weight: 700; }

/* Notif panel */
.notif-panel {
  display: none; flex-direction: column;
  position: absolute; right: 3.5rem; top: 56px;
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: 14px; width: 300px;
  box-shadow: 0 8px 32px rgba(0,0,0,.12); z-index: 200; overflow: hidden;
}
.notif-panel.open { display: flex; }
.notif-panel-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px; border-bottom: 1px solid var(--border);
}
.notif-panel-title { font-size: 13px; font-weight: 800; display: flex; align-items: center; gap: 6px; }
.notif-panel-title svg { width: 15px; height: 15px; stroke: var(--peach); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.notif-close-btn {
  background: none; border: none; cursor: pointer; color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border-radius: 6px; transition: all .12s;
}
.notif-close-btn:hover { background: var(--peach-light); color: var(--peach); }
.notif-close-btn svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.notif-list { max-height: 340px; overflow-y: auto; }
.notif-empty { padding: 20px; text-align: center; font-size: 13px; color: var(--text-muted); }
.notif-item { display: flex; gap: 10px; padding: 10px 14px; text-decoration: none; border-bottom: 1px solid var(--border); transition: background .12s; }
.notif-item:hover { background: var(--peach-light); }
.notif-cover { width: 36px; height: 50px; object-fit: cover; border-radius: 5px; flex-shrink: 0; }
.notif-info { flex: 1; min-width: 0; }
.notif-story-title { font-size: 12px; font-weight: 800; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.notif-ch-title { font-size: 12px; color: var(--peach); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.notif-time { font-size: 11px; color: var(--text-muted); margin-top: 4px; }

/* Mobile */
@media (max-width: 600px) {
  .topbar { padding: 0 0.6rem; }
  .logo-text { font-size: 15px; }
  .nav-center { gap: 0; }
  .nav-center a { padding: 5px 7px; font-size: 0; gap: 0; }
  .nav-center a svg { width: 18px; height: 18px; }
  .nav-right { gap: 3px; }
  .icon-btn, .theme-btn { width: 30px; height: 30px; }
  .user-nav-btn { width: 30px !important; height: 30px !important; }
  .profile-menu-btn { width: 30px !important; height: 30px !important; }
  .theme-drawer { right: 0.5rem; }
  .notif-panel { right: 0.5rem; width: calc(100vw - 1rem); }
}
`;

  // ── 2. Inject CSS vào <head> ───────────────────────────────────────────────
  const style = document.createElement('style');
  style.id = 'navbar-shared-css';
  style.textContent = CSS;
  document.head.appendChild(style);

  // ── 3. Xác định trang hiện tại để đánh dấu active ─────────────────────────
  const scriptTag = document.currentScript;
  const currentPage = scriptTag ? scriptTag.getAttribute('data-page') : '';
  // Fallback: đoán từ tên file
  const pageName = currentPage || window.location.pathname.split('/').pop().replace('.html','') || 'index';

  function isActive(page) {
    if (pageName === page) return ' class="active"';
    if (page === 'home' && (pageName === 'index' || pageName === '')) return ' class="active"';
    return '';
  }

  // ── 4. HTML cho navbar ─────────────────────────────────────────────────────
  const navbarHTML = `
<nav class="topbar" id="shared-topbar">
  <a class="logo" href="index.html">
    <span class="logo-text">Peach Luku</span>
  </a>

  <div class="nav-center">
    <a href="index.html"${isActive('home')}>
      <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/></svg>
      Trang chủ
    </a>
    <a href="library.html"${isActive('library')}>
      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
      Thể loại
    </a>
    <a href="#" class="nav-notif-btn" id="navNotifBtn" title="Thông báo chương mới">
      <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      <span class="notif-dot" id="notifDot" style="display:none"></span>
      Thông báo
    </a>
  </div>

  <div class="nav-right">
    <button class="theme-btn" id="themeBtnShared" title="Đổi theme">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    </button>
    <div class="profile-menu-wrap" id="profileMenuWrap">
      <button class="icon-btn profile-menu-btn" id="profileMenuBtn" title="Hồ sơ & Tùy chọn">
        <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </button>
      <div class="profile-dropdown" id="profileDropdown">
        <a class="profile-dropdown-item" href="profile.html">
          <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Hồ sơ của tôi
        </a>
        <a class="profile-dropdown-item" href="search.html">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Tìm kiếm
        </a>
        <a class="profile-dropdown-item" href="library.html">
          <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          Bảng xếp hạng
        </a>
        <a class="profile-dropdown-item" href="profile.html">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          Theo dõi
        </a>
        <a class="profile-dropdown-item" href="profile.html">
          <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          Lịch sử đọc
        </a>
        <a class="profile-dropdown-item" href="profile.html">
          <svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          Bookmark
        </a>
      </div>
    </div>
  </div>
</nav>

<!-- THEME DRAWER -->
<div class="theme-drawer" id="theme-drawer">
  <div class="theme-drawer-title">🎨 Đổi nền</div>
  <div class="theme-swatches">
    <div><div class="swatch" style="background:#FDF6F2;border:2px solid #F2A882" data-theme="light" title="Light"></div><div class="swatch-label">Light</div></div>
    <div><div class="swatch" style="background:#1a1a1a" data-theme="dark" title="Dark"></div><div class="swatch-label">Dark</div></div>
    <div><div class="swatch" style="background:#f5f0e8;border:2px solid #A67C52" data-theme="sepia" title="Sepia"></div><div class="swatch-label">Sepia</div></div>
    <div><div class="swatch" style="background:#e8f0fe;border:2px solid #4a7de0" data-theme="blue" title="Blue"></div><div class="swatch-label">Blue</div></div>
    <div><div class="swatch" style="background:#fff0f6;border:2px solid #e876a0" data-theme="pink" title="Pink"></div><div class="swatch-label">Pink</div></div>
    <div><div class="swatch" style="background:#f0ebff;border:2px solid #8a5de0" data-theme="purple" title="Purple"></div><div class="swatch-label">Purple</div></div>
    <div><div class="swatch" style="background:#f0f0f0;border:2px solid #777" data-theme="gray" title="Gray"></div><div class="swatch-label">Gray</div></div>
    <div><div class="swatch" style="background:#faf5ee;border:2px solid #f26522" data-theme="wattpad" title="Wattpad"></div><div class="swatch-label">Wattpad</div></div>
  </div>
</div>

<!-- NOTIF PANEL -->
<div class="notif-panel" id="notifPanel">
  <div class="notif-panel-head">
    <div class="notif-panel-title">
      <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      Thông báo chương mới
    </div>
    <button class="notif-close-btn" id="notifCloseBtn">
      <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <div class="notif-list" id="notifList">
    <div class="notif-empty">Đang tải thông báo...</div>
  </div>
</div>
`;

  // ── 5. Inject HTML vào đầu <body> ──────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    // Chèn navbar vào đầu body (trước mọi thứ khác)
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);

    initNavbar();
  });

  // ── 6. Logic navbar ────────────────────────────────────────────────────────
  function initNavbar() {
    // Theme: áp dụng ngay
    const savedTheme = localStorage.getItem('plTheme') || 'light';
    document.body.className = (document.body.className.replace(/theme-\S+/g, '') + ' theme-' + savedTheme).trim();

    // Đánh dấu swatch active
    document.querySelectorAll('.swatch[data-theme]').forEach(s => {
      s.classList.toggle('active', s.dataset.theme === savedTheme);
      s.addEventListener('click', function () {
        setTheme(this.dataset.theme, this);
      });
    });

    // Theme drawer toggle
    const themeBtn = document.getElementById('themeBtnShared');
    const themeDrawer = document.getElementById('theme-drawer');
    if (themeBtn) themeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      themeDrawer.classList.toggle('open');
    });

    // Notif panel
    const notifBtn = document.getElementById('navNotifBtn');
    const notifPanel = document.getElementById('notifPanel');
    const notifClose = document.getElementById('notifCloseBtn');
    if (notifBtn) notifBtn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      notifPanel.classList.toggle('open');
      if (notifPanel.classList.contains('open')) {
        loadNotifications();
        const dd = document.getElementById('profileDropdown');
        if (dd) dd.classList.remove('open');
      }
    });
    if (notifClose) notifClose.addEventListener('click', function () {
      notifPanel.classList.remove('open');
    });

    // Profile dropdown
    const profileBtn = document.getElementById('profileMenuBtn');
    if (profileBtn) profileBtn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      const dd = document.getElementById('profileDropdown');
      dd.classList.toggle('open');
      if (notifPanel) notifPanel.classList.remove('open');
    });

    // Click ngoài để đóng
    document.addEventListener('click', function (e) {
      const wrap = document.getElementById('profileMenuWrap');
      const dd = document.getElementById('profileDropdown');
      if (wrap && dd && !wrap.contains(e.target)) dd.classList.remove('open');

      if (themeDrawer && themeBtn && !themeDrawer.contains(e.target) && !themeBtn.contains(e.target)) {
        themeDrawer.classList.remove('open');
      }
      if (notifPanel && notifBtn && !notifPanel.contains(e.target) && !notifBtn.contains(e.target)) {
        notifPanel.classList.remove('open');
      }
    });

    // Cập nhật avatar nếu đã đăng nhập (Supabase)
    updateNavAvatar();
  }

  // ── 7. Hàm theme ──────────────────────────────────────────────────────────
  window.setTheme = function (name, el) {
    document.body.className = (document.body.className.replace(/theme-\S+/g, '') + ' theme-' + name).trim();
    localStorage.setItem('plTheme', name);
    document.querySelectorAll('.swatch[data-theme]').forEach(s => s.classList.remove('active'));
    if (el) el.classList.add('active');
  };

  // Tương thích với code cũ gọi toggleThemeDrawer()
  window.toggleThemeDrawer = function () {
    const d = document.getElementById('theme-drawer');
    if (d) d.classList.toggle('open');
  };
  window.toggleNotifPanel = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const p = document.getElementById('notifPanel');
    if (p) {
      p.classList.toggle('open');
      if (p.classList.contains('open')) loadNotifications();
    }
  };
  window.closeNotifPanel = function () {
    const p = document.getElementById('notifPanel');
    if (p) p.classList.remove('open');
  };
  window.toggleProfileMenu = function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const dd = document.getElementById('profileDropdown');
    if (dd) dd.classList.toggle('open');
  };

  // ── 8. Load avatar từ Supabase session ────────────────────────────────────
  async function updateNavAvatar() {
    try {
      if (typeof supabase === 'undefined') return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const userId = session.user.id;
      const { data: profile } = await supabase.from('profiles').select('avatar_url, display_name').eq('id', userId).single();
      if (!profile) return;
      const btn = document.getElementById('profileMenuBtn');
      if (!btn) return;
      if (profile.avatar_url) {
        btn.classList.add('has-avatar');
        const img = document.createElement('img');
        img.src = profile.avatar_url;
        img.alt = profile.display_name || '';
        btn.innerHTML = '';
        btn.appendChild(img);
      }
    } catch (err) {
      // Không có session hoặc lỗi — bỏ qua
    }
  }

  // ── 9. Load notifications ──────────────────────────────────────────────────
  async function loadNotifications() {
    const listEl = document.getElementById('notifList');
    if (!listEl) return;
    try {
      if (typeof supabase === 'undefined') {
        listEl.innerHTML = '<div class="notif-empty">Chưa kết nối dữ liệu 🐹</div>';
        return;
      }
      const { data: chapters } = await supabase.from('chapters')
        .select('id, title, story_id, created_at, stories(title, cover_url)')
        .order('created_at', { ascending: false })
        .limit(20);
      if (!chapters || chapters.length === 0) {
        listEl.innerHTML = '<div class="notif-empty">Chưa có chương mới nào 🐹</div>';
        return;
      }
      document.getElementById('notifDot').style.display = 'block';
      listEl.innerHTML = chapters.map(ch => {
        const story = ch.stories || {};
        const ts = ch.created_at ? new Date(ch.created_at) : null;
        const timeStr = ts ? ts.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
        return `
<a class="notif-item" href="chapter.html?story=${ch.story_id}&chapter=${ch.id}">
  ${story.cover_url ? `<img class="notif-cover" src="${story.cover_url}" alt="">` : ''}
  <div class="notif-info">
    <div class="notif-story-title">${story.title || 'Truyện'}</div>
    <div class="notif-ch-title">${ch.title || 'Chương mới'}</div>
    <div class="notif-time">${timeStr}</div>
  </div>
</a>`;
      }).join('');
    } catch (err) {
      listEl.innerHTML = '<div class="notif-empty">Không tải được thông báo 🐹</div>';
    }
  }

  // ── 10. Áp dụng theme ngay khi script load (tránh flash) ──────────────────
  (function applyThemeImmediately() {
    const t = localStorage.getItem('plTheme') || 'light';
    document.documentElement.classList.add('theme-' + t);
    // Sẽ được set lại vào body sau khi DOMContentLoaded
  })();

})();
