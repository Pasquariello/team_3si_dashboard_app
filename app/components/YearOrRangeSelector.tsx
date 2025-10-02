import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router';

const YearOrRangeSelector: React.FC<{}> = () => {
  const { year } = useParams();
  const navigate = useNavigate();

  const [value, setValue] = useState<string | null>(year || null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  // Load initial year from path param
  useEffect(() => {
    if (year) {
      const parsed = years.includes(year);
      if (parsed) {
        setValue(year);
      }
    }
  }, [year]);

  const handleChange = (event: any) => {
    const newDate = event.target.value;
    setValue(newDate);
    if (newDate) {
      const pathname = location.pathname;
      const updatedPath = pathname
        .split('/')
        .map(segment => (segment === year ? String(newDate) : segment))
        .join('/');
      console.log(updatedPath, newDate);

      navigate(updatedPath);
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
