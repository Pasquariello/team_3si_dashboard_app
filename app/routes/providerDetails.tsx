import { useParams } from 'react-router';
import type { Route } from '../+types/root';

export async function loader({ params, request }: Route.LoaderArgs) {
  // let id = params?.providerId;

  return null;
}

export default function ProviderDetails() {
  let params = useParams();
  return <div>{params.providerId}</div>;
}
