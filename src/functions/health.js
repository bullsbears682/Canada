exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Simulate enterprise health monitoring
        const healthData = {
            timestamp: new Date().toISOString(),
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
        };

        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                message: 'System health check completed successfully',
                data: healthData
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: false,
                message: 'Health check failed',
                error: error.message
            })
        };
    }
};