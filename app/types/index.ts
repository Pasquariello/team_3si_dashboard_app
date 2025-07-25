
export type Order = 'asc' | 'desc';

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

export interface Data {
  id: number;
  providerName: string;
  overallRiskScore: number;
  childrenBilledOver: number;
  childrenPlacedOverCapacity: number;
  distanceTraveled: number;
  providersWithSameAddress: number;
  flagged?: boolean;

}
