import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table'
import { Button } from '@patternfly/react-core'
import type { StockHolding } from '../types/portfolio'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const percentageFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const positiveColor = '#3fe1b5'
const negativeColor = '#f35a5a'

interface HoldingsTableProps {
  holdings: StockHolding[]
  onEdit?: (holding: StockHolding) => void
  onDelete?: (ticker: string) => void
}

export default function HoldingsTable({ holdings, onEdit, onDelete }: HoldingsTableProps) {
  const showActions = Boolean(onEdit || onDelete)

  return (
    <Table aria-label="Holdings table" variant="compact">
      <Thead>
        <Tr>
          <Th>Ticker</Th>
          <Th>Company Name</Th>
          <Th style={{ textAlign: 'right' }}>Shares Owned</Th>
          <Th style={{ textAlign: 'right' }}>Avg Cost</Th>
          <Th style={{ textAlign: 'right' }}>Current Price</Th>
          <Th style={{ textAlign: 'right' }}>Market Value</Th>
          <Th style={{ textAlign: 'right' }}>Total Return (%)</Th>
          {showActions && <Th style={{ textAlign: 'right' }}>Actions</Th>}
        </Tr>
      </Thead>
      <Tbody>
        {holdings.map((holding) => {
          const returnColor = holding.totalGainLossPercentage >= 0 ? positiveColor : negativeColor
          const formattedReturn = percentageFormatter.format(holding.totalGainLossPercentage / 100)

          return (
            <Tr key={holding.ticker}>
              <Td dataLabel="Ticker" style={{ textAlign: 'left' }}>
                {holding.ticker}
              </Td>
              <Td dataLabel="Company Name" style={{ textAlign: 'left' }}>
                {holding.companyName}
              </Td>
              <Td dataLabel="Shares Owned" style={{ textAlign: 'right' }}>
                {holding.sharesOwned.toLocaleString()}
              </Td>
              <Td dataLabel="Avg Cost" style={{ textAlign: 'right' }}>
                {currencyFormatter.format(holding.averageCostBasis)}
              </Td>
              <Td dataLabel="Current Price" style={{ textAlign: 'right' }}>
                {currencyFormatter.format(holding.currentPrice)}
              </Td>
              <Td dataLabel="Market Value" style={{ textAlign: 'right' }}>
                {currencyFormatter.format(holding.totalValue)}
              </Td>
              <Td dataLabel="Total Return (%)" style={{ textAlign: 'right', color: returnColor, fontWeight: 600 }}>
                {formattedReturn}
              </Td>
              {showActions && (
                <Td style={{ textAlign: 'right' }}>
                  {onEdit && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(holding)}
                    >
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(holding.ticker)}
                      style={{ marginLeft: onEdit ? 8 : 0 }}
                    >
                      Delete
                    </Button>
                  )}
                </Td>
              )}
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}
