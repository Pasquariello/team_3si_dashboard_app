import { TableCell, Tooltip, Typography, useTheme, type TableCellProps } from '@mui/material';
import type { ReactNode } from 'react';

interface TooltipTableCellProps extends TableCellProps {
  children: ReactNode;
  tooltipTitle?: ReactNode;
  subtext?: ReactNode;
}

export const TooltipTableCell = ({
  children,
  tooltipTitle,
  subtext,
  ...cellProps
}: TooltipTableCellProps) => {
  const theme = useTheme();
  return (
    <TableCell {...cellProps}>
      <Tooltip title={tooltipTitle || children} arrow>
        <Typography noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
          {children}
        </Typography>
      </Tooltip>
      {subtext && (
        <Typography
          noWrap
          color={theme.palette.cusp_iron.contrastText}
          variant='caption'
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}
        >
          {subtext}
        </Typography>
      )}
    </TableCell>
  );
};
