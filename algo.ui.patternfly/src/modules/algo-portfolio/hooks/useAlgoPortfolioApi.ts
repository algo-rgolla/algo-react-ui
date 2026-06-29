import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import type { AlgoPortfolioProduct, AlgoPortfolioSaveRequest } from '../../../types/portfolio';
import {
  createAlgoPortfolioItem,
  deleteAlgoPortfolioItem,
  getAllAlgoPortfolioItems,
  getAlgoPortfolioHistory,
  getAlgoPortfolioItemById,
  updateAlgoPortfolioItem,
} from '../../../share/api/services/algoPortfolioApi';
import {
  ApiHttpError,
  type ApiDeleteSuccessResponse,
  type HistoryQueryParams,
} from '../../../share/api/types';

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

export function useAlgoPortfolioItems() {
  const [data, setData] = useState<AlgoPortfolioProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const items = await getAllAlgoPortfolioItems(signal);
      setData(items);
    } catch (fetchError) {
      if (!isAbortError(fetchError)) {
        setError(getErrorMessage(fetchError, 'Unable to load portfolio items.'));
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

export function useAlgoPortfolioItem(id?: number | null) {
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
      const item = await getAlgoPortfolioItemById(id, signal);
      setData(item);
    } catch (fetchError) {
      if (!isAbortError(fetchError)) {
        setError(getErrorMessage(fetchError, 'Unable to load portfolio item.'));
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

export function useAlgoPortfolioHistory(filters?: HistoryQueryParams) {
  const [data, setData] = useState<AlgoPortfolioProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const items = await getAlgoPortfolioHistory(filters, signal);
      setData(items);
    } catch (fetchError) {
      if (!isAbortError(fetchError)) {
        setError(getErrorMessage(fetchError, 'Unable to load portfolio history.'));
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const abortController = new AbortController();

    void refetch(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function useCreateAlgoPortfolioItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (payload: AlgoPortfolioSaveRequest) => {
    setLoading(true);
    setError(null);

    try {
      return await createAlgoPortfolioItem(payload);
    } catch (mutationError) {
      const message = getErrorMessage(mutationError, 'Unable to create portfolio item.');
      setError(message);
      throw mutationError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createItem: mutate, loading, error };
}

export function useUpdateAlgoPortfolioItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (id: number, payload: AlgoPortfolioSaveRequest) => {
    setLoading(true);
    setError(null);

    try {
      return await updateAlgoPortfolioItem(id, payload);
    } catch (mutationError) {
      const message = getErrorMessage(mutationError, 'Unable to update portfolio item.');
      setError(message);
      throw mutationError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateItem: mutate, loading, error };
}

export function useDeleteAlgoPortfolioItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (id: number): Promise<ApiDeleteSuccessResponse> => {
    setLoading(true);
    setError(null);

    try {
      return await deleteAlgoPortfolioItem(id);
    } catch (mutationError) {
      const message = getErrorMessage(mutationError, 'Unable to delete portfolio item.');
      setError(message);
      throw mutationError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteItem: mutate, loading, error };
}
