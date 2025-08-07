import * as React from 'react';

import type { Route } from './+types/annualProviderData';
import type { Data, HeadCell, Order } from '~/types';

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
  type AlertColor,
} from '@mui/material';

import FlagIcon from '@mui/icons-material/Flag';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';

import EnhancedTableHead from '~/components/table/EnhancedTableHead';
import EnhancedTableToolbar from '~/components/table/EnhancedTableToolbar';
import YearOrRangeSelector from '~/components/YearOrRangeSelector';

import { getVisibleRows } from '~/utils/table';
import FlagModal from '~/components/modals/FlagModal';
import NoData from '~/components/NoData';
import { onSave } from '~/components/services/providerDataServices';
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
    id,
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
const foo_data = [
  {
    id: '1',
    is_flagged: true,
    provider_name: 'Little Stars Childcare',
    overall_risk: 100,
    children_billed_over: 12,
    children_over_capacity: 12,
    distance_traveled: 12,
    providers_with_same_address: 12,
    provider_licensing_id: 483729, // (random 6-digit number)
  },
  {
    id: '2',
    is_flagged: false,
    provider_name: 'Bright Futures Academy',
    overall_risk: 89,
    children_billed_over: 12,
    children_over_capacity: 11,
    distance_traveled: 10,
    providers_with_same_address: 12,
    provider_licensing_id: 752194,
  },

  {
    id: '3',
    is_flagged: false,
    provider_name: 'Happy Hearts Daycare',
    overall_risk: 90,
    children_billed_over: 6,
    children_over_capacity: 6,
    distance_traveled: 6,
    providers_with_same_address: 6,
    provider_licensing_id: 319845,
  },

  {
    id: '4',
    is_flagged: false,
    provider_name: 'Sunshine Learning Center',
    overall_risk: 80,
    children_billed_over: 4,
    children_over_capacity: 11,
    distance_traveled: 1,
    providers_with_same_address: 5,
    provider_licensing_id: 460271,
  },

  {
    id: '5',
    is_flagged: true,
    provider_name: 'Kiddie Cove',
    overall_risk: 50,
    children_billed_over: 1,
    children_over_capacity: 1,
    distance_traveled: 1,
    providers_with_same_address: 1,
    provider_licensing_id: 935027,
  },

  {
    id: '6',
    is_flagged: false,
    provider_name: 'Tiny Tots Academy',
    overall_risk: 10,
    children_billed_over: 0,
    children_over_capacity: 0,
    distance_traveled: 1,
    providers_with_same_address: 0,
    provider_licensing_id: 608173,
  },
];

const rows = [
  createData('1', true, 'Little Stars Childcare', 100, 12, 12, 12, 12),
  createData('2', false, 'Bright Futures Academy', 89, 12, 11, 10, 12),
  createData('3', false, 'Happy Hearts Daycare', 90, 6, 6, 6, 6),
  createData('4', false, 'Sunshine Learning Center', 80, 4, 11, 1, 5),
  createData('5', true, 'Kiddie Cove', 50, 1, 1, 1, 1),
  createData('6', false, 'Tiny Tots Academy', 10, 0, 0, 1, 0),

  createData('1', true, 'Little Stars Childcare', 100, 12, 12, 12, 12),
  createData('2', false, 'Bright Futures Academy', 89, 12, 11, 10, 12),
  createData('3', false, 'Happy Hearts Daycare', 90, 6, 6, 6, 6),
  createData('4', false, 'Sunshine Learning Center', 80, 4, 11, 1, 5),
  createData('5', true, 'Kiddie Cove', 50, 1, 1, 1, 1),
  createData('6', false, 'Tiny Tots Academy', 10, 0, 0, 1, 0),
  createData('1', true, 'Little Stars Childcare', 100, 12, 12, 12, 12),
  createData('2', false, 'Bright Futures Academy', 89, 12, 11, 10, 12),
  createData('3', false, 'Happy Hearts Daycare', 90, 6, 6, 6, 6),
  createData('4', false, 'Sunshine Learning Center', 80, 4, 11, 1, 5),
  createData('5', true, 'Kiddie Cove', 50, 1, 1, 1, 1),
  createData('6', false, 'Tiny Tots Academy', 10, 0, 0, 1, 0),
  createData('1', true, 'Little Stars Childcare', 100, 12, 12, 12, 12),
  createData('2', false, 'Bright Futures Academy', 89, 12, 11, 10, 12),
  createData('3', false, 'Happy Hearts Daycare', 90, 6, 6, 6, 6),
  createData('4', false, 'Sunshine Learning Center', 80, 4, 11, 1, 5),
  createData('5', true, 'Kiddie Cove', 50, 1, 1, 1, 1),
  createData('6', false, 'Tiny Tots Academy', 10, 0, 0, 1, 0),
  createData('1', true, 'Little Stars Childcare', 100, 12, 12, 12, 12),
  createData('2', false, 'Bright Futures Academy', 89, 12, 11, 10, 12),
  createData('3', false, 'Happy Hearts Daycare', 90, 6, 6, 6, 6),
  createData('4', false, 'Sunshine Learning Center', 80, 4, 11, 1, 5),
  createData('5', true, 'Kiddie Cove', 50, 1, 1, 1, 1),
  createData('6', false, 'Tiny Tots Academy', 10, 0, 0, 1, 0),
  createData('1', true, 'Little Stars Childcare', 100, 12, 12, 12, 12),
  createData('2', false, 'Bright Futures Academy', 89, 12, 11, 10, 12),
  createData('3', false, 'Happy Hearts Daycare', 90, 6, 6, 6, 6),
  createData('4', false, 'Sunshine Learning Center', 80, 4, 11, 1, 5),
  createData('5', true, 'Kiddie Cove', 50, 1, 1, 1, 1),
  createData('6', false, 'Tiny Tots Academy', 10, 0, 0, 1, 0),
  createData('1', true, 'Little Stars Childcare', 100, 12, 12, 12, 12),
  createData('2', false, 'Bright Futures Academy', 89, 12, 11, 10, 12),
  createData('3', false, 'Happy Hearts Daycare', 90, 6, 6, 6, 6),
  createData('4', false, 'Sunshine Learning Center', 80, 4, 11, 1, 5),
  createData('5', true, 'Kiddie Cove', 50, 1, 1, 1, 1),
  createData('6', false, 'Tiny Tots Academy', 10, 0, 0, 1, 0),
  createData('1', true, 'Little Stars Childcare', 100, 12, 12, 12, 12),
  createData('2', false, 'Bright Futures Academy', 89, 12, 11, 10, 12),
  createData('3', false, 'Happy Hearts Daycare', 90, 6, 6, 6, 6),
  createData('4', false, 'Sunshine Learning Center', 80, 4, 11, 1, 5),
  createData('5', true, 'Kiddie Cove', 50, 1, 1, 1, 1),
  createData('6', false, 'Tiny Tots Academy', 10, 0, 0, 1, 0),
  createData('1', true, 'Little Stars Childcare', 100, 12, 12, 12, 12),
  createData('2', false, 'Bright Futures Academy', 89, 12, 11, 10, 12),
  createData('3', false, 'Happy Hearts Daycare', 90, 6, 6, 6, 6),
  createData('4', false, 'Sunshine Learning Center', 80, 4, 11, 1, 5),
  createData('5', true, 'Kiddie Cove', 50, 1, 1, 1, 1),
];

