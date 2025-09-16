import { Tune } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { FilterChips } from './FilterChips';
import { FlagStatusMenuList } from './menus/FlagStatusMenuList';
import { TableFilterMenu } from './menus/TableFilterMenu';

export const ProviderTableFilterBar = () => {
  return (
    <Box
      gap={1}
      display={'flex'}
      flex={1}
      justifyContent={'start'}
      width={'100%'}
      flexDirection='column'
    >
      <Box display={'flex'} flex={1}>
        <Box gap={0.5} display={'flex'} padding={1}>
          <Tune sx={{ alignSelf: 'center' }} />
          <Typography fontSize={'.8em'} fontWeight={'bold'} sx={{ alignSelf: 'center' }}>
            FILTERS:
          </Typography>
        </Box>
        <TableFilterMenu filterName='Flag Status' queryKey={'flagStatus'}>
          <FlagStatusMenuList />
        </TableFilterMenu>
      </Box>
      <FilterChips />
      <Button>Clear All</Button>
    </Box>
  );
};
