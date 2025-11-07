import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate, useLocation, matchPath, useParams } from 'react-router';
import { breadcrumbMap, type Breadcrumb } from '~/routeConfigs';
import { Typography } from '@mui/material';
import { useMemo } from 'react';

export const NavBreadcrumbs = () => {
  function useBreadcrumbs() {
    const location = useLocation();
    const params = useParams();

    return useMemo(() => {
      const pathname = location.pathname;
      const breadcrumbs: { label: string; href: string }[] = [];

      // Sort routes shortest → longest, ensuring hierarchy order
      const sortedKeys = [...breadcrumbMap.keys()].sort((a, b) => a.length - b.length);

      for (const key of sortedKeys) {
        const value = breadcrumbMap.get(key);
        if (!value) continue;

        // Use `matchPath` with `end: true` to require exact match
        const exactMatch = matchPath({ path: key, end: true }, pathname);
        const partialMatch = matchPath({ path: key, end: false }, pathname);

        // Only add if it's either:
        // - an exact match for the current route
        // - OR a parent path that is a prefix of the current route (but not mismatched)
        if (exactMatch || (partialMatch && pathname.startsWith(value.route))) {
          let href = value.route;

          // Replace param placeholders only if they actually exist in `params`
          Object.entries(params).forEach(([paramKey, paramValue]) => {
            href = href.replace(`:${paramKey}`, String(paramValue));
          });

          breadcrumbs.push({
            label: value.label,
            href,
          });
        }
      }

      return breadcrumbs;
    }, [location.pathname, params]);
  }

  const crumbs = useBreadcrumbs();
  const navigate = useNavigate();

  return (
    <Stack spacing={2}>
      <Breadcrumbs separator={<ChevronRightIcon />} aria-label='breadcrumb'>
        {crumbs.length > 0 &&
          crumbs.map((crumb, index) => {
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
