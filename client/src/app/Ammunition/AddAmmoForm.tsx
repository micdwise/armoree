import * as React from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Modal } from "../../components/Modal";
import { Field } from "../../components/Field";
import { AddAmmunition } from "@app/Ammunition/AmmunitionData";

interface AmmoFormState {
  manufacturer: string;
  brand: string;
  caliber: string;
  purchase_date: string;
  lot_number: string;
  qty: string;
}

const initialFormState: AmmoFormState = {
  manufacturer: "",
  brand: "",
  caliber: "",
  purchase_date: "",
  lot_number: "",
  qty: "",
};

interface AddAmmoFormProps {
  onAddSuccess: () => void;
}

const AddAmmoForm: React.FunctionComponent<AddAmmoFormProps> = ({
  onAddSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formState, setFormState] =
    React.useState<AmmoFormState>(initialFormState);

  const handleInputChange = (name: keyof AmmoFormState) => (value: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitAmmo = () => {
    AddAmmunition(formState)
      .then(() => {
        onAddSuccess();
        setFormState(initialFormState);
        setIsModalOpen(false);
      })
      .catch(console.error);
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) setFormState(initialFormState);
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
      <Button variant="primary" onClick={handleModalToggle}>
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
          <Field label="Manufacturer" required id="manufacturer">
            <Input
              required
              type="text"
              id="manufacturer"
              name="manufacturer"
              value={formState.manufacturer}
              onChange={(e) =>
                handleInputChange("manufacturer")(e.target.value)
              }
            />
          </Field>

          <Field label="Brand" required id="brand">
            <Input
              required
              type="text"
              id="brand"
              name="brand"
              value={formState.brand}
              onChange={(e) => handleInputChange("brand")(e.target.value)}
            />
          </Field>

          <Field label="Caliber" required id="caliber">
            <Input
              required
              type="text"
              id="caliber"
              name="caliber"
              value={formState.caliber}
              onChange={(e) => handleInputChange("caliber")(e.target.value)}
            />
          </Field>

          <Field label="Purchase Date" required id="purchase_date">
            <Input
              required
              type="date"
              id="purchase_date"
              name="purchase_date"
              value={formState.purchase_date}
              onChange={(e) =>
                handleInputChange("purchase_date")(e.target.value)
              }
            />
          </Field>

          <Field label="Lot Number" required id="lot_number">
            <Input
              required
              type="text"
              id="lot_number"
              name="lot_number"
              value={formState.lot_number}
              onChange={(e) => handleInputChange("lot_number")(e.target.value)}
            />
          </Field>

          <Field label="Quantity" required id="qty">
            <Input
              required
              type="number"
              id="qty"
              name="qty"
              value={formState.qty}
              onChange={(e) => handleInputChange("qty")(e.target.value)}
            />
          </Field>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export { AddAmmoForm };
