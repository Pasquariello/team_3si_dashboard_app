import { useInfiniteQuery } from '@tanstack/react-query';
import {
  FETCH_ROW_COUNT,
  getMonthlyData,
  type ProviderFilters,
} from '~/components/services/providerDataServices';
import type { MonthlyData } from '~/types';

export const useProviderMonthlyData = (
  date: string,
  offset: string,
  filters: Partial<ProviderFilters>,
  initialOffset?: string | number
) => {
  const initOffset = Number(initialOffset) || 0;
  const cityFilters = filters.cities ? filters.cities : [];
  // TODO: as we add filters we should update the with them!!
  const queryKey = ['monthlyProviderData', date, filters.flagStatus, ...cityFilters];
  return useInfiniteQuery<MonthlyData[]>({
    queryKey: queryKey,
    queryFn: async ({ pageParam }) => {
      // pageParam defined by getNextPageParam below, offset should only come from the dataLoader
      const pageOffset = String(pageParam) || offset;
      // ensure we don't send undefined as a value for filters
      const reqFilters = {
        ...(filters.flagStatus !== undefined ? { flagStatus: filters.flagStatus } : {}),
        ...(filters.cities !== undefined ? { cities: filters.cities } : {}),
      };

      return getMonthlyData(date, pageOffset, reqFilters);
    },
    initialPageParam: initOffset,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || typeof lastPage !== 'object') return undefined;

      if (!Array.isArray(lastPage) || lastPage.length < FETCH_ROW_COUNT) return undefined;

      return pages.length * FETCH_ROW_COUNT;
    },
    staleTime: 1000 * 60 * 10, // 10-Min
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};
