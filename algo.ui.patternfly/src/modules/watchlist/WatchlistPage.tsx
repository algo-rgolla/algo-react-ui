import { useEffect, useState } from 'react'
import { Alert, AlertGroup, Button, PageSection, Stack, StackItem, Title } from '@patternfly/react-core'
import type { AlgoPortfolioProduct } from '../../types/portfolio'
import WatchListTable from './components/WatchListTable'
import WatchlistItemModal from './components/WatchlistItemModal'
import {
  useCreateWatchlistItem,
  useDeleteWatchlistItem,
  useUpdateWatchlistItem,
  useWatchlistItems,
} from './hooks'
import type { WatchlistUpsertRequest } from '../../share/api/services/watchlistApi'

export default function WatchlistPage() {
  const { data, loading: isLoading, error: fetchError, refetch } = useWatchlistItems()
  const { createItem, error: createError } = useCreateWatchlistItem()
  const { updateItem, error: updateError } = useUpdateWatchlistItem()
  const { deleteItem, error: deleteError } = useDeleteWatchlistItem()

  const [pageError, setPageError] = useState<string | null>(null)
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null)
  const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<AlgoPortfolioProduct | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>('Success')
  const [modalError, setModalError] = useState<string | null>(null)

  const error = modalError ?? pageError ?? createError ?? updateError ?? deleteError ?? fetchError
  const products = data ?? []

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
    setPageError(null)
    setSelectedProduct(null)
    setIsWatchlistModalOpen(true)
  }

  function openEditModal(product: AlgoPortfolioProduct) {
    setModalError(null)
    setPageError(null)
    setSelectedProduct(product)
    setIsWatchlistModalOpen(true)
  }

  async function handleSaveWatchlistItem(payload: WatchlistUpsertRequest) {
    setModalError(null)

    try {
      if (selectedProduct?.id) {
        await updateItem(selectedProduct.id, payload)
        setSuccessMessage(`Watchlist item ${payload.symbol} updated successfully.`)
      } else {
        await createItem(payload)
        setSuccessMessage(`Watchlist item ${payload.symbol} created successfully.`)
      }

      await refetch()
      setShowSuccessToast(true)
      setSelectedProduct(null)
      setPageError(null)
    } catch (saveError) {
      console.error('Watchlist save error:', saveError)
      const message =
        saveError instanceof Error ? saveError.message : 'Unable to save watchlist item. Please try again.'
      setModalError(message)
      setPageError(message)
      setShowErrorToast(true)
      throw saveError
    }
  }

  async function handleDeleteProduct(product: AlgoPortfolioProduct) {
    const isConfirmed = window.confirm(`Delete watchlist item ${product.symbol}?`)
    if (!isConfirmed) {
      return
    }

    setPageError(null)
    setDeletingProductId(product.id)

    try {
      const response = await deleteItem(product.id)
      await refetch()
      setSuccessMessage(response.message)
      setShowSuccessToast(true)
    } catch (deleteError) {
      console.error('Watchlist delete error:', deleteError)
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : 'Unable to delete watchlist product. Please try again.'
      setPageError(message)
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
