// FASE 3 — tests del parser de firmas incrustadas.
// node --test tests/sign-html.test.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { extractEmbeddedSignatures } = require('../sign-html');

function block(role, name) {
  const v = name || '—';
  return (
    `<div style="x" data-signature-role="${role}">` +
    `<div>LABEL</div>` +
    `<div><span>L</span><span data-signature-field="name" data-signature-role="${role}">${v}</span></div>` +
    `<div><span>L</span><span data-signature-field="title" data-signature-role="${role}">T</span></div>` +
    `</div>`
  );
}
const HTML = `<html><body>${block('prepared', 'Ana Pérez')}${block('reviewed', '')}${block('approved', '—')}</body></html>`;

test('detecta prepared firmado y reviewed/approved vacíos', () => {
  const r = extractEmbeddedSignatures(HTML);
  assert.equal(r.prepared.signed, true);
  assert.equal(r.prepared.name, 'Ana Pérez');
  assert.equal(r.reviewed.signed, false);
  assert.equal(r.approved.signed, false);
});

test('html sin bloques → todo no firmado', () => {
  const r = extractEmbeddedSignatures('<html><body>hola</body></html>');
  assert.equal(r.prepared.signed, false);
  assert.equal(r.reviewed.signed, false);
  assert.equal(r.approved.signed, false);
});

test('html vacío/null no rompe', () => {
  assert.equal(extractEmbeddedSignatures('').prepared.signed, false);
  assert.equal(extractEmbeddedSignatures(null).approved.signed, false);
});

test('nombre con tags se limpia', () => {
  const dirty = `<div data-signature-role="prepared"><span data-signature-field="name" data-signature-role="prepared"><b>Ana</b></span></div>`;
  const r = extractEmbeddedSignatures(dirty);
  assert.equal(r.prepared.signed, true);
  assert.equal(r.prepared.name, 'Ana');
});
