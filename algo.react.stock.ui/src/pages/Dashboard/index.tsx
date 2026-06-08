import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";

//Import Breadcrumb

//i18n
import { withTranslation } from "react-i18next";
import BarChart from "../../shared/components/Charts/BarChart";
import DonutChart from "../../shared/components/Charts/DonutChart";
import StockScanSummary from "../../features/stocks/components/StockScanSummary";
import TradingViewDashboardWidget from "../../features/stocks/components/TradingViewDashboardWidget";
import usePortfolioStatistics from "../../hooks/usePortfolioStatistics";
import { algoScanTypes, scanTypeDisplayNames } from "../../utils/constants";

const Dashboard = () => {
  const { chartData, loading, error } = usePortfolioStatistics();
  //meta title
  document.title = "Algo Scanner - Dashboard";

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
      </Container>
    </div>
  );
};

export default withTranslation()(Dashboard);
