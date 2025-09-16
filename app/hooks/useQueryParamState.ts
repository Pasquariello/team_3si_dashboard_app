import { useReducer, useEffect } from 'react';

export type QueryParamAction =
  | { type: 'SET'; key: string; value: string }
  | { type: 'DELETE'; key: string }
  | { type: 'REMOVE_ONE'; key: string; value: string | number }
  | { type: 'RESET'; params?: URLSearchParams };

function reducer(state: URLSearchParams, action: QueryParamAction): URLSearchParams {
  const sp = new URLSearchParams(state.toString());
  switch (action.type) {
    case 'SET':
      sp.set(action.key, action.value);
      break;
    case 'DELETE':
      sp.delete(action.key);
      break;
    case 'REMOVE_ONE': {
      const remaining = sp.getAll(action.key).filter(v => v !== String(action.value));
      sp.delete(action.key);
      remaining.forEach(v => sp.append(action.key, v));
      break;
    }
    case 'RESET':
      return action.params ? new URLSearchParams(action.params.toString()) : new URLSearchParams();
  }

  return sp;
}

export const useQueryParamsState = () => {
  const [params, dispatch] = useReducer(
    reducer,
    typeof window === 'undefined'
      ? new URLSearchParams()
      : new URLSearchParams(window.location.search)
  );

  useEffect(() => {
    const current = window.location.search.slice(1);
    if (params.toString() !== current) {
      window.history.replaceState(null, '', `?${params.toString()}`);
    }
  }, [params]);
  const updateQuery = (action: QueryParamAction) => {
    dispatch(action);
  };
  return [params, updateQuery] as const;
};
