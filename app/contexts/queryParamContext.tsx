import { createContext } from 'react';
import { useQueryParamsState, type QueryParamAction } from '~/hooks/useQueryParamState';
type QueryParamsContextType = readonly [URLSearchParams, (a: QueryParamAction) => void];

export const QueryParamsContext = createContext<QueryParamsContextType | null>(null);

export const QueryParamsProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useQueryParamsState();
  return <QueryParamsContext.Provider value={value}>{children}</QueryParamsContext.Provider>;
};

// In any child component
// const [params, updateQuery] = useContext(QueryParamsContext)!;
