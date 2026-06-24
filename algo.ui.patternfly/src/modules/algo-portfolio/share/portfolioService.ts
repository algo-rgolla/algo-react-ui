import apiClient from '../../../share/api/axios'
import type { AlgoPortfolioCreateRequest, AlgoPortfolioProduct } from '../../../types/portfolio'

interface GetHoldingsResponse {
  products: AlgoPortfolioProduct[]
}

export async function getHoldings(signal?: AbortSignal): Promise<AlgoPortfolioProduct[]> {
  const response = await apiClient.get<GetHoldingsResponse>('/api/AlgoPortfolio/algo-portfolio-list', {
    signal,
  })

  return response.data.products ?? []
}

export async function createHolding(payload: AlgoPortfolioCreateRequest): Promise<void> {
  try {
    await apiClient.post('/api/AlgoPortfolio/add-edit-algo-portfolio', payload)
  } catch (error) {
    console.error('createHolding error:', {
      message: error instanceof Error ? error.message : String(error),
      status: error && typeof error === 'object' && 'response' in error ? (error as { response?: { status: number; data: unknown } }).response?.status : undefined,
      data: error && typeof error === 'object' && 'response' in error ? (error as { response?: { status: number; data: unknown } }).response?.data : undefined,
      payload,
    })
    throw error
  }
}

export async function updateHolding(_: AlgoPortfolioProduct): Promise<AlgoPortfolioProduct> {
  throw new Error('updateHolding is not implemented.')
}

export async function deleteHolding(_: number): Promise<void> {
  throw new Error('deleteHolding is not implemented.')
}
