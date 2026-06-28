import { useEffect, useState } from 'react'
import axios from 'axios'
import { PageSection, Stack, StackItem, Title } from '@patternfly/react-core'
import type { AlgoPortfolioProduct } from '../../types/portfolio'
import WatchListTable from './components/WatchListTable'
import { getWatchlistProducts } from './share/watchlistService'

function isAbortError(error: unknown): boolean {
  return (
    axios.isCancel(error) ||
    (error instanceof DOMException && error.name === 'AbortError') ||
    (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'ERR_CANCELED')
  )
}

export default function WatchlistPage() {
  const [products, setProducts] = useState<AlgoPortfolioProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    async function loadProducts() {
      setIsLoading(true)
      setError(null)

      try {
        const watchlistProducts = await getWatchlistProducts(abortController.signal)
        setProducts(watchlistProducts)
      } catch (fetchError) {
        if (isAbortError(fetchError)) {
          return
        }

        console.error('Watchlist fetch error:', fetchError)
        setError('Unable to load watchlist products. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadProducts()

    return () => {
      abortController.abort()
    }
  }, [])

  return (
    <PageSection padding={{ default: 'padding' }}>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h1" size="2xl">
            Watchlist
          </Title>
        </StackItem>
        <StackItem>
          {isLoading ? (
            <p>Loading watchlist...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <WatchListTable products={products} />
          )}
        </StackItem>
      </Stack>
    </PageSection>
  )
}
