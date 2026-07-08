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
  padding: 0;
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
.profile-menu-wrap { position: static; }
.profile-dropdown {
  position: fixed; top: 0; right: -280px; bottom: 0; z-index: 400;
  width: 260px;
  background: var(--bg2); border-left: 1px solid var(--border);
  padding: 0; display: flex; flex-direction: column;
  box-shadow: -6px 0 28px rgba(0,0,0,0.13);
  transition: right .28s cubic-bezier(.4,0,.2,1);
  overflow-y: auto;
}
.profile-dropdown.open { right: 0; }
.profile-sidebar-overlay {
  display: none; position: fixed; inset: 0; z-index: 399;
  background: rgba(0,0,0,0.28);
}
.profile-sidebar-overlay.open { display: block; }
.profile-sidebar-header {
  padding: 14px 16px; display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid var(--border); flex-shrink: 0;
  background: var(--peach);
}
.profile-sidebar-header span { font-size: 13px; font-weight: 800; color: #fff; flex: 1; }
.profile-sidebar-close {
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,.85); padding: 4px;
  display: flex; align-items: center; border-radius: 6px; transition: background .15s;
}
.profile-sidebar-close:hover { background: rgba(255,255,255,.2); }
.profile-sidebar-close svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 2.2; }
.profile-sidebar-body { padding: 8px; display: flex; flex-direction: column; gap: 2px; flex: 1; }
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
  border-radius: 0; padding: 16px; min-width: 210px;
  box-shadow: 0 14px 36px rgba(141,27,42,.14); z-index: 200;
}
.theme-drawer.open { display: block; }
.theme-drawer-title { font-size: 12px; font-weight: 800; color: var(--text-muted); margin-bottom: 10px; text-transform: uppercase; letter-spacing: .5px; }
.theme-swatches { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.swatch { width: 38px; height: 38px; border-radius: 50%; border: 3px solid transparent; cursor: pointer; transition: all .15s; }
.swatch.active { border-color: var(--peach); box-shadow: 0 0 0 2px var(--bg2), 0 0 0 4px var(--peach); }
.swatch:hover { transform: scale(1.12); }
.swatch-label { font-size: 10px; text-align: center; color: var(--text-muted); margin-top: 3px; font-weight: 700; }
.swatch-locked { position: relative; cursor: not-allowed; opacity: 0.6; display: flex; align-items: center; justify-content: center; }
.swatch-locked:hover { transform: scale(1.05); opacity: 0.75; }
.swatch-lock-icon { width: 16px; height: 16px; flex-shrink: 0; }

/* Notif panel */
.notif-panel {
  display: none; flex-direction: column;
  position: absolute; right: 3.5rem; top: 56px;
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: 20px; width: 300px;
  box-shadow: 0 14px 36px rgba(141,27,42,.14); z-index: 200; overflow: hidden;
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
  .topbar { padding: 0; }
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
    <a href="index.html"${isActive('home')} title="Trang chủ">
      <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/></svg>
    </a>
    <a href="library.html"${isActive('library')} title="Thư viện">
      <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    </a>
    <a href="#" class="nav-notif-btn" id="navNotifBtn" title="Thông báo chương mới">
      <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      <span class="notif-dot" id="notifDot" style="display:none"></span>
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
      <div class="profile-sidebar-overlay" id="profileSidebarOverlay" onclick="closeProfileSidebar()"></div>
      <div class="profile-dropdown" id="profileDropdown">
        <div class="profile-sidebar-header">
          <span>Menu</span>
          <button class="profile-sidebar-close" onclick="closeProfileSidebar()">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="profile-sidebar-body">
        <a class="profile-dropdown-item" href="search.html">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Tìm kiếm
        </a>
        <div class="dd-auth-row dd-logged-out">
          <a class="dd-auth-btn" href="#" onclick="openAuthModal('login');return false;">
            <svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Đăng nhập
          </a>
          <span class="dd-auth-sep">/</span>
          <a class="dd-auth-btn" href="#" onclick="openAuthModal('signup');return false;">
            <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            Đăng ký
          </a>
        </div>
        <a class="profile-dropdown-item dd-logged-in" href="#" id="dd-signout" style="display:none">
          <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Đăng xuất
        </a>
        <a class="profile-dropdown-item" href="#" onclick="return false">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Nhúng truyện QT
        </a>
        <a class="profile-dropdown-item" href="#" onclick="openSuggestForm(event)">
          <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Gợi ý truyện
        </a>
        <div class="profile-dropdown-divider dd-logged-in" style="display:none"></div>
        <a class="profile-dropdown-item dd-logged-in" href="profile.html" style="display:none">
          <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Hồ sơ của tôi
        </a>
        </div><!-- /profile-sidebar-body -->
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
    <div><div class="swatch swatch-locked" style="background:#e8f0fe;border:2px solid #4a7de0" data-theme="blue" title="Chỉ Admin" data-locked="true"><svg class="swatch-lock-icon" viewBox="0 0 24 24" fill="none" stroke="#4a7de0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div><div class="swatch-label">Blue</div></div>
    <div><div class="swatch swatch-locked" style="background:#fff0f6;border:2px solid #e876a0" data-theme="pink" title="Chỉ Admin" data-locked="true"><svg class="swatch-lock-icon" viewBox="0 0 24 24" fill="none" stroke="#e876a0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div><div class="swatch-label">Pink</div></div>
    <div><div class="swatch swatch-locked" style="background:#f0ebff;border:2px solid #8a5de0" data-theme="purple" title="Chỉ Admin" data-locked="true"><svg class="swatch-lock-icon" viewBox="0 0 24 24" fill="none" stroke="#8a5de0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div><div class="swatch-label">Purple</div></div>
    <div><div class="swatch swatch-locked" style="background:#faf5ee;border:2px solid #f26522" data-theme="warm" title="Chỉ Admin" data-locked="true"><svg class="swatch-lock-icon" viewBox="0 0 24 24" fill="none" stroke="#f26522" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div><div class="swatch-label">Warm</div></div>
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

<!-- MODAL GỢI Ý TRUYỆN -->
<div class="suggest-overlay" id="suggestOverlay">
  <div class="suggest-modal">
    <div class="suggest-head">
      <div class="suggest-head-title">
        <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        Gợi ý truyện cho Peach Luku
      </div>
      <button class="suggest-close" onclick="closeSuggestForm()">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div id="suggestFormWrap">
      <div class="suggest-body">
        <div class="suggest-field">
          <label>📖 Tên truyện *</label>
          <input class="suggest-input" id="sg-title" type="text" placeholder="Tên bộ truyện bạn muốn gợi ý..." maxlength="200">
        </div>
        <div class="suggest-field">
          <label>🏷️ Thể loại</label>
          <input class="suggest-input" id="sg-genre" type="text" placeholder="BL, GL, dị giới, hài, ngôn tình..." maxlength="100">
        </div>
        <div class="suggest-field">
          <label>🔗 Link file raw (nếu có)</label>
          <input class="suggest-input" id="sg-link" type="url" placeholder="https://drive.google.com/... hoặc link khác">
        </div>
        <div class="suggest-field">
          <label>💬 Review ngắn *</label>
          <textarea class="suggest-textarea" id="sg-review" placeholder="Bạn thấy truyện này thế nào? Tại sao muốn recommend cho mọi người đọc?..." maxlength="500"></textarea>
        </div>
      </div>
      <div class="suggest-footer">
        <button class="suggest-cancel" onclick="closeSuggestForm()">Huỷ</button>
        <button class="suggest-submit" id="sg-submit-btn" onclick="submitSuggest()">
          Gửi gợi ý 🐹
        </button>
      </div>
    </div>
    <div class="suggest-success" id="suggestSuccess">
      🎉 Cảm ơn bạn đã gợi ý!<br>
      <span style="font-size:12px;font-weight:400;color:var(--text-muted,#aaa)">Peach Luku sẽ xem xét và edit sớm nhé 🍑</span>
    </div>
  </div>
</div>

<!-- MODAL ĐĂNG NHẬP / ĐĂNG KÝ -->
<div class="nb-auth-overlay" id="nbAuthOverlay" onclick="closeAuthModal(event)">
  <div class="nb-auth-modal">
    <button class="nb-auth-close" onclick="closeAuthModal()">
      <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <div class="nb-auth-logo">🍑 Peach Luku</div>

    <!-- TAB BAR -->
    <div class="nb-tab-bar">
      <button class="nb-tab active" id="nb-tab-login" onclick="nbSwitchTab('login')">
        <svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        Đăng nhập
      </button>
      <button class="nb-tab" id="nb-tab-signup" onclick="nbSwitchTab('signup')">
        <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
        Đăng ký
      </button>
    </div>

    <!-- PANE: LOGIN -->
    <div class="nb-pane active" id="nb-pane-login">
      <div class="nb-pane-sub">Đăng nhập để tiếp tục đọc truyện</div>
      <div class="nb-alert nb-alert-err" id="nb-login-err" style="display:none"></div>
      <div class="nb-field">
        <label>Email</label>
        <input class="nb-input" id="nb-login-email" type="email" placeholder="you@email.com" autocomplete="email" onkeydown="if(event.key==='Enter')nbDoLogin()">
      </div>
      <div class="nb-field">
        <label>Mật khẩu</label>
        <div class="nb-input-wrap">
          <input class="nb-input" id="nb-login-pw" type="password" placeholder="••••••••" autocomplete="current-password" onkeydown="if(event.key==='Enter')nbDoLogin()">
          <button class="nb-eye" type="button" onclick="nbToggleEye('nb-login-pw',this)">
            <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </div>
      <div style="text-align:right;margin:-4px 0 12px">
        <a class="nb-link" onclick="nbSwitchTab('reset')">Quên mật khẩu?</a>
      </div>
      <button class="nb-submit" id="nb-login-btn" onclick="nbDoLogin()">
        <span class="nb-spinner" id="nb-login-spinner" style="display:none"></span>
        <span id="nb-login-btn-text">Đăng nhập</span>
      </button>
      <div class="nb-footer">Chưa có tài khoản? <a class="nb-link" onclick="nbSwitchTab('signup')">Đăng ký ngay</a></div>
    </div>

    <!-- PANE: SIGNUP -->
    <div class="nb-pane" id="nb-pane-signup">
      <div class="nb-pane-sub">Tạo tài khoản để lưu tiến độ đọc</div>
      <div class="nb-alert nb-alert-err" id="nb-signup-err" style="display:none"></div>
      <div class="nb-alert nb-alert-ok" id="nb-signup-ok" style="display:none">🎉 Đăng ký thành công! Kiểm tra email để xác nhận tài khoản.</div>
      <div class="nb-field">
        <label>Username</label>
        <input class="nb-input" id="nb-signup-name" type="text" placeholder="vd: hamster_doc_truyen" oninput="nbCheckUsername(this.value)" autocomplete="name" onkeydown="if(event.key==='Enter')nbDoSignup()">
        <div class="nb-username-hint" id="nb-username-hint"></div>
      </div>
      <div class="nb-field">
        <label>Email</label>
        <input class="nb-input" id="nb-signup-email" type="email" placeholder="you@email.com" autocomplete="email" onkeydown="if(event.key==='Enter')nbDoSignup()">
      </div>
      <div class="nb-field">
        <label>Mật khẩu</label>
        <div class="nb-input-wrap">
          <input class="nb-input" id="nb-signup-pw" type="password" placeholder="Tối thiểu 6 ký tự" autocomplete="new-password" onkeydown="if(event.key==='Enter')nbDoSignup()">
          <button class="nb-eye" type="button" onclick="nbToggleEye('nb-signup-pw',this)">
            <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </div>
      <div class="nb-field">
        <label>Xác nhận mật khẩu</label>
        <div class="nb-input-wrap">
          <input class="nb-input" id="nb-signup-pw2" type="password" placeholder="Nhập lại mật khẩu" autocomplete="new-password" onkeydown="if(event.key==='Enter')nbDoSignup()">
          <button class="nb-eye" type="button" onclick="nbToggleEye('nb-signup-pw2',this)">
            <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </div>
      <label class="nb-check-row">
        <input type="checkbox" id="nb-signup-agree">
        <span>Tôi đồng ý với <a class="nb-link" href="#">điều khoản sử dụng</a></span>
      </label>
      <button class="nb-submit" id="nb-signup-btn" onclick="nbDoSignup()">
        <span class="nb-spinner" id="nb-signup-spinner" style="display:none"></span>
        <span id="nb-signup-btn-text">Tạo tài khoản</span>
      </button>
      <div class="nb-footer">Đã có tài khoản? <a class="nb-link" onclick="nbSwitchTab('login')">Đăng nhập</a></div>
    </div>

    <!-- PANE: RESET -->
    <div class="nb-pane" id="nb-pane-reset">
      <div class="nb-pane-sub">Nhập email để nhận link đặt lại mật khẩu</div>
      <div class="nb-alert nb-alert-err" id="nb-reset-err" style="display:none"></div>
      <div class="nb-alert nb-alert-ok" id="nb-reset-ok" style="display:none">📧 Đã gửi link! Kiểm tra hộp thư của bạn.</div>
      <div class="nb-field">
        <label>Email</label>
        <input class="nb-input" id="nb-reset-email" type="email" placeholder="you@email.com" autocomplete="email" onkeydown="if(event.key==='Enter')nbDoReset()">
      </div>
      <button class="nb-submit" id="nb-reset-btn" onclick="nbDoReset()">
        <span class="nb-spinner" id="nb-reset-spinner" style="display:none"></span>
        <span id="nb-reset-btn-text">Gửi link đặt lại</span>
      </button>
      <div class="nb-footer"><a class="nb-link" onclick="nbSwitchTab('login')">← Quay lại đăng nhập</a></div>
    </div>
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
        if (this.dataset.locked === 'true') return; // Chỉ Admin mới dùng được
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

    // Profile → sidebar
    const profileBtn = document.getElementById('profileMenuBtn');
    if (profileBtn) profileBtn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      const dd = document.getElementById('profileDropdown');
      const ov = document.getElementById('profileSidebarOverlay');
      dd.classList.toggle('open');
      if (ov) ov.classList.toggle('open', dd.classList.contains('open'));
      if (notifPanel) notifPanel.classList.remove('open');
    });
    window.closeProfileSidebar = function() {
      const dd = document.getElementById('profileDropdown');
      const ov = document.getElementById('profileSidebarOverlay');
      if (dd) dd.classList.remove('open');
      if (ov) ov.classList.remove('open');
    };

    // Click ngoài để đóng (sidebar dùng overlay thay thế)
    document.addEventListener('click', function (e) {
      const wrap = document.getElementById('profileMenuWrap');
      const dd = document.getElementById('profileDropdown');
      // Sidebar đóng qua overlay click, không cần check ngoài nữa

      if (themeDrawer && themeBtn && !themeDrawer.contains(e.target) && !themeBtn.contains(e.target)) {
        themeDrawer.classList.remove('open');
      }
      if (notifPanel && notifBtn && !notifPanel.contains(e.target) && !notifBtn.contains(e.target)) {
        notifPanel.classList.remove('open');
      }
    });

    // Cập nhật auth state dropdown (bao gồm avatar và onAuthStateChange)
    updateDropdownAuthState();
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

  // ── 8. Chờ Supabase client sẵn sàng (retry tối đa ~3s) ───────────────────
  function waitForSupabase(callback, maxWait) {
    maxWait = maxWait || 3000;
    const step = 80;
    let elapsed = 0;
    function check() {
      const _sb = window.sb || window.supabase;
      if (_sb) { callback(_sb); return; }
      elapsed += step;
      if (elapsed < maxWait) setTimeout(check, step);
    }
    check();
  }

  // Load avatar từ Supabase session
  async function updateNavAvatar(_sb) {
    try {
      if (!_sb) _sb = window.sb || window.supabase; if (!_sb) return;
      const { data: { session } } = await _sb.auth.getSession();
      if (!session) return;
      const userId = session.user.id;
      const { data: profile } = await _sb.from('profiles').select('avatar_url, display_name').eq('id', userId).single();
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
      const _sb = window.sb || window.supabase;
      if (!_sb) { listEl.innerHTML = '<div class="notif-empty">Chưa kết nối dữ liệu 🐹</div>'; return; }

      // Cần đăng nhập
      const { data: { session } } = await _sb.auth.getSession();
      if (!session) {
        listEl.innerHTML = '<div class="notif-empty">Đăng nhập để xem thông báo</div>';
        return;
      }
      const userId = session.user.id;

      // 1. Lấy danh sách truyện đang theo dõi + đã lưu
      const [followRes, bookmarkRes] = await Promise.all([
        _sb.from('follows').select('story_id').eq('user_id', userId),
        _sb.from('bookmarks').select('story_id').eq('user_id', userId)
      ]);
      const followIds   = (followRes.data   || []).map(r => r.story_id);
      const bookmarkIds = (bookmarkRes.data || []).map(r => r.story_id);
      const trackedIds  = [...new Set([...followIds, ...bookmarkIds])];

      const items = [];

      // 2. Chương mới từ truyện đang theo dõi / đã lưu
      if (trackedIds.length > 0) {
        const { data: chapters } = await _sb.from('chapters')
          .select('id, title, story_id, created_at, stories(title, cover_url)')
          .in('story_id', trackedIds)
          .order('created_at', { ascending: false })
          .limit(15);
        (chapters || []).forEach(ch => {
          items.push({ type: 'chapter', ts: ch.created_at, ch, story: ch.stories || {} });
        });
      }

      // 3. Ai đó follow mình
      const { data: followers } = await _sb.from('user_follows')
        .select('follower_id, created_at, profiles!user_follows_follower_id_fkey(display_name, avatar_url)')
        .eq('following_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);
      (followers || []).forEach(f => {
        items.push({ type: 'follow', ts: f.created_at, prof: f.profiles || {} });
      });

      // 4. Reply comment
      const { data: replies } = await _sb.from('comments')
        .select('id, body, created_at, story_id, stories(title, cover_url)')
        .eq('reply_to_user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);
      (replies || []).forEach(c => {
        items.push({ type: 'comment', ts: c.created_at, c, story: c.stories || {} });
      });

      if (items.length === 0) {
        listEl.innerHTML = '<div class="notif-empty">Chưa có thông báo nào 🐹</div>';
        return;
      }

      // Sắp xếp mới nhất lên trước
      items.sort((a, b) => (b.ts || '').localeCompare(a.ts || ''));
      document.getElementById('notifDot').style.display = 'block';

      listEl.innerHTML = items.map(item => {
        const timeStr = item.ts
          ? new Date(item.ts).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' })
          : '';
        if (item.type === 'chapter') {
          const { ch, story } = item;
          return `<a class="notif-item" href="chapter.html?chapter=${ch.id}">
            ${story.cover_url ? `<img class="notif-cover" src="${story.cover_url}" alt="" loading="lazy">` : ''}
            <div class="notif-info">
              <div class="notif-story-title">${story.title || 'Truyện'}</div>
              <div class="notif-ch-title">📖 ${ch.title || 'Chương mới'}</div>
              <div class="notif-time">${timeStr}</div>
            </div>
          </a>`;
        }
        if (item.type === 'follow') {
          const { prof } = item;
          return `<div class="notif-item">
            ${prof.avatar_url ? `<img class="notif-cover" src="${prof.avatar_url}" alt="" style="border-radius:50%" loading="lazy">` : '<div class="notif-cover" style="background:#f3e4e7;display:flex;align-items:center;justify-content:center;font-size:18px">👤</div>'}
            <div class="notif-info">
              <div class="notif-story-title">👋 ${prof.display_name || 'Ai đó'} đã theo dõi bạn</div>
              <div class="notif-time">${timeStr}</div>
            </div>
          </div>`;
        }
        if (item.type === 'comment') {
          const { c, story } = item;
          return `<a class="notif-item" href="story.html?id=${c.story_id}">
            ${story.cover_url ? `<img class="notif-cover" src="${story.cover_url}" alt="" loading="lazy">` : ''}
            <div class="notif-info">
              <div class="notif-story-title">💬 Có người reply bình luận của bạn</div>
              <div class="notif-ch-title">${story.title || ''}</div>
              <div class="notif-time">${timeStr}</div>
            </div>
          </a>`;
        }
        return '';
      }).join('');
    } catch (err) {
      listEl.innerHTML = '<div class="notif-empty">Không tải được thông báo 🐹</div>';
    }
  }


  // ── Auth state: ẩn/hiện dd-logged-in / dd-logged-out ──────────────────────
  function applyAuthUI(session) {
    const loggedIn  = document.querySelectorAll('.dd-logged-in');
    const loggedOut = document.querySelectorAll('.dd-logged-out');
    if (session) {
      loggedIn.forEach(el  => { el.style.display = el.classList.contains('profile-dropdown-divider') ? 'block' : 'flex'; });
      loggedOut.forEach(el => el.style.display = 'none');
    } else {
      loggedIn.forEach(el  => el.style.display = 'none');
      loggedOut.forEach(el => el.style.display = 'flex');
    }
  }

  // Xử lý signout qua event delegation — chỉ gắn 1 lần duy nhất
  document.addEventListener('click', async function(e) {
    const signoutBtn = e.target.closest('#dd-signout');
    if (!signoutBtn) return;
    e.preventDefault();
    try {
      const _sb = window.sb || window.supabase;
      if (_sb) await _sb.auth.signOut();
    } catch(err) {}
    location.reload();
  });

  async function updateDropdownAuthState() {
    waitForSupabase(async function(_sb) {
      try {
        const { data: { session } } = await _sb.auth.getSession();
        applyAuthUI(session);
        if (session) updateNavAvatar(_sb);

        // Lắng nghe thay đổi auth (đăng nhập/đăng xuất ở tab khác hoặc trang khác)
        _sb.auth.onAuthStateChange(function(_event, newSession) {
          applyAuthUI(newSession);
          if (newSession) {
            updateNavAvatar(_sb);
          } else {
            const btn = document.getElementById('profileMenuBtn');
            if (btn) {
              btn.classList.remove('has-avatar');
              btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
            }
          }
        });
      } catch(e) {}
    });
  }

  // ── Modal gợi ý truyện ────────────────────────────────────────────────────
  window.openSuggestForm = function(e) {
    if (e) e.preventDefault();
    document.getElementById('profileDropdown').classList.remove('open');
    document.getElementById('suggestOverlay').classList.add('open');
    document.getElementById('suggestSuccess').style.display = 'none';
    document.getElementById('suggestFormWrap').style.display = '';
  };
  window.closeSuggestForm = function() {
    document.getElementById('suggestOverlay').classList.remove('open');
    // Reset form
    ['sg-title','sg-genre','sg-link','sg-review'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  };
  window.submitSuggest = async function() {
    const title  = document.getElementById('sg-title').value.trim();
    const genre  = document.getElementById('sg-genre').value.trim();
    const link   = document.getElementById('sg-link').value.trim();
    const review = document.getElementById('sg-review').value.trim();
    if (!title)  { alert('Vui lòng nhập tên truyện!'); return; }
    if (!review) { alert('Vui lòng viết review ngắn!'); return; }
    const btn = document.getElementById('sg-submit-btn');
    btn.disabled = true; btn.textContent = 'Đang gửi...';
    try {
      const _sbs = window.sb || window.supabase;
      if (_sbs) {
        const { data: { session } } = await _sbs.auth.getSession();
        await _sbs.from('story_suggestions').insert({
          title, genre, raw_link: link || null, review,
          user_id: session?.user?.id || null,
          submitted_at: new Date().toISOString()
        });
      }
      document.getElementById('suggestFormWrap').style.display = 'none';
      document.getElementById('suggestSuccess').style.display = 'block';
      setTimeout(closeSuggestForm, 2500);
    } catch(err) {
      alert('Gửi thất bại, thử lại nhé!');
    }
    btn.disabled = false; btn.textContent = 'Gửi gợi ý 🐹';
  };
  // Đóng khi click ngoài
  document.addEventListener('click', function(e) {
    const overlay = document.getElementById('suggestOverlay');
    if (overlay && e.target === overlay) closeSuggestForm();
  });

  // ── 10. Áp dụng theme ngay khi script load (tránh flash) ──────────────────
  (function applyThemeImmediately() {
    const t = localStorage.getItem('plTheme') || 'light';
    document.documentElement.classList.add('theme-' + t);
    // Sẽ được set lại vào body sau khi DOMContentLoaded
  })();

  // ── 11. Auth Modal ──────────────────────────────────────────────────────────
  window.openAuthModal = function(tab) {
    document.getElementById('profileDropdown').classList.remove('open');
    document.getElementById('nbAuthOverlay').classList.add('open');
    nbSwitchTab(tab || 'login');
    // Clear fields
    ['nb-login-email','nb-login-pw','nb-signup-name','nb-signup-email','nb-signup-pw','nb-signup-pw2','nb-reset-email'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    ['nb-login-err','nb-signup-err','nb-signup-ok','nb-reset-err','nb-reset-ok'].forEach(id => {
      const el = document.getElementById(id); if (el) el.style.display = 'none';
    });
    document.body.style.overflow = 'hidden';
  };

  window.closeAuthModal = function(e) {
    if (e && e.target !== document.getElementById('nbAuthOverlay')) return;
    document.getElementById('nbAuthOverlay').classList.remove('open');
    document.body.style.overflow = '';
  };

  window.nbSwitchTab = function(tab) {
    ['login','signup','reset'].forEach(t => {
      document.getElementById('nb-tab-' + t) && document.getElementById('nb-tab-' + t).classList.toggle('active', t === tab);
      document.getElementById('nb-pane-' + t).classList.toggle('active', t === tab);
    });
  };

  window.nbToggleEye = function(inputId, btn) {
    const inp = document.getElementById(inputId);
    const isHidden = inp.type === 'password';
    inp.type = isHidden ? 'text' : 'password';
    btn.innerHTML = isHidden
      ? '<svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
      : '<svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  };

  let nbUsernameTimer;
  window.nbCheckUsername = function(val) {
    const hint = document.getElementById('nb-username-hint');
    clearTimeout(nbUsernameTimer);
    if (!val || val.length < 2) { hint.textContent = ''; return; }
    hint.style.color = 'var(--text-muted,#aaa)'; hint.textContent = 'Đang kiểm tra...';
    nbUsernameTimer = setTimeout(async () => {
      try {
        const _sb = window.sb || window.supabase; if (!_sb) return;
        const { data } = await _sb.from('profiles').select('id').eq('display_name', val).maybeSingle();
        if (data) { hint.style.color = '#d04040'; hint.textContent = '✗ Username đã tồn tại'; }
        else       { hint.style.color = '#3a9a60'; hint.textContent = '✓ Username có thể dùng'; }
      } catch(e) { hint.textContent = ''; }
    }, 500);
  };

  window.nbDoLogin = async function() {
    const errEl = document.getElementById('nb-login-err');
    errEl.style.display = 'none';
    const email = document.getElementById('nb-login-email').value.trim();
    const pw    = document.getElementById('nb-login-pw').value;
    if (!email || !pw) { errEl.textContent = 'Vui lòng điền đầy đủ email và mật khẩu'; errEl.style.display = 'block'; return; }
    const btn = document.getElementById('nb-login-btn');
    const spinner = document.getElementById('nb-login-spinner');
    const txt = document.getElementById('nb-login-btn-text');
    btn.disabled = true; spinner.style.display = 'inline-block'; txt.textContent = 'Đang đăng nhập...';
    const _sb = window.sb || window.supabase;
    const { data, error } = await _sb.auth.signInWithPassword({ email, password: pw });
    if (error) {
      btn.disabled = false; spinner.style.display = 'none'; txt.textContent = 'Đăng nhập';
      const msg = error.message.includes('Invalid') ? 'Email hoặc mật khẩu không đúng'
                : error.message.includes('confirm') ? 'Vui lòng xác nhận email trước khi đăng nhập'
                : error.message;
      errEl.textContent = msg; errEl.style.display = 'block'; return;
    }
    // Đăng nhập thành công — reload ngay, không cần query thêm
    location.reload();
  };

  window.nbDoSignup = async function() {
    const errEl = document.getElementById('nb-signup-err');
    const okEl  = document.getElementById('nb-signup-ok');
    errEl.style.display = 'none'; okEl.style.display = 'none';
    const name  = document.getElementById('nb-signup-name').value.trim();
    const email = document.getElementById('nb-signup-email').value.trim();
    const pw    = document.getElementById('nb-signup-pw').value;
    const pw2   = document.getElementById('nb-signup-pw2').value;
    const agree = document.getElementById('nb-signup-agree').checked;
    if (!name)  { errEl.textContent = 'Vui lòng nhập username'; errEl.style.display = 'block'; return; }
    if (!email) { errEl.textContent = 'Vui lòng nhập email'; errEl.style.display = 'block'; return; }
    if (pw.length < 6) { errEl.textContent = 'Mật khẩu phải có ít nhất 6 ký tự'; errEl.style.display = 'block'; return; }
    if (pw !== pw2)    { errEl.textContent = 'Mật khẩu xác nhận không khớp'; errEl.style.display = 'block'; return; }
    if (!agree)        { errEl.textContent = 'Bạn cần đồng ý với điều khoản sử dụng'; errEl.style.display = 'block'; return; }
    const btn = document.getElementById('nb-signup-btn');
    const spinner = document.getElementById('nb-signup-spinner');
    const txt = document.getElementById('nb-signup-btn-text');
    btn.disabled = true; spinner.style.display = 'inline-block'; txt.textContent = 'Đang tạo tài khoản...';
    const _sb = window.sb || window.supabase;
    // Kiểm tra username
    const { data: existing } = await _sb.from('profiles').select('id').eq('display_name', name).maybeSingle();
    if (existing) {
      btn.disabled = false; spinner.style.display = 'none'; txt.textContent = 'Tạo tài khoản';
      errEl.textContent = 'Username đã có người dùng, chọn tên khác nhé!'; errEl.style.display = 'block'; return;
    }
    const { data: signUpData, error } = await _sb.auth.signUp({ email, password: pw, options: { data: { display_name: name } } });
    btn.disabled = false; spinner.style.display = 'none'; txt.textContent = 'Tạo tài khoản';
    if (error) {
      const msg = error.message.includes('already') ? 'Email này đã được đăng ký. Thử đăng nhập?' : error.message;
      errEl.textContent = msg; errEl.style.display = 'block'; return;
    }
    if (signUpData?.user) {
      await _sb.from('profiles').upsert({ id: signUpData.user.id, display_name: name, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    }
    okEl.style.display = 'block';
    ['nb-signup-name','nb-signup-email','nb-signup-pw','nb-signup-pw2'].forEach(id => { document.getElementById(id).value = ''; });
  };

  window.nbDoReset = async function() {
    const errEl = document.getElementById('nb-reset-err');
    const okEl  = document.getElementById('nb-reset-ok');
    errEl.style.display = 'none'; okEl.style.display = 'none';
    const email = document.getElementById('nb-reset-email').value.trim();
    if (!email) { errEl.textContent = 'Vui lòng nhập email'; errEl.style.display = 'block'; return; }
    const btn = document.getElementById('nb-reset-btn');
    const spinner = document.getElementById('nb-reset-spinner');
    const txt = document.getElementById('nb-reset-btn-text');
    btn.disabled = true; spinner.style.display = 'inline-block'; txt.textContent = 'Đang gửi...';
    const _sb = window.sb || window.supabase;
    const { error } = await _sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + '/auth.html?tab=newpw' });
    btn.disabled = false; spinner.style.display = 'none'; txt.textContent = 'Gửi link đặt lại';
    if (error) { errEl.textContent = error.message; errEl.style.display = 'block'; return; }
    okEl.style.display = 'block';
  };

  // Đóng auth modal khi bấm Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('nbAuthOverlay').classList.contains('open')) {
      document.getElementById('nbAuthOverlay').classList.remove('open');
      document.body.style.overflow = '';
    }
  });

})();
