// Modal de perfil compartido (Estadística + Validaciones) y muesca superior.
// Verifica que la integración quede cableada en los dos shells y que el
// modal principal no dependa de scroll interno.
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { describe, test, expect } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const core = join(root, 'js', 'core');

const ui = readFileSync(join(core, 'indexx-ui.js'), 'utf-8');
const auth = readFileSync(join(core, 'auth.js'), 'utf-8');
const val = readFileSync(join(core, 'indexx-validaciones.js'), 'utf-8');
const css = readFileSync(join(root, 'css', 'core', 'perfil-modal.css'), 'utf-8');
const appCss = readFileSync(join(root, 'css', 'core', 'indexx.css'), 'utf-8');
const html = readFileSync(join(root, 'indexx.html'), 'utf-8');

describe('Perfil compartido', () => {
  test('modal de una vista: grilla de dos columnas sin scroll interno', () => {
    expect(ui).toContain('perfil-grid');
    expect(ui).toContain('perfil-modal');
    expect(css).toMatch(/\.perfil-modal\s*\{[^}]*overflow:\s*hidden/s);
    expect(css).toContain('.perfil-duo');
  });

  test('la muesca usa el titlebar sin tapar pestañas', () => {
    expect(ui).toContain('sigma-notch-spacer');
    expect(ui).toContain("querySelector('.titlebar')");
  });

  test('la muesca se monta en el shell activo y abre el perfil', () => {
    expect(ui).toContain('function mountPerfilNotch');
    expect(ui).toContain('sigma-perfil-notch');
    expect(css).toContain('.sigma-notch');
    expect(html).toContain('css/core/perfil-modal.css');
  });

  test('cambia de módulo con AreaSelect y cierra sesión con Auth.logout', () => {
    expect(ui).toContain('AreaSelect.setArea');
    expect(ui).toContain('Auth.logout');
    expect(ui).toContain('data-perfil-apply');
    expect(ui).toContain('data-perfil-logout');
    expect(css).toContain('.perfil-logout');
  });

  test('el perfil queda por encima del shell de Validaciones', () => {
    expect(css).toMatch(/\.perfil-overlay\s*\{[^}]*z-index:\s*95000/s);
    expect(css).toMatch(/\.perfil-passkeys-overlay\s*\{[^}]*z-index:\s*96000/s);
  });

  test('logout sale de Validaciones antes de mostrar el login', () => {
    expect(auth).toMatch(/function logout\(\)\s*\{\s*_closeAllModals\(\);\s*_salirDeValidaciones\(\);/);
  });

  test('el perfil del rail se retiró y settings quedó más visible', () => {
    expect(html).not.toContain('id="sidebarUser"');
    expect(html).not.toContain('id="sidebarUserDropdown"');
    expect(html).toContain('footer-icon settings');
    expect(appCss).toMatch(/\.footer-icon\.settings\s*\{[^}]*font-size:\s*18px/s);
    expect(appCss).toMatch(/\.ribbon-toggle\s*\{[^}]*width:\s*34px/s);
  });

  test('Validaciones abre el perfil compartido desde el avatar', () => {
    expect(val).toContain('data-act="profile"');
    expect(val).toContain("=== 'profile'");
    expect(val).toContain('showPerfilModal');
    expect(val).toContain('window.mountPerfilNotch');
  });
});
