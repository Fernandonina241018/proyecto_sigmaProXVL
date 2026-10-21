# Guía de Estructura Fuerte — StatAnalyzer Pro

**Proyecto:** StatAnalyzer Pro — SigmaProXVL  
**Propósito:** SPA de análisis estadístico con cumplimiento FDA 21 CFR Part 11  
**Stack:** Vanilla JS + HTML5/CSS3 + Chart.js (frontend) · Node.js + Express + PostgreSQL/Supabase (backend) · Python + FastAPI + scikit-learn + XGBoost + SHAP (ML)  
**Estado:** Estructura propuesta para evitar regresiones y rupturas al modificar código  

---

## 1. Problema que resuelve esta estructura

Hoy, cambiar un archivo en `js/core/` puede romper `js/managers/` o una página HTML porque:

1. Todo depende de todo (acoplamiento alto).
2. No hay pruebas que avisen antes de romper algo.
3. La lógica de cálculo se mezcla con el DOM y con Chart.js.
4. No hay separación entre dominio (qué se calcula), aplicación (cómo se ejecuta el flujo) e infraestructura (cómo se muestra o se envía).

Esta guía define una **estructura fuerte** con capas bien delimitadas, reglas de oro obligatorias y un flujo de trabajo que evita que un cambio rompa otra cosa.

---

## 2. Estructura de Carpetas Propuesta

```
proyecto_sigmaProXVL/
├── frontend/
│   ├── index.html
│   ├── login_redesign.html
│   ├── ML.html
│   ├── nav-bar-design.html
│   ├── usercard.html
│   ├── css/
│   │   ├── core/
│   │   ├── pages/
│   │   ├── validaciones.css
│   │   └── validaciones-v7.css
│   ├── js/
│   │   ├── main.js                 # Wiring: une domain + infra + ui. Punto de entrada.
│   │   ├── domain/                 # Lógica PURA de negocio. Sin DOM. Sin red. Sin Chart.js.
│   │   │   ├── statistics.js       # Cálculos estadísticos puros (inmutables)
│   │   │   ├── validators.js       # Reglas de validación (FDA 21 CFR Part 11, WORM, etc.)
│   │   │   └── models.js           # Entidades: Dataset, AnalysisResult, User, etc.
│   │   ├── app/                    # Orquestadores / Use cases (qué hace el sistema)
│   │   │   ├── analysis-use-case.js
│   │   │   └── report-use-case.js
│   │   ├── infra/                  # Adaptadores: DOM, Chart.js, fetch, localStorage
│   │   │   ├── chart-adapter.js    # Solo habla con Chart.js
│   │   │   ├── dom.js              # Solo manipula el DOM
│   │   │   └── api-client.js       # Solo hace fetch al backend
│   │   ├── ui/                     # Presentación: renderizado de tablas, modales, gráficos
│   │   │   ├── table-renderer.js
│   │   │   ├── modal.js
│   │   │   └── chart-ui.js
│   │   ├── core/                   # (legacy, dejar tal cual hasta migrar)
│   │   ├── managers/               # (legacy, dejar tal cual hasta migrar)
│   │   └── pages/                  # (legacy, dejar tal cual hasta migrar)
│   └── tests/
│       ├── domain/                 # Tests puros (sin mocks, rápidos)
│   │   └── statistics.test.js
│       ├── app/
│   │   └── analysis-use-case.test.js
│       ├── infra/
│   │   └── chart-adapter.test.js
│       └── ui/
│           └── table-renderer.test.js
├── backend/
│   ├── src/
│   │   ├── routes/          # Solo HTTP: recibir request, llamar servicio, devolver respuesta
│   │   ├── controllers/     # Traduce HTTP a llamadas de servicio
│   │   ├── services/        # Lógica de negocio del backend
│   │   ├── repositories/    # Acceso a PostgreSQL / Supabase
│   │   └── domain/          # Entidades y reglas puras del backend
│   └── tests/
│       ├── unit/
│       └── integration/
├── ml_service/
│   ├── app/
│   │   ├── api/             # Rutas FastAPI
│   │   ├── services/        # Lógica ML (sklearn, XGBoost, SHAP)
│   │   └── models/          # Pydantic schemas, wrappers de modelos
│   └── tests/
├── tests/
│   └── e2e/               # Playwright: flujos críticos (CSV → gráfico → reporte)
├── .github/workflows/     # CI: corre tests en cada push
├── package.json           # (ya existe: vitest, playwright, react-doctor)
├── vitest.config.ts       # (ya existe)
└── playwright.config.js   # (ya existe)
```

---

## 3. Principios Arquitectónicos

