// Core data source interfaces
export interface DataSource {
  readonly name: string;
  readonly baseUrl: string;
  getLastUpdate(): Promise<Date>;
  healthCheck(): Promise<HealthStatus>;
  getAvailableDatasets(): Promise<string[]>;
  getDatasetMetadata(datasetId: string): Promise<any>;
  searchData(query: string, filters?: Record<string, any>): Promise<any[]>;
}

// Data source configuration
export interface DataSourceConfig {
  name: string;
  baseUrl: string;
  apiKey?: string;
  rateLimit: {
    requests: number;
    window: number; // in seconds
  };
  endpoints: {
    [key: string]: {
      path: string;
      method: 'GET' | 'POST';
      params?: string[];
      headers?: Record<string, string>;
    };
  };
  retryConfig: {
    maxRetries: number;
    backoffMultiplier: number;
    initialDelay: number;
  };
  updateFrequency: UpdateFrequency;
  priority: 'critical' | 'high' | 'medium' | 'low';
  retryOnFailure: boolean;
  dataQualityThreshold: number;
}

// Update frequencies for data synchronization
export enum UpdateFrequency {
  REAL_TIME = 'real-time',      // Every request
  HOURLY = 'hourly',           // Every hour
  DAILY = 'daily',             // Every day
  WEEKLY = 'weekly',           // Every week
  MONTHLY = 'monthly',         // Every month
  ANNUALLY = 'annually'        // Every year
}

// Data source schedule for synchronization
export interface DataSourceSchedule {
  source: string;
  frequency: UpdateFrequency;
  lastUpdate: Date;
  nextUpdate: Date;
  priority: 'critical' | 'high' | 'medium' | 'low';
  retryOnFailure: boolean;
  retryCount: number;
  maxRetries: number;
}

// Health status for data sources
export interface HealthStatus {
  status: 'healthy' | 'warning' | 'unhealthy' | 'critical';
  responseTime: number; // in milliseconds
  lastChecked: Date;
  errors: string[];
  dataQuality: DataQualityMetrics;
  uptime: number; // percentage
}

// Data quality metrics
export interface DataQualityMetrics {
  completeness: number;    // Percentage of required fields present (0-1)
  accuracy: number;        // Percentage of data matching expected values (0-1)
  freshness: number;       // Age of data in hours (0-1, where 1 is very fresh)
  consistency: number;     // Consistency across related data points (0-1)
  reliability: number;     // Historical reliability of the data source (0-1)
}

// Performance metrics for monitoring
export interface PerformanceMetrics {
  timestamp: Date;
  responseTime: number;
  success: boolean;
  cacheHit: boolean;
  dataSize: number;
  errorCount: number;
}

// Data source errors
export interface DataSourceError {
  source: string;
  endpoint: string;
  timestamp: Date;
  error: string;
  params?: Record<string, any>;
  retryCount: number;
  isRetryable: boolean;
}

// Cached data structure
export interface CachedData<T = any> {
  data: T;
  timestamp: Date;
  source: string;
  endpoint: string;
  params?: Record<string, any>;
  ttl: number; // time to live in milliseconds
}

// Rate limiter interface
export interface RateLimiter {
  canMakeRequest(): boolean;
  recordRequest(): void;
  getRemainingRequests(): number;
  getResetTime(): Date;
}

