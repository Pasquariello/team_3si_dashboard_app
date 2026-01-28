import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const YearOrRangeSelector: React.FC<{ date: string; setAnnualViewData: (val: string) => void }> = ({
  date,
  setAnnualViewData,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  return (
    <FormControl sx={{ flexShrink: 0, minWidth: 180 }}>
      <InputLabel id='year-select-label'>Select Period</InputLabel>
      <Select
        size='small'
        labelId='year-select-label'
        value={date}
        label='Select Period'
        onChange={setAnnualViewData}
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
