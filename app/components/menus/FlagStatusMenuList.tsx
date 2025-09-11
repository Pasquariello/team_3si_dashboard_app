import Check from '@mui/icons-material/Check';
import { MenuList, MenuItem, ListItemIcon, styled, Typography } from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';
// import { useProviderFilters } from '~/contexts/providerFilterContext';
import { useQueryParamsState } from '~/hooks/useQueryParamState';

export const StyledListHeader = styled(ListSubheader)({
  backgroundImage: 'var(--Paper-overlay)',
  color: '#3F3F46B2',
  opacity: '70%',
});

export const FlagStatusMenuList = () => {
  const [queryParams, updateQuery] = useQueryParamsState();
  const isFlagged = queryParams?.get('flagged') || null;
  const isUnflagged = queryParams?.get('unflagged') || null;

  const handleFlagged = () => {
    updateQuery('offset', '0');
    isFlagged === 'true' ? updateQuery('flagged', null) : updateQuery('flagged', 'true');
  };

  const handleUnflagged = () => {
    updateQuery('offset', '0');
    isUnflagged === 'true' ? updateQuery('unflagged', null) : updateQuery('unflagged', 'true');
  };

  const isFlaggedChecked = isFlagged === 'true';
  const isUnflaggedChecked = isUnflagged === 'true';
  return (
    <MenuList dense>
      <StyledListHeader>Flag Status</StyledListHeader>
      <MenuItem selected={Boolean(isFlagged)} onClick={handleFlagged}>
        <ListItemIcon
          sx={{
            ...(isFlaggedChecked ? { visibility: 'unset' } : { visibility: 'hidden' }),
          }}
        >
          <Check />
        </ListItemIcon>

        <Typography>Flagged Providers</Typography>
      </MenuItem>
      <MenuItem selected={Boolean(isUnflagged)} onClick={handleUnflagged}>
        <ListItemIcon
          sx={{
            ...(isUnflaggedChecked ? { visibility: 'unset' } : { visibility: 'hidden' }),
          }}
        >
          <Check />
        </ListItemIcon>

        <Typography>Unflagged Providers</Typography>
      </MenuItem>
    </MenuList>
  );
};
