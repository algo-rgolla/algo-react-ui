import { useEffect, useState } from 'react'
import axios from 'axios'
import { Alert, AlertGroup, PageSection, Stack, StackItem, Title } from '@patternfly/react-core'
import type { AlgoPortfolioProduct } from '../../types/portfolio'
import WatchListTable from './components/WatchListTable'
import { deleteWatchlistProduct, getWatchlistProducts } from './share/watchlistService'

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
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null)
  const [showDeleteSuccessToast, setShowDeleteSuccessToast] = useState(false)

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

  useEffect(() => {
    if (!showDeleteSuccessToast) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setShowDeleteSuccessToast(false)
    }, 3000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [showDeleteSuccessToast])

  async function handleDeleteProduct(product: AlgoPortfolioProduct) {
    const isConfirmed = window.confirm(`Delete watchlist item ${product.symbol}?`)
    if (!isConfirmed) {
      return
    }

    setError(null)
    setDeletingProductId(product.id)

    try {
      await deleteWatchlistProduct(product.id)
      setProducts((currentProducts) => currentProducts.filter((currentProduct) => currentProduct.id !== product.id))
      setShowDeleteSuccessToast(true)
    } catch (deleteError) {
      console.error('Watchlist delete error:', deleteError)
      setError('Unable to delete watchlist product. Please try again.')
    } finally {
      setDeletingProductId(null)
    }
  }

  return (
    <>
      {showDeleteSuccessToast && (
        <AlertGroup isToast>
          <Alert variant="success" title="Successfully Deleted" />
        </AlertGroup>
      )}

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
              <WatchListTable
                products={products}
                onDeleteProduct={handleDeleteProduct}
                deletingProductId={deletingProductId}
              />
            )}
          </StackItem>
        </Stack>
      </PageSection>
    </>
  )
}
