# Passkeys (WebAuthn) — guía de uso y diagnóstico

Passkeys permiten confirmar el segundo factor con huella, rostro, el teléfono
por QR o una llave de seguridad. El **TOTP sigue siendo obligatorio como
respaldo**: sin él no se puede registrar una passkey y no se puede desactivar
mientras existan passkeys.

## Requisitos

- Frontend servido por **HTTPS** en el dominio configurado (`WEBAUTHN_RP_ID`).
- La passkey se crea y se usa **en el mismo origen**. Una passkey creada en
  `localhost` no sirve en producción, y viceversa.
- La cuenta debe tener **TOTP activo** antes de registrar la passkey.
- Navegador con soporte WebAuthn (Chrome, Edge, Safari, Firefox reciente).

## Configuración del backend

Producción (Fly.io):

```bash
fly secrets set WEBAUTHN_RP_ID=fernandonina241018.github.io
fly secrets set WEBAUTHN_ORIGIN=https://fernandonina241018.github.io
```

Local / E2E (`playwright.config.js` ya lo define):

```
WEBAUTHN_RP_ID=localhost
WEBAUTHN_ORIGIN=http://localhost:5510
```

- `WEBAUTHN_RP_ID`: dominio sin esquema ni puerto.
- `WEBAUTHN_ORIGIN`: origen exacto, sin barra final.
- Ambos son configuración pública; pueden ir en `[env]` de `fly.toml` si se
  prefiere versionarlos.

## Registro paso a paso

1. Entra a la app en el dominio de producción.
2. Inicia sesión con contraseña + TOTP.
3. Menú de usuario → **Mi Perfil**.
4. Sección **🔐 Passkeys** → **➕ Agregar passkey**.
5. Nombre del dispositivo (ej. `Laptop`).
6. Escribe tu **contraseña actual**.
7. Confirma con el autenticador que ofrezca el navegador.
8. Debe aparecer “Passkey registrada correctamente” y listarse con su fecha.

## Inicio de sesión

1. Usuario + contraseña.
2. En el segundo paso pulsa **“Usar passkey”**.
3. Confirma con huella/rostro, escanea el QR con el teléfono o usa la llave.
4. Alternativa siempre disponible: el código TOTP de 6 dígitos.

## Dónde se guarda la passkey

| Flujo | Dónde queda | Dónde verificarla |
|-------|-------------|-------------------|
| Chrome/Google Password Manager | En el perfil de Chrome | `chrome://password-manager/passkeys` |
| QR con el teléfono | En el teléfono | Google Password Manager (Android) o Ajustes → Contraseñas (iOS) |
| Llave de seguridad USB | En la llave FIDO2 | El propio dispositivo |
| Gestor de terceros (Proton Pass, Bitwarden, 1Password) | En el vault del gestor | La app/extensión del gestor |

> `chrome://password-manager/passkeys` **solo** muestra las passkeys de Google
> Password Manager. Si usas un gestor de terceros, la ausencia ahí no significa
> que la passkey no exista.

## Gestores de passkeys de terceros

Proton Pass, Bitwarden y 1Password pueden actuar como proveedores de passkeys.
Influyen en dos cosas:

- **Dónde se guarda** la credencial (en su vault, no en Chrome).
- **Qué diálogo aparece** al registrarse o iniciar sesión.

Si el gestor está bloqueado, mal configurado o no se selecciona explícitamente,
Chrome puede caer al flujo nativo (QR al teléfono o llave USB) y parece que “no
funciona”. Caso observado: Proton Pass instalado como gestor por defecto
interceptaba el flujo, el QR se abría y la passkey no aparecía en Chrome.

Recomendaciones al usar un gestor de terceros:

1. Desbloquéalo antes de registrar la passkey.
2. Elígelo explícitamente cuando el navegador pregunte dónde guardar.
3. Verifica que la passkey aparece **dentro del gestor**.
4. Si no aparece el aviso “Save passkey”, desactiva temporalmente el gestor
   para aislar el problema y vuelve a intentarlo.

## Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| No aparece “Usar passkey” | Sin passkeys, navegador sin soporte o JS en caché | Recarga forzada; revisa `Auth.listarPasskeys()` |
| “Activa el código 2FA (TOTP)…” | TOTP desactivado | Activa TOTP primero |
| “Dominio no autorizado para passkeys” | RP ID/origen no coinciden | Corrige secretos y reinicia la app |
| “Operación cancelada o tiempo agotado” | Se cerró el diálogo del autenticador | Reintenta sin cancelar |
| “Passkey no reconocida” | La credencial no pertenece a ese usuario | Revisa la cuenta o vuelve a registrarla |
| “Challenge expirado o ya usado” | Pasaron más de 5 minutos | Reinicia el login |
| El navegador no ofrece ninguna passkey | Se creó en otro perfil/dispositivo | Regístrala en el mismo navegador y dispositivo |
| QR y luego nada | El teléfono no completó la creación | Repite y aprueba en el teléfono; el PC debe confirmar |
| Pide contraseña al elegir “llave” | Es el PIN de una FIDO2 física | Usa el QR o una llave real |

## Diagnóstico rápido

En la consola del navegador, con la app abierta:

```js
Auth.passkeysDisponibles();       // true si el navegador soporta WebAuthn
await Auth.listarPasskeys();      // passkeys de la cuenta en el servidor
```

En la petición `POST /api/login`, la respuesta debe incluir:

```json
{ "requires2FA": true, "hasWebAuthn": true }
```

Logs del backend:

```bash
fly logs -a sigmaproxvl-backend
```

## Seguridad

- El registro exige sesión, contraseña actual y TOTP activo.
- Cada challenge se consume una sola vez (TTL 5 min) y de forma atómica.
- La verificación exige `userVerification` y actualiza el contador de firma.
- Una credencial pertenece a una sola cuenta.
- **No se puede desactivar el TOTP mientras la cuenta tenga passkeys.** Primero
  se eliminan las passkeys desde “Mi Perfil”; así nunca se pierde el respaldo.
- Eventos de auditoría: `WEBAUTHN_REGISTER`, `WEBAUTHN_LOGIN_OK` y
  `WEBAUTHN_LOGIN_FAILED`.

## Limitaciones

- La passkey está ligada al origen y al dispositivo/gestor donde se creó.
- En modo incógnito o tras borrar los datos del navegador puede desaparecer.
- En equipos sin autenticador local (habitual en Linux) el navegador ofrece
  teléfono por QR o llave USB, salvo que se use un gestor de passkeys.
- Para iniciar sesión en otro equipo se necesita el mismo gestor sincronizado,
  el teléfono o la llave física.
