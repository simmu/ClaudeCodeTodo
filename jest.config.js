/** @type {import('jest').Config} */
export default {
  projects: [
    // Frontend tests
    {
      displayName: 'frontend',
      testMatch: ['<rootDir>/tests/unit/frontend/**/*.test.{ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/tests/utils/setupTests.ts'],
      moduleNameMapping: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/packages/frontend/src/$1',
        '^@shared/(.*)$': '<rootDir>/packages/shared/src/$1',
      },
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
      collectCoverageFrom: [
        'packages/frontend/src/**/*.{ts,tsx}',
        '!packages/frontend/src/**/*.d.ts',
        '!packages/frontend/src/main.tsx',
      ],
    },
    
    // Backend tests
    {
      displayName: 'backend',
      testMatch: ['<rootDir>/tests/unit/backend/**/*.test.ts'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/utils/setupTestsBackend.ts'],
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/packages/backend/src/$1',
        '^@shared/(.*)$': '<rootDir>/packages/shared/src/$1',
      },
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      collectCoverageFrom: [
        'packages/backend/src/**/*.ts',
        '!packages/backend/src/**/*.d.ts',
        '!packages/backend/src/server.ts',
      ],
    },
    
    // Shared package tests
    {
      displayName: 'shared',
      testMatch: ['<rootDir>/tests/unit/shared/**/*.test.ts'],
      testEnvironment: 'node',
      moduleNameMapping: {
        '^@shared/(.*)$': '<rootDir>/packages/shared/src/$1',
        '\\.js$': '$1', // Map .js imports to the actual files
      },
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      collectCoverageFrom: [
        'packages/shared/src/**/*.ts',
        '!packages/shared/src/**/*.d.ts',
      ],
      globals: {
        'ts-jest': {
          useESM: true,
          tsconfig: {
            module: 'esnext',
          },
        },
      },
    },
    
    // Integration tests
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/utils/setupIntegrationTests.ts'],
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/packages/backend/src/$1',
        '^@shared/(.*)$': '<rootDir>/packages/shared/src/$1',
      },
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      testTimeout: 30000,
    },
  ],
  
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  clearMocks: true,
  verbose: true,
};