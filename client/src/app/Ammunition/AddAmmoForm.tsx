import * as React from "react";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Select } from "@components/Select";
import { Modal } from "@components/Modal";
import { Field } from "@components/Field";
import { AddAmmunition } from "@app/Ammunition/AmmunitionData";
import allFirearmsManufacturer from "@data/firearms-manufacturers.json";
import allCalibers from "@data/calibers.json";
import ammunitionBrands from "@data/ammunition-brands.json";

interface AmmoFormState {
  manufacturer: string;
  brand: string;
  caliber: string;
  purchase_date: string;
  lot_number: string;
  qty: string;
}

interface ValidationState {
  manufacturer: string | boolean;
  brand: string | boolean;
  caliber: string | boolean;
  purchase_date: string | boolean;
  lot_number: string | boolean;
  qty: string | boolean;
}

const initialFormState: AmmoFormState = {
  manufacturer: "",
  brand: "",
  caliber: "",
  purchase_date: "",
  lot_number: "",
  qty: "",
};

const initialValidationState: ValidationState = {
  manufacturer: false,
  brand: false,
  caliber: false,
  purchase_date: false,
  lot_number: false,
  qty: false,
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
    initialValidationState,
  );

  const manufacturerOptions = allFirearmsManufacturer.map((m) => ({
    label: m.name,
    value: m.name,
  }));

  const caliberOptions = allCalibers.map((c) => ({
    label: c.name,
    value: c.name,
  }));

  const handleInputChange = (field: keyof AmmoFormState, value: string) => {
    setFormState((prevState) => {
      const newState = {
        ...prevState,
        [field]: value,
      };

      if (field === "manufacturer") {
        newState.brand = "";
      }

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
      brand:
        !formState.brand || formState.brand === "Select a model"
          ? "Please select a model"
          : false,
      caliber:
        formState.caliber === "Select a caliber"
          ? "Please select a caliber"
          : false,
      purchase_date: !formState.purchase_date
        ? "Please enter a purchase date"
        : false,
      lot_number: !formState.lot_number.trim()
        ? "Please enter a serial number"
        : false,
      qty: !formState.qty ? "Please enter a quantity" : false,
    };

    setValidationState(updatedState);
    return Object.values(updatedState).every((status) => status === false);
  };

  const handleSubmitAmmo = () => {
    AddAmmunition(formState)
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

  const filteredBrandOptions = ammunitionBrands
    .filter((brand) => brand.manufacturer === formState.manufacturer)
    .map((brand) => ({ label: brand.name, value: brand.name }));

  return (
    <React.Fragment>
      <Button
        variant="primary"
        onClick={handleModalToggle}
        disabled={isDisabled}
      >
        Add Ammunition
      </Button>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        title="Add Ammunition"
        description="Enter information below."
        footer={footer}
        size="md"
      >
        <form id="modal-with-form-form-ammo" className="flex flex-col gap-4">
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
              options={manufacturerOptions}
              placeholder="Select a manufacturer"
              error={!!validationState.manufacturer}
            />
          </Field>

          <Field
            label="Brand"
            required
            id="brand"
            error={validationState.brand}
          >
            <Select
              value={
                !formState.brand || formState.brand === "Select a model"
                  ? undefined
                  : formState.brand
              }
              onChange={(val) => handleInputChange("brand", val)}
              options={filteredBrandOptions}
              placeholder="Select a brand"
              error={!!validationState.brand}
              disabled={formState.brand === "Select a manufacturer"}
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
            label="Lot Number"
            required
            error={validationState.lot_number}
            id="lot_number"
          >
            <Input
              required
              type="text"
              id="lot_number"
              name="lot_number"
              value={formState.lot_number}
              onChange={(e) => handleInputChange("lot_number", e.target.value)}
            />
          </Field>

          <Field label="Quantity" required error={validationState.qty} id="qty">
            <Input
              required
              type="number"
              id="qty"
              name="qty"
              value={formState.qty}
              onChange={(e) => handleInputChange("qty", e.target.value)}
            />
          </Field>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export { AddAmmoForm };
