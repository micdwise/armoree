import * as React from "react";
import {
  Button,
  Form,
  FormGroup,
  TextInput,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalVariant,
} from "@patternfly/react-core";
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

  const handleInputChange =
    (name: keyof AmmoFormState) =>
    (_event: React.FormEvent<HTMLInputElement>, value: string) => {
      setFormState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

  const handleSubmitAmmo = () => {
    AddAmmunition(formState)
      .then(() => {
        onAddSuccess(); // This will trigger the refetch
        setFormState(initialFormState); // Reset form
        setIsModalOpen(false);
      })
      .catch(console.error);
  };

  const handleModalToggle = (_event: KeyboardEvent | React.MouseEvent) => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) setFormState(initialFormState);
  };

  return (
    <React.Fragment>
      <Button variant="primary" onClick={handleModalToggle}>
        Add Ammunition
      </Button>
      <Modal
        variant={ModalVariant.small}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <ModalHeader
          title="Add Ammunition"
          description="Enter information below."
        />
        <ModalBody>
          <Form id="modal-with-form-form-ammo">
            <FormGroup
              label="Manufacturer"
              isRequired
              fieldId="modal-with-form-form-manufacturer"
            >
              <TextInput
                isRequired
                type="text"
                id="modal-with-form-form-manufacturer"
                name="manufacturer"
                value={formState.manufacturer}
                onChange={handleInputChange("manufacturer")}
              />
            </FormGroup>

            <FormGroup
              label="Brand"
              isRequired
              fieldId="modal-with-form-form-brand"
            >
              <TextInput
                isRequired
                type="text"
                id="modal-with-form-form-brand"
                name="brand"
                value={formState.brand}
                onChange={handleInputChange("brand")}
              />
            </FormGroup>

            <FormGroup
              label="Caliber"
              isRequired
              fieldId="modal-with-form-form-caliber"
            >
              <TextInput
                isRequired
                type="text"
                id="modal-with-form-form-caliber"
                name="caliber"
                value={formState.caliber}
                onChange={handleInputChange("caliber")}
              />
            </FormGroup>

            <FormGroup
              label="Purchase Date"
              isRequired
              fieldId="modal-with-form-form-purchase-date"
            >
              <TextInput
                isRequired
                type="date"
                id="modal-with-form-form-purchase-date"
                name="purchase_date"
                value={formState.purchase_date}
                onChange={handleInputChange("purchase_date")}
              />
            </FormGroup>

            <FormGroup
              label="Lot Number"
              isRequired
              fieldId="modal-with-form-form-lot-number"
            >
              <TextInput
                isRequired
                type="text"
                id="modal-with-form-form-lot-number"
                name="lot_number"
                value={formState.lot_number}
                onChange={handleInputChange("lot_number")}
              />
            </FormGroup>

            <FormGroup
              label="Quantity"
              isRequired
              fieldId="modal-with-form-form-qty"
            >
              <TextInput
                isRequired
                type="number"
                id="modal-with-form-form-lot-qty"
                name="qty"
                value={formState.qty}
                onChange={handleInputChange("qty")}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button key="create" variant="primary" onClick={handleSubmitAmmo}>
            Add
          </Button>
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export { AddAmmoForm };
