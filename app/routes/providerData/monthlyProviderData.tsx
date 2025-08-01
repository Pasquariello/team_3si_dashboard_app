import { TableVirtuoso, type TableComponents } from "react-virtuoso";
import { useState, forwardRef, Fragment, useMemo } from "react";
import EnhancedTableHead from "~/components/table/EnhancedTableHead";
import {
  Box,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useTheme,
} from "@mui/material";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import FlagIcon from "@mui/icons-material/Flag";
import type { Data, HeadCell, Order } from "~/types";
import DatePickerViews from "~/components/DatePickerViews";
import EnhancedTableToolbar from "~/components/table/EnhancedTableToolbar";
import { useSearchParams } from "react-router";
import { getVisibleRows } from "~/utils/table";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCurrentDate } from "~/utils/dates";
import { queryClient } from "~/queryClient";
import type { Route } from "./+types/monthlyProviderData";
import FlagModal from "~/components/modals/FlagModal";

interface CustomTableScroller extends React.HTMLAttributes<HTMLDivElement> {}
// Scroller must be outside the instance that renders the rest of the table
const Scroller = forwardRef<HTMLDivElement, CustomTableScroller>(
  ({ style, ...props }, ref) => (
    <TableContainer
      component={Paper}
      style={{ ...style }}
      {...props}
      ref={ref}
    />
  )
);

export type MonthlyProviderData = {
  id: string;
  startOfMonth: string;
  providerName: string;
  childrenBilledOverCapacity: string;
  childrenPlacedOverCapacity: string;
  distanceTraveled: string;
  providersWithSameAddress: string;
  overallRiskScore: number;
};

const FETCH_ROW_COUNT = 200;

export const getMonthlyData = async (
  date: string,
  offset: string
): Promise<any> => {
  console.log(`http://localhost:3000/api/v1/month/${date}?offset=${offset}`);
  const res = await fetch(
    `http://localhost:3000/api/v1/month/${date}?offset=${offset}`,
    {
      method: "GET",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch message");
  }
  return res.json();
};
// Since we are populating the cache we don't need to block the UI with async/await
export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? getCurrentDate();
  const offset = url.searchParams.get("offset") ?? "0";

  queryClient.prefetchInfiniteQuery({
    initialPageParam: 0,
    queryKey: ["monthlyProviderData", date],
    queryFn: () => getMonthlyData(date, offset),
  });

  return null;
}

const riskThresholds = [
  { max: 4, min: 3, color: "red" },
  { max: 2, min: 2, color: "orange" },
  { max: 1, min: 0, color: "green" },
];

const getColor = (value: number) => {
  const match = riskThresholds.find(
    (threshold) => value <= threshold.max && value >= threshold.min
  );
  return match ? match.color : "defaultColor";
};

