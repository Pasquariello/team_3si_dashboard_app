import { Navigate, useMatch, useParams } from 'react-router';

export default function RedirectTo() {
  const isIndex = useMatch('/provider/risk-audit/:providerId?');
  const params = useParams();

  if (isIndex && params.providerId) {
    return <Navigate to={`/provider/risk-audit/${params.providerId}/overall`} replace />;
  }

  return null;
}
