import { Routes, Route } from 'react-router-dom'
import { DashboardPage } from '../modules/dashboard'
import { WatchlistPage } from '../modules/watchlist'
import { AlgoPortfolioPage } from '../modules/algo-portfolio'
import MetricCards from '../modules/dashboard/components/MetricCards'
import HoldingsTable from '../components/HoldingsTable'
import type { PortfolioSummary, StockHolding } from '../types/portfolio'

interface AppRoutesProps {
  portfolioSummary: PortfolioSummary
  stockHoldings: StockHolding[]
}

export default function AppRoutes({ portfolioSummary, stockHoldings }: AppRoutesProps) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <DashboardPage />
            <MetricCards summary={portfolioSummary} />
            <HoldingsTable holdings={stockHoldings} />
          </>
        }
      />
      <Route path="/watchlist" element={<WatchlistPage />} />
      <Route path="/algo-portfolio" element={<AlgoPortfolioPage />} />
    </Routes>
  )
}
