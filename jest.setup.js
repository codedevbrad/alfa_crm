// jest.setup.js
// Global test setup and configuration

// Increase timeout for database operations
jest.setTimeout(30000);

// Global test hooks
beforeAll(async () => {
  console.log('🧪 Starting Jest test suite...');
});

afterAll(async () => {
  console.log('🧪 Jest test suite completed');
});

// Mock console methods to reduce noise (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };