import { DataServiceOrchestrator } from '../DataServiceOrchestrator';
import { CanadianLocation } from '../types';

/**
 * 🇨🇦 Comprehensive Data Analysis Example
 * 
 * Demonstrates the enhanced capabilities of the Canadian Data Sources system
 * with all new data sources integrated and working together.
 */
export class ComprehensiveDataAnalysis {
  private orchestrator: DataServiceOrchestrator;

  constructor() {
    this.orchestrator = new DataServiceOrchestrator();
  }

  /**
   * Run a comprehensive analysis for a specific location
   */
  async runComprehensiveAnalysis(location: CanadianLocation): Promise<void> {
    console.log('🚀 Starting comprehensive data analysis...');
    console.log(`📍 Location: ${location.city}, ${location.province}`);
    console.log('=' .repeat(60));

    try {
      // Initialize the orchestrator
      await this.orchestrator.initialize();
      console.log('✅ Orchestrator initialized successfully\n');

      // Run all analyses
      await Promise.all([
        this.analyzeHousingAndRealEstate(location),
        this.analyzeEconomicIndicators(),
        this.analyzeUtilityRates(location),
        this.analyzeTaxAndBenefits(location),
        this.analyzeMunicipalServices(location),
        this.analyzeEmploymentData(location)
      ]);

      // Generate comprehensive cost of living analysis
      await this.generateCostOfLivingAnalysis(location);

      console.log('\n🎉 Comprehensive analysis completed successfully!');

    } catch (error) {
      console.error('❌ Analysis failed:', error);
      throw error;
    }
  }

  /**
   * Analyze housing and real estate data
   */
  private async analyzeHousingAndRealEstate(location: CanadianLocation): Promise<void> {
    console.log('🏠 Analyzing Housing & Real Estate Data...');
    
    try {
      const housingData = await this.orchestrator.getHousingData(location);
      
      console.log(`  📊 Average Home Price: $${housingData.prices.averagePrice?.toLocaleString() || 'N/A'}`);
      console.log(`  📊 Median Home Price: $${housingData.prices.medianPrice?.toLocaleString() || 'N/A'}`);
      console.log(`  🏠 Average Rent: $${housingData.rental.averageRent?.toLocaleString() || 'N/A'}`);
      console.log(`  📈 Days on Market: ${housingData.market.daysOnMarket || 'N/A'}`);
      console.log(`  🏘️  Vacancy Rate: ${housingData.rental.vacancyRate || 'N/A'}%`);
      
      console.log('  ✅ Housing analysis completed\n');
    } catch (error) {
      console.log(`  ⚠️  Housing analysis failed: ${(error as any).message}\n`);
    }
  }

  /**
   * Analyze economic indicators
   */
  private async analyzeEconomicIndicators(): Promise<void> {
    console.log('📈 Analyzing Economic Indicators...');
    
    try {
      const economicData = await this.orchestrator.getEconomicIndicators();
      
      console.log(`  💰 Policy Rate: ${economicData.interestRates.policyRate || 'N/A'}%`);
      console.log(`  💰 Prime Rate: ${economicData.interestRates.primeRate || 'N/A'}%`);
      console.log(`  📊 CPI Inflation: ${economicData.inflation.cpi || 'N/A'}%`);
      console.log(`  💱 USD Exchange Rate: $${economicData.exchangeRates.usd || 'N/A'}`);
      console.log(`  💱 EUR Exchange Rate: €${economicData.exchangeRates.eur || 'N/A'}`);
      
      console.log('  ✅ Economic analysis completed\n');
    } catch (error) {
      console.log(`  ⚠️  Economic analysis failed: ${(error as any).message}\n`);
    }
  }

  /**
   * Analyze utility rates
   */
  private async analyzeUtilityRates(location: CanadianLocation): Promise<void> {
    console.log('⚡ Analyzing Utility Rates...');
    
    try {
      const utilityRates = await this.orchestrator.getComprehensiveUtilityRates(location);
      
      if (utilityRates.electricity) {
        console.log(`  🔌 Electricity Rate: ${utilityRates.electricity.residentialRate || 'N/A'}¢/kWh`);
        console.log(`  🔌 Delivery Charge: $${utilityRates.electricity.deliveryCharge || 'N/A'}`);
      }
      
      if (utilityRates.naturalGas) {
        console.log(`  🔥 Natural Gas Rate: ${utilityRates.naturalGas.residentialRate || 'N/A'}¢/m³`);
        console.log(`  🔥 Delivery Charge: $${utilityRates.naturalGas.deliveryCharge || 'N/A'}`);
      }
      
      if (utilityRates.water) {
        console.log(`  💧 Water Rate: ${utilityRates.water.residentialRate || 'N/A'}¢/m³`);
        console.log(`  💧 Service Charge: $${utilityRates.water.serviceCharge || 'N/A'}`);
      }
      
      console.log('  ✅ Utility analysis completed\n');
    } catch (error) {
      console.log(`  ⚠️  Utility analysis failed: ${(error as any).message}\n`);
    }
  }

