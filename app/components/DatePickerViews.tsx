import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState } from 'react';
import { isValid, parseISO } from 'date-fns';
import { NoSsr } from '@mui/material';

interface DatePickerViewsProps {
  // initialDate: string;
  label: string;
  views: Array<'year' | 'month'>;
  date: string;
  setMonthlyViewData: () => null
}

export default function DatePickerViews({label, views, date, setMonthlyViewData }: DatePickerViewsProps) {

  const [value, setValue] = useState<Date | null>(null);
  // TODO - decide what we need here
  // const [queryParams, updateQuery] = useQueryParams();
  // let value = parseISO(date);

  // // Load initial date from path param
  useEffect(() => {
    if (date) {

      const [year, month] = date.split("-");
      let value = new Date(Number(year), Number(month) - 1);
      // const parsed = parseISO(date);
      if (isValid(value)) {
        setValue(value);
      }
    }
  }, [date]);

  const handleChange = (newDate: Date | null) => {
    setValue(newDate);
  };

  return (
    <NoSsr>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        disableFuture
        label={label}
        views={views}
        value={value}
        onChange={handleChange}
        onAccept={setMonthlyViewData}
        slotProps={{ textField: { size: 'small' } }}
      />
    </LocalizationProvider>
    </NoSsr>

  );
}

// TODO - Taylor and Justin to resolve
//   handler?: (newDate: Date) => void;
// }
// export default function DatePickerViews({
//   initialDate,
//   label,
//   views,
//   handler,
// }: DatePickerViewsProps) {
//   const [value, setValue] = useState<Date | null>(parseISO(initialDate));
//   const handleChange = (newDate: Date | null) => {
//     // clean/verify date before setting
//     setValue(() => {
//       if (newDate && handler) {
//         handler(newDate);
//       }
//       return newDate;
//     });