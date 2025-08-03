import { Box, Typography } from '@mui/material';

export default function NoData () {
  return (
      <Box sx={{ display: 'flex', flexGrow: 1,  height: '100%',   justifyContent: 'center', alignItems: 'center' }}>
            <Typography sx={{
                fontSize: 64,
                color: '#eee'
            }}>NO DATA</Typography>
        </Box>
  );
}