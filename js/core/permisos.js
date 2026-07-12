// ════════════════════════════════════════════════════════════════
// permisos.js — Role-based access control matrix
// ════════════════════════════════════════════════════════════════

var ALLOWED_PAGES = {
  admin: [
    'datos','trabajo','analisis','visualizacion','reportes',
    'firmarReporte','ml','modelo-estadistico',
    'auditoria','usuarios','dispositivos'
  ],
  analista: [
    'datos','trabajo','analisis','visualizacion','reportes',
    'firmarReporte','ml','modelo-estadistico'
  ],
  user: [
    'datos','trabajo','analisis','visualizacion','reportes',
    'firmarReporte','ml','modelo-estadistico'
  ],
  supervisor: ['firmarReporte'],
  gerente:    ['firmarReporte'],
  coordinador:['firmarReporte'],
  readonly:   []
};

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
