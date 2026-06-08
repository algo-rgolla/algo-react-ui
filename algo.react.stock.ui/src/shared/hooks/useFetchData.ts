import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

interface UseFetchResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useFetch<T>(
  url: string,
  dependencies: any[] = []
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<T>(url);
        setData((response as any).data ?? response);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, dependencies);

  return { data, error, loading };
}
