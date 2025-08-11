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
            <i class="fas fa-spinner fa-spin"></i>
            <p>Running ${getDemoTitle()}...</p>
        </div>
    `;
}

function getDemoTitle() {
    const titles = {
        'monitoring': 'Monitoring & Alerting Demo',
        'performance': 'Performance Intelligence Demo',
        'analytics': 'Predictive Analytics Demo',
        'report': 'System Report Generation Demo'
    };
    return titles[event.target.textContent.trim().toLowerCase().includes('monitoring') ? 'monitoring' : 
                  event.target.textContent.trim().toLowerCase().includes('performance') ? 'performance' :
                  event.target.textContent.trim().toLowerCase().includes('analytics') ? 'analytics' : 'report'];
}

function generateDemoResult(type) {
    const demos = {
        monitoring: {
            title: '🔍 Monitoring & Alerting Demo Results',
            status: 'success',
            data: {
                systemStatus: 'healthy',
                healthScore: 94,
                responseTime: 245,
                cacheHitRate: 0.87,
                activeAlerts: 0,
                lastCheck: new Date().toLocaleTimeString(),
                recommendations: [
                    'System performing optimally',
                    'Cache hit rate above threshold',
                    'No critical alerts detected'
                ]
            }
        },
        performance: {
            title: '⚡ Performance Intelligence Demo Results',
            status: 'success',
            data: {
                benchmarkResults: {
                    iterations: 25,
                    successRate: 0.96,
                    averageTime: 234,
                    maxTime: 456,
                    minTime: 123,
                    throughput: 42.7
                },
                healthScore: 91,
                performanceTrend: 'improving',
                optimizationOpportunities: [
                    'Cache optimization could improve response times by 15%',
                    'Database connection pooling recommended',
                    'Consider implementing CDN for static assets'
                ]
            }
        },
        analytics: {
            title: '🧠 Predictive Analytics Demo Results',
            status: 'success',
            data: {
                capacityPlanning: {
                    currentUtilization: 67,
                    projectedGrowth: '15% monthly',
                    recommendedScaling: 'Q2 2024',
                    riskLevel: 'low'
                },
                riskAssessment: {
                    overallRisk: 'minimal',
                    identifiedRisks: [
                        'Database connection limits approaching threshold',
                        'Memory usage trending upward',
                        'Network latency variations detected'
                    ],
                    mitigationStrategies: [
                        'Implement connection pooling',
                        'Monitor memory allocation',
                        'Add network redundancy'
                    ]
                },
                optimizationInsights: [
                    'Cache hit rate optimization could save 20% in response time',
                    'Batch processing could improve throughput by 35%',
                    'Database indexing could reduce query time by 40%'
                ]
            }
        },
        report: {
            title: '📊 System Report Generation Demo Results',
            status: 'success',
            data: {
                executiveSummary: 'System operating at optimal performance with 94% health score. All critical metrics within acceptable ranges with proactive monitoring preventing potential issues.',
                keyMetrics: [
                    { metric: 'System Health Score', value: '94%', status: 'excellent' },
                    { metric: 'Average Response Time', value: '245ms', status: 'optimal' },
                    { metric: 'Cache Hit Rate', value: '87%', status: 'good' },
                    { metric: 'Uptime', value: '99.97%', status: 'excellent' },
                    { metric: 'Active Alerts', value: '0', status: 'optimal' }
                ],
                recommendations: {
                    immediate: [
                        'Continue current monitoring protocols',
                        'Maintain cache optimization strategies'
                    ],
                    shortTerm: [
                        'Implement suggested database optimizations',
                        'Consider network redundancy improvements'
                    ],
                    longTerm: [
                        'Plan for Q2 2024 scaling requirements',
                        'Evaluate AI-powered anomaly detection'
                    ]
                },
                generatedAt: new Date().toLocaleString()
            }
        }
    };
    
    return demos[type] || demos.monitoring;
}

function displayDemoResult(container, result) {
    const statusIcon = result.status === 'success' ? '✅' : '⚠️';
    const statusClass = result.status === 'success' ? 'success' : 'warning';
    
    let html = `
        <div class="demo-result ${statusClass}">
            <div class="result-header">
                <h4>${statusIcon} ${result.title}</h4>
                <span class="status-badge ${statusClass}">${result.status}</span>
            </div>
            <div class="result-content">
    `;
    
    // Generate content based on demo type
    if (result.data.systemStatus) {
        // Monitoring demo
        html += generateMonitoringContent(result.data);
    } else if (result.data.benchmarkResults) {
        // Performance demo
        html += generatePerformanceContent(result.data);
    } else if (result.data.capacityPlanning) {
        // Analytics demo
        html += generateAnalyticsContent(result.data);
    } else if (result.data.executiveSummary) {
        // Report demo
        html += generateReportContent(result.data);
    }
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function generateMonitoringContent(data) {
    return `
        <div class="metric-grid">
            <div class="metric-item">
                <span class="metric-label">System Status</span>
                <span class="metric-value status-${data.systemStatus}">${data.systemStatus}</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Health Score</span>
                <span class="metric-value">${data.healthScore}%</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Response Time</span>
                <span class="metric-value">${data.responseTime}ms</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Cache Hit Rate</span>
                <span class="metric-value">${(data.cacheHitRate * 100).toFixed(1)}%</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Active Alerts</span>
                <span class="metric-value">${data.activeAlerts}</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Last Check</span>
                <span class="metric-value">${data.lastCheck}</span>
            </div>
        </div>
        <div class="recommendations">
            <h5>Recommendations:</h5>
            <ul>
                ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    `;
}

function generatePerformanceContent(data) {
    return `
        <div class="benchmark-results">
            <h5>Benchmark Results:</h5>
            <div class="metric-grid">
                <div class="metric-item">
                    <span class="metric-label">Iterations</span>
                    <span class="metric-value">${data.benchmarkResults.iterations}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Success Rate</span>
                    <span class="metric-value">${(data.benchmarkResults.successRate * 100).toFixed(1)}%</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Average Time</span>
                    <span class="metric-value">${data.benchmarkResults.averageTime}ms</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Throughput</span>
                    <span class="metric-value">${data.benchmarkResults.throughput} req/s</span>
                </div>
            </div>
        </div>
        <div class="optimization-opportunities">
            <h5>Optimization Opportunities:</h5>
            <ul>
                ${data.optimizationOpportunities.map(opp => `<li>${opp}</li>`).join('')}
            </ul>
        </div>
    `;
}

function generateAnalyticsContent(data) {
    return `
        <div class="capacity-planning">
            <h5>Capacity Planning:</h5>
            <div class="metric-grid">
                <div class="metric-item">
                    <span class="metric-label">Current Utilization</span>
                    <span class="metric-value">${data.capacityPlanning.currentUtilization}%</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Projected Growth</span>
                    <span class="metric-value">${data.capacityPlanning.projectedGrowth}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Risk Level</span>
                    <span class="metric-value status-${data.capacityPlanning.riskLevel}">${data.capacityPlanning.riskLevel}</span>
                </div>
            </div>
        </div>
        <div class="optimization-insights">
            <h5>Optimization Insights:</h5>
            <ul>
                ${data.optimizationInsights.map(insight => `<li>${insight}</li>`).join('')}
            </ul>
        </div>
    `;
}

function generateReportContent(data) {
    return `
        <div class="executive-summary">
            <h5>Executive Summary:</h5>
            <p>${data.executiveSummary}</p>
        </div>
        <div class="key-metrics">
            <h5>Key Metrics:</h5>
            <div class="metric-grid">
                ${data.keyMetrics.map(metric => `
                    <div class="metric-item">
                        <span class="metric-label">${metric.metric}</span>
                        <span class="metric-value status-${metric.status}">${metric.value}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="recommendations">
            <h5>Recommendations:</h5>
            <div class="rec-categories">
                <div class="rec-category">
                    <h6>Immediate (0-30 days):</h6>
                    <ul>
                        ${data.recommendations.immediate.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                <div class="rec-category">
                    <h6>Short Term (1-3 months):</h6>
                    <ul>
                        ${data.recommendations.shortTerm.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                <div class="rec-category">
                    <h6>Long Term (3-12 months):</h6>
                    <ul>
                        ${data.recommendations.longTerm.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
        <div class="report-footer">
            <small>Report generated at: ${data.generatedAt}</small>
        </div>
    `;
}

function clearOutput() {
    const outputDiv = document.getElementById('demoResults');
    outputDiv.innerHTML = `
        <div class="output-placeholder">
            <i class="fas fa-play-circle"></i>
            <p>Click a demo button above to see the enterprise features in action</p>
        </div>
    `;
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add CSS for demo results
const demoStyles = `
    <style>
        .demo-result {
            background: white;
            border-radius: 15px;
            padding: 25px;
            border: 1px solid #e9ecef;
        }
        
        .result-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e9ecef;
        }
        
        .result-header h4 {
            margin: 0;
            color: #333;
            font-size: 1.1rem;
        }
        
        .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-badge.success {
            background: #d4edda;
            color: #155724;
        }
        
        .status-badge.warning {
            background: #fff3cd;
            color: #856404;
        }
        
        .metric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .metric-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            border: 1px solid #e9ecef;
        }
        
        .metric-label {
            display: block;
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .metric-value {
            display: block;
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
        }
        
        .status-healthy { color: #28a745; }
        .status-warning { color: #ffc107; }
        .status-critical { color: #dc3545; }
        .status-excellent { color: #28a745; }
        .status-good { color: #17a2b8; }
        .status-optimal { color: #28a745; }
        .status-minimal { color: #28a745; }
        .status-low { color: #28a745; }
        
        .recommendations h5,
        .optimization-opportunities h5,
        .capacity-planning h5,
        .optimization-insights h5,
        .executive-summary h5,
        .key-metrics h5,
        .recommendations h5 {
            color: #333;
            margin-bottom: 15px;
            font-size: 1rem;
        }
        
        .recommendations ul,
        .optimization-opportunities ul,
        .optimization-insights ul {
            margin: 0;
            padding-left: 20px;
        }
        
        .recommendations li,
        .optimization-opportunities li,
        .optimization-insights li {
            margin-bottom: 8px;
            color: #555;
        }
        
        .rec-categories {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .rec-category h6 {
            color: #333;
            margin-bottom: 10px;
            font-size: 0.9rem;
            font-weight: 600;
        }
        
        .rec-category ul {
            margin: 0;
            padding-left: 20px;
        }
        
        .rec-category li {
            margin-bottom: 5px;
            color: #555;
            font-size: 0.9rem;
        }
        
        .report-footer {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e9ecef;
            text-align: center;
            color: #999;
        }
        
        .loading {
            text-align: center;
            color: #666;
            padding: 40px 20px;
        }
        
        .loading i {
            font-size: 2rem;
            color: #667eea;
            margin-bottom: 15px;
            display: block;
        }
        
        .benchmark-results,
        .capacity-planning {
            margin-bottom: 20px;
        }
    </style>
`;

// Inject demo styles
document.head.insertAdjacentHTML('beforeend', demoStyles);