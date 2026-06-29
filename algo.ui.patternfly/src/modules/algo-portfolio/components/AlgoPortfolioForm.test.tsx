import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AlgoPortfolioPage from '../AlgoPortfolioPage'
import AddHoldingModal from './AddHoldingModal'

const hooksMock = vi.hoisted(() => ({
  useAlgoPortfolioItems: vi.fn(),
  useAlgoPortfolioItem: vi.fn(),
  useAlgoPortfolioHistory: vi.fn(),
  useCreateAlgoPortfolioItem: vi.fn(),
  useUpdateAlgoPortfolioItem: vi.fn(),
  useDeleteAlgoPortfolioItem: vi.fn(),
}))

vi.mock('../hooks', () => hooksMock)

function getInputById(id: string): HTMLInputElement {
  const element = document.getElementById(id)
  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`Expected input with id ${id}`)
  }

  return element
}

function getSelectById(id: string): HTMLSelectElement {
  const element = document.getElementById(id)
  if (!(element instanceof HTMLSelectElement)) {
    throw new Error(`Expected select with id ${id}`)
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

const sampleHolding = {
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

function renderPortfolioPage(initialEntry = '/portfolio') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/portfolio" element={<AlgoPortfolioPage />} />
        <Route path="/portfolio/create" element={<AlgoPortfolioPage />} />
        <Route path="/portfolio/:id" element={<AlgoPortfolioPage />} />
        <Route path="/portfolio/:id/edit" element={<AlgoPortfolioPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('AddHoldingModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validates required fields before submit', async () => {
    const user = userEvent.setup()

    render(
      <AddHoldingModal
        isOpen
        mode="add"
        submitError={null}
        onClose={vi.fn()}
        onSaveHolding={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Add Holding' }))

    expect(await screen.findByText('Symbol is required.')).toBeInTheDocument()
    expect(screen.getByText('Volume is required.')).toBeInTheDocument()
    expect(screen.getByText('Open price is required when action is Buy.')).toBeInTheDocument()
  })

  it('switches between open price and close price based on action', async () => {
    const user = userEvent.setup()

    render(
      <AddHoldingModal
        isOpen
        mode="add"
        submitError={null}
        onClose={vi.fn()}
        onSaveHolding={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    expect(getInputById('portfolio-open-price')).toBeInTheDocument()
    expect(document.getElementById('portfolio-close-price')).not.toBeInTheDocument()

    await user.selectOptions(getSelectById('portfolio-action'), 'Sell')

    expect(document.getElementById('portfolio-open-price')).not.toBeInTheDocument()
    expect(getInputById('portfolio-close-price')).toBeInTheDocument()
  })

  it('submits sell payloads with closePrice and zeroed openPrice', async () => {
    const user = userEvent.setup()
    const onSaveHolding = vi.fn().mockResolvedValue(undefined)
    const onClose = vi.fn()

    render(
      <AddHoldingModal
        isOpen
        mode="add"
        submitError={null}
        onClose={onClose}
        onSaveHolding={onSaveHolding}
      />,
    )

    await user.type(getInputById('portfolio-symbol'), 'msft')
    await user.type(getInputById('portfolio-volume'), '25')
    await user.selectOptions(getSelectById('portfolio-action'), 'Sell')
    await user.type(getInputById('portfolio-close-price'), '325.5')
    await user.click(screen.getByRole('button', { name: 'Add Holding' }))

    await waitFor(() => {
      expect(onSaveHolding).toHaveBeenCalledWith({
        algoPortfolioId: 0,
        symbol: 'MSFT',
        volume: 25,
        action: 'Sell',
        openPrice: 0,
        closePrice: 325.5,
      })
    })
    expect(onClose).toHaveBeenCalled()
  })

  it('renders submit errors from the page', () => {
    render(
      <AddHoldingModal
        isOpen
        mode="edit"
        holding={sampleHolding}
        submitError="Unable to update holding."
        onClose={vi.fn()}
        onSaveHolding={vi.fn().mockResolvedValue(undefined)}
      />,
    )

    expect(screen.getByText('Unable to update holding.')).toBeInTheDocument()
  })

  it('shows a loading state while save is pending', async () => {
    const user = userEvent.setup()
    const deferred = createDeferred()
    const onClose = vi.fn()

    render(
      <AddHoldingModal
        isOpen
        mode="add"
        submitError={null}
        onClose={onClose}
        onSaveHolding={vi.fn().mockReturnValue(deferred.promise)}
      />,
    )

    await user.type(getInputById('portfolio-symbol'), 'msft')
    await user.type(getInputById('portfolio-volume'), '25')
    await user.type(getInputById('portfolio-open-price'), '310')
    await user.click(screen.getByRole('button', { name: 'Add Holding' }))

    await waitFor(() => {
      expect(getSubmitButton()).toBeDisabled()
    })

    deferred.resolve()

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })
})

describe('AlgoPortfolioPage integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    hooksMock.useAlgoPortfolioItems.mockReturnValue({
      data: [sampleHolding],
      loading: false,
      error: null,
      refetch: vi.fn().mockResolvedValue(undefined),
    })
    hooksMock.useAlgoPortfolioItem.mockReturnValue({
      data: sampleHolding,
      loading: false,
      error: null,
    })
    hooksMock.useCreateAlgoPortfolioItem.mockReturnValue({
      createItem: vi.fn().mockResolvedValue(sampleHolding),
      error: null,
    })
    hooksMock.useUpdateAlgoPortfolioItem.mockReturnValue({
      updateItem: vi.fn().mockResolvedValue(sampleHolding),
      error: null,
    })
  })

  it('renders loading and error states from the data hook', () => {
    hooksMock.useAlgoPortfolioItems.mockReturnValueOnce({
      data: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    })

    renderPortfolioPage()
    expect(screen.getByText('Loading portfolio holdings...')).toBeInTheDocument()
  })

  it('renders fetch errors from the data hook', () => {
    hooksMock.useAlgoPortfolioItems.mockReturnValueOnce({
      data: [],
      loading: false,
      error: 'Unable to load portfolio items.',
      refetch: vi.fn(),
    })

    renderPortfolioPage()
    expect(screen.getByText('Unable to load portfolio items.')).toBeInTheDocument()
  })

  it('navigates to the create route and submits a new holding', async () => {
    const user = userEvent.setup()
    const refetch = vi.fn().mockResolvedValue(undefined)
    const createItem = vi.fn().mockResolvedValue(sampleHolding)

    hooksMock.useAlgoPortfolioItems.mockReturnValue({
      data: [sampleHolding],
      loading: false,
      error: null,
      refetch,
    })
    hooksMock.useCreateAlgoPortfolioItem.mockReturnValue({
      createItem,
      error: null,
    })

    renderPortfolioPage()

    await user.click(screen.getByRole('button', { name: 'Add Holding' }))
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Holding modal' })).toBeInTheDocument()
      expect(getInputById('portfolio-symbol')).toBeInTheDocument()
    })

    await user.type(getInputById('portfolio-symbol'), 'nvda')
    await user.type(getInputById('portfolio-volume'), '12')
    await user.type(getInputById('portfolio-open-price'), '500')
    await user.click(screen.getByRole('button', { name: 'Add Holding' }))

    await waitFor(() => {
      expect(createItem).toHaveBeenCalledWith({
        algoPortfolioId: 0,
        symbol: 'NVDA',
        volume: 12,
        action: 'Buy',
        openPrice: 500,
        closePrice: 0,
      })
    })
    expect(refetch).toHaveBeenCalled()
    expect(await screen.findByText('Holding NVDA created successfully.')).toBeInTheDocument()
  })

  it('renders detail route content after navigating from the table', async () => {
    const user = userEvent.setup()

    renderPortfolioPage()

    await user.click(screen.getByRole('button', { name: 'View' }))
    expect(await screen.findByText('Portfolio Item #15')).toBeInTheDocument()
    expect(screen.getAllByText('25').length).toBeGreaterThan(0)
  })

  it('submits updates from the edit route', async () => {
    const user = userEvent.setup()
    const refetch = vi.fn().mockResolvedValue(undefined)
    const updateItem = vi.fn().mockResolvedValue(sampleHolding)

    hooksMock.useAlgoPortfolioItems.mockReturnValue({
      data: [sampleHolding],
      loading: false,
      error: null,
      refetch,
    })
    hooksMock.useUpdateAlgoPortfolioItem.mockReturnValue({
      updateItem,
      error: null,
    })

    renderPortfolioPage('/portfolio/15/edit')

    const volumeInput = await waitFor(() => getInputById('portfolio-volume'))
    await user.clear(volumeInput)
    await user.type(volumeInput, '30')
    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    await waitFor(() => {
      expect(updateItem).toHaveBeenCalledWith(15, {
        algoPortfolioId: 15,
        symbol: 'MSFT',
        volume: 30,
        action: 'Buy',
        openPrice: 310,
        closePrice: 0,
      })
    })
    expect(refetch).toHaveBeenCalled()
  })
})