import type { Data } from '~/types';

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
