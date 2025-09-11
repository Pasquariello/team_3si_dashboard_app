import { useInfiniteQuery } from '@tanstack/react-query';
import { redirect } from 'react-router';
import {
  FETCH_ROW_COUNT,
  getMonthlyData,
  type ProviderFilters,
} from '~/components/services/providerDataServices';
import type { Data } from '~/types';

export const useProviderMonthlyData = (
  date: string,
  offset: string,
  filters: Partial<ProviderFilters>,
  initialOffset?: string | number,
) => {
  const initOffset = Number(initialOffset) || 0
  return useInfiniteQuery<Data[]>({
    queryKey: ['monthlyProviderData', date, filters.flagged, filters.unflagged],
    queryFn: async ({ pageParam }) => {
      // pageParam defined by getNextPageParam below, offset should only come from the dataLoader
      const pageOffset = String(pageParam) || offset;
      return getMonthlyData(date, pageOffset, filters);
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
}
