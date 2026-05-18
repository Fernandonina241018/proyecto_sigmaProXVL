# Protocolo — cambios sin romper dependencias

> Evitar regresiones por refactor (ej. `fmtDate` → `formatDate` rompió UsuariosManager).

**Ruta proyecto:** `G:\My Drive\SigmaProWeb\proyecto_sigmaProXVL\`

## Reglas

| # | Regla |
|---|-------|
| 1 | **No renombrar** funciones públicas existentes |
| 2 | Cambiar **implementación** interna: OK |
| 3 | Función nueva: OK |
| 4 | Renombrar necesario → **alias** con nombre viejo |
| 5 | Buscar usos **antes** de tocar |

## Buscar dependencias

```powershell
cd "G:\My Drive\SigmaProWeb\proyecto_sigmaProXVL"
Select-String -Path "*.js" -Pattern "nombreFuncion" -Recurse |
  Format-Table Filename, LineNumber, Line -AutoSize
```

| Usos | Acción |
|------|--------|
| 1 archivo | Cambio directo |
| Varios archivos | Alias o mantener nombre |
| Renombrar deseado | Alias, no rename |

## Checklist pre-commit

```
□ Login / logout
□ Importar datos
□ Ejecutar análisis
□ Vistas: Usuarios, Auditoría, Datos, Reportes, Visualización
□ Sin errores consola + error.log
```

## Flujo

**Pequeño:** cambio → probar navegador → commit descriptivo  
**Grande:** rama `feature/...` → probar → merge o descartar

## Alias (patrón correcto)

```js
function formatDate(ts, format = 'full') { /* impl */ }
function fmtDate(ts, format = 'full') { return formatDate(ts, format); }
```

## Si algo se rompe

1. Detener cambios
2. `git log --oneline -10` → identificar commit
3. Rollback (`git reset --hard <prev>`) — solo si el usuario lo pide
4. Rehacer con búsqueda de dependencias

## Funciones críticas (no renombrar)

| Función | Archivo | Consumidores |
|---------|---------|--------------|
| `escapeHtml()` | utils.js | Managers, reportes |
| `showToast()` | utils.js | Global |
| `formatDate()` / `fmtDate()` | utils.js | Usuarios, Auditoría |
| `_showToast()` | utils.js | Usuarios, Datos |
| `getRolLabel()` | utils.js | Usuarios, script |

## Archivos alto impacto

`script.js` · `UsuariosManager.js` · `AuditoriaManager.js` · `DatosManager.js` · `ReporteManager.js` · `EstadisticaDescriptiva.js` · `Visualizacion.js`

## Resumen

Seguridad del código > elegancia del refactor. Ver también XSS en `04` y `PLAN_SEGURIDAD.md`.
