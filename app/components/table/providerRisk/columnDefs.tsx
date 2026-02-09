import type { ColumnDef } from '../ExpandableTable';
import { RiskFlagBadge, RiskThresholdBadge } from './columnUtils';

export type ScenarioOverData = {
  serviceMonth: string; // ISO DateString
  riskFlag: boolean;
  providerCapacity: number;
  aveWklyPlacements: number; // determine the average from weeks
  percDeviation: number;
  beforeAfterSchool: number;
  partTime: number;
  fullTimeOverCap: boolean;
  variableSchedule: number;
  fullTime: number;
  openTime: string;
  closeTime: string;
  subRows: OverWeek[];
};
// one level down only
export type OverWeek = Omit<ScenarioOverData, 'subRows'>;

export type UiOverallScoreData = {
  startOfMonth: string; // ISO Datestring
  overBilledCapacity: 0 | 1;
  overPlacementCapacity: 0 | 1;
  sameAddress: 0 | 1;
  distanceTraveled: 0 | 1;
  total: number; // sum of other columns, true = 1, false = 0
};

type DistanceTraveledScenarioMainRow = {
  serviceMonth: string;
  riskFlag: boolean;
  distinctEnrolled: number;
  aveDistance: number;
  subRows: DistanceTraveledScenarioSubRow[];
};

type DistanceTraveledScenarioSubRow = Omit<DistanceTraveledScenarioMainRow, 'subRows'>;

type SameAddressScenarioMainRow = {
  serviceMonth: string;
  riskFlag: boolean;
  postalAddress: string;
  providerId: string;
  providerName: string;
  openDate: string;
  closeDate: string;
  subRows: SameAddressScenarioSubRow[];
};
type SameAddressScenarioSubRow = Omit<SameAddressScenarioMainRow, 'subRows'>;

// placed and billed columns share these
export const providerColumns: ColumnDef<OverWeek>[] = [
  {
    key: 'serviceMonth',
    header: 'Service Month',
    render: (value, row, isSubRow) => {
      return <>{isSubRow ? (value as string)?.slice(0, 10) : (value as string)?.slice(0, 7)}</>;
    },
  },
  {
    key: 'riskFlag',
    header: 'Risk Flag',
    render: value => <RiskFlagBadge flag={value} />,
  },
  {
    key: 'providerCapacity',
    header: 'Provider Capacity',
    render: value => <>{(Math.round((value as number) * 100) / 100).toFixed(2)}</>,
  },
  {
    key: 'aveWklyPlacements',
    header: 'Ave. Weekly Child Count',
    render: value => <>{(Math.round((value as number) * 100) / 100).toFixed(2)}</>,
  },
  {
    key: 'percDeviation',
    header: '% Deviation from Capacity',
    render: value => <>{(Math.round((value as number) * 100) / 100).toFixed(2)}</>,
  },
  {
    key: 'fullTime',
    header: 'Full-time',
    render: value => <>{(Math.round((value as number) * 100) / 100).toFixed(2)}</>,
  },
  {
    key: 'beforeAfterSchool',
    header: 'Before & After School',
    render: value => <>{(Math.round((value as number) * 100) / 100).toFixed(2)}</>,
  },
  {
    key: 'partTime',
    header: 'Part-time',
    render: value => <>{(Math.round((value as number) * 100) / 100).toFixed(2)}</>,
  },
  {
    key: 'variableSchedule',
    header: 'Variable Schedule',
    render: value => <>{(Math.round((value as number) * 100) / 100).toFixed(2)}</>,
  },
  {
    key: 'openTime',
    header: 'Opening Hour',
  },
  {
    key: 'closeTime',
    header: 'Closing Hour',
  },
  {
    key: 'fullTimeOverCap',
    header: 'Full-time Over Capacity',
    render: value => <>{value ? 'Y' : 'N'}</>,
  },
];

export const overallColumns: ColumnDef<UiOverallScoreData>[] = [
  {
    key: 'startOfMonth',
    header: 'Service Month',
    render: (value, row, isSubRow) => {
      return <>{isSubRow ? (value as string)?.slice(0, 10) : (value as string)?.slice(0, 7)}</>;
    },
  },
  {
    key: 'total',
    header: 'Overall Score',
    render: value => <RiskThresholdBadge flag={value} />,
  },
  {
    key: 'overBilledCapacity',
    header: 'Over Billed Capacity',
  },
  {
    key: 'overPlacementCapacity',
    header: 'Over Placement Capacity',
  },
  {
    key: 'sameAddress',
    header: 'Same Address',
  },
  {
    key: 'distanceTraveled',
    header: 'Distance Traveled',
  },
];

export const sameAddressColumns: ColumnDef<SameAddressScenarioSubRow>[] = [
  {
    key: 'serviceMonth',
    header: 'Service Month',
    render: (value, row, isSubRow) => {
      return <>{isSubRow ? (value as string)?.slice(0, 10) : (value as string)?.slice(0, 7)}</>;
    },
  },
  {
    key: 'riskFlag',
    header: 'Risk Flag',
    render: value => <RiskFlagBadge flag={value} />,
  },
  {
    key: 'providerId',
    header: 'Provider Number',
    render: (value, row, isSubRow) => {
      return <>{value}</>;
    },
  },
  {
    key: 'providerName',
    header: 'Name of Provider(s) sharing this address',
    render: (value, row, isSubRow) => {
      return <>{value}</>;
    },
  },
  {
    key: 'postalAddress',
    header: 'Shared Address',
    render: (value, row, isSubRow) => {
      return <>{value}</>;
    },
  },

  {
    key: 'openDate',
    header: 'Opening Date',
    render: (value, row, isSubRow) => {
      return <>{isSubRow ? (value as string)?.slice(0, 10) : (value as string)?.slice(0, 7)}</>;
    },
  },
  {
    key: 'closeDate',
    header: 'Closing Date',
    render: (value, row, isSubRow) => {
      return <>{isSubRow ? (value as string)?.slice(0, 10) : (value as string)?.slice(0, 7)}</>;
    },
  },
];

export const distanceTraveledColumns: ColumnDef<DistanceTraveledScenarioSubRow>[] = [
  {
    key: 'serviceMonth',
    header: 'Service Month',
    render: (value, row, isSubRow) => {
      return <>{isSubRow ? (value as string)?.slice(0, 10) : (value as string)?.slice(0, 7)}</>;
    },
  },
  {
    key: 'riskFlag',
    header: 'Risk Flag',
    render: value => <RiskFlagBadge flag={value} />,
  },
  {
    key: 'distinctEnrolled',
    header: 'Distinct Families Enrolled',
    render: (value, row, isSubRow) => {
      return <>{value}</>;
    },
  },
  {
    key: 'aveDistance',
    header: 'Average Distance Traveled (mi)',
    render: (value, row, isSubRow) => {
      return <>{value}</>;
    },
  },
];
