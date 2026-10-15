// Declaraciones de globales entre archivos (fase 1: JSDoc + checkJs).
// Los .js del proyecto se comunican por globales cargados con <script>.
// - Banco*: vienen de banco-*-data.js (no incluidos en tsconfig) → declare.
// - PlantillaDocx/GeneradorDocx/Validaciones: declarados en sus propios
//   archivos incluidos → NO redeclarar aquí (TS2451).
// - Auth/AreaSelect/etc.: de otros .js no incluidos → declare any.
// TODO(fase 2): sustituir por imports ES al migrar a .ts.
declare var BancoEquipos: any;
declare var BancoEstabilidad: any;
declare var BancoSistemas: any;
declare var BancoAlmacenes: any;
declare var GeneradorDocx: any;
declare var PlantillaDocx: any;
declare var Auth: any;
declare var AreaSelect: any;
declare var ValidacionesManifest: any;
declare var flatpickr: any;
declare var API_URL: any;
declare var fetchWithTimeout: any;

interface Window {
  docx: any;
}
