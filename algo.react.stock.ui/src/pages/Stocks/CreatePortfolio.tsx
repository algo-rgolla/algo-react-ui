import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import { post } from "../../shared/utils/apiClient";
import { CREATE_PORTFOLIO_API_URL } from "../../shared/utils/constants/apiConstants";

const CreatePortfolio: React.FC = () => {
  const initialValues = {
    symbol: "",
    action: "",
    openPrice: "",
    volume: "",
  };

  const validationSchema = Yup.object({
    symbol: Yup.string()
      .required("Symbol is required")
      .max(10, "Symbol must be 10 characters or less"),
    action: Yup.string()
      .required("Action is required")
      .oneOf(["Buy", "Sell"], "Action must be either 'Buy' or 'Sell'"),
    openPrice: Yup.number()
      .nullable()
      .positive("Open Price must be a positive number"),
    volume: Yup.number()
      .required("Volume is required")
      .positive("Volume must be a positive number")
      .integer("Volume must be an integer"),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: any
  ) => {
    try {
      const data = await post(CREATE_PORTFOLIO_API_URL, values);
      console.log("Portfolio created successfully:", data);
      alert("Portfolio created successfully!");
      resetForm();
    } catch (error) {
      console.error("Error creating portfolio:", error);
      alert("Failed to create portfolio. Please try again.");
    }
  };

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col xl={6}>
          <Card>
            <CardBody>
              <h4 className="mb-4">Create Portfolio</h4>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="symbol" className="form-label">
                        Symbol
                      </label>
                      <Field
                        type="text"
                        id="symbol"
                        name="symbol"
                        className="form-control"
                        placeholder="Enter stock symbol"
                      />
                      <ErrorMessage
                        name="symbol"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="action" className="form-label">
                        Action
                      </label>
                      <Field
                        as="select"
                        id="action"
                        name="action"
                        className="form-control"
                      >
                        <option value="">Select Action</option>
                        <option value="Buy">Buy</option>
                        <option value="Sell">Sell</option>
                      </Field>
                      <ErrorMessage
                        name="action"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="openPrice" className="form-label">
                        Open Price
                      </label>
                      <Field
                        type="number"
                        id="openPrice"
                        name="openPrice"
                        className="form-control"
                        placeholder="Enter open price"
                      />
                      <ErrorMessage
                        name="openPrice"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="volume" className="form-label">
                        Volume
                      </label>
                      <Field
                        type="number"
                        id="volume"
                        name="volume"
                        className="form-control"
                        placeholder="Enter volume"
                      />
                      <ErrorMessage
                        name="volume"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Create Portfolio"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreatePortfolio;
