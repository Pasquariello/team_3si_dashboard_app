import * as React from "react";

import type { Route } from "./+types/monthlyProviderData";
import type { Data, HeadCell, Order } from "~/types";


import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Checkbox,
} from "@mui/material";

import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import FlagIcon from "@mui/icons-material/Flag";

import EnhancedTableToolbar from "~/components/table/EnhancedTableToolbar";
import EnhancedTableHead from "~/components/table/EnhancedTableHead";
import { getVisibleRows } from "~/utils/table";
import DatePickerViews from "~/components/DatePickerViews";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { queryClient } from "~/queryClient";
import { getCurrentDate } from "~/utils/dates";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Monthly Provider Data" },
    { name: "description", content: "Monthly Provider Data" },
  ];
}

export type MonthlyProviderData = {
  id: string;
  startOfMonth: string;
  providerName: string;
  childrenBilledOver: string;
  childrenPlacedOverCapacity: string;
  distanceTraveled: string;
  providersWithSameAddress: string;
  overallRiskScore: number;
};

export const getMonthlyData = async (
  date: string
): Promise<MonthlyProviderData[]> => {
  const res = await fetch(`http://localhost:3000/api/v1/month/${date}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch message");
  }

  return res.json();
};

const monthlyQueryOptions = (date: string) =>
  queryOptions<MonthlyProviderData[]>({
    queryKey: ["monthly", date],
    queryFn: () => getMonthlyData(date),
    staleTime: 1000 * 60 * 5,
  });

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? getCurrentDate();
  await queryClient.ensureQueryData(monthlyQueryOptions(date));
  return null;
}

// Provider ID

// Provider Name

// Overall Risk Score (sum of next four columns)

// Children Billed Over Capacity (binary: yes/--)

// Children Placed Over Capacity (binary: yes/--)

// Distance Traveled (binary: yes/--)

// Providers with Same Address (binary: yes/--)

// Display the latest service month by default

// If any of the risk factors (e.g. Distance Traveled) have a 1, the value should be highlighted red
// If the Overall Risk Score is ≥3, the value should be highlighted red
// If the Overall Risk Score is =2, the value should be highlighted orange
// If the Overall Risk Score is 1 or 0, the value should be highlighted green

const headCells: readonly HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "providerName",
    numeric: false,
    disablePadding: false,
    label: "Provider Name",
  },
  {
    id: "overallRiskScore",
    numeric: true,
    disablePadding: false,
    label: "Overall Risk Score",
  },
  {
    id: "childrenBilledOver",
    numeric: true,
    disablePadding: false,
    label: "Children Billed Over",
  },
  {
    id: "childrenPlacedOverCapacity",
    numeric: true,
    disablePadding: false,
    label: "Children Placed Over Capacity",
  },
  {
    id: "distanceTraveled",
    numeric: true,
    disablePadding: false,
    label: "Distance Traveled",
  },
  {
    id: "providersWithSameAddress",
    numeric: true,
    disablePadding: false,
    label: "Providers with Same Address",
  },
];

const riskThresholds = [
  { max: 4, min: 3, color: "red" },
  { max: 2, min: 2, color: "orange" },
  { max: 1, min: 0, color: "green" },
];

function getColor(value: number) {
  const match = riskThresholds.find(
    (threshold) => value <= threshold.max && value >= threshold.min
  );
  return match ? match.color : "defaultColor";
}

export default function MonthlyProviderData({ params }: Route.ComponentProps) {
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("overallRiskScore");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const options = React.useMemo(
    () => monthlyQueryOptions(params.date),
    [params.date]
  );

  const { data, isLoading, error } = useQuery(options);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
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

  const visibleRows = getVisibleRows(data, order, orderBy);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ my: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <DatePickerViews
          label={'"month" and "year"'}
          views={["year", "month"]}
        />
        <EnhancedTableToolbar />
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
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
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                      icon={<OutlinedFlagIcon />} // unchecked state
                      checkedIcon={<FlagIcon />} // checked state
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
                  <TableCell align="left">{row.providerName}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: getColor(row.overallRiskScore),
                    }}
                  >
                    {row.overallRiskScore}
                  </TableCell>
                  <TableCell align="center">{row.childrenBilledOver}</TableCell>
                  <TableCell align="center">
                    {row.childrenPlacedOverCapacity}
                  </TableCell>
                  <TableCell align="center">{row.distanceTraveled}</TableCell>
                  <TableCell align="center">
                    {row.providersWithSameAddress}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
