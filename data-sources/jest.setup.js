// Jest setup file for Canadian Data Sources
// This file runs before each test file

// Set up environment variables for testing
process.env.NODE_ENV = 'test';
process.env.STATSCAN_API_KEY = 'test-stats-can-key';
process.env.CMHC_API_KEY = 'test-cmhc-key';
process.env.BANK_OF_CANADA_API_KEY = 'test-boc-key';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set up test timeout
jest.setTimeout(10000);

// Mock Date.now() for consistent testing
const mockDate = new Date('2024-01-01T00:00:00.000Z');
global.Date.now = jest.fn(() => mockDate.getTime());

// Mock Math.random for deterministic tests
global.Math.random = jest.fn(() => 0.5);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

// Global test utilities
global.testUtils = {
  createMockLocation: (overrides = {}) => ({
    city: 'Toronto',
    province: 'ONTARIO',
    postalCode: 'M5V 3A8',
    coordinates: {
      latitude: 43.6532,
      longitude: -79.3832
    },
    ...overrides
  }),
  
  createMockHousingData: (overrides = {}) => ({
    source: { name: 'Statistics Canada', type: 'government', reliability: 0.95, lastVerified: new Date() },
    location: global.testUtils.createMockLocation(),
    prices: {
      averagePrice: 1200000,
      medianPrice: 1100000,
      pricePerSqFt: 1200,
      lastUpdated: new Date()
    },
    rental: {
      averageRent: 2500,
      medianRent: 2300,
      vacancyRate: 0.02,
      lastUpdated: new Date()
    },
    market: {
      daysOnMarket: 15,
      inventoryLevel: 'low',
      marketTrend: 'increasing',
      lastUpdated: new Date()
    },
    lastUpdated: new Date(),
    ...overrides
  }),
  
  createMockEconomicData: (overrides = {}) => ({
    source: { name: 'Bank of Canada', type: 'government', reliability: 0.98, lastVerified: new Date() },
    interestRates: {
      policyRate: 5.0,
      primeRate: 7.2,
      mortgageRate: 6.8
    },
    inflation: {
      cpi: 3.2,
      coreInflation: 2.8,
      yearOverYear: 0.4
    },
    exchangeRates: {
      usd: 0.74,
      eur: 0.68,
      gbp: 0.58
    },
    lastUpdated: new Date(),
    ...overrides
  }),
  
  createMockHealthStatus: (overrides = {}) => ({
    status: 'healthy',
    responseTime: 150,
    lastChecked: new Date(),
    errors: [],
    dataQuality: {
      completeness: 0.95,
      accuracy: 0.98,
      freshness: 0.90,
      consistency: 0.92,
      reliability: 0.94
    },
    uptime: 99.5,
    ...overrides
  }),
  
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  createMockError: (message = 'Test error', source = 'test') => ({
    source,
    endpoint: '/test',
    timestamp: new Date(),
    error: message,
    retryCount: 0,
    isRetryable: true
  })
};