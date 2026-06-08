import { useState } from "react";
import { del } from "../shared/utils/apiClient";
import { DELETE_WATCHLIST_API_URL } from "../shared/utils/constants/apiConstants";

interface UseDeleteWatchlistResult<T> {
  deleteItem: (url: string) => Promise<void>;
  data: T | null;
  error: string | null;
  loading: boolean;
}

function useDeleteWatchlist<T = any>(): UseDeleteWatchlistResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  const deleteItem = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await del(url);
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, data, error, loading };
}

export default useDeleteWatchlist;
