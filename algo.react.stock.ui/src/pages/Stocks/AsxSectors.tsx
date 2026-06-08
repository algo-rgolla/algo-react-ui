import React from "react";
import { Container } from "reactstrap";
import { asxSectors } from "../../utils/constants/algo-constants";
import TradingViewWidget from "../../features/stocks/components/TradingViewWidget";

const AsxSectors = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div>
            <h2>ASX Sectors</h2>
            <div className="asx-sectors-grid">
              {asxSectors.map((symbol) => (
                <div key={symbol} className="asx-sectors-widget">
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

export default AsxSectors;
