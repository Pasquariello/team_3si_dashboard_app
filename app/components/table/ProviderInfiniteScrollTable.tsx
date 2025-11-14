import React, { useState, forwardRef, useCallback, Fragment } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  CircularProgress,
  Box,
} from '@mui/material';
import { Scroller } from '~/components/table/Scroller';
import { TableVirtuoso, type TableComponents } from 'react-virtuoso';
import { CheckboxDataRow, type VirtuosoDataRowProps } from './CheckBoxDataRow';

import type { Data, HeadCell } from '~/types';
import EnhancedTableHead from './EnhancedTableHead';
import { FETCH_ROW_COUNT } from '../services/providerDataServices';

interface ProviderInfiniteScrollTableProps<T> {
  data: T[];
  headCells: Readonly<HeadCell[]>;
  renderCellContent: (
    row: T,
    columnId: HeadCell['id'],
    labelId: string,
    key: string
  ) => React.ReactNode;
  fetchMore?: (rowCount: number) => void;
  isLoading?: boolean;
  fetchRowCount?: number;
  order: 'asc' | 'desc';
  orderBy: keyof T;
  handleRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;

  onSelectChange?: (selectedIds: string[]) => void;
}

export function ProviderInfiniteScrollTable<T extends Data>({
  data,
  headCells,
  renderCellContent,
  fetchMore,
  isLoading,
  fetchRowCount = FETCH_ROW_COUNT,
  order,
  orderBy,
  handleRequestSort,
  onSelectChange,
}: ProviderInfiniteScrollTableProps<T>) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelectAllClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const newSelected = data.map(item => item.providerLicensingId);
        setSelected(newSelected);
        onSelectChange?.(newSelected);
        return;
      }
      setSelected([]);
      onSelectChange?.([]);
    },
    [data, onSelectChange]
  );

  const handleClickRow = useCallback(
    (event: any, id: string) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected: string[] = [];

      if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
      else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1));
      else if (selectedIndex === selected.length - 1)
        newSelected = newSelected.concat(selected.slice(0, -1));
      else if (selectedIndex > 0)
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );

      setSelected(newSelected);
      onSelectChange?.(newSelected);
    },
    [selected, onSelectChange]
  );

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

  const VirtuosoTableComponents: TableComponents<T> = {
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
        rowCount={data.length || 0}
        headCells={headCells}
        ref={ref}
      />
    )),
    TableRow: forwardRef<HTMLTableRowElement, VirtuosoDataRowProps>((props, ref) => (
      <CheckboxDataRow
        ref={ref}
        {...props}
        handleClickRow={handleClickRow}
        isSelected={(id: string) => selected.includes(id)}
      />
    )),
    TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
  };

  return (
    <TableContainer component={Paper} sx={{ height: '97vh', flexGrow: 1, overflow: 'auto' }}>
      <TableVirtuoso
        data={data}
        computeItemKey={(index, item) => item.providerLicensingId}
        endReached={fetchMore}
        increaseViewportBy={fetchRowCount}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={(index: number, row: T) => {
          const labelId = `enhanced-table-checkbox-${row.providerLicensingId}`;
          return (
            <Fragment>
              {headCells.map((column, index) => {
                const key = `${column.id}-${row.providerLicensingId}`;
                return renderCellContent(row, column.id, labelId, key);
              })}
            </Fragment>
          );
        }}
        components={VirtuosoTableComponents}
        fixedFooterContent={() =>
          isLoading ? (
            <TableRow sx={{ backgroundColor: 'lightgray' }}>
              <TableCell colSpan={headCells.length} align='center'>
                <Box sx={{ textAlign: 'center' }}>
                  <CircularProgress size={24} />
                </Box>
              </TableCell>
            </TableRow>
          ) : null
        }
      />
    </TableContainer>
  );
}
