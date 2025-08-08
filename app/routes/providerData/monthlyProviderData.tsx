import { TableVirtuoso, type TableComponents } from 'react-virtuoso';
import { useState, forwardRef, Fragment, useMemo, useEffect } from 'react';
import EnhancedTableHead from '~/components/table/EnhancedTableHead';
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';

import type { Data, HeadCell, Order } from '~/types';
import DatePickerViews from '~/components/DatePickerViews';
import EnhancedTableToolbar from '~/components/table/EnhancedTableToolbar';
import { getVisibleRows } from '~/utils/table';
import type { Route } from './+types/monthlyProviderData';
import FlagModal from '~/components/modals/FlagModal';
import NoData from '~/components/NoData';
import { useQueryParamsState } from '~/hooks/useQueryParamState';
import { FETCH_ROW_COUNT } from '~/data-loaders/providerMonthlyData';
import { useProviderMonthlyData } from '~/hooks/useProviderMonthlyData';
import { CheckboxDataRow, type VirtuosoDataRowProps } from '~/components/table/CheckBoxDataRow';
import { Scroller } from '~/components/table/VirutalTableScroller';
import { TooltipTableCell } from '~/components/table/TooltipTableCell';

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
    id: 'id',
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
  row: Data,
  columnId: HeadCell['id'],
  isItemSelected: boolean,
  labelId: string,
  key: string
): React.ReactNode => {
  // console.log(columnId, row);
  switch (columnId) {
    case 'flagged':
      // Flagged is handled at the Table Row to more easily pass handlers to it
      return null;
    case 'id':
      return (
        <TooltipTableCell tooltipTitle={row.id} key={key} id={labelId} scope='row' padding='none'>
          {row.id}
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

export default function MonthlyProviderData({ params }: Route.ComponentProps) {
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof Data>('overallRiskScore');
  const [flagModalOpenId, setFlagModalOpenId] = useState<string | null>(null);
  const [queryParams, updateQuery] = useQueryParamsState();
  const offset = queryParams.get('offset') || '0';

  const { data, fetchNextPage, isFetching, isLoading } = useProviderMonthlyData(
    params.date,
    offset
  );

  const visibleRows = useMemo(() => {
    const items = data?.pages.flat() || [];
    return getVisibleRows(items, order, orderBy);
  }, [order, orderBy, data]);

  const rowContent = (index: number, row: Data) => {
    const isItemSelected = selected.includes(row.id);
    const labelId = `enhanced-table-checkbox-${index}`;
    return (
      <Fragment>
        {headCells.map((column, index) => {
          const key = `${index}-${column.id}-${row[column.id as keyof Data]}`;
          return renderCellContent(row, column.id, isItemSelected, labelId, key);
        })}
      </Fragment>
    );
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  // will eventually requery
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = visibleRows.map(n => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const VirtuosoTableComponents: TableComponents<Data> = {
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
        handleCheckBox={setFlagModalOpenId}
        isSelected={(id: string) => selected.includes(id)}
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
    const offset = queryParams.get('offset');
    const nextOffset = Number(offset) + FETCH_ROW_COUNT;

    updateQuery('offset', String(nextOffset));
  };

  useEffect(() => {
    console.log('load-more');
    fetchNextPage();
  }, [offset]);

  const handleCloseModal = () => {
    setFlagModalOpenId(null);
  };

  return (
    <>
      <FlagModal id={flagModalOpenId} open={!!flagModalOpenId} onClose={handleCloseModal} />
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Box sx={{ my: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <DatePickerViews label={'"month" and "year"'} views={['year', 'month']} />
          <EnhancedTableToolbar />
        </Box>
        {visibleRows.length ? (
          <Box height={'97vh'}>
            <TableVirtuoso
              data={visibleRows}
              endReached={updateOffset}
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
