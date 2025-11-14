import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Box, CircularProgress, TextField } from '@mui/material';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import type { ProviderInsight } from '~/types';
import { useEffect, useState } from 'react';
import DatePickerViews from '../DatePickerViews';
import { parseISO } from 'date-fns';
import type { SaveInsightPayload } from '../services/providerDataServices';

type FlagModalProps = Readonly<{
  open: boolean;
  onClose: () => void;
  onSave: (data: SaveInsightPayload) => void;
  providerData: Awaited<ProviderInsight & { providerName: string }>;
}>;
// providerData contains up-to-date isFlagged and up-to-date comment
export default function FlagModal({ providerData, open, onClose, onSave }: FlagModalProps) {
  useEffect(() => {
    setComment(providerData?.comment || '');
  }, [providerData?.comment]);

  useEffect(() => {
    const createdDate = providerData?.created_at || new Date().toISOString();
    setFlagDate(parseISO(createdDate));
  }, [providerData?.created_at]);

  if (!providerData) {
    return <CircularProgress />;
  }

  const theme = useTheme();
  const [comment, setComment] = useState('');
  const [flagDate, setFlagDate] = useState<Date>(new Date());

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };
  console.log(providerData);

  // send whole record, just make sure the action is correct
  const handleOnSave = () => {
    // if undefined or a false value we re-write the flag record
    const isNewFlag = !providerData?.is_flagged;

    if (isNewFlag) {
      const insightData: SaveInsightPayload['insightData'] = {
        providerLicensingId: providerData?.providerLicensingId,
        comment,
        isFlagged: true,
        // created_by default to "system"
        createdAt: flagDate.toISOString(),
      };
      onSave({ insightData, action: 'CREATE' });
      return;
    }

    if (providerData.is_flagged) {
      const insightData: SaveInsightPayload['insightData'] = {
        providerLicensingId: providerData?.providerLicensingId,
        createdAt: flagDate.toISOString(),
        // created_by default to "system"
        comment,
      };
      onSave({ insightData, action: 'UPDATE' });
      return;
    }
  };

  const handleRemoveFlag = () => {
    if (providerData) {
      const resolvedDate = new Date().toISOString();
      const insightData: SaveInsightPayload['insightData'] = {
        providerLicensingId: providerData?.providerLicensingId,
        comment,
        isFlagged: false,
        // created_by default to "system"
        resolvedOn: resolvedDate,
      };
      onSave({ insightData, action: 'RESOLVE' });
    }
  };

  return (
    <Dialog fullWidth onClose={onClose} open={open}>
      <IconButton
        onClick={onClose}
        sx={theme => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 3 }}>
        <Box display={'flex'} gap={2}>
          <OutlinedFlagIcon sx={{ color: theme.palette.cusp_orange.main }} />
          {/* <Box  gap={2} display="flex" alignItems="center"> */}
          <Typography variant='h6'>Flag {providerData.providerName}</Typography>
          {/* <Typography color="error" variant='body2'>
                            An Error Occured!
                        </Typography> */}
          {/* </Box> */}
        </Box>

        <Typography
          sx={{ color: theme.palette.cusp_iron.contrastText, fontWeight: 400, mb: 4, mt: 1 }}
        >
          Add optional notes about the reasons for flagging this provider.
        </Typography>
        <Box display={'flex'} justifyContent={'end'}>
          <DatePickerViews
            initialDate={flagDate.toISOString()}
            label={'Flag Date'}
            views={['year', 'month']}
            handler={setFlagDate}
          />
        </Box>
        <Typography>Notes</Typography>
        <TextField
          fullWidth
          placeholder='Describe the reasons for flagging this provider...'
          multiline
          rows={4}
          sx={{ mt: 1 }}
          value={comment ? comment : ''}
          onChange={handleTextChange}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
        <Button
          variant='outlined'
          disabled={!providerData.is_flagged}
          onClick={handleRemoveFlag}
          sx={{
            color: theme.palette.error.main, // Sets the text color to white
            borderColor: theme.palette.cusp_iron.main, // Sets the background color to blue
            '&:hover': {},
          }}
        >
          Remove Flag
        </Button>
        <Button
          onClick={handleOnSave}
          sx={{
            bgcolor: 'black',
            color: 'white',
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
