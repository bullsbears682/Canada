# 🇨🇦 Canadian Data Sources

A comprehensive data integration system for Canadian cost of living analysis, providing access to housing, economic, utility, municipal, tax, and employment data from multiple authoritative sources.

## 🚀 Features

### Core Data Sources
- **Statistics Canada** - Housing, economic indicators, and demographic data
- **CMHC (Canada Mortgage and Housing Corporation)** - Real estate market data and mortgage rates
- **Bank of Canada** - Interest rates, exchange rates, and economic forecasts
- **Ontario Energy Board** - Utility rates and energy market data
- **Toronto Open Data** - Municipal services and infrastructure information
- **CRA (Canada Revenue Agency)** - Tax rates, benefits, and eligibility
- **ESDC (Employment and Social Development Canada)** - Employment statistics and labour market data

### Advanced Functionality
- **Intelligent Data Orchestration** - Automatic fallback between data sources
- **Real-time Data Validation** - Quality checks and business rule validation
- **Comprehensive Cost Analysis** - Multi-scenario cost of living calculations
- **Tax Optimization Recommendations** - Personalized tax and benefits advice
- **Performance Monitoring** - Health checks and performance metrics
- **Rate Limiting & Caching** - Efficient API usage and data freshness

## 🏗️ Architecture

```
DataServiceOrchestrator
├── DataSourceManager (Core orchestration)
├── DataValidationService (Quality assurance)
├── DataSynchronizationService (Data freshness)
├── DataMonitoringService (Health & performance)
└── Individual Data Sources
    ├── StatsCanDataSource
    ├── CMHCDataSource
    ├── BankOfCanadaDataSource
    ├── OntarioEnergyBoardDataSource
    ├── TorontoOpenDataSource
    ├── CRADatasource
    └── ESDCDataSource
```

## 📦 Installation

```bash
npm install
npm run build
```

## 🔧 Configuration

Create a `.env` file with your API keys:

```env
# Statistics Canada
STATS_CAN_API_KEY=your_api_key_here

# CMHC
CMHC_API_KEY=your_api_key_here

# Bank of Canada
BANK_OF_CANADA_API_KEY=your_api_key_here

# Ontario Energy Board
ONTARIO_ENERGY_BOARD_API_KEY=your_api_key_here

# Toronto Open Data
TORONTO_OPEN_DATA_API_KEY=your_api_key_here

# CRA
CRA_API_KEY=your_api_key_here

# ESDC
ESDC_API_KEY=your_api_key_here
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { DataServiceOrchestrator } from './src/DataServiceOrchestrator';
import { CanadianLocation, Province } from './src/types';

// Initialize the orchestrator
const orchestrator = new DataServiceOrchestrator();
await orchestrator.initialize();

// Define a location
const torontoLocation: CanadianLocation = {
  city: 'Toronto',
  province: Province.ON,
  postalCode: 'M5V 3A8',
  latitude: 43.6532,
  longitude: -79.3832
};

// Get comprehensive data
const housingData = await orchestrator.getHousingData(torontoLocation);
const economicData = await orchestrator.getEconomicIndicators();
const utilityRates = await orchestrator.getComprehensiveUtilityRates(torontoLocation);
const taxInfo = await orchestrator.getTaxInformation(torontoLocation);

// Calculate cost of living
const costOfLiving = await orchestrator.calculateCostOfLiving(torontoLocation, 2);
const salaryRequirement = await orchestrator.calculateRequiredSalary(
  torontoLocation, 
  'comfortable', 
  2
);
```

### Advanced Analysis

```typescript
import { ComprehensiveDataAnalysis } from './src/examples/ComprehensiveDataAnalysis';

const analysis = new ComprehensiveDataAnalysis();

// Run comprehensive analysis
await analysis.runComprehensiveAnalysis(torontoLocation);

// Generate detailed tax and benefits report
await analysis.generateDetailedReport(torontoLocation, 80000, 2);

// Check system health
await analysis.getSystemStatus();
```

## 📊 Data Types

### Housing Data
- Average and median home prices
- Rental market data
- Market conditions (days on market, vacancy rates)
- Property types and locations

### Economic Indicators
- Interest rates (policy, prime, mortgage)
- Inflation rates (CPI)
- Exchange rates (USD, EUR)
- Economic forecasts

### Utility Rates
- Electricity rates and delivery charges
- Natural gas rates and delivery charges
- Water and sewer rates
- Provincial utility provider information

### Municipal Services
- Public transportation
- Emergency services
- Healthcare facilities
- Educational institutions
- Infrastructure quality

### Tax Information
- Federal GST rates
- Provincial sales tax rates
- Property tax rates
- Income tax brackets
- Tax credits and deductions

