import { MenuList, MenuItem, Typography, Radio } from '@mui/material';
import { useQueryParamsState } from '~/hooks/useQueryParamState';

export const FlagStatusMenuList = () => {
  const [queryParams, updateQuery] = useQueryParamsState();

  // 'true' is flagged checked and unFlagged unchecked
  // 'false' is unflagged checked and flagged unchecked
  // both or neither equal empty param
  const flaggedStatus = queryParams?.get('flagStatus') || null;

  const handleFlagged = () => {
    updateQuery('offset', '0');
    if (flaggedStatus === 'true') {
      updateQuery('flagStatus', null);
      return;
    }
    updateQuery('flagStatus', 'true');
  };

  const handleUnflagged = () => {
    updateQuery('offset', '0');
    if (flaggedStatus === 'false') {
      updateQuery('flagStatus', null);
      return;
    }

    updateQuery('flagStatus', 'false');
  };

  const isFlaggedChecked = flaggedStatus === 'true';
  const isUnflaggedChecked = flaggedStatus === 'false';

  return (
    <MenuList dense>
      <MenuItem onClick={handleFlagged}>
        <Radio checked={isFlaggedChecked} onChange={handleFlagged} name='Flagged Providers' />
        <Typography>Flagged Providers</Typography>
      </MenuItem>
      <MenuItem onClick={handleUnflagged}>
        <Radio checked={isUnflaggedChecked} onChange={handleUnflagged} name='Flagged Providers' />
        <Typography>Unflagged Providers</Typography>
      </MenuItem>
    </MenuList>
  );
};
