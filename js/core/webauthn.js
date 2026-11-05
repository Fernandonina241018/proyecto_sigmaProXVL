// ========================================
// webauthn.js — Passkeys (WebAuthn) en el navegador
// StatAnalyzer Pro
// ========================================
// Registro y login con passkeys (huella/rostro/llave de seguridad).
// El backend (@simplewebauthn/server) emite las opciones y verifica la
// respuesta; aquí solo se convierten base64url <-> ArrayBuffer y se llama
// a navigator.credentials.
//
// Requiere que el frontend se sirva desde el mismo RP ID configurado en el
// backend (WEBAUTHN_RP_ID). En producción: fernandonina241018.github.io
const WebAuthn = (() => {

    function _api() {
        try { return (typeof API_URL !== 'undefined' && API_URL) ? API_URL : ''; } catch (e) { return ''; }
    }

    function _token() {
        try { return (typeof Auth !== 'undefined' && Auth.getToken) ? (Auth.getToken() || '') : ''; } catch (e) { return ''; }
    }

    // ── base64url ─────────────────────────────
    function _b64urlToBuf(value) {
        var s = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
        while (s.length % 4) s += '=';
        var bin = '';
        try { bin = atob(s); } catch (e) { throw new Error('base64url inválido'); }
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return bytes.buffer;
    }

    function _bufToB64url(buf) {
        var bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
        var bin = '';
        for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    function soportado() {
        try {
            return typeof navigator !== 'undefined'
                && !!navigator.credentials
                && typeof navigator.credentials.create === 'function'
                && typeof navigator.credentials.get === 'function';
        } catch (e) { return false; }
    }

    // ── Conversión de opciones del servidor ───
    // generateRegistrationOptions/generateAuthenticationOptions entregan
    // los buffers como base64url; navigator.credentials exige ArrayBuffer.
    function prepararCreacion(options) {
        var o = options || {};
        var pub = {
            challenge: _b64urlToBuf(o.challenge),
            rp: o.rp,
            user: {
                id: _b64urlToBuf(o.user && o.user.id),
                name: o.user && o.user.name,
                displayName: o.user && o.user.displayName,
            },
            pubKeyCredParams: o.pubKeyCredParams || [],
            timeout: o.timeout,
            attestation: o.attestation,
            authenticatorSelection: o.authenticatorSelection,
            excludeCredentials: (o.excludeCredentials || []).map(function(c) {
                return { id: _b64urlToBuf(c.id), type: c.type || 'public-key', transports: c.transports };
            }),
            extensions: o.extensions,
        };
        if (o.hints) pub.hints = o.hints;
        return pub;
    }

    function prepararGet(options) {
        var o = options || {};
        return {
            challenge: _b64urlToBuf(o.challenge),
            rpId: o.rpId,
            timeout: o.timeout,
            userVerification: o.userVerification,
            allowCredentials: (o.allowCredentials || []).map(function(c) {
                return { id: _b64urlToBuf(c.id), type: c.type || 'public-key', transports: c.transports };
            }),
            extensions: o.extensions,
        };
    }

    function serializarRegistro(cred) {
        var r = cred.response;
        var out = {
            id: cred.id,
            rawId: _bufToB64url(cred.rawId),
            type: cred.type || 'public-key',
            clientExtensionResults: cred.getClientExtensionResults ? cred.getClientExtensionResults() : {},
            response: {
                clientDataJSON: _bufToB64url(r.clientDataJSON),
                attestationObject: _bufToB64url(r.attestationObject),
                transports: (r.getTransports ? r.getTransports() : []),
            },
        };
        if (cred.authenticatorAttachment) out.authenticatorAttachment = cred.authenticatorAttachment;
        return out;
    }

    function serializarAuth(cred) {
        var r = cred.response;
        var out = {
            id: cred.id,
            rawId: _bufToB64url(cred.rawId),
            type: cred.type || 'public-key',
            clientExtensionResults: cred.getClientExtensionResults ? cred.getClientExtensionResults() : {},
            response: {
                clientDataJSON: _bufToB64url(r.clientDataJSON),
                authenticatorData: _bufToB64url(r.authenticatorData),
                signature: _bufToB64url(r.signature),
                userHandle: r.userHandle ? _bufToB64url(r.userHandle) : undefined,
            },
        };
        if (cred.authenticatorAttachment) out.authenticatorAttachment = cred.authenticatorAttachment;
        return out;
    }

    // ── HTTP ──────────────────────────────────
    async function _request(path, opts) {
        var o = opts || {};
        var headers = { 'Content-Type': 'application/json' };
        if (o.auth) headers.Authorization = 'Bearer ' + _token();
        var fn = (typeof fetchWithTimeout === 'function') ? fetchWithTimeout : fetch;
        return fn(_api() + path, {
            method: o.method || 'POST',
            headers: headers,
            credentials: 'include',
            body: o.body ? JSON.stringify(o.body) : undefined,
        });
    }

    async function _json(res) {
        var data = {};
        try { data = await res.json(); } catch (e) { data = {}; }
        if (!res.ok) {
            var err = new Error(data.error || 'Error del servidor');
            err.status = res.status;
            throw err;
        }
        return data;
    }

    function _normalizarError(err) {
        if (err && (err.name === 'NotAllowedError' || err.name === 'AbortError')) {
            return { ok: false, cancelled: true, error: 'Operación cancelada o tiempo agotado.' };
        }
        if (err && err.name === 'SecurityError') {
            return { ok: false, error: 'Dominio no autorizado para passkeys. Revisa WEBAUTHN_RP_ID/ORIGIN.' };
        }
        return { ok: false, error: (err && err.message) || 'No se pudo completar la operación con passkey.' };
    }

    // ── Registro (requiere sesión + contraseña) ─
    async function registrar(datos) {
        var d = datos || {};
        if (!soportado()) return { ok: false, error: 'Este navegador no admite passkeys.' };
        try {
            var res = await _request('/api/webauthn/register/options', {
                auth: true,
                body: { password: d.password },
            });
            var data = await _json(res);
            var publicKey = prepararCreacion(data.options);
            var cred = await navigator.credentials.create({ publicKey: publicKey });
            var payload = serializarRegistro(cred);

            var verify = await _request('/api/webauthn/register/verify', {
                auth: true,
                body: {
                    response: payload,
                    password: d.password,
                    deviceName: d.deviceName || 'Passkey',
                },
            });
            var result = await _json(verify);
            return { ok: true, message: result.message || 'Passkey registrada correctamente' };
        } catch (err) {
            return _normalizarError(err);
        }
    }

    // ── Login (usa tempToken del primer factor) ─
    async function autenticar(datos) {
        var d = datos || {};
        if (!soportado()) return { ok: false, error: 'Este navegador no admite passkeys.' };
        if (!d.tempToken) return { ok: false, error: 'Falta el token temporal de 2FA.' };
        try {
            var res = await _request('/api/webauthn/login/options', {
                body: { tempToken: d.tempToken },
            });
            var data = await _json(res);
            var publicKey = prepararGet(data.options);
            var cred = await navigator.credentials.get({ publicKey: publicKey });
            var payload = serializarAuth(cred);

            var verify = await _request('/api/webauthn/login/verify', {
                body: { tempToken: d.tempToken, response: payload },
            });
            var result = await _json(verify);
            return {
                ok: true,
                username: result.username,
                role: result.role,
                token: result.token,
            };
        } catch (err) {
            return _normalizarError(err);
        }
    }

    // ── Gestión ───────────────────────────────
    async function listar() {
        try {
            var res = await _request('/api/webauthn/credentials', { method: 'GET', auth: true });
            var data = await _json(res);
            return { ok: true, credentials: data.credentials || [] };
        } catch (err) {
            return _normalizarError(err);
        }
    }

    async function eliminar(credentialId) {
        try {
            var res = await _request('/api/webauthn/credentials/' + encodeURIComponent(credentialId), {
                method: 'DELETE',
                auth: true,
            });
            await _json(res);
            return { ok: true };
        } catch (err) {
            return _normalizarError(err);
        }
    }

    return {
        soportado: soportado,
        registrar: registrar,
        autenticar: autenticar,
        listar: listar,
        eliminar: eliminar,
        // Expuestos para tests y depuración.
        _b64urlToBuf: _b64urlToBuf,
        _bufToB64url: _bufToB64url,
        _prepararCreacion: prepararCreacion,
        _prepararGet: prepararGet,
        _serializarRegistro: serializarRegistro,
        _serializarAuth: serializarAuth,
    };
})();
