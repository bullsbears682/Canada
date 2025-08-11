#!/bin/bash
# Fix the DataServiceOrchestrator.ts file

# Add cacheManager initialization after monitoringService
sed -i '/this.monitoringService = new DataMonitoringService(/,/);/a\
    this.cacheManager = new CacheManager();' src/DataServiceOrchestrator.ts

echo "Fixed DataServiceOrchestrator.ts"
