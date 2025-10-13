import { Box, Button, Divider, TextField, useTheme } from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import { useLocation, useParams } from 'react-router';
import {
  getMonthlyExportData,
  getYearlyExportData,
  type ProviderFilters,
} from '../services/providerDataServices';
import { useQueryParams } from '~/contexts/queryParamContext';
import { useMemo } from 'react';

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
    const tab = getTabValue(location?.pathname);
    if (tab === 'year') {
      getYearlyExportData(
        params.selectedYear!, // the loader ensures this will be here via redirect
        offset,
        filters
      );
    } else {
      getMonthlyExportData(params.date!, offset, filters);
    }
  };

  return (
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
        onClick={() => exportProviderData()}
        size='small'
        sx={{
          alignSelf: 'stretch',
        }}
        startIcon={<DownloadIcon />}
      >
        Export
      </Button>
    </Box>
  );
}

export default EnhancedTableToolbar;
