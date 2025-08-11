const { DataServiceOrchestrator } = require('./dist/DataServiceOrchestrator.js');

async function demonstrateOrchestrator() {
  console.log('🚀 DataServiceOrchestrator Demo\n');
  
  try {
    // Create orchestrator instance
    const orchestrator = new DataServiceOrchestrator();
    console.log('✅ Orchestrator instance created successfully');
    
    // Show available methods
    const methods = Object.getOwnPropertyNames(DataServiceOrchestrator.prototype)
      .filter(name => name !== 'constructor');
    
    console.log(`\n📋 Available Methods (${methods.length}):`);
    methods.forEach((method, index) => {
      console.log(`  ${index + 1}. ${method}`);
    });
    
    // Test cache management methods
    console.log('\n🧪 Testing Cache Management:');
    const cacheInfo = await orchestrator.getCacheInfo();
    console.log('  Cache Info:', JSON.stringify(cacheInfo, null, 2));
    
    // Test performance metrics
    console.log('\n📊 Testing Performance Metrics:');
    const performance = await orchestrator.getPerformanceMetrics();
    console.log('  Performance:', JSON.stringify(performance, null, 2));
    
    // Test configuration status
    console.log('\n⚙️  Testing Configuration Status:');
    const config = await orchestrator.getConfigurationStatus();
    console.log('  Configuration:', JSON.stringify(config, null, 2));
    
    console.log('\n🎉 Demo completed successfully!');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the demo
demonstrateOrchestrator();