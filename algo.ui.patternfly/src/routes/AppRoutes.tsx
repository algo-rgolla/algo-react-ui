import { Routes, Route } from 'react-router-dom'
import { DashboardPage } from '../modules/dashboard'
import { WatchlistPage } from '../modules/watchlist'
import { AlgoPortfolioPage } from '../modules/algo-portfolio'
import AlgoPortfolioHistoryPage from '../modules/algo-portfolio/AlgoPortfolioHistoryPage'
import MetricCards from '../modules/dashboard/components/MetricCards'
import type { PortfolioSummary, StockHolding } from '../types/portfolio'
import HoldingsTable from '../modules/algo-portfolio/components/HoldingsTable'

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
      <Route path="/watchlist/create" element={<WatchlistPage />} />
      <Route path="/watchlist/:id" element={<WatchlistPage />} />
      <Route path="/watchlist/:id/edit" element={<WatchlistPage />} />

      <Route path="/portfolio" element={<AlgoPortfolioPage />} />
      <Route path="/portfolio/create" element={<AlgoPortfolioPage />} />
      <Route path="/portfolio/:id" element={<AlgoPortfolioPage />} />
      <Route path="/portfolio/:id/edit" element={<AlgoPortfolioPage />} />
      <Route path="/portfolio/history" element={<AlgoPortfolioHistoryPage />} />
    </Routes>
  )
}
