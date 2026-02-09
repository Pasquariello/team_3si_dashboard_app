import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  useTheme,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export type RowValue = string | boolean | number;

export type SubRowData<T> = {
  [key in keyof T]: RowValue;
} & {};

export type MainRowData<T> = {
  subRows: SubRowData<Omit<T, 'subRows'>>[];
} & {
  [key in keyof Omit<T, 'subRows'>]?: RowValue;
};

export type ColumnDef<T> = {
  key: keyof Omit<T, 'subRows'>;
  header: string;
  render?: (value: RowValue, row: MainRowData<T>, isSubRow?: boolean) => React.ReactNode;
};

export interface ExpandableTableProps<T> {
  data: MainRowData<T>[];
  columns: ColumnDef<T>[];
}

export default function ExpandableTable<T>({ data, columns }: ExpandableTableProps<T>) {
  const theme = useTheme();
  const [openRows, setOpenRows] = useState<Set<string>>(new Set());

  const handleToggleRow = (serviceMonth: string) => {
    setOpenRows(prevOpenRows => {
      const newOpenRows = new Set(prevOpenRows);
      if (newOpenRows.has(serviceMonth)) {
        newOpenRows.delete(serviceMonth);
        // alert(`Closed row for ${serviceMonth}`);
      } else {
        newOpenRows.add(serviceMonth);
        // alert(`Opened row for ${serviceMonth}`);
      }
      return newOpenRows;
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader sx={{ minWidth: 650 }} aria-label='collapsible provider table'>
        <TableHead
          sx={{
            '& .MuiTableCell-stickyHeader': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <TableRow>
            <TableCell />
            {columns.map(col => (
              <TableCell key={String(col.key)}>{col.header}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.map((row, index) => {
            const rowKey = String(`${row[columns[0]?.key]}-${index}`);

            return (
              <React.Fragment key={`${rowKey}-${index}`}>
                <TableRow>
                  <TableCell>
                    {row.subRows?.length > 0 && (
                      <IconButton
                        aria-label='expand row'
                        size='small'
                        onClick={() => handleToggleRow(rowKey)}
                      >
                        {openRows.has(rowKey) ? (
                          <KeyboardArrowDownIcon />
                        ) : (
                          <KeyboardArrowRightIcon />
                        )}
                      </IconButton>
                    )}
                  </TableCell>

                  {columns.map(col => {
                    const value = row[col.key];

                    return (
                      <TableCell key={String(col.key)}>
                        {col.render ? col.render(value!, row) : String(value ?? '')}
                      </TableCell>
                    );
                  })}
                </TableRow>

                {openRows.has(rowKey) &&
                  row.subRows &&
                  row.subRows.length > 0 &&
                  row.subRows?.map((subRow, subIndex) => (
                    <TableRow key={`${rowKey}-sub-${subIndex}`}>
                      <TableCell />
                      {columns.map((col, index) => {
                        const value = subRow[col.key];

                        return (
                          <TableCell
                            sx={{
                              paddingLeft: index === 0 ? '2em' : '1',
                              color: theme.palette.cusp_iron.contrastText,
                            }}
                            key={String(col.key)}
                          >
                            {col.render ? col.render(value!, row, true) : String(value ?? '')}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
