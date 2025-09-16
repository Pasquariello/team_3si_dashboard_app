import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Badge, Box, Typography, useTheme } from '@mui/material';
import { useContext, useMemo, useState, type MouseEvent } from 'react';
import { QueryParamsContext } from '~/contexts/queryParamContext';

type TableFilterMenuProps = Readonly<{
  filterName: string;
  queryKey: string;
  children: React.ReactNode;
  startIcon?: boolean;
}>;

export const TableFilterMenu = ({
  filterName,
  queryKey,
  children,
  startIcon,
}: TableFilterMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const open = Boolean(anchorEl);
  const [queryParams] = useContext(QueryParamsContext)!;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // queryKey must align to a queryParam
  const selectedValues = useMemo(() => {
    const param = queryParams.getAll(queryKey);
    return new Set(param);
  }, [queryParams, queryKey]);

  return (
    <Box display={'flex'}>
      <Button
        variant='outlined'
        sx={{
          color: theme.palette.cusp_iron.contrastText,
          borderColor: theme.palette.cusp_iron.contrastText,
          display: 'flex',
          alignItems: 'center',
          gap: 0, // space between text and badge
          textTransform: 'none',
          alignSelf: 'center',
          px: 3,
          py: 1,
        }}
        size='small'
        startIcon={startIcon ? <FilterAltOutlinedIcon /> : null}
        id='filter-button'
        aria-controls={open ? 'grouped-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        title={filterName}
        endIcon={
          selectedValues.size !== 0 && (
            <Box
              sx={{
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Badge
                badgeContent={selectedValues.size}
                color='primary'
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: 'black',
                    color: 'white',
                    fontSize: '0.75rem',
                    borderRadius: '50%',
                  },
                }}
              />
            </Box>
          )
        }
      >
        <Typography textTransform={'none'} fontWeight={600} variant='caption' fontSize={'.8rem'}>
          {filterName}
        </Typography>
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
        {children}
      </Menu>
    </Box>
  );
};
