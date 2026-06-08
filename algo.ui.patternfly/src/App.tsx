import { Routes, Route } from 'react-router-dom'
import { PageSection, Title } from '@patternfly/react-core'
import { MainLayout } from './components/MainLayout'
import Dashboard from './pages/Dashboard'
import PortfolioPage from './pages/Portfolio'
import MetricCards from './components/MetricCards'
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
              <Dashboard />
              <MetricCards summary={portfolioSummary} />
              <HoldingsTable holdings={stockHoldings} />
            </>
          }
        />
        <Route
          path="/watchlist"
          element={
            <PageSection padding={{ default: 'padding' }}>
              <Title headingLevel="h1" size="2xl">
                Watchlist coming soon
              </Title>
            </PageSection>
          }
        />
        <Route path="/transactions" element={<PortfolioPage />} />
      </Routes>
    </MainLayout>
  )
}

export default App
