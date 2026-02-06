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
import DescriptionAlerts from '../DescriptionAlerts';
import ConfigureRiskScoreSelect from '../ConfigureRiskScoreSelect';
import type { Data } from '~/types';

const getTabValue = (pathName: string) => {
  if (pathName.includes('annual')) {
    return 'year';
  }
  if (pathName.includes('monthly')) {
    return 'month';
  }
};

function EnhancedTableToolbar({
  searchHandler,
  riskScoreColumns,
  toggleableColumns,
  handleChangeRiskScores,
}: {
  searchHandler: (val: string) => void;
  riskScoreColumns: Partial<Record<keyof Data, { label: string; display: boolean }>>;
  toggleableColumns: { id: string; label: string; display: boolean }[];
  handleChangeRiskScores: (event: any) => void;
}) {
  const theme = useTheme();
  const location = useLocation();
  let params = useParams();
  const [queryParams] = useQueryParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ success: string; message: string } | null>(null);

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
    try {
      if (tab === 'year') {
        await getYearlyExportData(
          params.selectedYear!, // the loader ensures this will be here via redirect
          offset,
          filters
        );
      } else {
        await getMonthlyExportData(params.date!, offset, filters);
      }
    } catch (error) {
      setAlert({
        success: 'error',
        message: 'An Error Occurred',
      });
    }
    setAlert({
      success: 'success',
      message: 'Export Completed!',
    });
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
      <DescriptionAlerts
        severity={alert?.success}
        message={alert?.message}
        open={alert !== null}
        handleClose={() => setAlert(null)}
      />
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
          <Button
            onClick={exportProviderData}
            disabled={loading}
            color='primary'
            variant='contained'
          >
            Export Data
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flex: 1,
        }}
      >
        {/* TODO: Hook up for local search */}
        <TextField
          placeholder='Search by provider name or ID...'
          variant='outlined'
          onChange={event => searchHandler(event.target.value)}
          size='small'
          sx={{ flex: 1 }}
        />

        <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />
        <Button variant='outlined' onClick={handleOpen} size='small' startIcon={<DownloadIcon />}>
          Export
        </Button>

        <ConfigureRiskScoreSelect
          riskScoreColumns={riskScoreColumns}
          options={toggleableColumns}
          handleChangeRiskScores={handleChangeRiskScores}
        />
      </Box>
    </>
  );
}

export default EnhancedTableToolbar;
