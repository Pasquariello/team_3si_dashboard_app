import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Box, Button, MenuItem, Typography, useTheme } from '@mui/material';
import { FilterChips } from './FilterChips';
import { FlagStatusMenuList } from './menus/FlagStatusMenuList';
import { TableFilterMenu } from './menus/TableFilterMenu';
import { useQueryParams } from '~/contexts/queryParamContext';
import { CityMultiSelectMenu } from './menus/CityMultiSelectMenu';

export const providerFilters = [
  { key: 'flagStatus', label: 'Flag Status' },
  { key: 'cities', label: 'City' },
];

export const ProviderTableFilterBar = () => {
  const theme = useTheme();
  const [params, updateQuery] = useQueryParams();
  const clearAllFilters = () => {
    providerFilters.forEach(filter => {
      updateQuery({ type: 'DELETE', key: filter.key });
    });
  };
  return (
    <Box
      gap={1}
      display={'flex'}
      flex={1}
      justifyContent={'start'}
      width={'100%'}
      flexDirection='column'
    >
      <Box display={'flex'} flex={1} flexDirection={'row'} justifyContent={'space-between'}>
        <Box gap={0.5} display={'flex'} padding={1}>
          <FilterAltOutlinedIcon sx={{ alignSelf: 'center' }} />
          <Typography fontSize={'.8em'} fontWeight={'bold'} sx={{ alignSelf: 'center' }}>
            FILTERS:
          </Typography>

          {providerFilters.map(({ key, label }) => {
            return (
              // TODO: Make TableFilterMenu a Factory
              <Box key={label + key}>
                <TableFilterMenu filterName={label} queryKey={key}>
                  {key === 'flagStatus' && <FlagStatusMenuList queryKey={key} />}
                  {key === 'cities' && <CityMultiSelectMenu queryKey={key} />}
                </TableFilterMenu>
              </Box>
            );
          })}
        </Box>

        <Button
          sx={{
            justifySelf: 'flex-end',
          }}
          onClick={clearAllFilters}
        >
          <Typography sx={{ textTransform: 'none', color: theme.palette.cusp_woodsmoke.main }}>
            Clear All
          </Typography>
        </Button>
      </Box>

      <FilterChips allowedFilters={providerFilters} />
    </Box>
  );
};
