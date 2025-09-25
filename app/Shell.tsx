import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { type AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import { useState, type ReactNode } from 'react';
import { NavBreadcrumbs } from './components/NavBreadcrumbs';
import SvgIcon from '@mui/icons-material/Menu';
import { ReactComponent as GENOVIA } from './assets/GENOVIA.svg?react';
import Cusp from './assets/CUSP.png';
import { Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { generatePath, matchPath, useLocation, useNavigate } from 'react-router';
import { ROUTE_PATTERNS, routeOptions } from './routeConfigs';

const drawerWidth = 280;

const Main = styled('main', { shouldForwardProp: prop => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(0),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  overflow: 'hidden',
  alignItems: 'center',

  height: '60px',
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const DrawerFooter = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  padding: theme.spacing(1, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'space-evenly',
}));

export const Shell = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // TODO: Open the group that is match to the URL by default
  const [openInsights, setOpenInsights] = useState(false);
  const handleClick = () => {
    setOpenInsights(prev => !prev);
  };

  const handleDrawerOpen = () => {
    setOpen(prev => !prev);
  };

  const navigate = useNavigate();
  const navTo = (route: string) => {
    const ROUTE = `/providerData/:route`;
    const path = generatePath(ROUTE, {
      route: route.toLocaleLowerCase(),
    });
    navigate(path);
  };

  const getIsSelected = (option: string) => {
    return (
      ROUTE_PATTERNS.find((patterns, i) => {
        if (routeOptions[i] !== option) return false;
        return patterns.some(pattern =>
          matchPath({ path: pattern, end: false }, location.pathname)
        );
      }) !== undefined
    );
  };

  return (
    <Box sx={{ display: 'flex', pr: 2, pl: open ? 0 : 2 }}>
      <AppBar
        sx={{
          color: theme.palette.cusp_iron.contrastText,
          backgroundColor: theme.palette.primary.contrastText,
          boxShadow: 'none',
        }}
        position='fixed'
        open={open}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
          >
            <ViewSidebarOutlinedIcon sx={{ transform: 'scaleX(-1)' }} />
          </IconButton>
          <Divider sx={{ ml: 1.5, mr: 1, my: 2 }} orientation='vertical' flexItem />
          <NavBreadcrumbs />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          display: 'flex',
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            // TODO: we need to get SVG's instead of png to set this
            // backgroundColor: theme.palette.cusp_iron.main,
            width: drawerWidth,
            boxSizing: 'border-box',
            boxShadow:
              '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
          },
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <DrawerHeader>
          <SvgIcon
            component={GENOVIA}
            inheritViewBox
            sx={{ fontSize: '17rem', color: 'primary.main' }}
          />
        </DrawerHeader>
        <Box display={'flex'} flex={1} flexDirection={'column'} sx={{ overflowY: 'auto' }}>
          <List>
            <ListItemButton onClick={handleClick}>
              <Typography p={1} color={theme.palette.cusp_iron.contrastText}>
                Provider Insights
                {openInsights ? <ExpandLess /> : <ExpandMore />}
              </Typography>
            </ListItemButton>
            <Collapse in={openInsights} unmountOnExit>
              <List>
                {routeOptions.map((text, index) => {
                  const isSelected = getIsSelected(text);
                  return (
                    <ListItem key={text} disablePadding>
                      <ListItemButton selected={isSelected} onClick={() => navTo(text)}>
                        <ListItemIcon>
                          <CalendarMonthOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText sx={{ textTransform: 'capitalize' }} primary={text} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>
          </List>
        </Box>

        <DrawerFooter>
          <Typography>Powered By</Typography>
          <Box
            display={'flex'}
            alignSelf={'start'}
            component='img'
            src={Cusp}
            sx={{ width: '6rem', height: '2.5rem' }}
            alt='logo'
          />
        </DrawerFooter>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};