| Principio | Qué significa | Qué evita |
|-----------|---------------|-----------|
| **Dominio aislado** | `domain/` nunca importa de `ui/`, `infra/` o `app/`. Solo exporta funciones puras. | Que cambiar Chart.js rompa un cálculo estadístico. |
| **Inmutabilidad** | Las funciones nunca mutan sus argumentos. Siempre devuelven objetos nuevos. | Que una función corrompa datos que otra esperaba intactos. |
| **Unidireccionalidad** | `ui` ← `app` ← `domain`. Las dependencias fluyen en una sola dirección. | Cambios en cadena impredecibles. |
| **Validación en bordes** | Los datos se validan al entrar (UI → app → domain) y al salir (backend → frontend). | Datos corruptos llegando al núcleo. |
| **Una responsabilidad por archivo** | Un archivo = una cosa. `statistics.js` solo calcula. `chart-adapter.js` solo dibuja. | Archivos de 20 000 líneas que nadie se atreve a tocar. |

---

## 4. Reglas de Oro (obligatorias)

1. **Nunca mutar el argumento de una función.**  
   ❌ `data.push(item)`  
   ✅ `return [...data, item]`

2. **Si vas a tocar un archivo, busca con `grep` quién lo importa** y revisa esos llamadores antes de hacer el cambio.

3. **Si no hay test para lo que cambias, no hagas commit.** Escribe primero el test que falla (RED), luego el código (GREEN).

4. **Una rama por cambio.** Nunca trabajes directamente en `main`. Usa `git checkout -b fix/analisis-varianza` o `feat/nuevo-grafico`.

5. **Antes de push:** ejecuta `npm test` (frontend y backend). Si falla, no subas.

6. **Si algo se rompe en producción, revertir primero, investigar después.** No intentes arreglar sobre fuego.

7. **El dominio no conoce a la UI.** `statistics.js` no debe tocar `document.getElementById` ni `new Chart()`.

8. **La infraestructura no conoce al dominio.** `chart-adapter.js` recibe datos ya calculados y solo los dibuja.

9. **Los commits usan formato convencional:** `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.

10. **Después de cada cambio autorizado, actualizar `ESTADO_PROYECTO.md`** con qué cambió, por qué, archivos afectados y líneas modificadas.

---

## 5. Flujo de Desarrollo Paso a Paso

### Paso 1: Crear rama
```bash
git checkout -b feat/nueva-funcionalidad
```

### Paso 2: Identificar el alcance
Usa `grep` para encontrar todos los archivos que importan o usan lo que vas a modificar.
```bash
grep -r "nombreDeFuncion" --include="*.js" .
```

### Paso 3: Escribir el test primero (RED)
Crea o modifica el test en `frontend/tests/domain/` o `backend/tests/unit/`.
```bash
npm test -- --run statistics.test.js
# Debe fallar
```

### Paso 4: Implementar el código (GREEN)
Escribe el código mínimo en la capa correspondiente (`domain/`, `app/`, `infra/`, `ui/`).
```bash
npm test -- --run statistics.test.js
# Debe pasar
```

### Paso 5: Refactorizar
Mejora la legibilidad sin cambiar el comportamiento. Vuelve a ejecutar los tests.

### Paso 6: Ejecutar tests de todas las áreas tocadas
```bash
npm test
# y si hay backend:
cd backend && npm test
```

### Paso 7: Commit
```bash
git add .
git commit -m "feat: agregar cálculo de desviación estándar en domain/statistics.js"
```

### Paso 8: Push
```bash
git push origin feat/nueva-funcionalidad
```

---

## 6. Capas y sus Responsabilidades

### `frontend/js/domain/`
- **Qué hace:** Cálculos estadísticos puros, validaciones de reglas (FDA 21 CFR Part 11, WORM), definición de entidades.
- **Qué NO hace:** No toca el DOM, no usa Chart.js, no hace fetch, no modifica argumentos de entrada.
- **Ejemplo:** `calcularDesviacionEstandar(numeros)` → devuelve número.

### `frontend/js/app/`
- **Qué hace:** Orquestadores que coordinan el flujo. Reciben datos, llaman al domain, preparan para la UI.
- **Qué NO hace:** No renderiza HTML directamente, no decide colores de Chart.js.

### `frontend/js/infra/`
- **Qué hace:** Adaptadores a tecnologías externas. `chart-adapter.js` habla solo con Chart.js. `api-client.js` habla solo con el backend. `dom.js` habla solo con el navegador.
- **Qué NO hace:** No contiene lógica de negocio.

### `frontend/js/ui/`
- **Qué hace:** Renderizado visual. Recibe datos ya procesados y los muestra en tablas, modales o gráficos.
- **Qué NO hace:** No calcula estadísticas, no valida reglas de negocio.

### `backend/src/`
- `routes/`: Solo capa HTTP.
- `controllers/`: Traduce request HTTP a llamadas de servicio.
- `services/`: Lógica de negocio del servidor.
- `repositories/`: Solo acceso a base de datos.
- `domain/`: Entidades y reglas puras del backend.

---

## 7. Ejemplos de Código

### 7.1 Función pura en `domain/statistics.js`
```js
// frontend/js/domain/statistics.js

export function calcularMedia(valores) {
  if (!Array.isArray(valores) || valores.length === 0) {
    throw new Error('valores debe ser un array no vacío');
  }
  const suma = valores.reduce((acc, v) => acc + Number(v), 0);
  return suma / valores.length;
}

