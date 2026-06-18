import { useState } from 'react'
import { Button, Divider, PageSection, Stack, StackItem, Title } from '@patternfly/react-core'
import type { StockHolding } from '../../types/portfolio'
import { useMockData } from '../../hooks/useMockData'
import HoldingsTable from './components/HoldingsTable'
import AddHoldingModal from './components/AddHoldingModal'

export default function AlgoPortfolioPage() {
  const { stockHoldings } = useMockData()
  const [holdings, setHoldings] = useState<StockHolding[]>(() => stockHoldings)
  const [isAddHoldingModalOpen, setIsAddHoldingModalOpen] = useState(false)
  const [editingHolding, setEditingHolding] = useState<StockHolding | null>(null)

  const isHoldingModalOpen = isAddHoldingModalOpen || editingHolding !== null

  const closeHoldingModal = () => {
    setIsAddHoldingModalOpen(false)
    setEditingHolding(null)
  }

  const handleSaveHolding = (savedHolding: StockHolding) => {
    setHoldings((currentHoldings) => {
      if (!editingHolding) {
        return [...currentHoldings, savedHolding]
      }

      return currentHoldings.map((holding) => (holding.ticker === editingHolding.ticker ? savedHolding : holding))
    })
  }

  const handleDeleteHolding = (ticker: string) => {
    setHoldings((currentHoldings) => currentHoldings.filter((holding) => holding.ticker !== ticker))
  }

  return (
    <>
      <PageSection variant="secondary" padding={{ default: 'padding' }}>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h1" size="2xl" style={{ marginBottom: 8 }}>
              Algo Portfolio
            </Title>
            <p>Manage your stock portfolio with sample holdings and add new rows from the modal form.</p>
          </StackItem>
          <StackItem>
            <Button variant="primary" onClick={() => setIsAddHoldingModalOpen(true)}>
              Add Holding
            </Button>
          </StackItem>
        </Stack>
      </PageSection>

      <PageSection padding={{ default: 'padding' }}>
        <Stack hasGutter>
          <StackItem>
            <HoldingsTable
              holdings={holdings}
              onEdit={(holding) => {
                setEditingHolding(holding)
                setIsAddHoldingModalOpen(false)
              }}
              onDelete={handleDeleteHolding}
            />
          </StackItem>
          <StackItem>
            <Divider />
          </StackItem>
        </Stack>
      </PageSection>

      <AddHoldingModal
        isOpen={isHoldingModalOpen}
        onClose={closeHoldingModal}
        onSaveHolding={handleSaveHolding}
        holding={editingHolding}
      />
    </>
  )
}