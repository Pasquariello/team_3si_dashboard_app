import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState } from 'react';
import { parseISO } from 'date-fns';

interface DatePickerViewsProps {
  initialDate: string;
  label: string;
  views: Array<'year' | 'month'>;
  handler?: (newDate: Date) => void;
}
export default function DatePickerViews({
  initialDate,
  label,
  views,
  handler,
}: DatePickerViewsProps) {
  const [value, setValue] = useState<Date | null>(parseISO(initialDate));
  const handleChange = (newDate: Date | null) => {
    // clean/verify date before setting
    setValue(() => {
      if (newDate && handler) {
        handler(newDate);
      }
      return newDate;
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        disableFuture
        label={label}
        views={views}
        value={value}
        onChange={handleChange}
        slotProps={{ textField: { size: 'small' } }}
      />
    </LocalizationProvider>
  );
}
