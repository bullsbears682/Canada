// Tab System
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    initTabs();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize animations
    initAnimations();
});

function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

function initSmoothScrolling() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.overview-card, .feature-item, .doc-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Demo Functions
function runDemo(type) {
    const outputDiv = document.getElementById('demoResults');
    
    // Clear previous output
    outputDiv.innerHTML = '';
    
    // Show loading
    showLoading(outputDiv);
    
    // Simulate API call delay
    setTimeout(() => {
        const result = generateDemoResult(type);
        displayDemoResult(outputDiv, result);
    }, 1500);
}

function showLoading(container) {
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Running ${getDemoTypeName()}...</p>
        </div>
    `;
}

function getDemoTypeName() {
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        return activeTab.textContent;
    }
    return 'Demo';
}

function generateDemoResult(type) {
    const timestamp = new Date().toISOString();
    
    switch(type) {
        case 'health':
            return {
                type: 'Health Check',
                timestamp: timestamp,
                status: 'success',
                data: {
                    systemStatus: 'healthy',
                    healthScore: 94,
                    responseTime: 245,
                    uptime: '99.97%',
                    components: {
                        database: { status: 'healthy', responseTime: 45 },
                        cache: { status: 'healthy', hitRate: 0.87 },
                        api: { status: 'healthy', responseTime: 123 },
                        monitoring: { status: 'healthy', alerts: 0 }
                    },
                    metrics: {
                        requestsPerSecond: 42.7,
                        errorRate: 0.02,
                        cacheHitRate: 0.87,
                        averageResponseTime: 245
                    },
                    alerts: {
                        active: 0,
                        critical: 0,
                        warning: 0,
                        info: 2
                    },
                    recommendations: [
                        'System performing optimally',
                        'Cache hit rate above threshold',
                        'No critical alerts detected',
                        'Consider implementing additional monitoring for database connections'
                    ]
                }
            };
            
        case 'performance':
            return {
                type: 'Performance Analysis',
                timestamp: timestamp,
                status: 'success',
                data: {
                    benchmarkResults: {
                        iterations: 25,
                        successRate: 0.96,
                        averageTime: 234,
                        maxTime: 456,
                        minTime: 123,
                        throughput: 42.7,
                        p95ResponseTime: 389,
                        p99ResponseTime: 456
                    },
                    performanceMetrics: {
                        currentLoad: 67,
                        peakLoad: 89,
                        averageLoad: 45,
                        responseTimeTrend: 'improving',
                        throughputTrend: 'stable',
                        errorRateTrend: 'decreasing'
                    },
                    systemHealth: {
                        overallScore: 91,
                        componentScores: {
                            database: 88,
                            cache: 94,
                            api: 92,
                            monitoring: 95
                        },
                        bottlenecks: [
                            'Database connection pool at 85% capacity',
                            'Cache memory usage at 78%'
                        ]
                    },
                    optimizationOpportunities: [
                        {
                            area: 'Database',
                            impact: 'High',
                            effort: 'Medium',
                            potentialImprovement: '15-20% response time reduction',
                            description: 'Implement connection pooling and query optimization'
                        },
                        {
                            area: 'Cache',
                            impact: 'Medium',
                            effort: 'Low',
                            potentialImprovement: '10-15% cache hit rate improvement',
                            description: 'Optimize cache eviction policies and memory allocation'
                        },
                        {
                            area: 'API',
                            impact: 'Medium',
                            effort: 'Low',
                            potentialImprovement: '5-10% throughput increase',
                            description: 'Implement request batching and compression'
                        }
                    ]
                }
            };
            
        case 'analytics':
            return {
                type: 'Predictive Analytics',
                timestamp: timestamp,
                status: 'success',
                data: {
                    capacityPlanning: {
                        currentUtilization: 67,
                        projectedGrowth: '15% monthly',
                        recommendedScaling: 'Q2 2024',
                        riskLevel: 'low',
                        capacityTrends: {
                            cpu: { current: 67, projected: 78, threshold: 85 },
                            memory: { current: 72, projected: 81, threshold: 90 },
                            storage: { current: 45, projected: 52, threshold: 80 },
                            network: { current: 58, projected: 65, threshold: 85 }
                        }
                    },
                    riskAssessment: {
                        overallRisk: 'minimal',
                        riskScore: 23,
                        riskFactors: [
                            {
                                factor: 'Database Connection Limits',
                                severity: 'medium',
                                probability: 'low',
                                impact: 'medium',
                                description: 'Approaching connection pool limits under peak load',
                                mitigation: 'Implement connection pooling and monitoring'
                            },
                            {
                                factor: 'Memory Usage Trends',
                                severity: 'low',
                                probability: 'medium',
                                impact: 'low',
                                description: 'Gradual increase in memory consumption over time',
                                mitigation: 'Monitor memory allocation and implement garbage collection optimization'
                            }
                        ]
                    },
                    optimizationInsights: [
                        {
                            category: 'Performance',
                            insights: [
                                'Cache hit rate optimization could save 20% in response time',
                                'Database query optimization could reduce latency by 30%',
                                'Implementing CDN could improve static asset delivery by 40%'
                            ],
                            estimatedImpact: '25-35% overall performance improvement',
                            implementationEffort: 'Medium',
                            priority: 'High'
                        },
                        {
                            category: 'Scalability',
                            insights: [
                                'Horizontal scaling could handle 3x current load',
                                'Database sharding could improve write performance by 50%',
                                'Microservices architecture could reduce deployment complexity'
                            ],
                            estimatedImpact: 'Significant scalability improvement',
                            implementationEffort: 'High',
                            priority: 'Medium'
                        }
                    ]
                }
            };
            
        default:
            return {
                type: 'Unknown Demo',
                timestamp: timestamp,
                status: 'error',
                message: 'Unknown demo type'
            };
    }
}

function displayDemoResult(container, result) {
    if (result.status === 'error') {
        container.innerHTML = `
            <div class="error-result">
                <h4>❌ ${result.type} Failed</h4>
                <p>${result.message}</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="demo-result">
            <div class="result-header">
                <h4>✅ ${result.type} Completed Successfully</h4>
                <span class="timestamp">${new Date(result.timestamp).toLocaleString()}</span>
            </div>
            <div class="result-content">
    `;
    
    // Add specific content based on demo type
    if (result.type === 'Health Check') {
        html += generateHealthResultHTML(result.data);
    } else if (result.type === 'Performance Analysis') {
        html += generatePerformanceResultHTML(result.data);
    } else if (result.type === 'Predictive Analytics') {
        html += generateAnalyticsResultHTML(result.data);
    }
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function generateHealthResultHTML(data) {
    return `
        <div class="health-metrics">
            <div class="metric-row">
                <div class="metric">
                    <span class="metric-label">System Status:</span>
                    <span class="metric-value status-${data.systemStatus}">${data.systemStatus}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Health Score:</span>
                    <span class="metric-value">${data.healthScore}/100</span>
                </div>
            </div>
            <div class="metric-row">
                <div class="metric">
                    <span class="metric-label">Response Time:</span>
                    <span class="metric-value">${data.responseTime}ms</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Uptime:</span>
                    <span class="metric-value">${data.uptime}</span>
                </div>
            </div>
            <div class="component-status">
                <h5>Component Status:</h5>
                <div class="component-grid">
                    ${Object.entries(data.components).map(([name, info]) => `
                        <div class="component">
                            <span class="component-name">${name}</span>
                            <span class="component-status status-${info.status}">${info.status}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="recommendations">
                <h5>Recommendations:</h5>
                <ul>
                    ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

function generatePerformanceResultHTML(data) {
    return `
        <div class="performance-metrics">
            <div class="benchmark-results">
                <h5>Benchmark Results:</h5>
                <div class="metric-grid">
                    <div class="metric">
                        <span class="metric-label">Success Rate:</span>
                        <span class="metric-value">${(data.benchmarkResults.successRate * 100).toFixed(1)}%</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Average Time:</span>
                        <span class="metric-value">${data.benchmarkResults.averageTime}ms</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Throughput:</span>
                        <span class="metric-value">${data.benchmarkResults.throughput} req/s</span>
                    </div>
                </div>
            </div>
            <div class="optimization-opportunities">
                <h5>Optimization Opportunities:</h5>
                ${data.optimizationOpportunities.map(opp => `
                    <div class="opportunity">
                        <div class="opp-header">
                            <span class="opp-area">${opp.area}</span>
                            <span class="opp-impact impact-${opp.impact.toLowerCase()}">${opp.impact}</span>
                        </div>
                        <p class="opp-description">${opp.description}</p>
                        <span class="opp-improvement">${opp.potentialImprovement}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateAnalyticsResultHTML(data) {
    return `
        <div class="analytics-insights">
            <div class="capacity-planning">
                <h5>Capacity Planning:</h5>
                <div class="capacity-metrics">
                    <div class="metric">
                        <span class="metric-label">Current Utilization:</span>
                        <span class="metric-value">${data.capacityPlanning.currentUtilization}%</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Projected Growth:</span>
                        <span class="metric-value">${data.capacityPlanning.projectedGrowth}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Recommended Scaling:</span>
                        <span class="metric-value">${data.capacityPlanning.recommendedScaling}</span>
                    </div>
                </div>
            </div>
            <div class="risk-assessment">
                <h5>Risk Assessment:</h5>
                <div class="risk-summary">
                    <span class="risk-level risk-${data.riskAssessment.overallRisk}">${data.riskAssessment.overallRisk}</span>
                    <span class="risk-score">Risk Score: ${data.riskAssessment.riskScore}/100</span>
                </div>
            </div>
            <div class="optimization-insights">
                <h5>Key Insights:</h5>
                ${data.optimizationInsights.map(insight => `
                    <div class="insight">
                        <h6>${insight.category}</h6>
                        <ul>
                            ${insight.insights.map(i => `<li>${i}</li>`).join('')}
                        </ul>
                        <div class="insight-impact">
                            <span class="impact">${insight.estimatedImpact}</span>
                            <span class="effort">Effort: ${insight.implementationEffort}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Utility function for scrolling to sections
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add some CSS for the demo results
const style = document.createElement('style');
style.textContent = `
    .loading {
        text-align: center;
        padding: 40px;
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid #ffd700;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .demo-result {
        color: white;
    }
    
    .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .timestamp {
        font-size: 0.9rem;
        opacity: 0.7;
    }
    
    .metric-row {
        display: flex;
        gap: 30px;
        margin-bottom: 20px;
    }
    
    .metric {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .metric-label {
        font-size: 0.9rem;
        opacity: 0.7;
    }
    
    .metric-value {
        font-size: 1.1rem;
        font-weight: 600;
        color: #ffd700;
    }
    
    .status-healthy {
        color: #4ade80;
    }
    
    .status-warning {
        color: #fbbf24;
    }
    
    .status-critical {
        color: #f87171;
    }
    
    .component-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
        margin: 15px 0;
    }
    
    .component {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
    }
    
    .recommendations ul {
        list-style: none;
        padding: 0;
    }
    
    .recommendations li {
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .recommendations li:last-child {
        border-bottom: none;
    }
    
    .metric-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 15px;
        margin: 15px 0;
    }
    
    .opportunity {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 15px;
        margin: 15px 0;
    }
    
    .opp-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .opp-area {
        font-weight: 600;
        color: #ffd700;
    }
    
    .opp-impact {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .impact-high {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
    }
    
    .impact-medium {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
    }
    
    .impact-low {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
    }
    
    .opp-description {
        margin-bottom: 10px;
        opacity: 0.9;
    }
    
    .opp-improvement {
        font-size: 0.9rem;
        color: #ffd700;
        font-weight: 600;
    }
    
    .capacity-metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
        margin: 15px 0;
    }
    
    .risk-summary {
        display: flex;
        gap: 20px;
        align-items: center;
        margin: 15px 0;
    }
    
    .risk-level {
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        text-transform: capitalize;
    }
    
    .risk-minimal {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
    }
    
    .risk-low {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
    }
    
    .risk-medium {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
    }
    
    .risk-high {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
    }
    
    .insight {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 15px;
        margin: 15px 0;
    }
    
    .insight h6 {
        color: #ffd700;
        margin-bottom: 10px;
    }
    
    .insight ul {
        list-style: none;
        padding: 0;
        margin-bottom: 15px;
    }
    
    .insight li {
        padding: 5px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .insight li:last-child {
        border-bottom: none;
    }
    
    .insight-impact {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .impact {
        color: #ffd700;
        font-weight: 600;
    }
    
    .effort {
        font-size: 0.9rem;
        opacity: 0.8;
    }
    
    .error-result {
        text-align: center;
        color: #f87171;
        padding: 40px;
    }
`;
document.head.appendChild(style);