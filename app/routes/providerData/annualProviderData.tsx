import * as React from 'react';
import { TableVirtuoso, type TableComponents } from 'react-virtuoso';
import { CheckboxDataRow, type VirtuosoDataRowProps } from '~/components/table/CheckBoxDataRow';
import { Scroller } from '~/components/table/VirutalTableScroller';
import { TooltipTableCell } from '~/components/table/TooltipTableCell';

import { useState, forwardRef, Fragment, useMemo, useEffect } from 'react';

import type { Route } from './+types/annualProviderData';
import type { Data, Data2, HeadCell, Order } from '~/types';
import { useQuery } from '@tanstack/react-query';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';

import FlagIcon from '@mui/icons-material/Flag';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';

import EnhancedTableHead from '~/components/table/EnhancedTableHead';
import EnhancedTableToolbar from '~/components/table/EnhancedTableToolbar';
import YearOrRangeSelector from '~/components/YearOrRangeSelector';

import { getVisibleRows } from '~/utils/table';
import FlagModal from '~/components/modals/FlagModal';
import NoData from '~/components/NoData';
import { FETCH_ROW_COUNT, getAnnualData, onSave } from '~/components/services/providerDataServices';
import DescriptionAlerts from '~/components/DescriptionAlerts';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Annual Provider Data' },
    { name: 'description', content: 'Annual Provider Data' },
  ];
}

// id: 'id',
// id: 'providerName',
// id: 'overallRiskScore',
// id: 'childrenBilledOverCapacity',
// id: 'childrenPlacedOverCapacity',
// id: 'distanceTraveled',
// id: 'providersWithSameAddress',

function createData(
  id: string,
  flagged: boolean,
  providerName: string,
  overallRiskScore: number,
  childrenBilledOverCapacity: number,
  childrenPlacedOverCapacity: number,
  distanceTraveled: number,
  providersWithSameAddress: number
): Data {
  return {
    providerLicensingId: id,
    flagged,
    providerName,
    overallRiskScore,
    childrenBilledOverCapacity,
    childrenPlacedOverCapacity,
    distanceTraveled,
    providersWithSameAddress,
  };
}

// Temporary sample data
// const foo_data: Data2[] = [
//   {
//     providerLicensingId: '1',
//     flagged: true,
//     providerName: 'Little Stars Childcare',
//     overallRiskScore: 100,
//     childrenBilledOverCapacity: 12,
//     childrenPlacedOverCapacity: 12,
//     distanceTraveled: 12,
//     providersWithSameAddress: 12,
//     comment: '',
//   },
//   {
//     providerLicensingId: '2',
//     flagged: false,
//     providerName: 'Bright Futures Academy',
//     overallRiskScore: 89,
//     childrenBilledOverCapacity: 12,
//     childrenPlacedOverCapacity: 11,
//     distanceTraveled: 10,
//     providersWithSameAddress: 12,
//     comment: '',
//   },

//   {
//     providerLicensingId: '3',
//     flagged: false,
//     providerName: 'Happy Hearts Daycare',
//     overallRiskScore: 90,
//     childrenBilledOverCapacity: 6,
//     childrenPlacedOverCapacity: 6,
//     distanceTraveled: 6,
//     providersWithSameAddress: 6,
//     comment: '',
//   },

//   {
//     providerLicensingId: '4',
//     flagged: false,
//     providerName: 'Sunshine Learning Center',
//     overallRiskScore: 80,
//     childrenBilledOverCapacity: 4,
//     childrenPlacedOverCapacity: 11,
//     distanceTraveled: 1,
//     providersWithSameAddress: 5,
//     comment: '',
//   },

//   {
//     providerLicensingId: '5',
//     flagged: true,
//     providerName: 'Kiddie Cove',
//     overallRiskScore: 50,
//     childrenBilledOverCapacity: 1,
//     childrenPlacedOverCapacity: 1,
//     distanceTraveled: 1,
//     providersWithSameAddress: 1,
//     comment: '',
//   },

