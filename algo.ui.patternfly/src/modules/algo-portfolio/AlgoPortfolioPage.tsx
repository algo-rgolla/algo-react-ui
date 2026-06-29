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
  Divider,
  PageSection,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import type { AlgoPortfolioProduct, AlgoPortfolioSaveRequest } from '../../types/portfolio'
import HoldingsTable from './components/HoldingsTable'
import AddHoldingModal from './components/AddHoldingModal'
import {
  useAlgoPortfolioItem,
  useAlgoPortfolioItems,
  useCreateAlgoPortfolioItem,
  useDeleteAlgoPortfolioItem,
  useUpdateAlgoPortfolioItem,
} from './hooks'
import './AlgoPortfolioPage.css'

export default function AlgoPortfolioPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const routeItemId = id ? Number.parseInt(id, 10) : NaN
  const hasRouteId = Number.isFinite(routeItemId)
  const isCreateRoute = location.pathname === '/portfolio/create'
  const isEditRoute = hasRouteId && location.pathname.endsWith('/edit')
  const isDetailRoute = hasRouteId && !isEditRoute

  const { data, loading: isLoading, error: fetchError, refetch } = useAlgoPortfolioItems()
  const {
    data: routeItem,
    loading: isRouteItemLoading,
    error: routeItemError,
  } = useAlgoPortfolioItem(hasRouteId ? routeItemId : null)
  const { createItem, error: createError } = useCreateAlgoPortfolioItem()
  const { updateItem, error: updateError } = useUpdateAlgoPortfolioItem()
  const { deleteItem, error: deleteError } = useDeleteAlgoPortfolioItem()

  const [pageError, setPageError] = useState<string | null>(null)
  const [isAddHoldingModalOpen, setIsAddHoldingModalOpen] = useState(false)
  const [selectedHolding, setSelectedHolding] = useState<AlgoPortfolioProduct | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [modalError, setModalError] = useState<string | null>(null)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [deletingHoldingId, setDeletingHoldingId] = useState<number | null>(null)

  const error = modalError ?? pageError ?? createError ?? updateError ?? deleteError ?? routeItemError ?? fetchError
  const holdings = data ?? []

  useEffect(() => {
    if (isCreateRoute) {
      setSelectedHolding(null)
      setIsAddHoldingModalOpen(true)
      return
    }

    if (isEditRoute) {
      setIsAddHoldingModalOpen(true)
      if (routeItem) {
        setSelectedHolding(routeItem)
      }
      return
    }

    setIsAddHoldingModalOpen(false)
  }, [isCreateRoute, isEditRoute, routeItem])

  function openAddHoldingModal() {
    setPageError(null)
    setModalError(null)
    setSelectedHolding(null)
    navigate('/portfolio/create')
  }

  function openEditHoldingModal(holding: AlgoPortfolioProduct) {
    setPageError(null)
    setModalError(null)
    setSelectedHolding(holding)
    navigate(`/portfolio/${holding.id}/edit`)
  }

  function openViewHoldingRoute(holding: AlgoPortfolioProduct) {
    navigate(`/portfolio/${holding.id}`)
  }

  async function handleDeleteHolding(holding: AlgoPortfolioProduct) {
    const isConfirmed = window.confirm(`Delete holding ${holding.symbol}?`)
    if (!isConfirmed) {
      return
    }

    setPageError(null)
    setDeletingHoldingId(holding.id)

    try {
      const response = await deleteItem(holding.id)
      await refetch()
      setSuccessMessage(response.message)
      if (isDetailRoute && routeItemId === holding.id) {
        navigate('/portfolio')
      }
    } catch (deleteError) {
      console.error('AlgoPortfolio delete error:', deleteError)
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : 'Unable to delete holding. Please try again.'
      setPageError(message)
      setShowErrorToast(true)
    } finally {
      setDeletingHoldingId(null)
    }
  }

  async function handleSaveHolding(payload: AlgoPortfolioSaveRequest) {
    setPageError(null)
    setModalError(null)

    try {
      const updateId = isEditRoute ? routeItemId : payload.algoPortfolioId

      if (updateId > 0) {
        await updateItem(updateId, payload)
        setSuccessMessage(`Holding ${payload.symbol} updated successfully.`)
      } else {
        await createItem({
          ...payload,
          algoPortfolioId: 0,
        })
        setSuccessMessage(`Holding ${payload.symbol} created successfully.`)
      }

      await refetch()
      setIsAddHoldingModalOpen(false)
      setSelectedHolding(null)
      navigate('/portfolio')
    } catch (fetchError) {
      console.error('AlgoPortfolio save error:', fetchError)
      const fallbackMessage =
        payload.algoPortfolioId > 0
          ? 'Unable to update holding. Please try again.'
          : 'Unable to add holding. Please try again.'
      const message =
        fetchError instanceof Error ? fetchError.message : fallbackMessage
      setPageError(message)
      setModalError(message)
      setShowErrorToast(true)
      throw fetchError
    }
  }

  useEffect(() => {
    if (!successMessage) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [successMessage])

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

  return (
    <>
      {successMessage && (
        <AlertGroup isToast>
          <Alert variant="success" title={successMessage} />
        </AlertGroup>
      )}

      {showErrorToast && error && (
        <AlertGroup isToast>
          <Alert variant="danger" title={error} />
        </AlertGroup>
      )}

      <PageSection variant="secondary" padding={{ default: 'padding' }}>
        <Stack hasGutter>
          <StackItem>
            <Breadcrumb>
              <BreadcrumbItem to="/">Dashboard</BreadcrumbItem>
              <BreadcrumbItem isActive>
                {isDetailRoute ? `Portfolio Item ${routeItemId}` : 'Portfolio'}
              </BreadcrumbItem>
            </Breadcrumb>
          </StackItem>
          <StackItem>
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h1" size="2xl" className="algo-portfolio-page__title">
                  {isDetailRoute ? `Portfolio Item #${routeItemId}` : 'Algo Portfolio'}
                </Title>
                <p>View the current portfolio list as returned from the backend API.</p>
              </StackItem>
              <StackItem>
                <Button variant="primary" onClick={openAddHoldingModal}>
                  Add Holding
                </Button>
                {isDetailRoute && (
                  <Button variant="secondary" onClick={() => navigate(`/portfolio/${routeItemId}/edit`)} style={{ marginLeft: 8 }}>
                    Edit Holding
                  </Button>
                )}
                {isDetailRoute && routeItem && (
                  <Button
                    variant="danger"
                    onClick={() => void handleDeleteHolding(routeItem)}
                    isDisabled={deletingHoldingId === routeItem.id}
                    style={{ marginLeft: 8 }}
                  >
                    Delete Holding
                  </Button>
                )}
                <Button variant="link" onClick={() => navigate('/portfolio/history')}>
                  View History
                </Button>
              </StackItem>
            </Stack>
          </StackItem>
          {isDetailRoute && (
            <StackItem>
              {isRouteItemLoading ? (
                <p>Loading portfolio item details...</p>
              ) : routeItem ? (
                <DescriptionList isHorizontal>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Symbol</DescriptionListTerm>
                    <DescriptionListDescription>{routeItem.symbol}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Volume</DescriptionListTerm>
                    <DescriptionListDescription>{routeItem.volume}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Status</DescriptionListTerm>
                    <DescriptionListDescription>{routeItem.status}</DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              ) : (
                <Alert variant="warning" isInline title="Portfolio item was not found." />
              )}
            </StackItem>
          )}
        </Stack>
      </PageSection>

      <PageSection padding={{ default: 'padding' }}>
        <Stack hasGutter>
          <StackItem>
            {isLoading ? (
              <p>Loading portfolio holdings...</p>
            ) : error ? (
              <p className="algo-portfolio-page__error">{error}</p>
            ) : (
              <HoldingsTable
                holdings={holdings}
                onViewApiHolding={openViewHoldingRoute}
                onEditApiHolding={openEditHoldingModal}
                onDeleteApiHolding={handleDeleteHolding}
                deletingApiHoldingId={deletingHoldingId}
              />
            )}
          </StackItem>
          <StackItem>
            <Divider />
          </StackItem>
        </Stack>
      </PageSection>

      <AddHoldingModal
        isOpen={isAddHoldingModalOpen}
        mode={isEditRoute || Boolean(selectedHolding) ? 'edit' : 'add'}
        holding={selectedHolding}
        submitError={modalError}
        onClose={() => {
          setIsAddHoldingModalOpen(false)
          setSelectedHolding(null)
          setModalError(null)
          if (isCreateRoute || isEditRoute) {
            navigate('/portfolio')
          }
        }}
        onSaveHolding={handleSaveHolding}
      />
    </>
  )
}
