// src/types/jest.d.ts
// Global Jest types for TypeScript

import '@jest/types';

declare global {
  const describe: jest.Describe;
  const it: jest.It;
  const test: jest.It;
  const expect: jest.Expect;
  const beforeAll: jest.Lifecycle;
  const afterAll: jest.Lifecycle;
  const beforeEach: jest.Lifecycle;
  const afterEach: jest.Lifecycle;
}