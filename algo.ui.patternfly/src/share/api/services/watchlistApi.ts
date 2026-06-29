import apiClient from '../axios';
import { API_ENDPOINTS } from '../../constants';
import type { AlgoPortfolioProduct } from '../../../types/portfolio';
import {
  assertExpectedStatus,
  type ApiDeleteSuccessResponse,
} from '../types';
import { getProductsArray } from '../utils';

export interface WatchlistUpsertRequest {
  symbol: string;
  exchange: string;
  openPrice: number;
  openDate: string;
  status: string;
}

export async function getAllWatchlistItems(
  signal?: AbortSignal,
): Promise<AlgoPortfolioProduct[]> {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.watchlistItemsBase, {
    signal,
  });
  assertExpectedStatus(response.status, [200], 'fetching watchlist items');

  return getProductsArray<AlgoPortfolioProduct>(response.data);
}

export async function getWatchlistItemById(
  id: number,
  signal?: AbortSignal,
): Promise<AlgoPortfolioProduct> {
  const response = await apiClient.get<AlgoPortfolioProduct>(
    `${API_ENDPOINTS.watchlistItemsBase}/${id}`,
    {
      signal,
    },
  );
  assertExpectedStatus(response.status, [200], 'fetching watchlist item');

  return response.data;
}

export async function createWatchlistItem(
  payload: WatchlistUpsertRequest,
): Promise<AlgoPortfolioProduct> {
  const response = await apiClient.post<AlgoPortfolioProduct>(
    API_ENDPOINTS.watchlistItemsBase,
    payload,
  );
  assertExpectedStatus(response.status, [200, 201], 'creating watchlist item');

  return response.data;
}

export async function updateWatchlistItem(
  id: number,
  payload: WatchlistUpsertRequest,
): Promise<AlgoPortfolioProduct> {
  const response = await apiClient.put<AlgoPortfolioProduct>(
    `${API_ENDPOINTS.watchlistItemsBase}/${id}`,
    payload,
  );
  assertExpectedStatus(response.status, [200], 'updating watchlist item');

  return response.data;
}

export async function deleteWatchlistItem(
  id: number,
): Promise<ApiDeleteSuccessResponse> {
  const response = await apiClient.delete<ApiDeleteSuccessResponse>(
    `${API_ENDPOINTS.watchlistItemsBase}/${id}`,
  );
  assertExpectedStatus(response.status, [200], 'deleting watchlist item');

  return response.data;
}
