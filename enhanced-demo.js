const { DataServiceOrchestrator } = require('./dist/DataServiceOrchestrator.js');

async function demonstrateEnhancedOrchestrator() {
  console.log('🚀 Enhanced DataServiceOrchestrator Demo\n');
  
  try {
    // Create orchestrator instance
    const orchestrator = new DataServiceOrchestrator();
    console.log('✅ Orchestrator instance created successfully');
    
    // Show all available methods
    const methods = Object.getOwnPropertyNames(DataServiceOrchestrator.prototype)
      .filter(name => name !== 'constructor');
    
    console.log(`\n📋 Available Methods (${methods.length}):`);
    methods.forEach((method, index) => {
      console.log(`  ${index + 1}. ${method}`);
    });
    
    // Test basic functionality
    console.log('\n🧪 Testing Basic Functionality:');
    
    // Test cache management
    console.log('  Testing Cache Management...');
    const cacheInfo = await orchestrator.getCacheInfo();
    console.log('    Cache Info:', JSON.stringify(cacheInfo, null, 2));
    
    // Test configuration status
    console.log('  Testing Configuration Status...');
    const config = await orchestrator.getConfigurationStatus();
    console.log('    Configuration:', JSON.stringify(config, null, 2));
    
    // Test performance metrics
    console.log('  Testing Performance Metrics...');
    const performance = await orchestrator.getPerformanceMetrics();
    console.log('    Performance Metrics:', JSON.stringify(performance, null, 2));
    
    // Test new performance analytics
    console.log('  Testing Performance Analytics...');
    const analytics = await orchestrator.getPerformanceAnalytics();
    console.log('    Performance Analytics:', JSON.stringify(analytics, null, 2));
    
    // Test system recommendations
    console.log('  Testing System Recommendations...');
    const recommendations = await orchestrator.getSystemRecommendations();
    console.log('    System Recommendations:', recommendations);
    
    // Test export functionality
    console.log('  Testing Export Functionality...');
    const exported = await orchestrator.exportPerformanceMetrics();
    console.log('    Exported Metrics:', JSON.stringify(exported, null, 2));
    
    // Test cache operations
    console.log('  Testing Cache Operations...');
    await orchestrator.setCachedData('test-key', { test: 'data', timestamp: new Date() }, 60000);
    const cached = await orchestrator.getCachedData('test-key');
    console.log('    Cached Data Retrieved:', cached);
    
    console.log('\n🎉 Enhanced Demo completed successfully!');
    console.log('\n✨ New Features Demonstrated:');
    console.log('  • Performance Monitoring Integration');
    console.log('  • Advanced Performance Analytics');
    console.log('  • System Recommendations Engine');
    console.log('  • Performance Metrics Export');
    console.log('  • Enhanced Cache Management');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the enhanced demo
demonstrateEnhancedOrchestrator();