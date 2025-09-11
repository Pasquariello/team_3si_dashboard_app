import { Navigate, useMatch } from 'react-router';

export default function RedirectToAnnual() {
  const isIndex = useMatch('/providerData');
  return isIndex ? <Navigate to='annual' replace /> : null;
}
