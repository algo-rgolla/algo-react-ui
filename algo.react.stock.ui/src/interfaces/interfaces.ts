interface IPortfolioHistory {
  id: number;
  portfolioId: number;
  symbol: string;
  exchange: string;
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

  watchlistId: number;
}

// interface IWatchlistDto {
//   id: number;
//   symbol: string;
//   name: string;
//   volume: string;
//   openPrice: string;
//   openDate: string;
//   closeDate: string | null;
//   close: string;
//   change: string;
//   status: string;
//   marketCap: string;
//   profitLoss: string;
//   comments: string;
//   tradeDays: string;
//   sellReason: string | null;
//   buyReason: string | null;
//   stopLoss: string;
//   scanDate: string;
//   scanType: string;
//   closePrice: string;
//   changePercent: string;
// }

interface Product {
  id: number;
  portfolioId: number;
  symbol: string;
  exchange: string;
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

interface ScanCounter {
  scanResultCount: number;
  scanTypeText: string;
  scanType: string;
}

// interface ApiWatchlistResponse {
//   scanType: string;
//   productViewType: string | null;
//   pageTotal: number;
//   pageHeader: string | null;
//   products: IWatchlistDto[];
// }

interface ApiResponse {
  scanType: string;
  productViewType: string | null;
  pageTotal: number;
  pageHeader: string | null;
  products: Product[];
}

interface IPortfolioHeaderDetails {
  totalProfitLoss: string;
  portfoioScanType: string;
}
