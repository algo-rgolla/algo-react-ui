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
import type { StockHolding } from '../../../types/portfolio'

type HoldingFormValues = {
  ticker: string
  companyName: string
  sharesOwned: string
  averageCostBasis: string
  currentPrice: string
}

const initialFormValues: HoldingFormValues = {
  ticker: '',
  companyName: '',
  sharesOwned: '',
  averageCostBasis: '',
  currentPrice: '',
}

const holdingSchema = Yup.object({
  ticker: Yup.string().trim().required('Ticker is required.'),
  companyName: Yup.string().trim().required('Company is required.'),
  sharesOwned: Yup.number()
    .typeError('Shares must be a number.')
    .required('Shares is required.')
    .positive('Shares must be greater than 0.'),
  averageCostBasis: Yup.number()
    .typeError('Avg Cost must be a number.')
    .required('Avg Cost is required.')
    .positive('Avg Cost must be greater than 0.'),
  currentPrice: Yup.number()
    .typeError('Current Price must be a number.')
    .required('Current Price is required.')
    .positive('Current Price must be greater than 0.'),
})

type AddHoldingModalProps = {
  isOpen: boolean
  onClose: () => void
  onAddHolding: (holding: StockHolding) => void
}

function computeHoldingFromForm(form: HoldingFormValues): StockHolding {
  const sharesOwned = Number(form.sharesOwned)
  const averageCostBasis = Number(form.averageCostBasis)
  const currentPrice = Number(form.currentPrice)
  const totalValue = Number((sharesOwned * currentPrice).toFixed(2))
  const totalGainLoss = Number(((currentPrice - averageCostBasis) * sharesOwned).toFixed(2))
  const totalGainLossPercentage = Number(
    (((currentPrice - averageCostBasis) / averageCostBasis) * 100).toFixed(1),
  )

  return {
    ticker: form.ticker.trim().toUpperCase(),
    companyName: form.companyName.trim(),
    sharesOwned,
    averageCostBasis,
    currentPrice,
    totalValue,
    totalGainLoss,
    totalGainLossPercentage,
  }
}

export default function AddHoldingModal({ isOpen, onClose, onAddHolding }: AddHoldingModalProps) {
  return (
    <Modal title="Add Holding" isOpen={isOpen} onClose={onClose} aria-label="Add holding modal" variant="small">
      <Formik
        initialValues={initialFormValues}
        validationSchema={holdingSchema}
        onSubmit={(values, helpers) => {
          onAddHolding(computeHoldingFromForm(values))
          helpers.resetForm()
          onClose()
        }}
      >
        {({ values, errors, touched, handleBlur, handleSubmit, setFieldValue, resetForm }) => {
          const tickerHasError = Boolean(touched.ticker && errors.ticker)
          const companyHasError = Boolean(touched.companyName && errors.companyName)
          const sharesHasError = Boolean(touched.sharesOwned && errors.sharesOwned)
          const avgCostHasError = Boolean(touched.averageCostBasis && errors.averageCostBasis)
          const priceHasError = Boolean(touched.currentPrice && errors.currentPrice)

          return (
            <Form
              onSubmit={(event) => {
                event.preventDefault()
                void handleSubmit(event)
              }}
            >
              <Stack hasGutter>
                <StackItem>
                  <FormGroup label="Ticker" fieldId="portfolio-ticker" isRequired>
                    <TextInput
                      id="portfolio-ticker"
                      name="ticker"
                      type="text"
                      value={values.ticker}
                      onChange={(_, value) => setFieldValue('ticker', String(value))}
                      onBlur={handleBlur}
                      placeholder="AAPL"
                      isRequired
                    />
                    {tickerHasError && (
                      <HelperText>
                        <HelperTextItem variant="error">{errors.ticker}</HelperTextItem>
                      </HelperText>
                    )}
                  </FormGroup>
                </StackItem>

                <StackItem>
                  <FormGroup label="Company" fieldId="portfolio-company" isRequired>
                    <TextInput
                      id="portfolio-company"
                      name="companyName"
                      type="text"
                      value={values.companyName}
                      onChange={(_, value) => setFieldValue('companyName', String(value))}
                      onBlur={handleBlur}
                      placeholder="Apple Inc."
                      isRequired
                    />
                    {companyHasError && (
                      <HelperText>
                        <HelperTextItem variant="error">{errors.companyName}</HelperTextItem>
                      </HelperText>
                    )}
                  </FormGroup>
                </StackItem>

                <StackItem>
                  <FormGroup label="Shares" fieldId="portfolio-shares" isRequired>
                    <TextInput
                      id="portfolio-shares"
                      name="sharesOwned"
                      type="number"
                      min={1}
                      value={values.sharesOwned}
                      onChange={(_, value) => setFieldValue('sharesOwned', String(value))}
                      onBlur={handleBlur}
                      placeholder="10"
                      isRequired
                    />
                    {sharesHasError && (
                      <HelperText>
                        <HelperTextItem variant="error">{errors.sharesOwned}</HelperTextItem>
                      </HelperText>
                    )}
                  </FormGroup>
                </StackItem>

                <StackItem>
                  <FormGroup label="Avg Cost" fieldId="portfolio-avg-cost" isRequired>
                    <TextInput
                      id="portfolio-avg-cost"
                      name="averageCostBasis"
                      type="number"
                      min={1}
                      value={values.averageCostBasis}
                      onChange={(_, value) => setFieldValue('averageCostBasis', String(value))}
                      onBlur={handleBlur}
                      placeholder="125.00"
                      isRequired
                    />
                    {avgCostHasError && (
                      <HelperText>
                        <HelperTextItem variant="error">{errors.averageCostBasis}</HelperTextItem>
                      </HelperText>
                    )}
                  </FormGroup>
                </StackItem>

                <StackItem>
                  <FormGroup label="Current Price" fieldId="portfolio-current-price" isRequired>
                    <TextInput
                      id="portfolio-current-price"
                      name="currentPrice"
                      type="number"
                      min={1}
                      value={values.currentPrice}
                      onChange={(_, value) => setFieldValue('currentPrice', String(value))}
                      onBlur={handleBlur}
                      placeholder="140.00"
                      isRequired
                    />
                    {priceHasError && (
                      <HelperText>
                        <HelperTextItem variant="error">{errors.currentPrice}</HelperTextItem>
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