import apiClient from '../axios';
import { API_ENDPOINTS } from '../../constants';
import type {
  AlgoPortfolioProduct,
  AlgoPortfolioSaveRequest,
} from '../../../types/portfolio';
import {
  assertExpectedStatus,
  type ApiDeleteSuccessResponse,
  type HistoryQueryParams,
} from '../types';
import { getProductsArray } from '../utils';

export async function getAllAlgoPortfolioItems(
  signal?: AbortSignal,
): Promise<AlgoPortfolioProduct[]> {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.algoPortfolioBase, {
    signal,
  });
  assertExpectedStatus(response.status, [200], 'fetching portfolio items');

  return getProductsArray<AlgoPortfolioProduct>(response.data);
}

export async function getAlgoPortfolioItemById(
  id: number,
  signal?: AbortSignal,
): Promise<AlgoPortfolioProduct> {
  const response = await apiClient.get<AlgoPortfolioProduct>(
    `${API_ENDPOINTS.algoPortfolioBase}/${id}`,
    {
      signal,
    },
  );
  assertExpectedStatus(response.status, [200], 'fetching portfolio item');

  return response.data;
}

export async function getAlgoPortfolioHistory(
  params?: HistoryQueryParams,
  signal?: AbortSignal,
): Promise<AlgoPortfolioProduct[]> {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.algoPortfolioHistory, {
    params,
    signal,
  });
  assertExpectedStatus(response.status, [200], 'fetching portfolio history');

  return getProductsArray<AlgoPortfolioProduct>(response.data);
}

export async function createAlgoPortfolioItem(
  payload: AlgoPortfolioSaveRequest,
): Promise<AlgoPortfolioProduct> {
  const createPayload: AlgoPortfolioSaveRequest = {
    ...payload,
    algoPortfolioId: 0,
  };

  const response = await apiClient.post<AlgoPortfolioProduct>(
    API_ENDPOINTS.algoPortfolioBase,
    createPayload,
  );
  assertExpectedStatus(response.status, [200, 201], 'creating portfolio item');

  return response.data;
}

export async function updateAlgoPortfolioItem(
  id: number,
  payload: AlgoPortfolioSaveRequest,
): Promise<AlgoPortfolioProduct> {
  const response = await apiClient.put<AlgoPortfolioProduct>(
    `${API_ENDPOINTS.algoPortfolioBase}/${id}`,
    payload,
  );
  assertExpectedStatus(response.status, [200], 'updating portfolio item');

  return response.data;
}

export async function deleteAlgoPortfolioItem(
  id: number,
): Promise<ApiDeleteSuccessResponse> {
  const response = await apiClient.delete<ApiDeleteSuccessResponse>(
    `${API_ENDPOINTS.algoPortfolioBase}/${id}`,
  );
  assertExpectedStatus(response.status, [200], 'deleting portfolio item');

  return response.data;
}
