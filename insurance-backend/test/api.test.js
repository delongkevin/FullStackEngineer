const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

// Use an isolated db file for tests so we don't mutate the seeded dev db.
const TEST_DB = path.join(__dirname, '..', 'db.test.json');
if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);

const { calculatePremium } = require('../ratingEngine');
const { validateForm } = require('../forms');

test('calculatePremium applies territory, limit, and deductible factors', () => {
  const result = calculatePremium({ lineOfBusiness: 'gl', state: 'CA', limit: 1000000, deductible: 1000, baseExposure: 500, experienceMod: 1 });
  assert.equal(result.territoryFactor, 1.35);
  assert.equal(result.limitFactor, 1.0);
  assert.equal(result.deductibleCredit, 0.06);
  assert.ok(result.indicatedPremium > 0);
});

test('calculatePremium falls back to neutral factors for unknown state', () => {
  const result = calculatePremium({ lineOfBusiness: 'auto', state: 'ZZ', limit: 1000000, deductible: 0 });
  assert.equal(result.territoryFactor, 1.0);
});

test('validateForm passes when required fields are present', () => {
  const result = validateForm('CG 00 01', { policyNumber: 'POL-1', effectiveDate: '2024-01-01', coverages: [] });
  assert.equal(result.valid, true);
});

test('validateForm fails when required fields are missing', () => {
  const result = validateForm('CG 00 01', {});
  assert.equal(result.valid, false);
});
