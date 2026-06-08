import React from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "./ChartsDynamicColor";
import { ApexOptions } from "apexcharts";

type DonutChartProps = {
  title?: string;
  labels: string[];
  series: number[];
  dataColors: string;
};

const DonutChart: React.FC<DonutChartProps> = ({
  title,
  labels,
  series,
  dataColors,
}) => {
  const DonutApexChartColors = getChartColorsArray(dataColors);

  const options: ApexOptions = {
    chart: {
      height: 320,
      type: "donut" as const,
    },
    labels: labels,
    colors: DonutApexChartColors,
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      floating: false,
      fontSize: "14px",
      offsetX: 0,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="donut"
      height="320"
    />
  );
};

export default DonutChart;
