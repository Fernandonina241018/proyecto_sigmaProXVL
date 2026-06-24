// ════════════════════════════════════════════════════════════════
// indexx-boot.js — App initialization
// ════════════════════════════════════════════════════════════════

buildStatAnalysisMenu();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() { _initIndexxApp(); initCommandPalette(); });
} else {
  _initIndexxApp();
  initCommandPalette();
}
