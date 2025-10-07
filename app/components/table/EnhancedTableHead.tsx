import {
  Box,
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  useTheme,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import type { Data, HeadCell, Order } from '~/types';

interface EnhancedTableProps<T> {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: keyof T;
  rowCount: number;
  headCells: readonly HeadCell[];
  ref?: React.ForwardedRef<HTMLTableSectionElement>;
}

function EnhancedTableHead<T extends Data>({
  headCells,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  ref,
}: EnhancedTableProps<T>) {
  const theme = useTheme();
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead ref={ref ? ref : undefined}>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all',
            }}
          />
        </TableCell> */}
        {/* <TableCell
            padding="checkbox"
          >
            <TableSortLabel
              active={orderBy === 'flagged'}
              direction={orderBy === 'flagged' ? order : 'asc'}
              onClick={createSortHandler('flagged')}
            >
              {orderBy === 'flagged' ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
          </TableSortLabel>
          </TableCell> */}

        {headCells.map(headCell => (
          <TableCell
            sx={{
              width: headCell?.width ?? 'auto',
            }}
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {/* Sort icon makes alignment look off so we put it to the opposite side */}
              {headCell.numeric ? (
                <>
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component='span' sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </>
              ) : (
                <>
                  {orderBy === headCell.id ? (
                    <Box component='span' sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                  {headCell.label}
                </>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default EnhancedTableHead;
