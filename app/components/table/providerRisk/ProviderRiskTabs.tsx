import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Tooltip, Typography, useTheme } from '@mui/material';
import { InfoOutlineRounded } from '@mui/icons-material';
import theme from '~/theme';

const tabConfig = [
  {
    label: 'Overall Score',
    tooltip: `A composite score reflecting the provider's overall risk level based on multiple factors including capacity, billing, and compliance patterns.`,
  },
  {
    label: 'Children Placed Over Capacity',
    tooltip:
      'Identifies instances where more children were physically placed at the provider than their licensed capacity allows, which may indicate overcrowding concerns.',
  },
  {
    label: 'Children Billed Over Capacity',
    tooltip:
      'Tracks cases where providers billed for more children than their licensed capacity, which could signal billing irregularities or capacity violations.',
  },
  {
    label: 'Providers with Same Address',
    tooltip: `Detects multiple providers operating from the same address, which may indicate potential fraud, unlicensed operations, or administrative issues.`,
  },
  {
    label: 'Distance Traveled',
    tooltip:
      'Monitors the average distance families travel to reach the provider, with unusual patterns potentially indicating improper enrollment or fraud schemes.',
  },
];


export default function ProviderRiskTabs() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: 'background.paper' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant='scrollable'
        scrollButtons
        allowScrollButtonsMobile
        aria-label='scrollable force tabs example'
      >
        {tabConfig.map(({ label, tooltip }, i) => {
          return (
            <Tab
              label={
                <Box display={'flex'} gap={0.5}>
                  <Typography
                    fontSize={'small'}
                    sx={{ alignSelf: 'center' }}
                    textTransform={'capitalize'}
                    noWrap
                  >
                    {label}
                  </Typography>
                  <Tooltip title={tooltip} arrow>
                    <InfoOutlineRounded
                      sx={{ opacity: 0.3, fontSize: '1em', alignSelf: 'center', display: 'flex' }}
                    />
                  </Tooltip>
                </Box>
              }
            />
          );
        })}
      </Tabs>
    </Box>
  );
}
