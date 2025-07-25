import * as React from 'react';
import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Box, TextField } from '@mui/material';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';




export default function FlagModal ({id, open, onClose }: {id: number; open: boolean; onClose: () => void }) {
  const theme = useTheme();
  
  const [note, setNote] = React.useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value)
  }

  return (
     
    <Dialog fullWidth onClose={onClose} open={open}>
   
        <IconButton
            aria-label="close"
            onClick={onClose}
            sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
            })}
        >
            <CloseIcon />
        </IconButton>
        <DialogContent sx={{p: 3 }}>
            <Box display={'flex'} gap={2}>
                <OutlinedFlagIcon sx={{ color: theme.palette.cusp_orange.main }}/>
                <Typography variant='h6'>
                    Provider Flag {id}
                </Typography>
            </Box>
            <Typography sx={{color: '#71717A', fontWeight: 400, mb: 4, mt: 1}}>
            Add optional notes about the reasons for flagging this provider.
            </Typography>
            <Typography>
            Notes
            </Typography>
            <TextField
                fullWidth
                placeholder="Describe the reasons for flagging this provider..."
                multiline
                rows={4}
                sx={{mt: 1}}
                value={note}
                onChange={handleTextChange}
                // maxRows={4}
            />
    </DialogContent>
    <DialogActions sx={{px: 3, pb: 3, justifyContent: 'space-between'}}>
            <Button 
                variant="outlined" 
                onClick={onClose}
                sx={{
                    color: theme.palette.error.main, // Sets the text color to white
                    borderColor: theme.palette.cusp_iron.main, // Sets the background color to blue
                    '&:hover': {
                    },
                }}
            >
                Remove Flag
            </Button>
            <Button 
                onClick={onClose}
                sx={{
                    bgcolor: 'black',
                    color: 'white'
                }}
            >
                Save 
            </Button>
        </DialogActions>
    </Dialog>
  );
}