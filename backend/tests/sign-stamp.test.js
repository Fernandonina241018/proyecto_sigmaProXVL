// Formato único dd/Mmm/AAAA HH:MM:SS. node --test tests/sign-stamp.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { signStamp } = require('../sign-stamp');

test('formato dd/Mmm/AAAA HH:MM:SS AM/PM', () => {
  // Mes/día/hora fijos en hora local (constructor local, sin zona)
  const s = signStamp(new Date(2026, 8, 19, 14, 5, 9));
  assert.equal(s, '19/Sep/2026 02:05:09 PM');
});

test('padding, medianoche y mediodía', () => {
  assert.equal(signStamp(new Date(2026, 0, 1, 0, 0, 0)), '01/Ene/2026 12:00:00 AM');
  assert.equal(signStamp(new Date(2026, 0, 1, 12, 0, 0)), '01/Ene/2026 12:00:00 PM');
  assert.equal(signStamp(new Date(2026, 11, 31, 23, 59, 59)), '31/Dic/2026 11:59:59 PM');
});

test('regex general del formato', () => {
  assert.match(signStamp(new Date()), /^\d{2}\/[A-Z][a-z]{2}\/\d{4} \d{2}:\d{2}:\d{2} (AM|PM)$/);
});
