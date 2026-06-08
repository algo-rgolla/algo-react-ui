import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ModalConfirmEdit: React.FC<Props> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => (
  <Modal isOpen={isOpen} toggle={onCancel}>
    <ModalHeader toggle={onCancel}>Confirm Edit</ModalHeader>
    <ModalBody>Are you sure you want to edit the selected stock?</ModalBody>
    <ModalFooter>
      <Button color="primary" onClick={onConfirm}>
        Yes
      </Button>
      <Button color="secondary" onClick={onCancel}>
        No
      </Button>
    </ModalFooter>
  </Modal>
);
