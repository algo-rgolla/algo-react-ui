import { Formik } from 'formik'
import * as Yup from 'yup'
import {
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
import type { AlgoPortfolioCreateRequest } from '../../../types/portfolio'
import './AddHoldingModal.css'

type HoldingFormValues = {
  symbol: string
  volume: string
  openPrice: string
}

const initialFormValues: HoldingFormValues = {
  symbol: '',
  volume: '',
  openPrice: '',
}

const holdingSchema = Yup.object({
  symbol: Yup.string().trim().max(5, 'Symbol must be 5 characters or fewer.').required('Symbol is required.'),
  volume: Yup.number()
    .typeError('Volume must be a number.')
    .required('Volume is required.')
    .positive('Volume must be greater than 0.'),
  openPrice: Yup.number()
    .typeError('Open price must be a number.')
    .required('Open price is required.')
    .positive('Open price must be greater than 0.'),
})

type AddHoldingModalProps = {
  isOpen: boolean
  onClose: () => void
  onSaveHolding: (holding: AlgoPortfolioCreateRequest) => void
}

function computeHoldingFromForm(form: HoldingFormValues): AlgoPortfolioCreateRequest {
  return {
    symbol: form.symbol.trim().toUpperCase(),
    volume: Number(form.volume),
    action: 'Buy',
    openPrice: Number(form.openPrice),
  }
}

export default function AddHoldingModal({ isOpen, onClose, onSaveHolding }: AddHoldingModalProps) {
  return (
    <Modal
      className="add-holding-modal"
      title="Add Holding"
      isOpen={isOpen}
      onClose={onClose}
      aria-label="Holding modal"
      variant="small"
    >
      <Formik
        initialValues={initialFormValues}
        validationSchema={holdingSchema}
        onSubmit={(values, helpers) => {
          onSaveHolding(computeHoldingFromForm(values))
          helpers.resetForm()
          onClose()
        }}
      >
        {({ values, errors, touched, handleBlur, handleSubmit, setFieldValue, resetForm }) => {
          const symbolHasError = Boolean(touched.symbol && errors.symbol)
          const volumeHasError = Boolean(touched.volume && errors.volume)
          const openPriceHasError = Boolean(touched.openPrice && errors.openPrice)

          return (
            <Form
              onSubmit={(event) => {
                event.preventDefault()
                void handleSubmit(event)
              }}
            >
              <Stack hasGutter>
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

                <StackItem>
                  <Stack hasGutter>
                    <StackItem>
                      <Button variant="primary" type="submit">
                        Add Holding
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
