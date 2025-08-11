# 🇨🇦 Canadian Data Sources for Cost of Living Analyzer

A comprehensive, production-ready data integration system for Canadian cost of living analysis, providing real-time access to government statistics, housing data, economic indicators, utility rates, tax information, and government benefits.

## 🏗️ Architecture Overview

The system is built with a modular, service-oriented architecture that ensures reliability, scalability, and maintainability:

```
┌─────────────────────────────────────────────────────────────┐
│                    DataServiceOrchestrator                 │
│                    (Main Entry Point)                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────┼───────────────────────────────────────┐
│                     │                                       │
│  ┌─────────────────▼─────────────────┐                     │
│  │         DataSourceManager         │                     │
│  │      (Data Source Registry)      │                     │
│  └─────────────────┬─────────────────┘                     │
│                    │                                       │
│  ┌─────────────────▼─────────────────┐                     │
│  │      DataValidationService        │                     │
│  │      (Data Quality Control)       │                     │
│  └─────────────────┬─────────────────┘                     │
│                    │                                       │
│  ┌─────────────────▼─────────────────┐                     │
│  │    DataSynchronizationService     │                     │
│  │      (Automated Data Sync)        │                     │
│  └─────────────────┬─────────────────┘                     │
│                    │                                       │
│  ┌─────────────────▼─────────────────┐                     │
│  │      DataMonitoringService        │                     │
│  │      (Health & Performance)       │                     │
│  └─────────────────┬─────────────────┘                     │
│                    │                                       │
└─────────────────────┼───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Data Sources                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ Statistics  │ │    CMHC     │ │ Bank of     │          │
│  │   Canada    │ │             │ │  Canada     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ Ontario     │ │  Toronto    │ │    CRA      │          │
│  │   Energy    │ │   Open      │ │             │          │
│  │   Board     │ │   Data      │ │             │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Features

### Core Functionality
- **Multi-Source Data Integration**: Seamlessly integrates data from 7+ Canadian government and regulatory sources
- **Real-Time Data Access**: Provides up-to-date information on housing, economics, utilities, taxes, and benefits
- **Intelligent Fallback**: Automatic failover between data sources for enhanced reliability
- **Cost of Living Calculations**: Comprehensive calculations including housing, utilities, taxes, and living expenses
- **Salary Requirements**: Calculate required income for different lifestyles (basic, comfortable, luxury)

### Data Quality & Reliability
- **Automated Validation**: Comprehensive data validation with configurable quality thresholds
- **Data Synchronization**: Automated data updates based on source-specific frequencies
- **Health Monitoring**: Real-time monitoring of data source health and performance
- **Error Handling**: Robust error handling with detailed logging and alerting

### Performance & Scalability
- **Intelligent Caching**: Multi-level caching strategy for optimal performance
- **Rate Limiting**: Respects API rate limits with intelligent request management
- **Concurrent Processing**: Efficient handling of multiple concurrent requests
- **Performance Metrics**: Comprehensive performance tracking and optimization

## 📊 Data Sources

### Government Statistics
- **Statistics Canada** - Official government statistics, housing data, demographics
- **Bank of Canada** - Interest rates, inflation, exchange rates, economic indicators
- **Canada Revenue Agency (CRA)** - Tax rates, brackets, credits, benefits
- **Employment and Social Development Canada (ESDC)** - Government benefits, employment data

### Housing & Real Estate
- **CMHC** - Housing market data, mortgage information, rental statistics
- **Provincial Regulators** - Utility rates, energy costs, regulatory information
- **Municipal Open Data** - Local cost data, city-specific information

### Data Coverage
- **Geographic Coverage**: All 10 provinces and 3 territories
- **Data Types**: Housing prices, rental rates, utility costs, tax rates, benefits
- **Update Frequencies**: Real-time to annually, depending on data source
- **Historical Data**: Available where supported by source APIs

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- TypeScript 5+
- Jest (for testing)
- Environment variables for API keys

### Environment Variables
Create a `.env` file with your API keys:

```bash
# Statistics Canada
STATSCAN_API_KEY=your_stats_can_key

# CMHC (Canada Mortgage and Housing Corporation)
CMHC_API_KEY=your_cmhc_key

# Bank of Canada
BANK_OF_CANADA_API_KEY=your_boc_key

# Ontario Energy Board
OEB_API_KEY=your_oeb_key

# Toronto Open Data
TORONTO_OPEN_DATA_API_KEY=your_toronto_key

# Canada Revenue Agency
CRA_API_KEY=your_cra_key

