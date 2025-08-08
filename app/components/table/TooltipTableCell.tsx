import { TableCell, Tooltip, Typography, type TableCellProps } from '@mui/material';
import type { ReactNode } from 'react';

interface TooltipTableCellProps extends TableCellProps {
  children: ReactNode;
  tooltipTitle?: ReactNode;
}

export const TooltipTableCell = ({
  children,
  tooltipTitle,
  ...cellProps
}: TooltipTableCellProps) => {
  return (
    <TableCell {...cellProps}>
      <Tooltip title={tooltipTitle || children} arrow>
        <Typography noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
          {children}
        </Typography>
      </Tooltip>
    </TableCell>
  );
};
