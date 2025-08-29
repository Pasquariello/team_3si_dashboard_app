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
    const updateParams = () => setParams(new URLSearchParams(window.location.search));

    window.addEventListener('popstate', updateParams);
    window.addEventListener('queryParamsChanged', updateParams);

    return () => {
      window.removeEventListener('popstate', updateParams);
      window.removeEventListener('queryParamsChanged', updateParams);
    };
  }, []);

  const updateQuery = (key: string, value: string | null) => {
    const searchParams = new URLSearchParams(window.location.search);

    if (value === null) {
      searchParams.delete(key); // remove the query param entirely
    } else {
      searchParams.set(key, value); // set/update the value
    }

    window.history.replaceState(null, '', `?${searchParams.toString()}`);

    setParams(searchParams);

    // dispatch a custom event so other components can listen
    window.dispatchEvent(new CustomEvent('queryParamsChanged'));
  };
  return [params, updateQuery] as const;
};
