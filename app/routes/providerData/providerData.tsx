import * as React from 'react';
import type { Route } from './+types/providerData';
import { Outlet, useLocation, useMatch } from 'react-router';
import { Card, Tabs, Tab, Box, Grid, useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import Typography from '@mui/material/Typography';

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
  {
    id: 2,
    label: 'Provider Trend Analysis',
    path: 'providerData',
  },
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
  const onMatchingRoute = useMatch(`${tabRoutes[activeTab].path}/*`)
  React.useEffect(() => {
    if (!onMatchingRoute) {
      navigate(tabRoutes[activeTab].path, { relative: 'path' });
    }
  }, [activeTab]);

  const theme = useTheme();
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(() => newValue);
  };

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
          <Card
            sx={{
              flex: 1,
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              p: 6,
            }}
            variant='outlined'
          >
            <Typography variant='h6'>Total Providers</Typography>
            <Typography variant='h4'>500</Typography>
            <Typography variant='body1' color={theme.palette.cusp_iron.contrastText}>
              Active in [state name]
            </Typography>
          </Card>
        </Grid>
        <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
          <Card
            sx={{
              flex: 1,
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              p: 6,
            }}
            variant='outlined'
          >
            <Typography variant='h6'>High Risk Providers</Typography>
            <Typography variant='h4' color='error'>
              114
            </Typography>
            <Typography variant='body1' color={theme.palette.cusp_iron.contrastText}>
              22.8% of 500
            </Typography>
          </Card>
        </Grid>
        <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
          <Card
            sx={{
              flex: 1,
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              p: 6,
            }}
            variant='outlined'
          >
            <Typography variant='h6'>Flagged for Review</Typography>
            <Typography variant='h4' color='warning'>
              250
            </Typography>
            <Typography variant='body1' color={theme.palette.cusp_iron.contrastText}>
              50% require immediate attention
            </Typography>
          </Card>
        </Grid>
        <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
          <Card
            sx={{
              flex: 1,
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              p: 6,
            }}
            variant='outlined'
          >
            <Typography variant='h6'>Top Risk Factor</Typography>
            <Typography variant='h4'>Risk Factor Name</Typography>
            <Typography variant='body1' color={theme.palette.cusp_iron.contrastText}>
              Same as last month
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Tabs value={activeTab} onChange={handleChange}>
        {tabRoutes.map(({ label, id }) => (
          <Tab key={label} label={label} value={id} />
        ))}
      </Tabs>
      {/* <Box sx={{width: 100, background: 'blue', height: 100, display: 'flex', flexGrow: 1}}></Box> */}
      <Outlet />
    </Box>
  );
}
