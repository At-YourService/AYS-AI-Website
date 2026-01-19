import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use happy-dom for lightweight DOM testing
    environment: 'happy-dom',

    // Enable global test APIs (describe, it, expect, etc.)
    globals: true,

    // Test file patterns - only build validation tests
    include: [
      'tests/build/**/*.test.js'
    ],

    // Test timeout
    testTimeout: 10000,

    // Hooks timeout
    hookTimeout: 10000,
  },
});
