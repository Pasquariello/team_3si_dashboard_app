import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Box, Divider, ListSubheader, styled } from '@mui/material';
import { FlagStatusMenuList } from './FlagStatusMenuList';
import { useState, type MouseEvent } from 'react';

export const StyledListHeader = styled(ListSubheader)({
  backgroundImage: 'var(--Paper-overlay)',
  fontWeight: 'bold',
  color: 'black',
});

export const TableFilterMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display={'flex'}>
      <Button
        variant='outlined'
        size='small'
        startIcon={<FilterAltOutlinedIcon />}
        id='filter-button'
        aria-controls={open ? 'grouped-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Filter
      </Button>
      <Menu
        id='grouped-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
            sx: {
              py: 0,
            },
          },
        }}
      >
        <StyledListHeader>Filter Options</StyledListHeader>

        <Divider />
        <FlagStatusMenuList />
        <Divider />
      </Menu>
    </Box>
  );
};
