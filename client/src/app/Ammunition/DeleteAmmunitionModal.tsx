import * as React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@patternfly/react-core";
import { Ammunition } from "@app/Ammunition/AmmunitionData";

interface DeleteAmmunitionProps {
  ammunition: Ammunition | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAmmunitionModal: React.FunctionComponent<DeleteAmmunitionProps> = ({
  ammunition,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!ammunition) {
    return null;
  }

  return (
    <Modal variant="small" isOpen={isOpen} onClose={onClose}>
      <ModalHeader titleIconVariant="warning" title="ConfirmDeletion" />
      <ModalBody>Are you sure you wnat to delete the ammuniton</ModalBody>
      <ModalFooter>
        <Button
          variant="danger"
          onClick={onConfirm}
          data-testid="confim-delte-ammunition-button"
        >
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { DeleteAmmunitionModal };
