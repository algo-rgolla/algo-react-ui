import React, { useEffect } from "react";

const TradingViewDashboardWidget: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";

    script.innerHTML = JSON.stringify({
      width: "100%",
      height: 300, // Full height
      symbolsGroups: [
        {
          name: "Indices",
          originalName: "Indices",
          symbols: [
            { name: "INDEX:AORD", displayName: "ASX All Ordinaries" },
            {
              name: "FOREXCOM:DJI",
              displayName: "Dow Jones Industrial Average Index",
            },
            { name: "FOREXCOM:SPXUSD", displayName: "S&P 500 Index" },
            { name: "FOREXCOM:NSXUSD", displayName: "US 100 Cash CFD" },
            { name: "FOREXCOM:UKXGBP", displayName: "FTSE 100 Index" },
            { name: "XETR:DAX", displayName: "German DAX" },
          ],
        },
      ],
      showSymbolLogo: true,
      isTransparent: false,
      colorTheme: "light",
      locale: "en",
      backgroundColor: "#ffffff",
    });

    const widgetContainer = document.getElementById(
      "tradingview-widget-container"
    );
    widgetContainer?.appendChild(script);

    // return () => {
    //   widgetContainer?.removeChild?.(script);
    // };
  }, []);

  return (
    <div
      id="tradingview-widget-container"
      className="tradingview-widget-container full-size"
    >
      <div className="tradingview-widget-container__widget full-size"></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default TradingViewDashboardWidget;
