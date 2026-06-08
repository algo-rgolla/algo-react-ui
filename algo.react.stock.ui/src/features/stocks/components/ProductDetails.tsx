import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import { convertToAustralianTime } from "../../../utils/algoUtils";
import { getScanTypeDescription } from "../../../utils/constants";
import { ProductChartImage } from "./ProductChartImage";

interface Props {
  product: Product;
  handleClose?: (symbol: string) => void;
  componentType: string;
  onDeleteWatchlist?: (id: number) => void;
}

export const ProductDetails = ({
  product,
  handleClose,
  componentType,
  onDeleteWatchlist,
}: Props) => {
  console.log("Rendering ProductDetails for:", product);
  return (
    <Col key={product.symbol}>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center">
            <CardTitle tag="h5">{product.symbol}</CardTitle>
            <Button
              close
              aria-label="Close"
              onClick={() => handleClose && handleClose(product.symbol)}
            >
              <span aria-hidden="true">&times;</span>
            </Button>
          </div>
          <Row>
            <Col>Name: </Col>
            <Col>
              <strong>{product.name || "N/A"}</strong>
            </Col>
            <Col>Market Cap:</Col>
            <Col>{product.marketCap || "N/A"}</Col>
          </Row>
          <Row>
            <Col>Current Price:</Col>
            <Col>{product.closePrice || "N/A"}</Col>

            <Col>Price Change:</Col>
            <Col>
              {product.changePercent ? `${product.changePercent}%` : "N/A"}
            </Col>
          </Row>
          <Row>
            <Col>Trading View</Col>
            <Col>
              <strong>
                <a
                  target="_blank"
                  rel="noopener"
                  href={`https://www.tradingview.com/chart/?symbol=ASX:${product.symbol}&amp;aff_id=4009`}
                >
                  {product.symbol}
                </a>
              </strong>
            </Col>
            <Col>Market Index</Col>
            <Col>
              <strong>
                <a
                  target="_blank"
                  rel="noopener"
                  href={`https://www.marketindex.com.au/asx/${product.symbol}`}
                >
                  {product.symbol}
                </a>
              </strong>
            </Col>
          </Row>
          {componentType == "LongScan" && (
            <>
              <Row>
                <Col>Scan Date</Col>
                <Col>{convertToAustralianTime(product.scanDate)}</Col>
                <Col>Scan Type</Col>
                <Col>{getScanTypeDescription(product.scanType)}</Col>
              </Row>
              <Row>
                <Col>ATR</Col>
                <Col>{product.atr}</Col>
                <Col>Stop Loss</Col>
                <Col>{product.stopLoss}</Col>
              </Row>
              <Row>
                <Col>Volume</Col>
                <Col>{product.volume}</Col>
                <Col></Col>
                <Col></Col>
              </Row>
            </>
          )}
          {componentType == "Portfolio" && (
            <>
              <Row>
                <Col xs="12">
                  <hr />
                </Col>
              </Row>

              <Row>
                <Col>
                  <b>Position Details</b>
                </Col>
                <Col></Col>
                <Col></Col>
                <Col></Col>
              </Row>

              <Row>
                <Col>Open Date:</Col>
                <Col>{product.openDate || "N/A"}</Col>
                <Col>Open Price</Col>
                <Col>{product.openPrice}</Col>
              </Row>
              <Row>
                <Col>Volume</Col>
                <Col>{product.volume}</Col>
                <Col>Close Price</Col>
                <Col>{product.close}</Col>
              </Row>

              <Row>
                <Col>Stop Loss</Col>
                <Col>{product.stopLoss}</Col>
                <Col>Profit/Loss:</Col>
                <Col>
                  <span
                    className={
                      parseFloat(product.profitLoss) > 0
                        ? "profit-text"
                        : "loss-text"
                    }
                  >
                    {product.profitLoss}
                  </span>
                </Col>
              </Row>
            </>
          )}
          {componentType == "Watchlist" && (
            <>
              <Row>
                <Col>
                  <Button
                    close
                    aria-label="Close"
                    onClick={() =>
                      onDeleteWatchlist &&
                      onDeleteWatchlist(product.watchlistId)
                    }
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            </>
          )}
          {componentType == "PortfolioHistory" && (
            <>
              <Row>
                <Col xs="12">
                  <hr />
                </Col>
              </Row>

              <Row>
                <Col>
                  <b>Position Details</b>
                </Col>
                <Col></Col>
                <Col></Col>
                <Col></Col>
              </Row>

              <Row>
                <Col>Open Date:</Col>
                <Col>{product.openDate || "N/A"}</Col>
                <Col>Open Price</Col>
                <Col>{product.openPrice}</Col>
              </Row>
              <Row>
                <Col>Close Date:</Col>
                <Col>{product.closeDate}</Col>

                <Col>Close Price</Col>
                <Col>{product.closePrice}</Col>
              </Row>

              <Row>
                <Col>Size:</Col>
                <Col>{product.volume}</Col>

                <Col>Stop Loss</Col>
                <Col>{product.stopLoss}</Col>
              </Row>

              <Row>
                <Col>Scan Type</Col>
                <Col>{product.comments}</Col>
                <Col>Profit/Loss:</Col>
                <Col>
                  <span
                    className={
                      parseFloat(product.profitLoss) > 0
                        ? "profit-text"
                        : "loss-text"
                    }
                  >
                    {product.profitLoss}
                  </span>
                </Col>
              </Row>

              <Row>
                <Col>Sell Reason:</Col>
                <Col md={9}>
                  <b>{product.sellReason}</b>
                </Col>
              </Row>
            </>
          )}

          <Row className="mt-3">
            <Col md={12}>
              <ProductChartImage symbol={product.symbol} exchange={product.exchange === 'AU' ? 'ASX' : product.exchange} />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};
