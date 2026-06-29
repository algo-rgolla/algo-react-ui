import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  Alert,
  Button,
  Form,
  FormGroup,
  HelperText,
  HelperTextItem,
  Modal,
  Stack,
  StackItem,
  TextInput,
} from '@patternfly/react-core'
import type { AlgoPortfolioProduct } from '../../../types/portfolio'
import type { WatchlistUpsertRequest } from '../../../share/api/services/watchlistApi'

type WatchlistFormValues = {
  symbol: string
  exchange: string
  openPrice: string
  openDate: string
  status: string
}

const initialValues: WatchlistFormValues = {
  symbol: '',
  exchange: '',
  openPrice: '',
  openDate: '',
  status: '',
}

const watchlistSchema = Yup.object({
  symbol: Yup.string().trim().max(10, 'Symbol must be 10 characters or fewer.').required('Symbol is required.'),
  exchange: Yup.string().trim().required('Exchange is required.'),
  openPrice: Yup.number()
    .typeError('Open price must be a number.')
    .required('Open price is required.')
    .positive('Open price must be greater than 0.'),
  openDate: Yup.string().required('Open date is required.'),
  status: Yup.string().trim().required('Status is required.'),
})

type WatchlistItemModalProps = {
  isOpen: boolean
  mode: 'add' | 'edit'
  item?: AlgoPortfolioProduct | null
  submitError?: string | null
  onClose: () => void
  onSave: (payload: WatchlistUpsertRequest) => Promise<void>
}

function getInitialValues(item?: AlgoPortfolioProduct | null): WatchlistFormValues {
  if (!item) {
    return initialValues
  }

  return {
    symbol: item.symbol ?? '',
    exchange: item.exchange ?? '',
    openPrice: item.openPrice ?? '',
    openDate: (item.openDate ?? '').slice(0, 10),
    status: item.status ?? '',
  }
}

function mapToRequestPayload(values: WatchlistFormValues): WatchlistUpsertRequest {
  return {
    symbol: values.symbol.trim().toUpperCase(),
    exchange: values.exchange.trim().toUpperCase(),
    openPrice: Number(values.openPrice),
    openDate: values.openDate,
    status: values.status.trim(),
  }
}

export default function WatchlistItemModal({
  isOpen,
  mode,
  item,
  submitError,
  onClose,
  onSave,
}: WatchlistItemModalProps) {
  const title = mode === 'edit' ? 'Edit Watchlist Item' : 'Add Watchlist Item'
  const submitLabel = mode === 'edit' ? 'Save Changes' : 'Create Item'

  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      aria-label="Watchlist item modal"
      variant="small"
    >
      <Formik
        initialValues={getInitialValues(item)}
        enableReinitialize
        validationSchema={watchlistSchema}
        onSubmit={async (values, helpers) => {
          await onSave(mapToRequestPayload(values))

          if (mode === 'add') {
            helpers.resetForm()
          }

          onClose()
        }}
      >
        {({ values, errors, touched, handleBlur, handleSubmit, isSubmitting, setFieldValue, resetForm }) => (
          <Form
            onSubmit={(event) => {
              event.preventDefault()
              void handleSubmit(event)
            }}
          >
            <Stack hasGutter>
              {submitError && (
                <StackItem>
                  <Alert variant="danger" isInline title={submitError} />
                </StackItem>
              )}

              <StackItem>
                <FormGroup label="Symbol" fieldId="watchlist-symbol" isRequired>
                  <TextInput
                    id="watchlist-symbol"
                    name="symbol"
                    type="text"
                    maxLength={10}
                    value={values.symbol}
                    onChange={(_, value) => setFieldValue('symbol', String(value).slice(0, 10))}
                    onBlur={handleBlur}
                    placeholder="AAPL"
                    isRequired
                  />
                  {touched.symbol && errors.symbol && (
                    <HelperText>
                      <HelperTextItem variant="error">{errors.symbol}</HelperTextItem>
                    </HelperText>
                  )}
                </FormGroup>
              </StackItem>

              <StackItem>
                <FormGroup label="Exchange" fieldId="watchlist-exchange" isRequired>
                  <TextInput
                    id="watchlist-exchange"
                    name="exchange"
                    type="text"
                    value={values.exchange}
                    onChange={(_, value) => setFieldValue('exchange', String(value))}
                    onBlur={handleBlur}
                    placeholder="NASDAQ"
                    isRequired
                  />
                  {touched.exchange && errors.exchange && (
                    <HelperText>
                      <HelperTextItem variant="error">{errors.exchange}</HelperTextItem>
                    </HelperText>
                  )}
                </FormGroup>
              </StackItem>

              <StackItem>
                <FormGroup label="Open Price" fieldId="watchlist-open-price" isRequired>
                  <TextInput
                    id="watchlist-open-price"
                    name="openPrice"
                    type="number"
                    min={0.01}
                    value={values.openPrice}
                    onChange={(_, value) => setFieldValue('openPrice', String(value))}
                    onBlur={handleBlur}
                    placeholder="140.00"
                    isRequired
                  />
                  {touched.openPrice && errors.openPrice && (
                    <HelperText>
                      <HelperTextItem variant="error">{errors.openPrice}</HelperTextItem>
                    </HelperText>
                  )}
                </FormGroup>
              </StackItem>

              <StackItem>
                <FormGroup label="Open Date" fieldId="watchlist-open-date" isRequired>
                  <TextInput
                    id="watchlist-open-date"
                    name="openDate"
                    type="date"
                    value={values.openDate}
                    onChange={(_, value) => setFieldValue('openDate', String(value))}
                    onBlur={handleBlur}
                    isRequired
                  />
                  {touched.openDate && errors.openDate && (
                    <HelperText>
                      <HelperTextItem variant="error">{errors.openDate}</HelperTextItem>
                    </HelperText>
                  )}
                </FormGroup>
              </StackItem>

              <StackItem>
                <FormGroup label="Status" fieldId="watchlist-status" isRequired>
                  <TextInput
                    id="watchlist-status"
                    name="status"
                    type="text"
                    value={values.status}
                    onChange={(_, value) => setFieldValue('status', String(value))}
                    onBlur={handleBlur}
                    placeholder="Open"
                    isRequired
                  />
                  {touched.status && errors.status && (
                    <HelperText>
                      <HelperTextItem variant="error">{errors.status}</HelperTextItem>
                    </HelperText>
                  )}
                </FormGroup>
              </StackItem>

              <StackItem>
                <Stack hasGutter>
                  <StackItem>
                    <Button variant="primary" type="submit" isLoading={isSubmitting} isDisabled={isSubmitting}>
                      {submitLabel}
                    </Button>
                  </StackItem>
                  <StackItem>
                    <Button
                      variant="link"
                      type="button"
                      onClick={() => {
                        resetForm()
                        onClose()
                      }}
                    >
                      Cancel
                    </Button>
                  </StackItem>
                </Stack>
              </StackItem>
            </Stack>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}