### Employment Data
- Unemployment rates
- Employment rates
- Labour force participation
- Job market conditions
- Average wages and job growth

### Government Benefits
- Income support programs
- Housing assistance
- Healthcare benefits
- Education and training programs
- Eligibility criteria and income thresholds

## 🔍 API Reference

### DataServiceOrchestrator

#### Core Methods
- `initialize()` - Initialize all data sources and services
- `shutdown()` - Gracefully shut down all services
- `getSystemHealth()` - Get overall system health status

#### Data Retrieval
- `getHousingData(location)` - Get housing market data
- `getEconomicIndicators()` - Get economic indicators
- `getUtilityRates(location)` - Get utility rate information
- `getTaxInformation(location)` - Get tax rate information
- `getGovernmentBenefits(province)` - Get available government benefits

#### Enhanced Methods
- `getComprehensiveUtilityRates(location)` - Get utility rates with fallback
- `getMunicipalData(location, dataType)` - Get municipal services data
- `getEmploymentData(location)` - Get employment and labour market data
- `getTaxAndBenefitsAnalysis(location, income, householdSize)` - Comprehensive tax analysis

#### Analysis Methods
- `calculateCostOfLiving(location, householdSize)` - Calculate total cost of living
- `calculateRequiredSalary(location, lifestyle, householdSize)` - Calculate required salary

### DataSourceManager

#### Core Methods
- `registerDataSource(name, source, config)` - Register a new data source
- `fetchData(source, endpoint, params, forceRefresh)` - Fetch data from a specific source
- `getPerformanceMetrics(source)` - Get performance metrics for a source
- `getCacheStats()` - Get cache statistics
- `checkAllHealth()` - Check health of all data sources

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit
npm run test:integration
```

## 📈 Performance

### Caching Strategy
- **Intelligent TTL** - Different cache durations for different data types
- **Automatic Expiration** - Cache invalidation based on data freshness requirements
- **Memory Management** - Automatic cleanup of expired cache entries

### Rate Limiting
- **Per-Source Limits** - Respects individual API rate limits
- **Token Bucket Algorithm** - Efficient rate limiting with burst handling
- **Automatic Retry** - Intelligent retry logic for failed requests

### Data Quality
- **Real-time Validation** - Business rule validation for all incoming data
- **Quality Metrics** - Completeness, accuracy, freshness, and consistency scores
- **Fallback Strategies** - Automatic fallback to alternative data sources

## 🔒 Security

- **API Key Management** - Secure storage and usage of API credentials
- **Request Validation** - Input validation and sanitization
- **Error Handling** - Secure error messages without information leakage
- **Rate Limiting** - Protection against API abuse

## 🚧 Development

### Adding New Data Sources

1. **Implement the DataSource Interface**
```typescript
import { DataSource, HealthStatus, DataQualityMetrics } from '../types';

export class NewDataSource implements DataSource {
  public readonly name = 'New Data Source';
  public readonly baseUrl = 'https://api.example.com';
  public readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async healthCheck(): Promise<HealthStatus> {
    // Implementation
  }

  async getLastUpdate(): Promise<Date> {
    // Implementation
  }

  // Add your specific data methods
}
```

2. **Add Configuration**
```typescript
// In src/config/dataSourceConfig.ts
export const dataSourceConfigs: Record<string, DataSourceConfig> = {
  'new-source': {
    name: 'New Data Source',
    apiKey: process.env.NEW_SOURCE_API_KEY || '',
    baseUrl: 'https://api.example.com',
    rateLimit: { requests: 100, window: 60 },
    updateFrequency: 'hourly',
    priority: 'medium',
    retryOnFailure: true
  }
};
```

3. **Register in Orchestrator**
```typescript
// In DataServiceOrchestrator.initializeDataSources()
const newSourceConfig = getDataSourceConfig('new-source');
if (newSourceConfig && newSourceConfig.apiKey) {
  const newSource = new NewDataSource(newSourceConfig.apiKey);
  this.dataSourceManager.registerDataSource('new-source', newSource, newSourceConfig);
}
```

### Code Style
- **TypeScript** - Strict type checking enabled
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Jest** - Unit and integration testing

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the example implementations in `/src/examples`

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- [x] Core data source implementations
- [x] Basic orchestration and validation
- [x] Caching and rate limiting
- [x] Health monitoring

### Phase 2 (Next) 🚧
- [ ] Machine learning data quality scoring
- [ ] Advanced fallback strategies
- [ ] Real-time data streaming
- [ ] GraphQL API layer

### Phase 3 (Future) 📋
- [ ] Mobile SDK
- [ ] Dashboard and analytics
- [ ] Integration with financial planning tools
- [ ] International data source expansion

---

**Built with ❤️ for the Canadian community**