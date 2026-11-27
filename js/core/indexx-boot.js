// ════════════════════════════════════════════════════════════════
// indexx-boot.js — App initialization
// ════════════════════════════════════════════════════════════════

buildStatAnalysisMenu();
function _bootUi() {
  if (typeof buildSidebarNav === 'function') buildSidebarNav();
  if (typeof buildRibbonNavPopup === 'function') buildRibbonNavPopup();
  _initIndexxApp();
  initCommandPalette();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _bootUi);
} else {
  _bootUi();
}
