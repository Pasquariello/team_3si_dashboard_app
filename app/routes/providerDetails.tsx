import { redirect } from 'react-router';
import type { Route } from '../+types/root';
import { queryClient } from '~/queryClient';
import { ProviderMetaDataSection } from '~/components/providerData/ProviderMetaDataSection';
import { getProviderDetails } from '~/components/services/providerDataServices';

export async function loader({ params, request }: Route.LoaderArgs) {
  let providerId = params?.providerId;
  if (!providerId) {
    return redirect('provider/risk-audit');
  }

  const queryKey = ['provider', providerId];
  console.log({ params, request });

  await queryClient.fetchQuery({
    queryKey: queryKey,
    queryFn: async () => getProviderDetails(providerId),
  });

  return null;
}

export default function ProviderDetails() {
  return <ProviderMetaDataSection />;
}
