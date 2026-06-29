import { useEffect, useState } from 'react'
import {
  Alert,
  AlertGroup,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  PageSection,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import type { AlgoPortfolioProduct } from '../../types/portfolio'
import WatchListTable from './components/WatchListTable'
import WatchlistItemModal from './components/WatchlistItemModal'
import {
  useCreateWatchlistItem,
  useDeleteWatchlistItem,
  useWatchlistItem,
  useUpdateWatchlistItem,
  useWatchlistItems,
} from './hooks'
import type { WatchlistUpsertRequest } from '../../share/api/services/watchlistApi'

export default function WatchlistPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const routeItemId = id ? Number.parseInt(id, 10) : NaN
  const hasRouteId = Number.isFinite(routeItemId)
  const isCreateRoute = location.pathname === '/watchlist/create'
  const isEditRoute = hasRouteId && location.pathname.endsWith('/edit')
  const isDetailRoute = hasRouteId && !isEditRoute

  const { data, loading: isLoading, error: fetchError, refetch } = useWatchlistItems()
  const {
    data: routeItem,
    loading: isRouteItemLoading,
    error: routeItemError,
  } = useWatchlistItem(hasRouteId ? routeItemId : null)
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

  const error =
    modalError ??
    pageError ??
    createError ??
    updateError ??
    deleteError ??
    routeItemError ??
    fetchError
  const products = data ?? []

  useEffect(() => {
    if (isCreateRoute) {
      setSelectedProduct(null)
      setIsWatchlistModalOpen(true)
      return
    }

    if (isEditRoute) {
      setIsWatchlistModalOpen(true)
      if (routeItem) {
        setSelectedProduct(routeItem)
      }
      return
    }

    setIsWatchlistModalOpen(false)
  }, [isCreateRoute, isEditRoute, routeItem])

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
    navigate('/watchlist/create')
  }

  function openEditModal(product: AlgoPortfolioProduct) {
    setModalError(null)
    setPageError(null)
    setSelectedProduct(product)
    navigate(`/watchlist/${product.id}/edit`)
  }

  function openViewRoute(product: AlgoPortfolioProduct) {
    navigate(`/watchlist/${product.id}`)
  }

  async function handleSaveWatchlistItem(payload: WatchlistUpsertRequest) {
    setModalError(null)

    try {
      const updateId = isEditRoute ? routeItemId : selectedProduct?.id

      if (updateId) {
        await updateItem(updateId, payload)
        setSuccessMessage(`Watchlist item ${payload.symbol} updated successfully.`)
      } else {
        await createItem(payload)
        setSuccessMessage(`Watchlist item ${payload.symbol} created successfully.`)
      }

      await refetch()
      setShowSuccessToast(true)
      setSelectedProduct(null)
      setPageError(null)
      navigate('/watchlist')
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
            <Breadcrumb>
              <BreadcrumbItem to="/">Dashboard</BreadcrumbItem>
              <BreadcrumbItem isActive>
                {isDetailRoute ? `Watchlist Item ${routeItemId}` : 'Watchlist'}
              </BreadcrumbItem>
            </Breadcrumb>
          </StackItem>
          <StackItem>
            <Title headingLevel="h1" size="2xl">
              {isDetailRoute ? `Watchlist Item #${routeItemId}` : 'Watchlist'}
            </Title>
          </StackItem>
          <StackItem>
            <Button variant="primary" onClick={openCreateModal}>
              Add Watchlist Item
            </Button>
            {isDetailRoute && (
              <Button variant="secondary" onClick={() => navigate(`/watchlist/${routeItemId}/edit`)} style={{ marginLeft: 8 }}>
                Edit Item
              </Button>
            )}
          </StackItem>
          {isDetailRoute && (
            <StackItem>
              {isRouteItemLoading ? (
                <p>Loading watchlist item details...</p>
              ) : routeItem ? (
                <DescriptionList isHorizontal>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Symbol</DescriptionListTerm>
                    <DescriptionListDescription>{routeItem.symbol}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Exchange</DescriptionListTerm>
                    <DescriptionListDescription>{routeItem.exchange}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Status</DescriptionListTerm>
                    <DescriptionListDescription>{routeItem.status}</DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              ) : (
                <Alert variant="warning" isInline title="Watchlist item was not found." />
              )}
            </StackItem>
          )}
          <StackItem>
            {isLoading ? (
              <p>Loading watchlist...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <WatchListTable
                products={products}
                onViewProduct={openViewRoute}
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
        mode={isEditRoute || Boolean(selectedProduct) ? 'edit' : 'add'}
        item={selectedProduct}
        submitError={modalError}
        onClose={() => {
          setIsWatchlistModalOpen(false)
          setSelectedProduct(null)
          setModalError(null)
          if (isCreateRoute || isEditRoute) {
            navigate('/watchlist')
          }
        }}
        onSave={handleSaveWatchlistItem}
      />
    </>
  )
}
