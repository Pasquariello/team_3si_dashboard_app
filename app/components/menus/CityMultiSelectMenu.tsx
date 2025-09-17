import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { Checkbox } from '@mui/material';
import { useQueryParams } from '~/contexts/queryParamContext';
import { providerFilters } from '../ProviderTableFilterBar';
import { useQuery } from '@tanstack/react-query';
import { getProviderCities } from '../services/providerDataServices';
import { useEffect, useState } from 'react';

interface Option {
  title: string;
}

export function CityMultiSelectMenu({ queryKey }: { queryKey: string }) {
  const [params, updateQuery] = useQueryParams();
  const cities = params.getAll('cities') || null;
  const [inputValue, setInputValue] = useState('');

  const {
    data: options = [],
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [queryKey, inputValue],
    queryFn: async () => {
      const res = await getProviderCities(inputValue);
      console.log(res);
      return res.map(city => ({
        title: city,
      }));
    },
    enabled: false,
  });

  useEffect(() => {
    if (!inputValue.trim()) return; // don’t run on empty input

    const handler = setTimeout(() => {
      refetch();
    }, 300); // debounce 300ms

    return () => clearTimeout(handler);
  }, [inputValue, refetch]);

  const onItemClick = (
    option: { title: string },
    selected: boolean,
    values: { title: string }[],
    reason: string
  ) => {
    console.log(reason);
    if (reason === 'selectOption') {
      updateQuery({ type: 'ADD', key: queryKey, value: option.title });
    }
    if (reason === 'removeOption') {
      updateQuery({ type: 'REMOVE_ONE', key: queryKey, value: option.title });
    }
  };
  const clearAllFilters = () => {
    providerFilters.forEach(filter => {
      updateQuery({ type: 'DELETE', key: filter.key });
    });
  };
  const clearAll = () => {
    clearAllFilters();
  };

  console.log(options);

  // const stub = [
  //   { title: 'Amadeus' },
  //   { title: 'To Kill a Mockingbird' },
  //   { title: 'Toy Story 3' },
  //   { title: 'Logan' },
  //   { title: 'Full Metal Jacket' },
  //   { title: 'Dangal' },
  //   { title: 'The Sting' },
  //   { title: '2001: A Space Odyssey' },
  //   { title: "Singin' in the Rain" },
  //   { title: 'Toy Story' },
  //   { title: 'Bicycle Thieves' },
  //   { title: 'The Kid' },
  //   { title: 'Inglourious Basterds' },
  //   { title: 'Snatch' },
  //   { title: '3 Idiots' },
  //   { title: 'Monty Python and the Holy Grail' },
  // ];
  return (
    <Autocomplete
      onOpen={async () => refetch()}
      loading={isFetching}
      multiple
      options={options}
      inputValue={inputValue}
      onInputChange={(event, value, reason) => {
        if (reason === 'input') {
          setInputValue(value);
        }
      }}
      value={cities.map(city => ({
        title: city,
      }))}
      disableCloseOnSelect
      clearIcon={
        <CloseIcon
          // onMouseDown={e => e.stopPropagation()} // stop menu from closing
          onClick={() => {
            clearAll(); // your external handler
          }}
        />
      }
      onChange={(event, newValue, reason, details) => {
        console.log(reason, newValue, details);
        // `details.option` is the item that triggered this change
        if (onItemClick && details?.option) {
          const selected = newValue.includes(details.option);
          onItemClick(details.option, selected, newValue, reason);
        }
      }}
      sx={{ minWidth: '250px', maxWidth: '250px', mt: 0.75 }}
      getOptionLabel={option => option.title}
      renderInput={params => <TextField {...params} label='Select cities' placeholder='Type...' />}
      renderValue={(value: Option[], getTagProps) =>
        value.map((option, index) => (
          <StyledChip label={option.title} deleteIcon={<CloseIcon />} {...getTagProps({ index })} />
        ))
      }
      renderOption={(props, option) => (
        <li {...props}>
          <Checkbox checked={cities.includes(option.title)} />
          {option.title}
        </li>
      )}
    />
  );
}

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '& .MuiChip-deleteIcon': {
    fontSize: '16px',
  },
}));