export function calcularDesviacionEstandar(valores) {
  const media = calcularMedia(valores);
  const sumaCuadrados = valores.reduce(
    (acc, v) => acc + Math.pow(Number(v) - media, 2),
    0
  );
  return Math.sqrt(sumaCuadrados / valores.length);
}
```

### 7.2 Use case en `app/analysis-use-case.js`
```js
// frontend/js/app/analysis-use-case.js
import { calcularMedia, calcularDesviacionEstandar } from '../domain/statistics.js';
import { validarDataset } from '../domain/validators.js';

export function analizarDataset(dataset) {
  validarDataset(dataset); // lanza si no cumple reglas FDA/WORM
  const valores = dataset.map((fila) => fila.valor);
  return {
    media: calcularMedia(valores),
    desviacionEstandar: calcularDesviacionEstandar(valores),
    cantidad: valores.length,
    generadoEn: new Date().toISOString(),
  };
}
```

### 7.3 Adaptador en `infra/chart-adapter.js`
```js
// frontend/js/infra/chart-adapter.js
import { Chart } from 'chart.js';

export function renderGraficoBarras(canvasId, etiquetas, datos) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: { labels: etiquetas, datasets: [{ label: 'Valor', data: datos }] },
    options: { responsive: true },
  });
}
```

### 7.4 Test en `tests/domain/statistics.test.js`
```js
// frontend/tests/domain/statistics.test.js
import { describe, it, expect } from 'vitest';
import { calcularMedia, calcularDesviacionEstandar } from '../../js/domain/statistics.js';

describe('calcularMedia', () => {
  it('devuelve la media correcta de un array', () => {
    expect(calcularMedia([1, 2, 3, 4, 5])).toBe(3);
  });

  it('lanza error si el array está vacío', () => {
    expect(() => calcularMedia([])).toThrow('valores debe ser un array no vacío');
  });

  it('no muta el array original', () => {
    const original = [1, 2, 3];
    const copia = [...original];
    calcularMedia(original);
    expect(original).toEqual(copia);
  });
});
```

---

## 8. Checklist Antes de Commit

- [ ] Creé una rama nueva (`git checkout -b ...`)
- [ ] Busqué con `grep` quién usa lo que voy a cambiar
- [ ] Escribí o actualicé los tests para el código tocado
- [ ] Ejecuté `npm test` y pasó
- [ ] No muté argumentos de funciones (inmutabilidad verificada)
- [ ] El dominio no toca el DOM ni Chart.js
- [ ] El commit tiene formato convencional (`feat:`, `fix:`, etc.)
- [ ] Actualicé `ESTADO_PROYECTO.md` con qué cambió, por qué, archivos y líneas

---

## 9. Comandos Útiles

```bash
# Ejecutar todos los tests del frontend
npm test

# Ejecutar un test específico
npm test -- --run statistics.test.js

# Ejecutar tests con cobertura
npm run test:coverage

# Verificar tipos (si aplica)
npm run typecheck

# Crear rama nueva
git checkout -b feat/nombre-de-la-rama

# Ver cambios antes de commit
git diff --stat

# Ver quién importa un archivo antes de modificarlo
grep -r "nombreDelArchivo" --include="*.js" .
```

---

## 10. Reutilización para Nuevos Proyectos

Esta guía es reutilizable en cualquier proyecto con arquitectura por capas:

1. **Copia la estructura de carpetas** (`domain/`, `app/`, `infra/`, `ui/`).
2. **Adapta las reglas de oro** a tu stack (por ejemplo, si usas React, `ui/` serían componentes).
3. **Define tu dominio primero:** ¿qué cálculos o reglas de negocio tiene tu proyecto? Pónlos en `domain/` y escríbeles tests antes de tocar la UI.
4. **Agrega este archivo `.md`** a la raíz de cada nuevo proyecto y revísalo antes de cada sesión de desarrollo.
5. **Adapta el checklist antes de commit** según tus herramientas de prueba (vitest, jest, pytest, etc.).

---

## 11. Próximos Pasos Sugeridos

1. **Semana 1:** Mover los cálculos estadísticos de `js/core/` y `js/managers/` a `frontend/js/domain/statistics.js`. Escribir tests para cada función movida.
2. **Semana 2:** Crear `frontend/js/app/analysis-use-case.js` y conectar la UI existente a través de `infra/` y `ui/`.
3. **Semana 3:** Aplicar la misma estructura al `backend/` (`routes/` → `controllers/` → `services/` → `repositories/`).
4. **Semana 4:** Agregar tests E2E con Playwright para los flujos críticos (CSV → análisis → gráfico → reporte).

---

> **Nota:** Nada de esta estructura se impone por fuerza. Cada capa se migra poco a poco, archivo por archivo, siempre con tests que lo respalden. El objetivo es que tocar una parte del proyecto nunca rompa otra sin que lo sepas antes de hacer commit.