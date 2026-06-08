import React from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "./ChartsDynamicColor";
import { ApexOptions } from "apexcharts";

type BarChartProps = {
  title?: string;
  series: { data: number[] }[];
  categories: string[];
  dataColors: string;
};

const BarChart: React.FC<BarChartProps> = ({
  title,
  series,
  categories,
  dataColors,
}) => {
  const barChartColors = getChartColorsArray(dataColors);

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        distributed: true, // Ensures each bar gets a unique color
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: barChartColors, // Apply the colors array here
    grid: {
      borderColor: "#f1f1f1",
    },
    xaxis: {
      categories: categories,
    },
    title: {
      text: title,
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
  };

  return (
    <ReactApexChart options={options} series={series} type="bar" height="350" />
  );
};

export default BarChart;
