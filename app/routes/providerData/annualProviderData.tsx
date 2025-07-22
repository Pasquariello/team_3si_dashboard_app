import type { Route } from "./+types/annualProviderData";

import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import FlagIcon from '@mui/icons-material/Flag';




export function meta({}: Route.MetaArgs) {
  return [
    { title: "Annual Provider Data" },
    { name: "description", content: "Annual Provider Data" },
  ];
}

//   START 

import * as React from 'react';
import { alpha } from '@mui/material/styles';
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

import EnhancedTableToolbar from "~/components/table/EnhancedTableToolbar";
import EnhancedTableHead from "~/components/table/EnhancedTableHead";
import { getVisibleRows } from "~/utils/table";
import type { Data, HeadCell, Order } from "~/types";
import YearOrRangeSelector from "~/components/YearOrRangeSelector";


    // id: 'id',
    // id: 'providerName',
    // id: 'overallRiskScore',
    // id: 'childrenBilledOver',
    // id: 'childrenPlacedOverCapacity',
    // id: 'distanceTraveled',
    // id: 'providersWithSameAddress',
 
function createData(
  id: number,
  providerName: string,
  overallRiskScore: number,
  childrenBilledOver: number,
  childrenPlacedOverCapacity: number,
  distanceTraveled: number,
  providersWithSameAddress: number,
): Data {
  return {
    id,
    providerName,
    overallRiskScore,
    childrenBilledOver,
    childrenPlacedOverCapacity,
    distanceTraveled,
    providersWithSameAddress,
  };
}

const rows = [
  createData(1, 'Little Stars Childcare', 100, 12, 12, 12, 12),
  createData(2, 'Bright Futures Academy', 89, 12, 11, 10, 12),
  createData(3, 'Happy Hearts Daycare', 90, 6, 6, 6, 6),
  createData(4, 'Sunshine Learning Center', 80, 4, 11, 1, 5),
  createData(5, 'Kiddie Cove', 50, 1, 1, 1, 1),
  createData(6, 'Tiny Tots Academy', 10, 0, 0, 1, 0),

];

    // Provider ID
    // Provider Name
    // Overall Risk Score (sum of the next four annualized columns)
    // Children Billed Over Capacity (integer: number of months with value 1, range: 0–12)
    // Children Placed Over Capacity (integer: number of months with value 1, range: 0–12)
    // Distance Traveled (integer: number of months with value 1, range: 0–12)
    // Providers with Same Address (integer: number of months with value 1, range: 0–12)

const headCells: readonly HeadCell[] = [
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
    id: 'childrenBilledOver',
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
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('overallRiskScore');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>('last12');

  const handlePeriodChange = (event: any) => {
    setSelectedPeriod(event.target.value);
    // You could also trigger a data reload here
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
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
      (threshold) => value <= threshold.max && value >= threshold.min
    );
    return match ? match.color : 'defaultColor';
  }

  const visibleRows = getVisibleRows(rows, order, orderBy);

  const renderTableCellContent = (value: string | number) => value === null ? '--' : value;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{my: 4, display: 'flex', alignItems: 'center', gap: 2}}>
        <YearOrRangeSelector
          value={selectedPeriod}
          onChange={handlePeriodChange}
        />
        <EnhancedTableToolbar />
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
          >
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
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                        icon={<OutlinedFlagIcon />}      // unchecked state
                        checkedIcon={<FlagIcon />}       // checked state
                      />
                    </TableCell>
                    <TableCell
                      // component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.id}
                    </TableCell>

                      {/* // id: 'id',
    // id: 'providerName',
    // id: 'overallRiskScore',
    // id: 'childrenBilledOver',
    // id: 'childrenPlacedOverCapacity',
    // id: 'distanceTraveled',
    // id: 'providersWithSameAddress', */}
                    <TableCell align="left">{row.providerName}</TableCell>
                    {/* foo */}
                    <TableCell align="center" sx={{
                      color: getColor(row.overallRiskScore)
                    }}>
                      {row.overallRiskScore}
                    </TableCell>
                    <TableCell align="center">{renderTableCellContent(row.childrenBilledOver)}</TableCell>
                    <TableCell align="center">{renderTableCellContent(row.childrenPlacedOverCapacity)}</TableCell>
                    <TableCell  align="center">{renderTableCellContent(row.distanceTraveled)}</TableCell>
                    <TableCell align="center">{renderTableCellContent(row.providersWithSameAddress)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}