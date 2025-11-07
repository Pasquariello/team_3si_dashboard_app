import { Paper, TableContainer } from '@mui/material';
import { forwardRef } from 'react';

interface CustomTableScroller extends React.HTMLAttributes<HTMLDivElement> {}

export const Scroller = forwardRef<HTMLDivElement, CustomTableScroller>(
  ({ style, ...props }, ref) => (
    <TableContainer
      component={Paper}
      style={{
        ...style,
        tableLayout: 'fixed',
      }}
      {...props}
      ref={ref}
    />
  )
);
