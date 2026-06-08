import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import { withTranslation } from "react-i18next";
import BarChart from "../../shared/components/Charts/BarChart";
import DonutChart from "../../shared/components/Charts/DonutChart";
import StockScanSummary from "../../features/stocks/components/StockScanSummary";
import TradingViewDashboardWidget from "../../features/stocks/components/TradingViewDashboardWidget";
import usePortfolioStatistics from "../../features/stocks/hooks/usePortfolioStatistics";
import { algoScanTypes, scanTypeDisplayNames } from "../../utils/constants";

const DashboardPage = () => {
  const { chartData, loading, error } = usePortfolioStatistics();
  document.title = "Dashboard | AlgoTrak Admin & Dashboard Template";

  if (loading) return <div>Loading charts...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col md={6}>
            <StockScanSummary />
          </Col>
          <Col md={6}></Col>
        </Row>
        <Row>
          {algoScanTypes.map((scanType) => (
            <Col key={scanType} xl={4} lg={6} md={6}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">
                    {scanTypeDisplayNames[scanType] ?? scanType}
                  </CardTitle>
                  <DonutChart
                    labels={chartData[scanType]?.labels || []}
                    values={chartData[scanType]?.values || []}
                  />
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
        <Row>
          <Col md={12}>
            <BarChart />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <TradingViewDashboardWidget />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withTranslation()(DashboardPage);
