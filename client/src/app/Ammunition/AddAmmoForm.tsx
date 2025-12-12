import * as React from "react";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Select } from "@components/Select";
import { Modal } from "@components/Modal";
import { Field } from "@components/Field";
import { addAmmunition } from "@app/Ammunition/hooks";
import { getManufacturers, Manufacturer, Caliber } from "@app/Firearms/hooks";
import { GetAllCalibers } from "@app/Settings/ReferenceDataFunctions";

interface AmmoFormState {
  manufacturer: string;
  caliber_gauge: string;
  lot_number: string;
  quantity_on_hand: string;
}

interface ValidationState {
  manufacturer: string | boolean;
  caliber_gauge: string | boolean;
  lot_number: string | boolean;
  quantity_on_hand: string | boolean;
}

const initialFormState: AmmoFormState = {
  manufacturer: "",
  caliber_gauge: "",
  lot_number: "",
  quantity_on_hand: "",
};

const initialValidationState: ValidationState = {
  manufacturer: false,
  caliber_gauge: false,
  lot_number: false,
  quantity_on_hand: false,
};

interface AddAmmoFormProps {
  onAddSuccess: () => void;
  isDisabled?: boolean;
}

const AddAmmoForm: React.FunctionComponent<AddAmmoFormProps> = ({
  onAddSuccess,
  isDisabled,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formState, setFormState] =
    React.useState<AmmoFormState>(initialFormState);
  const [validationState, setValidationState] = React.useState<ValidationState>(
    initialValidationState
  );
  const [manufacturers, setManufacturers] = React.useState<Manufacturer[]>([]);
  const [calibers, setCalibers] = React.useState<Caliber[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const m = await getManufacturers();
        setManufacturers(m);
        const c = await GetAllCalibers();
        setCalibers(c);
      } catch (e) {
        console.error("Failed to load reference data", e);
      }
    };
    fetchData();
  }, []);

  const manufacturerOptions = manufacturers.map((m) => ({
    label: m.name,
    value: m.name,
  }));

  const caliberOptions = calibers.map((c) => ({
    label: c.name,
    value: c.name,
  }));

  const handleInputChange = (field: keyof AmmoFormState, value: string) => {
    setFormState((prevState) => {
      const newState = {
        ...prevState,
        [field]: value,
      };

      return newState;
    });
    setValidationState((prevState) => ({
      ...prevState,
      [field]: false,
    }));
  };

  const validate = (): boolean => {
    const updatedState: ValidationState = {
      manufacturer:
        formState.manufacturer === "Select a manufacturer"
          ? "Please select a manufacturer"
          : false,
      caliber_gauge:
        formState.caliber_gauge === "Select a caliber"
          ? "Please select a caliber"
          : false,
      lot_number: formState.lot_number.trim()
        ? false
        : "Please enter a lot number",
      quantity_on_hand: formState.quantity_on_hand
        ? false
        : "Please enter a quantity",
    };

    setValidationState(updatedState);
    return Object.values(updatedState).every((status) => status === false);
  };

  const handleSubmitAmmo = () => {
    if (!validate()) return;
    const payload = {
      ...formState,
      quantity_on_hand: Number(formState.quantity_on_hand),
    };
    addAmmunition(payload)
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
      setFormState(initialFormState);
      setValidationState(initialValidationState);
    }
  };

  const footer = (
    <>
      <Button variant="link" onClick={handleModalToggle}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSubmitAmmo}>
        Add
      </Button>
    </>
  );

  return (
    <React.Fragment>
      <Button
        variant="primary"
        onClick={handleModalToggle}
        disabled={isDisabled}>
        Add Ammunition
      </Button>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        title="Add Ammunition"
        description="Enter information below."
        footer={footer}
        size="md">
        <form id="modal-with-form-form-ammo" className="flex flex-col gap-4">
          <Field
            label="Manufacturer"
            required
            error={validationState.manufacturer}
            id="manufacturer">
            <Select
              value={
                formState.manufacturer === "Select a manufacturer"
                  ? undefined
                  : formState.manufacturer
              }
              onChange={(val) => handleInputChange("manufacturer", val)}
              options={manufacturerOptions}
              placeholder="Select a manufacturer"
              error={!!validationState.manufacturer}
            />
          </Field>

          <Field
            label="Caliber"
            required
            error={validationState.caliber_gauge}
            id="caliber">
            <Select
              value={
                formState.caliber_gauge === "Select a caliber"
                  ? undefined
                  : formState.caliber_gauge
              }
              onChange={(val) => handleInputChange("caliber_gauge", val)}
              options={caliberOptions}
              placeholder="Select a caliber"
              error={!!validationState.caliber_gauge}
            />
          </Field>

          <Field
            label="Lot Number"
            required
            error={validationState.lot_number}
            id="lot_number">
            <Input
              required
              type="text"
              id="lot_number"
              name="lot_number"
              value={formState.lot_number}
              onChange={(e) => handleInputChange("lot_number", e.target.value)}
            />
          </Field>

          <Field
            label="Quantity"
            required
            error={validationState.quantity_on_hand}
            id="qty">
            <Input
              required
              type="number"
              id="qty"
              name="qty"
              value={formState.quantity_on_hand}
              onChange={(e) =>
                handleInputChange("quantity_on_hand", e.target.value)
              }
            />
          </Field>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export { AddAmmoForm };
