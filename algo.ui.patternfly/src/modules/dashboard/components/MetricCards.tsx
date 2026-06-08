import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Gallery,
  GalleryItem,
} from '@patternfly/react-core'
import type { PortfolioSummary } from '../../../types/portfolio'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const positiveColor = '#3fe1b5'
const negativeColor = '#f35a5a'

interface MetricCardsProps {
  summary: PortfolioSummary
}

export default function MetricCards({ summary }: MetricCardsProps) {
  const summaryBlocks = [
    { label: 'Total Value', value: summary.totalValue },
    { label: 'Day Gain/Loss', value: summary.dayGainLoss, highlight: true },
    { label: 'Total Profit', value: summary.totalProfit, highlight: true },
    { label: 'Cash Balance', value: summary.cashBalance },
  ]

  return (
    <Gallery hasGutter>
      {summaryBlocks.map(({ label, value, highlight }) => {
        const valueColor = highlight
          ? value >= 0
            ? positiveColor
            : negativeColor
          : undefined

        return (
          <GalleryItem key={label}>
            <Card>
              <CardHeader>
                <CardTitle>{label}</CardTitle>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: valueColor,
                    minHeight: 48,
                  }}
                >
                  {currencyFormatter.format(value)}
                </div>
              </CardBody>
            </Card>
          </GalleryItem>
        )
      })}
    </Gallery>
  )
}
