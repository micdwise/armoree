import * as React from "react";
import { ConfirmModal } from "@components/ConfirmModal";
import { Firearm } from "@app/Firearms/hooks";

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
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Confirm Deletion"
      confirmLabel="Delete"
      size="sm"
    >
      <p>
        Are you sure you want to delete the firearm:{" "}
        <strong>
          {firearm.manufacturer} {firearm.model}
        </strong>{" "}
        (S/N: {firearm.serial_number})?
      </p>
    </ConfirmModal>
  );
};

export { DeleteFirearmModal };
