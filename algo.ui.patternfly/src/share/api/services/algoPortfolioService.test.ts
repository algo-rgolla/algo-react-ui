import { beforeEach, describe, expect, it, vi } from 'vitest'
import { API_ENDPOINTS } from '../../constants'
import { ApiHttpError } from '../types'
import {
  createAlgoPortfolioItem,
  deleteAlgoPortfolioItem,
  getAlgoPortfolioHistory,
  getAlgoPortfolioItemById,
  getAllAlgoPortfolioItems,
  updateAlgoPortfolioItem,
} from './algoPortfolioApi'

const apiClientMock = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('../axios', () => ({
  default: apiClientMock,
}))

const samplePortfolioItem = {
  id: 15,
  portfolioId: 15,
  symbol: 'MSFT',
  exchange: 'NASDAQ',
  name: 'Microsoft',
  volume: '25',
  openPrice: '310.00',
  openDate: '2026-05-01',
  closeDate: null,
  close: '315.00',
  change: '5.00',
  closePrice: null,
  changePercent: '1.61',
  status: 'Open',
  marketCap: '200',
  industry: 'Software',
  sector: 'Technology',
  profitLoss: '125.00',
  comments: null,
  tradeDays: '20',
  sellReason: null,
  buyReason: null,
  stopLoss: null,
  scanDate: '2026-05-01',
  scanType: 'Momentum',
  atr: '3.5',
  action: 'Buy' as const,
}

const samplePayload = {
  algoPortfolioId: 15,
  symbol: 'MSFT',
  volume: 25,
  action: 'Buy' as const,
  openPrice: 310,
  closePrice: 0,
}

describe('algoPortfolioApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches all portfolio items from the GET endpoint', async () => {
    apiClientMock.get.mockResolvedValueOnce({
      status: 200,
      data: { products: [samplePortfolioItem] },
    })

    await expect(getAllAlgoPortfolioItems()).resolves.toEqual([samplePortfolioItem])
    expect(apiClientMock.get).toHaveBeenCalledWith(API_ENDPOINTS.algoPortfolioBase, { signal: undefined })
  })

  it('fetches a single portfolio item by id', async () => {
    apiClientMock.get.mockResolvedValueOnce({
      status: 200,
      data: samplePortfolioItem,
    })

    await expect(getAlgoPortfolioItemById(15)).resolves.toEqual(samplePortfolioItem)
    expect(apiClientMock.get).toHaveBeenCalledWith(`${API_ENDPOINTS.algoPortfolioBase}/15`, { signal: undefined })
  })

  it('fetches portfolio history with query params', async () => {
    const params = { symbol: 'MSFT', page: 2 }
    apiClientMock.get.mockResolvedValueOnce({
      status: 200,
      data: [samplePortfolioItem],
    })

    await expect(getAlgoPortfolioHistory(params)).resolves.toEqual([samplePortfolioItem])
    expect(apiClientMock.get).toHaveBeenCalledWith(API_ENDPOINTS.algoPortfolioHistory, {
      params,
      signal: undefined,
    })
  })

  it('creates a portfolio item and forces algoPortfolioId to zero', async () => {
    apiClientMock.post.mockResolvedValueOnce({
      status: 201,
      data: samplePortfolioItem,
    })

    await expect(createAlgoPortfolioItem(samplePayload)).resolves.toEqual(samplePortfolioItem)
    expect(apiClientMock.post).toHaveBeenCalledWith(API_ENDPOINTS.algoPortfolioBase, {
      ...samplePayload,
      algoPortfolioId: 0,
    })
  })

  it('updates a portfolio item through the PUT endpoint', async () => {
    apiClientMock.put.mockResolvedValueOnce({
      status: 200,
      data: samplePortfolioItem,
    })

    await expect(updateAlgoPortfolioItem(15, samplePayload)).resolves.toEqual(samplePortfolioItem)
    expect(apiClientMock.put).toHaveBeenCalledWith(`${API_ENDPOINTS.algoPortfolioBase}/15`, samplePayload)
  })

  it('deletes a portfolio item through the DELETE endpoint', async () => {
    const response = { message: 'Deleted successfully.', success: true }
    apiClientMock.delete.mockResolvedValueOnce({
      status: 200,
      data: response,
    })

    await expect(deleteAlgoPortfolioItem(15)).resolves.toEqual(response)
    expect(apiClientMock.delete).toHaveBeenCalledWith(`${API_ENDPOINTS.algoPortfolioBase}/15`)
  })

  it('propagates 400 create errors', async () => {
    const error = new ApiHttpError('Bad request.', 400, { message: 'Bad request.' })
    apiClientMock.post.mockRejectedValueOnce(error)

    await expect(createAlgoPortfolioItem(samplePayload)).rejects.toMatchObject({
      message: 'Bad request.',
      status: 400,
    })
  })

  it('propagates 404 read errors', async () => {
    const error = new ApiHttpError('Resource not found.', 404, { message: 'Resource not found.' })
    apiClientMock.get.mockRejectedValueOnce(error)

    await expect(getAlgoPortfolioItemById(404)).rejects.toMatchObject({
      message: 'Resource not found.',
      status: 404,
    })
  })

  it('propagates 500 update errors from the PUT endpoint', async () => {
    const error = new ApiHttpError('Internal server error.', 500, { message: 'Internal server error.' })
    apiClientMock.put.mockRejectedValueOnce(error)

    await expect(updateAlgoPortfolioItem(15, samplePayload)).rejects.toMatchObject({
      message: 'Internal server error.',
      status: 500,
    })
  })
})