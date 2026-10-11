const test = require('node:test');
const assert = require('node:assert/strict');
const { validatePlaceInput, buildGoogleMapsSearchUrl } = require('../src/lib/places.ts');

test('rejects invalid place inputs', () => {
  const result = validatePlaceInput({ name: '', address: '', category: 'Other' });
  assert.equal(result.ok, false);
  assert.ok(result.errors.length > 0);
});

test('builds a Google Maps search URL', () => {
  const url = buildGoogleMapsSearchUrl('Blue Lake', 'Bend, Oregon');
  assert.equal(url, 'https://www.google.com/maps/search/?api=1&query=Blue%20Lake%20Bend%2C%20Oregon');
});
