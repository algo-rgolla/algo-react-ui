import React from "react";
import { Container } from "reactstrap";
import { commoditiSysbols } from "../../utils/constants/algo-constants";
import TradingViewWidget from "../../features/stocks/components/TradingViewWidget";

const Commodities = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div>
            <h2>Commodities</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "20px",
              }}
            >
              {commoditiSysbols.map((symbol) => (
                <div key={symbol} style={{ height: "400px", width: "100%" }}>
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

export default Commodities;
