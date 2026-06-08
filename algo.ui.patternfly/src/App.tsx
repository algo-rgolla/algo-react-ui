import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/MainLayout'
import { DashboardPage } from './modules/dashboard'
import { WatchlistPage } from './modules/watchlist'
import { AlgoPortfolioPage } from './modules/algo-portfolio'
import MetricCards from './modules/dashboard/components/MetricCards'
import HoldingsTable from './components/HoldingsTable'
import { useMockData } from './hooks/useMockData'

function App() {
  const { portfolioSummary, stockHoldings, recentTransactions } = useMockData()
  void recentTransactions

  return (
    <MainLayout>
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
        <Route path="/transactions" element={<AlgoPortfolioPage />} />
      </Routes>
    </MainLayout>
  )
}

export default App
