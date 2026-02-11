import { createContext, useContext, useState, useCallback } from "react";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoader = useCallback(() => {
    setLoadingCount((count) => count + 1);
  }, []);

  const hideLoader = useCallback(() => {
    setLoadingCount((count) => Math.max(0, count - 1));
  }, []);

  const loading = loadingCount > 0;

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
