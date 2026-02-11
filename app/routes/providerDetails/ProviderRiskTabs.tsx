import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Tooltip, Typography, useTheme } from '@mui/material';
import { InfoOutlineRounded } from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router';
import { type SyntheticEvent } from 'react';
import { scenarioConfig } from './configs';

export default function ProviderRiskTabs() {
  let params = useParams();
  const theme = useTheme();
  const { pathname } = useLocation();
  const basePath = `/provider/risk-audit/${params.providerId}/`;

  const activeTab = scenarioConfig.find(tab => pathname.startsWith(basePath + tab.path))?.id ?? 0;

  const navigate = useNavigate();

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    const newRoute = scenarioConfig.find(tab => tab.id === newValue)?.path || 'overall';
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
        {scenarioConfig.map(({ label, id, tooltip }) => (
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
