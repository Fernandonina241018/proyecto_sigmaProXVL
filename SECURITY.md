# Seguridad — StatAnalyzer Pro

## Reportar una vulnerabilidad

No abras un issue público. Escribe a **soporte@statanalyzer.com** con asunto
`[SECURITY] StatAnalyzer Pro` e incluye:

- descripción y impacto,
- pasos para reproducir,
- versión/commit afectado,
- evidencia mínima (sin datos personales ni credenciales reales).

Acuse de recibo: mejor esfuerzo en **5 días hábiles**. No hay programa de
recompensas por ahora.

## Alcance

- Aplicación web y API (`proyecto_sigmaProXVL`).
- Servicio ML (`sigmapro-ml`).
- Autenticación, sesiones, 2FA, auditoría y firma electrónica.

Quedan fuera: ingeniería social, denegación de servicio, acceso físico y
pruebas contra cuentas/datos de terceros sin autorización.

## Reglas de divulgación

- Da un plazo razonable antes de publicar.
- No accedas, modifiques ni exfiltres datos de otros usuarios.
- No uses datos reales de producción en pruebas.
- No pruebes sobre infraestructura de terceros (Fly, Supabase, GitHub).

## Versiones soportadas

Solo la rama `main` desplegada recibe correcciones de seguridad.

## Prácticas actuales

- TLS/HSTS, JWT con issuer/audience, cookies `HttpOnly/Secure`, CSRF por header.
- bcrypt costo 12, política de contraseñas, bloqueo por intentos y 2FA TOTP.
- Rate limiting por ruta, auditoría con cadena de hash, backups y revisión de dependencias en progreso.

El programa de seguridad, el registro de riesgos y las evidencias se mantienen
en un repositorio privado separado.
