// Main entry point for Canadian Data Sources System
// Export all public interfaces and classes

// Core orchestrator
import { DataServiceOrchestrator } from './DataServiceOrchestrator';
export { DataServiceOrchestrator };

// Data source manager
export { DataSourceManager } from './core/DataSourceManager';

// Services
export { DataValidationService } from './services/DataValidationService';
export { DataSynchronizationService } from './services/DataSynchronizationService';
export { DataMonitoringService } from './services/DataMonitoringService';

// Data sources
export { StatsCanDataSource } from './sources/StatsCanDataSource';
export { CMHCDataSource } from './sources/CMHCDataSource';
export { BankOfCanadaDataSource } from './sources/BankOfCanadaDataSource';
export { OntarioEnergyBoardDataSource } from './sources/OntarioEnergyBoardDataSource';
export { TorontoOpenDataSource } from './sources/TorontoOpenDataSource';
export { CRADatasource } from './sources/CRADatasource';
export { ESDCDataSource } from './sources/ESDCDataSource';

// Configuration
export { 
  getDataSourceConfig, 
  getAllDataSourceNames, 
  getHighPriorityDataSources,
  getDataSourcesByFrequency,
  validateDataSourceConfig,
  getEnvironmentConfig
} from './config/dataSourceConfig';

// Types and interfaces
export * from './types';

// Version information
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();

// Default export for convenience
export default DataServiceOrchestrator;