import { Box, Button, Divider, TextField, useTheme } from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';

function EnhancedTableToolbar({ searchHandler }: { searchHandler: (val: string) => void }) {
  const theme = useTheme();
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
