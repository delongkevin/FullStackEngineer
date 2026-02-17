import { describe, it, expect } from 'vitest';
import { embedAppsConfig } from './embedApps';

describe('embedAppsConfig', () => {
  it('should export a configuration object', () => {
    expect(embedAppsConfig).toBeDefined();
    expect(typeof embedAppsConfig).toBe('object');
  });

  it('should have app1 configuration with required fields', () => {
    expect(embedAppsConfig.app1).toBeDefined();
    expect(embedAppsConfig.app1.url).toBeDefined();
    expect(typeof embedAppsConfig.app1.url).toBe('string');
    expect(embedAppsConfig.app1.apiKey).toBeDefined();
    expect(typeof embedAppsConfig.app1.apiKey).toBe('string');
  });

  it('should have app2 configuration with required fields', () => {
    expect(embedAppsConfig.app2).toBeDefined();
    expect(embedAppsConfig.app2.url).toBeDefined();
    expect(typeof embedAppsConfig.app2.url).toBe('string');
    expect(embedAppsConfig.app2.apiKey).toBeDefined();
    expect(typeof embedAppsConfig.app2.apiKey).toBe('string');
  });

  it('should have valid URL format for app configurations', () => {
    expect(embedAppsConfig.app1.url).toMatch(/^https?:\/\//);
    expect(embedAppsConfig.app2.url).toMatch(/^https?:\/\//);
  });

  it('should not use placeholder API keys or example URLs in production', () => {
    if (process.env.NODE_ENV !== 'production') {
      // In non-production environments we allow placeholder values.
      return;
    }

    const placeholderKeyPattern = /^YOUR_API_KEY_\d+$/;

    expect(embedAppsConfig.app1.apiKey).toBeDefined();
    expect(embedAppsConfig.app2.apiKey).toBeDefined();

    expect(embedAppsConfig.app1.apiKey).not.toMatch(placeholderKeyPattern);
    expect(embedAppsConfig.app2.apiKey).not.toMatch(placeholderKeyPattern);

    expect(embedAppsConfig.app1.url).toBeDefined();
    expect(embedAppsConfig.app2.url).toBeDefined();

    expect(embedAppsConfig.app1.url).not.toContain('example.com');
    expect(embedAppsConfig.app2.url).not.toContain('example.com');
  });
});