  /**
   * Analyze tax and benefits
   */
  private async analyzeTaxAndBenefits(location: CanadianLocation): Promise<void> {
    console.log('💰 Analyzing Tax & Benefits...');
    
    try {
      const taxData = await this.orchestrator.getTaxInformation(location);
      const benefits = await this.orchestrator.getGovernmentBenefits(location.province);
      
      console.log(`  🏛️  GST Rate: ${taxData.federal.gst || 'N/A'}%`);
      console.log(`  🏛️  Provincial Tax: ${taxData.provincial.pst || 'N/A'}%`);
      console.log(`  🏛️  Property Tax: ${taxData.municipal.propertyTax || 'N/A'}%`);
      console.log(`  🎁 Available Benefits: ${benefits.length} programs`);
      
      // Show some specific benefits
      benefits.slice(0, 3).forEach(benefit => {
        console.log(`    • ${benefit.name}: ${benefit.description?.substring(0, 50)}...`);
      });
      
      console.log('  ✅ Tax & Benefits analysis completed\n');
    } catch (error) {
      console.log(`  ⚠️  Tax & Benefits analysis failed: ${(error as any).message}\n`);
    }
  }

  /**
   * Analyze municipal services
   */
  private async analyzeMunicipalServices(location: CanadianLocation): Promise<void> {
    console.log('🏛️ Analyzing Municipal Services...');
    
    try {
      const municipalData = await this.orchestrator.getMunicipalData(location);
      
      if (municipalData.services) {
        console.log(`  🚌 Public Transit: ${municipalData.services.transit ? 'Available' : 'Not Available'}`);
        console.log(`  🚑 Emergency Services: ${municipalData.services.emergency ? 'Available' : 'Not Available'}`);
        console.log(`  🏥 Healthcare: ${municipalData.services.healthcare ? 'Available' : 'Not Available'}`);
        console.log(`  🎓 Education: ${municipalData.services.education ? 'Available' : 'Not Available'}`);
      }
      
      if (municipalData.infrastructure) {
        console.log(`  🛣️  Road Quality: ${municipalData.infrastructure.roadQuality || 'N/A'}`);
        console.log(`  🌉 Bridge Condition: ${municipalData.infrastructure.bridgeCondition || 'N/A'}`);
      }
      
      console.log('  ✅ Municipal services analysis completed\n');
    } catch (error) {
      console.log(`  ⚠️  Municipal services analysis failed: ${(error as any).message}\n`);
    }
  }

  /**
   * Analyze employment data
   */
  private async analyzeEmploymentData(location: CanadianLocation): Promise<void> {
    console.log('💼 Analyzing Employment Data...');
    
    try {
      const employmentData = await this.orchestrator.getEmploymentData(location);
      
      if (employmentData.statistics) {
        console.log(`  📊 Unemployment Rate: ${employmentData.statistics.unemploymentRate || 'N/A'}%`);
        console.log(`  📊 Employment Rate: ${employmentData.statistics.employmentRate || 'N/A'}%`);
        console.log(`  📊 Labour Force Participation: ${employmentData.statistics.labourForceParticipation || 'N/A'}%`);
      }
      
      if (employmentData.market) {
        console.log(`  💼 Job Market: ${employmentData.market.condition || 'N/A'}`);
        console.log(`  💼 Average Wage: $${employmentData.market.averageWage?.toLocaleString() || 'N/A'}`);
        console.log(`  💼 Job Growth: ${employmentData.market.jobGrowth || 'N/A'}%`);
      }
      
      console.log('  ✅ Employment analysis completed\n');
    } catch (error) {
      console.log(`  ⚠️  Employment analysis failed: ${(error as any).message}\n`);
    }
  }

  /**
   * Generate comprehensive cost of living analysis
   */
  private async generateCostOfLivingAnalysis(location: CanadianLocation): Promise<void> {
    console.log('🧮 Generating Cost of Living Analysis...');
    
    try {
      // Calculate for different household sizes and lifestyles
      const scenarios = [
        { size: 1, lifestyle: 'basic' as const },
        { size: 2, lifestyle: 'comfortable' as const },
        { size: 4, lifestyle: 'comfortable' as const }
      ];

      for (const scenario of scenarios) {
        console.log(`\n  👨‍👩‍👧‍👦 ${scenario.size} person(s), ${scenario.lifestyle} lifestyle:`);
        
        try {
          const costOfLiving = await this.orchestrator.calculateCostOfLiving(location, scenario.size);
          const salaryRequirement = await this.orchestrator.calculateRequiredSalary(
            location, 
            scenario.lifestyle, 
            scenario.size
          );
          
          console.log(`    💰 Monthly Cost: $${costOfLiving.total.toLocaleString()}`);
          console.log(`    💰 Required Annual Salary: $${salaryRequirement.annualSalary.toLocaleString()}`);
          console.log(`    💰 Monthly Take-Home: $${salaryRequirement.monthlyTakeHome.toLocaleString()}`);
          console.log(`    📊 Affordability Score: ${(salaryRequirement.affordabilityScore * 100).toFixed(1)}%`);
          
        } catch (error) {
          console.log(`    ⚠️  Calculation failed: ${(error as any).message}`);
        }
      }
      
      console.log('\n  ✅ Cost of living analysis completed');
    } catch (error) {
      console.log(`  ⚠️  Cost of living analysis failed: ${(error as any).message}`);
    }
  }

