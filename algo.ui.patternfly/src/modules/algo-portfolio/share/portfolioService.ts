import apiClient from "../../../share/api/axios";
import { API_ENDPOINTS } from "../../../share/constants";
import type {
  AlgoPortfolioProduct,
  AlgoPortfolioSaveRequest,
} from "../../../types/portfolio";

interface GetHoldingsResponse {
  products: AlgoPortfolioProduct[];
}

export async function getHoldings(
  signal?: AbortSignal,
): Promise<AlgoPortfolioProduct[]> {
  const response = await apiClient.get<GetHoldingsResponse>(
    API_ENDPOINTS.algoPortfolioBase,
    {
      signal,
    },
  );

  return response.data.products ?? [];
}

export async function saveHolding(
  payload: AlgoPortfolioSaveRequest,
): Promise<void> {
  try {
    if (payload.algoPortfolioId > 0) {
      await apiClient.put(
        `${API_ENDPOINTS.algoPortfolioBase}/${payload.algoPortfolioId}`,
        payload,
      );
      return;
    }

    await apiClient.post(API_ENDPOINTS.algoPortfolioBase, payload);
  } catch (error) {
    console.error("saveHolding error:", {
      message: error instanceof Error ? error.message : String(error),
      status:
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { status: number; data: unknown } }).response
              ?.status
          : undefined,
      data:
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { status: number; data: unknown } }).response
              ?.data
          : undefined,
      payload,
    });
    throw error;
  }
}

export async function deleteHolding(id: number): Promise<void> {
  await apiClient.delete(`${API_ENDPOINTS.algoPortfolioBase}/${id}`);
}
