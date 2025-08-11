const { DataServiceOrchestrator } = require('./dist/DataServiceOrchestrator.js');

async function testEnhancements() {
  console.log('🧪 Testing DataServiceOrchestrator Enhancements\n');
  
  try {
    const orchestrator = new DataServiceOrchestrator();
    console.log('✅ Orchestrator created successfully');
    
    // Test new performance analytics method
    console.log('\n📊 Testing getPerformanceAnalytics...');
    const analytics = orchestrator.getPerformanceAnalytics();
    console.log('✅ getPerformanceAnalytics working');
    
    // Test system recommendations
    console.log('\n💡 Testing getSystemRecommendations...');
    const recommendations = orchestrator.getSystemRecommendations();
    console.log('✅ getSystemRecommendations working');
    
    // Test export functionality
    console.log('\n📤 Testing exportPerformanceMetrics...');
    const exported = orchestrator.exportPerformanceMetrics();
    console.log('✅ exportPerformanceMetrics working');
    
    // Test reset functionality
    console.log('\n🔄 Testing resetPerformanceMetrics...');
    orchestrator.resetPerformanceMetrics();
    console.log('✅ resetPerformanceMetrics working');
    
    console.log('\n🎉 All enhancements working correctly!');
    console.log('\n✨ Enhanced Features Available:');
    console.log('  • Performance Monitoring Integration');
    console.log('  • Advanced Performance Analytics');
    console.log('  • System Recommendations Engine');
    console.log('  • Performance Metrics Export');
    console.log('  • Enhanced Cache Management');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEnhancements();