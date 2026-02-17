import { describe, it, expect } from 'vitest';
import { embedAppsConfig } from './embedApps';

describe('embedAppsConfig', () => {
  it('should have app configurations with url and apiKey', () => {
    expect(embedAppsConfig.app1.url).toMatch(/^https?:\/\//);
    expect(embedAppsConfig.app1.apiKey).toEqual(expect.any(String));
    expect(embedAppsConfig.app2.url).toMatch(/^https?:\/\//);
    expect(embedAppsConfig.app2.apiKey).toEqual(expect.any(String));
  });

  it.skipIf(process.env.NODE_ENV !== 'production')('should not use placeholder values in production', () => {
    expect(embedAppsConfig.app1.apiKey).not.toMatch(/^YOUR_API_KEY_\d+$/);
    expect(embedAppsConfig.app2.apiKey).not.toMatch(/^YOUR_API_KEY_\d+$/);
    expect(embedAppsConfig.app1.url).not.toContain('example.com');
    expect(embedAppsConfig.app2.url).not.toContain('example.com');
  });
});
