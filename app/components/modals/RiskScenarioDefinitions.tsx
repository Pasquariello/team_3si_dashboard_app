import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ScenarioDefinition {
  id: number;
  label: string;
  tooltip: string;
  path: string;
}

export interface RiskScenarioDefinitionsProps {
  scenarioConfig?: ScenarioDefinition[];
  buttonTooltipText?: string;
}

export default function RiskScenarioDefinitions({
  scenarioConfig,
  buttonTooltipText,
}: RiskScenarioDefinitionsProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={buttonTooltipText || ''} arrow>
        <Button onClick={handleOpen} color='primary' sx={{ textTransform: 'none' }}>
          <InfoIcon sx={{ mr: 1 }} />
          <Typography sx={{ pt: 1 }}>Definitions</Typography>
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth='md'
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              p: 2,
              maxHeight: '90vh',
              backgroundColor: '#f9f9f9', // Light background for the modal
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #eee',
            pb: 2,
            pt: 2,
            px: 3,
          }}
        >
          <Typography variant='h5' component='div' fontWeight='bold'>
            Risk Scenario Definitions
          </Typography>
          <IconButton aria-label='back' onClick={handleClose} size='small' sx={{ p: 0.5 }}>
            <ArrowBackIcon fontSize='small' />
            <Typography variant='body2' sx={{ ml: 0.5, fontWeight: 'bold' }}>
              Back
            </Typography>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 3, mt: 1, py: 2, overflowY: 'auto' }}>
          {scenarioConfig?.map(scenario => (
            <Box key={scenario.id} sx={{ mb: 3 }}>
              <Typography variant='h6' component='h3' fontWeight='bold' sx={{ mb: 0.5 }}>
                {scenario.label}
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                {scenario.tooltip}
              </Typography>
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
}
