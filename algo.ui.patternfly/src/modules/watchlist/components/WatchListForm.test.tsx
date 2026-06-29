import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WatchlistPage from '../WatchlistPage'
import WatchlistItemModal from './WatchlistItemModal'

const hooksMock = vi.hoisted(() => ({
  useWatchlistItems: vi.fn(),
  useWatchlistItem: vi.fn(),
  useCreateWatchlistItem: vi.fn(),
  useUpdateWatchlistItem: vi.fn(),
  useDeleteWatchlistItem: vi.fn(),
}))

vi.mock('../hooks', () => hooksMock)

function getInputById(id: string): HTMLInputElement {
  const element = document.getElementById(id)
  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`Expected input with id ${id}`)
  }

  return element
}

function getSubmitButton(): HTMLButtonElement {
  const element = document.querySelector('button[type="submit"]')
  if (!(element instanceof HTMLButtonElement)) {
    throw new Error('Expected submit button')
  }

  return element
}

function createDeferred() {
  let resolve!: () => void
  const promise = new Promise<void>((resolver) => {
    resolve = resolver
  })

  return { promise, resolve }
}

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

function renderWatchlistPage(initialEntry = '/watchlist') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/watchlist/create" element={<WatchlistPage />} />
        <Route path="/watchlist/:id" element={<WatchlistPage />} />
        <Route path="/watchlist/:id/edit" element={<WatchlistPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('WatchlistItemModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validates required fields before submit', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn().mockResolvedValue(undefined)

    render(
      <WatchlistItemModal
        isOpen
        mode="add"
        submitError={null}
        onClose={vi.fn()}
        onSave={onSave}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Create Item' }))

    expect(await screen.findByText('Symbol is required.')).toBeInTheDocument()
    expect(screen.getByText('Exchange is required.')).toBeInTheDocument()
    expect(screen.getByText('Open price is required.')).toBeInTheDocument()
    expect(screen.getByText('Open date is required.')).toBeInTheDocument()
    expect(screen.getByText('Status is required.')).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('submits a normalized payload and closes on success', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn().mockResolvedValue(undefined)
    const onClose = vi.fn()

    render(
      <WatchlistItemModal
        isOpen
        mode="add"
        submitError={null}
        onClose={onClose}
        onSave={onSave}
      />,
    )

    await user.type(getInputById('watchlist-symbol'), 'aapl')
    await user.type(getInputById('watchlist-exchange'), 'nasdaq')
    await user.type(getInputById('watchlist-open-price'), '140.25')
    await user.type(getInputById('watchlist-open-date'), '2026-06-10')
    await user.type(getInputById('watchlist-status'), 'Open')
    await user.click(screen.getByRole('button', { name: 'Create Item' }))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        symbol: 'AAPL',
        exchange: 'NASDAQ',
        openPrice: 140.25,
        openDate: '2026-06-10',
        status: 'Open',
      })
    })
    expect(onClose).toHaveBeenCalled()
  })

  it('renders submit errors from the page', () => {
    render(
      <WatchlistItemModal
        isOpen
        mode="edit"
        item={sampleWatchlistItem}
        submitError="Unable to save watchlist item."
        onClose={vi.fn()}
        onSave={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    expect(screen.getByText('Unable to save watchlist item.')).toBeInTheDocument()
  })

  it('shows a loading state while save is pending', async () => {
    const user = userEvent.setup()
    const deferred = createDeferred()
    const onSave = vi.fn().mockReturnValue(deferred.promise)
    const onClose = vi.fn()

    render(
      <WatchlistItemModal
        isOpen
        mode="add"
        submitError={null}
        onClose={onClose}
        onSave={onSave}
      />,
    )

    await user.type(getInputById('watchlist-symbol'), 'aapl')
    await user.type(getInputById('watchlist-exchange'), 'nasdaq')
    await user.type(getInputById('watchlist-open-price'), '140.25')
    await user.type(getInputById('watchlist-open-date'), '2026-06-10')
    await user.type(getInputById('watchlist-status'), 'Open')
    await user.click(screen.getByRole('button', { name: 'Create Item' }))

    await waitFor(() => {
      expect(getSubmitButton()).toBeDisabled()
    })

    deferred.resolve()

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })
})

