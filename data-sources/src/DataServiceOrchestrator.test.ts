import { DataServiceOrchestrator } from './DataServiceOrchestrator';
import { DataSourceManager } from './core/DataSourceManager';
import { DataValidationService } from './services/DataValidationService';
import { StatsCanDataSource } from './sources/StatsCanDataSource';
import { CMHCDataSource } from './sources/CMHCDataSource';
import { BankOfCanadaDataSource } from './sources/BankOfCanadaDataSource';
import { 
  CanadianLocation, 
  HousingData, 
  EconomicIndicators,
  UtilityRates,
  GovernmentBenefit,
  TaxRates
} from './types';

// Mock the environment variables
(process.env as any).STATSCAN_API_KEY = 'test-stats-can-key';
(process.env as any).CMHC_API_KEY = 'test-cmhc-key';
(process.env as any).BANK_OF_CANADA_API_KEY = 'test-boc-key';

// Mock the data source classes
jest.mock('./sources/StatsCanDataSource');
jest.mock('./sources/CMHCDataSource');
jest.mock('./sources/BankOfCanadaDataSource');

describe('DataServiceOrchestrator', () => {
  let orchestrator: DataServiceOrchestrator;
  let mockStatsCan: jest.Mocked<StatsCanDataSource>;
  let mockCMHC: jest.Mocked<CMHCDataSource>;
  let mockBankOfCanada: jest.Mocked<BankOfCanadaDataSource>;

  const mockLocation: CanadianLocation = {
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M5V 3A8',
    latitude: 43.6532,
    longitude: -79.3832
  };

  const mockHousingData: HousingData = {
    source: { 
      name: 'Statistics Canada', 
      reliability: 0.95,
      lastVerified: new Date()
    },
    location: mockLocation,
    prices: {
      averagePrice: 1200000,
      medianPrice: 1100000,
      pricePerSqFt: 1200,
      lastUpdated: new Date(),
      priceChange1Year: 0.05,
      priceChange5Year: 0.25
    },
    rental: {
      averageRent: 2500,
      medianRent: 2300,
      vacancyRate: 0.02,
      lastUpdated: new Date(),
      rentChange1Year: 0.03,
      rentChange5Year: 0.15
    },
    market: {
      daysOnMarket: 15,
      inventoryLevel: 150,
      priceTrend: 'increasing',
      lastUpdated: new Date(),
      salesVolume: 1200,
      newListings: 800
    }
  };

  const mockEconomicData: EconomicIndicators = {
    source: { 
      name: 'Bank of Canada', 
      reliability: 0.98,
      lastVerified: new Date()
    },
    date: new Date(),
    interestRates: {
      policyRate: 5.0,
      primeRate: 7.2,
      mortgageRate: {
        fixed5Year: 6.8,
        variable: 6.2,
        fixed3Year: 6.5,
        fixed10Year: 7.2
      },
      lastUpdated: new Date()
    },
    inflation: {
      cpi: 3.2,
      cpiChange: 0.4,
      coreCpi: 2.8,
      lastUpdated: new Date()
    },
    exchangeRates: {
      usd: 0.74,
      eur: 0.68,
      gbp: 0.58,
      lastUpdated: new Date()
    },
    employment: {
      unemploymentRate: 5.5,
      employmentRate: 61.8,
      participationRate: 65.4,
      lastUpdated: new Date()
    }
  };

  const mockUtilityData: UtilityRates = {
    source: { 
      name: 'Ontario Energy Board', 
      reliability: 0.90,
      lastVerified: new Date()
    },
    location: mockLocation,
    electricity: {
      residentialRate: 12.0,
      commercialRate: 15.0,
      deliveryCharge: 5.0,
      serviceCharge: 25.0,
      lastUpdated: new Date(),
      provider: 'Toronto Hydro'
    },
    naturalGas: {
      residentialRate: 25.0,
      commercialRate: 30.0,
      deliveryCharge: 15.0,
      serviceCharge: 20.0,
      lastUpdated: new Date(),
      provider: 'Enbridge Gas'
    },
    water: {
      residentialRate: 2.50,
      commercialRate: 3.00,
      connectionFee: 100.0,
      serviceCharge: 15.0,
      lastUpdated: new Date(),
      provider: 'City of Toronto'
    },
    sewer: {
      residentialRate: 2.00,
      commercialRate: 2.50,
      serviceCharge: 10.0,
      lastUpdated: new Date(),
      provider: 'City of Toronto'
    }
  };

  const mockTaxData: TaxRates = {
    location: mockLocation,
    federal: {
      gst: 5.0,
      hst: 13.0
    },
    provincial: {
      pst: 8.0
    },
    municipal: {
      propertyTax: 1.1
    },
    lastUpdated: new Date(),
    source: 'Canada Revenue Agency'
  };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock instances
    mockStatsCan = new StatsCanDataSource('test-key') as jest.Mocked<StatsCanDataSource>;
    mockCMHC = new CMHCDataSource('test-key') as jest.Mocked<CMHCDataSource>;
    mockBankOfCanada = new BankOfCanadaDataSource('test-key') as jest.Mocked<BankOfCanadaDataSource>;

    // Mock the constructor calls
    (StatsCanDataSource as jest.MockedClass<typeof StatsCanDataSource>).mockImplementation(() => mockStatsCan);
    (CMHCDataSource as jest.MockedClass<typeof CMHCDataSource>).mockImplementation(() => mockCMHC);
    (BankOfCanadaDataSource as jest.MockedClass<typeof BankOfCanadaDataSource>).mockImplementation(() => mockBankOfCanada);

    // Mock health check methods
    mockStatsCan.healthCheck.mockResolvedValue({
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
      }
    });

    mockCMHC.healthCheck.mockResolvedValue({
      status: 'healthy',
      responseTime: 200,
      lastChecked: new Date(),
      errors: [],
      dataQuality: {
        completeness: 0.90,
        accuracy: 0.95,
        freshness: 0.85,
        consistency: 0.88,
        reliability: 0.90
      }
    });

    mockBankOfCanada.healthCheck.mockResolvedValue({
      status: 'healthy',
      responseTime: 100,
      lastChecked: new Date(),
      errors: [],
      dataQuality: {
        completeness: 0.98,
        accuracy: 0.99,
        freshness: 0.95,
        consistency: 0.97,
        reliability: 0.98
      }
    });

    // Create orchestrator instance
    orchestrator = new DataServiceOrchestrator();
  });

  describe('Initialization', () => {
    it('should initialize successfully with all data sources', async () => {
      // Mock the data source manager methods
      const mockDataSourceManager = orchestrator['dataSourceManager'] as jest.Mocked<DataSourceManager>;
      mockDataSourceManager.registerDataSource = jest.fn();

      await orchestrator.initialize();

      expect(mockDataSourceManager.registerDataSource).toHaveBeenCalledTimes(3);
      expect(mockDataSourceManager.registerDataSource).toHaveBeenCalledWith('stats-can', mockStatsCan, expect.any(Object));
      expect(mockDataSourceManager.registerDataSource).toHaveBeenCalledWith('cmhc', mockCMHC, expect.any(Object));
      expect(mockDataSourceManager.registerDataSource).toHaveBeenCalledWith('bank-of-canada', mockBankOfCanada, expect.any(Object));
    });

    it('should not initialize twice', async () => {
      await orchestrator.initialize();
      await orchestrator.initialize(); // Second call should be ignored

      expect(orchestrator['isInitialized']).toBe(true);
    });

    it('should handle initialization errors gracefully', async () => {
      // Mock a failure in data source initialization
      const mockDataSourceManager = orchestrator['dataSourceManager'] as jest.Mocked<DataSourceManager>;
      mockDataSourceManager.registerDataSource.mockImplementation(() => {
        throw new Error('Registration failed');
      });

      await expect(orchestrator.initialize()).rejects.toThrow('Registration failed');
    });
  });

  describe('Data Retrieval', () => {
    beforeEach(async () => {
      await orchestrator.initialize();
    });

    it('should retrieve housing data successfully', async () => {
      const mockDataSourceManager = orchestrator['dataSourceManager'] as jest.Mocked<DataSourceManager>;
      mockDataSourceManager.fetchData.mockResolvedValue(mockHousingData);

      const result = await orchestrator.getHousingData(mockLocation);

      expect(result).toEqual(mockHousingData);
      expect(mockDataSourceManager.fetchData).toHaveBeenCalledWith('stats-can', 'housing', { postalCode: mockLocation.postalCode });
    });

    it('should fallback to CMHC when StatsCan fails', async () => {
      const mockDataSourceManager = orchestrator['dataSourceManager'] as jest.Mocked<DataSourceManager>;
      
      // First call fails, second succeeds
      mockDataSourceManager.fetchData
        .mockRejectedValueOnce(new Error('StatsCan unavailable'))
        .mockResolvedValueOnce(mockHousingData);

      const result = await orchestrator.getHousingData(mockLocation);

      expect(result).toEqual(mockHousingData);
      expect(mockDataSourceManager.fetchData).toHaveBeenCalledTimes(2);
      expect(mockDataSourceManager.fetchData).toHaveBeenNthCalledWith(1, 'stats-can', 'housing', { postalCode: mockLocation.postalCode });
      expect(mockDataSourceManager.fetchData).toHaveBeenNthCalledWith(2, 'cmhc', 'housing', { postalCode: mockLocation.postalCode });
    });

    it('should retrieve economic indicators successfully', async () => {
      const mockDataSourceManager = orchestrator['dataSourceManager'] as jest.Mocked<DataSourceManager>;
      mockDataSourceManager.fetchData.mockResolvedValue(mockEconomicData);

      const result = await orchestrator.getEconomicIndicators();

      expect(result).toEqual(mockEconomicData);
      expect(mockDataSourceManager.fetchData).toHaveBeenCalledWith('bank-of-canada', 'economic', {});
    });

    it('should retrieve utility rates successfully', async () => {
      const mockDataSourceManager = orchestrator['dataSourceManager'] as jest.Mocked<DataSourceManager>;
      mockDataSourceManager.fetchData.mockResolvedValue(mockUtilityData);

      const result = await orchestrator.getUtilityRates(mockLocation);

      expect(result).toEqual(mockUtilityData);
      expect(mockDataSourceManager.fetchData).toHaveBeenCalledWith('ontario-energy-board', 'utilities', { 
        province: mockLocation.province, 
        city: mockLocation.city 
      });
    });

    it('should retrieve government benefits successfully', async () => {
      const mockBenefits: GovernmentBenefit[] = [
        {
          id: 'ccb-001',
          name: 'Canada Child Benefit',
          description: 'Monthly tax-free payment to help families with the cost of raising children',
          type: 'federal',
          category: 'family',
          eligibility: { 
            ageRange: [0, 17], 
            incomeLimit: 120000, 
            residency: true, 
            citizenship: true,
            familyStatus: 'withChildren'
          },
          amount: {
            type: 'fixed',
            value: 600,
            maxAmount: 600
          },
          application: {
            method: 'online',
            requiredDocuments: ['birth certificate', 'SIN'],
            processingTime: '8 weeks',
            renewalRequired: true,
            renewalFrequency: 'annually'
          },
          contact: {
            phone: '1-800-387-1193',
            email: 'ccb@cra-arc.gc.ca',
            website: 'https://www.canada.ca/en/revenue-agency/services/child-family-benefits.html'
          },
          lastUpdated: new Date(),
          source: 'ESDC'
        }
      ];

      const mockDataSourceManager = orchestrator['dataSourceManager'] as jest.Mocked<DataSourceManager>;
      mockDataSourceManager.fetchData.mockResolvedValue(mockBenefits);

      const result = await orchestrator.getGovernmentBenefits('ON');

      expect(result).toEqual(mockBenefits);
              expect(mockDataSourceManager.fetchData).toHaveBeenCalledWith('esdc', 'benefits', { province: 'ON' });
    });

    it('should retrieve tax information successfully', async () => {
      const mockDataSourceManager = orchestrator['dataSourceManager'] as jest.Mocked<DataSourceManager>;
      mockDataSourceManager.fetchData.mockResolvedValue(mockTaxData);

      const result = await orchestrator.getTaxInformation(mockLocation);

      expect(result).toEqual(mockTaxData);
      expect(mockDataSourceManager.fetchData).toHaveBeenCalledWith('cra', 'tax', { 
        province: mockLocation.province, 
        year: new Date().getFullYear() 
      });
    });
  });

  describe('Cost of Living Calculations', () => {
    beforeEach(async () => {
      await orchestrator.initialize();
      
      // Mock all data source calls
      const mockDataSourceManager = orchestrator['dataSourceManager'] as jest.Mocked<DataSourceManager>;
      mockDataSourceManager.fetchData
        .mockResolvedValueOnce(mockHousingData)    // housing
        .mockResolvedValueOnce(mockEconomicData)   // economic
        .mockResolvedValueOnce(mockUtilityData)    // utilities
        .mockResolvedValueOnce(mockTaxData);       // taxes
    });

    it('should calculate cost of living successfully', async () => {
      const result = await orchestrator.calculateCostOfLiving(mockLocation, 2);

      expect(result).toBeDefined();
      expect(result.location).toEqual(mockLocation);
      expect(result.housing).toBeDefined();
      expect(result.transportation).toBeDefined();
      expect(result.food).toBeDefined();
      expect(result.healthcare).toBeDefined();
      expect(result.other).toBeDefined();
      expect(result.total).toBeGreaterThan(0);
    });

    it('should calculate salary requirements for different lifestyles', async () => {
      const basicSalary = await orchestrator.calculateRequiredSalary(mockLocation, 'basic', 1);
      const comfortableSalary = await orchestrator.calculateRequiredSalary(mockLocation, 'comfortable', 1);
      const luxurySalary = await orchestrator.calculateRequiredSalary(mockLocation, 'luxury', 1);

      expect(basicSalary.lifestyle).toBe('basic');
      expect(comfortableSalary.lifestyle).toBe('comfortable');
      expect(luxurySalary.lifestyle).toBe('luxury');

      // Luxury should require more than comfortable, which should require more than basic
      expect(luxurySalary.annualSalary).toBeGreaterThan(comfortableSalary.annualSalary);
      expect(comfortableSalary.annualSalary).toBeGreaterThan(basicSalary.annualSalary);
    });

    it('should adjust costs for different household sizes', async () => {
      const singleHousehold = await orchestrator.calculateCostOfLiving(mockLocation, 1);
      const familyHousehold = await orchestrator.calculateCostOfLiving(mockLocation, 4);

      expect(familyHousehold.total).toBeGreaterThan(singleHousehold.total);
    });
  });

  describe('System Monitoring', () => {
    beforeEach(async () => {
      await orchestrator.initialize();
    });

    it('should provide system health status', () => {
      const healthStatus = orchestrator.getSystemHealth();
      
      expect(healthStatus).toBeDefined();
      expect(healthStatus.totalSources).toBeGreaterThan(0);
      expect(healthStatus.overallStatus).toBeDefined();
    });

    it('should provide detailed health status for all sources', () => {
      const detailedHealth = orchestrator.getAllSourcesHealth();
      
      expect(detailedHealth).toBeDefined();
      expect(Object.keys(detailedHealth).length).toBeGreaterThan(0);
      
                        // Check that each source has health information
                  Object.values(detailedHealth).forEach((sourceHealth: any) => {
                    expect(sourceHealth.name).toBeDefined();
                    expect(sourceHealth.currentStatus).toBeDefined();
                    expect(sourceHealth.lastChecked).toBeDefined();
                  });
    });

    it('should provide synchronization status', () => {
      const syncStatus = orchestrator.getSyncStatus();
      
      expect(syncStatus).toBeDefined();
      expect(Object.keys(syncStatus).length).toBeGreaterThan(0);
    });

    it('should provide data quality metrics', () => {
      const dataQuality = orchestrator.getDataQuality();
      
      expect(dataQuality).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    beforeEach(async () => {
      await orchestrator.initialize();
    });

    it('should throw error when trying to use uninitialized orchestrator', () => {
      const uninitializedOrchestrator = new DataServiceOrchestrator();
      
      expect(() => uninitializedOrchestrator.getSystemHealth()).toThrow('Data service orchestrator is not initialized');
    });

    it('should handle data source failures gracefully', async () => {
      const mockDataSourceManager = orchestrator['dataSourceManager'] as jest.Mocked<DataSourceManager>;
      mockDataSourceManager.fetchData.mockRejectedValue(new Error('All sources failed'));

      await expect(orchestrator.getHousingData(mockLocation)).rejects.toThrow('Unable to retrieve housing data');
    });

    it('should handle validation failures gracefully', async () => {
      const mockDataSourceManager = orchestrator['dataSourceManager'] as jest.Mocked<DataSourceManager>;
      mockDataSourceManager.fetchData.mockResolvedValue(mockHousingData);

      // Mock validation service to return warnings
      const mockValidationService = orchestrator['validationService'] as jest.Mocked<DataValidationService>;
            mockValidationService.validateHousingData.mockReturnValue({
        isValid: true,
        errors: [],
        warnings: [],
        qualityScore: 0.95,
        timestamp: new Date()
      });

      const result = await orchestrator.getHousingData(mockLocation);
      expect(result).toEqual(mockHousingData);
    });
  });

  describe('Shutdown', () => {
    beforeEach(async () => {
      await orchestrator.initialize();
    });

    it('should shutdown gracefully', async () => {
      await orchestrator.shutdown();
      
      expect(orchestrator['isInitialized']).toBe(false);
    });

    it('should not shutdown if not initialized', async () => {
      const uninitializedOrchestrator = new DataServiceOrchestrator();
      
      await expect(uninitializedOrchestrator.shutdown()).resolves.not.toThrow();
    });
  });

  describe('Data Validation Integration', () => {
    beforeEach(async () => {
      await orchestrator.initialize();
    });

    it('should validate housing data before returning', async () => {
      const mockDataSourceManager = orchestrator['dataSourceManager'] as jest.Mocked<DataSourceManager>;
      mockDataSourceManager.fetchData.mockResolvedValue(mockHousingData);

      const mockValidationService = orchestrator['validationService'] as jest.Mocked<DataValidationService>;
      mockValidationService.validateHousingData.mockReturnValue({
        isValid: true,
        errors: [],
        warnings: [],
        qualityScore: 0.95,
        timestamp: new Date()
      });

      await orchestrator.getHousingData(mockLocation);

      expect(mockValidationService.validateHousingData).toHaveBeenCalledWith(mockHousingData);
    });

    it('should log warnings for validation issues', async () => {
      const mockDataSourceManager = orchestrator['dataSourceManager'] as jest.Mocked<DataSourceManager>;
      mockDataSourceManager.fetchData.mockResolvedValue(mockHousingData);

      const mockValidationService = orchestrator['validationService'] as jest.Mocked<DataValidationService>;
            mockValidationService.validateHousingData.mockReturnValue({
        isValid: false,
        errors: [{ field: 'postalCode', message: 'Invalid postal code format', severity: 'error', rule: 'format' }],
        warnings: [],
        qualityScore: 0.75,
        timestamp: new Date()
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await expect(orchestrator.getHousingData(mockLocation)).rejects.toThrow();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Performance and Scalability', () => {
    beforeEach(async () => {
      await orchestrator.initialize();
    });

    it('should handle concurrent requests efficiently', async () => {
      const mockDataSourceManager = orchestrator['dataSourceManager'] as jest.Mocked<DataSourceManager>;
      mockDataSourceManager.fetchData.mockResolvedValue(mockHousingData);

      const startTime = Date.now();
      
      const promises = Array(10).fill(null).map(() => 
        orchestrator.getHousingData(mockLocation)
      );
      
      const results = await Promise.all(promises);
      const endTime = Date.now();

      expect(results).toHaveLength(10);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should cache frequently requested data', async () => {
      const mockDataSourceManager = orchestrator['dataSourceManager'] as jest.Mocked<DataSourceManager>;
      mockDataSourceManager.fetchData.mockResolvedValue(mockHousingData);

      // First request
      await orchestrator.getHousingData(mockLocation);
      
      // Second request (should use cache)
      await orchestrator.getHousingData(mockLocation);

      // Should only call fetchData once due to caching
      expect(mockDataSourceManager.fetchData).toHaveBeenCalledTimes(1);
    });
  });
});