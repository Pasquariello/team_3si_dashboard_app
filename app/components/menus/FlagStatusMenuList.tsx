import Check from '@mui/icons-material/Check';
import { MenuList, MenuItem, ListItemIcon, styled, Typography } from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';
import { useProviderFilters } from '~/contexts/providerFilterContext';

export const StyledListHeader = styled(ListSubheader)({
  backgroundImage: 'var(--Paper-overlay)',
  color: '#3F3F46B2',
  opacity: '70%',
});

export const FlagStatusMenuList = () => {
  const {
    filters: { flagged, unflagged },
    dispatchHandler,
  } = useProviderFilters();

  const handleFlagged = () => {
    dispatchHandler('SET_FLAGGED', !flagged);
  };

  const handleUnflagged = () => {
    dispatchHandler('SET_UNFLAGGED', !unflagged);
  };
  return (
    <MenuList dense>
      <StyledListHeader>Flag Status</StyledListHeader>
      <MenuItem selected={flagged} onClick={handleFlagged}>
        <ListItemIcon
          sx={{
            ...(flagged ? { visibility: 'unset' } : { visibility: 'hidden' }),
          }}
        >
          <Check />
        </ListItemIcon>

        <Typography>Flagged Providers</Typography>
      </MenuItem>
      <MenuItem selected={unflagged} onClick={handleUnflagged}>
        <ListItemIcon
          sx={{
            ...(unflagged ? { visibility: 'unset' } : { visibility: 'hidden' }),
          }}
        >
          <Check />
        </ListItemIcon>

        <Typography>Unflagged Providers</Typography>
      </MenuItem>
    </MenuList>
  );
};
