// ========================================
// DeviceFingerprint.js — StatAnalyzer Pro
// § 11.10(h) — Device Checks (fingerprint)
// ========================================

const DeviceFingerprint = (() => {
    let _cachedFingerprint = null;
    let _cachedInfo = null;

    function _canvasFingerprint() {
        try {
            var canvas = document.createElement('canvas');
            canvas.width = 240;
            canvas.height = 60;
            var ctx = canvas.getContext('2d');
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillStyle = '#f60';
            ctx.fillRect(0, 0, 240, 60);
            ctx.fillStyle = '#069';
            ctx.fillText('StatAnalyzerPro', 10, 10);
            ctx.fillStyle = 'rgba(102, 126, 234, 0.5)';
            ctx.fillText('CFR21§11.10(h)', 15, 30);
            ctx.beginPath();
            ctx.arc(200, 30, 15, 0, Math.PI * 2);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            return canvas.toDataURL();
        } catch (e) {
            return 'canvas-error';
        }
    }

    function _hash(str) {
        var hash = 0, i, chr;
        if (str.length === 0) return '0';
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return Math.abs(hash).toString(16);
    }

    function getDeviceInfo() {
        if (_cachedInfo) return _cachedInfo;
        var nav = navigator;
        var info = {
            userAgent: nav.userAgent || '',
            platform: nav.platform || '',
            language: nav.language || nav.languages?.[0] || '',
            screen: screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
            cores: nav.hardwareConcurrency || '',
            memory: nav.deviceMemory || '',
            touch: 'ontouchstart' in window ? '1' : '0',
            canvas: _canvasFingerprint(),
        };
        _cachedInfo = info;
        return info;
    }

    function getFingerprint() {
        if (_cachedFingerprint) return _cachedFingerprint;
        var info = getDeviceInfo();
        var raw = info.userAgent + '|' + info.platform + '|' + info.language + '|' +
            info.screen + '|' + info.timezone + '|' + info.cores + '|' +
            info.memory + '|' + info.touch + '|' + info.canvas;
        _cachedFingerprint = _hash(raw);
        return _cachedFingerprint;
    }

    function getDeviceLabel() {
        var nav = navigator;
        var ua = nav.userAgent || '';
        var browser = 'Desconocido';
        if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
        else if (ua.includes('Edg')) browser = 'Edge';
        else if (ua.includes('OPR') || ua.includes('Opera')) browser = 'Opera';
        var os = 'Desconocido';
        if (ua.includes('Windows')) os = 'Windows';
        else if (ua.includes('Mac OS')) os = 'macOS';
        else if (ua.includes('Linux') && !ua.includes('Android')) os = 'Linux';
        else if (ua.includes('Android')) os = 'Android';
        else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
        return browser + ' · ' + os;
    }

    function clearCache() {
        _cachedFingerprint = null;
        _cachedInfo = null;
    }

    return {
        getFingerprint: getFingerprint,
        getDeviceInfo: getDeviceInfo,
        getDeviceLabel: getDeviceLabel,
        clearCache: clearCache,
    };
})();

