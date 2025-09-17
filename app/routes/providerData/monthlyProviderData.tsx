import { TableVirtuoso, type TableComponents } from 'react-virtuoso';
import { useState, forwardRef, Fragment, useMemo, useEffect } from 'react';
import EnhancedTableHead from '~/components/table/EnhancedTableHead';
import {
  Backdrop,
  Box,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';

import type { HeadCell, MonthlyData, Order } from '~/types';
import DatePickerViews from '~/components/DatePickerViews';
import EnhancedTableToolbar from '~/components/table/EnhancedTableToolbar';
import { getVisibleRows } from '~/utils/table';
import type { Route } from './+types/monthlyProviderData';
import FlagModal from '~/components/modals/FlagModal';
import NoData from '~/components/NoData';
import { useProviderMonthlyData } from '~/hooks/useProviderMonthlyData';
import { CheckboxDataRow, type VirtuosoDataRowProps } from '~/components/table/CheckBoxDataRow';
import { Scroller } from '~/components/table/VirutalTableScroller';
import { TooltipTableCell } from '~/components/table/TooltipTableCell';
import {
  FETCH_ROW_COUNT,
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
        <TooltipTableCell tooltipTitle={row.providerName} key={key} align='left'>
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
  let date = params?.date;
  if (!date) {
    date = '2024-09'; // getCurrentDate()
    return redirect(`${date}`);
  }
  const url = new URL(request.url);
  const offset = url.searchParams.get('offset') ?? '0';
  const flagStatus = url.searchParams.get('flagStatus') || undefined;
  // ensure we don't send undefined as a filter value
  const filters = {
    ...(flagStatus !== undefined ? { flagStatus } : {}),
  };

  await queryClient.prefetchInfiniteQuery({
    initialPageParam: offset,
    queryKey: ['monthlyProviderData', date, flagStatus],
    queryFn: () => getMonthlyData(date, offset, filters),
  });

  return null;
}

export default function MonthlyProviderData() {
  const [isLoadingOverlayActive, setIsLoadingOverlayActive] = useState(false);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [order, setOrder] = useState<Order>('desc');
  const [alert, setAlert] = useState<{ success: string; message: string } | null>(null);
  const [orderBy, setOrderBy] = useState<keyof MonthlyData>('overallRiskScore');
  const [flagModalOpenId, setFlagModalOpenId] = useState<string | null>(null);
  const [localFlags, setLocalFlags] = useState<string[]>([]);

  let params = useParams();
  const [queryParams, updateQuery] = useQueryParams();
  const offset = queryParams?.get('offset') || '0';
  const flagStatus = queryParams?.get('flagStatus') || undefined;
  const { setToken } = useAuth();

  const filters: Partial<ProviderFilters> = useMemo(() => {
    return {
      flagStatus,
    };
  }, [flagStatus]);

  const { data, fetchNextPage, isFetching, isLoading, error } = useProviderMonthlyData(
    params.date!, // the loader ensures this will be here via redirect
    offset,
    filters,
    offset
  );

  useEffect(() => {
    if (error) {
      setToken('');
    }
  }, [error]);

  const visibleRows = useMemo<MonthlyData[]>((): MonthlyData[] => {
    const items = data?.pages.flat() || [];
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
    return getVisibleRows<MonthlyData>(items, order, orderBy);
  }, [order, orderBy, data]);

  const rowContent = (index: number, row: MonthlyData) => {
    const labelId = `enhanced-table-checkbox-${index}`;
    return (
      <Fragment>
        {headCells.map((column, index) => {
          const key = `${index}-${column.id}-${row.providerLicensingId}`;
          return renderCellContent(row, column.id, labelId, key);
        })}
      </Fragment>
    );
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

  // will eventually requery
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof MonthlyData) => {
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

  const VirtuosoTableComponents: TableComponents<MonthlyData> = {
    Scroller,
    Table: props => (
      <Table stickyHeader aria-label='sticky table' sx={{ tableLayout: 'fixed' }} {...props} />
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

  const updateOffset = () => {
    if (isFetching || isLoading) {
      return;
    }
    // Our scroll offset is tracked by our cache :)
    const items = data?.pages.flat().length;
    updateQuery({ type: 'SET', key: 'offset', value: String(items) });
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

  const handleEndScroll = (arg: any) => {
    // fix for when we request a page that immediately shows the end row
    if ((arg + 1) % 200 === 0) {
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
          visibleRows.find(data => data.providerLicensingId === flagModalOpenId) ||
          ({} as MonthlyData)
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
        }}
      >
        <Box
          sx={{
            my: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexDirection: 'column',
          }}
        >
          <Box display={'flex'} flex={1} gap={1} width={'100%'}>
            <DatePickerViews label={'"month" and "year"'} views={['year', 'month']} />
            <EnhancedTableToolbar />
          </Box>
          <Divider orientation='horizontal' flexItem />
          <ProviderTableFilterBar />
        </Box>
        {visibleRows.length ? (
          <Box height={'97vh'}>
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
                    <TableCell
                      colSpan={headCells.length}
                      sx={{ textAlign: 'center' }}
                      align='center'
                    >
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
          </Box>
        ) : isFetching || isLoading ? (
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <NoData />
        )}
      </Box>
    </>
  );
}
