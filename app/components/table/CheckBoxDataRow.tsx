import Flag from '@mui/icons-material/Flag';
import OutlinedFlag from '@mui/icons-material/OutlinedFlag';
import { Checkbox, TableRow, useTheme } from '@mui/material';
import { forwardRef, type MouseEvent } from 'react';
import type { Data } from '~/types';

export type VirtuosoDataRowProps = {
  item: Data;
  style?: React.CSSProperties;
  'data-index'?: number;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLTableRowElement>;

export type CheckboxDataRowProps = VirtuosoDataRowProps & {
  handleClickRow: (event: React.MouseEvent<HTMLTableRowElement>, id: string) => void;
  isSelected: (id: string) => boolean;
  handleCheckBox: (id: string) => void;
};

export const CheckboxDataRow = forwardRef<HTMLTableRowElement, CheckboxDataRowProps>(
  ({ style, item, isSelected, handleClickRow, handleCheckBox, ...rest }, ref) => {
    const theme = useTheme();
    const labelId = `enhanced-table-checkbox-${rest['data-index']}`;

    return (
      <TableRow
        hover
        onClick={(event: MouseEvent<HTMLTableRowElement>) => handleClickRow(event, item.id)}
        role='checkbox'
        aria-checked={isSelected(item.id)}
        tabIndex={-1}
        key={item.id}
        sx={{ cursor: 'pointer', ...style }}
        selected={isSelected(item.id)}
        ref={ref}
        {...rest}
      >
        <td>
          <Checkbox
            color='primary'
            onClick={e => {
              e.stopPropagation();
              handleCheckBox(item.id);
            }}
            checked={item.flagged}
            inputProps={{
              'aria-labelledby': labelId
            }}
            icon={<OutlinedFlag sx={{ color: theme.palette.cusp_iron.main }} />}
            checkedIcon={<Flag sx={{ color: theme.palette.cusp_orange.main }} />}
          />
        </td>
        {rest.children}
      </TableRow>
    );
  }
);
