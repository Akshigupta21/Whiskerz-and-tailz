// Test setup file
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_URI = 'mongodb://localhost:27017/wiskerzandtail-test';

// Set test timeout
jest.setTimeout(10000);
