import { Navigate, useMatch } from 'react-router';

export default function RedirectToAnnual() {
  const isIndex = useMatch('/provider/risk-audit')
  return isIndex ? <Navigate to='annual' replace /> : null;
}
