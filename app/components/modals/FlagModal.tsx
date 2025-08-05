import * as React from 'react';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Box, TextField } from '@mui/material';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';




export default function FlagModal ({id, row_data, open, onClose, onSave }: {id: number; open: boolean; onClose: () => void, onSave: (data: any) => void, row_data: any}) {
    const theme = useTheme();
    
    const [comment, setComment] = React.useState('');

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value)
    }

    const handleOnSave = () => {
        onSave({id, provider_licensing_id: row_data.provider_licensing_id , comment, is_flagged: true})
    }

    const handleRemoveFlag = () => {
        onSave({id, provider_licensing_id: row_data.provider_licensing_id , is_flagged: false })
    }


    return (
     
        <Dialog fullWidth onClose={onClose} open={open}>
    
            <IconButton
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
                    {/* <Box  gap={2} display="flex" alignItems="center"> */}
                        <Typography variant='h6'>
                            Provider Flag {id} 
                        </Typography>
                        {/* <Typography color="error" variant='body2'>
                            An Error Occured!
                        </Typography> */}
                    {/* </Box> */}
                </Box>
              
                <Typography sx={{color: theme.palette.cusp_iron.contrastText, fontWeight: 400, mb: 4, mt: 1}}>
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
                    value={comment}
                    onChange={handleTextChange}
            />
            </DialogContent>

            <DialogActions sx={{px: 3, pb: 3, justifyContent: 'space-between'}}>
                <Button 
                    variant="outlined" 
                    onClick={handleRemoveFlag}
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
                    onClick={handleOnSave}
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