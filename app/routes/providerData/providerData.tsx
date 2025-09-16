import * as React from 'react';
import type { Route } from './+types/providerData';

import { Outlet, useLocation, useMatch } from 'react-router';
import { Tabs, Tab, Box, Grid, useTheme } from '@mui/material';
import { useNavigate } from 'react-router';

import DashboardCard from './DashboardCard';
import { QueryParamsProvider } from '~/contexts/queryParamContext';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Provider Data' }, { name: 'description', content: 'providerData' }];
}
// TODO: use a user set filter if the user changes the filter value
// const currentDate = getCurrentDate();

const tabRoutes = [
  { id: 0, label: 'Annual Provider Data', path: 'providerData/annual' },
  {
    id: 1,
    label: 'Monthly Provider Data',
    path: `providerData/monthly`,
  },
  // {
  //   id: 2,
  //   label: 'Provider Trend Analysis',
  //   path: 'providerData',
  // },
];
const getActiveTabByPath = (pathName: string) => {
  if (pathName.includes('annual')) {
    return 0;
  }
  if (pathName.includes('monthly')) {
    return 1;
  }
};

export default function ProviderData() {
  const navigate = useNavigate();
  const location = useLocation();
  // get location and set the active tab
  const [activeTab, setActiveTab] = React.useState(getActiveTabByPath(location.pathname) || 0);
  const onMatchingRoute = useMatch(`${tabRoutes[activeTab].path}/*`);
  React.useEffect(() => {
    if (!onMatchingRoute) {
      navigate(tabRoutes[activeTab].path, { relative: 'path' });
    }
  }, [activeTab]);

  const theme = useTheme();
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(() => newValue);
  };

  const [loading, setLoading] = React.useState(true);

  // TEMP
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // cleanup in case the component unmounts before 3s
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        py: 3,
        px: 4,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Grid container spacing={2} mb={2} columns={{ xs: 12 }}>
        <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
          <DashboardCard
            title='Total Providers'
            description='Active in [state name]'
            value='500'
            descColor={theme.palette.cusp_iron.contrastText}
            loading={loading}
          />
        </Grid>
        <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
          <DashboardCard
            title='High Risk Providers'
            description='22.8% of 500'
            value='114'
            valueColor='error'
            descColor={theme.palette.cusp_iron.contrastText}
            loading={loading}
          />
        </Grid>
        <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
          <DashboardCard
            title='Flagged for Review'
            description='50% require immediate attention'
            value='250'
            valueColor='warning'
            descColor={theme.palette.cusp_iron.contrastText}
            loading={loading}
          />
        </Grid>
        <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
          <DashboardCard
            title='Top Risk Factor'
            description='Same as last month'
            value='Risk Factor Name'
            descColor={theme.palette.cusp_iron.contrastText}
            loading={loading}
          />
        </Grid>
      </Grid>

      <Tabs value={activeTab} onChange={handleChange}>
        {tabRoutes.map(({ label, id }) => (
          <Tab
            sx={{
              color: theme.palette.cusp_iron.contrastText,
              borderColor: theme.palette.cusp_iron.contrastText,
            }}
            key={label}
            label={label}
            value={id}
          />
        ))}
      </Tabs>
      {/* <Box sx={{width: 100, background: 'blue', height: 100, display: 'flex', flexGrow: 1}}></Box> */}
      <QueryParamsProvider>
        <Outlet />
      </QueryParamsProvider>
    </Box>
  );
}
