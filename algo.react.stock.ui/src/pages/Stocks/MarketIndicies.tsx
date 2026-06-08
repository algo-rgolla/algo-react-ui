import React from "react";
import { Container } from "reactstrap";
import { marketIndices } from "../../utils/constants/algo-constants";
import TradingViewWidget from "../../features/stocks/components/TradingViewWidget";

const MarketIndicies = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div>
            <h2>Market Indices</h2>
            <div className="market-indices-grid">
              {marketIndices.map((symbol) => (
                <div key={symbol} className="market-indices-widget">
                  <TradingViewWidget symbol={symbol} />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default MarketIndicies;
