// PolicyCore Insurance Policy Administration System — REST API backend
// Implements the same endpoints shown in the PolicyCore API Studio demo, backed by a real
// (file-based) data store so requests actually persist and mutate server-side state.

const express = require('express');
const cors = require('cors');

const store = require('./store');
const { calculatePremium } = require('./ratingEngine');
const { FORMS, validateForm } = require('./forms');

const app = express();
const PORT = process.env.PORT || 4100;

app.use(cors());
app.use(express.json());

function notFound(res, message) {
  return res.status(404).json({ error: message });
}

// GET /policies — list all policies with basic pagination/filtering
app.get('/policies', (req, res) => {
  const { page = 1, pageSize = 20, lob, status } = req.query;
  let data = store.listPolicies();
  if (lob) data = data.filter((p) => p.lineOfBusiness === lob);
  if (status) data = data.filter((p) => p.status === status);
  res.json({ data, pagination: { page: Number(page), pageSize: Number(pageSize), total: data.length } });
});

// POST /policies — create a new policy
app.post('/policies', (req, res) => {
  const { insuredName, lineOfBusiness, state, effectiveDate, expirationDate, coverages = [] } = req.body || {};
  if (!insuredName || !lineOfBusiness || !state || !effectiveDate) {
    return res.status(400).json({ error: 'insuredName, lineOfBusiness, state, and effectiveDate are required' });
  }
  const policyNumber = `POL-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const rated = coverages.map((c) => calculatePremium({ lineOfBusiness, state, limit: c.limit, deductible: c.deductible }));
  const writtenPremium = Math.round(rated.reduce((sum, r) => sum + r.indicatedPremium, 0));
  const policy = store.createPolicy({
    policyNumber,
    insuredName,
    lineOfBusiness,
    state,
    effectiveDate,
    expirationDate,
    status: 'pending',
    writtenPremium,
    coverages,
  });
  res.status(201).json({ ...policy, message: 'Policy created successfully' });
});

// GET /policies/:id — fetch a single policy
app.get('/policies/:id', (req, res) => {
  const policy = store.getPolicy(req.params.id);
  if (!policy) return notFound(res, `Policy ${req.params.id} not found`);
  res.json(policy);
});

// PUT /policies/:id — update policy coverages/details and re-rate
app.put('/policies/:id', (req, res) => {
  const existing = store.getPolicy(req.params.id);
  if (!existing) return notFound(res, `Policy ${req.params.id} not found`);
  const patch = req.body || {};
  let writtenPremium = existing.writtenPremium;
  if (patch.coverages) {
    const rated = patch.coverages.map((c) => calculatePremium({ lineOfBusiness: existing.lineOfBusiness, state: existing.state, limit: c.limit, deductible: c.deductible }));
    writtenPremium = Math.round(rated.reduce((sum, r) => sum + r.indicatedPremium, 0));
  }
  const updated = store.updatePolicy(req.params.id, { ...patch, writtenPremium });
  res.json({ ...updated, revisedPremium: writtenPremium, endorsementNumber: `END-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` });
});

// DELETE /policies/:id — cancel a policy (soft delete / removal)
app.delete('/policies/:id', (req, res) => {
  const existing = store.getPolicy(req.params.id);
  if (!existing) return notFound(res, `Policy ${req.params.id} not found`);
  store.deletePolicy(req.params.id);
  res.json({ policyNumber: req.params.id, status: 'cancelled', returnPremium: Math.round(existing.writtenPremium * 0.5), message: 'Policy cancelled pro-rata' });
});

// POST /policies/:id/rate — re-rate a policy with current bureau factors
app.post('/policies/:id/rate', (req, res) => {
  const existing = store.getPolicy(req.params.id);
  if (!existing) return notFound(res, `Policy ${req.params.id} not found`);
  const { experienceMod = 1.0 } = req.body || {};
  const coverage = (existing.coverages && existing.coverages[0]) || { limit: 1000000, deductible: 0 };
  const rated = calculatePremium({ lineOfBusiness: existing.lineOfBusiness, state: existing.state, limit: coverage.limit, deductible: coverage.deductible, experienceMod });
  res.json({ ...rated, ratingDate: new Date().toISOString().slice(0, 10) });
});

// GET /forms — list bureau forms
app.get('/forms', (req, res) => {
  res.json({ data: FORMS });
});

// GET /forms/:formNumber — fetch a single form's metadata
app.get('/forms/:formNumber', (req, res) => {
  const form = FORMS.find((f) => f.formNumber.replace(/\s/g, '') === req.params.formNumber.replace(/\s/g, ''));
  if (!form) return notFound(res, `Form ${req.params.formNumber} not found`);
  res.json(form);
});

// POST /forms/validate — validate a submitted form payload
app.post('/forms/validate', (req, res) => {
  const { formNumber, ...payload } = req.body || {};
  if (!formNumber) return res.status(400).json({ error: 'formNumber is required' });
  res.json(validateForm(formNumber, payload));
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'insurance-backend' }));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`PolicyCore insurance-backend listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
