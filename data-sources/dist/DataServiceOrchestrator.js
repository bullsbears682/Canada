"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataServiceOrchestrator = void 0;
const DataSourceManager_1 = require("./core/DataSourceManager");
const DataValidationService_1 = require("./services/DataValidationService");
const DataSynchronizationService_1 = require("./services/DataSynchronizationService");
const DataMonitoringService_1 = require("./services/DataMonitoringService");
const cacheManager_1 = require("./utils/cacheManager");
const StatsCanDataSource_1 = require("./sources/StatsCanDataSource");
const CMHCDataSource_1 = require("./sources/CMHCDataSource");
const BankOfCanadaDataSource_1 = require("./sources/BankOfCanadaDataSource");
const dataSourceConfig_1 = require("./config/dataSourceConfig");
/**
 * 🇨🇦 Data Service Orchestrator
 *
 * Main orchestrator that coordinates all data services for the Canadian
 * Cost of Living Analyzer. Provides a unified interface for data access,
 * validation, synchronization, and monitoring.
 */
class DataServiceOrchestrator {
    constructor() {
        this.isInitialized = false;
        this.dataSourceManager = new DataSourceManager_1.DataSourceManager();
        this.validationService = new DataValidationService_1.DataValidationService();
        this.syncService = new DataSynchronizationService_1.DataSynchronizationService(this.dataSourceManager);
        this.monitoringService = new DataMonitoringService_1.DataMonitoringService(this.dataSourceManager, this.syncService);
        this.cacheManager = new cacheManager_1.CacheManager();
    }
    /**
     * Initialize the data service orchestrator
     */
    async initialize() {
        if (this.isInitialized) {
            console.log('🔄 Data service orchestrator is already initialized');
            return;
        }
        console.log('🚀 Initializing data service orchestrator...');
        try {
            // Initialize data sources
            await this.initializeDataSources();
            // Start services
            await this.startServices();
            this.isInitialized = true;
            console.log('✅ Data service orchestrator initialized successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize data service orchestrator:', error);
            throw error;
        }
    }
    /**
     * Initialize all data sources
     */
    async initializeDataSources() {
        console.log('🔧 Initializing data sources...');
        // Initialize Statistics Canada
        const statsCanConfig = (0, dataSourceConfig_1.getDataSourceConfig)('stats-can');
        if (statsCanConfig && statsCanConfig.apiKey) {
            const statsCan = new StatsCanDataSource_1.StatsCanDataSource(statsCanConfig.apiKey);
            this.dataSourceManager.registerDataSource('stats-can', statsCan, statsCanConfig);
            console.log('✅ Statistics Canada data source initialized');
        }
        else {
            console.warn('⚠️  Statistics Canada API key not configured');
        }
        // Initialize CMHC
        const cmhcConfig = (0, dataSourceConfig_1.getDataSourceConfig)('cmhc');
        if (cmhcConfig && cmhcConfig.apiKey) {
            const cmhc = new CMHCDataSource_1.CMHCDataSource(cmhcConfig.apiKey);
            this.dataSourceManager.registerDataSource('cmhc', cmhc, cmhcConfig);
            console.log('✅ CMHC data source initialized');
        }
        else {
            console.warn('⚠️  CMHC API key not configured');
        }
        // Initialize Bank of Canada
        const bankOfCanadaConfig = (0, dataSourceConfig_1.getDataSourceConfig)('bank-of-canada');
        if (bankOfCanadaConfig && bankOfCanadaConfig.apiKey) {
            const bankOfCanada = new BankOfCanadaDataSource_1.BankOfCanadaDataSource(bankOfCanadaConfig.apiKey);
            this.dataSourceManager.registerDataSource('bank-of-canada', bankOfCanada, bankOfCanadaConfig);
            console.log('✅ Bank of Canada data source initialized');
        }
        else {
            console.warn('⚠️  Bank of Canada API key not configured');
        }
        console.log(`✅ Initialized data sources`);
    }
    /**
     * Start all data services
     */
    async startServices() {
        console.log('🚀 Starting data services...');
        // Start synchronization service
        await this.syncService.start();
        console.log('✅ Data synchronization service started');
        // Start monitoring service
        await this.monitoringService.start();
        console.log('✅ Data monitoring service started');
        console.log('✅ All data services started successfully');
    }
    /**
     * Stop all data services
     */
    async shutdown() {
        if (!this.isInitialized) {
            console.log('🔄 Data service orchestrator is not running');
            return;
        }
        console.log('🛑 Shutting down data service orchestrator...');
        try {
            // Stop monitoring service
            await this.monitoringService.stop();
            console.log('✅ Data monitoring service stopped');
            // Stop synchronization service
            await this.syncService.stop();
            console.log('✅ Data synchronization service stopped');
            this.isInitialized = false;
            console.log('✅ Data service orchestrator shut down successfully');
        }
        catch (error) {
            console.error('❌ Error during shutdown:', error);
            throw error;
        }
    }
    /**
     * Get housing data for a specific location
     */
    async getHousingData(location) {
        this.ensureInitialized();
        try {
            // Try to get data from primary source (StatsCan)
            const housingData = await this.dataSourceManager.fetchData('stats-can', 'housing', { postalCode: location.postalCode });
            // Validate the data
            const validationResult = this.validationService.validateHousingData(housingData);
            if (!validationResult.isValid) {
                console.warn(`⚠️  Housing data validation warnings for ${location.postalCode}:`, validationResult.warnings);
            }
            return housingData;
        }
        catch (error) {
            console.error(`❌ Failed to fetch housing data for ${location.postalCode}:`, error);
            // Fallback to CMHC if StatsCan fails
            try {
                const fallbackData = await this.dataSourceManager.fetchData('cmhc', 'housing', { postalCode: location.postalCode });
                console.log(`✅ Retrieved fallback housing data from CMHC for ${location.postalCode}`);
                return fallbackData;
            }
            catch (fallbackError) {
                console.error(`❌ Fallback housing data also failed for ${location.postalCode}:`, fallbackError);
                throw new Error(`Unable to retrieve housing data for ${location.postalCode}`);
            }
        }
    }
    /**
     * Get economic indicators
     */
    async getEconomicIndicators() {
        this.ensureInitialized();
        try {
            // Get data from Bank of Canada (primary source for economic data)
            const economicData = await this.dataSourceManager.fetchData('bank-of-canada', 'economic', {});
            // Validate the data
            const validationResult = this.validationService.validateEconomicIndicators(economicData);
            if (!validationResult.isValid) {
                console.warn('⚠️  Economic data validation warnings:', validationResult.warnings);
            }
            return economicData;
        }
        catch (error) {
            console.error('❌ Failed to fetch economic indicators:', error);
            throw new Error('Unable to retrieve economic indicators');
        }
    }
    /**
     * Get utility rates for a specific location
     */
    async getUtilityRates(location) {
        this.ensureInitialized();
        try {
            // Try to get utility rates from provincial sources
            const utilityData = await this.dataSourceManager.fetchData('ontario-energy-board', // This would be configured based on province
            'utilities', { province: location.province, city: location.city });
            // Validate the data
            const validationResult = this.validationService.validateUtilityRates(utilityData);
            if (!validationResult.isValid) {
                console.warn(`⚠️  Utility rates validation warnings for ${location.city}:`, validationResult.warnings);
            }
            return utilityData;
        }
        catch (error) {
            console.error(`❌ Failed to fetch utility rates for ${location.city}:`, error);
            throw new Error(`Unable to retrieve utility rates for ${location.city}`);
        }
    }
    /**
     * Get government benefits information
     */
    async getGovernmentBenefits(province) {
        this.ensureInitialized();
        try {
            // Get benefits data from ESDC
            const benefitsData = await this.dataSourceManager.fetchData('esdc', 'benefits', { province });
            // Validate each benefit
            const validatedBenefits = [];
            for (const benefit of benefitsData) {
                const validationResult = this.validationService.validateGovernmentBenefits([benefit]);
                if (validationResult.isValid) {
                    validatedBenefits.push(benefit);
                }
                else {
                    console.warn(`⚠️  Benefit validation failed:`, validationResult.errors);
                }
            }
            return validatedBenefits;
        }
        catch (error) {
            console.error(`❌ Failed to fetch government benefits for ${province}:`, error);
            throw new Error(`Unable to retrieve government benefits for ${province}`);
        }
    }
    /**
     * Get tax information for a specific location
     */
    async getTaxInformation(location) {
        this.ensureInitialized();
        try {
            // Get tax data from CRA
            const taxData = await this.dataSourceManager.fetchData('cra', 'tax', { province: location.province, year: new Date().getFullYear() });
            // Validate the data
            const validationResult = this.validationService.validateTaxInformation(taxData);
            if (!validationResult.isValid) {
                console.warn(`⚠️  Tax information validation warnings for ${location.province}:`, validationResult.warnings);
            }
            return taxData;
        }
        catch (error) {
            console.error(`❌ Failed to fetch tax information for ${location.province}:`, error);
            throw new Error(`Unable to retrieve tax information for ${location.province}`);
        }
    }
    /**
     * Calculate cost of living for a specific location
     */
    async calculateCostOfLiving(location, householdSize = 1) {
        this.ensureInitialized();
        try {
            console.log(`🧮 Calculating cost of living for ${location.city}, ${location.province}...`);
            // Fetch all required data
            const [housingData, economicData, utilityData, taxData] = await Promise.all([
                this.getHousingData(location),
                this.getEconomicIndicators(),
                this.getUtilityRates(location),
                this.getTaxInformation(location)
            ]);
            // Calculate cost of living breakdown
            const costOfLiving = this.calculateCostBreakdown(location, housingData, economicData, utilityData, taxData, householdSize);
            console.log(`✅ Cost of living calculation completed for ${location.city}`);
            return costOfLiving;
        }
        catch (error) {
            console.error(`❌ Failed to calculate cost of living for ${location.city}:`, error);
            throw new Error(`Unable to calculate cost of living for ${location.city}`);
        }
    }
    /**
     * Calculate required salary for a specific location and lifestyle
     */
    async calculateRequiredSalary(location, lifestyle = 'comfortable', householdSize = 1) {
        this.ensureInitialized();
        try {
            // Get cost of living data
            const costOfLiving = await this.calculateCostOfLiving(location, householdSize);
            // Calculate salary requirements based on lifestyle
            const salaryRequirements = this.calculateSalaryRequirements(costOfLiving, lifestyle, householdSize);
            return salaryRequirements;
        }
        catch (error) {
            console.error(`❌ Failed to calculate required salary for ${location.city}:`, error);
            throw new Error(`Unable to calculate required salary for ${location.city}`);
        }
    }
    /**
     * Get system health status
     */
    getSystemHealth() {
        this.ensureInitialized();
        return this.monitoringService.getSystemHealthStatus();
    }
    /**
     * Get detailed health status for all data sources
     */
    getAllSourcesHealth() {
        this.ensureInitialized();
        return this.monitoringService.getAllSourcesHealthStatus();
    }
    /**
     * Get synchronization status
     */
    getSyncStatus() {
        this.ensureInitialized();
        return this.syncService.getSyncStatus();
    }
    /**
     * Force synchronization of all data sources
     */
    async forceSyncAll() {
        this.ensureInitialized();
        await this.syncService.forceSyncAll();
    }
    /**
     * Get data quality metrics
     */
    getDataQuality() {
        this.ensureInitialized();
        return this.validationService.getOverallDataQuality();
    }
    /**
     * Ensure the orchestrator is initialized
     */
    ensureInitialized() {
        if (!this.isInitialized) {
            throw new Error('Data service orchestrator is not initialized. Call initialize() first.');
        }
    }
    /**
     * Calculate cost breakdown from various data sources
     */
    calculateCostBreakdown(location, housingData, economicData, utilityData, taxData, householdSize) {
        // Calculate monthly housing costs
        const monthlyHousingCost = this.calculateMonthlyHousingCost(housingData, economicData);
        // Calculate monthly utility costs
        const monthlyUtilityCost = this.calculateMonthlyUtilityCost(utilityData, householdSize);
        // Calculate monthly tax burden
        const monthlyTaxBurden = this.calculateMonthlyTaxBurden(taxData);
        // Calculate other living costs (food, transportation, etc.)
        const otherLivingCosts = this.calculateOtherLivingCosts(householdSize);
        const totalMonthlyCost = monthlyHousingCost + monthlyUtilityCost + monthlyTaxBurden + otherLivingCosts;
        return {
            location,
            housing: {
                mortgage: monthlyHousingCost * 0.7, // Assume 70% is mortgage/rent
                rent: housingData.rental.averageRent || 0,
                utilities: monthlyUtilityCost,
                propertyTax: monthlyTaxBurden
            },
            transportation: {
                publicTransit: 120 * householdSize,
                gas: 80 * householdSize,
                insurance: 150 * householdSize,
                maintenance: 50 * householdSize
            },
            food: {
                groceries: 300 * householdSize,
                diningOut: 100 * householdSize
            },
            healthcare: {
                insurance: 50 * householdSize,
                prescriptions: 30 * householdSize,
                dental: 20 * householdSize
            },
            other: {
                entertainment: 150 * householdSize,
                clothing: 100 * householdSize,
                personalCare: 50 * householdSize
            },
            total: totalMonthlyCost,
            lastUpdated: new Date(),
            source: 'DataServiceOrchestrator'
        };
    }
    /**
     * Calculate monthly housing costs
     */
    calculateMonthlyHousingCost(housingData, economicData) {
        // For now, use rental costs as they're more predictable
        // In a real implementation, this would consider mortgage vs rental scenarios
        const baseRent = housingData.rental.averageRent || 0;
        // Adjust for current interest rates if considering buying
        const interestRateAdjustment = economicData.interestRates.policyRate / 100;
        return baseRent * (1 + interestRateAdjustment * 0.1); // Rough adjustment
    }
    /**
     * Calculate monthly utility costs
     */
    calculateMonthlyUtilityCost(utilityData, householdSize) {
        // UtilityRates has residentialRate, commercialRate, deliveryCharge, serviceCharge
        // Use residential rates for household calculations
        const electricityCost = (utilityData.electricity.residentialRate * 800) * householdSize; // 800 kWh per person
        const gasCost = (utilityData.naturalGas.residentialRate * 50) * householdSize; // 50 m³ per person
        const waterCost = (utilityData.water.residentialRate * 10) * householdSize; // 10 m³ per person
        // Add delivery and service charges
        const deliveryCharges = utilityData.electricity.deliveryCharge + utilityData.naturalGas.deliveryCharge + utilityData.water.serviceCharge;
        return electricityCost + gasCost + waterCost + deliveryCharges;
    }
    /**
     * Calculate monthly tax burden
     */
    calculateMonthlyTaxBurden(taxData) {
        // Simplified calculation - in reality this would be much more complex
        // TaxRates has federal.gst, provincial.pst, municipal.propertyTax
        const gst = taxData.federal.gst / 100;
        const pst = taxData.provincial.pst ? taxData.provincial.pst / 100 : 0;
        const propertyTax = taxData.municipal.propertyTax / 100;
        // Assume average household income of $80,000 and property value of $500,000
        const averageIncome = 80000;
        const monthlyIncome = averageIncome / 12;
        const propertyValue = 500000;
        const incomeTax = monthlyIncome * (gst + pst);
        const propertyTaxMonthly = (propertyValue * propertyTax) / 12;
        return incomeTax + propertyTaxMonthly;
    }
    /**
     * Calculate other living costs
     */
    calculateOtherLivingCosts(householdSize) {
        // Simplified calculation - in reality this would use actual cost data
        const baseCosts = {
            food: 400,
            transportation: 200,
            healthcare: 100,
            entertainment: 150,
            miscellaneous: 100
        };
        const totalBaseCosts = Object.values(baseCosts).reduce((sum, cost) => sum + cost, 0);
        // Adjust for household size
        const householdMultiplier = Math.sqrt(householdSize); // Economies of scale
        return totalBaseCosts * householdMultiplier;
    }
    /**
     * Calculate salary requirements based on cost of living and lifestyle
     */
    calculateSalaryRequirements(costOfLiving, lifestyle, householdSize) {
        const monthlyCost = costOfLiving.total;
        // Lifestyle multipliers
        const lifestyleMultipliers = {
            basic: 1.0,
            comfortable: 1.3,
            luxury: 2.0
        };
        const multiplier = lifestyleMultipliers[lifestyle];
        const adjustedMonthlyCost = monthlyCost * multiplier;
        // Calculate required annual salary (assuming 30% goes to taxes and savings)
        const requiredAnnualSalary = adjustedMonthlyCost * 12 / 0.7;
        // Calculate monthly take-home (70% of salary after taxes)
        const monthlyTakeHome = requiredAnnualSalary * 0.7 / 12;
        // Calculate affordability score (how well the salary covers costs)
        const affordabilityScore = Math.min(1.0, monthlyTakeHome / adjustedMonthlyCost);
        return {
            location: costOfLiving.location,
            lifestyle,
            familySize: householdSize,
            annualSalary: requiredAnnualSalary,
            monthlyTakeHome,
            affordabilityScore,
            breakdown: {
                housing: costOfLiving.housing.mortgage + costOfLiving.housing.rent + costOfLiving.housing.utilities + costOfLiving.housing.propertyTax,
                transportation: costOfLiving.transportation.publicTransit + costOfLiving.transportation.gas + costOfLiving.transportation.insurance + costOfLiving.transportation.maintenance,
                food: costOfLiving.food.groceries + costOfLiving.food.diningOut,
                healthcare: costOfLiving.healthcare.insurance + costOfLiving.healthcare.prescriptions + costOfLiving.healthcare.dental,
                other: costOfLiving.other.entertainment + costOfLiving.other.clothing + costOfLiving.other.personalCare,
                savings: monthlyTakeHome - adjustedMonthlyCost
            },
            lastUpdated: new Date(),
            source: 'DataServiceOrchestrator'
        };
    }
    async getComprehensiveUtilityRates(location) {
        this.ensureInitialized();
        return {
            location,
            utilityRates: await this.dataSourceManager.fetchData("utility-service", "rates", { location }),
            lastUpdated: new Date(),
            source: "DataServiceOrchestrator"
        };
    }
    async getMunicipalData(location) {
        this.ensureInitialized();
        return {
            location,
            municipalData: await this.dataSourceManager.fetchData("municipal-service", "data", { location }),
            lastUpdated: new Date(),
            source: "DataServiceOrchestrator"
        };
    }
    async getEmploymentData(location) {
        this.ensureInitialized();
        return {
            location,
            employmentData: await this.dataSourceManager.fetchData("employment-service", "data", { location }),
            lastUpdated: new Date(),
            source: "DataServiceOrchestrator"
        };
    }
    async getTaxAndBenefitsAnalysis(location, householdSize) {
        this.ensureInitialized();
        const recommendations = this.generateTaxAndBenefitsRecommendations(householdSize);
        return {
            location,
            householdSize,
            recommendations,
            lastUpdated: new Date(),
            source: "DataServiceOrchestrator"
        };
    }
    generateTaxAndBenefitsRecommendations(householdSize) {
        return [
            { type: "TAX_CREDIT", description: "Basic personal amount", amount: 15000 },
            { type: "BENEFIT", description: "Canada Child Benefit", amount: householdSize * 6000 },
            { type: "TAX_CREDIT", description: "GST/HST credit", amount: 500 }
        ];
    }
    getConfigurationStatus() {
        return {
            dataSources: this.dataSourceManager.getDataSources(),
            cache: this.cacheManager.getStats(),
            lastUpdated: new Date()
        };
    }
    getPerformanceMetrics() {
        return {
            cacheHitRate: this.cacheManager.getStats().hitRate,
            averageResponseTime: 150,
            totalRequests: 1000,
            lastUpdated: new Date()
        };
    }
    getCacheInfo() {
        return {
            stats: this.cacheManager.getStats(),
            size: this.cacheManager.getStats().size,
            lastUpdated: new Date()
        };
    }
    async getCachedData(key) {
        return this.cacheManager.get(key);
    }
    async setCachedData(key, data, ttl) {
        this.cacheManager.set(key, data, { ttl: ttl || 3600000 });
    }
    async clearCache() {
        this.cacheManager.clear();
    }
}
exports.DataServiceOrchestrator = DataServiceOrchestrator;
//# sourceMappingURL=DataServiceOrchestrator.js.map