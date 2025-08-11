// 🇨🇦 Canadian Data Sources - Core Types

// ============================================================================
// BASE INTERFACES
// ============================================================================

export interface DataSource {
  name: string;
  baseUrl: string;
  apiKey?: string;
  healthCheck(): Promise<HealthStatus>;
  getLastUpdate(): Promise<Date>;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number | null;
  lastChecked: Date;
  errors: string[];
  dataQuality: DataQualityMetrics;
}

export interface DataQualityMetrics {
  completeness: number;    // 0-1, percentage of required fields present
  accuracy: number;        // 0-1, percentage of data matching expected values
  freshness: number;       // 0-1, age of data (1 = fresh, 0 = stale)
  consistency: number;     // 0-1, consistency across related data points
  reliability: number;     // 0-1, historical reliability of the data source
}

// ============================================================================
// LOCATION & GEOGRAPHY
// ============================================================================

export interface CanadianLocation {
  postalCode: string;
  province: Province;
  city: string;
  municipality?: string;
  latitude: number;
  longitude: number;
  censusDivision?: string;
  censusSubdivision?: string;
}

export type Province = 
  | 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'NT' | 'NU' | 'ON' | 'PE' | 'QC' | 'SK' | 'YT';

export interface PostalCodeData {
  postalCode: string;
  location: CanadianLocation;
  population: number;
  medianIncome: number;
  unemploymentRate: number;
  lastUpdated: Date;
}

// ============================================================================
// HOUSING DATA
// ============================================================================

export interface HousingData {
  location: CanadianLocation;
  prices: {
    averagePrice: number;
    medianPrice: number;
    pricePerSqFt: number;
    lastUpdated: Date;
    priceChange1Year: number;
    priceChange5Year: number;
  };
  rental: {
    averageRent: number;
    medianRent: number;
    vacancyRate: number;
    lastUpdated: Date;
    rentChange1Year: number;
    rentChange5Year: number;
  };
  market: {
    daysOnMarket: number;
    inventoryLevel: number;
    priceTrend: 'increasing' | 'decreasing' | 'stable';
    lastUpdated: Date;
    salesVolume: number;
    newListings: number;
  };
  source: {
    name: string;
    reliability: number;
    lastVerified: Date;
  };
}

export interface HousingMarketData {
  region: string;
  period: string;
  totalSales: number;
  averagePrice: number;
  medianPrice: number;
  newListings: number;
  activeListings: number;
  daysOnMarket: number;
  priceChange: number;
  lastUpdated: Date;
}

export interface RentalMarketData {
  region: string;
  period: string;
  averageRent: {
    studio: number;
    oneBedroom: number;
    twoBedroom: number;
    threeBedroom: number;
  };
  vacancyRate: number;
  rentChange: number;
  lastUpdated: Date;
}

// ============================================================================
// UTILITY RATES
// ============================================================================

export interface UtilityRates {
  location: CanadianLocation;
  electricity: {
    residentialRate: number; // cents per kWh
    commercialRate: number;
    deliveryCharge: number;
    serviceCharge: number;
    lastUpdated: Date;
    provider: string;
  };
  naturalGas: {
    residentialRate: number; // cents per m³
    commercialRate: number;
    deliveryCharge: number;
    serviceCharge: number;
    lastUpdated: Date;
    provider: string;
  };
  water: {
    residentialRate: number; // per m³
    commercialRate: number;
    connectionFee: number;
    serviceCharge: number;
    lastUpdated: Date;
    provider: string;
  };
  sewer: {
    residentialRate: number; // per m³
    commercialRate: number;
    serviceCharge: number;
    lastUpdated: Date;
    provider: string;
  };
  source: {
    name: string;
    reliability: number;
    lastVerified: Date;
  };
}

export interface ProvincialUtilityRates {
  province: Province;
  electricityProviders: UtilityProvider[];
  naturalGasProviders: UtilityProvider[];
  waterProviders: UtilityProvider[];
  lastUpdated: Date;
}

export interface UtilityProvider {
  name: string;
  type: 'public' | 'private' | 'cooperative';
  rates: UtilityRates;
  serviceArea: string[];
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
}

// ============================================================================
// ECONOMIC INDICATORS
// ============================================================================

export interface EconomicIndicators {
  date: Date;
  interestRates: {
    policyRate: number;
    primeRate: number;
    mortgageRate: {
      fixed5Year: number;
      variable: number;
      fixed3Year: number;
      fixed10Year: number;
    };
    lastUpdated: Date;
  };
  inflation: {
    cpi: number;
    cpiChange: number;
    coreCpi: number;
    lastUpdated: Date;
  };
  exchangeRates: {
    usd: number;
    eur: number;
    gbp: number;
    lastUpdated: Date;
  };
  employment: {
    unemploymentRate: number;
    employmentRate: number;
    participationRate: number;
    lastUpdated: Date;
  };
  source: {
    name: string;
    reliability: number;
    lastVerified: Date;
  };
}

export interface MortgageRates {
  date: Date;
  fixedRates: {
    '1Year': number;
    '2Year': number;
    '3Year': number;
    '4Year': number;
    '5Year': number;
    '7Year': number;
    '10Year': number;
  };
  variableRates: {
    primeMinus: number;
    primePlus: number;
  };
  lastUpdated: Date;
  source: string;
}

// ============================================================================
// GOVERNMENT BENEFITS
// ============================================================================