//   {
//     providerLicensingId: '6',
//     flagged: false,
//     providerName: 'Tiny Tots Academy',
//     overallRiskScore: 10,
//     childrenBilledOverCapacity: 0,
//     childrenPlacedOverCapacity: 0,
//     distanceTraveled: 1,
//     providersWithSameAddress: 0,
//     comment: '',
//   },
// ];

const rows1 = [
  createData('1', true, 'Little Stars Childcare', 100, 12, 12, 12, 12),
  createData('2', false, 'Bright Futures Academy', 89, 12, 11, 10, 12),
  createData('3', false, 'Happy Hearts Daycare', 90, 6, 6, 6, 6),
  createData('4', false, 'Sunshine Learning Center', 80, 4, 11, 1, 5),
  createData('5', true, 'Kiddie Cove', 50, 1, 1, 1, 1),
  createData('6', false, 'Tiny Tots Academy', 10, 0, 0, 1, 0),
];

// Provider ID
// Provider Name
// Overall Risk Score ("s"um of the next four annualized columns)
// Children Billed Over Capacity (integer: number of months with value 1, range: 0–12)
// Children Placed Over Capacity (integer: number of months with value 1, range: 0–12)
// Distance Traveled (integer: number of months with value 1, range: 0–12)
// Providers with Same Address (integer: number of months with value 1, range: 0–12)

