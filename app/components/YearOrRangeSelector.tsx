import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

type Props = {
  value: string;
  onChange: (event: any) => void;
};

const YearOrRangeSelector: React.FC<Props> = ({ value, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  return (
    <FormControl sx={{ flexShrink: 0, minWidth: 180 }}>
      <InputLabel id='year-select-label'>Select Period</InputLabel>
      <Select
        size='small'
        labelId='year-select-label'
        value={value}
        label='Select Period'
        onChange={onChange}
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
