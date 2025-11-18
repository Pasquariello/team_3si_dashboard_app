export type Order = 'asc' | 'desc';

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Data; // TEMPORARY UNTIL WE CLEAN UP DATA TO BETTER MATCH THE BE
  label: string;
  numeric: boolean;
  width?: string;
  selectable?: boolean;
}

export interface Data {
  providerLicensingId: string;
  providerName: string;
  childrenBilledOverCapacity: number;
  childrenPlacedOverCapacity: number;
  distanceTraveled: number;
  overallRiskScore: number;
  providersWithSameAddress: number;
  flagged?: boolean;
  comment?: string;
}

export interface AnnualData extends Data {
  error?: string;
  postalAddress: string;
  city: string;
  zip: string;
}

export interface MonthlyData extends Data {
  error?: string;
  startOfMonth?: string;
  postalAddress: string;
  city: string;
  zip: string;
}

export interface ProviderDetails
  extends Readonly<{
    providerName: string;
    providerLicensingId: string;
    postalAddress: string;
    city: string;
    zip: string;

    providerPhone: string;
    providerEmail: string;
    providerType: string; // define types
    providerStatus: string; //define statuses
  }> {}

export type ProviderInsightWithHistory = ProviderInsight & {
  history: ProviderInsightsHistory[];
};

export interface ProviderInsight
  extends Readonly<{
    is_flagged: boolean;
    providerLicensingId: string;
    comment: string;
    created_at: string;
    resolved_on: string;
    created_by: string;
  }> {}

export interface ProviderInsightsHistory
  extends Readonly<{
    id: number;
    is_active: boolean;
    comment: string;
    created_by: string;
    created_at: string;
    action: string;
  }> {}