// c.provider_licensing_id,
// pa.provider_name,
// c.total_billed_over_capacity,
// c.total_placed_over_capacity,
// c.total_distance_traveled,
// c.total_same_address,
// c.overall_risk_score
const headCells: readonly HeadCell[] = [
  {
    id: 'flagged',
    numeric: false,
    disablePadding: true,
    label: 'Flagged',
  },
  {
    id: 'provider_licensing_id',
    numeric: false,
    disablePadding: true,
    label: 'ID',
  },
  {
    id: 'provider_name', //'providerName',
    numeric: false,
    disablePadding: false,
    label: 'Provider Name',
  },
  {
    id: 'overall_risk_score', // 'overallRiskScore',
    numeric: true,
    disablePadding: false,
    label: 'Overall Risk Score',
  },
  {
    id: 'total_billed_over_capacity', // 'childrenBilledOverCapacity',
    numeric: true,
    disablePadding: false,
    label: 'Children Billed Over',
  },
  {
    id: 'total_placed_over_capacity', // 'childrenPlacedOverCapacity',
    numeric: true,
    disablePadding: false,
    label: 'Children Placed Over Capacity',
  },
  {
    id: 'total_distance_traveled', //'distanceTraveled',
    numeric: true,
    disablePadding: false,
    label: 'Distance Traveled',
  },
  {
    id: 'total_same_address', //'providersWithSameAddress',
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
  row: Data2,
  columnId: HeadCell['id'],
  isItemSelected: boolean,
  labelId: string,
  key: string
): React.ReactNode => {
  switch (columnId) {
    case 'provider_licensing_id':
      return (
        <TooltipTableCell
          tooltipTitle={row.provider_licensing_id}
          key={key}
          id={labelId}
          scope='row'
          padding='none'
        >
          {row.provider_licensing_id}
        </TooltipTableCell>
      );
    case 'provider_name':
      return (
        <TooltipTableCell tooltipTitle={row.provider_name} key={key}>
          {row.provider_name}
        </TooltipTableCell>
      );
    case 'overall_risk_score':
      return (
        <TooltipTableCell
          key={key}
          tooltipTitle={row.overall_risk_score}
          align='center'
          sx={{
            color: getColor(row.overall_risk_score),
          }}
        >
          {row.overall_risk_score}
        </TooltipTableCell>
      );
    case 'total_billed_over_capacity':
      return (
        <TooltipTableCell tooltipTitle={row.total_billed_over_capacity} key={key} align='center'>
          {row.total_billed_over_capacity}
        </TooltipTableCell>
      );
    case 'total_distance_traveled':
      return (
        <TooltipTableCell tooltipTitle={row.total_distance_traveled} key={key} align='center'>
          {row.total_distance_traveled}
        </TooltipTableCell>
      );
    case 'total_placed_over_capacity':
      return (
        <TooltipTableCell tooltipTitle={row.total_placed_over_capacity} key={key} align='center'>
          {row.total_placed_over_capacity}
        </TooltipTableCell>
      );
    case 'total_same_address':
      return (
        <TooltipTableCell tooltipTitle={row.total_same_address} key={key} align='center'>
          {row.total_same_address}
        </TooltipTableCell>
      );
    default:
      return null;
  }
};

export default function AnnualProviderData() {
  const theme = useTheme();
  const [order, setOrder] = React.useState<Order>('desc');
  const [alert, setAlert] = React.useState<{ success: string; message: string } | null>(null);
  const [flagModalOpenId, setFlagModalOpenId] = React.useState<string | null>(null);

  const [orderBy, setOrderBy] = React.useState<keyof Data2>('overall_risk_score');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>('2024');
  const [searchValue, setSearchValue] = useState<string>('');

  // const [rows, setRows] = React.useState<Data[]>([]);

  const {
    data: rows = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['annualData', selectedPeriod],
    queryFn: () => getAnnualData(selectedPeriod),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  console.log('rows', rows);

  //  const getData = async () => {
  //     try {
  //       const res = await getAnnualData(selectedPeriod);
  //       console.log('data', res);
  //       setRows(res);
  //       // optionally set state here with res
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  // };

  // React.useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const res = await getAnnualData(selectedPeriod);
  //       console.log('data', res);
  //       setRows(res);
  //       // optionally set state here with res
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   getData();
  // }, []);

  const handlePeriodChange = (event: any) => {
    setSelectedPeriod(event.target.value);

    refetch();

    // You could also trigger a data reload here
  };

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data2) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map(n => n.provider_licensing_id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
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

  // function getColor(value: number) {
  //   const valPercent = (value / 48 ) * 100;
  //   const match = riskThresholds.find(
  //     // threshold => value <= threshold.max && value >= threshold.min
  //     threshold => valPercent  <= threshold.max && valPercent >= threshold.min

  //     // threshold => value <= (threshold.max / 48 ) * 100 && value >= (threshold.min / 48 ) * 100

  //   );
  //   return match ? match.color : 'defaultColor';
  // }

  const visibleRows = useMemo(() => {
    const items =
      rows.filter(dataRow => {
        const providerName = dataRow.provider_name.toLocaleLowerCase();
        const providerId = dataRow.provider_licensing_id.toLocaleLowerCase();
        const searchTerm = searchValue.toLocaleLowerCase();
        if (providerName.includes(searchTerm) || providerId.includes(searchTerm)) {
          return true;
        }
        return false;
      }) || [];

    return getVisibleRows(items, order, orderBy);
  }, [rows, orderBy, order, searchValue]);

  const handleCloseModal = () => {
    setFlagModalOpenId(null);
  };
  // TODO: get comments and flags from API
  const handleOnSave = async (
    row_data: Pick<Data2, 'comment' | 'flagged' | 'provider_licensing_id'>
  ) => {
    const res = await onSave(row_data);

    if (res.ok) {
      setAlert({
        success: 'success',
        message: 'Successfully updated record!',
      });
      handleCloseModal();
    } else {
      setAlert({
        success: 'error',
        message: 'An Error Occurred',
      });
    }
  };

  // newVirtuoso functions
  const [localFlags, setLocalFlags] = useState<string[]>([]);

  const handleEndScroll = (arg: any) => {
    // fix for when we request a page that immediately shows the end row
    if ((arg + 1) % 200 === 0) {
      fetchNextPage().then(() => updateOffset());
    }
  };

  const rowContent = (index: number, row: Data2) => {
    const isItemSelected = selected.includes(row.provider_licensing_id);
    const labelId = `enhanced-table-checkbox-${index}`;
    return (
      <Fragment>
        {headCells.map((column, index) => {
          const key = `${index}-${column.id}-${row.provider_licensing_id}`;
          return renderCellContent(row, column.id, isItemSelected, labelId, key);
        })}
      </Fragment>
    );
  };

  //  MORE new stuff - taylor

  // const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.checked) {
  //     const newSelected = visibleRows.map(n => n.providerLicensingId);
  //     setSelected(newSelected);
  //     return;
  //   }
  //   setSelected([]);
  // };

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

  const VirtuosoTableComponents: TableComponents<Data2> = {
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

  console.log('visibleRows', visibleRows);
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
                  {/* <CircularProgress size={24} /> */}
                </Box>
              </TableCell>
            </TableRow>
          ) : null
        }
      />

      {/* <Table stickyHeader aria-label='sticky table'>
        <EnhancedTableHead
          numSelected={selected.length}
          order={order}
          orderBy={orderBy}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={rows.length}
          headCells={headCells}
        />
        <TableBody>
          {visibleRows.map((row, index) => {
            const isItemSelected = selected.includes(row.providerLicensingId);
            const labelId = `enhanced-table-checkbox-${index}`;

            return (
              <TableRow
                hover
                onClick={event => handleClick(event, row.providerLicensingId)}
                role='checkbox'
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.providerLicensingId}
                selected={isItemSelected}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell padding='checkbox'>
                  <Checkbox
                    color='primary'
                    // checked={isItemSelected}
                    onClick={() => setFlagModalOpenId(row.providerLicensingId)}
                    checked={row.flagged}
                    inputProps={{
                      'aria-labelledby': labelId,
                    }}
                    name={labelId}
                    icon={<OutlinedFlagIcon sx={{ color: theme.palette.cusp_iron.main }} />} // unchecked state
                    checkedIcon={<FlagIcon sx={{ color: theme.palette.cusp_orange.main }} />} // checked state
                  />
                </TableCell>
                <TableCell
                  // component="th"
                  id={labelId}
                  scope='row'
                  padding='none'
                >
                  {row.providerLicensingId}
                </TableCell>
                <TableCell align='left'>{row.provider_name}</TableCell>
                <TableCell
                  align='center'
                  sx={{
                    color: getColor(row.overall_risk_score),
                  }}
                >
                  {row.overall_risk_score}
                </TableCell>
                <TableCell align='center'>
                  {renderTableCellContent(row.total_billed_over_capacity)}
                </TableCell>
                <TableCell align='center'>
                  {renderTableCellContent(row.total_placed_over_capacity)}
                </TableCell>
                <TableCell align='center'>{renderTableCellContent(row.total_distance_traveled)}</TableCell>
                <TableCell align='center'>
                  {renderTableCellContent(row.total_same_address)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table> */}
    </TableContainer>
  );

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        {/* TODO: Probably should refactor so checking a flag just sets the entire dataset we need not just an id, that way we can reduce the props being passed and remove a .find() */}
        <FlagModal
          open={!!flagModalOpenId}
          onClose={handleCloseModal}
          onSave={(data: any) => handleOnSave(data)}
          disableRemove={false}
          providerData={
            visibleRows.find(data => data.provider_licensing_id === flagModalOpenId) ||
            ({} as Data2)
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
          {/* ^ that line added  height: '100vh', display: 'flex', flexDirection: 'column' */}
          <Box sx={{ my: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <YearOrRangeSelector value={selectedPeriod} onChange={handlePeriodChange}  />
            <EnhancedTableToolbar searchHandler={setSearchValue} />
          </Box>
          {visibleRows.length ? renderTable() : <NoData />}
        </Box>
      </Box>
    </>
  );
}
