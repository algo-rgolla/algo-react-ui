import React from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "./ChartsDynamicColor";
import { ApexOptions } from "apexcharts";

type PieChartProps = {
  title?: string;
  labels: string[];
  series: number[];
  dataColors: string;
};

const PieChart: React.FC<PieChartProps> = ({
  title,
  labels,
  series,
  dataColors,
}) => {
  const PieApexChartColors = getChartColorsArray(dataColors);

  const options: ApexOptions = {
    chart: {
      height: 320,
      type: "pie" as const,
    },
    labels: labels,
    colors: PieApexChartColors,
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
    <ReactApexChart options={options} series={series} type="pie" height="320" />
  );
};

export default PieChart;
