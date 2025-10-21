import { MenuList, MenuItem, Typography, Radio } from '@mui/material';
import { useQueryParams } from '~/contexts/queryParamContext';

export const FlagStatusMenuList = ({ queryKey }: { queryKey: string }) => {
  const [params, updateQuery] = useQueryParams();

  const flaggedStatus = params?.get(queryKey) || null;
  console.log('queryKey', queryKey)

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

  const handleToggleRadio = (value: string) => {
    
    if (value === 'all') {
      updateQuery({ type: 'DELETE', key: queryKey });
    }
    else { 
        updateQuery({ type: 'SET', key: queryKey, value });
    }

  }

  const isFlaggedChecked = flaggedStatus === 'true';
  const isUnflaggedChecked = flaggedStatus === 'false';

  return (
    <MenuList dense>
      <MenuItem onClick={() => handleToggleRadio('all')}>
        <Radio checked={!isFlaggedChecked && !isUnflaggedChecked} onChange={() => handleToggleRadio('all')} name='All Providers' />
        <Typography>All</Typography>
      </MenuItem>
      <MenuItem onClick={() => handleToggleRadio('flagged')}>
        <Radio checked={isFlaggedChecked} onChange={() => handleToggleRadio(true)} name='Flagged Providers' />
        <Typography>Flagged Providers</Typography>
      </MenuItem>
      <MenuItem onClick={() => handleToggleRadio(false)}>
        <Radio checked={isUnflaggedChecked} onChange={() => handleToggleRadio('unflagged')} name='Flagged Providers' />
        <Typography>Unflagged Providers</Typography>
      </MenuItem>
    </MenuList>
  );
};
