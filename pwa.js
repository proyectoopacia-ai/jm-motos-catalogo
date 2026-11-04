// Instalación como app: registra el service worker y muestra el botón "Instalar app"
// en los elementos marcados con data-install.
(function(){
  if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  const ua = navigator.userAgent || "";
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const inApp = /WhatsApp|FBAN|FBAV|Instagram|Line\//i.test(ua);
  let deferred = null;
  const css = `.pwa-btn{display:inline-flex;align-items:center;gap:8px;border-radius:8px;padding:11px 18px;font:600 .98rem/1.2 inherit;font-family:inherit;cursor:pointer;border:1px solid var(--line,#2e2e36);background:var(--surface,#18181c);color:var(--fg,#f3f1ee)}
.pwa-btn svg{width:18px;height:18px}
.pwa-sheet{position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.6);display:grid;align-items:end;justify-items:center}
.pwa-card{width:100%;max-width:460px;background:var(--bg,#0f0f11);color:var(--fg,#f3f1ee);border:1px solid var(--line,#2e2e36);border-radius:16px 16px 0 0;padding:20px max(18px,env(safe-area-inset-right,0px)) calc(22px + env(safe-area-inset-bottom,0px)) max(18px,env(safe-area-inset-left,0px));display:grid;gap:14px;font-family:inherit}
@media (min-width:600px){.pwa-sheet{align-items:center}.pwa-card{border-radius:16px}}
.pwa-card h3{margin:0;font-size:1.4rem;text-transform:uppercase}
.pwa-card ol{margin:0;padding-left:22px;display:grid;gap:10px}
.pwa-card p{margin:0;color:var(--muted,#a3a1a8);font-size:.92rem}
.pwa-card b{color:var(--fg,#f3f1ee)}
.pwa-close{justify-self:stretch;border:0;border-radius:8px;padding:12px;font:600 1rem inherit;font-family:inherit;background:var(--red,#e3262f);color:#fff;cursor:pointer}
.pwa-ico{display:inline-block;vertical-align:-3px;width:18px;height:18px}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M12 7v7m-3-3 3 3 3-3"/><path d="M10 18h4"/></svg>';
  const SHARE = '<svg class="pwa-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 11v9h14v-9"/></svg>';
  function sheet(html){
    const s = document.createElement("div"); s.className = "pwa-sheet";
    s.innerHTML = `<div class="pwa-card" role="dialog" aria-modal="true">${html}<button type="button" class="pwa-close">Entendido</button></div>`;
    s.addEventListener("click", e => { if (e.target === s || e.target.classList.contains("pwa-close")) s.remove(); });
    document.body.appendChild(s); s.querySelector(".pwa-close").focus();
  }
  function help(){
    if (inApp) return sheet(`<h3>Ábrelo en el navegador</h3><p>Desde WhatsApp o Instagram no se puede instalar.</p><ol><li>Toca los <b>tres puntos</b> o el menú arriba a la derecha.</li><li>Elige <b>Abrir en Chrome</b> (Android) o <b>Abrir en Safari</b> (iPhone).</li><li>Vuelve a tocar <b>Instalar app</b>.</li></ol>`);
    if (ios) return sheet(`<h3>Instalar en iPhone</h3><ol><li>Abre esta página en <b>Safari</b>.</li><li>Toca el botón <b>Compartir</b> ${SHARE} abajo en la pantalla.</li><li>Baja y toca <b>Agregar a inicio</b>.</li><li>Toca <b>Agregar</b>. El ícono aparece en tu pantalla.</li></ol>`);
    sheet(`<h3>Instalar en Android</h3><ol><li>Abre esta página en <b>Chrome</b>.</li><li>Toca los <b>tres puntos</b> arriba a la derecha.</li><li>Toca <b>Instalar aplicación</b> o <b>Agregar a pantalla de inicio</b>.</li></ol>`);
  }
  function render(){
    document.querySelectorAll("[data-install]").forEach(slot => {
      if (standalone) { slot.hidden = true; return; }
      if (slot.querySelector(".pwa-btn")) return;
      const b = document.createElement("button"); b.type = "button"; b.className = "pwa-btn " + (slot.dataset.install || "");
      b.innerHTML = ICON + (slot.dataset.label || "Instalar app");
      b.addEventListener("click", async () => {
        if (deferred) { deferred.prompt(); const r = await deferred.userChoice; deferred = null; if (r.outcome === "accepted") document.querySelectorAll("[data-install]").forEach(s => s.hidden = true); }
        else help();
      });
      slot.appendChild(b); slot.hidden = false;
    });
  }
  addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; });
  addEventListener("appinstalled", () => document.querySelectorAll("[data-install]").forEach(s => s.hidden = true));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render); else render();
})();
