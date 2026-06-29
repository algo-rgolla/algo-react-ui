import {
  createAlgoPortfolioItem,
  deleteAlgoPortfolioItem,
  getAllAlgoPortfolioItems,
  updateAlgoPortfolioItem,
} from "../../../share/api/services/algoPortfolioApi";
import type {
  AlgoPortfolioProduct,
  AlgoPortfolioSaveRequest,
} from "../../../types/portfolio";

export async function getHoldings(
  signal?: AbortSignal,
): Promise<AlgoPortfolioProduct[]> {
  return getAllAlgoPortfolioItems(signal);
}

export async function saveHolding(
  payload: AlgoPortfolioSaveRequest,
): Promise<void> {
  if (payload.algoPortfolioId > 0) {
    await updateAlgoPortfolioItem(payload.algoPortfolioId, payload);
    return;
  }

  await createAlgoPortfolioItem(payload);
}

export async function deleteHolding(id: number): Promise<void> {
  await deleteAlgoPortfolioItem(id);
}
