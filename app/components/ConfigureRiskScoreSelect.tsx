import * as React from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Switch, Typography } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};




export default function ConfigureRiskScoreSelect({riskScoreColumns, options, handleChangeRiskScores}) {
    const [modalOpen, setModalOpen] = React.useState(false);

    const handleOpenModal = () => {
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
    }

  return (
    <>
        <Button 
            variant='outlined'
            startIcon={<TuneIcon/>}
            sx={{
            whiteSpace: 'nowrap',
            minWidth: 0,
       
            }}
            // startIcon={<DownloadIcon />}
            onClick={handleOpenModal}
        >
            Configure Risk Score
        </Button>

        <Dialog open={modalOpen} onClose={handleCloseModal} aria-labelledby='confirm-dialog-title'>
        <DialogTitle id='confirm-dialog-title' fontWeight={'bold'}>
          Toggle Risk Scores:
        </DialogTitle>

        <DialogContent>
          <Typography>
            Select which Risk Score Calculation options you want to include when generating the overall risk score.
          </Typography>
          
          <Box sx={{
            my: 2
          }}>
            <FormGroup >
                {options.map((option: any) => {
                    const value = riskScoreColumns[option.id];
                    return (
                        <FormControlLabel 
                            key={option.id}
                            control={
                                <Switch 
                                    name={option.id} 
                                    value={value.id} 
                                    onChange={handleChangeRiskScores} 
                                    checked={value.display} 
                                    color="info"
                                />
                            }
                            label={option.label} 
                        />
                    )
                })}
            </FormGroup>
        </Box>

        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal} color='inherit'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}