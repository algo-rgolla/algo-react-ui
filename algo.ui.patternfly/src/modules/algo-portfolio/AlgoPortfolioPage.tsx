import { useEffect, useState } from 'react'
import { Divider, PageSection, Stack, StackItem, Title } from '@patternfly/react-core'
import axios from 'axios'
import { getHoldings } from './share/portfolioService'
import type { AlgoPortfolioProduct } from '../../types/portfolio'
import HoldingsTable from './components/HoldingsTable'

function isAbortError(error: unknown): boolean {
  return (
    axios.isCancel(error) ||
    (error instanceof DOMException && error.name === 'AbortError') ||
    (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'ERR_CANCELED')
  )
}

export default function AlgoPortfolioPage() {
  const [holdings, setHoldings] = useState<AlgoPortfolioProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadHoldings() {
      setIsLoading(true)
      setError(null)

      try {
        const products = await getHoldings()
        if (isMounted) {
          setHoldings(products)
        }
      } catch (fetchError) {
        if (isAbortError(fetchError)) {
          return
        }

        console.error('AlgoPortfolio fetch error:', fetchError)
        if (isMounted) {
          setError('Unable to load portfolio holdings. Please try again.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadHoldings()

    return () => {
      isMounted = false
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
