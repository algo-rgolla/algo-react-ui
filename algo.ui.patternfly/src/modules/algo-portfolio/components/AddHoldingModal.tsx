import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  Alert,
  Button,
  Form,
  FormSelect,
  FormSelectOption,
  FormGroup,
  HelperText,
  HelperTextItem,
  Modal,
  Stack,
  StackItem,
  TextInput,
} from '@patternfly/react-core'
import type { AlgoPortfolioProduct, AlgoPortfolioSaveRequest } from '../../../types/portfolio'
import './AddHoldingModal.css'

type HoldingFormValues = {
  algoPortfolioId: number
  symbol: string
  volume: string
  action: 'Buy' | 'Sell'
  openPrice: string
  closePrice: string
}

const initialFormValues: HoldingFormValues = {
  algoPortfolioId: 0,
  symbol: '',
  volume: '',
  action: 'Buy',
  openPrice: '',
  closePrice: '',
}

const holdingSchema = Yup.object({
  algoPortfolioId: Yup.number().required(),
  symbol: Yup.string().trim().max(5, 'Symbol must be 5 characters or fewer.').required('Symbol is required.'),
  volume: Yup.number()
    .typeError('Volume must be a number.')
    .required('Volume is required.')
    .positive('Volume must be greater than 0.'),
  action: Yup.mixed<'Buy' | 'Sell'>().oneOf(['Buy', 'Sell']).required('Action is required.'),
  openPrice: Yup.number().when('action', {
    is: 'Buy',
    then: (schema) =>
      schema
        .transform((value, originalValue) => (originalValue === '' ? NaN : value))
        .typeError('Open price must be a number.')
        .required('Open price is required when action is Buy.')
        .positive('Open price must be greater than 0.'),
    otherwise: (schema) => schema.transform(() => undefined).notRequired(),
  }),
  closePrice: Yup.number().when('action', {
    is: 'Sell',
    then: (schema) =>
      schema
        .transform((value, originalValue) => (originalValue === '' ? NaN : value))
        .typeError('Close price must be a number.')
        .required('Close price is required when action is Sell.')
        .positive('Close price must be greater than 0.'),
    otherwise: (schema) => schema.transform(() => undefined).notRequired(),
  }),
})

type AddHoldingModalProps = {
  isOpen: boolean
  mode: 'add' | 'edit'
  holding?: AlgoPortfolioProduct | null
  submitError?: string | null
  onClose: () => void
  onSaveHolding: (holding: AlgoPortfolioSaveRequest) => Promise<void>
}

function getInitialValues(holding?: AlgoPortfolioProduct | null): HoldingFormValues {
  if (!holding) {
    return initialFormValues
  }

  return {
    algoPortfolioId: holding.id > 0 ? holding.id : holding.portfolioId,
    symbol: holding.symbol,
    volume: holding.volume,
    action: holding.action === 'Sell' ? 'Sell' : 'Buy',
    openPrice: holding.openPrice,
    closePrice: holding.closePrice ?? '',
  }
}

function computeHoldingFromForm(form: HoldingFormValues): AlgoPortfolioSaveRequest {
  return {
    algoPortfolioId: form.algoPortfolioId,
    symbol: form.symbol.trim().toUpperCase(),
    volume: Number(form.volume),
    action: form.action,
    openPrice: form.action === 'Buy' ? Number(form.openPrice) : 0,
    closePrice: form.action === 'Sell' ? Number(form.closePrice) : 0,
  }
}

