import { fetchWithAuth } from '~/apiClient';
import { env } from '~/env';
import type { Data } from '~/types';

export type ProviderFilters = {
  flagged: string | undefined;
  unflagged: string | undefined;
};

export const onSave = async (
  provider_data: Pick<Data, 'comment' | 'flagged' | 'providerLicensingId'>
): Promise<any> => {
  const { providerLicensingId, comment, flagged } = provider_data;
  const res = await fetch(
    `${process.env.VITE_API_ROOT_API_URL}/providerData/insights/${providerLicensingId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider_licensing_id: providerLicensingId,
        is_flagged: flagged,
        comment: comment,
      }),
    }
  );

  const data = await res.json();
  return {
    ok: res.ok,
    data,
  };
};

export const FETCH_ROW_COUNT = 200;

export const getMonthlyData = async (
  date: string,
  offset: string,
  filters?: Partial<ProviderFilters>
): Promise<Data[]> => {
  let result: Data[] = []
  const queryString = new URLSearchParams({offset, ...filters}).toString();
  let url = `${env.VITE_API_ROOT_API_URL}/providerData/month/${date}`;
  if (queryString) {
    url +=`?${queryString}`;
  }

  const authRes = await fetchWithAuth(url, {
    method: 'GET',
  });
  if (!authRes.ok) {
    const error = new Error('Failed to fetch');
    throw error;
  }
  try {
    result = await authRes.json() as unknown as Data[]
  } catch {
    throw new Error('Failed to parse Monthly response.')
  }

  return result
};

export const getAnnualData = async (year: number): Promise<Data[]> => {
  console.log(`HERE!!!! ${env.VITE_API_ROOT_API_URL}/annual/${year}`);

  const authRes = await fetchWithAuth(`${env.VITE_API_ROOT_API_URL}/providerData/annual/${year}`, {
    method: 'GET',
  });
  if (!authRes.ok) {
    const error = new Error('Failed to fetch');
    throw error;
  }
  return authRes.json();
};
