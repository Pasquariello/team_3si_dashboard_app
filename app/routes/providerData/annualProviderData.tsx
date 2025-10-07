import * as React from 'react';
import { TooltipTableCell } from '~/components/table/TooltipTableCell';

import { useState, useMemo, useEffect } from 'react';

import type { Route } from './+types/annualProviderData';
import type { AnnualData, HeadCell, Order } from '~/types';

import { useTheme } from '@mui/material/styles';
import { Backdrop, Box, CircularProgress, Divider } from '@mui/material';

import EnhancedTableToolbar from '~/components/table/EnhancedTableToolbar';
import YearOrRangeSelector from '~/components/YearOrRangeSelector';

import { getVisibleRows } from '~/utils/table';
import FlagModal from '~/components/modals/FlagModal';
import NoData from '~/components/NoData';
import {
  getAnnualData,
  onSave,
  type ProviderFilters,
} from '~/components/services/providerDataServices';
import DescriptionAlerts from '~/components/DescriptionAlerts';
import { ProviderTableFilterBar } from '~/components/ProviderTableFilterBar';
import { redirect, useParams } from 'react-router';
import { queryClient } from '~/queryClient';
import { useQueryParams } from '~/contexts/queryParamContext';
import { useAuth } from '~/contexts/authContext';
import { useProviderYearlyData } from '~/hooks/useProviderYearlyData';
import { ProviderInfiniteScrollTable } from '~/components/table/ProviderInfiniteScrollTable';

const headCells: readonly HeadCell[] = [
  {
    id: 'flagged',
    numeric: false,
    disablePadding: true,
    label: 'Flagged',
  },
  {
    id: 'providerLicensingId',
    numeric: false,
    disablePadding: true,
    label: 'ID',
  },
  {
    id: 'providerName', //'providerName',
    numeric: false,
    disablePadding: false,
    label: 'Provider Name',
  },
  {
    id: 'overallRiskScore', // 'overallRiskScore',
    numeric: true,
    disablePadding: false,
    label: 'Overall Risk Score',
  },
  {
    id: 'childrenBilledOverCapacity', // 'childrenBilledOverCapacity',
    numeric: true,
    disablePadding: false,
    label: 'Children Billed Over',
  },
  {
    id: 'childrenPlacedOverCapacity', // 'childrenPlacedOverCapacity',
    numeric: true,
    disablePadding: false,
    label: 'Children Placed Over Capacity',
  },
  {
    id: 'distanceTraveled', //'distanceTraveled',
    numeric: true,
    disablePadding: false,
    label: 'Distance Traveled',
  },
  {
    id: 'providersWithSameAddress', //'providersWithSameAddress',
    numeric: true,
    disablePadding: false,
    label: 'Providers with Same Address',
  },
];

const riskThresholds = [
  { max: 100, min: 90, color: 'red' },
  { max: 90, min: 80, color: 'orange' },
  { max: 80, min: 0, color: 'green' },
];

function getColor(value: number) {
  const valPercent = (value / 48) * 100; // 48 is highest possible value so this calcs percentage
  const match = riskThresholds.find(
    // threshold => value <= threshold.max && value >= threshold.min
    threshold => valPercent <= threshold.max && valPercent >= threshold.min

    // threshold => value <= (threshold.max / 48 ) * 100 && value >= (threshold.min / 48 ) * 100
  );
  return match ? match.color : 'defaultColor';
}

const renderCellContent = (
  row: AnnualData,
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
  let year = params?.selectedYear;
  if (!year) {
    year = '2024'; // getCurrentDate()
    return redirect(`${year}`);
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
  // update the hook query key to match here
  const queryKey = ['annualProviderData', year, filters.flagStatus, ...cityFilters];

  await queryClient.prefetchInfiniteQuery({
    initialPageParam: offset,
    queryKey: queryKey,
    queryFn: () => getAnnualData(year, offset, filters),
  });

  return null;
}

export default function AnnualProviderData() {
  const theme = useTheme();
  const [isLoadingOverlayActive, setIsLoadingOverlayActive] = useState(false);
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof AnnualData>('overallRiskScore');
  const [alert, setAlert] = useState<{ success: string; message: string } | null>(null);
  const [flagModalOpenId, setFlagModalOpenId] = useState<string | null>(null);
  const [localFlags, setLocalFlags] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [rows, setRows] = useState<AnnualData[]>([]);

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

  const { data, fetchNextPage, isFetching, isLoading, error } = useProviderYearlyData(
    params.selectedYear!, // the loader ensures this will be here via redirect
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

  const visibleRows = useMemo<AnnualData[]>(() => {
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

  const handleCheck = (event: React.MouseEvent<unknown>, id: string) => {
    setFlagModalOpenId(id);
  };

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof AnnualData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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
    row_data: Pick<AnnualData, 'comment' | 'flagged' | 'providerLicensingId'>
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
        queryKey: ['annualProviderData', params.date],
      });
      updateQuery({ type: 'SET', key: 'offset', value: '0' });
    } else {
      setAlert({
        success: 'error',
        message: 'An Error Occurred',
      });
    }
  };

  // newVirtuoso functions
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
    if ((rows?.length || 0 + 1) % 200 === 0) {
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
      {/* TODO: Probably should refactor so checking a flag just sets the entire dataset we need not just an id, that way we can reduce the props being passed and remove a .find() */}
      <FlagModal
        open={!!flagModalOpenId}
        onClose={handleCloseModal}
        onSave={handleOnSave}
        disableRemove={flagModalOpenId ? !localFlags.includes(flagModalOpenId) : false}
        providerData={
          visibleRows.find(data => data.providerLicensingId === flagModalOpenId) ||
          ({} as AnnualData)
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
            my: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexDirection: 'column',
            m: 2,
          }}
        >
          <Box sx={{ my: 3 }} display={'flex'} flex={1} gap={1} width={'100%'}>
            <YearOrRangeSelector />
            <EnhancedTableToolbar searchHandler={setSearchValue} />
          </Box>
          <Divider orientation='horizontal' flexItem />
          <ProviderTableFilterBar />
        </Box>
        {visibleRows.length ? (
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
