import { createContext, useContext } from 'react';
import { useQueryParamsState, type QueryParamAction } from '~/hooks/useQueryParamState';
type QueryParamsContextType = readonly [URLSearchParams, (a: QueryParamAction) => void];

export const QueryParamsContext = createContext<QueryParamsContextType | null>(null);

export const QueryParamsProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useQueryParamsState();
  return <QueryParamsContext.Provider value={value}>{children}</QueryParamsContext.Provider>;
};

export const useQueryParams = (): QueryParamsContextType => {
  const ctx = useContext(QueryParamsContext);
  if (!ctx) throw new Error('useQueryParams must be used within AuthProvider');
  return ctx;
};
