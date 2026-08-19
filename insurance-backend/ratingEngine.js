// ISO-style bureau rating engine mirroring the client-side RateEngine in the PolicyCore demo.
// P = BaseRate x TerritoryFactor x ClassFactor x LimitFactor x DeductibleCredit x ExperienceMod

const TERRITORY_FACTORS = {
  CA: 1.35, NY: 1.42, FL: 1.28, TX: 1.15, IL: 1.18,
  PA: 1.12, OH: 1.05, MI: 1.08, GA: 1.10, NC: 1.06,
};

const BASE_RATES = {
  auto: 0.0185,
  property: 0.0042,
  gl: 0.0068,
  wc: 0.0155,
};

function limitFactor(limit) {
  if (limit <= 500000) return 0.85;
  if (limit <= 1000000) return 1.0;
  if (limit <= 2000000) return 1.28;
  if (limit <= 5000000) return 1.55;
  return 1.8;
}

function deductibleCredit(deductible) {
  if (deductible <= 0) return 0;
  if (deductible <= 500) return 0.035;
  if (deductible <= 1000) return 0.06;
  if (deductible <= 2500) return 0.105;
  if (deductible <= 5000) return 0.15;
  if (deductible <= 10000) return 0.21;
  if (deductible <= 25000) return 0.28;
  return 0.34;
}

function calculatePremium({ lineOfBusiness, state, limit = 1000000, deductible = 0, baseExposure = 500, experienceMod = 1.0 }) {
  const territoryFactor = TERRITORY_FACTORS[state] || 1.0;
  const baseRate = BASE_RATES[lineOfBusiness] || 0.01;
  const lf = limitFactor(Number(limit) || 1000000);
  const dc = deductibleCredit(Number(deductible) || 0);
  const baseRatePremium = Number(baseExposure) * 1000 * baseRate;
  const indicatedPremium = baseRatePremium * territoryFactor * lf * (1 - dc) * Number(experienceMod || 1);

  return {
    baseRate: Math.round(baseRatePremium * 100) / 100,
    territoryFactor,
    limitFactor: lf,
    deductibleCredit: dc,
    experienceMod: Number(experienceMod || 1),
    indicatedPremium: Math.round(indicatedPremium * 100) / 100,
  };
}

module.exports = { calculatePremium, TERRITORY_FACTORS, BASE_RATES };
