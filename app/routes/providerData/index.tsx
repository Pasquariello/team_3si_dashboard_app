import * as React from 'react';
import type { Route } from './+types';

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
  { id: 0, label: 'Annual Provider Data', path: 'provider/risk-audit/annual' },
  {
    id: 1,
    label: 'Monthly Provider Data',
    path: `provider/risk-audit/monthly`,
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

const activeTabOptions = {
  annual: 0,
  monthly: 1
}

export default function ProviderData() {
  const navigate = useNavigate();
  const location = useLocation();
    let params = useParams();
  // get location and set the active tab
  const activeTab = activeTabOptions[params.mode] || 0

  const onMatchingRoute = useMatch(`${tabRoutes[activeTab].path}/*`);
  const [queryParams, updateQuery] = useQueryParams();
  const theme = useTheme();



  const [annualViewData, setAnnualViewData] = React.useState('2024');
  const [monthlyViewData, setMonthlyViewData] = React.useState('2024-01');

  const handleUpdateAnnualViewData = (event) => {
    const newDate = event.target.value;

    setAnnualViewData(newDate)
    navigate(`/provider/risk-audit/annual/${newDate}`);
  }

  const handleUpdateMonthlylViewData = (value) => {

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const newDate = `${year}-${month}`;

    setMonthlyViewData(newDate)
    navigate(`/provider/risk-audit/monthly/${newDate}`);
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    if (!onMatchingRoute) {
      updateQuery({
        key: 'offset',
        value: '0',
        type: 'SET',
      });
    }

     const nextMode = newValue === 0 ? "annual" : "monthly";

  // Convert date based on nextMode
  let nextDate;

  if (nextMode === "annual") {
    // Convert YYYY-MM or YYYY-MM-01 → YYYY
    nextDate = annualViewData
  } else {
    // Convert YYYY → YYYY-01
    // OR YYYY-MM → YYYY-MM
    // Always store monthly as YYYY-MM
    nextDate = monthlyViewData
  }

  // Preserve query params
  const search = location.search || "";

  // Navigate to new route
  navigate(`/provider/risk-audit/${nextMode}/${nextDate}${search}`);
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
      <Outlet context={{
        annual: annualViewData,
        monthly: monthlyViewData,
        setAnnualViewData: handleUpdateAnnualViewData,
        setMonthlyViewData: handleUpdateMonthlylViewData
      }}/>
    </Box>
  );
}