// Canadian location types
export interface CanadianLocation {
  city: string;
  province: Province;
  postalCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export enum Province {
  ALBERTA = 'ALBERTA',
  BRITISH_COLUMBIA = 'BRITISH_COLUMBIA',
  MANITOBA = 'MANITOBA',
  NEW_BRUNSWICK = 'NEW_BRUNSWICK',
  NEWFOUNDLAND_AND_LABRADOR = 'NEWFOUNDLAND_AND_LABRADOR',
  NOVA_SCOTIA = 'NOVA_SCOTIA',
  ONTARIO = 'ONTARIO',
  PRINCE_EDWARD_ISLAND = 'PRINCE_EDWARD_ISLAND',
  QUEBEC = 'QUEBEC',
  SASKATCHEWAN = 'SASKATCHEWAN',
  NORTHWEST_TERRITORIES = 'NORTHWEST_TERRITORIES',
  NUNAVUT = 'NUNAVUT',
  YUKON = 'YUKON'
}

// Data source information
export interface DataSourceInfo {
  name: string;
  type: 'government' | 'regulatory' | 'municipal' | 'private';
  reliability: number; // 0-1
  lastVerified: Date;
}

// Housing data interfaces
export interface HousingData {
  source: DataSourceInfo;
  location: CanadianLocation;
  prices: {
    averagePrice: number;
    medianPrice: number;
    pricePerSqFt: number;
    lastUpdated: Date;
  };
  rental: {
    averageRent: number;
    medianRent: number;
    vacancyRate: number;
    lastUpdated: Date;
  };
  market: {
    daysOnMarket: number;
    inventoryLevel: 'low' | 'medium' | 'high';
    marketTrend: 'increasing' | 'decreasing' | 'stable';
    lastUpdated: Date;
  };
  lastUpdated: Date;
}

export interface MortgageRates {
  source: DataSourceInfo;
  rates: {
    fixed5Year: number;
    fixed3Year: number;
    variable: number;
    prime: number;
  };
  terms: {
    minDownPayment: number;
    maxAmortization: number;
    stressTestRate: number;
  };
  lastUpdated: Date;
}

export interface RentalMarketData {
  source: DataSourceInfo;
  location: CanadianLocation;
  rentalRates: {
    studio: number;
    oneBedroom: number;
    twoBedroom: number;
    threeBedroom: number;
  };
  vacancyRates: {
    overall: number;
    byType: Record<string, number>;
  };
  marketTrends: {
    rentGrowth: number;
    vacancyTrend: 'increasing' | 'decreasing' | 'stable';
  };
  lastUpdated: Date;
}

// Economic indicators
export interface EconomicIndicators {
  source: DataSourceInfo;
  interestRates: {
    policyRate: number;
    primeRate: number;
    mortgageRate: number;
  };
  inflation: {
    cpi: number;
    coreInflation: number;
    yearOverYear: number;
  };
  exchangeRates: {
    usd: number;
    eur: number;
    gbp: number;
  };
  lastUpdated: Date;
}

// Utility rates
export interface UtilityRates {
  source: DataSourceInfo;
  location: CanadianLocation;
  electricity: {
    ratePerKwh: number;
    deliveryCharge: number;
    regulatoryCharge: number;
    lastUpdated: Date;
  };
  naturalGas: {
    ratePerM3: number;
    deliveryCharge: number;
    carbonTax: number;
    lastUpdated: Date;
  };
  water: {
    ratePerM3: number;
    wastewaterRate: number;
    stormwaterRate: number;
    lastUpdated: Date;
  };
  lastUpdated: Date;
}

// Government benefits
export interface GovernmentBenefits {
  name: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
  eligibility: {
    age?: { min: number; max: number };
    income?: { min: number; max: number };
    residency?: string[];
    other?: Record<string, any>;
  };
  source: DataSourceInfo;
  lastUpdated: Date;
}

// Tax information
export interface TaxInformation {
  source: DataSourceInfo;
  location: CanadianLocation;
  year: number;
  rates: {
    federal: number;
    provincial: number;
    combined: number;
  };
  brackets: Array<{
    threshold: number;
    rate: number;
  }>;
  credits: {
    basicPersonal: number;
    cpp: number;
    ei: number;
  };
  lastUpdated: Date;
}

// Postal code data
export interface PostalCodeData {
  postalCode: string;
  location: CanadianLocation;
  population: number;
  medianIncome: number;
  averageAge: number;
  lastUpdated: Date;
}

// Cost of living data
export interface CostOfLivingData {
  location: CanadianLocation;
  householdSize: number;
  monthlyBreakdown: {
    housing: number;
    utilities: number;
    transportation: number;
    food: number;
    healthcare: number;
    entertainment: number;
    other: number;
    total: number;
  };
  annualBreakdown: {
    housing: number;
    utilities: number;
    transportation: number;
    food: number;
    healthcare: number;
    entertainment: number;
    other: number;
    total: number;
  };
  dataQuality: DataQualityMetrics;
  lastCalculated: Date;
}

// Salary requirements
export interface SalaryRequirements {
  location: CanadianLocation;
  lifestyle: 'basic' | 'comfortable' | 'luxury';
  householdSize: number;
  monthlyRequired: number;
  annualRequired: number;
  breakdown: {
    housing: number;
    utilities: number;
    transportation: number;
    food: number;
    healthcare: number;
    entertainment: number;
    savings: number;
    other: number;
  };
  lastCalculated: Date;
}

// Validation interfaces
export interface ValidationRule {
  field: string;
  type: 'required' | 'range' | 'enum' | 'format' | 'custom';
  validator: (value: any, data?: any) => boolean;
  errorMessage: string;
  warningMessage?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  qualityScore: number;
  timestamp: Date;
}

export interface ValidationError {
  field: string;
  message: string;
  value: any;
  severity: 'error' | 'critical';
}

export interface ValidationWarning {
  field: string;
  message: string;
  value: any;
  suggestion?: string;
}

// Monitoring and alerting interfaces
export interface AlertThreshold {
  responseTime: number;
  errorRate: number;
  dataQuality: number;
  uptime: number;
}

export interface SystemHealthStatus {
  overallStatus: 'healthy' | 'warning' | 'critical';
  totalSources: number;
  healthySources: number;
  warningSources: number;
  criticalSources: number;
  averageResponseTime: number;
  totalErrors: number;
  uptime: number;
}

export interface DetailedHealthStatus {
  name: string;
  currentStatus: 'healthy' | 'warning' | 'unhealthy' | 'critical';
  lastChecked: Date;
  responseTime: number;
  uptime: number;
  errorCount: number;
  lastError?: string;
  dataQuality: DataQualityMetrics;
}

export interface ErrorSummary {
  totalErrors: number;
  errorsBySource: Record<string, number>;
  errorsByType: Record<string, number>;
  recentErrors: DataSourceError[];
  criticalErrors: DataSourceError[];
}

// Synchronization interfaces
export interface SyncStatistics {
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  averageSyncTime: number;
  lastSyncTime: Date;
  errors: DataSourceError[];
}

// Cache statistics
export interface CacheStats {
  total: number;
  expired: number;
  valid: number;
  hitRate: number;
  memoryUsage: number;
}

// API response interfaces
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
  source: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  timestamp: Date;
  source: string;
}

