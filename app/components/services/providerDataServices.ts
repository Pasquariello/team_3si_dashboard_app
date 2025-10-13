import { fetchWithAuth } from '~/apiClient';
import { env } from '~/env';
import type { AnnualData, Data, MonthlyData } from '~/types';

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

export const createQueryStringFromFilters = (filters?: Partial<ProviderFilters>): string | null => {
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

  result = await fetchWithAuth(url, {
    method: 'GET',
  });

  return result;
};

export const getAnnualData = async (
  year: string,
  offset: string,
  filters?: Partial<ProviderFilters>
): Promise<AnnualData[]> => {
  let result: AnnualData[] = [];
  let url = `${env.VITE_API_ROOT_API_URL}/providerData/annual/${year}`;
  const offsetMod = new URLSearchParams({ offset }).toString();
  url += `?${offsetMod}`;

  const queryString = createQueryStringFromFilters(filters);
  if (queryString) {
    url += `&${queryString}`;
  }

  result = await fetchWithAuth(url, {
    method: 'GET',
  });

  return result;
};

export const getProviderCities = async (cityName: string): Promise<string[]> => {
  let result = [];
  const queryString = new URLSearchParams({ cityName }).toString();
  let url = `${env.VITE_API_ROOT_API_URL}/providerData/cities`;

  if (queryString) {
    url += `?${queryString}`;
  }

  result = await fetchWithAuth(url, { method: 'GET' });

  return result;
};

export const getYearlyExportData = async (
  date: string,
  offset: string,
  filters?: Partial<ProviderFilters>
): Promise<void> => {
  let result;
  let url = `${env.VITE_API_ROOT_API_URL}/providerData/export/year/${date}`;
  const offsetMod = new URLSearchParams({ offset }).toString();
  url += `?${offsetMod}`;

  const queryString = createQueryStringFromFilters(filters);
  if (queryString) {
    url += `&${queryString}`;
  }
  // TODO: AUTH
  result = await fetch(url);
  if (!result.ok) throw new Error('Network result was not ok');

  const blob = await result.blob();
  const file = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = file;
  link.download = `providers_${date}.csv`;
  link.click();

  window.URL.revokeObjectURL(file);
};

export const getMonthlyExportData = async (
  date: string,
  offset: string,
  filters?: Partial<ProviderFilters>
): Promise<void> => {
  let result;
  let url = `${env.VITE_API_ROOT_API_URL}/providerData/export/month/${date}`;
  const offsetMod = new URLSearchParams({ offset }).toString();
  url += `?${offsetMod}`;

  const queryString = createQueryStringFromFilters(filters);
  if (queryString) {
    url += `&${queryString}`;
  }
  // TODO: AUTH
  result = await fetch(url);
  if (!result.ok) throw new Error('Network result was not ok');

  const blob = await result.blob();
  const file = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = file;
  link.download = `providers_${date}.csv`;
  link.click();

  window.URL.revokeObjectURL(file);
};
