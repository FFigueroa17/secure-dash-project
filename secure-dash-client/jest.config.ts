import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    // Exclude specific files and directories
    '!src/app/_*.{js,jsx,ts,tsx}',
    '!src/**/types/**',
    '!src/**/index.{js,jsx,ts,tsx}',
    // Exclude Providers
    '!src/components/providers.tsx',
    // Exclude ShadCN UI components from coverage analysis
    '!src/components/ui/**/*.{js,jsx,ts,tsx}',
  ],
  // TODO: Uncomment the following lines to enforce coverage thresholds
  // coverageThreshold: {
  //   global: {
  //     branches: 60,
  //     functions: 60,
  //     lines: 60,
  //     statements: 60,
  //   },
  //   './src/components/data-table/': {
  //     branches: 60,
  //     functions: 60,
  //     lines: 60,
  //     statements: 60,
  //   },
  //   './src/hooks/': {
  //     branches: 60,
  //     functions: 60,
  //     lines: 60,
  //     statements: 60,
  //   },
  //   './src/lib/': {
  //     branches: 60,
  //     functions: 60,
  //     lines: 60,
  //     statements: 60,
  //   },
  // },
  coverageProvider: 'v8',
  coverageReporters: ['text', 'lcov', 'json-summary'],
  testMatch: [
    '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