const headCells: readonly HeadCell[] = [
  {
    id: "flagged",
    numeric: false,
    disablePadding: true,
    label: "Flagged",
  },
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
    id: "childrenBilledOverCapacity",
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

const fixedHeaderContent = () => {
  return (
    <TableRow>
      {headCells.map((column, index) => (
        <TableCell
          key={`${column.id}+${index}`}
          variant="head"
          align={column.numeric || false ? "right" : "left"}
          style={{}}
          sx={{ backgroundColor: "background.paper" }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
};

const renderCellContent = (
  row: MonthlyProviderData,
  columnId: HeadCell["id"],
  isItemSelected: boolean,
  labelId: string,
  key: string
): React.ReactNode => {
  // console.log(columnId, row);

  switch (columnId) {
    case "id":
      return (
        <TableCell key={key} id={labelId} scope="row" padding="none">
          {row.id}
        </TableCell>
      );

    case "providerName":
      return (
        <TableCell key={key} align="left">
          {row.providerName}
        </TableCell>
      );

    case "overallRiskScore":
      return (
        <TableCell
          key={key}
          align="center"
          sx={{
            color: getColor(row.overallRiskScore),
          }}
        >
          {row.overallRiskScore}
        </TableCell>
      );

    case "childrenBilledOverCapacity":
      return (
        <TableCell key={key} align="center">
          {row.childrenBilledOverCapacity}
        </TableCell>
      );

    case "distanceTraveled":
      return (
        <TableCell key={key} align="center">
          {row.distanceTraveled}
        </TableCell>
      );

    case "childrenPlacedOverCapacity":
      return (
        <TableCell key={key} align="center">
          {row.childrenPlacedOverCapacity}
        </TableCell>
      );

    case "providersWithSameAddress":
      return (
        <TableCell key={key} align="center">
          {row.providersWithSameAddress}
        </TableCell>
      );

    default:
      return null;
  }
};

export default function MonthlyProviderData({ params }: Route.ComponentProps) {
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof any>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const offset = searchParams.get("offset") || "0";
  const theme = useTheme();

  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery({
    queryKey: ["monthlyProviderData", params.date],
    queryFn: async () => getMonthlyData(params.date, offset),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || typeof lastPage !== "object") return undefined;

      if (!Array.isArray(lastPage) || lastPage.length < FETCH_ROW_COUNT)
        return undefined;

      return pages.length * FETCH_ROW_COUNT;
    },
    staleTime: 1000 * 60 * 10, // 10-Min
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const items = data?.pages.flat() || [];
  const visibleRows = useMemo(() => {
    if (Array.isArray(items)) {
      return items && getVisibleRows(items, order, orderBy);
    }
    return [];
  }, [items, order, orderBy]);

  const rowContent = (index: number, row: MonthlyProviderData) => {
    const isItemSelected = selected.includes(row.id);
    const labelId = `enhanced-table-checkbox-${index}`;
    return (
      <Fragment>
        {headCells.map((column, index) => {
          const key = `${index}-${column.id}-${
            row[column.id as keyof MonthlyProviderData]
          }`;
          return renderCellContent(
            row,
            column.id,
            isItemSelected,
            labelId,
            key
          );
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

  const VirtualTableRow = forwardRef<HTMLTableRowElement, any>(
    ({ style, item, ...rest }, ref) => {
      // Check boxes and such need handled by a context @_@
      const isItemSelected = selected.includes(item.id);
      const labelId = `enhanced-table-checkbox-${rest["data-index"]}`;
      return (
        <TableRow
          hover
          onClick={(event) => handleClick(event, item.id)}
          role="checkbox"
          aria-checked={isItemSelected}
          tabIndex={-1}
          key={item.id}
          sx={{ cursor: "pointer", ...style }}
          selected={isItemSelected}
          ref={ref}
          {...rest}
        >
          <td>
            <Checkbox
              color="primary"
              // checked={isItemSelected}
              onClick={() => setFlagModalOpenId(item.id)}
              checked={item.flagged}
              inputProps={{
                "aria-labelledby": labelId,
              }}
              icon={
                <OutlinedFlagIcon
                  sx={{ color: theme.palette.cusp_iron.main }}
                />
              } // unchecked state
              checkedIcon={
                <FlagIcon sx={{ color: theme.palette.cusp_orange.main }} />
              } // checked state
            />
          </td>
          {rest.children}
        </TableRow>
      );
    }
  );

  //   // will eventually requery
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
      const newSelected = items.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const VirtuosoTableComponents: TableComponents<any> = {
    Scroller,
    Table: (props) => <Table {...props} />,
    TableHead: forwardRef<HTMLTableSectionElement>((props: any, ref) => (
      <EnhancedTableHead
        {...props}
        numSelected={selected.length}
        order={order}
        orderBy={orderBy}
        onSelectAllClick={handleSelectAllClick}
        onRequestSort={handleRequestSort}
        rowCount={items?.length || 0}
        headCells={headCells}
        ref={ref}
      />
    )),
    TableRow: VirtualTableRow,
    TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
  };

  const loadMore = () => {
    if (isFetching || isLoading) {
      return;
    }
    console.log("load-more");
    const offset = searchParams.get("offset");

    const nextOffset = Number(offset) + FETCH_ROW_COUNT;
    setSearchParams(() => ({ offset: String(nextOffset) }));
    fetchNextPage();
  };

  const handleCloseModal = () => {
    setFlagModalOpenId(0);
  };

  const [flagModalOpenId, setFlagModalOpenId] = useState(0);

  return (
    <>
      <FlagModal
        id={flagModalOpenId}
        open={!!flagModalOpenId}
        onClose={handleCloseModal}
      />
      <Box sx={{ my: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <DatePickerViews
          label={'"month" and "year"'}
          views={["year", "month"]}
        />
        <EnhancedTableToolbar />
      </Box>

      <TableVirtuoso
        style={{ height: "400px" }}
        data={visibleRows}
        endReached={loadMore}
        fixedHeaderContent={fixedHeaderContent}
        increaseViewportBy={FETCH_ROW_COUNT}
        itemContent={rowContent}
        components={VirtuosoTableComponents}
      />
    </>
  );
}
