import * as React from "react";
import { Modal } from "@components/Modal";
import { Button } from "@components/Button";
import { Personnel } from "./PersonnelData";

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
            title="Are you sure?"
            description="This action cannot be undone."
            footer={footer}
        >
            <div className="text-sm text-default-font">
                This will permanently delete{" "}
                <span className="font-semibold text-foreground">
                    {personnel?.first_name} {personnel?.last_name}
                </span>{" "}
                and remove their data from the system.
            </div>
        </Modal>
    );
}
