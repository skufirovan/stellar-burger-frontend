import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/'
    }),
    '^@slices/(.*)$': '<rootDir>/src/services/slices/$1',
    '^@store$': '<rootDir>/src/services/store.ts',
    '^@api$': '<rootDir>/src/utils/burger-api.ts'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  collectCoverage: true,
  coverageDirectory: 'coverage'
};

export default config;
