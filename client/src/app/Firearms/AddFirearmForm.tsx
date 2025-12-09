import * as React from "react";
import { Button } from "../../components/Button";
import { NewButton } from "../../components/NewButton";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Modal } from "../../components/Modal";
import { Field } from "../../components/Field";
import { AddFirearms } from "@app/Firearms/FirearmsData";
import AllFirearmsManufacturer from "@data/firearms-manufacturers.json";

interface FirearmFormState {
  manufacturer: string;
  model: string;
  caliber: string;
  purchase_date: string;
  serial_number: string;
}

interface ValidationState {
  manufacturer: string | boolean;
  model: string | boolean;
  caliber: string | boolean;
  purchase_date: string | boolean;
  serial_number: string | boolean;
}

const initialFormState: FirearmFormState = {
  manufacturer: "Select a manufacturer",
  model: "",
  caliber: "Select a caliber",
  purchase_date: "",
  serial_number: "",
};

const initialValidationState: ValidationState = {
  manufacturer: false,
  model: false,
  caliber: false,
  purchase_date: false,
  serial_number: false,
};

interface AddFirearmFormProps {
  onAddSuccess: () => void;
}

const AddFirearmForm: React.FunctionComponent<AddFirearmFormProps> = ({
  onAddSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formState, setFormState] =
    React.useState<FirearmFormState>(initialFormState);
  const [validationState, setValidationState] = React.useState<ValidationState>(
    initialValidationState,
  );

  const handleInputChange = (field: keyof FirearmFormState) => {
    setFormState((prevState) => {
      const newState = {
        ...prevState,
        [name]: event.target.value,
      };

      if (name === "manufacturer") {
        newState.model = "";
      }

      return newState;
    });
    setValidationState((prevState) => ({
      ...prevState,
      [field]: false, // Clear error on change
    }));
  };

  const validate = (): boolean => {
    const updatedState: ValidationState = {
      manufacturer:
        formState.manufacturer === "Select a manufacturer"
          ? "Please select a manufacturer"
          : false,
      model: !formState.model.trim() ? "Please enter a model" : false,
      caliber:
        formState.caliber === "Select a caliber"
          ? "Please select a caliber"
          : false,
      purchase_date: !formState.purchase_date
        ? "Please enter a purchase date"
        : false,
      serial_number: !formState.serial_number.trim()
        ? "Please enter a serial number"
        : false,
    };

    setValidationState(updatedState);
    return Object.values(updatedState).every((status) => status === false);
  };

  const handleSubmitFirearm = () => {
    if (!validate()) return;
    AddFirearms(formState)
      .then(() => {
        onAddSuccess();
        setFormState(initialFormState);
        setIsModalOpen(false);
        setValidationState(initialValidationState);
      })
      .catch(console.error);
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      // Opening
      setFormState(initialFormState);
      setValidationState(initialValidationState);
    }
  };

  const footer = (
    <>
      <Button variant="link" onClick={handleModalToggle}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSubmitFirearm}>
        Confirm
      </Button>
    </>
  );

  return (
    <React.Fragment>
      <NewButton variant="primary" onClick={handleModalToggle}>
        Add Firearm
      </NewButton>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        title="Add Firearm"
        description="Enter information below."
        footer={footer}
        size="md"
      >
        <form id="modal-with-form-form" className="flex flex-col gap-4">
          <Field
            label="Manufacturer"
            required
            error={validationState.manufacturer}
            id="manufacturer"
          >
            <Select
              value={
                formState.manufacturer === "Select a manufacturer"
                  ? undefined
                  : formState.manufacturer
              }
              onChange={(val) => handleInputChange("manufacturer", val)}
              options={manufactureOptions}
              placeholder="Select a manufacturer"
              error={!!validationState.manufacturer}
            />
          </Field>

          <Field
            label="Model"
            required
            error={validationState.model}
            id="model"
          >
            <Input
              type="text"
              id="model"
              name="model"
              value={formState.model}
              onChange={(e) => handleInputChange("model", e.target.value)}
              error={!!validationState.model}
              required
            />
          </Field>

          <Field
            label="Caliber"
            required
            error={validationState.caliber}
            id="caliber"
          >
            <Select
              value={
                formState.caliber === "Select a caliber"
                  ? undefined
                  : formState.caliber
              }
              onChange={(val) => handleInputChange("caliber", val)}
              options={caliberOptions}
              placeholder="Select a caliber"
              error={!!validationState.caliber}
            />
          </Field>

          <Field
            label="Purchase Date"
            required
            error={validationState.purchase_date}
            id="purchase_date"
          >
            <Input
              type="date"
              id="purchase_date"
              name="purchase_date"
              value={formState.purchase_date}
              onChange={(e) =>
                handleInputChange("purchase_date", e.target.value)
              }
              error={!!validationState.purchase_date}
              required
            />
          </Field>

          <Field
            label="Serial Number"
            required
            error={validationState.serial_number}
            id="serial_number"
          >
            <Input
              type="text"
              id="serial_number"
              name="serial_number"
              value={formState.serial_number}
              onChange={(e) =>
                handleInputChange("serial_number", e.target.value)
              }
              error={!!validationState.serial_number}
              required
            />
          </Field>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export { AddFirearmForm };