# Employment and Social Development Canada
ESDC_API_KEY=your_esdc_key
```

### Installation
```bash
npm install
npm run build
npm test
```

## 📖 Usage

### Basic Usage

```typescript
import { DataServiceOrchestrator } from './data-sources/DataServiceOrchestrator';

async function main() {
  // Initialize the orchestrator
  const orchestrator = new DataServiceOrchestrator();
  await orchestrator.initialize();

  try {
    // Define a location
    const location = {
      city: 'Toronto',
      province: 'ONTARIO',
      postalCode: 'M5V 3A8',
      coordinates: { latitude: 43.6532, longitude: -79.3832 }
    };

    // Get housing data
    const housingData = await orchestrator.getHousingData(location);
    console.log('Housing Data:', housingData);

    // Calculate cost of living
    const costOfLiving = await orchestrator.calculateCostOfLiving(location, 2);
    console.log('Monthly Cost:', costOfLiving.monthlyBreakdown.total);

    // Calculate required salary
    const salaryRequirements = await orchestrator.calculateRequiredSalary(
      location, 
      'comfortable', 
      2
    );
    console.log('Required Annual Salary:', salaryRequirements.annualRequired);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Shutdown gracefully
    await orchestrator.shutdown();
  }
}

main();
```

### Advanced Usage

```typescript
// Get economic indicators
const economicData = await orchestrator.getEconomicIndicators();
console.log('Current Interest Rate:', economicData.interestRates.policyRate);

// Get utility rates
const utilityRates = await orchestrator.getUtilityRates(location);
console.log('Electricity Rate:', utilityRates.electricity.ratePerKwh);

// Get government benefits
const benefits = await orchestrator.getGovernmentBenefits('ONTARIO');
console.log('Available Benefits:', benefits.map(b => b.name));

// Get tax information
const taxInfo = await orchestrator.getTaxInformation(location);
console.log('Combined Tax Rate:', taxInfo.rates.combined);

// Monitor system health
const healthStatus = orchestrator.getSystemHealth();
console.log('System Status:', healthStatus.overallStatus);

