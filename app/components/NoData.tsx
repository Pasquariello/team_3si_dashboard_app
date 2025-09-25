import { Box, Typography, useTheme } from '@mui/material';

export default function NoData() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.contrastText,
      }}
    >
      <Typography
        sx={{
          fontSize: 64,
          color: '#eee',
        }}
      >
        NO DATA
      </Typography>
    </Box>
  );
}
