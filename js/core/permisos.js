// ════════════════════════════════════════════════════════════════
// permisos.js — Role-based access control matrix
// ════════════════════════════════════════════════════════════════

// Derivado de SIGMA_PAGES (js/core/pages.js): una página declara sus roles
// una sola vez y la matriz se construye al cargar este archivo.
var ALLOWED_PAGES = {
  admin: [], analista: [], user: [],
  supervisor: [], gerente: [], coordinador: [], readonly: []
};
if (typeof SIGMA_PAGES !== 'undefined') {
  SIGMA_PAGES.forEach(function(page) {
    (page.roles || []).forEach(function(role) {
      if (ALLOWED_PAGES[role]) ALLOWED_PAGES[role].push(page.id);
    });
  });
}

function _getSessionRole() {
  if (typeof Auth === 'undefined') return 'readonly';
  var s = Auth.getSession();
  return s ? s.role : 'readonly';
}

function _userCanAccessPage(page) {
  var role = _getSessionRole();
  var allowed = ALLOWED_PAGES[role];
  return allowed && allowed.indexOf(page) !== -1;
}

function _userCanAnalyze() {
  var role = _getSessionRole();
  return role === 'admin' || role === 'analista' || role === 'user';
}

function _userCanGenerateReport() {
  var role = _getSessionRole();
  return role === 'admin' || role === 'analista' || role === 'user';
}

function _getAllowedPages() {
  var role = _getSessionRole();
  return ALLOWED_PAGES[role] || [];
}
