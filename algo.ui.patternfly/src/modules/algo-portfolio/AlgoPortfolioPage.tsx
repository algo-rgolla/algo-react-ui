import { useEffect, useState } from 'react'
import { Alert, AlertGroup, Button, Divider, PageSection, Stack, StackItem, Title } from '@patternfly/react-core'
import type { AlgoPortfolioProduct, AlgoPortfolioSaveRequest } from '../../types/portfolio'
import HoldingsTable from './components/HoldingsTable'
import AddHoldingModal from './components/AddHoldingModal'
import {
  useAlgoPortfolioItems,
  useCreateAlgoPortfolioItem,
  useUpdateAlgoPortfolioItem,
} from './hooks'
import './AlgoPortfolioPage.css'

export default function AlgoPortfolioPage() {
  const { data, loading: isLoading, error: fetchError, refetch } = useAlgoPortfolioItems()
  const { createItem, error: createError } = useCreateAlgoPortfolioItem()
  const { updateItem, error: updateError } = useUpdateAlgoPortfolioItem()

  const [pageError, setPageError] = useState<string | null>(null)
  const [isAddHoldingModalOpen, setIsAddHoldingModalOpen] = useState(false)
  const [selectedHolding, setSelectedHolding] = useState<AlgoPortfolioProduct | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [modalError, setModalError] = useState<string | null>(null)
  const [showErrorToast, setShowErrorToast] = useState(false)

  const error = modalError ?? pageError ?? createError ?? updateError ?? fetchError
  const holdings = data ?? []

  function openAddHoldingModal() {
    setPageError(null)
    setModalError(null)
    setSelectedHolding(null)
    setIsAddHoldingModalOpen(true)
  }

  function openEditHoldingModal(holding: AlgoPortfolioProduct) {
    setPageError(null)
    setModalError(null)
    setSelectedHolding(holding)
    setIsAddHoldingModalOpen(true)
  }

  async function handleSaveHolding(payload: AlgoPortfolioSaveRequest) {
    setPageError(null)
    setModalError(null)

    try {
      if (payload.algoPortfolioId > 0) {
        await updateItem(payload.algoPortfolioId, payload)
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
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h1" size="2xl" className="algo-portfolio-page__title">
                  Algo Portfolio
                </Title>
                <p>View the current portfolio list as returned from the backend API.</p>
              </StackItem>
              <StackItem>
                <Button variant="primary" onClick={openAddHoldingModal}>
                  Add Holding
                </Button>
              </StackItem>
            </Stack>
          </StackItem>
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
              <HoldingsTable holdings={holdings} onEditApiHolding={openEditHoldingModal} />
            )}
          </StackItem>
          <StackItem>
            <Divider />
          </StackItem>
        </Stack>
      </PageSection>

      <AddHoldingModal
        isOpen={isAddHoldingModalOpen}
        mode={selectedHolding ? 'edit' : 'add'}
        holding={selectedHolding}
        submitError={modalError}
        onClose={() => {
          setIsAddHoldingModalOpen(false)
          setSelectedHolding(null)
          setModalError(null)
        }}
        onSaveHolding={handleSaveHolding}
      />
    </>
  )
}
