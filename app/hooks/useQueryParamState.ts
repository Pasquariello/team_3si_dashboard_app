import { useEffect, useState } from 'react';
/**
 * Differs from React-Router useQueryParams in that:
 * ** Setting params will not force a re-render which resets things like scroll position
 */

export const useQueryParamsState = () => {
  const [params, setParams] = useState<URLSearchParams>(() => {
    if (typeof window === 'undefined') {
      return new URLSearchParams('');
    }
    return new URLSearchParams(window.location.search);
  });

  useEffect(() => {
    const updateParams = () => setParams(new URLSearchParams(window?.location?.search));

    window.addEventListener('popstate', updateParams);

    return () => window.removeEventListener('popstate', updateParams);
  }, []);

  const updateQuery = (key: string, value: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(key, value);
    window.history.replaceState(null, '', `?${searchParams.toString()}`);
    setParams(searchParams);
  };

  return [params, updateQuery] as const;
};
