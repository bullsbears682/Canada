// Main entry point for Canadian Data Sources System
// Export all public interfaces and classes

// Core orchestrator
export { DataServiceOrchestrator } from './DataServiceOrchestrator';

// Data source manager
export { DataSourceManager } from './DataSourceManager';

// Services
export { DataValidationService } from './services/DataValidationService';
export { DataSynchronizationService } from './services/DataSynchronizationService';
export { DataMonitoringService } from './services/DataMonitoringService';

// Data sources
export { StatsCanDataSource } from './StatsCanDataSource';
export { CMHCDataSource } from './CMHCDataSource';
export { BankOfCanadaDataSource } from './BankOfCanadaDataSource';

// Configuration
export { 
  getDataSourceConfig, 
  getAllDataSourceNames, 
  getHighPriorityDataSources,
  getDataSourcesByFrequency,
  validateDataSourceConfig,
  getEnvironmentConfig
} from './dataSourceConfig';

// Types and interfaces
export * from '../types';

// Version information
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();

// Default export for convenience
export default DataServiceOrchestrator;