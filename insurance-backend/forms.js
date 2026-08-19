// Bureau forms metadata (ISO/ACORD) served by GET /forms and /forms/:formNumber
const FORMS = [
  { formNumber: 'CG 00 01', description: 'Commercial General Liability Coverage Form', edition: '12 19', bureau: 'ISO', lineOfBusiness: 'gl' },
  { formNumber: 'CA 00 01', description: 'Business Auto Coverage Form', edition: '10 13', bureau: 'ISO', lineOfBusiness: 'auto' },
  { formNumber: 'CP 00 10', description: 'Building and Personal Property', edition: '10 12', bureau: 'ISO', lineOfBusiness: 'property' },
  { formNumber: 'WC 00 00 00', description: 'Workers Compensation and EL', edition: '01 15', bureau: 'NCCI', lineOfBusiness: 'wc' },
  { formNumber: 'CP 00 30', description: 'Business Income (and Extra Expense)', edition: '10 12', bureau: 'ISO', lineOfBusiness: 'property' },
  { formNumber: 'CG 20 10', description: 'Additional Insured – Scheduled', edition: '07 04', bureau: 'ISO', lineOfBusiness: 'gl' },
  { formNumber: 'IL 00 03', description: 'Calculation of Premium', edition: '07 02', bureau: 'ISO', lineOfBusiness: 'all' },
  { formNumber: 'CA 20 01', description: 'Hired Auto – Specified as Covered', edition: '10 13', bureau: 'ISO', lineOfBusiness: 'auto' },
  { formNumber: 'CP 10 30', description: 'Causes of Loss – Special Form', edition: '10 12', bureau: 'ISO', lineOfBusiness: 'property' },
  { formNumber: 'ACORD 130', description: 'Commercial Lines Application', edition: '01/2015', bureau: 'ACORD', lineOfBusiness: 'all' },
];

function validateForm(formNumber, payload) {
  const form = FORMS.find((f) => f.formNumber.replace(/\s/g, '') === String(formNumber).replace(/\s/g, ''));
  const checks = [
    { name: 'Form exists in bureau library', pass: Boolean(form) },
    { name: 'Policy number present', pass: Boolean(payload && payload.policyNumber) },
    { name: 'Effective date present', pass: Boolean(payload && payload.effectiveDate) },
    { name: 'Coverage data present', pass: Boolean(payload && (payload.coverages || payload.coverageData)) },
  ];
  return { formNumber, valid: checks.every((c) => c.pass), checks };
}

module.exports = { FORMS, validateForm };
