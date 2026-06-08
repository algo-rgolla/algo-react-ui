import { useState } from 'react'
import {
  PageSection,
  Title,
  Button,
  Form,
  FormGroup,
  TextInput,
  Stack,
  StackItem,
  Divider,
  Split,
  SplitItem,
} from '@patternfly/react-core'
import type { StockHolding } from '../types/portfolio'
import HoldingsTable from '../components/HoldingsTable'
import { useMockData } from '../hooks/useMockData'

const defaultFormState = {
  ticker: '',
  companyName: '',
  sharesOwned: '',
  averageCostBasis: '',
  currentPrice: '',
}

type FormState = typeof defaultFormState

function computeHoldingFromForm(form: FormState, existing?: StockHolding): StockHolding {
  const sharesOwned = Number(form.sharesOwned)
  const averageCostBasis = Number(form.averageCostBasis)
  const currentPrice = Number(form.currentPrice)
  const totalValue = Number((sharesOwned * currentPrice).toFixed(2))
  const totalGainLoss = Number(((currentPrice - averageCostBasis) * sharesOwned).toFixed(2))
  const totalGainLossPercentage = averageCostBasis
    ? Number((((currentPrice - averageCostBasis) / averageCostBasis) * 100).toFixed(1))
    : existing?.totalGainLossPercentage ?? 0

  return {
    ticker: form.ticker.trim().toUpperCase(),
    companyName: form.companyName.trim(),
    sharesOwned,
    averageCostBasis,
    currentPrice,
    totalValue,
    totalGainLoss,
    totalGainLossPercentage,
  }
}

export default function PortfolioPage() {
  const { stockHoldings } = useMockData()
  const [holdings, setHoldings] = useState<StockHolding[]>(stockHoldings)
  const [formState, setFormState] = useState<FormState>(defaultFormState)
  const [editingTicker, setEditingTicker] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>('')

  const handleInputChange = (key: keyof FormState, value: string) => {
    setFormState((current) => ({ ...current, [key]: value }))
  }

  const resetForm = () => {
    setFormState(defaultFormState)
    setEditingTicker(null)
    setStatusMessage('')
  }

  const handleSave = () => {
    const ticker = formState.ticker.trim().toUpperCase()
    const companyName = formState.companyName.trim()
    const sharesOwned = Number(formState.sharesOwned)
    const averageCostBasis = Number(formState.averageCostBasis)
    const currentPrice = Number(formState.currentPrice)

    if (!ticker || !companyName || !sharesOwned || !averageCostBasis || !currentPrice) {
      setStatusMessage('Please fill in all fields before saving.')
      return
    }

    const newHolding = computeHoldingFromForm(formState)
    setHoldings((current) => {
      const existingIndex = current.findIndex((holding) => holding.ticker === ticker)

      if (existingIndex >= 0) {
        const updated = [...current]
        updated[existingIndex] = newHolding
        return updated
      }

      return [...current, newHolding]
    })

    setStatusMessage(editingTicker ? 'Holding updated.' : 'New holding added.')
    resetForm()
  }

  const handleEdit = (holding: StockHolding) => {
    setEditingTicker(holding.ticker)
    setFormState({
      ticker: holding.ticker,
      companyName: holding.companyName,
      sharesOwned: String(holding.sharesOwned),
      averageCostBasis: String(holding.averageCostBasis),
      currentPrice: String(holding.currentPrice),
    })
    setStatusMessage(`Editing ${holding.ticker}`)
  }

  const handleDelete = (ticker: string) => {
    setHoldings((current) => current.filter((holding) => holding.ticker !== ticker))
    if (editingTicker === ticker) {
      resetForm()
    }
    setStatusMessage(`${ticker} has been removed from your portfolio.`)
  }

  return (
    <>
      <PageSection variant="secondary" padding={{ default: 'padding' }}>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 8 }}>
          Algo Portfolio
        </Title>
        <p>Manage your stock portfolio with sample holdings, plus Add, Edit and Delete actions.</p>
      </PageSection>

      <PageSection padding={{ default: 'padding' }}>
        <Stack hasGutter>
          <StackItem>
            <Form>
              <Split hasGutter>
                <SplitItem>
                  <FormGroup label="Ticker" fieldId="portfolio-ticker">
                    <TextInput
                      type="text"
                      id="portfolio-ticker"
                      value={formState.ticker}
                      onChange={(_, value) => handleInputChange('ticker', String(value))}
                      placeholder="AAPL"
                    />
                  </FormGroup>
                </SplitItem>
                <SplitItem>
                  <FormGroup label="Company" fieldId="portfolio-company">
                    <TextInput
                      type="text"
                      id="portfolio-company"
                      value={formState.companyName}
                      onChange={(_, value) => handleInputChange('companyName', String(value))}
                      placeholder="Apple Inc."
                    />
                  </FormGroup>
                </SplitItem>
                <SplitItem>
                  <FormGroup label="Shares" fieldId="portfolio-shares">
                    <TextInput
                      type="number"
                      id="portfolio-shares"
                      value={formState.sharesOwned}
                      onChange={(_, value) => handleInputChange('sharesOwned', String(value))}
                      placeholder="10"
                    />
                  </FormGroup>
                </SplitItem>
                <SplitItem>
                  <FormGroup label="Avg Cost" fieldId="portfolio-avg-cost">
                    <TextInput
                      type="number"
                      id="portfolio-avg-cost"
                      value={formState.averageCostBasis}
                      onChange={(_, value) => handleInputChange('averageCostBasis', String(value))}
                      placeholder="125.00"
                    />
                  </FormGroup>
                </SplitItem>
                <SplitItem>
                  <FormGroup label="Current Price" fieldId="portfolio-current-price">
                    <TextInput
                      type="number"
                      id="portfolio-current-price"
                      value={formState.currentPrice}
                      onChange={(_, value) => handleInputChange('currentPrice', String(value))}
                      placeholder="140.00"
                    />
                  </FormGroup>
                </SplitItem>
                <SplitItem style={{ marginLeft: 'auto' }}>
                  <Button variant="primary" onClick={handleSave}>
                    {editingTicker ? 'Update Holding' : 'Add Holding'}
                  </Button>
                </SplitItem>
              </Split>
            </Form>
          </StackItem>

          <StackItem>
            <Divider />
          </StackItem>

          {statusMessage && (
            <StackItem>
              <p style={{ color: 'var(--pf-global--Color--100)', margin: 0, fontSize: '0.9rem' }}>
                {statusMessage}
              </p>
            </StackItem>
          )}

          <StackItem>
            <HoldingsTable holdings={holdings} onEdit={handleEdit} onDelete={handleDelete} />
          </StackItem>
        </Stack>
      </PageSection>
    </>
  )
}
