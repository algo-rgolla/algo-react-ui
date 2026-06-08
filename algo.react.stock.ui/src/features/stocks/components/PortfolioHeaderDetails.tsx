import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";

interface Props {
  portfolio: IPortfolioHeaderDetails;
}

export const PortfolioHeaderDetails = ({ portfolio }: Props) => {
  return (
    <Col>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center">
            <CardTitle tag="h5"></CardTitle>
          </div>
          <Row>
            <Col>Portfolio: </Col>
            <Col>
              <strong>{portfolio.portfoioScanType || "N/A"}</strong>
            </Col>
            <Col>Profit/Loss:</Col>
            <Col>{portfolio.totalProfitLoss || "N/A"}</Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};
