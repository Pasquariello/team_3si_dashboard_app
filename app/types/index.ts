export type Order = 'asc' | 'desc';

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Data; // TEMPORARY UNTIL WE CLEAN UP DATA TO BETTER MATCH THE BE
  label: string;
  numeric: boolean;
  width?: string;
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
  postalAddress: string;
  city: string;
  zip: string;
}


export interface MonthlyData extends Data {
  startOfMonth?: string;
  postalAddress: string;
  city: string;
  zip: string;
}
