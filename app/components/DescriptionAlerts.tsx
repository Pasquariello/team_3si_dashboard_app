import * as React from 'react';
import Alert, { type AlertColor } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { Snackbar } from '@mui/material';



interface DescriptionAlertsProps {
  severity?: string;
  message?: string;
  open: boolean;
  handleClose: () => void;
}


export default function DescriptionAlerts({severity, message, open, handleClose}: DescriptionAlertsProps )  {

  const tite: any  = {
    success: 'Success',
    error: 'Error',
    info: 'Info'
  }
  return (
    open && (
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity as AlertColor}
          variant="filled"
          sx={{ width: '100%' }}
        >
          <AlertTitle>{tite[severity as AlertColor]}</AlertTitle>
        {message}
        </Alert>
      </Snackbar>
    )
  );
}