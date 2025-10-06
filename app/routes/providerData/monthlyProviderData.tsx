import { useState, useMemo, useEffect } from 'react';
import { Backdrop, Box, CircularProgress, Divider, useTheme } from '@mui/material';

import type { HeadCell, MonthlyData } from '~/types';
import DatePickerViews from '~/components/DatePickerViews';
import EnhancedTableToolbar from '~/components/table/EnhancedTableToolbar';
import type { Route } from './+types/monthlyProviderData';
import FlagModal from '~/components/modals/FlagModal';
import NoData from '~/components/NoData';
import { useProviderMonthlyData } from '~/hooks/useProviderMonthlyData';
import { TooltipTableCell } from '~/components/table/TooltipTableCell';
import {
  getMonthlyData,
  onSave,
  type ProviderFilters,
} from '~/components/services/providerDataServices';
import { useAuth } from '~/contexts/authContext';
import { queryClient } from '~/queryClient';
import DescriptionAlerts from '~/components/DescriptionAlerts';
import { redirect, useParams } from 'react-router';
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
  },
  {
    id: 'childrenPlacedOverCapacity',
    numeric: true,
    disablePadding: false,
    label: 'Children Placed Over Capacity',
  },
  {
    id: 'distanceTraveled',
    numeric: true,
    disablePadding: false,
    label: 'Distance Traveled',
  },
  {
    id: 'providersWithSameAddress',
    numeric: true,
    disablePadding: false,
    label: 'Providers with Same Address',
  },
];

const renderCellContent = (
  row: MonthlyData,
  columnId: HeadCell['id'],
  labelId: string,
  key: string
): React.ReactNode => {
  // console.log(columnId, row);
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
          {row.providerLicensingId}
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

export default function MonthlyProviderData() {
  const [isLoadingOverlayActive, setIsLoadingOverlayActive] = useState(false);
  const [alert, setAlert] = useState<{ success: string; message: string } | null>(null);
  const [flagModalOpenId, setFlagModalOpenId] = useState<string | null>(null);
  const [localFlags, setLocalFlags] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [rows, setRows] = useState<MonthlyData[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [orderBy, setOrderBy] = useState<keyof MonthlyData>('overallRiskScore');
  const theme = useTheme();

  let params = useParams();
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
    params.date!, // the loader ensures this will be here via redirect
    offset,
    filters,
    offset
  );

  useEffect(() => {
    if (!data) return;

    const newItems =
      data.pages.flat().filter(dataRow => {
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

    setRows(prev => {
      // dedupe, we must manage this since TableVirtuoso doesn't
      const seen = new Set(prev.map(r => r.providerLicensingId));
      const merged = [...prev];

      for (const item of newItems) {
        if (!seen.has(item.providerLicensingId)) merged.push(item);
      }

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

  const visibleRows = useMemo<MonthlyData[]>(() => {
    setLocalFlags(() =>
      rows.reduce((acc, curr) => {
        if (curr.flagged) {
          acc.push(curr.providerLicensingId);
        }

        if (acc.includes(curr.providerLicensingId) && !curr.flagged) {
          return acc.filter(id => curr.providerLicensingId !== id);
        }

        return acc;
      }, localFlags)
    );

    return getVisibleRows(rows, order, orderBy);
  }, [rows, orderBy, order]);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof MonthlyData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    if (error) {
      setToken('');
    }
  }, [error]);

  const handleCheck = (event: React.MouseEvent<unknown>, id: string) => {
    setFlagModalOpenId(id);
  };

  const handleCloseModal = (isFlagged?: boolean, rowId?: string) => {
    if (isFlagged !== undefined && rowId) {
      setLocalFlags(prev => {
        return isFlagged ? [...prev, rowId] : prev.filter(id => id !== rowId);
      });
    }
    setFlagModalOpenId(null);
  };

  const handleOnSave = async (
    row_data: Pick<MonthlyData, 'comment' | 'flagged' | 'providerLicensingId'>
  ) => {
    setIsLoadingOverlayActive(true);
    const res = await onSave(row_data);
    setIsLoadingOverlayActive(false);
    if (res.ok) {
      setAlert({
        success: 'success',
        message: 'Successfully updated record!',
      });
      // this is ran after we get a success from out local payload
      handleCloseModal(row_data.flagged, row_data.providerLicensingId);
      // data has changed in the DB
      queryClient.invalidateQueries({
        queryKey: ['monthlyProviderData', params.date],
      });
      updateQuery({ type: 'SET', key: 'offset', value: '0' });
    } else {
      setAlert({
        success: 'error',
        message: 'An Error Occurred',
      });
    }
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

  return (
    <>
      {isLoadingOverlayActive && (
        <Backdrop
          open={true}
          sx={theme => ({
            color: '#fff',
            zIndex: 100000, // ensure it's on top
          })}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      )}

      <FlagModal
        open={!!flagModalOpenId}
        onClose={handleCloseModal}
        onSave={handleOnSave}
        disableRemove={flagModalOpenId ? !localFlags.includes(flagModalOpenId) : false}
        providerData={
          rows?.find(data => data.providerLicensingId === flagModalOpenId) || ({} as MonthlyData)
        }
      />

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
            <DatePickerViews label={'"month" and "year"'} views={['year', 'month']} />
            <EnhancedTableToolbar searchHandler={setSearchValue} />
          </Box>
          <Divider orientation='horizontal' flexItem />
          <ProviderTableFilterBar />
        </Box>
        {visibleRows.length ? (
          <>
            <Box height={'97vh'} sx={{ backgroundColor: theme.palette.primary.contrastText }}>
              <ProviderInfiniteScrollTable
                data={visibleRows}
                headCells={headCells}
                renderCellContent={renderCellContent}
                fetchMore={handleEndScroll}
                isLoading={isFetching || isLoading}
                order={order}
                orderBy={orderBy}
                handleRequestSort={handleRequestSort}
                onCheck={handleCheck}
                localFlags={localFlags}
              />
            </Box>
          </>
        ) : isFetching || isLoading ? (
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.palette.primary.contrastText,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : (
          <NoData />
        )}
      </Box>
    </>
  );
}
