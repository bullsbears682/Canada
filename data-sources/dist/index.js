"use strict";
// Main entry point for Canadian Data Sources System
// Export all public interfaces and classes
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUILD_DATE = exports.VERSION = exports.getEnvironmentConfig = exports.validateDataSourceConfig = exports.getDataSourcesByFrequency = exports.getHighPriorityDataSources = exports.getAllDataSourceNames = exports.getDataSourceConfig = exports.ESDCDataSource = exports.CRADatasource = exports.TorontoOpenDataSource = exports.OntarioEnergyBoardDataSource = exports.BankOfCanadaDataSource = exports.CMHCDataSource = exports.StatsCanDataSource = exports.DataMonitoringService = exports.DataSynchronizationService = exports.DataValidationService = exports.DataSourceManager = exports.DataServiceOrchestrator = void 0;
// Core orchestrator
const DataServiceOrchestrator_1 = require("./DataServiceOrchestrator");
Object.defineProperty(exports, "DataServiceOrchestrator", { enumerable: true, get: function () { return DataServiceOrchestrator_1.DataServiceOrchestrator; } });
// Data source manager
var DataSourceManager_1 = require("./core/DataSourceManager");
Object.defineProperty(exports, "DataSourceManager", { enumerable: true, get: function () { return DataSourceManager_1.DataSourceManager; } });
// Services
var DataValidationService_1 = require("./services/DataValidationService");
Object.defineProperty(exports, "DataValidationService", { enumerable: true, get: function () { return DataValidationService_1.DataValidationService; } });
var DataSynchronizationService_1 = require("./services/DataSynchronizationService");
Object.defineProperty(exports, "DataSynchronizationService", { enumerable: true, get: function () { return DataSynchronizationService_1.DataSynchronizationService; } });
var DataMonitoringService_1 = require("./services/DataMonitoringService");
Object.defineProperty(exports, "DataMonitoringService", { enumerable: true, get: function () { return DataMonitoringService_1.DataMonitoringService; } });
// Data sources
var StatsCanDataSource_1 = require("./sources/StatsCanDataSource");
Object.defineProperty(exports, "StatsCanDataSource", { enumerable: true, get: function () { return StatsCanDataSource_1.StatsCanDataSource; } });
var CMHCDataSource_1 = require("./sources/CMHCDataSource");
Object.defineProperty(exports, "CMHCDataSource", { enumerable: true, get: function () { return CMHCDataSource_1.CMHCDataSource; } });
var BankOfCanadaDataSource_1 = require("./sources/BankOfCanadaDataSource");
Object.defineProperty(exports, "BankOfCanadaDataSource", { enumerable: true, get: function () { return BankOfCanadaDataSource_1.BankOfCanadaDataSource; } });
var OntarioEnergyBoardDataSource_1 = require("./sources/OntarioEnergyBoardDataSource");
Object.defineProperty(exports, "OntarioEnergyBoardDataSource", { enumerable: true, get: function () { return OntarioEnergyBoardDataSource_1.OntarioEnergyBoardDataSource; } });
var TorontoOpenDataSource_1 = require("./sources/TorontoOpenDataSource");
Object.defineProperty(exports, "TorontoOpenDataSource", { enumerable: true, get: function () { return TorontoOpenDataSource_1.TorontoOpenDataSource; } });
var CRADatasource_1 = require("./sources/CRADatasource");
Object.defineProperty(exports, "CRADatasource", { enumerable: true, get: function () { return CRADatasource_1.CRADatasource; } });
var ESDCDataSource_1 = require("./sources/ESDCDataSource");
Object.defineProperty(exports, "ESDCDataSource", { enumerable: true, get: function () { return ESDCDataSource_1.ESDCDataSource; } });
// Configuration
var dataSourceConfig_1 = require("./config/dataSourceConfig");
Object.defineProperty(exports, "getDataSourceConfig", { enumerable: true, get: function () { return dataSourceConfig_1.getDataSourceConfig; } });
Object.defineProperty(exports, "getAllDataSourceNames", { enumerable: true, get: function () { return dataSourceConfig_1.getAllDataSourceNames; } });
Object.defineProperty(exports, "getHighPriorityDataSources", { enumerable: true, get: function () { return dataSourceConfig_1.getHighPriorityDataSources; } });
Object.defineProperty(exports, "getDataSourcesByFrequency", { enumerable: true, get: function () { return dataSourceConfig_1.getDataSourcesByFrequency; } });
Object.defineProperty(exports, "validateDataSourceConfig", { enumerable: true, get: function () { return dataSourceConfig_1.validateDataSourceConfig; } });
Object.defineProperty(exports, "getEnvironmentConfig", { enumerable: true, get: function () { return dataSourceConfig_1.getEnvironmentConfig; } });
// Types and interfaces
__exportStar(require("./types"), exports);
// Utilities
__exportStar(require("./utils"), exports);
// Version information
exports.VERSION = '1.0.0';
exports.BUILD_DATE = new Date().toISOString();
// Default export for convenience
exports.default = DataServiceOrchestrator_1.DataServiceOrchestrator;
//# sourceMappingURL=index.js.map