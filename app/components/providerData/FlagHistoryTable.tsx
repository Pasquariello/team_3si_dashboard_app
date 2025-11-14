import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { ProviderInsightsHistory } from '~/types';
import { parseISO } from 'date-fns';

export type FlagHistoryTableProps = {
  history: ProviderInsightsHistory[];
  isLoading: boolean;
};

export default function FlagHistoryTable({ history, isLoading }: FlagHistoryTableProps) {
  // TODO: add loading Skeles

  history.sort((a, b) => b.id - a.id);
  return (
    <TableContainer
      sx={{
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              '& th': {
                fontWeight: 600,
                color: 'text.secondary',
                borderBottom: '1px solid #e0e0e0',
              },
            }}
          >
            <TableCell>Status</TableCell>
            <TableCell>Action Date</TableCell>
            <TableCell>Action Type</TableCell>
            <TableCell>Action By</TableCell>
            <TableCell>Comments</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {history.map((row, i) => (
            <React.Fragment key={i}>
              <TableRow
                sx={{
                  '& td': {
                    borderBottom: i === history.length - 1 ? 'none' : '1px solid #eee',
                    verticalAlign: 'top',
                    paddingY: 2,
                  },
                }}
              >
                <TableCell>
                  <Typography fontWeight={700}>{row.is_active ? 'Active' : 'Inactive'}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={700}>
                    {parseISO(row.created_at).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.action}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.created_by}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.comment}</Typography>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