// Get detailed monitoring
const allSourcesHealth = orchestrator.getAllSourcesHealth();
Object.entries(allSourcesHealth).forEach(([source, health]) => {
  console.log(`${source}: ${health.currentStatus} (${health.uptime.toFixed(1)}% uptime)`);
});
```

## 🔧 Configuration

### Data Source Configuration
The system uses a centralized configuration system in `dataSourceConfig.ts`:

```typescript
export const DATA_SOURCE_CONFIGS = {
  'stats-can': {
    name: 'Statistics Canada',
    baseUrl: 'https://api.statcan.gc.ca',
    apiKey: process.env.STATSCAN_API_KEY,
    rateLimit: { requests: 1000, window: 3600 },
    updateFrequency: UpdateFrequency.DAILY,
    priority: 'high',
    retryOnFailure: true,
    dataQualityThreshold: 0.9
  },
  // ... other sources
};
```

### Update Frequencies
- **REAL_TIME**: 5 minutes
- **HOURLY**: 1 hour
- **DAILY**: 24 hours
- **WEEKLY**: 7 days
- **MONTHLY**: 30 days
- **ANNUALLY**: 365 days

### Priority Levels
- **critical**: Bank of Canada (interest rates)
- **high**: Statistics Canada, CMHC, CRA, ESDC
- **medium**: Provincial regulators, municipal data
- **low**: Supplementary data sources

## 📈 Monitoring & Health Checks

### System Health
```typescript
const health = orchestrator.getSystemHealth();
// Returns:
{
  overallStatus: 'healthy' | 'warning' | 'critical',
  totalSources: 7,
  healthySources: 6,
  warningSources: 1,
  criticalSources: 0,
  averageResponseTime: 245,
  totalErrors: 3,
  uptime: 85.7
}
```

### Data Source Health
```typescript
const sourceHealth = orchestrator.getAllSourcesHealth();
// Returns detailed health for each source including:
// - Current status
// - Response times
// - Uptime percentage
// - Error counts
// - Last sync times
// - Data quality metrics
```

### Performance Metrics
- Response time tracking
- Error rate monitoring
- Data quality scoring
- Synchronization success rates
- Cache hit ratios

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- DataServiceOrchestrator.test.ts

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
The test suite covers:
- ✅ Data source initialization
- ✅ Data retrieval and fallback
- ✅ Cost of living calculations
- ✅ Salary requirement calculations
- ✅ System monitoring and health checks
- ✅ Error handling and validation
- ✅ Performance and scalability
- ✅ Data validation integration

## 🔒 Security & Compliance

### API Key Management
- Environment variable-based configuration
- No hardcoded credentials
- Secure key rotation support
- Access logging and monitoring

### Data Privacy
- No personal information storage
- Aggregate data only
- Source attribution maintained
- Audit trail for data access

### Rate Limiting
- Respects source API limits
- Intelligent request throttling
- Backoff strategies for failures
- Queue management for high load

## 🚀 Performance Optimization

### Caching Strategy
- **L1 Cache**: In-memory cache for frequently accessed data
- **L2 Cache**: Persistent cache for larger datasets
- **Cache TTL**: Configurable time-to-live based on data freshness
- **Cache Invalidation**: Automatic invalidation on data updates

### Request Optimization
- **Batch Processing**: Group related requests
- **Connection Pooling**: Reuse HTTP connections
- **Compression**: Gzip compression for responses
- **Parallel Processing**: Concurrent data source queries

### Memory Management
- **Data Streaming**: Process large datasets in chunks
- **Memory Pooling**: Reuse objects to reduce GC pressure
- **Lazy Loading**: Load data only when needed
- **Cleanup Routines**: Regular memory cleanup

## 🔧 Troubleshooting

### Common Issues

#### Data Source Unavailable
```typescript
// Check health status
const health = orchestrator.getAllSourcesHealth();
console.log('Unhealthy sources:', 
  Object.entries(health)
    .filter(([_, h]) => h.currentStatus === 'unhealthy')
    .map(([name, _]) => name)
);
```

#### High Response Times
```typescript
// Check performance metrics
const health = orchestrator.getAllSourcesHealth();
Object.entries(health).forEach(([source, h]) => {
  if (h.responseTime > 2000) {
    console.log(`${source}: ${h.responseTime}ms (slow)`);
  }
});
```

#### Data Quality Issues
```typescript
// Check data quality
const quality = orchestrator.getDataQuality();
console.log('Overall Quality Score:', quality.overallScore);
console.log('Low Quality Sources:', quality.lowQualitySources);
```

### Debug Mode
Enable debug logging by setting the environment variable:
```bash
DEBUG=canadian-data-sources:*
```

## 📚 API Reference

### Core Methods

#### `initialize(): Promise<void>`
Initialize all data sources and services.

#### `shutdown(): Promise<void>`
Gracefully shutdown all services and connections.

#### `getHousingData(location: CanadianLocation): Promise<HousingData>`
Retrieve housing data for a specific location.

#### `getEconomicIndicators(): Promise<EconomicIndicators>`
Get current economic indicators and interest rates.

#### `getUtilityRates(location: CanadianLocation): Promise<UtilityRates>`
Retrieve utility rates for a specific location.

#### `getGovernmentBenefits(province: Province): Promise<GovernmentBenefits[]>`
Get available government benefits for a province.

#### `getTaxInformation(location: CanadianLocation): Promise<TaxInformation>`
Retrieve tax information and rates.

#### `calculateCostOfLiving(location: CanadianLocation, householdSize?: number): Promise<CostOfLivingData>`
Calculate comprehensive cost of living breakdown.

#### `calculateRequiredSalary(location: CanadianLocation, lifestyle: 'basic' | 'comfortable' | 'luxury', householdSize?: number): Promise<SalaryRequirements>`
Calculate required salary for different lifestyles.

### Monitoring Methods

#### `getSystemHealth(): SystemHealthStatus`
Get overall system health status.

#### `getAllSourcesHealth(): Record<string, DetailedHealthStatus>`
Get detailed health status for all data sources.

#### `getSyncStatus(): Record<string, any>`
Get synchronization status for all sources.

#### `getDataQuality(): any`
Get overall data quality metrics.

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Install dependencies: `npm install`
4. Run tests: `npm test`
5. Make your changes
6. Add tests for new functionality
7. Submit a pull request

### Code Style
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comprehensive JSDoc comments
- Maintain test coverage above 90%
- Follow the existing code structure

### Adding New Data Sources
1. Create a new data source class implementing the `DataSource` interface
2. Add configuration to `dataSourceConfig.ts`
3. Register the source in `DataServiceOrchestrator`
4. Add comprehensive tests
5. Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Statistics Canada for comprehensive demographic and economic data
- CMHC for housing market insights
- Bank of Canada for financial indicators
- Provincial and municipal governments for local data
- Open data initiatives across Canada

## 📞 Support

For questions, issues, or contributions:
- Create an issue on GitHub
- Review the troubleshooting guide
- Check the API documentation
- Contact the development team

---

**Built with ❤️ for the Canadian community**