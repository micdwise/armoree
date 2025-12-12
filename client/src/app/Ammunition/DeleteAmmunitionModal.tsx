import * as React from "react";
import { ConfirmModal } from "@components/ConfirmModal";
import { Ammunition } from "@app/Ammunition/hooks";

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
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Confirm Deletion"
      confirmLabel="Delete"
      size="sm">
      <p>Are you sure you want to delete the ammunition?</p>
    </ConfirmModal>
  );
};

export { DeleteAmmunitionModal };
