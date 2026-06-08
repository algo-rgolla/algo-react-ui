export const getScanTypeDescription = (
  scanType: string | undefined
): string => {
  const scanTypeDescriptions: Record<string, string> = {
    Scan_Long_EMA_Crossover: "Long EMA Crossover",
    Scan_LongBigGainers: "Long Big Gainers",
    Scan_Long_Unusual_Volume: "Long Unusual Volume",
    // Add more scan types as needed
  };

  if (!scanType) {
    return "No Scan Type Provided";
  }

  return scanTypeDescriptions[scanType] || "Unknown Scan Type";
};
