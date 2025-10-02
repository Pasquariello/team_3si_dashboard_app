import * as React from 'react';
import { TableVirtuoso, type TableComponents } from 'react-virtuoso';
import { CheckboxDataRow, type VirtuosoDataRowProps } from '~/components/table/CheckBoxDataRow';
import { Scroller } from '~/components/table/VirutalTableScroller';
import { TooltipTableCell } from '~/components/table/TooltipTableCell';

import { useState, forwardRef, Fragment, useMemo, useEffect } from 'react';

import type { Route } from './+types/annualProviderData';
import type { AnnualData, HeadCell, Order } from '~/types';

import { useTheme } from '@mui/material/styles';
import {
  Backdrop,
  Box,
  CircularProgress,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';

import EnhancedTableHead from '~/components/table/EnhancedTableHead';
import EnhancedTableToolbar from '~/components/table/EnhancedTableToolbar';
import YearOrRangeSelector from '~/components/YearOrRangeSelector';

import { getVisibleRows } from '~/utils/table';
import FlagModal from '~/components/modals/FlagModal';
import NoData from '~/components/NoData';
import {
  FETCH_ROW_COUNT,
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

const fixedHeaderContent = () => {
  return (
    <TableRow>
      {headCells.map((column, index) => (
        <TableCell
          key={`${column.id}+${index}`}
          variant='head'
          align={column.numeric || false ? 'right' : 'left'}
          style={{}}
          sx={{ backgroundColor: 'background.paper' }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
};

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
  isItemSelected: boolean,
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
          align='center'
          sx={{
            color: getColor(row.overallRiskScore),
          }}
        >
          {row.overallRiskScore}
        </TooltipTableCell>
      );
    case 'childrenBilledOverCapacity':
      return (
        <TooltipTableCell tooltipTitle={row.childrenBilledOverCapacity} key={key} align='center'>
          {row.childrenBilledOverCapacity}
        </TooltipTableCell>
      );
    case 'distanceTraveled':
      return (
        <TooltipTableCell tooltipTitle={row.distanceTraveled} key={key} align='center'>
          {row.distanceTraveled}
        </TooltipTableCell>
      );
    case 'childrenPlacedOverCapacity':
      return (
        <TooltipTableCell tooltipTitle={row.childrenPlacedOverCapacity} key={key} align='center'>
          {row.childrenPlacedOverCapacity}
        </TooltipTableCell>
      );
    case 'providersWithSameAddress':
      return (
        <TooltipTableCell tooltipTitle={row.providersWithSameAddress} key={key} align='center'>
          {row.providersWithSameAddress}
        </TooltipTableCell>
      );
    default:
      return null;
  }
};

export async function loader({ params, request }: Route.LoaderArgs) {
  let year = params?.year;
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
  const [alert, setAlert] = useState<{ success: string; message: string } | null>(null);
  const [flagModalOpenId, setFlagModalOpenId] = useState<string | null>(null);

  const [orderBy, setOrderBy] = useState<keyof AnnualData>('overallRiskScore');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [localFlags, setLocalFlags] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

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

  // const [rows, setRows] = React.useState<Data[]>([]);
  const {
    data: rows,
    fetchNextPage,
    isFetching,
    isLoading,
    error,
    refetch,
  } = useProviderYearlyData(
    params.year!, // the loader ensures this will be here via redirect
    offset,
    filters,
    offset
  );

  useEffect(() => {
    if (error) {
      setToken('');
    }
  }, [error]);

  const visibleRows = useMemo<AnnualData[]>(() => {
    const items = !error
      ? rows?.pages?.flat().filter(dataRow => {
          const providerName = dataRow?.providerName.toLocaleLowerCase() || '';
          const providerId = dataRow?.providerLicensingId.toLocaleLowerCase() || '';
          const searchTerm = searchValue?.toLocaleLowerCase() || '';
          if (providerName?.includes(searchTerm) || providerId?.includes(searchTerm)) {
            return true;
          }
          return false;
        }) || []
      : [];

    setLocalFlags(() =>
      items.reduce((acc, curr) => {
        if (curr.flagged) {
          acc.push(curr.providerLicensingId);
        }

        if (acc.includes(curr.providerLicensingId) && !curr.flagged) {
          return acc.filter(id => curr.providerLicensingId !== id);
        }

        return acc;
      }, localFlags)
    );

    return getVisibleRows(items, order, orderBy);
  }, [rows, orderBy, order, searchValue]);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof AnnualData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = visibleRows.map(n => n.providerLicensingId);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    if (selected.includes(id)) {
      // If it's already selected, remove it
      setSelected(selected.filter(item => item !== id));
    } else {
      // If it's not selected, add it
      setSelected([...selected, id]);
    }
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
    const items = rows?.pages.flat().length;
    updateQuery({ type: 'SET', key: 'offset', value: String(items) });
  };

  const handleEndScroll = (_rowCount: number) => {
    // rowCount is the visible rows in the table
    // since we can locally filter we need to check the results from cache
    if ((rows?.pages?.flat().length || 0 + 1) % 200 === 0) {
      fetchNextPage().then(() => updateOffset());
    }
  };

  const rowContent = (index: number, row: AnnualData) => {
    const isItemSelected = selected.includes(row.providerLicensingId);
    const labelId = `enhanced-table-checkbox-${index}`;
    return (
      <Fragment>
        {headCells.map((column, index) => {
          const key = `${index}-${column.id}-${row.providerLicensingId}`;
          return renderCellContent(row, column.id, isItemSelected, labelId, key);
        })}
      </Fragment>
    );
  };

  const handleCheck = (event: React.MouseEvent<unknown>, id: string) => {
    setFlagModalOpenId(id);

    if (selected.includes(id)) {
      // If it's already selected, remove it
      setSelected(selected.filter(item => item !== id));
    } else {
      // If it's not selected, add it
      setSelected([...selected, id]);
    }
  };

  const VirtuosoTableComponents: TableComponents<AnnualData> = {
    Scroller,
    Table: props => (
      <Table stickyHeader aria-label='sticky table' sx={{ tableLayout: 'auto' }} {...props} />
    ),
    TableHead: forwardRef<HTMLTableSectionElement>((props, ref) => (
      <EnhancedTableHead
        {...props}
        numSelected={selected.length}
        order={order}
        orderBy={orderBy}
        onSelectAllClick={handleSelectAllClick}
        onRequestSort={handleRequestSort}
        rowCount={visibleRows?.length || 0}
        headCells={headCells}
        ref={ref}
      />
    )),
    TableRow: forwardRef<HTMLTableRowElement, VirtuosoDataRowProps>((props, ref) => (
      <CheckboxDataRow
        ref={ref}
        {...props}
        handleClickRow={handleClick}
        handleCheckBox={handleCheck}
        isSelected={(id: string) => selected.includes(id)}
        isChecked={(id: string) => localFlags.includes(id)}
      />
    )),
    TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
  };

  const renderTable = () => (
    <TableContainer component={Paper} sx={{ height: '97vh', flexGrow: 1, overflow: 'auto' }}>
      <TableVirtuoso
        data={visibleRows}
        endReached={handleEndScroll}
        fixedHeaderContent={fixedHeaderContent}
        increaseViewportBy={FETCH_ROW_COUNT}
        itemContent={rowContent}
        components={VirtuosoTableComponents}
        fixedFooterContent={() =>
          isFetching || isLoading ? (
            <TableRow sx={{ backgroundColor: 'lightgray' }}>
              <TableCell colSpan={headCells.length} sx={{ textAlign: 'center' }} align='center'>
                <Box
                  sx={{
                    width: '100%',
                    textAlign: 'center',
                    display: 'block',
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              </TableCell>
            </TableRow>
          ) : null
        }
      />
    </TableContainer>
  );

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
        onSave={(data: any) => handleOnSave(data)}
        disableRemove={false}
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
          {/* ^ that line added  height: '100vh', display: 'flex', flexDirection: 'column' */}
          <Box sx={{ my: 3 }} display={'flex'} flex={1} gap={1} width={'100%'}>
            <YearOrRangeSelector />
            <EnhancedTableToolbar searchHandler={setSearchValue} />
          </Box>
          <Divider orientation='horizontal' flexItem />
          <ProviderTableFilterBar />
        </Box>
        {visibleRows.length ? (
          renderTable()
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
