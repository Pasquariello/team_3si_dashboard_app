import { Box, Card, Skeleton, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useParams } from 'react-router';
import { useProviderDetails } from '~/hooks/useProviderDetails';
import theme from '~/theme';

const SkeletonContentLoader = ({
  isLoading,
  dimensions,
  children,
}: {
  isLoading: boolean;
  // one line of text = ~20 height
  dimensions: { height: number; width: string };
  children: ReactNode;
}) => {
  return (
    <>
      {isLoading ? (
        <Skeleton animation='wave' height={dimensions.height} width={dimensions.width} />
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export const ProviderMetaDataSection = () => {
  let params = useParams();
  const { data, isLoading } = useProviderDetails(params.providerId!);
  if (!isLoading && !data) {
    return null;
  }
  console.log(data);
  return (
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
      <SkeletonContentLoader isLoading={isLoading} dimensions={{ height: 50, width: '80%' }}>
        <Box>
          <Typography variant='h5'>{data?.providerName}</Typography>
          <Typography variant='body1' color={theme.palette.cusp_iron.contrastText}>
            {data?.providerLicensingId}
          </Typography>
        </Box>
      </SkeletonContentLoader>
      <SkeletonContentLoader isLoading={isLoading} dimensions={{ height: 80, width: '90%' }}>
        <Stack direction='row' spacing={3}>
          <Box>
            <Typography variant='subtitle1' color={theme.palette.cusp_iron.contrastText}>
              Provider Type
            </Typography>
            <Typography variant='body1'>{data?.providerType}</Typography>
          </Box>
          <Box>
            <Typography variant='subtitle1' color={theme.palette.cusp_iron.contrastText}>
              Phone
            </Typography>
            <Typography variant='body1'>{data?.providerPhone}</Typography>
          </Box>
          <Box>
            <Typography variant='subtitle1' color={theme.palette.cusp_iron.contrastText}>
              Last Audited
            </Typography>
            <Typography variant='body1'>2023-10-15</Typography>
          </Box>
        </Stack>
      </SkeletonContentLoader>
      <SkeletonContentLoader isLoading={isLoading} dimensions={{ height: 40, width: '90%' }}>
        <Box>
          <Typography variant='subtitle1' color={theme.palette.cusp_iron.contrastText}>
            Address
          </Typography>
          <Typography variant='body1'>{`${data?.postalAddress}, ${data?.city}, ${data?.zip}`}</Typography>
        </Box>
      </SkeletonContentLoader>
    </Card>
  );
};
