import { useEffect, useState } from 'react'
import { Divider, PageSection, Stack, StackItem, Title } from '@patternfly/react-core'
import axios from 'axios'
import type { AlgoPortfolioProduct } from '../../types/portfolio'
import HoldingsTable from './components/HoldingsTable'

interface AlgoPortfolioResponse {
  products: AlgoPortfolioProduct[]
}

export default function AlgoPortfolioPage() {
  const [holdings, setHoldings] = useState<AlgoPortfolioProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchHoldings() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await axios.get<AlgoPortfolioResponse>(
          '/api/AlgoPortfolio/algo-portfolio-list',
          { signal: controller.signal },
        )
        setHoldings(response.data.products ?? [])
      } catch (fetchError) {
        if (axios.isCancel(fetchError)) {
          return
        }

        console.error('AlgoPortfolio fetch error:', fetchError)
        setError('Unable to load portfolio holdings. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchHoldings()

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <>
      <PageSection variant="secondary" padding={{ default: 'padding' }}>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h1" size="2xl" style={{ marginBottom: 8 }}>
              Algo Portfolio
            </Title>
            <p>View the current portfolio list as returned from the backend API.</p>
          </StackItem>
        </Stack>
      </PageSection>

      <PageSection padding={{ default: 'padding' }}>
        <Stack hasGutter>
          <StackItem>
            {isLoading ? (
              <p>Loading portfolio holdings...</p>
            ) : error ? (
              <p style={{ color: '#c9190b' }}>{error}</p>
            ) : (
              <HoldingsTable holdings={holdings} />
            )}
          </StackItem>
          <StackItem>
            <Divider />
          </StackItem>
        </Stack>
      </PageSection>
    </>
  )
}
