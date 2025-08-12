import Check from '@mui/icons-material/Check';
import { MenuList, MenuItem, ListItemIcon, styled } from '@mui/material';
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
      <MenuItem onClick={handleFlagged}>
        {flagged && (
          <ListItemIcon>
            <Check />
          </ListItemIcon>
        )}
        Flagged Providers
      </MenuItem>
      <MenuItem onClick={handleUnflagged}>
        {unflagged && (
          <ListItemIcon>
            <Check />
          </ListItemIcon>
        )}
        Unflagged Providers
      </MenuItem>
    </MenuList>
  );
};
