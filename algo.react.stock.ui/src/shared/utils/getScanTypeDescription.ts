export const getScanTypeDescription = (
  scanType: string | undefined,
): string => {
  const scanTypeDescriptions: Record<string, string> = {
    Scan_Long_Unusual_Volume: "Long Unusual Volume",
    Scan_CFD_US_Long_BigGainers: "US Long Big Gainers",
  };

  if (!scanType) {
    return "No Scan Type Provided";
  }

  return scanTypeDescriptions[scanType] || "Unknown Scan Type";
};
