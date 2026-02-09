import { Box } from '@mui/material';
import type { RowValue } from '../ExpandableTable';

function toDisplayFlag(flag?: string | number | boolean): 0 | 1 {
  if (typeof flag === 'boolean') return flag ? 1 : 0;

  if (typeof flag === 'number') return flag === 1 ? 1 : 0;

  if (typeof flag === 'string') {
    const v = flag.toLowerCase().trim();
    if (v === 'yes') return 1;
    if (v === 'no') return 0;
  }

  return 0;
}

export const RiskFlagBadge: React.FC<{ flag?: RowValue }> = ({ flag }) => {
  const displayFlag = toDisplayFlag(flag);
  // 0 or 4
  const { color, bg } = getThresholdColor(displayFlag === 0 ? 0 : 4);

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: bg,
        color: color,
        border: `1px solid ${color}`,
        fontWeight: 'bold',
        fontSize: '0.8rem',
      }}
    >
      {displayFlag}
    </Box>
  );
};

function convertFlag(flag: unknown): number {
  if (flag === undefined || flag === false) return 0; // undefined or false → 0
  if (typeof flag === 'number') return flag; // numbers pass through
  return 0; // anything else (string, true, etc.) → 0
}

export const RiskThresholdBadge: React.FC<{ flag?: RowValue }> = ({ flag }) => {
  const displayFlag = convertFlag(flag);
  const { color, bg } = getThresholdColor(displayFlag);
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: bg,
        color: color,
        border: `1px solid ${color}`,
        fontWeight: 'bold',
        fontSize: '0.8rem',
      }}
    >
      {displayFlag}
    </Box>
  );
};

const riskThresholds = [
  { max: 4, min: 3, color: '#ef5350', bg: '#ffebee' },
  { max: 2, min: 2, color: '#ffa726', bg: '#fff3e0' },
  { max: 1, min: 0, color: '#66bb6a', bg: '#e8f5e9' },
];

const getThresholdColor = (value: number) => {
  const match = riskThresholds.find(threshold => value <= threshold.max && value >= threshold.min);
  return match ? match : riskThresholds[2];
};
