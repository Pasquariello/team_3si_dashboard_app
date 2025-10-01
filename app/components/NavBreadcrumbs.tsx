import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate, useLocation, matchPath } from 'react-router';
import { ROUTE_PATTERNS, routeOptions } from '~/routeConfigs';
import { Typography } from '@mui/material';

export const NavBreadcrumbs = () => {
  function useBreadcrumbs() {
    const location = useLocation();
    const matchedOption = routeOptions.find((opt, i) =>
      ROUTE_PATTERNS[i].some(pattern => matchPath({ path: pattern, end: false }, location.pathname))
    );

    if (!matchedOption) return [];
    return [
      {
        label: 'Provider Services',
        href: '/providerData',
      },
      {
        label: matchedOption.label,
        href: `${matchedOption.route}`,
      },
    ];
  }

  const crumbs = useBreadcrumbs();
  const navigate = useNavigate();

  return (
    <Stack spacing={2}>
      <Breadcrumbs separator={<ChevronRightIcon />} aria-label='breadcrumb'>
        {crumbs.map((crumb, index) => {
          return index === crumbs.length - 1 ? (
            <Typography key={index} fontWeight={'600'} color='text.primary'>
              {crumb.label}
            </Typography>
          ) : (
            <Link
              underline='hover'
              key={index}
              color='inherit'
              onClick={() => navigate(crumb.href)}
              sx={{ cursor: 'pointer', textTransform: 'capitalize' }}
            >
              {crumb.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Stack>
  );
};
