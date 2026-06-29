import { useEffect, useState } from 'react'
import axios from 'axios'
import { Alert, AlertGroup, Button, PageSection, Stack, StackItem, Title } from '@patternfly/react-core'
import type { AlgoPortfolioProduct } from '../../types/portfolio'
import WatchListTable from './components/WatchListTable'
import WatchlistItemModal from './components/WatchlistItemModal'
import {
  createWatchlistItem,
  getAllWatchlistItems,
  updateWatchlistItem,
  deleteWatchlistItem,
  type WatchlistUpsertRequest,
} from '../../share/api/services/watchlistApi'
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
  const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<AlgoPortfolioProduct | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>('Success')
  const [modalError, setModalError] = useState<string | null>(null)

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
    if (!showSuccessToast) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setShowSuccessToast(false)
    }, 3000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [showSuccessToast])

  useEffect(() => {
    if (!showErrorToast) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setShowErrorToast(false)
    }, 4000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [showErrorToast])

  function openCreateModal() {
    setModalError(null)
    setError(null)
    setSelectedProduct(null)
    setIsWatchlistModalOpen(true)
  }

  function openEditModal(product: AlgoPortfolioProduct) {
    setModalError(null)
    setError(null)
    setSelectedProduct(product)
    setIsWatchlistModalOpen(true)
  }

  async function handleSaveWatchlistItem(payload: WatchlistUpsertRequest) {
    setModalError(null)

    try {
      if (selectedProduct?.id) {
        await updateWatchlistItem(selectedProduct.id, payload)
        setSuccessMessage(`Watchlist item ${payload.symbol} updated successfully.`)
      } else {
        await createWatchlistItem(payload)
        setSuccessMessage(`Watchlist item ${payload.symbol} created successfully.`)
      }

      const watchlistProducts = await getAllWatchlistItems()
      setProducts(watchlistProducts)
      setShowSuccessToast(true)
      setSelectedProduct(null)
      setError(null)
    } catch (saveError) {
      console.error('Watchlist save error:', saveError)
      const message =
        saveError instanceof ApiHttpError
          ? saveError.message
          : 'Unable to save watchlist item. Please try again.'
      setModalError(message)
      setError(message)
      setShowErrorToast(true)
      throw saveError
    }
  }

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
      setShowSuccessToast(true)
    } catch (deleteError) {
      console.error('Watchlist delete error:', deleteError)
      const message =
        deleteError instanceof ApiHttpError
          ? deleteError.message
          : 'Unable to delete watchlist product. Please try again.'
      setError(message)
      setShowErrorToast(true)
    } finally {
      setDeletingProductId(null)
    }
  }

  return (
    <>
      {showSuccessToast && (
        <AlertGroup isToast>
          <Alert variant="success" title={successMessage} />
        </AlertGroup>
      )}

      {showErrorToast && error && (
        <AlertGroup isToast>
          <Alert variant="danger" title={error} />
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
            <Button variant="primary" onClick={openCreateModal}>
              Add Watchlist Item
            </Button>
          </StackItem>
          <StackItem>
            {isLoading ? (
              <p>Loading watchlist...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <WatchListTable
                products={products}
                onEditProduct={openEditModal}
                onDeleteProduct={handleDeleteProduct}
                deletingProductId={deletingProductId}
              />
            )}
          </StackItem>
        </Stack>
      </PageSection>

      <WatchlistItemModal
        isOpen={isWatchlistModalOpen}
        mode={selectedProduct ? 'edit' : 'add'}
        item={selectedProduct}
        submitError={modalError}
        onClose={() => {
          setIsWatchlistModalOpen(false)
          setSelectedProduct(null)
          setModalError(null)
        }}
        onSave={handleSaveWatchlistItem}
      />
    </>
  )
}
