import { useEffect, useState } from 'react'
import { Alert, AlertGroup, Button, Divider, PageSection, Stack, StackItem, Title } from '@patternfly/react-core'
import axios from 'axios'
import {
  createAlgoPortfolioItem,
  getAllAlgoPortfolioItems,
  updateAlgoPortfolioItem,
} from '../../share/api/services/algoPortfolioApi'
import { ApiHttpError } from '../../share/api/types'
import type { AlgoPortfolioProduct, AlgoPortfolioSaveRequest } from '../../types/portfolio'
import HoldingsTable from './components/HoldingsTable'
import AddHoldingModal from './components/AddHoldingModal'
import './AlgoPortfolioPage.css'

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
  const [isAddHoldingModalOpen, setIsAddHoldingModalOpen] = useState(false)
  const [selectedHolding, setSelectedHolding] = useState<AlgoPortfolioProduct | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function loadHoldings() {
    setIsLoading(true)
    setError(null)

    try {
      const products = await getAllAlgoPortfolioItems()
      setHoldings(products)
    } catch (fetchError) {
      if (isAbortError(fetchError)) {
        return
      }

      console.error('AlgoPortfolio fetch error:', fetchError)
      const message =
        fetchError instanceof ApiHttpError
          ? fetchError.message
          : 'Unable to load portfolio holdings. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    async function loadHoldingsSafely() {
      if (!isMounted) {
        return
      }

      await loadHoldings()
    }

    void loadHoldingsSafely()

    return () => {
      isMounted = false
    }
  }, [])

  function openAddHoldingModal() {
    setError(null)
    setSelectedHolding(null)
    setIsAddHoldingModalOpen(true)
  }

  function openEditHoldingModal(holding: AlgoPortfolioProduct) {
    setError(null)
    setSelectedHolding(holding)
    setIsAddHoldingModalOpen(true)
  }

  async function handleSaveHolding(payload: AlgoPortfolioSaveRequest) {
    setIsLoading(true)
    setError(null)

    try {
      if (payload.algoPortfolioId > 0) {
        await updateAlgoPortfolioItem(payload.algoPortfolioId, payload)
        setSuccessMessage(`Holding ${payload.symbol} updated successfully.`)
      } else {
        await createAlgoPortfolioItem({
          ...payload,
          algoPortfolioId: 0,
        })
        setSuccessMessage(`Holding ${payload.symbol} created successfully.`)
      }

      await loadHoldings()
      setIsAddHoldingModalOpen(false)
      setSelectedHolding(null)
    } catch (fetchError) {
      console.error('AlgoPortfolio save error:', fetchError)
      const fallbackMessage =
        payload.algoPortfolioId > 0
          ? 'Unable to update holding. Please try again.'
          : 'Unable to add holding. Please try again.'
      const message =
        fetchError instanceof ApiHttpError ? fetchError.message : fallbackMessage
      setError(message)
    } finally {
      setIsLoading(false)
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

  return (
    <>
      {successMessage && (
        <AlertGroup isToast>
          <Alert variant="success" title={successMessage} />
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
        onClose={() => {
          setIsAddHoldingModalOpen(false)
          setSelectedHolding(null)
        }}
        onSaveHolding={handleSaveHolding}
      />
    </>
  )
}
