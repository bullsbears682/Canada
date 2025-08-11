#!/bin/bash

# Fix DataServiceOrchestrator.ts file with precise edits
echo "Fixing DataServiceOrchestrator.ts..."

# Add utility imports after the types import (line 20)
sed -i '20i\
import { ConfigValidator, PerformanceMonitor, CacheManager } from "./utils";' src/DataServiceOrchestrator.ts

# Add cacheManager property after line 34 (after other private properties)
sed -i '34i\
  private cacheManager: CacheManager;' src/DataServiceOrchestrator.ts

# Add cacheManager initialization in constructor after monitoringService (around line 44)
sed -i '/this\.monitoringService = new DataMonitoringService(/a\
    this.cacheManager = new CacheManager();' src/DataServiceOrchestrator.ts

echo "File fixed successfully!"