export default function AddHoldingModal({ isOpen, mode, holding, submitError, onClose, onSaveHolding }: AddHoldingModalProps) {
  const title = mode === 'edit' ? 'Edit Holding' : 'Add Holding'
  const submitLabel = mode === 'edit' ? 'Save Changes' : 'Add Holding'

  return (
    <Modal
      className="add-holding-modal"
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      aria-label="Holding modal"
      variant="small"
    >
      <Formik
        initialValues={getInitialValues(holding)}
        enableReinitialize
        validationSchema={holdingSchema}
        onSubmit={async (values, helpers) => {
          await onSaveHolding(computeHoldingFromForm(values))
          if (mode === 'add') {
            helpers.resetForm()
          }
          onClose()
        }}
      >
        {({ values, errors, touched, handleBlur, handleSubmit, isSubmitting, setFieldValue, resetForm }) => {
          const symbolHasError = Boolean(touched.symbol && errors.symbol)
          const volumeHasError = Boolean(touched.volume && errors.volume)
          const actionHasError = Boolean(touched.action && errors.action)
          const openPriceHasError = Boolean(touched.openPrice && errors.openPrice)
          const closePriceHasError = Boolean(touched.closePrice && errors.closePrice)

          return (
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
                  <FormGroup label="Symbol" fieldId="portfolio-symbol" isRequired>
                    <TextInput
                      id="portfolio-symbol"
                      name="symbol"
                      type="text"
                      maxLength={5}
                      value={values.symbol}
                      onChange={(_, value) => setFieldValue('symbol', String(value).slice(0, 5))}
                      onBlur={handleBlur}
                      placeholder="AAPL"
                      isRequired
                    />
                    {symbolHasError && (
                      <HelperText>
                        <HelperTextItem variant="error">{errors.symbol}</HelperTextItem>
                      </HelperText>
                    )}
                  </FormGroup>
                </StackItem>

                <StackItem>
                  <FormGroup label="Volume" fieldId="portfolio-volume" isRequired>
                    <TextInput
                      id="portfolio-volume"
                      name="volume"
                      type="number"
                      min={1}
                      value={values.volume}
                      onChange={(_, value) => setFieldValue('volume', String(value))}
                      onBlur={handleBlur}
                      placeholder="10"
                      isRequired
                    />
                    {volumeHasError && (
                      <HelperText>
                        <HelperTextItem variant="error">{errors.volume}</HelperTextItem>
                      </HelperText>
                    )}
                  </FormGroup>
                </StackItem>

                <StackItem>
                  <FormGroup label="Action" fieldId="portfolio-action" isRequired>
                    <FormSelect
                      id="portfolio-action"
                      name="action"
                      value={values.action}
                      onChange={(_, value) => {
                        const selectedAction = String(value) === 'Sell' ? 'Sell' : 'Buy'
                        setFieldValue('action', selectedAction)
                        if (selectedAction === 'Buy') {
                          setFieldValue('closePrice', '')
                        }
                      }}
                      onBlur={handleBlur}
                    >
                      <FormSelectOption value="Buy" label="Buy" />
                      <FormSelectOption value="Sell" label="Sell" />
                    </FormSelect>
                    {actionHasError && (
                      <HelperText>
                        <HelperTextItem variant="error">{errors.action}</HelperTextItem>
                      </HelperText>
                    )}
                  </FormGroup>
                </StackItem>

                {values.action === 'Buy' && (
                  <StackItem>
                    <FormGroup label="Open Price" fieldId="portfolio-open-price" isRequired>
                      <TextInput
                        id="portfolio-open-price"
                        name="openPrice"
                        type="number"
                        min={1}
                        value={values.openPrice}
                        onChange={(_, value) => setFieldValue('openPrice', String(value))}
                        onBlur={handleBlur}
                        placeholder="140.00"
                        isRequired
                      />
                      {openPriceHasError && (
                        <HelperText>
                          <HelperTextItem variant="error">{errors.openPrice}</HelperTextItem>
                        </HelperText>
                      )}
                    </FormGroup>
                  </StackItem>
                )}

                {values.action === 'Sell' && (
                  <StackItem>
                    <FormGroup label="Close Price" fieldId="portfolio-close-price" isRequired>
                      <TextInput
                        id="portfolio-close-price"
                        name="closePrice"
                        type="number"
                        min={1}
                        value={values.closePrice}
                        onChange={(_, value) => setFieldValue('closePrice', String(value))}
                        onBlur={handleBlur}
                        placeholder="150.00"
                        isRequired
                      />
                      {closePriceHasError && (
                        <HelperText>
                          <HelperTextItem variant="error">{errors.closePrice}</HelperTextItem>
                        </HelperText>
                      )}
                    </FormGroup>
                  </StackItem>
                )}

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
          )
        }}
      </Formik>
    </Modal>
  )
}
