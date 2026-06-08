import { useEffect, useState } from "react";
import { algoScanTypes } from "../utils/constants";
import { GET_STOCK_STATISTICS_API_URL } from "../shared/utils/constants/apiConstants";
import apiClient from "../shared/utils/apiClient";

interface ChartData {
  labels: string[];
  values: number[];
}

const usePortfolioStatistics = () => {
  const [chartData, setChartData] = useState<Record<string, ChartData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllScanStats = async () => {
      setLoading(true);
      try {
        const allData: Record<string, ChartData> = {};
        await Promise.all(
          algoScanTypes.map(async (scanType) => {
            const response = await apiClient.get(
              `${GET_STOCK_STATISTICS_API_URL}?ScanName=${scanType}`
            );
            const stats = response.data.statistics;
            const labels = stats.map((s: any) => s.statisticLabel);
            const values = stats.map((s: any) => s.statisticValue);
            allData[scanType] = { labels, values };
          })
        );
        setChartData(allData);
        setError(null);
      } catch (err) {
        console.error("Error loading portfolio statistics:", err);
        setError("Failed to load portfolio statistics.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllScanStats();
  }, []);

  return { chartData, loading, error };
};

export default usePortfolioStatistics;
