import { MenuList, MenuItem, Typography, Radio } from '@mui/material';
import { useQueryParams } from '~/contexts/queryParamContext';
// TODO: small refactor would be nice, we need to clear offsets as well as update the flagged filter
export const FlagStatusMenuList = ({ queryKey }: { queryKey: string }) => {
  const [params, updateQuery] = useQueryParams();

  const flaggedStatus = params?.get(queryKey) || null;
  // set offset to 0, if we click flag while flagged is true, delete the key
  const handleFlagged = () => {
    updateQuery({ type: 'SET', key: 'offset', value: '0' });
    if (flaggedStatus === 'true') {
      updateQuery({ type: 'DELETE', key: queryKey });
      return;
    }
    updateQuery({ type: 'SET', key: queryKey, value: 'true' });
  };
  // set offset to 0, if we click unflag while unflagged is true, delete the key
  const handleUnflagged = () => {
    updateQuery({ type: 'SET', key: 'offset', value: '0' });

    if (flaggedStatus === 'false') {
      updateQuery({ type: 'DELETE', key: queryKey });
      return;
    }

    updateQuery({ type: 'SET', key: queryKey, value: 'false' });
  };
  // set offset and delete flag filter from url
  const handleAll = () => {
    updateQuery({ type: 'SET', key: 'offset', value: '0' });
    updateQuery({ type: 'DELETE', key: queryKey });
  };

  const isFlaggedChecked = flaggedStatus === 'true';
  const isUnflaggedChecked = flaggedStatus === 'false';

  return (
    <MenuList dense>
      <MenuItem onClick={handleAll}>
        <Radio
          checked={!isFlaggedChecked && !isUnflaggedChecked}
          onChange={handleAll}
          name='All Providers'
        />
        <Typography>All</Typography>
      </MenuItem>
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
