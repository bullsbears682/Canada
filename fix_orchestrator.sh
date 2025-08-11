#!/bin/bash

# Fix DataServiceOrchestrator.ts file
echo "Fixing DataServiceOrchestrator.ts..."

# Add utility imports after line 19 (after types import)
sed -i '19a\
import { ConfigValidator, PerformanceMonitor, CacheManager } from "./utils";' src/DataServiceOrchestrator.ts

# Add cacheManager property after line 33 (after other private properties)
sed -i '33a\
  private cacheManager: CacheManager;' src/DataServiceOrchestrator.ts

# Add cacheManager initialization in constructor after monitoringService
sed -i '/this\.monitoringService = new MonitoringService();/a\
    this.cacheManager = new CacheManager();' src/DataServiceOrchestrator.ts

echo "File fixed successfully!"