// Search and filter interfaces
export interface SearchFilters {
  location?: CanadianLocation;
  dateRange?: {
    start: Date;
    end: Date;
  };
  dataType?: string[];
  quality?: {
    minScore: number;
    maxAge?: number;
  };
  source?: string[];
}

export interface SearchResult<T = any> {
  data: T[];
  totalResults: number;
  filters: SearchFilters;
  timestamp: Date;
  sources: string[];
}

// Configuration and environment interfaces
export interface EnvironmentConfig {
  nodeEnv: string;
  logLevel: string;
  apiKeys: Record<string, string>;
  database: {
    url: string;
    name: string;
  };
  redis: {
    url: string;
    password?: string;
  };
  monitoring: {
    enabled: boolean;
    interval: number;
    alerting: boolean;
  };
}

// Event interfaces for system communication
export interface DataSourceEvent {
  type: 'sync_started' | 'sync_completed' | 'sync_failed' | 'health_check' | 'error';
  source: string;
  timestamp: Date;
  data?: any;
  error?: string;
}

export interface SystemEvent {
  type: 'startup' | 'shutdown' | 'maintenance' | 'alert';
  timestamp: Date;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  data?: any;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Async result types
export type AsyncResult<T, E = Error> = Promise<T | E>;

export type Result<T, E = Error> = T | E;

// Generic data container
export interface DataContainer<T = any> {
  data: T;
  metadata: {
    source: string;
    timestamp: Date;
    version: string;
    quality: DataQualityMetrics;
  };
  validation?: ValidationResult;
}