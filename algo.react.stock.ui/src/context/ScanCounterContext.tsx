// import React, { createContext, useContext, useEffect, useState } from "react";
// import { get } from "../utils/apiClient";
// import { SCAN_COUNTERS_API_URL } from "../shared/utils/constants/apiConstants";

// export type ScanCounter = {
//   scanType: string;
//   scanTypeText: string;
//   scanResultCount: number;
// };

// type ScanCounterContextType = {
//   scanCounters: ScanCounter[];
//   isLoading: boolean;
//   error: string | null;
//   refresh: () => void;
// };

// const ScanCounterContext = createContext<ScanCounterContextType>({
//   scanCounters: [],
//   isLoading: true,
//   error: null,
//   refresh: () => {},
// });

// export const ScanCounterProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [scanCounters, setScanCounters] = useState<ScanCounter[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchScanCounters = async () => {
//     console.log("Fetching scan counters...");
//     try {
//       setIsLoading(true);
//       const data = await get(SCAN_COUNTERS_API_URL);
//       console.log("Scan Counters Data:", data);
//       setScanCounters(data.scanCounters || []);
//       setError(null);
//     } catch (err: any) {
//       setError(err.message || "Failed to load scan counters");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch on initial load
//   useEffect(() => {
//     fetchScanCounters();
//     // Removed auto-refresh interval
//   }, []);

//   return (
//     <ScanCounterContext.Provider
//       value={{ scanCounters, isLoading, error, refresh: fetchScanCounters }}
//     >
//       {children}
//     </ScanCounterContext.Provider>
//   );
// };

// export const useScanCounters = () => useContext(ScanCounterContext);
// File removed as part of refactor. Use src/shared/context if needed.
