import { createContext, useContext, useReducer, type FC, type ReactNode } from 'react';

const defaultFilterValues: ProviderFilters = {
  flagged: false,
  unflagged: false,
};

export type ProviderFilters = {
  flagged: boolean;
  unflagged: boolean;
};

type Action =
  | { type: 'SET_FLAGGED'; payload: boolean }
  | { type: 'SET_UNFLAGGED'; payload: boolean };

type ActionMap = {
  SET_FLAGGED: boolean;
  SET_UNFLAGGED: boolean;
};

type ProviderFilterContext = {
  filters: ProviderFilters;
  dispatchHandler: (type: keyof ActionMap, payload: ActionMap[keyof ActionMap]) => void;
};

const ProviderFilter = createContext<ProviderFilterContext | undefined>(undefined);

function reducer(state: ProviderFilters, action: Action): ProviderFilters {
  switch (action.type) {
    case 'SET_FLAGGED':
      return { ...state, flagged: action.payload };
    case 'SET_UNFLAGGED':
      return { ...state, unflagged: action.payload };
    default:
      return state;
  }
}

export const ProviderFilterContext: FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, dispatch] = useReducer(reducer, defaultFilterValues);

  const dispatchHandler = (type: keyof ActionMap, payload: ActionMap[keyof ActionMap]) => {
    dispatch({ type, payload });
  };

  return (
    <ProviderFilter.Provider value={{ filters, dispatchHandler }}>
      {children}
    </ProviderFilter.Provider>
  );
};

export const useProviderFilters = (): ProviderFilterContext => {
  const ctx = useContext(ProviderFilter);
  if (!ctx) throw new Error('useProviderFilter must be used within ProviderFilterContext');
  return ctx;
};
