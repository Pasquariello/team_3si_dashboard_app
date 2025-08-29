import { useInfiniteQuery } from '@tanstack/react-query';
import type { ProviderFilters } from '~/contexts/providerFilterContext';
import { FETCH_ROW_COUNT, getMonthlyData } from '~/data-loaders/providerMonthlyData';

export const useProviderMonthlyData = (
  date: string,
  offset: string,
  filters: ProviderFilters,
  initialOffset = 0
) =>
  useInfiniteQuery({
    queryKey: ['monthlyProviderData', date, filters],
    queryFn: async ({ pageParam = '0' }) => {
      // pageParam defined by getNextPageParam below, offset should only come from the dataLoader
      const pageOffset = String(pageParam) || offset;
      return getMonthlyData(date, pageOffset, filters);
    },
    initialPageParam: initialOffset,
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
