import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

interface Props {
  isOpen: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export const ModalConfirmDelete: React.FC<Props> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => (
  <Modal isOpen={isOpen} toggle={onCancel}>
    <ModalHeader toggle={onCancel}>Confirm Delete</ModalHeader>
    <ModalBody>Are you sure you want to delete the selected stock?</ModalBody>
    <ModalFooter>
      <Button color="danger" onClick={onConfirm}>
        Delete
      </Button>
      <Button color="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
);
