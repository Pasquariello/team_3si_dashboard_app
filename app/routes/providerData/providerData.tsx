import * as React from 'react';
import type { Route } from './+types/providerData';

import { Outlet, useLocation, useMatch } from 'react-router';
import { Tabs, Tab, Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router';

import { QueryParamsProvider } from '~/contexts/queryParamContext';
import ProviderDataCards from '~/components/providerData/providerDataCards';

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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <ProviderDataCards />
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
      <QueryParamsProvider>
        <Outlet />
      </QueryParamsProvider>
    </Box>
  );
}
