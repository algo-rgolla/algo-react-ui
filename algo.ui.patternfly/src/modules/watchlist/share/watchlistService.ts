import apiClient from "../../../share/api/axios";
import { API_ENDPOINTS } from "../../../share/constants";
import type { AlgoPortfolioProduct } from "../../../types/portfolio";

interface GetWatchlistResponse {
  products: AlgoPortfolioProduct[];
}

export async function getWatchlistProducts(
  signal?: AbortSignal,
): Promise<AlgoPortfolioProduct[]> {
  const response = await apiClient.get<GetWatchlistResponse>(
    API_ENDPOINTS.watchlistItemsBase,
    {
      signal,
    },
  );

  return response.data.products ?? [];
}

export async function deleteWatchlistProduct(productId: number): Promise<void> {
  await apiClient.delete(`${API_ENDPOINTS.watchlistItemsBase}/${productId}`);
}
