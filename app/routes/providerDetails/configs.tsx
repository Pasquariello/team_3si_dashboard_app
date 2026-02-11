export const scenarioConfig = [
  {
    id: 1,
    label: 'Overall Score',
    tooltip: `A composite score reflecting the provider's overall risk level based on multiple factors including capacity, billing, and compliance patterns.`,
    path: 'overall',
  },
  {
    id: 2,
    label: 'Children Placed Over Capacity',
    tooltip:
      'Identifies instances where more children were physically placed at the provider than their licensed capacity allows, which may indicate overcrowding concerns.',
    path: 'cpoc',
  },
  {
    id: 3,
    label: 'Children Billed Over Capacity',
    tooltip:
      'Tracks cases where providers billed for more children than their licensed capacity, which could signal billing irregularities or capacity violations.',
    path: 'cboc',
  },
  {
    id: 4,
    label: 'Providers with Same Address',
    tooltip: `Detects multiple providers operating from the same address, which may indicate potential fraud, unlicensed operations, or administrative issues.`,
    path: 'psa',
  },
  {
    id: 5,
    label: 'Distance Traveled',
    tooltip:
      'Monitors the average distance families travel to reach the provider, with unusual patterns potentially indicating improper enrollment or fraud schemes.',
    path: 'dt',
  },
];
