import { useMemo } from 'react'
import type { PortfolioSummary, StockHolding, Transaction } from '../types/portfolio'

export function useMockData() {
  const portfolioSummary = useMemo<PortfolioSummary>(
    () => ({
      totalValue: 124500.5,
      dayGainLoss: 1820.35,
      dayGainLossPercentage: 1.48,
      totalProfit: 52700.0,
      cashBalance: 14875.0,
    }),
    [],
  )

  const stockHoldings = useMemo<StockHolding[]>(
    () => [
      {
        ticker: 'AAPL',
        companyName: 'Apple Inc.',
        sharesOwned: 85,
        averageCostBasis: 132.15,
        currentPrice: 176.4,
        totalValue: 14994.0,
        totalGainLoss: 3672.5,
        totalGainLossPercentage: 32.4,
      },
      {
        ticker: 'MSFT',
        companyName: 'Microsoft Corporation',
        sharesOwned: 48,
        averageCostBasis: 240.2,
        currentPrice: 329.8,
        totalValue: 15830.4,
        totalGainLoss: 4235.6,
        totalGainLossPercentage: 36.6,
      },
      {
        ticker: 'TSLA',
        companyName: 'Tesla, Inc.',
        sharesOwned: 27,
        averageCostBasis: 185.5,
        currentPrice: 265.75,
        totalValue: 7175.25,
        totalGainLoss: 2182.75,
        totalGainLossPercentage: 43.7,
      },
      {
        ticker: 'NVDA',
        companyName: 'NVIDIA Corporation',
        sharesOwned: 16,
        averageCostBasis: 403.8,
        currentPrice: 684.25,
        totalValue: 10948.0,
        totalGainLoss: 4504.8,
        totalGainLossPercentage: 69.6,
      },
      {
        ticker: 'AMZN',
        companyName: 'Amazon.com, Inc.',
        sharesOwned: 12,
        averageCostBasis: 135.0,
        currentPrice: 182.6,
        totalValue: 2191.2,
        totalGainLoss: 570.0,
        totalGainLossPercentage: 35.1,
      },
    ],
    [],
  )

  const recentTransactions = useMemo<Transaction[]>(
    () => [
      {
        id: 'txn-1001',
        ticker: 'AAPL',
        type: 'BUY',
        shares: 25,
        pricePerShare: 164.2,
        date: '2026-05-18',
      },
      {
        id: 'txn-1002',
        ticker: 'MSFT',
        type: 'BUY',
        shares: 15,
        pricePerShare: 312.0,
        date: '2026-05-16',
      },
      {
        id: 'txn-1003',
        ticker: 'TSLA',
        type: 'SELL',
        shares: 10,
        pricePerShare: 279.8,
        date: '2026-05-14',
      },
      {
        id: 'txn-1004',
        ticker: 'NVDA',
        type: 'BUY',
        shares: 6,
        pricePerShare: 656.9,
        date: '2026-05-13',
      },
    ],
    [],
  )

  return {
    portfolioSummary,
    stockHoldings,
    recentTransactions,
  }
}
