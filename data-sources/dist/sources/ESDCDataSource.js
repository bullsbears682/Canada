"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESDCDataSource = void 0;
class ESDCDataSource {
    constructor(apiKey) {
        this.name = 'Employment and Social Development Canada';
        this.baseUrl = 'https://api.esdc-edsc.gc.ca';
        this.lastUpdate = new Date(0);
        this.apiKey = apiKey;
    }
    async healthCheck() {
        try {
            await this.makeRequest('/health');
            return {
                status: 'healthy',
                responseTime: Date.now(),
                lastChecked: new Date(),
                errors: [],
                dataQuality: await this.calculateDataQuality({})
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                responseTime: Date.now(),
                lastChecked: new Date(),
                errors: [error.message || 'Unknown error'],
                dataQuality: await this.calculateDataQuality({})
            };
        }
    }
    async getLastUpdate() {
        return this.lastUpdate;
    }
    async getEmploymentStatistics(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.province)
                queryParams.append('province', params.province);
            if (params.region)
                queryParams.append('region', params.region);
            if (params.industry)
                queryParams.append('industry', params.industry);
            if (params.period)
                queryParams.append('period', params.period);
            const response = await this.makeRequest(`/employment/statistics?${queryParams}`);
            this.lastUpdate = new Date();
            return this.transformEmploymentStatisticsResponse(response);
        }
        catch (error) {
            throw new Error(`Failed to fetch employment statistics: ${error.message || 'Unknown error'}`);
        }
    }
    async getLabourMarketData(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.province)
                queryParams.append('province', params.province);
            if (params.region)
                queryParams.append('region', params.region);
            if (params.occupation)
                queryParams.append('occupation', params.occupation);
            if (params.period)
                queryParams.append('period', params.period);
            const response = await this.makeRequest(`/labour/market?${queryParams}`);
            this.lastUpdate = new Date();
            return this.transformLabourMarketResponse(response);
        }
        catch (error) {
            throw new Error(`Failed to fetch labour market data: ${error.message || 'Unknown error'}`);
        }
    }
    async getSocialPrograms(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.province)
                queryParams.append('province', params.province);
            if (params.category)
                queryParams.append('category', params.category);
            if (params.eligibility)
                queryParams.append('eligibility', params.eligibility);
            const response = await this.makeRequest(`/social/programs?${queryParams}`);
            this.lastUpdate = new Date();
            return this.transformSocialProgramsResponse(response);
        }
        catch (error) {
            throw new Error(`Failed to fetch social programs: ${error.message || 'Unknown error'}`);
        }
    }
    async getBenefitsInformation(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.province)
                queryParams.append('province', params.province);
            if (params.benefitType)
                queryParams.append('benefitType', params.benefitType);
            if (params.category)
                queryParams.append('category', params.category);
            const response = await this.makeRequest(`/benefits/information?${queryParams}`);
            this.lastUpdate = new Date();
            return this.transformBenefitsResponse(response);
        }
        catch (error) {
            throw new Error(`Failed to fetch benefits information: ${error.message || 'Unknown error'}`);
        }
    }
    async getTrainingPrograms(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.province)
                queryParams.append('province', params.province);
            if (params.region)
                queryParams.append('region', params.region);
            if (params.field)
                queryParams.append('field', params.field);
            if (params.funding)
                queryParams.append('funding', params.funding);
            const response = await this.makeRequest(`/training/programs?${queryParams}`);
            this.lastUpdate = new Date();
            return this.transformTrainingProgramsResponse(response);
        }
        catch (error) {
            throw new Error(`Failed to fetch training programs: ${error.message || 'Unknown error'}`);
        }
    }
    async getWorkplaceStandards(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.province)
                queryParams.append('province', params.province);
            if (params.standardType)
                queryParams.append('standardType', params.standardType);
            if (params.industry)
                queryParams.append('industry', params.industry);
            const response = await this.makeRequest(`/workplace/standards?${queryParams}`);
            this.lastUpdate = new Date();
            return this.transformWorkplaceStandardsResponse(response);
        }
        catch (error) {
            throw new Error(`Failed to fetch workplace standards: ${error.message || 'Unknown error'}`);
        }
    }
    async getEconomicIndicators(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.province)
                queryParams.append('province', params.province);
            if (params.indicator)
                queryParams.append('indicator', params.indicator);
            if (params.period)
                queryParams.append('period', params.period);
            const response = await this.makeRequest(`/economic/indicators?${queryParams}`);
            this.lastUpdate = new Date();
            return this.transformEconomicIndicatorsResponse(response);
        }
        catch (error) {
            throw new Error(`Failed to fetch economic indicators: ${error.message || 'Unknown error'}`);
        }
    }
    async getRegionalData(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.province)
                queryParams.append('province', params.province);
            if (params.region)
                queryParams.append('region', params.region);
            if (params.dataType)
                queryParams.append('dataType', params.dataType);
            const response = await this.makeRequest(`/regional/data?${queryParams}`);
            this.lastUpdate = new Date();
            return this.transformRegionalDataResponse(response);
        }
        catch (error) {
            throw new Error(`Failed to fetch regional data: ${error.message || 'Unknown error'}`);
        }
    }
    async makeRequest(endpoint) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`ESDC API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        // Check for API errors in response
        if (data.error) {
            throw new Error(`ESDC API error: ${data.error.message || data.error}`);
        }
        return data;
    }
    transformEmploymentStatisticsResponse(data) {
        return {
            totalEmployment: data.totalEmployment || 0,
            unemploymentRate: data.unemploymentRate || 0,
            participationRate: data.participationRate || 0,
            employmentRate: data.employmentRate || 0,
            fullTimeEmployment: data.fullTimeEmployment || 0,
            partTimeEmployment: data.partTimeEmployment || 0,
            selfEmployed: data.selfEmployed || 0,
            employees: data.employees || 0,
            period: data.period || 'monthly',
            region: data.region || 'national',
            province: data.province || null,
            industry: data.industry || null,
            lastUpdated: new Date(data.lastUpdated || Date.now()),
            source: 'ESDC',
            dataQuality: this.calculateDataQuality(data)
        };
    }
    transformLabourMarketResponse(data) {
        return {
            jobVacancies: data.jobVacancies || 0,
            jobOpenings: data.jobOpenings || 0,
            averageWage: data.averageWage || 0,
            medianWage: data.medianWage || 0,
            topOccupations: data.topOccupations || [],
            growingSectors: data.growingSectors || [],
            decliningSectors: data.decliningSectors || [],
            period: data.period || 'monthly',
            region: data.region || 'national',
            province: data.province || null,
            occupation: data.occupation || null,
            lastUpdated: new Date(data.lastUpdated || Date.now()),
            source: 'ESDC',
            dataQuality: this.calculateDataQuality(data)
        };
    }
    transformSocialProgramsResponse(data) {
        return {
            programs: data.programs?.map((program) => ({
                name: program.name || '',
                description: program.description || '',
                category: program.category || '',
                eligibility: program.eligibility || '',
                benefits: program.benefits || [],
                applicationProcess: program.applicationProcess || '',
                contactInfo: program.contactInfo || {},
                province: program.province || null,
                lastUpdated: new Date(program.lastUpdated || Date.now())
            })) || [],
            totalPrograms: data.totalPrograms || 0,
            categories: data.categories || [],
            province: data.province || null,
            category: data.category || null,
            lastUpdated: new Date(data.lastUpdated || Date.now()),
            source: 'ESDC',
            dataQuality: this.calculateDataQuality(data)
        };
    }
    transformBenefitsResponse(data) {
        return {
            benefits: data.benefits?.map((benefit) => ({
                name: benefit.name || '',
                type: benefit.type || '',
                category: benefit.category || '',
                description: benefit.description || '',
                eligibility: benefit.eligibility || '',
                amount: benefit.amount || 0,
                frequency: benefit.frequency || 'monthly',
                applicationProcess: benefit.applicationProcess || '',
                contactInfo: benefit.contactInfo || {},
                province: benefit.province || null,
                lastUpdated: new Date(benefit.lastUpdated || Date.now())
            })) || [],
            totalBenefits: data.totalBenefits || 0,
            categories: data.categories || [],
            province: data.province || null,
            benefitType: data.benefitType || null,
            lastUpdated: new Date(data.lastUpdated || Date.now()),
            source: 'ESDC',
            dataQuality: this.calculateDataQuality(data)
        };
    }
    transformTrainingProgramsResponse(data) {
        return {
            programs: data.programs?.map((program) => ({
                name: program.name || '',
                description: program.description || '',
                field: program.field || '',
                duration: program.duration || '',
                cost: program.cost || 0,
                funding: program.funding || '',
                eligibility: program.eligibility || '',
                location: program.location || '',
                provider: program.provider || '',
                contactInfo: program.contactInfo || {},
                province: program.province || null,
                region: program.region || null,
                lastUpdated: new Date(program.lastUpdated || Date.now())
            })) || [],
            totalPrograms: data.totalPrograms || 0,
            fields: data.fields || [],
            fundingTypes: data.fundingTypes || [],
            province: data.province || null,
            region: data.region || null,
            lastUpdated: new Date(data.lastUpdated || Date.now()),
            source: 'ESDC',
            dataQuality: this.calculateDataQuality(data)
        };
    }
    transformWorkplaceStandardsResponse(data) {
        return {
            standards: data.standards?.map((standard) => ({
                name: standard.name || '',
                type: standard.type || '',
                description: standard.description || '',
                requirements: standard.requirements || [],
                industry: standard.industry || '',
                jurisdiction: standard.jurisdiction || '',
                effectiveDate: standard.effectiveDate || '',
                lastUpdated: standard.lastUpdated || '',
                contactInfo: standard.contactInfo || {},
                province: standard.province || null
            })) || [],
            totalStandards: data.totalStandards || 0,
            types: data.types || [],
            industries: data.industries || [],
            province: data.province || null,
            standardType: data.standardType || null,
            lastUpdated: new Date(data.lastUpdated || Date.now()),
            source: 'ESDC',
            dataQuality: this.calculateDataQuality(data)
        };
    }
    transformEconomicIndicatorsResponse(data) {
        return {
            indicators: data.indicators?.map((indicator) => ({
                name: indicator.name || '',
                value: indicator.value || 0,
                unit: indicator.unit || '',
                change: indicator.change || 0,
                changePercent: indicator.changePercent || 0,
                period: indicator.period || '',
                trend: indicator.trend || 'stable',
                lastUpdated: new Date(indicator.lastUpdated || Date.now())
            })) || [],
            totalIndicators: data.totalIndicators || 0,
            period: data.period || 'monthly',
            province: data.province || null,
            indicator: data.indicator || null,
            lastUpdated: new Date(data.lastUpdated || Date.now()),
            source: 'ESDC',
            dataQuality: this.calculateDataQuality(data)
        };
    }
    transformRegionalDataResponse(data) {
        return {
            regions: data.regions?.map((region) => ({
                name: region.name || '',
                province: region.province || null,
                population: region.population || 0,
                employment: region.employment || 0,
                unemploymentRate: region.unemploymentRate || 0,
                averageIncome: region.averageIncome || 0,
                economicSectors: region.economicSectors || [],
                lastUpdated: new Date(region.lastUpdated || Date.now())
            })) || [],
            totalRegions: data.totalRegions || 0,
            province: data.province || null,
            region: data.region || null,
            dataType: data.dataType || null,
            lastUpdated: new Date(data.lastUpdated || Date.now()),
            source: 'ESDC',
            dataQuality: this.calculateDataQuality(data)
        };
    }
    async calculateDataQuality(data) {
        const completeness = data ? 0.9 : 0.0;
        const accuracy = data ? 0.85 : 0.0;
        const freshness = data ? 0.8 : 0.0;
        const consistency = data ? 0.9 : 0.0;
        const reliability = data ? 0.85 : 0.0;
        return {
            completeness,
            accuracy,
            freshness,
            consistency,
            reliability
        };
    }
}
exports.ESDCDataSource = ESDCDataSource;
//# sourceMappingURL=ESDCDataSource.js.map