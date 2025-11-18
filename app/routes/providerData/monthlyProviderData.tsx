import { useState, useMemo, useEffect } from 'react';
import { Box, CircularProgress, Divider, Link, NoSsr, useTheme } from '@mui/material';

import type { HeadCell, MonthlyData, Order } from '~/types';
import DatePickerViews from '~/components/DatePickerViews';
import EnhancedTableToolbar from '~/components/table/EnhancedTableToolbar';
import type { Route } from './+types/monthlyProviderData';
import NoData from '~/components/NoData';
import { useProviderMonthlyData } from '~/hooks/useProviderMonthlyData';

import { TooltipTableCell } from '~/components/table/TooltipTableCell';
import {
  createQueryStringFromFilters,
  getMonthlyData,
  type ProviderFilters,
} from '~/components/services/providerDataServices';
import { useAuth } from '~/contexts/authContext';
import { queryClient } from '~/queryClient';
import DescriptionAlerts from '~/components/DescriptionAlerts';
import { redirect, useNavigate, useParams } from 'react-router';
import { ProviderTableFilterBar } from '~/components/ProviderTableFilterBar';
import { useQueryParams } from '~/contexts/queryParamContext';
import { ProviderInfiniteScrollTable } from '~/components/table/ProviderInfiniteScrollTable';
import { getVisibleRows } from '~/utils/table';

const riskThresholds = [
  { max: 4, min: 3, color: 'red' },
  { max: 2, min: 2, color: 'orange' },
  { max: 1, min: 0, color: 'green' },
];

const getColor = (value: number) => {
  const match = riskThresholds.find(threshold => value <= threshold.max && value >= threshold.min);
  return match ? match.color : 'defaultColor';
};

const headCells: readonly HeadCell[] = [
  {
    id: 'flagged',
    numeric: false,
    disablePadding: true,
    label: 'Flagged',
    width: '90px',
  },
  {
    id: 'providerLicensingId',
    numeric: false,
    disablePadding: true,
    label: 'ID',
    width: '260px',
  },
  {
    id: 'providerName',
    numeric: false,
    disablePadding: false,
    label: 'Provider Name',
  },
  {
    id: 'overallRiskScore',
    numeric: true,
    disablePadding: false,
    label: 'Overall Risk Score',
  },
  {
    id: 'childrenBilledOverCapacity',
    numeric: true,
    disablePadding: false,
    label: 'Children Billed Over Capacity',
    selectable: true,
  },
  {
    id: 'childrenPlacedOverCapacity',
    numeric: true,
    disablePadding: false,
    label: 'Children Placed Over Capacity',
    selectable: true,
  },
  {
    id: 'distanceTraveled',
    numeric: true,
    disablePadding: false,
    label: 'Distance Traveled',
    selectable: true,
  },
  {
    id: 'providersWithSameAddress',
    numeric: true,
    disablePadding: false,
    label: 'Providers with Same Address',
    selectable: true,
  },
];

const toggleableColumns = headCells
  .filter(cell => cell.selectable)
  .map(({ id, label }) => ({ id, label, display: true }));

const initialVisibility = headCells
  .filter(col => col.selectable)
  .reduce(
    (acc, col) => {
      acc[col.id] = {
        label: col.label,
        display: true, // or false depending on default behavior
      };
      return acc;
    },
    {} as Record<string, { label: string; display: boolean }>
  );

const renderCellContent = (
  row: MonthlyData,
  columnId: HeadCell['id'],
  labelId: string,
  key: string
): React.ReactNode => {
  switch (columnId) {
    case 'providerLicensingId':
      return (
        <TooltipTableCell
          tooltipTitle={row.providerLicensingId}
          key={key}
          id={labelId}
          scope='row'
          padding='none'
        >
          <Link
            rel='noopener noreferrer'
            target='_blank'
            href={`/provider/risk-audit/${row.providerLicensingId}`}
          >
            {row.providerLicensingId}
          </Link>
        </TooltipTableCell>
      );
    case 'providerName':
      return (
        <TooltipTableCell tooltipTitle={row.providerName} key={key} subtext={row.city} align='left'>
          {row.providerName}
        </TooltipTableCell>
      );
    case 'overallRiskScore':
      return (
        <TooltipTableCell
          key={key}
          tooltipTitle={row.overallRiskScore}
          align='right'
          sx={{
            color: getColor(row.overallRiskScore),
          }}
        >
          {row.overallRiskScore}
        </TooltipTableCell>
      );
    case 'childrenBilledOverCapacity':
      return (
        <TooltipTableCell tooltipTitle={row.childrenBilledOverCapacity} key={key} align='right'>
          {row.childrenBilledOverCapacity}
        </TooltipTableCell>
      );
    case 'distanceTraveled':
      return (
        <TooltipTableCell tooltipTitle={row.distanceTraveled} key={key} align='right'>
          {row.distanceTraveled}
        </TooltipTableCell>
      );
    case 'childrenPlacedOverCapacity':
      return (
        <TooltipTableCell tooltipTitle={row.childrenPlacedOverCapacity} key={key} align='right'>
          {row.childrenPlacedOverCapacity}
        </TooltipTableCell>
      );
    case 'providersWithSameAddress':
      return (
        <TooltipTableCell tooltipTitle={row.providersWithSameAddress} key={key} align='right'>
          {row.providersWithSameAddress}
        </TooltipTableCell>
      );
    default:
      return null;
  }
};

