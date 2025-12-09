import * as React from "react";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
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

  const footer = (
    <>
      <Button variant="link" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        Delete
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
      size="sm"
      footer={footer}
    >
      <p>Are you sure you want to delete the ammunition?</p>
    </Modal>
  );
};

export { DeleteAmmunitionModal };
