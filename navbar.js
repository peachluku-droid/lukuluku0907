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

  // ── 0. Inject Google Fonts nếu chưa có ──────────────────────────────────
  if (!document.querySelector('link[href*="Nunito"]')) {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap';
    document.head.appendChild(fontLink);
  }

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
.logo-text { font-family: 'Nunito', sans-serif; font-size: 18px; font-weight: 800; color: var(--peach); letter-spacing: -0.3px; }

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
  display: none; position: fixed; right: 1rem; top: 60px;
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
.profile-dropdown-divider { height: 1px; background: var(--border, #eee); margin: 4px 8px; }
.dd-auth-row {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 10px; margin: 2px 0;
}
.dd-auth-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
  padding: 7px 6px; border-radius: 9px;
  font-size: 12px; font-weight: 800; color: var(--peach, #e8835a);
  text-decoration: none; background: var(--peach-light, #fdf0ea);
  transition: background .15s, color .15s;
}
.dd-auth-btn:hover { background: var(--peach, #e8835a); color: #fff; }
.dd-auth-btn svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }
.dd-auth-sep { color: var(--text-muted, #aaa); font-size: 13px; flex-shrink: 0; }

/* Auth modal */
.nb-auth-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.45); backdrop-filter: blur(4px);
  display: none; align-items: center; justify-content: center; padding: 16px;
}
.nb-auth-overlay.open { display: flex; }
.nb-auth-modal {
  background: var(--bg2, #fff); border-radius: 24px;
  width: 100%; max-width: 400px; max-height: 90vh; overflow-y: auto;
  padding: 28px 28px 24px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.22);
  position: relative; animation: nbAuthIn .2s ease;
}
@keyframes nbAuthIn { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:none; } }
.nb-auth-close {
  position: absolute; top: 16px; right: 16px;
  background: var(--bg, #f5f5f5); border: none; border-radius: 50%; width: 32px; height: 32px;
  cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted, #999);
  transition: background .15s;
}
.nb-auth-close:hover { background: var(--border, #eee); }
.nb-auth-close svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2.5; stroke-linecap: round; }
.nb-auth-logo { font-family: 'Nunito',sans-serif; font-size: 20px; font-weight: 900; color: var(--peach, #e8835a); text-align: center; margin-bottom: 16px; letter-spacing: -0.3px; }
.nb-tab-bar { display: flex; gap: 6px; background: var(--bg, #f5f5f5); border-radius: 12px; padding: 4px; margin-bottom: 20px; }
.nb-tab {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
  padding: 8px 10px; border: none; border-radius: 9px; cursor: pointer;
  font-family: 'Nunito',sans-serif; font-size: 13px; font-weight: 700;
  background: transparent; color: var(--text-muted, #999); transition: all .15s;
}
.nb-tab svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.nb-tab.active { background: var(--bg2, #fff); color: var(--peach, #e8835a); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.nb-pane { display: none; }
.nb-pane.active { display: block; }
.nb-pane-sub { font-size: 13px; color: var(--text-muted, #999); margin-bottom: 16px; text-align: center; }
.nb-alert { border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 600; margin-bottom: 14px; }
.nb-alert-err { background: #fff0f0; color: #d04040; border: 1px solid #fcc; }
.nb-alert-ok  { background: #f0fff6; color: #3a9a60; border: 1px solid #b2eac9; }
.nb-field { margin-bottom: 14px; }
.nb-field label { display: block; font-size: 12px; font-weight: 700; color: var(--text-muted, #999); margin-bottom: 5px; }
.nb-input-wrap { position: relative; }
.nb-input {
  width: 100%; padding: 10px 14px; border: 1.5px solid var(--border, #e8e8e8);
  border-radius: 10px; font-family: 'Nunito',sans-serif; font-size: 14px; font-weight: 600;
  background: var(--bg, #fafafa); color: var(--text, #222);
  outline: none; transition: border .15s; box-sizing: border-box;
}
.nb-input:focus { border-color: var(--peach, #e8835a); background: var(--bg2, #fff); }
.nb-input-wrap .nb-input { padding-right: 40px; }
.nb-eye {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: var(--text-muted, #aaa); padding: 4px;
}
.nb-eye svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.nb-username-hint { font-size: 11px; font-weight: 700; min-height: 16px; margin-top: 3px; }
.nb-check-row { display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 16px; cursor: pointer; }
.nb-check-row input { accent-color: var(--peach, #e8835a); width: 15px; height: 15px; }
.nb-submit {
  width: 100%; padding: 12px; border: none; border-radius: 12px;
  background: var(--peach, #e8835a); color: #fff;
  font-family: 'Nunito',sans-serif; font-size: 15px; font-weight: 800;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: background .15s; margin-bottom: 14px;
}
.nb-submit:hover { background: var(--peach-dark, #c06030); }
.nb-submit:disabled { opacity: .6; cursor: not-allowed; }
.nb-spinner {
  width: 16px; height: 16px; border: 2.5px solid rgba(255,255,255,0.4);
  border-top-color: #fff; border-radius: 50%; animation: nbSpin .7s linear infinite;
}
@keyframes nbSpin { to { transform: rotate(360deg); } }
.nb-footer { font-size: 13px; color: var(--text-muted, #999); text-align: center; }
.nb-link { color: var(--peach, #e8835a); font-weight: 700; cursor: pointer; text-decoration: none; }
.nb-link:hover { text-decoration: underline; }

/* Modal gợi ý truyện */
.suggest-overlay {
  display: none; align-items: center; justify-content: center; padding: 20px;
}
.suggest-overlay.open { display: flex; }
.suggest-modal {
  background: var(--bg2, #fff); border-radius: 20px;
  width: 100%; max-width: 440px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  overflow: hidden; animation: suggestIn .2s ease;
}
@keyframes suggestIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
.suggest-head {
  background: var(--peach, #e8835a); padding: 16px 20px;
  display: flex; align-items: center; gap: 10px;
}
.suggest-head-title {
  flex: 1; font-size: 14px; font-weight: 900; color: #fff;
  display: flex; align-items: center; gap: 7px;
}
.suggest-head-title svg { width: 16px; height: 16px; stroke: #fff; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.suggest-close {
  background: rgba(255,255,255,.2); border: none; cursor: pointer;
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; color: #fff;
  transition: background .15s;
}
.suggest-close:hover { background: rgba(255,255,255,.35); }
.suggest-close svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.suggest-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.suggest-field label {
  display: block; font-size: 11px; font-weight: 800;
  color: var(--text-muted, #aaa); text-transform: uppercase;
  letter-spacing: .5px; margin-bottom: 6px;
}
.suggest-input, .suggest-select, .suggest-textarea {
  width: 100%; padding: 10px 14px; border: 1.5px solid var(--border, #eee);
  border-radius: 12px; font-family: 'Nunito', sans-serif;
  font-size: 13px; color: var(--text, #222);
  background: var(--bg, #fafafa); outline: none;
  transition: border .15s; box-sizing: border-box;
}
.suggest-input:focus, .suggest-select:focus, .suggest-textarea:focus {
  border-color: var(--peach, #e8835a);
}
.suggest-textarea { resize: vertical; min-height: 80px; }
.suggest-footer { padding: 0 20px 20px; display: flex; gap: 10px; }
.suggest-submit {
  flex: 1; padding: 12px; border: none; border-radius: 12px;
  background: var(--peach, #e8835a); color: #fff;
  font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
  cursor: pointer; transition: background .15s;
}
.suggest-submit:hover { background: var(--peach-dark, #c96b3f); }
.suggest-submit:disabled { opacity: .6; cursor: not-allowed; }
.suggest-cancel {
  padding: 12px 20px; border: 1.5px solid var(--border, #eee); border-radius: 12px;
  background: none; font-family: 'Nunito', sans-serif; font-size: 13px;
  font-weight: 700; color: var(--text-muted, #aaa); cursor: pointer;
}
.suggest-success {
  text-align: center; padding: 20px;
  font-size: 14px; font-weight: 700; color: var(--peach, #e8835a);
  display: none;
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
        <a class="profile-dropdown-item" href="search.html">
          <svg
