import { describe, it, expect } from 'vitest';
import { embedAppsConfig } from './embedApps';

describe('embedAppsConfig', () => {
  it('should have app configurations with local project url and apiKey', () => {
    const entries = Object.values(embedAppsConfig);
    expect(entries.length).toBeGreaterThanOrEqual(6);

    entries.forEach((app) => {
      expect(app.url).toMatch(/^\/projects\/[\w-]+\/index\.html$/);
      expect(app.apiKey).toEqual(expect.any(String));
      expect(app.apiKey.length).toBeGreaterThan(10);
    });
  });

  it('should not use placeholder values', () => {
    const entries = Object.values(embedAppsConfig);
    entries.forEach((app) => {
      expect(app.apiKey).not.toMatch(/^YOUR_API_KEY/i);
      expect(app.url).not.toContain('example.com');
    });
  });
});
