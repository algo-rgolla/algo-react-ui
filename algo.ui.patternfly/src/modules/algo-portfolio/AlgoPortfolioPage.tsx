import { useEffect, useState } from 'react'
import { Button, Divider, PageSection, Stack, StackItem, Title } from '@patternfly/react-core'
import axios from 'axios'
import { createHolding, getHoldings } from './share/portfolioService'
import type { AlgoPortfolioCreateRequest, AlgoPortfolioProduct } from '../../types/portfolio'
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

  async function handleAddHolding(payload: AlgoPortfolioCreateRequest) {
    setIsLoading(true)
    setError(null)

    try {
      await createHolding(payload)
      await loadHoldings()
      setIsAddHoldingModalOpen(false)
    } catch (fetchError) {
      const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError)
      const statusCode = fetchError && typeof fetchError === 'object' && 'response' in fetchError ? (fetchError as { response?: { status: number } }).response?.status : undefined
      console.error('AlgoPortfolio add error:', { errorMessage, statusCode, fetchError })
      setError(`Unable to add holding${statusCode ? ` (${statusCode})` : ''}. Please try again.`)
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
                <Button variant="primary" onClick={() => setIsAddHoldingModalOpen(true)}>
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
              <HoldingsTable holdings={holdings} />
            )}
          </StackItem>
          <StackItem>
            <Divider />
          </StackItem>
        </Stack>
      </PageSection>

      <AddHoldingModal
        isOpen={isAddHoldingModalOpen}
        onClose={() => setIsAddHoldingModalOpen(false)}
        onSaveHolding={handleAddHolding}
      />
    </>
  )
}
