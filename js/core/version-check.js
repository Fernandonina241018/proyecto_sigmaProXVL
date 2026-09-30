// ========================================
// version-check.js — SigmaProXVL
// Avisa cuando hay una versión nueva en Pages sin Ctrl+Shift+R:
// compara version.json (siempre fresco) cada 2 min y muestra un toast
// no bloqueante con botón Recargar. Auto-arranque al cargar.
// ========================================

const VersionCheck = (() => {
  const URL = 'version.json';
  const EVERY_MS = 2 * 60 * 1000;
  let base = null;
  let timer = null;
  let avisado = false;

  async function remota() {
    const r = await fetch(URL + '?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) return null;
    const j = await r.json();
    return j && j.v ? String(j.v) : null;
  }

  function toast() {
    try {
      if (document.getElementById('app-version-toast')) return;
      const el = document.createElement('div');
      el.id = 'app-version-toast';
      el.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:99990;display:flex;align-items:center;gap:12px;background:#1b1f27;border:1px solid #ff5c1a;border-radius:14px;padding:12px 16px;font-size:13px;color:#f2f4f8;font-family:sans-serif;box-shadow:0 12px 32px rgba(0,0,0,.5)';
      el.innerHTML = '<span>🆕 Nueva versión disponible</span>';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'Recargar';
      btn.style.cssText = 'font:inherit;font-weight:700;border:0;border-radius:20px;padding:8px 18px;cursor:pointer;background:#ff5c1a;color:#fff';
      btn.onclick = function () {
        try { window.location.reload(); } catch (e) {}
      };
      el.appendChild(btn);
      document.body.appendChild(el);
    } catch (e) {}
  }

  async function tick() {
    try {
      const v = await remota();
      if (!v) return;
      if (!base) { base = v; return; }
      if (v !== base && !avisado) {
        avisado = true;
        toast();
        stop();
      }
    } catch (e) {}
  }

  function start() {
    try {
      if (typeof window === 'undefined' || typeof fetch === 'undefined') return false;
      if (timer) return true;
      tick();
      timer = setInterval(tick, EVERY_MS);
      if (typeof document !== 'undefined' && document.addEventListener) {
        document.addEventListener('visibilitychange', function () {
          try { if (!document.hidden) tick(); } catch (e) {}
        });
      }
      return true;
    } catch (e) { return false; }
  }

  function stop() {
    try { if (timer) clearInterval(timer); } catch (e) {}
    timer = null;
  }

  return { start, stop, _tick: tick, _base: function (v) { if (typeof v !== 'undefined') base = v; return base; } };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = VersionCheck;

try {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading' && document.addEventListener) {
      document.addEventListener('DOMContentLoaded', function () { VersionCheck.start(); });
    } else {
      VersionCheck.start();
    }
  }
} catch (e) {}
