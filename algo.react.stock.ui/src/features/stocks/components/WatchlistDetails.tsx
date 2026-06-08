import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import { convertToAustralianTime } from "../../../utils/algoUtils";
import { getScanTypeDescription } from "../../../utils/constants";
import { useAlgoContext } from "../../../shared/context/AlgoContext";
import { ProductChartImage } from "./ProductChartImage";

interface Props {
  product: Product;
  handleClose?: (symbol: string) => void;
  componentType: string;
  onDeleteWatchlist?: (id: number) => void;
}

export const WatchlistDetails = ({
  product,
  handleClose,
  componentType,
  onDeleteWatchlist,
}: Props) => {
  const { isAdmin } = useAlgoContext();
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
            <Col xs="12" className="d-flex justify-content-end ">
              {isAdmin && (
                <Button
                  color="primary"
                  className="btn btn-danger waves-effect waves-light "
                  onClick={() =>
                    onDeleteWatchlist && onDeleteWatchlist(product.id)
                  }
                >
                  Delete
                </Button>
              )}
            </Col>
          </Row>
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

          {/* <img
								src={`http://chart.eoddata.com/?e=ASX&s=${product.symbol}&w=800&h=400&bs=candle&ma=21-63&mat=EMA-EMA&i=MACD`}
								width="800"
								height="400"
							/> */}
          <Row className="mt-3">
            <Col md={12}>
              <ProductChartImage symbol={product.symbol} />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};
