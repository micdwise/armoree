import * as React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "destructive" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "destructive",
  size = "md",
  children,
}: Readonly<ConfirmModalProps>) {
  const footer = (
    <>
      <Button variant="link" onClick={onClose} aria-label={cancelLabel}>
        {cancelLabel}
      </Button>
      <Button variant={confirmVariant} onClick={onConfirm} aria-label={confirmLabel}>
        {confirmLabel}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description={description} footer={footer} size={size}>
      {children}
    </Modal>
  );
}
