import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  validationSchema,
  initialValues,
} from "@features/algo-portfolio/shared/algoUtils";
import { AddStockFormValues } from "@features/algo-portfolio/shared/algoInterfaces";

interface Props {
  isOpen: boolean;
  toggle: () => void;
  editingStock: any | null;
  onSubmit: (values: AddStockFormValues, helpers: any) => void;
  submitting: boolean;
}

export const AddEditModal: React.FC<Props> = ({
  isOpen,
  toggle,
  editingStock,
  onSubmit,
  submitting,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {editingStock ? "Edit Stock" : "Add Stock"}
      </ModalHeader>
      <Formik
        enableReinitialize
        initialValues={
          editingStock
            ? {
                symbol: editingStock.symbol || "",
                volume: editingStock.volume || 0,
                action: editingStock.action || "Buy",
                openPrice: editingStock.openPrice || 0,
              }
            : initialValues
        }
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalBody>
              <div className="mb-3">
                <label htmlFor="symbol" className="form-label">
                  Symbol
                </label>
                <Field
                  name="symbol"
                  type="text"
                  className="form-control"
                  maxLength={3}
                />
                <ErrorMessage
                  name="symbol"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="volume" className="form-label">
                  Volume
                </label>
                <Field
                  name="volume"
                  type="number"
                  className="form-control"
                  min={1}
                />
                <ErrorMessage
                  name="volume"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="openPrice" className="form-label">
                  Open Price
                </label>
                <Field
                  name="openPrice"
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="e.g. 145.55"
                />
                <ErrorMessage
                  name="openPrice"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="action" className="form-label">
                  Action
                </label>
                <Field as="select" name="action" className="form-control">
                  <option value="Buy">Buy</option>
                  <option value="Sell">Sell</option>
                </Field>
                <ErrorMessage
                  name="action"
                  component="div"
                  className="text-danger"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                color="primary"
                disabled={isSubmitting || submitting}
              >
                {isSubmitting || submitting
                  ? editingStock
                    ? "Updating..."
                    : "Adding..."
                  : editingStock
                  ? "Update Stock"
                  : "Add Stock"}
              </Button>
              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
