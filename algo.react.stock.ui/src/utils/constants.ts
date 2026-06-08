export function getScanTypeDescription(scanType: string): string {
  return scanTypeDisplayNames[scanType] ?? scanType;
}
export const algoScanTypes = ["Scan_Long_Unusual_Volume"]; // Example scan types

export const scanTypeDisplayNames: Record<string, string> = {
  Scan_Long_Unusual_Volume: "Unusual Volume",
};
