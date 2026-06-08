export interface Product {
  id: number;
  portfolioId: number;
  symbol: string;
  name: string;
  volume: string;
  openPrice: string;
  openDate: string;
  closeDate: string | null;
  close: string;
  change: string;
  status: string;
  marketCap: string;
  profitLoss: string;
  comments: string;
  tradeDays: string;
  sellReason: string | null;
  buyReason: string | null;
  stopLoss: string;
  scanDate: string;
  scanType: string;
  closePrice: string;
  changePercent: string;
  stopPrice: string;
  atr: string;
  watchlistId: number;
}

export interface ScanCounter {
  scanResultCount: number;
  scanTypeText: string;
  scanType: string;
}

export interface ApiResponse {
  scanType: string;
  productViewType: string | null;
  pageTotal: number;
  pageHeader: string | null;
  products: Product[];
}
