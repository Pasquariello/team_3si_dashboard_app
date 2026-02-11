import * as React from 'react';
import { TooltipTableCell } from '~/components/table/TooltipTableCell';

import { useState, useMemo, useEffect } from 'react';

import type { Route } from './+types/index';
import type { AnnualData, HeadCell, Order } from '~/types';

import { useTheme } from '@mui/material/styles';
import { Box, CircularProgress, Divider, Link, NoSsr } from '@mui/material';

import EnhancedTableToolbar from '~/components/table/EnhancedTableToolbar';
import YearOrRangeSelector from '~/components/YearOrRangeSelector';

import { getColor, getVisibleRows, typedEntries } from '~/utils/table';
import NoData from '~/components/NoData';
import { getAnnualData, type ProviderFilters } from '~/components/services/providerDataServices';
import DescriptionAlerts from '~/components/DescriptionAlerts';
import { ProviderTableFilterBar } from '~/components/ProviderTableFilterBar';
import { redirect } from 'react-router';
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
    tooltip:
      "A composite score reflecting the provider's overall risk level based on multiple factors including capacity, billing, and compliance patterns.",
  },
  {
    id: 'childrenBilledOverCapacity', // 'childrenBilledOverCapacity',
    numeric: true,
    disablePadding: false,
    label: 'Children Billed Over',
    selectable: true,
    tooltip:
      "Measures the number of unique children billed by a provider relative to the provider's capacity in a service week. A provider is flagged if the number of billed placements exceeds the licensed capacity in any week in a given month.",
  },
  {
    id: 'childrenPlacedOverCapacity', // 'childrenPlacedOverCapacity',
    numeric: true,
    disablePadding: false,
    label: 'Children Placed Over Capacity',
    selectable: true,
    tooltip:
      "Measures the number of unique children who have placements at a provider site relative to the provider's licensed capacity in a service week. A provider is flagged if the number of placements exceeds the licensed capacity in any week in a given month.",
  },
  {
    id: 'distanceTraveled', //'distanceTraveled',
    numeric: true,
    disablePadding: false,
    label: 'Distance Traveled',
    selectable: true,
    tooltip:
      'Tracks child-to-provider distances for children placed at a provider in a service week. A provider is flagged if the average distance traveled by children placed at that provider exceeds 20 miles in any service week in a given month.',
  },
  {
    id: 'providersWithSameAddress', //'providersWithSameAddress',
    numeric: true,
    disablePadding: false,
    label: 'Providers with Same Address',
    selectable: true,
    tooltip:
      'Tracks whether a provider shares the same physical address with one or more other providers in a service week. A provider is flagged if they are co-located with at least one other provider that has a different licensing ID in the same service week in a given month.',
  },
];

const toggleableColumns = headCells
  .filter(cell => cell.selectable)
  .map(({ id, label }) => ({ id, label, display: true }));

type ColumnVisibility = Partial<Record<keyof AnnualData, { label: string; display: boolean }>>;

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

const createRenderCellContent =
  (riskScoreColumns: ColumnVisibility) =>
  (row: AnnualData, columnId: HeadCell['id'], labelId: string, key: string): React.ReactNode => {
    const overallRiskScore = typedEntries(riskScoreColumns).reduce((sum, [riskKey, cfg]) => {
      if (!cfg!.display) return sum; // Only sum fields that are toggled ON
      const value = Number(row[riskKey] ?? 0);
      return sum + value;
    }, 0);

    const activeCount = Object.values(riskScoreColumns).filter(v => v.display).length;

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
          <TooltipTableCell
            tooltipTitle={row.providerName}
            key={key}
            subtext={row.city}
            align='left'
          >
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
              color: getColor(overallRiskScore, 'annual', activeCount),
            }}
          >
            {/* {row.overallRiskScore} */}
            {overallRiskScore}
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
// loader relies on address bar params
export async function loader({ params, request }: Route.LoaderArgs) {
  let year = params?.date;
  if (!year) {
    year = '2024'; // getCurrentDate() TODO
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
  // don't await without a suspense plan in component
  queryClient.prefetchInfiniteQuery({
    initialPageParam: offset,
    queryKey: queryKey,
    queryFn: () => getAnnualData(year, offset, filters),
  });

  return null;
}

type AnnualProviderDataProps = {
  setAnnualViewData: (value: string) => void;
  date: string;
};

export default function AnnualProviderData({ date, setAnnualViewData }: AnnualProviderDataProps) {
  const theme = useTheme();
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof AnnualData>('overallRiskScore');
  const [alert, setAlert] = useState<{ success: string; message: string } | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [rows, setRows] = useState<AnnualData[]>([]);

  const [riskScoreColumns, setRiskScoreColumns] = useState<ColumnVisibility>(initialVisibility);

  const handleChangeRiskScores = (event: { target: { value: any; name: keyof AnnualData } }) => {
    const {
      target: { value, name },
    } = event;

    setRiskScoreColumns(prev => {
      const column = prev[name];
      if (!column) return prev;

      return {
        ...prev,
        [name]: {
          ...column,
          display: !column.display,
        },
      };
    });
  };

  const displayedColumns = useMemo(() => {
    return headCells.filter(col => {
      // Always show non-toggleable columns
      if (!col.selectable) return true;
      // Show only if riskScoreColumns says display = true
      return riskScoreColumns[col.id]?.display;
    });
  }, [headCells, riskScoreColumns]);

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

  const { data, fetchNextPage, isRefetching, isFetchingNextPage, isPending, error } =
    useProviderYearlyData(date, offset, filters, offset);

  useEffect(() => {
    if (!data) return;
    const newItems = data.pages.flat();

    setRows(() => {
      // our local filter on the table
      const filteredItems =
        newItems.filter(dataRow => {
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
    return getVisibleRows(rows, order, orderBy);
  }, [rows, orderBy, order]);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof AnnualData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // newVirtuoso functions
  const updateOffset = () => {
    if (isRefetching || isFetchingNextPage || isPending) {
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

  const renderCellContent = useMemo(
    () => createRenderCellContent(riskScoreColumns),
    [riskScoreColumns]
  );

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
            my: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexDirection: 'column',
            m: 2,
          }}
        >
          <Box sx={{ my: 3 }} display={'flex'} gap={1} width={'100%'}>
            <YearOrRangeSelector date={date} setAnnualViewData={setAnnualViewData} />
            <EnhancedTableToolbar
              searchHandler={setSearchValue}
              riskScoreColumns={riskScoreColumns}
              toggleableColumns={toggleableColumns}
              handleChangeRiskScores={handleChangeRiskScores}
            />
          </Box>
          <Divider orientation='horizontal' flexItem />

          <ProviderTableFilterBar />
        </Box>
        {visibleRows.length ? (
          <Box height={'97vh'} sx={{ backgroundColor: theme.palette.primary.contrastText }}>
            <ProviderInfiniteScrollTable
              data={visibleRows}
              // headCells={headCells}
              headCells={displayedColumns}
              renderCellContent={renderCellContent}
              fetchMore={handleEndScroll}
              isLoadingMore={isFetchingNextPage}
              isLoading={isPending && !isFetchingNextPage}
              order={order}
              orderBy={orderBy}
              handleRequestSort={handleRequestSort}
            />
          </Box>
        ) : isPending && visibleRows.length === 0 ? (
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
            <NoSsr>
              <CircularProgress size={24} />
            </NoSsr>
          </Box>
        ) : (
          <NoData />
        )}
      </Box>
    </>
  );
}
