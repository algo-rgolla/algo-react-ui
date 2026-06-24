import { useEffect, useState } from 'react'
import { Button, Divider, PageSection, Stack, StackItem, Title } from '@patternfly/react-core'
import axios from 'axios'
import { getHoldings, saveHolding } from './share/portfolioService'
import type { AlgoPortfolioProduct, AlgoPortfolioSaveRequest } from '../../types/portfolio'
import HoldingsTable from './components/HoldingsTable'
import AddHoldingModal from './components/AddHoldingModal'

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

  async function loadHoldings() {
    setIsLoading(true)
    setError(null)

    try {
      const products = await getHoldings()
      setHoldings(products)
    } catch (fetchError) {
      if (isAbortError(fetchError)) {
        return
      }

      console.error('AlgoPortfolio fetch error:', fetchError)
      setError('Unable to load portfolio holdings. Please try again.')
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
    setSelectedHolding(null)
    setIsAddHoldingModalOpen(true)
  }

  function openEditHoldingModal(holding: AlgoPortfolioProduct) {
    setSelectedHolding(holding)
    setIsAddHoldingModalOpen(true)
  }

  async function handleSaveHolding(payload: AlgoPortfolioSaveRequest) {
    setIsLoading(true)
    setError(null)

    try {
      await saveHolding(payload)
      await loadHoldings()
      setIsAddHoldingModalOpen(false)
      setSelectedHolding(null)
    } catch (fetchError) {
      const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError)
      const statusCode = fetchError && typeof fetchError === 'object' && 'response' in fetchError ? (fetchError as { response?: { status: number } }).response?.status : undefined
      console.error('AlgoPortfolio save error:', { errorMessage, statusCode, fetchError, payload })
      setError(
        payload.algoPortfolioId > 0
          ? `Unable to update holding${statusCode ? ` (${statusCode})` : ''}. Please try again.`
          : `Unable to add holding${statusCode ? ` (${statusCode})` : ''}. Please try again.`,
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <PageSection variant="secondary" padding={{ default: 'padding' }}>
        <Stack hasGutter>
          <StackItem>
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h1" size="2xl" style={{ marginBottom: 8 }}>
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
              <p style={{ color: '#c9190b' }}>{error}</p>
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
