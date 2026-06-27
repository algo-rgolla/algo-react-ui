export interface Transaction {
  id: string
  ticker: string
  type: 'BUY' | 'SELL'
  shares: number
  pricePerShare: number
  date: string
}

export interface StockHolding {
  ticker: string
  companyName: string
  sharesOwned: number
  averageCostBasis: number
  currentPrice: number
  totalValue: number
  totalGainLoss: number
  totalGainLossPercentage: number
}

export interface AlgoPortfolioProduct {
  id: number
  portfolioId: number
  symbol: string
  exchange: string
  name: string
  volume: string
  openPrice: string
  openDate: string
  closeDate: string | null
  close: string
  change: string | null
  closePrice: string | null
  changePercent: string
  status: string
  marketCap: string
  industry: string | null
  sector: string | null
  profitLoss: string
  comments: string | null
  tradeDays: string
  sellReason: string | null
  buyReason: string | null
  stopLoss: string | null
  scanDate: string
  scanType: string | null
  atr: string | null
  action: 'Buy' | 'Sell' | null
}

export interface AlgoPortfolioSaveRequest {
  algoPortfolioId: number
  symbol: string
  volume: number
  action: 'Buy' | 'Sell'
  openPrice: number
  closePrice: number
}

export interface PortfolioSummary {
  totalValue: number
  dayGainLoss: number
  dayGainLossPercentage: number
  totalProfit: number
  cashBalance: number
}

export interface Product {
  id: number;
  portfolioId: number;
  symbol: string;
  exchange: string;
  name: string;
  volume: string;
  openPrice: string;
  openDate: string;
  closeDate: string;
  close: string;
  change: string;
  closePrice: string;
  changePercent: string;
  status: string;
  marketCap: string | null;
  industry: string;
  sector: string;

  profitLoss: string;
  comments: string;
  tradeDays: string;
  sellReason: string;
  buyReason: string;
  stopLoss: string;

  // WatchList
  scanDate: string; // ISO date string from the API
  scanType: string;
  atr: string;
  action: string;
}