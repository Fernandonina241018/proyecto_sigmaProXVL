// ════════════════════════════════════════════════════════════════
// pages.js — Fuente única de metadatos de página.
//
// Antes: iconos, títulos, workflow, permisos, grupos lazy y anchos
// vivían en 9–10 lugares distintos. Al agregar una página había que
// tocar todos o la nav/permiso/lazy quedaban desincronizados.
//
// Regla: si una página no está aquí, no existe para la UI.
// Los renderers (leftPanels/rightPanels) siguen en indexx-ui.js.
// ════════════════════════════════════════════════════════════════

var SIGMA_PAGE_GROUPS = [
  { id: 'modules', label: 'Módulos' },
  { id: 'admin',   label: 'Administración' }
];

var SIGMA_PAGES = [
  {
    id: 'datos',
    label: 'Datos',
    title: 'Gestión de Datos',
    icon: '📊',
    desc: 'Carga CSV, Excel o JSON y gestiona tu dataset',
    group: 'modules',
    roles: ['admin', 'analista', 'user'],
    paneWidth: 350,
    workflow: true,
    workflowName: 'Datos'
  },
  {
    id: 'trabajo',
    label: 'Trabajo',
    title: 'Hoja de Trabajo',
    icon: '📋',
    desc: 'Hoja de cálculo y limpieza de datos',
    group: 'modules',
    roles: ['admin', 'analista', 'user'],
    paneWidth: 360,
    workflow: true,
    workflowName: 'Hoja de Trabajo'
  },
  {
    id: 'analisis',
    label: 'Análisis',
    title: 'Análisis Estadístico',
    icon: '🔬',
    desc: 'Estadística descriptiva e inferencial',
    group: 'modules',
    roles: ['admin', 'analista', 'user'],
    paneWidth: 350,
    workflow: true,
    workflowName: 'Análisis'
  },
  {
    id: 'visualizacion',
    label: 'Visualización',
    title: 'Visualización',
    icon: '📈',
    desc: 'Gráficos y galería de resultados',
    group: 'modules',
    roles: ['admin', 'analista', 'user'],
    paneWidth: 500,
    workflow: true,
    workflowName: 'Visualización'
  },
  {
    id: 'reportes',
    label: 'Reportes',
    title: 'Reportes',
    icon: '📄',
    desc: 'Informes automáticos de tus análisis',
    group: 'modules',
    roles: ['admin', 'analista', 'user'],
    paneWidth: 350,
    workflow: true,
    workflowName: 'Reportes',
    lazyGroup: 'reportes'
  },
  {
    id: 'firmarReporte',
    label: 'Firmar Reporte',
    title: 'Firmar Reporte',
    icon: '✍️',
    desc: 'Elabora, revisa y aprueba reportes',
    group: 'modules',
    roles: ['admin', 'analista', 'user', 'supervisor', 'gerente', 'coordinador'],
    paneWidth: 400,
    workflow: true,
    workflowName: 'Firmar Reporte'
  },
  {
    id: 'ml',
    label: 'ML Analysis',
    title: 'ML Analysis',
    icon: '🧠',
    desc: 'Modelos predictivos y machine learning',
    group: 'modules',
    roles: ['admin', 'analista', 'user'],
    paneWidth: 160,
    lazyGroup: 'ml'
  },
  {
    id: 'modelo-estadistico',
    label: 'Modelo Stats',
    title: 'Modelo Estadístico',
    icon: '🧠',
    desc: 'Modelos estadísticos y pronósticos',
    group: 'modules',
    roles: ['admin', 'analista', 'user'],
    paneWidth: 160
  },
  {
    id: 'auditoria',
    label: 'Auditoría',
    title: 'Auditoría',
    icon: '📋',
    desc: 'Registro de actividad del sistema',
    group: 'admin',
    roles: ['admin'],
    paneWidth: 160
  },
  {
    id: 'usuarios',
    label: 'Usuarios',
    title: 'Usuarios',
    icon: '👥',
    desc: 'Cuentas, roles y contraseñas',
    group: 'admin',
    roles: ['admin'],
    paneWidth: 160
  },
  {
    id: 'dispositivos',
    label: 'Dispositivos',
    title: 'Dispositivos',
    icon: '🖥️',
    desc: 'Sesiones y equipos confiables',
    group: 'admin',
    roles: ['admin'],
    paneWidth: 160
  }
];

var SIGMA_PAGE_BY_ID = {};
SIGMA_PAGES.forEach(function(page) { SIGMA_PAGE_BY_ID[page.id] = page; });