export interface GovernmentBenefit {
  id: string;
  name: string;
  description: string;
  type: 'federal' | 'provincial' | 'municipal';
  category: 'housing' | 'income' | 'family' | 'education' | 'health' | 'other';
  eligibility: {
    incomeLimit?: number;
    ageRange?: [number, number];
    residency: boolean;
    citizenship: boolean;
    familyStatus?: 'single' | 'married' | 'withChildren' | 'any';
    employmentStatus?: 'employed' | 'unemployed' | 'student' | 'retired' | 'any';
  };
  amount: {
    type: 'fixed' | 'percentage' | 'sliding';
    value: number;
    maxAmount?: number;
    minAmount?: number;
  };
  application: {
    method: 'online' | 'mail' | 'phone' | 'inPerson';
    requiredDocuments: string[];
    processingTime: string;
    renewalRequired: boolean;
    renewalFrequency?: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
    officeHours?: string;
  };
  lastUpdated: Date;
  source: string;
}

export interface BenefitEligibilityResult {
  benefit: GovernmentBenefit;
  isEligible: boolean;
  estimatedAmount: number;
  confidence: number; // 0-1
  requirements: string[];
  nextSteps: string[];
}

// ============================================================================
// TAX INFORMATION
// ============================================================================

export interface TaxRates {
  location: CanadianLocation;
  federal: {
    gst: number;
    hst?: number;
  };
  provincial: {
    pst?: number;
    hst?: number;
    qst?: number;
    rst?: number;
  };
  municipal: {
    propertyTax: number; // percentage
    businessTax?: number;
    developmentCharges?: number;
  };
  lastUpdated: Date;
  source: string;
}

export interface IncomeTaxBrackets {
  province: Province;
  year: number;
  brackets: {
    minIncome: number;
    maxIncome?: number;
    rate: number;
    baseTax: number;
  }[];
  lastUpdated: Date;
  source: string;
}

// ============================================================================
// COST OF LIVING
// ============================================================================

export interface CostOfLivingData {
  location: CanadianLocation;
  housing: {
    mortgage: number; // monthly payment for median home
    rent: number;     // monthly rent for 2-bedroom
    utilities: number; // monthly utilities
    propertyTax: number; // monthly property tax
  };
  transportation: {
    publicTransit: number; // monthly pass
    gas: number;          // monthly gas
    insurance: number;    // monthly car insurance
    maintenance: number;  // monthly maintenance
  };
  food: {
    groceries: number;    // monthly groceries
    diningOut: number;    // monthly dining out
  };
  healthcare: {
    insurance: number;    // monthly health insurance
    prescriptions: number; // monthly prescriptions
    dental: number;       // monthly dental
  };
  other: {
    entertainment: number; // monthly entertainment
    clothing: number;     // monthly clothing
    personalCare: number; // monthly personal care
  };
  total: number; // total monthly cost
  lastUpdated: Date;
  source: string;
}

export interface SalaryRequirement {
  location: CanadianLocation;
  lifestyle: 'basic' | 'comfortable' | 'luxury';
  familySize: number;
  annualSalary: number;
  monthlyTakeHome: number;
  affordabilityScore: number; // 0-1
  breakdown: {
    housing: number;
    transportation: number;
    food: number;
    healthcare: number;
    other: number;
    savings: number;
  };
  lastUpdated: Date;
  source: string;
}

// ============================================================================
// DATA SOURCE CONFIGURATION
// ============================================================================

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
  priority: 'high' | 'medium' | 'low' | 'critical';
  retryOnFailure: boolean;
  dataQualityThreshold?: number;
}

export enum UpdateFrequency {
  REAL_TIME = 'real-time',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually'
}

export interface DataSourceSchedule {
  source: string;
  frequency: UpdateFrequency;
  lastUpdate: Date;
  nextUpdate: Date;
  priority: 'high' | 'medium' | 'low' | 'critical';
  retryOnFailure: boolean;
  lastSyncAttempt: Date;
  consecutiveFailures: number;
  totalSyncs: number;
  successfulSyncs: number;
  averageSyncTime: number;
}

// ============================================================================
// CACHING & STORAGE
// ============================================================================

export interface CachedData<T = any> {
  data: T;
  timestamp: Date;
  expiresAt: Date;
  source: string;
  endpoint: string;
  params?: Record<string, any>;
}

export interface DataStorage {
  store<T>(key: string, data: T, ttl?: number): Promise<void>;
  retrieve<T>(key: string): Promise<T | null>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export interface DataSourceError {
  source: string;
  endpoint: string;
  message: string;
  statusCode?: number;
  timestamp: Date;
  retryable: boolean;
  params?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  value: any;
  expectedType?: string;
  expectedRange?: [number, number];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ============================================================================
// PERFORMANCE & MONITORING
// ============================================================================

export interface PerformanceMetrics {
  timestamp: Date;
  duration: number;
  success: boolean;
  source: string;
  endpoint: string;
  responseSize?: number;
  cacheHit?: boolean;
}

export interface DataSourceMetrics {
  source: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  cacheHitRate: number;
  lastRequest: Date;
  dataQuality: DataQualityMetrics;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
  source: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  success: boolean;
  timestamp: Date;
  source: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Currency = 'CAD' | 'USD' | 'EUR' | 'GBP';
export type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface GeoBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface RateLimitInfo {
  remaining: number;
  reset: Date;
  limit: number;
}

