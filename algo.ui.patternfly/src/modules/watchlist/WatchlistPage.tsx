import { useEffect, useState } from 'react'
import axios from 'axios'
import { Alert, AlertGroup, PageSection, Stack, StackItem, Title } from '@patternfly/react-core'
import type { AlgoPortfolioProduct } from '../../types/portfolio'
import WatchListTable from './components/WatchListTable'
import { getAllWatchlistItems, deleteWatchlistItem } from '../../share/api/services/watchlistApi'
import { ApiHttpError } from '../../share/api/types'

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
  const [successMessage, setSuccessMessage] = useState<string>('Successfully Deleted')

  useEffect(() => {
    const abortController = new AbortController()

    async function loadProducts() {
      setIsLoading(true)
      setError(null)

      try {
        const watchlistProducts = await getAllWatchlistItems(abortController.signal)
        setProducts(watchlistProducts)
      } catch (fetchError) {
        if (isAbortError(fetchError)) {
          return
        }

        console.error('Watchlist fetch error:', fetchError)
        const message =
          fetchError instanceof ApiHttpError
            ? fetchError.message
            : 'Unable to load watchlist products. Please try again.'
        setError(message)
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
      const response = await deleteWatchlistItem(product.id)
      setProducts((currentProducts) => currentProducts.filter((currentProduct) => currentProduct.id !== product.id))
      setSuccessMessage(response.message)
      setShowDeleteSuccessToast(true)
    } catch (deleteError) {
      console.error('Watchlist delete error:', deleteError)
      const message =
        deleteError instanceof ApiHttpError
          ? deleteError.message
          : 'Unable to delete watchlist product. Please try again.'
      setError(message)
    } finally {
      setDeletingProductId(null)
    }
  }

  return (
    <>
      {showDeleteSuccessToast && (
        <AlertGroup isToast>
          <Alert variant="success" title={successMessage} />
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
