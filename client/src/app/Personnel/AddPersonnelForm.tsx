import * as React from "react";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Modal } from "@components/Modal";
import { Field } from "@components/Field";
import { Plus } from "lucide-react";
import { AddPersonnel } from "./PersonnelData";

interface AddPersonnelFormProps {
    onAddSuccess: () => void;
    isDisabled?: boolean;
}

interface FormState {
    first_name: string;
    last_name: string;
    badge_number: string;
    status: string;
}

const initialFormState: FormState = {
    first_name: "",
    last_name: "",
    badge_number: "",
    status: "Active",
};

export function AddPersonnelForm({
    onAddSuccess,
    isDisabled,
}: Readonly<AddPersonnelFormProps>) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [formState, setFormState] = React.useState<FormState>(initialFormState);
    const [error, setError] = React.useState<string | null>(null);

    const handleInputChange = (field: keyof FormState, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const validate = () => {
        if (!formState.first_name) return "First name is required";
        if (!formState.last_name) return "Last name is required";
        if (!formState.badge_number) return "Badge number is required";
        return null;
    };

    const handleSubmit = async () => {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        try {
            await AddPersonnel(formState);
            setFormState(initialFormState);
            setIsModalOpen(false);
            onAddSuccess();
        } catch (err) {
            console.error("Failed to add personnel:", err);
            setError("Failed to save personnel. Please try again.");
        }
    };

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
        if (!isModalOpen) {
            setFormState(initialFormState);
            setError(null);
        }
    };

    const footer = (
        <>
            <Button variant="link" onClick={handleModalToggle}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
                Save Personnel
            </Button>
        </>
    );

    return (
        <>
            <Button disabled={isDisabled} onClick={handleModalToggle} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Personnel
            </Button>
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalToggle}
                title="Add Personnel"
                description="Enter personnel information below."
                footer={footer}
            >
                <form className="flex flex-col gap-4">
                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <Field label="First Name" required id="first_name">
                        <Input
                            value={formState.first_name}
                            onChange={(e) => handleInputChange("first_name", e.target.value)}
                            placeholder="John"
                        />
                    </Field>

                    <Field label="Last Name" required id="last_name">
                        <Input
                            value={formState.last_name}
                            onChange={(e) => handleInputChange("last_name", e.target.value)}
                            placeholder="Doe"
                        />
                    </Field>

                    <Field label="Badge Number" required id="badge_number">
                        <Input
                            value={formState.badge_number}
                            onChange={(e) => handleInputChange("badge_number", e.target.value)}
                            placeholder="123456"
                        />
                    </Field>

                    <Field label="Status" required id="status">
                        <Input
                            value={formState.status}
                            onChange={(e) => handleInputChange("status", e.target.value)}
                            placeholder="Active"
                        />
                    </Field>
                </form>
            </Modal>
        </>
    );
}
