import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiHttpError } from '../types'
import {
  createWatchlistItem,
  deleteWatchlistItem,
  getAllWatchlistItems,
  getWatchlistItemById,
  updateWatchlistItem,
  type WatchlistUpsertRequest,
} from './watchlistApi'

const apiClientMock = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('../axios', () => ({
  default: apiClientMock,
}))

const sampleWatchlistItem = {
  id: 7,
  portfolioId: 11,
  symbol: 'AAPL',
  exchange: 'NASDAQ',
  name: 'Apple Inc.',
  volume: '10',
  openPrice: '140.00',
  openDate: '2026-06-01',
  closeDate: null,
  close: '145.00',
  change: '5.00',
  closePrice: null,
  changePercent: '3.57',
  status: 'Open',
  marketCap: '100',
  industry: 'Tech',
  sector: 'Technology',
  profitLoss: '50.00',
  comments: null,
  tradeDays: '10',
  sellReason: null,
  buyReason: null,
  stopLoss: null,
  scanDate: '2026-06-01',
  scanType: 'Breakout',
  atr: '2.1',
  action: 'Buy' as const,
}

const samplePayload: WatchlistUpsertRequest = {
  symbol: 'AAPL',
  exchange: 'NASDAQ',
  openPrice: 140,
  openDate: '2026-06-01',
  status: 'Open',
}

describe('watchlistApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches all watchlist items from the GET endpoint', async () => {
    apiClientMock.get.mockResolvedValueOnce({
      status: 200,
      data: [sampleWatchlistItem],
    })

    await expect(getAllWatchlistItems()).resolves.toEqual([sampleWatchlistItem])
    expect(apiClientMock.get).toHaveBeenCalledWith('/api/watchlist-items', { signal: undefined })
  })

  it('fetches a single watchlist item by id', async () => {
    apiClientMock.get.mockResolvedValueOnce({
      status: 200,
      data: sampleWatchlistItem,
    })

    await expect(getWatchlistItemById(7)).resolves.toEqual(sampleWatchlistItem)
    expect(apiClientMock.get).toHaveBeenCalledWith('/api/watchlist-items/7', { signal: undefined })
  })

  it('creates a watchlist item from the POST endpoint', async () => {
    apiClientMock.post.mockResolvedValueOnce({
      status: 201,
      data: sampleWatchlistItem,
    })

    await expect(createWatchlistItem(samplePayload)).resolves.toEqual(sampleWatchlistItem)
    expect(apiClientMock.post).toHaveBeenCalledWith('/api/watchlist-items', samplePayload)
  })

  it('updates a watchlist item through the PUT endpoint', async () => {
    apiClientMock.put.mockResolvedValueOnce({
      status: 200,
      data: sampleWatchlistItem,
    })

    await expect(updateWatchlistItem(7, samplePayload)).resolves.toEqual(sampleWatchlistItem)
    expect(apiClientMock.put).toHaveBeenCalledWith('/api/watchlist-items/7', samplePayload)
  })

  it('deletes a watchlist item through the DELETE endpoint', async () => {
    const response = { message: 'Deleted successfully.', success: true }
    apiClientMock.delete.mockResolvedValueOnce({
      status: 200,
      data: response,
    })

    await expect(deleteWatchlistItem(7)).resolves.toEqual(response)
    expect(apiClientMock.delete).toHaveBeenCalledWith('/api/watchlist-items/7')
  })

  it('propagates 400 create errors', async () => {
    const error = new ApiHttpError('Bad request.', 400, { message: 'Bad request.' })
    apiClientMock.post.mockRejectedValueOnce(error)

    await expect(createWatchlistItem(samplePayload)).rejects.toMatchObject({
      message: 'Bad request.',
      status: 400,
    })
  })

  it('propagates 404 read errors', async () => {
    const error = new ApiHttpError('Resource not found.', 404, { message: 'Resource not found.' })
    apiClientMock.get.mockRejectedValueOnce(error)

    await expect(getWatchlistItemById(999)).rejects.toMatchObject({
      message: 'Resource not found.',
      status: 404,
    })
  })

  it('propagates 500 delete errors', async () => {
    const error = new ApiHttpError('Internal server error.', 500, { message: 'Internal server error.' })
    apiClientMock.delete.mockRejectedValueOnce(error)

    await expect(deleteWatchlistItem(7)).rejects.toMatchObject({
      message: 'Internal server error.',
      status: 500,
    })
  })
})