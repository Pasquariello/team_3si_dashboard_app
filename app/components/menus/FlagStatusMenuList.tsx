import { MenuList, MenuItem, Typography, Radio } from '@mui/material';
import { useContext } from 'react';
import { QueryParamsContext } from '~/contexts/queryParamContext';

export const FlagStatusMenuList = ({ queryKey }: { queryKey: string }) => {
  const [params, updateQuery] = useContext(QueryParamsContext)!;

  const flaggedStatus = params?.get(queryKey) || null;

  const handleFlagged = () => {
    updateQuery({ type: 'SET', key: 'offset', value: '0' });
    if (flaggedStatus === 'true') {
      updateQuery({ type: 'DELETE', key: queryKey });
      return;
    }
    updateQuery({ type: 'SET', key: queryKey, value: 'true' });
  };

  const handleUnflagged = () => {
    updateQuery({ type: 'SET', key: 'offset', value: '0' });
    if (flaggedStatus === 'false') {
      updateQuery({ type: 'DELETE', key: queryKey });
      return;
    }

    updateQuery({ type: 'SET', key: queryKey, value: 'false' });
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
