import { DataSource, HealthStatus, Province } from '../types';
export declare class ESDCDataSource implements DataSource {
    readonly name = "Employment and Social Development Canada";
    readonly baseUrl = "https://api.esdc-edsc.gc.ca";
    readonly apiKey: string;
    private lastUpdate;
    constructor(apiKey: string);
    healthCheck(): Promise<HealthStatus>;
    getLastUpdate(): Promise<Date>;
    getEmploymentStatistics(params?: {
        province?: Province;
        region?: string;
        industry?: string;
        period?: string;
    }): Promise<any>;
    getLabourMarketData(params?: {
        province?: Province;
        region?: string;
        occupation?: string;
        period?: string;
    }): Promise<any>;
    getSocialPrograms(params?: {
        province?: Province;
        category?: string;
        eligibility?: string;
    }): Promise<any>;
    getBenefitsInformation(params?: {
        province?: Province;
        benefitType?: string;
        category?: string;
    }): Promise<any>;
    getTrainingPrograms(params?: {
        province?: Province;
        region?: string;
        field?: string;
        funding?: string;
    }): Promise<any>;
    getWorkplaceStandards(params?: {
        province?: Province;
        standardType?: string;
        industry?: string;
    }): Promise<any>;
    getEconomicIndicators(params?: {
        province?: Province;
        indicator?: string;
        period?: string;
    }): Promise<any>;
    getRegionalData(params?: {
        province?: Province;
        region?: string;
        dataType?: string;
    }): Promise<any>;
    private makeRequest;
    private transformEmploymentStatisticsResponse;
    private transformLabourMarketResponse;
    private transformSocialProgramsResponse;
    private transformBenefitsResponse;
    private transformTrainingProgramsResponse;
    private transformWorkplaceStandardsResponse;
    private transformEconomicIndicatorsResponse;
    private transformRegionalDataResponse;
    private calculateDataQuality;
}
//# sourceMappingURL=ESDCDataSource.d.ts.map