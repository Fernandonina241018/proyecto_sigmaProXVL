const { test } = require('node:test');
const assert = require('node:assert/strict');
const { maskIP } = require('../ip-mask');

test('IPv4 conserva los dos primeros octetos', () => {
    assert.equal(maskIP('190.12.34.56'), '190.12.•.•');
    assert.equal(maskIP('8.8.8.8'), '8.8.•.•');
});

test('IPv4 mapeada en IPv6 se enmascara como IPv4', () => {
    assert.equal(maskIP('::ffff:190.12.34.56'), '190.12.•.•');
});

test('IPv6 conserva los cuatro primeros grupos', () => {
    assert.equal(maskIP('2001:0db8:85a3:0000:0000:8a2e:0370:7334'), '2001:0db8:85a3:0000:•:•:•:•');
});

test('loopback y vacío', () => {
    assert.equal(maskIP('::1'), '127.0.•.•');
    assert.equal(maskIP(''), null);
    assert.equal(maskIP(null), null);
});