describe('WatchlistPage integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    hooksMock.useWatchlistItems.mockReturnValue({
      data: [sampleWatchlistItem],
      loading: false,
      error: null,
      refetch: vi.fn().mockResolvedValue(undefined),
    })
    hooksMock.useWatchlistItem.mockReturnValue({
      data: sampleWatchlistItem,
      loading: false,
      error: null,
    })
    hooksMock.useCreateWatchlistItem.mockReturnValue({
      createItem: vi.fn().mockResolvedValue(sampleWatchlistItem),
      error: null,
    })
    hooksMock.useUpdateWatchlistItem.mockReturnValue({
      updateItem: vi.fn().mockResolvedValue(sampleWatchlistItem),
      error: null,
    })
    hooksMock.useDeleteWatchlistItem.mockReturnValue({
      deleteItem: vi.fn().mockResolvedValue({ message: 'Deleted successfully.', success: true }),
      error: null,
    })
  })

  it('renders loading and error states from the data hook', () => {
    hooksMock.useWatchlistItems.mockReturnValueOnce({
      data: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    })

    renderWatchlistPage()
    expect(screen.getByText('Loading watchlist...')).toBeInTheDocument()
  })

  it('renders fetch errors from the data hook', () => {
    hooksMock.useWatchlistItems.mockReturnValueOnce({
      data: [],
      loading: false,
      error: 'Unable to load watchlist items.',
      refetch: vi.fn(),
    })

    renderWatchlistPage()
    expect(screen.getByText('Unable to load watchlist items.')).toBeInTheDocument()
  })

  it('navigates to the create route and submits a new watchlist item', async () => {
    const user = userEvent.setup()
    const refetch = vi.fn().mockResolvedValue(undefined)
    const createItem = vi.fn().mockResolvedValue(sampleWatchlistItem)

    hooksMock.useWatchlistItems.mockReturnValue({
      data: [sampleWatchlistItem],
      loading: false,
      error: null,
      refetch,
    })
    hooksMock.useCreateWatchlistItem.mockReturnValue({
      createItem,
      error: null,
    })

    renderWatchlistPage('/watchlist')

    await user.click(screen.getByRole('button', { name: 'Add Watchlist Item' }))
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Watchlist item modal' })).toBeInTheDocument()
      expect(getInputById('watchlist-symbol')).toBeInTheDocument()
    })

    await user.type(getInputById('watchlist-symbol'), 'msft')
    await user.type(getInputById('watchlist-exchange'), 'nasdaq')
    await user.type(getInputById('watchlist-open-price'), '410')
    await user.type(getInputById('watchlist-open-date'), '2026-06-11')
    await user.type(getInputById('watchlist-status'), 'Open')
    await user.click(screen.getByRole('button', { name: 'Create Item' }))

    await waitFor(() => {
      expect(createItem).toHaveBeenCalledWith({
        symbol: 'MSFT',
        exchange: 'NASDAQ',
        openPrice: 410,
        openDate: '2026-06-11',
        status: 'Open',
      })
    })
    expect(refetch).toHaveBeenCalled()
    expect(await screen.findByText('Watchlist item MSFT created successfully.')).toBeInTheDocument()
  })

  it('renders detail route content after navigating from the table', async () => {
    const user = userEvent.setup()

    renderWatchlistPage()

    await user.click(screen.getByRole('button', { name: 'View' }))
    expect(await screen.findByText('Watchlist Item #7')).toBeInTheDocument()
    expect(screen.getAllByText('NASDAQ')).toHaveLength(2)
  })

  it('submits updates from the edit route', async () => {
    const user = userEvent.setup()
    const refetch = vi.fn().mockResolvedValue(undefined)
    const updateItem = vi.fn().mockResolvedValue(sampleWatchlistItem)

    hooksMock.useWatchlistItems.mockReturnValue({
      data: [sampleWatchlistItem],
      loading: false,
      error: null,
      refetch,
    })
    hooksMock.useUpdateWatchlistItem.mockReturnValue({
      updateItem,
      error: null,
    })

    renderWatchlistPage('/watchlist/7/edit')

    const statusInput = await waitFor(() => getInputById('watchlist-status'))
    await user.clear(statusInput)
    await user.type(statusInput, 'Closed')
    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    await waitFor(() => {
      expect(updateItem).toHaveBeenCalledWith(7, {
        symbol: 'AAPL',
        exchange: 'NASDAQ',
        openPrice: 140,
        openDate: '2026-06-01',
        status: 'Closed',
      })
    })
    expect(refetch).toHaveBeenCalled()
  })

  it('deletes a watchlist item from the table flow', async () => {
    const user = userEvent.setup()
    const refetch = vi.fn().mockResolvedValue(undefined)
    const deleteItem = vi.fn().mockResolvedValue({ message: 'Deleted successfully.', success: true })
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    hooksMock.useWatchlistItems.mockReturnValue({
      data: [sampleWatchlistItem],
      loading: false,
      error: null,
      refetch,
    })
    hooksMock.useDeleteWatchlistItem.mockReturnValue({
      deleteItem,
      error: null,
    })

    renderWatchlistPage()

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(deleteItem).toHaveBeenCalledWith(7)
    })
    expect(refetch).toHaveBeenCalled()
    expect(await screen.findByText('Deleted successfully.')).toBeInTheDocument()
  })
})