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

  const performUpdate = (searchParams: URLSearchParams) => {
    window.history.replaceState(null, '', `?${searchParams.toString()}`);
    setParams(searchParams);
    // dispatch a custom event so other components can listen
    window.dispatchEvent(new CustomEvent('queryParamsChanged'));
  };

  useEffect(() => {
    const updateParams = () => setParams(new URLSearchParams(window.location.search));

    window.addEventListener('popstate', updateParams);
    window.addEventListener('queryParamsChanged', updateParams);

    return () => {
      window.removeEventListener('popstate', updateParams);
      window.removeEventListener('queryParamsChanged', updateParams);
    };
  }, []);

  function removeOneValue(sp: URLSearchParams, key: string, value: string) {
    const remaining = sp.getAll(key).filter(v => v !== value);
    sp.delete(key);
    remaining.forEach(v => sp.append(key, v));
    performUpdate(sp);
  }
  // extend options like "." | ".."
  const updateQuery = (key: string, value: string | null, options?: 'removeOne') => {
    const searchParams = new URLSearchParams(window.location.search);

    if (options === 'removeOne') {
      // need key and value to find param to remove
      removeOneValue(searchParams, key, value!);
      return;
    }

    if (value === null) {
      searchParams.delete(key); // remove the query param entirely
    } else {
      searchParams.set(key, value); // set/update the value
    }

    performUpdate(searchParams);
  };
  return [params, updateQuery] as const;
};
