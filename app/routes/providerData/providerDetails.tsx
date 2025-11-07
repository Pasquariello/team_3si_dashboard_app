import * as React from 'react';
import type { Route } from './+types/providerDetails';

import { Outlet, redirect, useLocation, useMatch, useParams } from 'react-router';
import { Tabs, Tab, Box, useTheme, Card, Typography, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router';

import { useQueryParams } from '~/contexts/queryParamContext';
import AuditLogTable from '~/components/providerData/auditTable';

import AddIcon from '@mui/icons-material/Add';
import { queryClient } from '~/queryClient';
import { getProviderDetails } from '~/components/services/providerDataServices';
import { ProviderMetaDataSection } from '~/components/providerData/ProviderMetaDataSection';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Provider Details' }, { name: 'description', content: 'providerDetails' }];
}
export async function loader({ params, request }: Route.LoaderArgs) {
  let providerId = params?.providerId;
  if (!providerId) {
    return redirect('provider/risk-audit');
  }

  const queryKey = ['provider', providerId];
  console.log({ params, request });

  await queryClient.fetchQuery({
    queryKey: queryKey,
    queryFn: async () => getProviderDetails(providerId),
  });

  return null;
}

export default function ProviderData() {
  const navigate = useNavigate();
  const location = useLocation();
  let params = useParams();
  const [queryParams, updateQuery] = useQueryParams();

  const theme = useTheme();

  return (
    <Box display='flex' flexDirection='column' gap={3} sx={{ px: 3 }}>
      <Box display='flex' gap={3}>
        <ProviderMetaDataSection />

        <Card
          sx={{
            flex: 1,
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            p: 3,
            gap: 2,
          }}
          variant='outlined'
        >
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h5'>Flags</Typography>
            <Button
              onClick={() => {
                console.log('Pressed Me!');
              }}
              sx={{
                bgcolor: 'black',
                color: 'white',
                textTransform: 'none',
              }}
              startIcon={<AddIcon />}
            >
              Add Flag
            </Button>
          </Box>

          <Stack direction='row' spacing={3}>
            <Box>
              <Typography variant='subtitle1' color={theme.palette.cusp_iron.contrastText}>
                Provider Type
              </Typography>
              <Typography variant='body1'>Home Health Agency</Typography>
            </Box>
            <Box>
              <Typography variant='subtitle1' color={theme.palette.cusp_iron.contrastText}>
                Phone
              </Typography>
              <Typography variant='body1'>(555) 123-4567</Typography>
            </Box>
            <Box>
              <Typography variant='subtitle1' color={theme.palette.cusp_iron.contrastText}>
                Last Audited
              </Typography>
              <Typography variant='body1'>2023-10-15</Typography>
            </Box>
          </Stack>

          <Box>
            <Typography variant='subtitle1' color={theme.palette.cusp_iron.contrastText}>
              Address
            </Typography>
            <Typography variant='body1'>123 Medical Parkway, Springfield, IL 62704</Typography>
          </Box>
        </Card>
      </Box>

      <Box>
        <Card
          sx={{
            flex: 1,
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            p: 3,
            gap: 2,
          }}
          variant='outlined'
        >
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Box>
              <Typography variant='h5'>Audit History</Typography>
              <Typography variant='body1' color={theme.palette.cusp_iron.contrastText}>
                {' '}
                Record of previous audits and findings
              </Typography>
            </Box>
            <Button
              onClick={() => {
                console.log('Pressed Me!');
              }}
              sx={{
                bgcolor: 'black',
                color: 'white',
                textTransform: 'none',
              }}
              startIcon={<AddIcon />}
            >
              Add Audit Log
            </Button>
          </Box>

          <AuditLogTable />
        </Card>
      </Box>
    </Box>
  );
}
