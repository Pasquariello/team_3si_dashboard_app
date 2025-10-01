import { Box, Button, Divider, TextField, useTheme } from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import { env } from '~/env';

function EnhancedTableToolbar({ searchHandler }: { searchHandler: (val: string) => void }) {
  const theme = useTheme();

  const exportProviderData = async () => {
    console.log('hello')
const response = await fetch(`${env.VITE_API_ROOT_API_URL}/providerData/export/2024`);
  if (!response.ok) throw new Error('Network response was not ok');

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'providers_2024.csv';
  link.click();

  window.URL.revokeObjectURL(url);
  }


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
