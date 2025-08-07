import { getCurrentDate } from '~/utils/dates';
import type { Route } from '../routes/providerData/+types/providerData';
import { queryClient } from '~/queryClient';
import type { Data } from '~/types';
import { fetchWithAuth } from '~/apiClient';

export const FETCH_ROW_COUNT = 200;

export const getMonthlyData = async (date: string, offset: string): Promise<Data[]> => {
  console.log(`http://localhost:3000/api/v1/month/${date}?offset=${offset}`);

  const authRes = await fetchWithAuth(
    `http://localhost:3000/api/v1/month/${date}?offset=${offset}`,
    {
      method: 'GET',
    }
  );
  if (!authRes.ok) {
    const error = new Error('Failed to fetch');
    throw error;
  }
  return authRes.json();
};
// Since we are populating the cache we don't need to block the UI with async/await
export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const date = url.searchParams.get('date') ?? getCurrentDate();
  const offset = url.searchParams.get('offset') ?? '0';

  queryClient.prefetchInfiniteQuery({
    initialPageParam: offset,
    queryKey: ['monthlyProviderData', date],
    queryFn: () => getMonthlyData(date, offset),
  });

  return null;
}
