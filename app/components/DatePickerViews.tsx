import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { parseISO, isValid } from "date-fns";

interface DatePickerViewsProps {
  label: string;
  views: Array<"year" | "month">;
}

export default function DatePickerViews({
  label,
  views
}: DatePickerViewsProps) {
  const { date } = useParams();
  const navigate = useNavigate();

  const [value, setValue] = useState<Date | null>(null);

  // Load initial date from path param
  useEffect(() => {
    if (date) {
      const parsed = parseISO(date);
      if (isValid(parsed)) {
        setValue(parsed);
      }
    }
  }, [date]);

  const handleChange = (newDate: Date | null) => {
    // clean/verify date before setting
    setValue(newDate);
    if (newDate) {
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, "0");

      const pathname = location.pathname;
      const updatedPath = pathname
        .split("/")
        .map((segment) => (segment === date ? `${year}-${month}` : segment))
        .join("/");

      navigate(updatedPath);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        views={views}
        value={value}
        onChange={handleChange}
        slotProps={{ textField: { size: "small" } }}
      />
    </LocalizationProvider>
  );
}
