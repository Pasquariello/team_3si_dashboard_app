import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useQueryParams } from '~/contexts/queryParamContext';

export const FilterChips = ({
  allowedFilters,
}: {
  allowedFilters: { key: string; label: string }[];
}) => {
  const [params, updateQuery] = useQueryParams();
  const handleDelete = (key: string, value: string) => {
    // reset offset
    updateQuery({ type: 'SET', key: 'offset', value: '0' });
    updateQuery({ type: 'REMOVE_ONE', key, value });
  };

  const items = allowedFilters.flatMap(({ key, label }) => {
    const values = params.getAll(key);
    return values.length > 0 ? values.map(value => ({ key, label, value })) : [];
  });

  return (
    <Stack alignSelf={'flex-start'} direction='row' spacing={1}>
      {items.map(({ key, value, label }) => {
        return (
          <Chip
            key={`${key}-${value}`}
            label={`${label}: ${value.toLocaleUpperCase()}`}
            onDelete={() => handleDelete(key, value)}
          />
        );
      })}
    </Stack>
  );
};
