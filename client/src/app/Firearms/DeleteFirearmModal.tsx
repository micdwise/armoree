import * as React from "react";
import { Button } from "@components/Button";
import { Modal } from "@components/Modal";
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
      <p>
        Are you sure you want to delete the firearm:{" "}
        <strong>
          {firearm.manufacturer} {firearm.model}
        </strong>{" "}
        (S/N: {firearm.serial_number})?
      </p>
    </Modal>
  );
};

export { DeleteFirearmModal };
