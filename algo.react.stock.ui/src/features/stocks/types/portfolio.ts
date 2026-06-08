export interface IPortfolioHistory {
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
  watchlistId: number;
}
