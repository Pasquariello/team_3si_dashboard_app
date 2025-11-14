import type { Route } from './+types/providerDetails';

import { redirect, useParams } from 'react-router';
import { Box, useTheme, Card, Typography, Button, CircularProgress, Backdrop } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import AuditLogTable from '~/components/providerData/auditTable';
import AddIcon from '@mui/icons-material/Add';
import { queryClient } from '~/queryClient';
import {
  getProviderDetails,
  getProviderInsights,
  onSave,
  type SaveInsightPayload,
} from '~/components/services/providerDataServices';
import { ProviderMetaDataSection } from '~/components/providerData/ProviderMetaDataSection';
import FlagModal from '~/components/modals/FlagModal';
import { useMemo, useState } from 'react';
import DescriptionAlerts from '~/components/DescriptionAlerts';
import FlagHistoryTable from '~/components/providerData/FlagHistoryTable';
import { useProviderDetails } from '~/hooks/useProviderDetails';
import { Edit } from '@mui/icons-material';
import { useProviderInsights } from '~/hooks/useProviderInsights';

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

  await queryClient.fetchQuery({
    queryKey: ['providerInsights', providerId],
    queryFn: async () => getProviderInsights(providerId),
  });

  return null;
}

export default function ProviderDetails() {
  let params = useParams();
  const [alert, setAlert] = useState<{ success: string; message: string } | null>(null);
  const [flagModalOpenId, setFlagModalOpenId] = useState<string | null>(null);

  const theme = useTheme();
  const [isLoadingOverlayActive, setIsLoadingOverlayActive] = useState(false);

  const { data: details, isLoading: isLoadingDetails } = useProviderDetails(params.providerId!);
  const { data: insights, isLoading: isLoadingInsights } = useProviderInsights(params.providerId!);

  const handleOnSave = async ({ insightData, action }: SaveInsightPayload) => {
    setIsLoadingOverlayActive(true);
    const res = await onSave({ insightData, action });
    setIsLoadingOverlayActive(false);
    if (res.ok) {
      setAlert({
        success: 'success',
        message: 'Successfully updated record!',
      });
      // this is ran after we get a success from out local payload
      setFlagModalOpenId(null);
      // data has changed in the DB
      queryClient.invalidateQueries({
        queryKey: ['annualProviderData'],
      });
      queryClient.invalidateQueries({
        queryKey: ['monthlyProviderData'],
      });
      queryClient.invalidateQueries({
        queryKey: ['providerInsights'],
      });
      queryClient.invalidateQueries({
        queryKey: ['provider'],
      });
    } else {
      setAlert({
        success: 'error',
        message: 'An Error Occurred',
      });
    }
  };
  // TODO: fix this async ref should be ProviderInsight type
  const check: any = useMemo(() => {
    return {
      providerName: details?.providerName || '',
      providerLicensingId: details?.providerLicensingId || '',
      ...insights,
    };
  }, [details, insights]);

  console.log(check);
  return (
    <>
      {isLoadingOverlayActive && (
        <Backdrop
          open={true}
          sx={theme => ({
            color: '#fff',
            zIndex: 100000, // ensure it's on top
          })}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      )}
      <FlagModal
        open={!!flagModalOpenId}
        onClose={() => setFlagModalOpenId(null)}
        onSave={handleOnSave}
        providerData={check} // providerInsight data
      />

      <DescriptionAlerts
        severity={alert?.success}
        message={alert?.message}
        open={alert !== null}
        handleClose={() => setAlert(null)}
      />
      <Box display='flex' flexDirection='column' gap={3} sx={{ px: 3 }}>
        <Box display='flex' gap={3}>
          <ProviderMetaDataSection data={details!} isLoading={isLoadingDetails} />
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
                  setFlagModalOpenId('123');
                }}
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  textTransform: 'none',
                }}
                startIcon={insights?.is_flagged ? <Edit /> : <AddIcon />}
              >
                {insights?.is_flagged ? 'Update Flag' : 'Add Flag'}
              </Button>
            </Box>
            <FlagHistoryTable history={insights?.history || []} isLoading={isLoadingInsights} />
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

      <Box
        sx={{
          display: 'flex',
          gap: 2,
        }}
      >
        <Card
          sx={{
            flex: 1,
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            p: 3,
            borderRadius: 2,
          }}
          variant='outlined'
        >
          <Box display='flex' justifyContent='space-between' alignItems='center' sx={{ mb: 1 }}>
            <Typography variant='h5'>Risk Score</Typography>

            <Box
              sx={{
                background: '#EF4444',
                borderRadius: 12,
                display: 'flex',

                alignItems: 'center',
                justifyContent: 'center',
                height: '40px',
                width: '47px',
              }}
            >
              <Typography lineHeight={1} variant='h5' color='white' fontWeight={600}>
                87
              </Typography>
            </Box>
          </Box>
          <Typography
            sx={{ mb: 3 }}
            variant='subtitle1'
            color={theme.palette.cusp_iron.contrastText}
          >
            Overall risk assessment based on selected factors
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box>
              <Box display='flex' justifyContent='space-between' sx={{ mb: 1 }}>
                <Typography fontWeight={700}>Billing Anomalies</Typography>
                <Typography fontWeight={700} color='#DC2626'>
                  92
                </Typography>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: 10,
                  background: '#F4F4F5',
                  borderRadius: '45px',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: '92%',
                    height: '100%',
                    position: 'absolute',
                    background: '#DC2626',
                    borderRadius: '45px',
                  }}
                />
              </Box>
              <Typography variant='subtitle2' color={theme.palette.cusp_iron.contrastText}>
                Unusual billing patterns detected in claims data
              </Typography>
            </Box>

            <Box>
              <Box display='flex' justifyContent='space-between' sx={{ mb: 1 }}>
                <Typography fontWeight={700}>Documentation Issue</Typography>
                <Typography fontWeight={700} color='#DC2626'>
                  85
                </Typography>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: 10,
                  background: '#F4F4F5',
                  borderRadius: '45px',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: '85%',
                    height: '100%',
                    position: 'absolute',
                    background: '#DC2626',
                    borderRadius: '45px',
                  }}
                />
              </Box>
              <Typography variant='subtitle2' color={theme.palette.cusp_iron.contrastText}>
                Missing or incomplete documentation for multiple claims
              </Typography>
            </Box>

            <Box>
              <Box display='flex' justifyContent='space-between' sx={{ mb: 1 }}>
                <Typography fontWeight={700}>Service Pattern Changes</Typography>
                <Typography fontWeight={700} color='#D97706'>
                  78
                </Typography>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: 10,
                  background: '#F4F4F5',
                  borderRadius: '45px',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: '78%',
                    height: '100%',
                    position: 'absolute',
                    background: '#D97706',
                    borderRadius: '45px',
                  }}
                />
              </Box>
              <Typography variant='subtitle2' color={theme.palette.cusp_iron.contrastText}>
                Significant change in service patterns over last quarter
              </Typography>
            </Box>

            <Box>
              <Box display='flex' justifyContent='space-between' sx={{ mb: 1 }}>
                <Typography fontWeight={700}>High Claim Volume</Typography>
                <Typography fontWeight={700} color='#D97706'>
                  65
                </Typography>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: 10,
                  background: '#F4F4F5',
                  borderRadius: '45px',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: '65%',
                    height: '100%',
                    position: 'absolute',
                    background: '#D97706',
                    borderRadius: '45px',
                  }}
                />
              </Box>
              <Typography variant='subtitle2' color={theme.palette.cusp_iron.contrastText}>
                Higher than average claim volume for provider type
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card
          sx={{
            flex: 1,
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            p: 3,
            gap: 2,
            borderRadius: 2,
          }}
          variant='outlined'
        >
          <Box>
            <Typography variant='h5'>Risk Score Over Times</Typography>
            <Typography
              sx={{ mb: 3 }}
              variant='subtitle1'
              color={theme.palette.cusp_iron.contrastText}
            >
              Overall risk trends
            </Typography>
          </Box>

          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
              },
            ]}
            height={300}
          />
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
            borderRadius: 2,
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
    </>
  );
}
