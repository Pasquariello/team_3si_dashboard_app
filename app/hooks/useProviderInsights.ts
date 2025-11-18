import { useQuery } from '@tanstack/react-query';
import { getProviderInsights } from '~/components/services/providerDataServices';
import type { ProviderInsightWithHistory } from '~/types';

export const useProviderInsights = (providerId: string) => {
  const queryKey = ['providerInsights', providerId];
  // update the loader query key to match here
  return useQuery<ProviderInsightWithHistory>({
    queryKey: queryKey,
    queryFn: async ({ pageParam }) => {
      return getProviderInsights(providerId);
    },
    staleTime: 1000 * 60 * 10, // 10-Min
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};
