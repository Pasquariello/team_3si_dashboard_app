import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Tooltip, Typography, useTheme } from '@mui/material';
import { InfoOutlineRounded } from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router';
import { type SyntheticEvent } from 'react';

const tabConfig = [
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
  // {
  //   id: 4,
  //   label: 'Providers with Same Address',
  //   tooltip: `Detects multiple providers operating from the same address, which may indicate potential fraud, unlicensed operations, or administrative issues.`,
  //   path: 'psa',
  // },
  // {
  //   id: 5,
  //   label: 'Distance Traveled',
  //   tooltip:
  //     'Monitors the average distance families travel to reach the provider, with unusual patterns potentially indicating improper enrollment or fraud schemes.',
  //   path: 'dt',
  // },
];

export default function ProviderRiskTabs() {
  let params = useParams();
  const theme = useTheme();
  const { pathname } = useLocation();
  const basePath = `/provider/risk-audit/${params.providerId}/`;

  const activeTab = tabConfig.find(tab => pathname.startsWith(basePath + tab.path))?.id ?? 0;

  const navigate = useNavigate();

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    const newRoute = tabConfig.find(tab => tab.id === newValue)?.path || 'overall';
    // Preserve query params
    // const search = location.search || '';

    // Navigate to new route
    navigate(`/provider/risk-audit/${params.providerId}/${newRoute}`);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        variant='scrollable'
        scrollButtons
        allowScrollButtonsMobile
      >
        {tabConfig.map(({ label, id, tooltip }) => (
          <Tab
            sx={{
              color: theme.palette.cusp_iron.contrastText,
              borderColor: theme.palette.cusp_iron.contrastText,
            }}
            key={label}
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
            value={id}
          />
        ))}
      </Tabs>
    </Box>
  );
}
