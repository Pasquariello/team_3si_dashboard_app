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
