import ExpandableTable from '~/components/table/ExpandableTable';
import { Box, Skeleton } from '@mui/material';
import { useOutletContext, useParams } from 'react-router';
import type { ReactNode } from 'react';

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
    <Box display={'flex'} overflow={'auto'}>
      {isLoading ? (
        <Box gap={0} display={'flex'} flexDirection={'column'} width={'100%'}>
          <Skeleton animation='wave' height={dimensions.height} width={dimensions.width} />
          <Skeleton animation='wave' height={dimensions.height} width={dimensions.width} />
          <Skeleton animation='wave' height={dimensions.height} width={dimensions.width} />
          <Skeleton animation='wave' height={dimensions.height} width={dimensions.width} />
          <Skeleton animation='wave' height={dimensions.height} width={dimensions.width} />
          <Skeleton animation='wave' height={dimensions.height} width={dimensions.width} />
          <Skeleton animation='wave' height={dimensions.height} width={dimensions.width} />
          <Skeleton animation='wave' height={dimensions.height} width={dimensions.width} />
          <Skeleton animation='wave' height={dimensions.height} width={dimensions.width} />
        </Box>
      ) : (
        <>{children}</>
      )}
    </Box>
  );
};

export default function ProviderScenarioTable() {
  const { providerId, view } = useParams();
  const outlet = useOutletContext<{ data: any; columnDefs: any; isFetching: boolean }>();

  if (!providerId || !view) {
    return null;
  }

  return (
    <SkeletonContentLoader
      isLoading={outlet.isFetching || !outlet.columnDefs}
      dimensions={{ height: 60, width: '100%' }}
    >
      <ExpandableTable data={outlet.data} columns={outlet.columnDefs} />
    </SkeletonContentLoader>
  );
}
