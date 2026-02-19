import type { Order } from '~/types';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<T>(order: Order, orderBy: keyof T): (a: T, b: T) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export const getVisibleRows = <T>(rows: T[], order: Order, orderBy: keyof T) =>
  [...rows].sort(getComparator(order, orderBy));

export function typedEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

type RiskThreshold = {
  minPercent: number;
  maxPercent: number;
  color: string;
};

export const monthlyRiskThresholds: RiskThreshold[] = [
  { maxPercent: 25, minPercent: 0, color: 'green' },
  { maxPercent: 74, minPercent: 26, color: 'orange' },
  { maxPercent: 100, minPercent: 75, color: 'red' },
];

export const annualRiskThresholds: RiskThreshold[] = [
  { maxPercent: 100, minPercent: 90, color: 'red' },
  { maxPercent: 90, minPercent: 80, color: 'orange' },
  { maxPercent: 80, minPercent: 0, color: 'green' },
];

export function getColor(value: number, viewType: 'monthly' | 'annual', activeRiskColumns: number) {
  const maxRiskPerColumn = viewType === 'monthly' ? 1 : 12;
  const riskThresholds = viewType === 'monthly' ? monthlyRiskThresholds : annualRiskThresholds;
  const maxRisk = maxRiskPerColumn * activeRiskColumns;

  const valPercent = (value / maxRisk) * 100;
  const match = riskThresholds.find(
    threshold => valPercent <= threshold.maxPercent && valPercent >= threshold.minPercent
  );
  return match ? match.color : 'unset';
}

export { descendingComparator, getComparator };
