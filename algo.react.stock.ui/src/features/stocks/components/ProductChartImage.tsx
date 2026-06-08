import React from "react";

interface ProductChartImageProps {
    symbol: string;
    exchange: string;
}

export const ProductChartImage: React.FC<ProductChartImageProps> = ({
  symbol,
  exchange = "ASX",
}) => (
  <img
    src={`https://chart.eoddata.com/?e=${exchange}&s=${symbol}&w=900&h=600&bs=candle&ma=21-63&mat=EMA-EMA&i=MACD&t=360`}
    width="700"
    height="450"
    alt={`Chart for ${symbol}`}
  />
);

/*
https://chart.eoddata.com/?e=ASX&s=BHP&bs=candle&w=1000&h=600&n=365&ma=21-63&mat=EMA-EMA&i=MACD&t=off
https://chart.eoddata.com/?e=ASX&s=BHP&bs=candle&w=1000&h=600&i=MACD&ma=21-63&mat=EMA-EMA&t=365
*/