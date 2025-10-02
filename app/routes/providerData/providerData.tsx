import * as React from 'react';
import type { Route } from './+types/providerData';

import { Outlet, useLocation, useMatch, useParams } from 'react-router';
import { Tabs, Tab, Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router';

import { useQueryParams } from '~/contexts/queryParamContext';
import ProviderDataCards from '~/components/providerData/providerDataCards';
import { createQueryStringFromFilters } from '~/components/services/providerDataServices';

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
  let params = useParams();
  const [queryParams, updateQuery] = useQueryParams();

  React.useEffect(() => {
    if (!onMatchingRoute) {
      updateQuery({
        key: 'offset',
        value: '0',
        type: 'SET',
      });

      const offset = queryParams?.get('offset') || '0';
      const flagStatus = queryParams?.get('flagStatus') || undefined;
      const cities = queryParams.getAll('cities') || undefined;
      let searchParams = '';

      const offsetMod = new URLSearchParams({ offset }).toString();
      searchParams += `?${offsetMod}`;

      const filters = {
        flagStatus,
        cities,
      };

      const queryString = createQueryStringFromFilters(filters);
      if (queryString) {
        searchParams += `&${queryString}`;
      }
      // checking the param and appending or removing the day depending on yearly or monthly tab
      // allows filters to carry over between tabs
      const param = !Object.hasOwn(params, 'year')
        ? params?.date?.slice(0, params.date?.length - 3)
        : params.year + '-01';

      navigate(`${tabRoutes[activeTab].path}/${param}${searchParams}`);
    }
  }, [activeTab, params]);

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
      <Outlet />
    </Box>
  );
}
