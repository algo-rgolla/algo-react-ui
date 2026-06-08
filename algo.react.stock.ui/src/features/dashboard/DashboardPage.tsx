import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
//Import Breadcrumb
//i18n
import { withTranslation } from "react-i18next";
import BarChart from "../../shared/components/Charts/BarChart";
import DonutChart from "../../shared/components/Charts/DonutChart";
import StockScanSummary from "../stocks/components/StockScanSummary";
import TradingViewDashboardWidget from "../stocks/components/TradingViewDashboardWidget";
import usePortfolioStatistics from "../../shared/hooks/usePortfolioStatistics";
import {
  algoScanTypes,
  scanTypeDisplayNames,
} from "../../shared/utils/constants";

const Dashboard = () => {
  const { chartData, loading, error } = usePortfolioStatistics();
  //meta title
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
                    series={chartData[scanType]?.values || []}
                    dataColors='["--bs-success","--bs-danger","--bs-primary", "--bs-warning"]'
                  />
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
        <Row>
          {algoScanTypes.map((scanType) => (
            <Col key={scanType} xl={6} md={12}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">
                    {scanTypeDisplayNames[scanType] ?? scanType}
                  </CardTitle>
                  <BarChart
                    categories={chartData[scanType]?.labels || []}
                    series={[
                      {
                        data: chartData[scanType]?.values || [],
                      },
                    ]}
                    dataColors='["--bs-success","--bs-danger","--bs-primary", "--bs-warning"]'
                  />
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default withTranslation()(Dashboard);
