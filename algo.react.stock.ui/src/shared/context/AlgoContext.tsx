import React, { createContext, useContext, useEffect, useState } from "react";
import { get } from "../utils/apiClient";
import { SCAN_COUNTERS_API_URL } from "../utils/constants/apiConstants";

export type AlgoContextType = {
  isAdmin?: boolean;
  scanCounters: ScanCounter[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
};

export type ScanCounter = {
  scanType: string;
  scanTypeText: string;
  scanResultCount: number;
};

export const AlgoContext = createContext<AlgoContextType>({
  scanCounters: [],
  isLoading: true,
  error: null,
  refresh: () => {},
});

export const AlgoContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scanCounters, setScanCounters] = useState<ScanCounter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchScanCounters = async () => {
    try {
      setIsLoading(true);
      const response = await get(SCAN_COUNTERS_API_URL);
      const data = response.data || {};
      setScanCounters(data.scanCounters || []);
      setIsAdmin(data.isAdmin || false);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load scan counters");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScanCounters();
  }, []);

  return (
    <AlgoContext.Provider
      value={{
        scanCounters,
        isLoading,
        error,
        refresh: fetchScanCounters,
        isAdmin,
      }}
    >
      {children}
    </AlgoContext.Provider>
  );
};

export const useAlgoContext = () => useContext(AlgoContext);
