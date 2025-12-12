import * as React from "react";
import { ConfirmModal } from "@components";
import { Personnel } from "./hooks";

interface DeletePersonnelModalProps {
  personnel: Personnel | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeletePersonnelModal({
  personnel,
  isOpen,
  onClose,
  onConfirm,
}: Readonly<DeletePersonnelModalProps>) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Are you sure?"
      description="This action cannot be undone."
      confirmLabel="Delete"
      size="sm">
      <div className="text-sm text-default-font">
        This will permanently delete{" "}
        <span className="font-semibold text-foreground">
          {personnel?.first_name} {personnel?.last_name}
        </span>{" "}
        and remove their data from the system.
      </div>
    </ConfirmModal>
  );
}
