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

export interface PortfolioSummary {
  totalValue: number
  dayGainLoss: number
  dayGainLossPercentage: number
  totalProfit: number
  cashBalance: number
}
