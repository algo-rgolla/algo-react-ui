import apiClient from '../../../share/api/axios'
import type { AlgoPortfolioProduct } from '../../../types/portfolio'

interface GetHoldingsResponse {
  products: AlgoPortfolioProduct[]
}

export async function getHoldings(signal?: AbortSignal): Promise<AlgoPortfolioProduct[]> {
  const response = await apiClient.get<GetHoldingsResponse>('/api/AlgoPortfolio/algo-portfolio-list', {
    signal,
  })

  return response.data.products ?? []
}

export async function createHolding(_: AlgoPortfolioProduct): Promise<AlgoPortfolioProduct> {
  throw new Error('createHolding is not implemented.')
}

export async function updateHolding(_: AlgoPortfolioProduct): Promise<AlgoPortfolioProduct> {
  throw new Error('updateHolding is not implemented.')
}

export async function deleteHolding(_: number): Promise<void> {
  throw new Error('deleteHolding is not implemented.')
}
