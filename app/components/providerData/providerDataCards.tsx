import { Grid, Typography, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { env } from '~/env';
import DashboardCard from '~/routes/providerData/DashboardCard';
import { useMatch, useParams } from 'react-router';

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import {
  FlagOutlined,
  ReportProblemOutlined,
  TrendingDownOutlined,
  TrendingUpOutlined,
  WarningAmberOutlined,
} from '@mui/icons-material';

function formatMonthYear(value: string | undefined) {
  const date = new Date(value + '-01T00:00:00');
  return date.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export default function ProviderDataCards() {
  // TODO - pass year via props remove useParams ?
  const params = useParams();

  // const { selectedYear } = params;

  const annualMatch = useMatch('/provider/risk-audit/annual/:date?');
  const monthlyMatch = useMatch('/provider/risk-audit/monthly/:date?');

  let mode: 'annual' | 'monthly' | null = null;

  if (annualMatch) {
    mode = 'annual';
  } else if (monthlyMatch) {
    mode = 'monthly';
  }

  const map = {
    annual: params.date,
    monthly: formatMonthYear(params.date),
  };

  const dateActiveString = map[mode!];

  const riskScoreStrings = {
    total_billed_over_capacity: 'Children Billed Over',
    total_placed_over_capacity: 'Children Placed Over Capacity',
    total_distance_traveled: 'Distance Traveled',
    total_same_address: 'Providers with Same Address',
  };

  const theme = useTheme();

  const selectedDate = !Object.hasOwn(params, 'date')
    ? params?.date?.slice(0, params.date?.length - 3)
    : params.date;

  const getProviderCount = async () => {
    const response = await fetch(
      `${env.VITE_API_ROOT_API_URL}/providerData/providerCount/${selectedDate}`
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const getProvidersWithHighRiskCount = async () => {
    const response = await fetch(
      `${env.VITE_API_ROOT_API_URL}/providerData/highRiskScoreCount/${selectedDate}`
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const getHighestRiskScore = async () => {
    const response = await fetch(
      `${env.VITE_API_ROOT_API_URL}/providerData/highRiskScore/${selectedDate}`
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  };

  const getFlaggedCount = async () => {
    const response = await fetch(
      `${env.VITE_API_ROOT_API_URL}/providerData/flaggedCount/${selectedDate}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['date', selectedDate],
    queryFn: async () => {
      const [unique_provider_count, flagged_provider_count, count_over_44, highest_risk_score] =
        await Promise.all([
          getProviderCount(),
          getFlaggedCount(), // another request
          getProvidersWithHighRiskCount(),
          getHighestRiskScore(),
        ]);
      return [unique_provider_count, flagged_provider_count, count_over_44, highest_risk_score];
    },
  });

  const highRiskPercentage = Math.round(
    (data?.[2]?.count_over_44 / data?.[0]?.unique_provider_count) * 100
  );

  const sortScores = (arr: any[]) => {
    if (!arr) {
      return;
    }
    arr.sort((a: { metric: string }, b: { metric: string }) => {
      const nameA = a.metric.toUpperCase(); // Convert to uppercase for case-insensitive sorting
      const nameB = b.metric.toUpperCase(); // Convert to uppercase for case-insensitive sorting

      if (nameA < nameB) {
        return -1; // nameA comes before nameB
      }
      if (nameA > nameB) {
        return 1; // nameA comes after nameB
      }
      return 0; // names are equal
    });

    return arr;
  };

  const highestRiskScoreTitle = (riskScores: any) => {
    const arr = sortScores(riskScores);

    let metric = arr?.filter(riskScore => riskScore.year === Number(selectedDate));
    if (metric?.length > 1) {
      const [metric1, metric2] = metric;
      return `${riskScoreStrings[metric1?.metric]} and ${riskScoreStrings[metric2?.metric]}`;
    } else {
      return riskScoreStrings[arr?.[0]?.metric];
    }
  };

  //   let baz = [{ year: 2023, metric: "total_placed_over_capacity", total_value: 55659 }, { year: 2023, metric: "total_distance_traveled", total_value: 55659 }, { year: 2024, metric: "total_billed_over_capacity", total_value: 56028 }]
  //   let baz = [{ year: 2023, metric: "total_billed_over_capacity", total_value: 55659 },{ year: 2024, metric: "total_billed_over_capacity", total_value: 56028 }]

  const renderHighestRiskScoreDesc = () => {
    return (
      <>
        <PercentCangeIcon />
        {percentChange ? Math.abs(Number(percentChange)) : 0}% from one year ago
      </>
    );
  };

  const currentYear = !Object.hasOwn(params, 'selectedYear')
    ? params?.date?.slice(0, params.date?.length - 3)
    : params.selectedYear;
  const riskScores = data?.[3];

  let thisYear = riskScores?.filter(
    (riskScore: { year: number }) => riskScore.year === Number(currentYear)
  );
  let lastYear = riskScores?.filter(
    (riskScore: { year: number }) => riskScore.year === Number(currentYear) - 1
  );

  const thisYearsTotalValue = thisYear?.[0]?.total_value || 1;
  const lastYearsTotalValue = lastYear?.[0]?.total_value || 1;

  const percentChange = (
    ((thisYearsTotalValue - lastYearsTotalValue) / lastYearsTotalValue) *
    100
  ).toFixed(2);
  const PercentCangeIcon = Number(percentChange) > 0 ? ArrowDropUpIcon : ArrowDropDownIcon;
  const renderTrendingIcon = () =>
    Number(percentChange) > 0 ? (
      <TrendingUpOutlined color='error' />
    ) : (
      <TrendingDownOutlined color='info' />
    );

  //   useEffect(() => {
  //     highestRiskScoreDesc()
  //     // let title = highestRiskScoreTitle(data?.[3])
  //   }, [ data?.[3]])

  let currentYearArr = data?.[3].filter(
    (riskScore: { year: number }) =>
      riskScore.year ===
      Number(
        !Object.hasOwn(params, 'selectedYear')
          ? params?.date?.slice(0, params.date?.length - 3)
          : params.selectedYear
      )
  );
  let title = highestRiskScoreTitle(data?.[3]);

  const renderFlaggedPercent = () => {
    const percent = (data?.[1].flagged_provider_count / data?.[0]?.unique_provider_count) * 100;

    const displayText = percent < 1 ? 'less than 1' : Math.round(percent);

    return `${displayText}% require attention`;
  };
  // const flaggedPercent = data?.[1].flagged_provider_count / data?.[0]?.unique_provider_count
  // Math.round((data?.[1]?.flagged_provider_count / data?.[0]?.unique_provider_count) * 100);
  return (
    <Grid container spacing={2} m={2} columns={{ xs: 12 }}>
      <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
        <DashboardCard
          title={
            <>
              <Typography variant='h7' fontWeight={500} color='black'>
                Total Providers
              </Typography>
              <GroupOutlinedIcon />
            </>
          }
          // description={`Active in ${env.VITE_STATE_NAME || 'State Name'}`}
          description={`Active in ${env.VITE_STATE_NAME || 'State Name'} during ${dateActiveString}`}
          value={
            <Typography variant='h5' fontWeight={700}>
              {data?.[0]?.unique_provider_count}
            </Typography>
          }
          descColor={theme.palette.cusp_iron.contrastText}
          loading={isLoading}
        />
      </Grid>
      <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
        <DashboardCard
          title={
            <>
              <Typography variant='h7' fontWeight={500} color='black'>
                High Risk Providers
              </Typography>
              <ReportProblemOutlined color='error' />
            </>
          }
          description={`${highRiskPercentage}% of ${data?.[0]?.unique_provider_count}`}
          value={
            <Typography color='error' variant='h5' fontWeight={700}>
              {data?.[2]?.count_over_44}
            </Typography>
          }
          descColor={theme.palette.cusp_iron.contrastText}
          loading={isLoading}
        />
      </Grid>
      <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
        <DashboardCard
          title={
            <>
              <Typography variant='h7' fontWeight={500} color='black'>
                Flagged for Review
              </Typography>
              <FlagOutlined color='warning' />
            </>
          }
          description={`${renderFlaggedPercent()}`}
          value={
            <Typography color='warning' variant='h5' fontWeight={700}>
              {data?.[1].flagged_provider_count}
            </Typography>
          }
          descColor={theme.palette.cusp_iron.contrastText}
          loading={isLoading}
        />
      </Grid>
      <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
        <DashboardCard
          title={
            <>
              <Typography variant='h7' fontWeight={500} color='black'>
                Top Risk Scenario
              </Typography>
              {renderTrendingIcon()}
            </>
          }
          description={renderHighestRiskScoreDesc() || ``}
          value={
            <Typography variant='h5' fontWeight={700}>
              {title}
            </Typography>
          }
          descColor={theme.palette.cusp_iron.contrastText}
          loading={isLoading}
        />
      </Grid>
    </Grid>
  );
}
