import { Navigate, useMatch } from 'react-router';

export default function RedirectToAnnual() {
  const isIndex = useMatch('/provider/risk-audit')
  // TAYLOR TODO - FIX DATE
  return isIndex ? <Navigate to='annual/2024' replace /> : null;
}
