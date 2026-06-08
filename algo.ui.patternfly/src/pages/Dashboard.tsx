import {
  PageSection,
  PageSectionVariants,
  Title,
  Gallery,
  GalleryItem,
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
} from '@patternfly/react-core'

const summaryCards = [
  { label: 'Total Value', value: '$148,250' },
  { label: 'Day Gain/Loss', value: '+$1,340' },
  { label: 'Total Profit', value: '$52,700' },
  { label: 'Cash Balance', value: '$23,420' },
]

export default function Dashboard() {
  return (
    <>
      <PageSection variant={PageSectionVariants.secondary} padding={{ default: 'padding' }}>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 8 }}>
          Portfolio Dashboard
        </Title>
        <p>Overview of your financial performance</p>
      </PageSection>

      <PageSection padding={{ default: 'padding' }}>
        <Gallery hasGutter>
          {summaryCards.map((card) => (
            <GalleryItem key={card.label}>
              <Card>
                <CardBody>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 4 }}>
                    {card.label}
                  </p>
                  <Title headingLevel="h2" size="xl">
                    {card.value}
                  </Title>
                </CardBody>
              </Card>
            </GalleryItem>
          ))}
        </Gallery>
      </PageSection>

      <PageSection variant={PageSectionVariants.secondary} padding={{ default: 'padding' }}>
        <Grid hasGutter>
          <GridItem span={12} lg={8}>
            <Card>
              <CardTitle>Performance chart</CardTitle>
              <CardBody>
                <div
                  style={{
                    minHeight: 320,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--pf-global--BackgroundColor--100)',
                    borderRadius: 'var(--pf-global--BorderRadius--lg)',
                    color: 'var(--pf-global--Color--200)',
                    fontSize: '1rem',
                  }}
                >
                  Chart placeholder
                </div>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={12} lg={4}>
            <Card>
              <CardTitle>Watchlist preview</CardTitle>
              <CardBody>
                <p style={{ marginBottom: 16 }}>
                  Quick snapshot of your top tracked assets.
                </p>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>Stock A • 12.4% · $8,900</li>
                  <li>ETF B • 5.2% · $4,600</li>
                  <li>Crypto C • -1.8% · $2,100</li>
                </ul>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  )
}
