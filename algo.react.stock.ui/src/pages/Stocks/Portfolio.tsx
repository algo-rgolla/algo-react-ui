import React, { useMemo } from "react";
import { Col, Container, Row } from "reactstrap";
import { useParams } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { getScanTypeDescription } from "../../shared/utils/getScanTypeDescription";
import { ProductDetails } from "../../features/stocks/components/ProductDetails";
import {
  calculateCapitalInvested,
  calculateTotalProfitLoss,
} from "../../shared/utils/algoUtils";
import { GET_PORTFOLIO_LIST_API_URL } from "../../shared/utils/constants/apiConstants";
import { useFetch } from "../../shared/hooks/useFetchData";

const Portfolio: React.FC = () => {
  const { portfolioType } = useParams<{ portfolioType: string }>();

  if (!portfolioType) {
    return <div>Portfolio type is not specified.</div>;
  }

  const {
    data: fetchData,
    error,
    loading,
  } = useFetch<any>(GET_PORTFOLIO_LIST_API_URL(portfolioType), [portfolioType]);

  const data: any[] = Array.isArray(fetchData?.products)
    ? fetchData.products
    : [];

  // Remove all react-table usage and just render a simple table
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>Portfolio:</Col>
            <Col>
              <strong>{getScanTypeDescription(portfolioType)}</strong>
            </Col>
            <Col>Profit/Loss:</Col>
            <Col>
              <span
                style={{
                  color: calculateTotalProfitLoss(data) > 0 ? "green" : "red",
                }}
              >
                {new Intl.NumberFormat("en-AU", {
                  style: "currency",
                  currency: "AUD",
                }).format(calculateTotalProfitLoss(data))}
              </span>
            </Col>
          </Row>
          <Row>
            <Col>Capital Amount:</Col>
            <Col>{calculateCapitalInvested(data)}</Col>
            <Col></Col>
            <Col></Col>
          </Row>
          <div className="pt-3">
            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Open Date</th>
                  <th>Open Price</th>
                  <th>Status</th>
                  <th>Close</th>
                  <th>Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={row.id || row.symbol || idx}>
                    <td>{row.symbol}</td>
                    <td>{row.openDate}</td>
                    <td>{row.openPrice}</td>
                    <td>
                      {row.status === "Up" ? (
                        <FaArrowUp color="green" />
                      ) : row.status === "Down" ? (
                        <FaArrowDown color="red" />
                      ) : null}
                    </td>
                    <td>{row.close}</td>
                    <td>
                      {parseFloat(row.profitLoss) > 0 ? (
                        <span
                          style={{
                            color: "green",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FaArrowUp style={{ marginRight: "4px" }} />
                          {row.profitLoss}
                        </span>
                      ) : parseFloat(row.profitLoss) < 0 ? (
                        <span
                          style={{
                            color: "red",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FaArrowDown style={{ marginRight: "4px" }} />
                          {row.profitLoss}
                        </span>
                      ) : (
                        row.profitLoss
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Row>
            {data.map((product, idx) => (
              <ProductDetails
                key={product.id || product.symbol || idx}
                product={product}
                componentType="Portfolio"
              />
            ))}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Portfolio;
