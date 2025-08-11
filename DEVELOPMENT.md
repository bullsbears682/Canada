# 🚀 Development Guidelines

## **Tech Stack & Architecture**

### **Frontend**
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Headless UI
- **State Management**: Zustand (lightweight, fast)
- **Build Tool**: Vite (fast development, optimized builds)
- **Testing**: Vitest + Testing Library

### **Backend**
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js + Express-async-errors
- **Database**: PostgreSQL (primary) + Redis (caching)
- **ORM**: Prisma (type-safe database access)
- **API**: RESTful with OpenAPI documentation

### **Infrastructure**
- **Hosting**: AWS (EC2, RDS, ElastiCache)
- **CDN**: CloudFront for global performance
- **Monitoring**: DataDog + Sentry
- **CI/CD**: GitHub Actions
- **Containerization**: Docker + Docker Compose

## **Code Standards**

### **TypeScript Configuration**
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "exactOptionalPropertyTypes": true,
  "noUncheckedIndexedAccess": true
}
```

### **Naming Conventions**
- **Files**: kebab-case (`housing-affordability.ts`)
- **Functions**: camelCase (`calculateHousingCost`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_LOAN_AMOUNT`)
- **Interfaces**: PascalCase (`HousingData`)
- **Types**: PascalCase with suffix (`PostalCodeData`)

### **Code Organization**
```
src/
├── components/          # Reusable UI components
├── pages/              # Page-level components
├── hooks/              # Custom React hooks
├── services/           # API and external service calls
├── utils/              # Helper functions and utilities
├── types/              # TypeScript type definitions
├── constants/          # Application constants
└── styles/             # Global styles and CSS
```

## **Data Source Standards**

### **Primary Data Sources**
1. **Statistics Canada** - Official government statistics
2. **CMHC** - Housing market data and mortgage information
3. **Bank of Canada** - Interest rates and economic indicators
4. **Provincial Regulators** - Utility rates and regulations
5. **Municipal Governments** - Local property tax and zoning data

### **Data Validation Rules**
- **Source verification**: Only official government sources
- **Freshness check**: Data must be <30 days old
- **Accuracy verification**: Cross-reference multiple sources
- **Error handling**: Graceful degradation when data unavailable
- **Audit trail**: Track all data sources and update times

### **API Integration Standards**
```typescript
interface DataSource {
  name: string;
  url: string;
  updateFrequency: 'daily' | 'weekly' | 'monthly';
  lastUpdated: Date;
  reliability: number; // 0-1 score
  fallback?: DataSource;
}
```

## **Testing Strategy**

### **Test Pyramid**
- **Unit Tests**: 70% - Business logic and utilities
- **Integration Tests**: 20% - API endpoints and database
- **E2E Tests**: 10% - Critical user journeys

### **Testing Standards**
```typescript
// Example test structure
describe('Housing Affordability Calculator', () => {
  describe('calculateMonthlyPayment', () => {
    it('should calculate correct payment for standard mortgage', () => {
      const result = calculateMonthlyPayment({
        principal: 500000,
        rate: 0.05,
        term: 25
      });
      expect(result).toBeCloseTo(2920.95, 2);
    });

    it('should handle edge cases gracefully', () => {
      expect(() => calculateMonthlyPayment({
        principal: 0,
        rate: 0.05,
        term: 25
      })).toThrow('Principal must be greater than 0');
    });
  });
});
```

### **Test Coverage Requirements**
- **Business logic**: 100% coverage
- **API endpoints**: 100% coverage
- **Utility functions**: 100% coverage
- **UI components**: 90% coverage
- **Overall project**: 95% coverage

## **Performance Standards**

### **Frontend Performance**
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **First Input Delay**: <100ms
- **Bundle size**: <500KB gzipped

### **Backend Performance**
- **API response time**: <200ms (95th percentile)
- **Database queries**: <50ms (95th percentile)
- **Cache hit ratio**: >90%
- **Uptime**: 99.9%

### **Performance Monitoring**
```typescript
// Performance tracking middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    metrics.recordApiCall(req.path, res.statusCode, duration);
  });
  next();
});
```

## **Security Standards**

### **Data Protection**
- **PII handling**: Minimal collection, encrypted storage
- **API security**: Rate limiting, authentication, CORS
- **Database security**: Connection encryption, parameterized queries
- **Input validation**: Sanitize all user inputs

### **Authentication & Authorization**
- **JWT tokens** with short expiration
- **Role-based access control** for admin features
- **OAuth 2.0** for government data access
- **API key rotation** for external services

## **Deployment & DevOps**

### **Environment Strategy**
- **Development**: Local development with Docker
- **Staging**: Production-like environment for testing
- **Production**: AWS with auto-scaling

### **Deployment Process**
1. **Code review** and approval
2. **Automated testing** (unit, integration, E2E)
3. **Security scan** and vulnerability check
4. **Staging deployment** and smoke tests
5. **Production deployment** with blue-green strategy
6. **Health checks** and monitoring

### **Monitoring & Alerting**
```typescript
// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await checkDatabase();
    await checkExternalApis();
    res.json({ status: 'healthy', timestamp: new Date() });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});
```

## **Documentation Standards**

### **Code Documentation**
- **JSDoc** for all public functions
- **README** for each major component
- **API documentation** with OpenAPI/Swagger
- **Architecture decisions** in ADR format

### **Example Documentation**
```typescript
/**
 * Calculates the maximum affordable mortgage amount based on income and expenses
 * @param annualIncome - Gross annual income in CAD
 * @param monthlyExpenses - Total monthly expenses excluding housing
 * @param downPayment - Available down payment amount
 * @param interestRate - Annual interest rate (e.g., 0.05 for 5%)
 * @returns Maximum affordable mortgage amount
 * @example
 * const maxMortgage = calculateMaxMortgage(80000, 1500, 50000, 0.05);
 * // Returns: 350000
 */
export function calculateMaxMortgage(
  annualIncome: number,
  monthlyExpenses: number,
  downPayment: number,
  interestRate: number
): number {
  // Implementation details...
}
```

## **Code Review Process**

### **Review Checklist**
- [ ] **Functionality**: Does it solve the intended problem?
- [ ] **Code quality**: Is it readable and maintainable?
- [ ] **Testing**: Are there adequate tests?
- [ ] **Performance**: Does it meet performance standards?
- [ ] **Security**: Are there any security concerns?
- [ ] **Documentation**: Is it properly documented?
- [ ] **Accessibility**: Does it meet WCAG standards?

### **Review Guidelines**
- **Constructive feedback** - Focus on improvement, not criticism
- **Learning opportunity** - Explain why changes are needed
- **Timely responses** - Review within 24 hours
- **Approval required** - At least one approval before merge

## **Continuous Improvement**

### **Regular Reviews**
- **Weekly**: Code quality and performance metrics
- **Monthly**: Architecture and technical debt review
- **Quarterly**: Technology stack evaluation
- **Annually**: Strategic technical direction

### **Feedback Loops**
- **User feedback** → Feature improvements
- **Performance data** → Optimization opportunities
- **Security incidents** → Process improvements
- **Team feedback** → Development process refinement

---

**Remember: We're building tools that Canadians depend on for critical financial decisions. Every line of code matters, every decision impacts real people, and every improvement helps build a better Canada.** 🇨🇦