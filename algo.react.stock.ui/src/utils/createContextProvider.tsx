import React, { createContext, useState, useEffect } from "react";

export const createContextProvider = <T,>(
  defaultValue: T,
  fetchData: () => Promise<T>
) => {
  const Context = createContext<T>(defaultValue);

  const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<T>(defaultValue);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetch = async () => {
        try {
          const data = await fetchData();
          setState(data);
          setError(null);
        } catch (err: any) {
          setError(err.message || "Failed to load data");
        } finally {
          setIsLoading(false);
        }
      };

      fetch();
    }, []);

    return (
      <Context.Provider value={{ state, isLoading, error }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
};
