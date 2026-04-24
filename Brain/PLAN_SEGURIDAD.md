# Plan de Remediación de Seguridad - StatAnalyzer Pro

**Fecha:** 2026-04-05
**Total hallazgos:** 24 (8 HIGH, 12 MEDIUM, 4 LOW)

---

## Prioridad 1: Escape HTML en ReporteManager (HIGH)

### Problema
Datos del usuario (`meta.descripcion`, `meta.organizacion`, nombres de columnas) se insertan en HTML sin `escapeHtml()`.

### Archivos y líneas
- `ReporteManager.js:1012-1016` - `meta.organizacion`, `meta.ensayo`, `meta.fase`, `meta.protocolo`, `meta.codigoProyecto`, `meta.version`, `meta.confidencialidad`, `meta.departamento`, `meta.ubicacion`
- `ReporteManager.js:1024-1036` - `meta.modelo`, `meta.marca`, `meta.serial`
- `ReporteManager.js:1058` - `meta.descripcion`
- `ReporteManager.js:1062` - `ext.flags` con nombres de columna
- `ReporteManager.js:1108` - `${col}` en headers de variables

### Fix
Envolver TODOS los `${meta.*}` y `${col}` con `escapeHtml()`:
```javascript
// ANTES
`${meta.descripcion}`
// DESPUES
`${escapeHtml(meta.descripcion)}`
```

### Tiempo estimado: 30 min

---

## Prioridad 2: Escape HTML en modal de parámetros (HIGH)

### Problema
Nombres de columnas sin escapar en modal de advertencia.

### Archivo y línea
- `script.js:619` - `${sinParams.map(c => `<li>${c}</li>`).join('')}`

### Fix
```javascript
// ANTES
`${sinParams.map(c => `<li>${c}</li>`).join('')}`
// DESPUES
`${sinParams.map(c => `<li>${escapeHtml(c)}</li>`).join('')}`
```

### Tiempo estimado: 5 min

---

## Prioridad 3: SRI hash para Chart.js (MEDIUM)

### Problema
Chart.js se carga desde CDN sin verificación de integridad.

### Archivo y línea
- `index.html:463`

### Fix
```html
<!-- ANTES -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

<!-- DESPUES -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
        integrity="sha384-GENERAR_CON_OPENSSL"
        crossorigin="anonymous"></script>
```

Generar hash con:
```bash
curl -s https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js | openssl dgst -sha384 -binary | openssl base64 -A
```

### Tiempo estimado: 2 min

---

## Prioridad 4: Centralizar API URL (MEDIUM)

### Problema
La URL del API está hardcodeada en 3 archivos diferentes.

### Archivos y líneas
- `auth.js:18` - `API_URL: 'https://proyecto-sigmaproxvl.onrender.com'`
- `script.js:1125` - `const API_URL = 'https://proyecto-sigmaproxvl.onrender.com'`
- `script.js:1140` - `const API_URL = 'https://proyecto-sigmaproxvl.onrender.com'`

### Fix
1. Agregar a `utils.js`:
```javascript
const API_URL = 'https://proyecto-sigmaproxvl.onrender.com';
```
2. Reemplazar las 3 ocurrencias con `API_URL`
3. En `auth.js`, usar `window.API_URL` o importar desde utils

### Tiempo estimado: 10 min

---

## Prioridad 5: Hash criptográfico para reportes (MEDIUM)

### Problema
El hash de integridad del reporte usa djb2 (no criptográfico).

### Archivo y líneas
- `ReporteManager.js:376-396` - Función `generateHash()`

### Fix
```javascript
// ANTES
let h = 0;
for (let i = 0; i < s.length; i++) h = ((h<<5)-h+s.charCodeAt(i))|0;
return Math.abs(h).toString(16).toUpperCase().padStart(8,'0');

// DESPUES
async function generateHash(meta, res) {
    const data = new TextEncoder().encode(JSON.stringify({ meta, r: res?.totalFilas }));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}
```

### Tiempo estimado: 15 min

---

## Prioridad 6: Validación de tamaño de archivo (MEDIUM)

### Problema
No hay límite de tamaño para archivos importados.

### Archivo y líneas
- `script.js:269-316` - Manejo de file upload

### Fix
Agregar antes de `reader.readAsText(file)`:
```javascript
if (file.size > 10 * 1024 * 1024) { // 10MB
    _showToast('⚠️ El archivo es demasiado grande (máx. 10MB)', true);
    return;
}
```

### Tiempo estimado: 5 min

---

## Prioridad 7: Eliminar console.log con datos sensibles (LOW)

### Problema
Datos de análisis y sesiones se loguean a la consola del navegador.

### Archivos y líneas
- `script.js:783` - `console.log('Resultados obtenidos:', resultados)`
- `script.js:1155` - `console.log(' Sesion iniciada:', username)`

### Fix
```javascript
// Opcion 1: Eliminar directamente
// Opcion 2: Gatear con flag
const DEBUG = false;
if (DEBUG) console.log('Resultados obtenidos:', resultados);
```

### Tiempo estimado: 10 min

---

## Prioridad 8: Session validation contra JWT (HIGH)

### Problema
El objeto de sesión en `sessionStorage` puede modificarse trivialmente para escalar privilegios.

### Archivos
- `auth.js:44-49, 58-61` - Session storage
- `PermisosManager.js:43-48` - `puede()` lee de sessionStorage

### Fix requerido
1. Validar sesión contra JWT del servidor para operaciones sensibles
2. O firmar el objeto de sesión con un secreto server-side
3. O confiar exclusivamente en el JWT para decisiones de autorización

### Tiempo estimado: 1 hora
### Complejidad: Alta (requiere cambios en arquitectura de auth)

---

## Hallazgos adicionales (para revisar después)

### MEDIUM
- **Finding 2.4:** CORS permite wildcard sin Origin (`backend/server.js:49`)
- **Finding 2.5:** Sin CSRF protection en endpoints con cookies
- **Finding 4.1:** Datos sensibles en localStorage (`StateManager.js:604-624`)
- **Finding 5.4:** Sin token revocation/blacklist
- **Finding 6.9:** `credentials: 'include'` con CORS wildcard
- **Finding 6.8:** Sin Content Security Policy

### LOW
- **Finding 6.1:** 28+ inline onclick handlers en `index.html`
- **Finding 6.2:** Inline onclick en HTML dinámico (`script.js`, `auth.js`)
- **Finding 6.4:** Google Fonts sin self-host en reportes
- **Finding 6.5:** HTTP origins en CORS para desarrollo

---

## Resumen de Tiempo

| Prioridad | Tarea | Tiempo |
|-----------|-------|--------|
| 1 | Escape HTML en ReporteManager | 30 min |
| 2 | Escape HTML en script.js | 5 min |
| 3 | SRI hash Chart.js | 2 min |
| 4 | Centralizar API URL | 10 min |
| 5 | Hash criptográfico | 15 min |
| 6 | Validación tamaño archivo | 5 min |
| 7 | Eliminar console.log | 10 min |
| 8 | Session validation JWT | 60 min |
| **TOTAL** | | **~2.5 horas** |
