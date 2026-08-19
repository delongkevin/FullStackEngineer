// Lightweight JSON-file-backed data store — no native deps required (SQLite/Postgres can be
// swapped in later by replacing this module's implementation behind the same interface).
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

const SEED_POLICIES = [
  { policyNumber: 'POL-2024-008821', insuredName: 'Apex Manufacturing LLC', lineOfBusiness: 'gl', state: 'CA', effectiveDate: '2024-01-01', expirationDate: '2025-01-01', status: 'active', writtenPremium: 18450, coverages: [{ code: 'premops', limit: 1000000, deductible: 0 }] },
  { policyNumber: 'POL-2024-008820', insuredName: 'Sunrise Retail Group', lineOfBusiness: 'property', state: 'TX', effectiveDate: '2024-01-15', expirationDate: '2025-01-15', status: 'active', writtenPremium: 42200, coverages: [{ code: 'building', limit: 2000000, deductible: 5000 }] },
  { policyNumber: 'POL-2024-008819', insuredName: 'Metro Transit Corp', lineOfBusiness: 'auto', state: 'NY', effectiveDate: '2024-01-15', expirationDate: '2025-01-15', status: 'pending', writtenPremium: 67800, coverages: [{ code: 'liability', limit: 1000000, deductible: 0 }] },
  { policyNumber: 'POL-2024-008818', insuredName: 'Blue Ridge Contractors', lineOfBusiness: 'wc', state: 'GA', effectiveDate: '2023-12-01', expirationDate: '2024-12-01', status: 'active', writtenPremium: 29300, coverages: [{ code: 'partB', limit: 500000, deductible: 0 }] },
];

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    writeDb({ policies: SEED_POLICIES });
  }
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    return { policies: SEED_POLICIES };
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  listPolicies() {
    return readDb().policies;
  },
  getPolicy(policyNumber) {
    return readDb().policies.find((p) => p.policyNumber === policyNumber) || null;
  },
  createPolicy(policy) {
    const db = readDb();
    db.policies.unshift(policy);
    writeDb(db);
    return policy;
  },
  updatePolicy(policyNumber, patch) {
    const db = readDb();
    const idx = db.policies.findIndex((p) => p.policyNumber === policyNumber);
    if (idx === -1) return null;
    db.policies[idx] = { ...db.policies[idx], ...patch };
    writeDb(db);
    return db.policies[idx];
  },
  deletePolicy(policyNumber) {
    const db = readDb();
    const before = db.policies.length;
    db.policies = db.policies.filter((p) => p.policyNumber !== policyNumber);
    writeDb(db);
    return db.policies.length < before;
  },
};
