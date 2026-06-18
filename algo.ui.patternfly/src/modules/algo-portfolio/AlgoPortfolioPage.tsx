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
            <HoldingsTable holdings={holdings} />
          </StackItem>
          <StackItem>
            <Divider />
          </StackItem>
        </Stack>
      </PageSection>

      <AddHoldingModal
        isOpen={isAddHoldingModalOpen}
        onClose={() => setIsAddHoldingModalOpen(false)}
        onAddHolding={(holding) => setHoldings((current) => [...current, holding])}
      />
    </>
  )
}