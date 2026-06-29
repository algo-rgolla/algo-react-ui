export interface WatchlistItemDto {
  id?: number;
  symbol: string;
  exchange: string;
  openPrice: string;
  openDate: string;
  status: string;
}

export interface AlgoProductViewModel {
  algoPortfolioId: number;
  symbol: string;
  volume: number;
  action: "Buy" | "Sell";
  openPrice?: number | null;
  closePrice?: number | null;
}

export interface ProductViewModel {
  portfolioId: number;
  symbol: string;
  exchange: string;
  name: string;
  status: string;
  marketCap: string;
  volume: string;
  openPrice: string;
  close: string;
  changePercent: string;
  openDate: string;
  profitLoss: string;
  closePrice?: string;
  closeDate?: string;
  tradeDays: string;
  comments?: string;
  buyReason?: string;
  sellReason?: string;
  stopLoss?: string;
}

export interface WatchlistResponse {
  products: ProductViewModel[];
}

export interface AlgoPortfolioResponse {
  products: ProductViewModel[];
}

export interface PortfolioViewModel {
  scanName?: string;
}

export interface ApiErrorResponse {
  message: string;
  error?: string;
}

export interface ApiSuccessResponse {
  message: string;
  success?: boolean;
}
