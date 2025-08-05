import * as React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { DateView } from '@mui/x-date-pickers/models';

interface DatePickerViewsProps {
  label: string;
  views: DateView[]; // e.g., ['year'], ['year', 'month']
}


export default function DatePickerViews({ label, views }: DatePickerViewsProps) { 
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker  
                disableFuture
                slotProps={{ textField: { size: 'small' } }} // 👈 this makes it smaller like TextField
                label={label} views={views}
            />
        </LocalizationProvider>
    );
}