import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import type { AlgoPortfolioProduct } from '../../../types/portfolio';
import {
  createWatchlistItem,
  deleteWatchlistItem,
  getAllWatchlistItems,
  getWatchlistItemById,
  updateWatchlistItem,
  type WatchlistUpsertRequest,
} from '../../../share/api/services/watchlistApi';
import { ApiHttpError, type ApiDeleteSuccessResponse } from '../../../share/api/types';

function isAbortError(error: unknown): boolean {
  return (
    axios.isCancel(error) ||
    (error instanceof DOMException && error.name === 'AbortError') ||
    (typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'ERR_CANCELED')
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiHttpError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useWatchlistItems() {
  const [data, setData] = useState<AlgoPortfolioProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const items = await getAllWatchlistItems(signal);
      setData(items);
    } catch (fetchError) {
      if (!isAbortError(fetchError)) {
        setError(getErrorMessage(fetchError, 'Unable to load watchlist items.'));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    void refetch(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function useWatchlistItem(id?: number | null) {
  const [data, setData] = useState<AlgoPortfolioProduct | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (signal?: AbortSignal) => {
    if (!id) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const item = await getWatchlistItemById(id, signal);
      setData(item);
    } catch (fetchError) {
      if (!isAbortError(fetchError)) {
        setError(getErrorMessage(fetchError, 'Unable to load watchlist item.'));
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const abortController = new AbortController();

    void refetch(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function useCreateWatchlistItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (payload: WatchlistUpsertRequest) => {
    setLoading(true);
    setError(null);

    try {
      return await createWatchlistItem(payload);
    } catch (mutationError) {
      const message = getErrorMessage(mutationError, 'Unable to create watchlist item.');
      setError(message);
      throw mutationError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createItem: mutate, loading, error };
}

export function useUpdateWatchlistItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (id: number, payload: WatchlistUpsertRequest) => {
    setLoading(true);
    setError(null);

    try {
      return await updateWatchlistItem(id, payload);
    } catch (mutationError) {
      const message = getErrorMessage(mutationError, 'Unable to update watchlist item.');
      setError(message);
      throw mutationError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateItem: mutate, loading, error };
}

export function useDeleteWatchlistItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (id: number): Promise<ApiDeleteSuccessResponse> => {
    setLoading(true);
    setError(null);

    try {
      return await deleteWatchlistItem(id);
    } catch (mutationError) {
      const message = getErrorMessage(mutationError, 'Unable to delete watchlist item.');
      setError(message);
      throw mutationError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteItem: mutate, loading, error };
}