// Provider ID
// Provider Name
// Overall Risk Score ("s"um of the next four annualized columns)
// Children Billed Over Capacity (integer: number of months with value 1, range: 0–12)
// Children Placed Over Capacity (integer: number of months with value 1, range: 0–12)
// Distance Traveled (integer: number of months with value 1, range: 0–12)
// Providers with Same Address (integer: number of months with value 1, range: 0–12)

const headCells: readonly HeadCell[] = [
  {
    id: 'flagged',
    numeric: false,
    disablePadding: true,
    label: 'Flagged',
  },
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'ID',
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
    label: 'Children Billed Over',
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

export default function AnnualProviderData() {
  const theme = useTheme();
  const [order, setOrder] = React.useState<Order>('desc');
  const [alert, setAlert] = React.useState<{ success: string; message: string } | null>(null);
  const [flagModalOpenId, setFlagModalOpenId] = React.useState<string | null>(null);

  const [orderBy, setOrderBy] = React.useState<keyof Data>('overallRiskScore');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>('last12');

  const handlePeriodChange = (event: any) => {
    setSelectedPeriod(event.target.value);
    // You could also trigger a data reload here
  };

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map(n => n.id);
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

  const riskThresholds = [
    { max: 100, min: 90, color: 'red' },
    { max: 90, min: 80, color: 'orange' },
    { max: 80, min: 0, color: 'green' },
  ];

  function getColor(value: number) {
    const match = riskThresholds.find(
      threshold => value <= threshold.max && value >= threshold.min
    );
    return match ? match.color : 'defaultColor';
  }

  const visibleRows = getVisibleRows(rows, order, orderBy);
  // const visibleRows =  [];

  const renderTableCellContent = (value: string | number) => (value === null ? '--' : value);

  const handleCloseModal = () => {
    setFlagModalOpenId(null);
  };

  const handleOnSave = async (row_data: {
    id: number;
    comment?: string;
    provider_licensing_id: number;
    is_flagged: boolean;
  }) => {
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

  const renderTable = () => (
    <TableContainer component={Paper} sx={{ height: '97vh', flexGrow: 1, overflow: 'auto' }}>
      <Table stickyHeader aria-label='sticky table'>
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
            const isItemSelected = selected.includes(row.id);
            const labelId = `enhanced-table-checkbox-${index}`;

            return (
              <TableRow
                hover
                onClick={event => handleClick(event, row.id)}
                role='checkbox'
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.id}
                selected={isItemSelected}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell padding='checkbox'>
                  <Checkbox
                    color='primary'
                    // checked={isItemSelected}
                    onClick={() => setFlagModalOpenId(row.id)}
                    checked={row.flagged}
                    inputProps={{
                      'aria-labelledby': labelId,
                    }}
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
                  {row.id}
                </TableCell>
                <TableCell align='left'>{row.providerName}</TableCell>
                <TableCell
                  align='center'
                  sx={{
                    color: getColor(row.overallRiskScore),
                  }}
                >
                  {row.overallRiskScore}
                </TableCell>
                <TableCell align='center'>
                  {renderTableCellContent(row.childrenBilledOverCapacity)}
                </TableCell>
                <TableCell align='center'>
                  {renderTableCellContent(row.childrenPlacedOverCapacity)}
                </TableCell>
                <TableCell align='center'>{renderTableCellContent(row.distanceTraveled)}</TableCell>
                <TableCell align='center'>
                  {renderTableCellContent(row.providersWithSameAddress)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
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
          id={flagModalOpenId}
          open={!!flagModalOpenId}
          onClose={handleCloseModal}
          onSave={(data: any) => handleOnSave(data)}
          row_data={foo_data.find(data => data.id === flagModalOpenId)}
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
          <Box sx={{ my: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <YearOrRangeSelector value={selectedPeriod} onChange={handlePeriodChange} />
            <EnhancedTableToolbar />
          </Box>
          {visibleRows.length ? renderTable() : <NoData />}
        </Box>
      </Box>
    </>
  );
}
