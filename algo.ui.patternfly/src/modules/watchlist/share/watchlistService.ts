import {
  deleteWatchlistItem,
  getAllWatchlistItems,
} from "../../../share/api/services/watchlistApi";
import type { AlgoPortfolioProduct } from "../../../types/portfolio";

export async function getWatchlistProducts(
  signal?: AbortSignal,
): Promise<AlgoPortfolioProduct[]> {
  return getAllWatchlistItems(signal);
}

export async function deleteWatchlistProduct(productId: number): Promise<void> {
  await deleteWatchlistItem(productId);
}
