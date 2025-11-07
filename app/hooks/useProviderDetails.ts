import { useQuery } from '@tanstack/react-query';
import { getProviderDetails } from '~/components/services/providerDataServices';
import type { ProviderDetails } from '~/types';

export const useProviderDetails = (providerId: string) => {
  // update the loader query key to match here
  return useQuery<ProviderDetails>({
    queryKey: ['provider', providerId],
    queryFn: async ({ pageParam }) => {
      return getProviderDetails(providerId);
    },
    staleTime: 1000 * 60 * 10, // 10-Min
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};
