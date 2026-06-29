import { Alert, Breadcrumb, BreadcrumbItem, PageSection, Stack, StackItem, Title } from '@patternfly/react-core'
import HoldingsTable from './components/HoldingsTable'
import { useAlgoPortfolioHistory } from './hooks'

export default function AlgoPortfolioHistoryPage() {
  const { data, loading, error } = useAlgoPortfolioHistory()

  return (
    <>
      <PageSection variant="secondary" padding={{ default: 'padding' }}>
        <Stack hasGutter>
          <StackItem>
            <Breadcrumb>
              <BreadcrumbItem to="/">Dashboard</BreadcrumbItem>
              <BreadcrumbItem to="/portfolio">Portfolio</BreadcrumbItem>
              <BreadcrumbItem isActive>History</BreadcrumbItem>
            </Breadcrumb>
          </StackItem>
          <StackItem>
            <Title headingLevel="h1" size="2xl">
              Portfolio History
            </Title>
          </StackItem>
        </Stack>
      </PageSection>

      <PageSection padding={{ default: 'padding' }}>
        {loading ? (
          <p>Loading portfolio history...</p>
        ) : error ? (
          <Alert variant="danger" isInline title={error} />
        ) : (
          <HoldingsTable holdings={data} />
        )}
      </PageSection>
    </>
  )
}
