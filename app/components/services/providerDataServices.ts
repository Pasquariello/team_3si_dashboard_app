import { fetchWithAuth } from '~/apiClient';
import { env } from '~/env';
import type { Data, MonthlyData } from '~/types';

export type ProviderFilters = {
  flagStatus: string | undefined;
  cities: string[] | undefined;
};

export const onSave = async (
  provider_data: Pick<Data, 'comment' | 'flagged' | 'providerLicensingId'>
): Promise<any> => {
  const { providerLicensingId, comment, flagged } = provider_data;
  const res = await fetch(
    `${env.VITE_API_ROOT_API_URL}/providerData/insights/${providerLicensingId}`,
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

const createQueryStringFromFilters = (filters?: Partial<ProviderFilters>) => {
  if (!filters) return null;

  const params = new URLSearchParams();

  if (filters.flagStatus) {
    params.append('flagStatus', filters.flagStatus);
  }

  if (filters.cities?.length) {
    filters.cities.forEach(value => {
      params.append('cities', value);
    });
  }

  const queryString = params.toString();
  return queryString || null;
};

export const getMonthlyData = async (
  date: string,
  offset: string,
  filters?: Partial<ProviderFilters>
): Promise<MonthlyData[]> => {
  let result: MonthlyData[] = [];
  let url = `${env.VITE_API_ROOT_API_URL}/providerData/month/${date}`;
  const offsetMod = new URLSearchParams({ offset }).toString();
  url += `?${offsetMod}`;

  const queryString = createQueryStringFromFilters(filters);
  if (queryString) {
    url += `&${queryString}`;
  }

  const authRes = await fetchWithAuth(url, {
    method: 'GET',
  });
  if (!authRes.ok) {
    const error = new Error('Failed to fetch');
    throw error;
  }
  try {
    result = (await authRes.json()) as unknown as MonthlyData[];
  } catch {
    throw new Error('Failed to parse Monthly response.');
  }

  return result;
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

export const getProviderCities = async (cityName: string): Promise<string[]> => {
  let result = [];
  const queryString = new URLSearchParams({ cityName }).toString();
  let url = `${env.VITE_API_ROOT_API_URL}/providerData/cities`;

  if (queryString) {
    url += `?${queryString}`;
  }

  try {
    const authRes = await fetchWithAuth(url, { method: 'GET' });
    if (!authRes.ok) {
      const error = new Error('Failed to fetch');
      throw error;
    }

    result = await authRes.json();
  } catch (error) {
    throw error;
  }

  return result;
};
