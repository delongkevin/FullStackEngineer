import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['setup.test.ts', 'data/**/*.test.ts', 'config/**/*.test.ts', 'lib/**/*.test.ts'],
    exclude: ['node_modules', 'real-estate-app/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['data/**/*.ts', 'config/**/*.ts', 'lib/**/*.ts'],
      exclude: ['node_modules', '**/*.test.ts', 'vitest.config.ts'],
    },
  },
});
