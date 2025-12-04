import * as React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@patternfly/react-core";
import { Firearm } from "@app/Firearms/FirearmsData";

interface DeleteFirearmModalProps {
  firearm: Firearm | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteFirearmModal: React.FunctionComponent<DeleteFirearmModalProps> = ({
  firearm,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!firearm) {
    return null;
  }

  return (
    <Modal variant="small" isOpen={isOpen} onClose={onClose}>
      <ModalHeader titleIconVariant="warning" title="Confirm Deletion" />
      <ModalBody>
        Are you sure you want to delete the firearm:{" "}
        <strong>
          {firearm.manufacturer} {firearm.model}
        </strong>{" "}
        (S/N: {firearm.serial_number})?
      </ModalBody>
      <ModalFooter>
        <Button
          variant="danger"
          onClick={onConfirm}
          data-testid="confirm-delete-firearm-button"
        >
          Delete
        </Button>
        <Button
          variant="link"
          onClick={onClose}
          data-testid="cancel-delete-firearm-button"
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { DeleteFirearmModal };
