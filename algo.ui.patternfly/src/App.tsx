import { MainLayout } from './components/MainLayout'
import AppRoutes from './routes/AppRoutes'
import { useMockData } from './hooks/useMockData'

function App() {
  const { portfolioSummary, stockHoldings, recentTransactions } = useMockData()
  void recentTransactions

  return (
    <MainLayout>
      <AppRoutes portfolioSummary={portfolioSummary} stockHoldings={stockHoldings} />
    </MainLayout>
  )
}

export default App
