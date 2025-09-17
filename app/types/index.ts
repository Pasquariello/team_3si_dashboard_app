export type Order = 'asc' | 'desc';

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Data | keyof Data2; // TEMPORARY UNTIL WE CLEAN UP DATA TO BETTER MATCH THE BE
  label: string;
  numeric: boolean;
  width?: string;
}

export interface Data {
  providerLicensingId: string;
  providerName: string;
  overallRiskScore: number;
  childrenBilledOverCapacity: number;
  childrenPlacedOverCapacity: number;
  distanceTraveled: number;
  providersWithSameAddress: number;
  flagged?: boolean;
  comment?: string;
}

export interface Data2 {
  provider_licensing_id: string;
  provider_name: string;
  overall_risk_score: number;
  total_billed_over_capacity: number;
  total_placed_over_capacity: number;
  total_distance_traveled: number;
  total_same_address: number;
  flagged?: boolean;
  comment?: string;
}

export interface MonthlyData extends Data {
  startOfMonth?: string;
  postalAddress: string;
  city: string;
  zip: string;
}
