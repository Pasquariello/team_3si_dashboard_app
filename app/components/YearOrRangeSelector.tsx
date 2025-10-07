import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { useQueryParams } from '~/contexts/queryParamContext';
import { createQueryStringFromFilters } from './services/providerDataServices';

const YearOrRangeSelector: React.FC<{}> = () => {
  const { selectedYear } = useParams();
  const navigate = useNavigate();
  const [queryParams, updateQuery] = useQueryParams();

  const [value, setValue] = useState<string | null>(selectedYear || null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  // Load initial year from path param
  useEffect(() => {
    if (selectedYear) {
      const parsed = years.includes(selectedYear);
      if (parsed) {
        setValue(selectedYear);
      }
    }
  }, [selectedYear]);

  const handleChange = (event: any) => {
    const newDate = event.target.value;
    setValue(newDate);
    if (newDate) {
      const pathname = location.pathname;
      const updatedPath = pathname
        .split('/')
        .map(segment => (segment === selectedYear ? String(newDate) : segment))
        .join('/');
        
      // -- Begin prep to persist filters on option change --
      updateQuery({
        key: 'offset',
        value: '0',
        type: 'SET',
      });

      const offset = queryParams?.get('offset') || '0';
      const flagStatus = queryParams?.get('flagStatus') || undefined;
      const cities = queryParams.getAll('cities') || undefined;
      let searchParams = '';

      const offsetMod = new URLSearchParams({ offset }).toString();
      searchParams += `?${offsetMod}`;

      const filters = {
        flagStatus,
        cities,
      };

      const queryString = createQueryStringFromFilters(filters);
      if (queryString) {
        searchParams += `&${queryString}`;
      }
      // TODO: persisting filters between navigation could be extracted, we have plenty of use cases for it.
      navigate(`${updatedPath}${searchParams}`);
    }
  };

  return (
    <FormControl sx={{ flexShrink: 0, minWidth: 180 }}>
      <InputLabel id='year-select-label'>Select Period</InputLabel>
      <Select
        size='small'
        labelId='year-select-label'
        value={value}
        label='Select Period'
        onChange={handleChange}
      >
        <MenuItem value='last12'>Last 12 Months</MenuItem>
        {years.map(year => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default YearOrRangeSelector;
