// Formato único dd/Mmm/AAAA HH:MM:SS. node --test tests/sign-stamp.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { signStamp } = require('../sign-stamp');

test('formato dd/Mmm/AAAA HH:MM:SS 24h', () => {
  // Mes/día/hora fijos en hora local (constructor local, sin zona)
  const s = signStamp(new Date(2026, 8, 19, 14, 5, 9));
  assert.equal(s, '19/Sep/2026 14:05:09');
});

test('padding y medianoche/mediodía', () => {
  assert.equal(signStamp(new Date(2026, 0, 1, 0, 0, 0)), '01/Ene/2026 00:00:00');
  assert.equal(signStamp(new Date(2026, 11, 31, 23, 59, 59)), '31/Dic/2026 23:59:59');
});

test('regex general del formato', () => {
  assert.match(signStamp(new Date()), /^\d{2}\/[A-Z][a-z]{2}\/\d{4} \d{2}:\d{2}:\d{2}$/);
});