  /**
   * Generate a detailed report for a specific income level
   */
  async generateDetailedReport(location: CanadianLocation, income: number, householdSize: number = 1): Promise<void> {
    console.log('\n📋 Generating Detailed Report...');
    console.log(`💰 Income: $${income.toLocaleString()}`);
    console.log(`👨‍👩‍👧‍👦 Household Size: ${householdSize}`);
    console.log('=' .repeat(60));

    try {
      const taxAnalysis = await this.orchestrator.getTaxAndBenefitsAnalysis(location, householdSize);
      
      console.log('📊 Tax & Benefits Analysis:');
      console.log(`  💸 Monthly Tax Burden: $${taxAnalysis.taxBurden.toLocaleString()}`);
      console.log(`  🎁 Available Benefits: ${taxAnalysis.availableBenefits.length} programs`);
      console.log(`  ✅ Eligibility Results: ${taxAnalysis.eligibility ? 'Available' : 'Not Available'}`);
      
      if (taxAnalysis.recommendations && taxAnalysis.recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        taxAnalysis.recommendations.forEach((rec: any, index: number) => {
          console.log(`  ${index + 1}. ${rec.title} (${rec.priority} priority)`);
          console.log(`     ${rec.description}`);
          if (rec.estimatedSavings) {
            console.log(`     💰 Estimated Savings: $${rec.estimatedSavings.toLocaleString()}`);
          }
          console.log(`     🎯 Action: ${rec.action}`);
        });
      }
      
      console.log('\n✅ Detailed report completed');
    } catch (error) {
      console.log(`❌ Detailed report failed: ${(error as any).message}`);
    }
  }

  /**
   * Get system health and performance metrics
   */
  async getSystemStatus(): Promise<void> {
    console.log('\n🔍 System Status & Performance...');
    console.log('=' .repeat(60));

    try {
      const systemHealth = this.orchestrator.getSystemHealth();
      const allSourcesHealth = this.orchestrator.getAllSourcesHealth();
      const syncStatus = this.orchestrator.getSyncStatus();
      const dataQuality = this.orchestrator.getDataQuality();
      const configStatus = this.orchestrator.getConfigurationStatus();
      const performanceMetrics = this.orchestrator.getPerformanceMetrics();
      const cacheInfo = this.orchestrator.getCacheInfo();

      console.log('🏥 System Health:', systemHealth.status || 'Unknown');
      console.log('📊 Data Sources:', Object.keys(allSourcesHealth).length);
      console.log('🔄 Sync Status:', syncStatus.status || 'Unknown');
      console.log('📈 Overall Data Quality:', dataQuality.overall || 'Unknown');

      // Configuration status
      console.log('\n⚙️  Configuration:');
      console.log(`  Required sources: ${configStatus.summary.required.length}`);
      console.log(`  Optional sources: ${configStatus.summary.optional.length}`);
      console.log(`  Missing sources: ${configStatus.summary.missing.length}`);
      
      // Performance metrics
      console.log('\n📊 Performance:');
      console.log(`  Overall success rate: ${performanceMetrics.system.overallSuccessRate.toFixed(1)}%`);
      console.log(`  Average response time: ${performanceMetrics.system.averageResponseTime.toFixed(0)}ms`);
      
      // Cache information
      console.log('\n💾 Cache:');
      console.log(`  Cache size: ${cacheInfo.stats.size} entries`);
      console.log(`  Hit rate: ${cacheInfo.stats.hitRate.toFixed(1)}%`);

      console.log('\n📊 Individual Source Health:');
      Object.entries(allSourcesHealth).forEach(([source, health]) => {
        const status = (health as any).status || 'Unknown';
        const emoji = status === 'healthy' ? '✅' : status === 'unhealthy' ? '❌' : '⚠️';
        console.log(`  ${emoji} ${source}: ${status}`);
      });

    } catch (error) {
      console.log(`❌ System status check failed: ${(error as any).message}`);
    }
  }
}

/**
 * Example usage and demonstration
 */
export async function runExample(): Promise<void> {
  const analysis = new ComprehensiveDataAnalysis();
  
  // Example location (Toronto, Ontario)
  const torontoLocation: CanadianLocation = {
    city: 'Toronto',
    province: "ON",
    postalCode: 'M5V 3A8',
    latitude: 43.6532,
    longitude: -79.3832
  };

  console.log('🇨🇦 Canadian Data Sources - Comprehensive Analysis Demo');
  console.log('=' .repeat(60));

  try {
    // Run comprehensive analysis
    await analysis.runComprehensiveAnalysis(torontoLocation);
    
    // Generate detailed report for $80,000 income
    await analysis.generateDetailedReport(torontoLocation, 80000, 2);
    
    // Get system status
    await analysis.getSystemStatus();
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Export for use in other modules
export default ComprehensiveDataAnalysis;