// Simple dummy test to verify Jest is working

describe('Dummy Test Suite', () => {
  it('should pass a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle strings correctly', () => {
    const greeting = 'Hello World';
    expect(greeting).toBe('Hello World');
    expect(greeting).toContain('World');
    expect(greeting.length).toBeGreaterThan(5);
  });

  it('should work with arrays', () => {
    const fruits = ['apple', 'banana', 'orange'];
    expect(fruits).toHaveLength(3);
    expect(fruits).toContain('banana');
    expect(fruits[0]).toBe('apple');
  });

  it('should work with objects', () => {
    const user = {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com'
    };
    
    expect(user).toHaveProperty('name');
    expect(user.name).toBe('John Doe');
    expect(user.age).toBeGreaterThan(18);
  });

  it('should handle async operations', async () => {
    const asyncFunction = async () => {
      return new Promise(resolve => {
        setTimeout(() => resolve('async result'), 100);
      });
    };

    const result = await asyncFunction();
    expect(result).toBe('async result');
  });

  it('should test environment variables', () => {
    // This will help verify your Next.js config is working
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it('should handle truthiness', () => {
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
    expect(null).toBeFalsy();
    expect(undefined).toBeFalsy();
    expect('').toBeFalsy();
    expect('hello').toBeTruthy();
    expect(0).toBeFalsy();
    expect(1).toBeTruthy();
  });

  it('should work with dates', () => {
    const now = new Date();
    const yesterday = new Date(Date.now() - 86400000);
    
    expect(now).toBeInstanceOf(Date);
    expect(now.getTime()).toBeGreaterThan(yesterday.getTime());
  });
});

// Test group for error handling
describe('Error Handling Tests', () => {
  it('should catch thrown errors', () => {
    const throwError = () => {
      throw new Error('Test error');
    };

    expect(throwError).toThrow();
    expect(throwError).toThrow('Test error');
  });

  it('should handle async errors', async () => {
    const asyncError = async () => {
      throw new Error('Async error');
    };

    await expect(asyncError()).rejects.toThrow('Async error');
  });
});

// Test group for mocking (if you want to learn about mocks)
describe('Mocking Tests', () => {
  it('should mock a function', () => {
    const mockFn = jest.fn();
    mockFn('hello');
    mockFn('world');

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('hello');
    expect(mockFn).toHaveBeenCalledWith('world');
  });

  it('should mock return values', () => {
    const mockFn = jest.fn();
    mockFn.mockReturnValue('mocked result');

    const result = mockFn();
    expect(result).toBe('mocked result');
  });
});