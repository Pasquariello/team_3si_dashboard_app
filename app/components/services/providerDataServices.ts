import { fetchWithAuth } from '~/apiClient';
import { env } from '~/env';
import type { AnnualData, MonthlyData, ProviderDetails, ProviderInsightWithHistory } from '~/types';

export type ProviderFilters = {
  flagStatus: string | undefined;
  cities: string[] | undefined;
};

export type SaveInsightPayload = {
  insightData: {
    providerLicensingId: string;
    comment: string;
    isFlagged?: boolean;
    createdAt?: string;
    resolvedOn?: string;
  };
  action: 'CREATE' | 'UPDATE' | 'RESOLVE';
};

export const onSave = async ({ insightData, action }: SaveInsightPayload): Promise<any> => {
  const res = await fetch(
    `${env.VITE_API_ROOT_API_URL}/providerData/insights/${insightData.providerLicensingId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        is_flagged: insightData.isFlagged,
        provider_licensing_id: insightData.providerLicensingId,
        comment: insightData.comment,
        created_at: insightData.createdAt,
        resolved_on: insightData.resolvedOn,
        // created_by
        actionType: action,
      }),
    }
  );

  const data = await res.json();
  return {
    ok: res.ok,
    data,
  };
};

export const getProviderInsights = async (
  providerId: string
): Promise<ProviderInsightWithHistory> => {
  let result = {} as ProviderInsightWithHistory;
  let url = `${env.VITE_API_ROOT_API_URL}/providerData/insights/${providerId}`;
  result = await fetchWithAuth(url, {
    method: 'GET',
  });

  return result;
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
  console.log('get city');
  let result = [];
  let url = `${env.VITE_API_ROOT_API_URL}/providerData/cities`;

  if (cityName) {
    url += `?${new URLSearchParams({ cityName }).toString()}`;
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

export const getProviderDetails = async (providerId: string): Promise<ProviderDetails> => {
  let result = {} as ProviderDetails;
  let url = `${env.VITE_API_ROOT_API_URL}/providerData/${providerId}`;

  result = await fetchWithAuth(url, {
    method: 'GET',
  });

  return result;
};
