import { useMatch } from 'react-router';
import AnnualProviderData from './annualProviderData';
import MonthlyProviderData from './monthlyProviderData';
import { useOutletContext } from 'react-router';

export default function ProviderMode() {
  const { setAnnualViewData, setMonthlyViewData, date } = useOutletContext<{
    setAnnualViewData: () => void;
    setMonthlyViewData: () => void;
    date: string;
  }>();
  const annualMatch = useMatch('/provider/risk-audit/annual/:date?');
  const monthlyMatch = useMatch('/provider/risk-audit/monthly/:date?');

  let mode: 'annual' | 'monthly' | null = null;

  if (annualMatch) {
    mode = 'annual';
  } else if (monthlyMatch) {
    mode = 'monthly';
  }

  if (!mode) {
    throw new Error('Missing or invalid route parameters');
  }

  if (mode === 'annual') {
    return <AnnualProviderData date={date} setAnnualViewData={setAnnualViewData} />;
  }

  if (mode === 'monthly') {
    return <MonthlyProviderData date={date} setMonthlyViewData={setMonthlyViewData} />;
  }

  throw new Response('Not found', { status: 404 });
}