export async function loader({ params, request }: Route.LoaderArgs) {
  let date = params?.date;
  if (!date) {
    date = '2024-09'; // getCurrentDate()
    return redirect(`${date}`);
  }
  const url = new URL(request.url);
  const offset = url.searchParams.get('offset') ?? '0';
  const flagStatus = url.searchParams.get('flagStatus') || undefined;
  const cities = url.searchParams.getAll('cities') || undefined;
  // ensure we don't send undefined as a filter value
  const filters = {
    ...(flagStatus !== undefined ? { flagStatus } : {}),
    ...(cities !== undefined ? { cities } : {}),
  };
  const cityFilters = filters.cities ? filters.cities : [];
  // TODO: as we add filters we should update the with them!!
  // update the loader query key to match here
  const queryKey = ['monthlyProviderData', date, filters.flagStatus, ...cityFilters];

  await queryClient.prefetchInfiniteQuery({
    initialPageParam: offset,
    queryKey: queryKey,
    queryFn: () => getMonthlyData(date, offset, filters),
  });

  return null;
}

export default function MonthlyProviderData({selectedDate, setMonthlyViewData}) {
  const theme = useTheme();
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof MonthlyData>('overallRiskScore');
  const [alert, setAlert] = useState<{ success: string; message: string } | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [rows, setRows] = useState<MonthlyData[]>([]);

  const [riskScoreColumns, setRiskScoreColumns] = useState(initialVisibility);

  const handleChangeRiskScores = event => {
    const {
      target: { value, name },
    } = event;

    setRiskScoreColumns(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        display: !prev[name].display,
      },
    }));
  };

  const displayedColumns = useMemo(() => {
    return headCells.filter(col => {
      // Always show non-toggleable columns
      if (!col.selectable) return true;
      // Show only if riskScoreColumns says display = true
      return riskScoreColumns[col.id]?.display;
    });
  }, [headCells, riskScoreColumns]);

  let params = useParams();
  const navigate = useNavigate();
  const [queryParams, updateQuery] = useQueryParams();
  const offset = queryParams?.get('offset') || '0';
  const flagStatus = queryParams?.get('flagStatus') || undefined;
  // Memo for cities?
  const cities = queryParams.getAll('cities') || undefined;
  const { setToken } = useAuth();

  const filters: Partial<ProviderFilters> = useMemo(() => {
    return {
      flagStatus,
      cities,
    };
  }, [flagStatus, cities]);

  const { data, fetchNextPage, isFetching, isLoading, error } = useProviderMonthlyData(
    selectedDate!, // the loader ensures this will be here via redirect
    offset,
    filters,
    offset
  );

  useEffect(() => {
    if (!data) return;

    const newItems = data.pages.flat();

    setRows(() => {
      const seen = new Set(newItems.map(r => r.providerLicensingId));
      const merged = [];
      // de-dupe for virtualization in table
      for (const item of newItems) {
        if (seen.has(item.providerLicensingId)) {
          merged.push(item);
          seen.delete(item.providerLicensingId);
        }
      }
      // our local filter on the table
      const filteredItems =
        merged.filter(dataRow => {
          if (dataRow?.error) {
            return false;
          }
          const searchTerm = searchValue?.toLocaleLowerCase() || '';
          if (searchTerm === '') {
            return true;
          }
          const providerName = dataRow?.providerName.toLocaleLowerCase() || '';
          const providerId = dataRow?.providerLicensingId.toLocaleLowerCase() || '';
          if (providerName?.includes(searchTerm) || providerId?.includes(searchTerm)) {
            return true;
          }
          return false;
        }) || [];

      return filteredItems;
    });
  }, [searchValue, data]);

  useEffect(() => {
    if (error) {
      setToken('');
    }
  }, [error]);

  const visibleRows = useMemo<MonthlyData[]>(() => {
    return getVisibleRows(rows, order, orderBy);
  }, [rows, orderBy, order]);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof MonthlyData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const updateOffset = () => {
    if (isFetching || isLoading) {
      return;
    }
    // Our scroll offset is tracked by our cache :)
    const items = rows.length;
    updateQuery({ type: 'SET', key: 'offset', value: String(items) });
  };

  const handleEndScroll = (_rowCount: number) => {
    // prevent query when local searching
    if (searchValue.length > 0) {
      return;
    }
    // rowCount is the visible rows in the table
    // since we can locally filter we need to check the results from cache
    if ((rows.length || 0 + 1) % 200 === 0) {
      fetchNextPage().then(() => updateOffset());
    }
  };
  // TODO - temp comment out Taylor and Justin to Resolve
  // const handleDateSelection = (newDate: Date) => {
  //   const year = newDate.getFullYear();
  //   const month = String(newDate.getMonth() + 1).padStart(2, '0');

  //   const pathname = location.pathname;
  //   const updatedPath = pathname
  //     .split('/')
  //     .map(segment => (segment === params.date ? `${year}-${month}` : segment))
  //     .join('/');

  //   updateQuery({
  //     key: 'offset',
  //     value: '0',
  //     type: 'SET',
  //   });

  //   const offset = queryParams?.get('offset') || '0';
  //   const flagStatus = queryParams?.get('flagStatus') || undefined;
  //   const cities = queryParams.getAll('cities') || undefined;
  //   let searchParams = '';

  //   const offsetMod = new URLSearchParams({ offset }).toString();
  //   searchParams += `?${offsetMod}`;

  //   const filters = {
  //     flagStatus,
  //     cities,
  //   };

  //   const queryString = createQueryStringFromFilters(filters);
  //   if (queryString) {
  //     searchParams += `&${queryString}`;
  //   }

  //   navigate(`${updatedPath}${searchParams}`);
  // };

  return (
    <>
      <DescriptionAlerts
        severity={alert?.success}
        message={alert?.message}
        open={alert !== null}
        handleClose={() => setAlert(null)}
      />
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          backgroundColor: theme.palette.cusp_iron.light,
        }}
      >
        <Box
          sx={{
            my: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexDirection: 'column',
            m: 2,
          }}
        >
          <Box display={'flex'} flex={1} gap={1} width={'100%'}>
            <DatePickerViews label={'"month" and "year"'} views={['year', 'month']} date={selectedDate} setMonthlyViewData={setMonthlyViewData} />
            {/* <EnhancedTableToolbar searchHandler={setSearchValue} /> */}
            <EnhancedTableToolbar searchHandler={setSearchValue} riskScoreColumns={riskScoreColumns} toggleableColumns={toggleableColumns} handleChangeRiskScores={handleChangeRiskScores}  />

          </Box>
          <Divider orientation='horizontal' flexItem />
          <ProviderTableFilterBar />
        </Box>
        {visibleRows.length ? (
          <>
            <Box height={'97vh'} sx={{ backgroundColor: theme.palette.primary.contrastText }}>
              <ProviderInfiniteScrollTable
                data={visibleRows}
                headCells={displayedColumns}
                renderCellContent={renderCellContent}
                fetchMore={handleEndScroll}
                isLoading={isFetching || isLoading}
                order={order}
                orderBy={orderBy}
                handleRequestSort={handleRequestSort}
              />
            </Box>
          </>
        ) 
        // TODO - this is causing a hydration error
        // : isFetching || isLoading ? (
        //   <Box
        //     sx={{
        //       display: 'flex',
        //       flexGrow: 1,
        //       height: '100%',
        //       justifyContent: 'center',
        //       alignItems: 'center',
        //       backgroundColor: theme.palette.primary.contrastText,
        //     }}
        //   >
        //     <NoSsr>
        //     <CircularProgress size={24} />
        //     </NoSsr>
        //   </Box>
        // ) 
        : (
          <NoData />
        )}
      </Box>
    </>
  );
}
