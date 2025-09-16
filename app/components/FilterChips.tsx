import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useQueryParamsState } from '~/hooks/useQueryParamState';

const allowedKeys = [{ key: 'flagStatus', label: 'Filter Status' }];
export const FilterChips = () => {
  const [queryParams, updateQuery] = useQueryParamsState();

  const handleDelete = (key: string, value: string) => {
    updateQuery('offset', '0');
    updateQuery(key, value, "removeOne");
  };

  const items = allowedKeys.flatMap(({ key, label }) => {
    const values = queryParams.getAll(key);
    return values.length > 0 ? values.map(value => ({ key, label, value })) : [];
  });

  return (
    <Stack alignSelf={'flex-start'} direction='row' spacing={1}>
      {items.map(({ key, value, label }) => {
        return (
          <Chip
            key={`${key}-${value}`}
            label={`${label}: ${value}`}
            onDelete={() => handleDelete(key, value)}
          />
        );
      })}
    </Stack>
  );
};
