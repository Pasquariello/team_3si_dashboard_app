import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import { useLocation, useParams } from 'react-router';
import {
  getMonthlyExportData,
  getYearlyExportData,
  type ProviderFilters,
} from '../services/providerDataServices';
import { useQueryParams } from '~/contexts/queryParamContext';
import { useMemo, useState } from 'react';

const getTabValue = (pathName: string) => {
  if (pathName.includes('annual')) {
    return 'year';
  }
  if (pathName.includes('monthly')) {
    return 'month';
  }
};

function EnhancedTableToolbar({ searchHandler }: { searchHandler: (val: string) => void }) {
  const theme = useTheme();
  const location = useLocation();
  let params = useParams();
  const [queryParams] = useQueryParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const offset = queryParams?.get('offset') || '0';
  const flagStatus = queryParams?.get('flagStatus') || undefined;
  // Memo for cities?
  const cities = queryParams.getAll('cities') || undefined;

  const filters: Partial<ProviderFilters> = useMemo(() => {
    return {
      flagStatus,
      cities,
    };
  }, [flagStatus, cities]);

  const exportProviderData = async () => {
    setLoading(true);
    const tab = getTabValue(location?.pathname);
    if (tab === 'year') {
      await getYearlyExportData(
        params.selectedYear!, // the loader ensures this will be here via redirect
        offset,
        filters
      );
    } else {
      await getMonthlyExportData(params.date!, offset, filters);
    }
    setLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby='confirm-dialog-title'>
        <DialogTitle id='confirm-dialog-title' fontWeight={'bold'}>
          Reminder:
        </DialogTitle>

        <DialogContent>
          <Typography>
            By exporting, you confirm the data is yours to use, and you are responsible for any
            further handling or sharing.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color='inherit'>
            Cancel
          </Button>
          <Button onClick={exportProviderData} disabled={loading} color='primary' variant='contained'>
            Export Data
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'stretch', // 👈 ensures all items match height
          width: '100%',
        }}
      >
        {/* TODO: Hook up for local search */}
        <TextField
          placeholder='Search by provider name or ID...'
          variant='outlined'
          onChange={event => searchHandler(event.target.value)}
          size='small'
          fullWidth
        />

        <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

        <Button
          variant='outlined'
          onClick={handleOpen}
          size='small'
          sx={{
            alignSelf: 'stretch',
          }}
          startIcon={<DownloadIcon />}
        >
          Export
        </Button>
      </Box>
    </>
  );
}

export default EnhancedTableToolbar;
