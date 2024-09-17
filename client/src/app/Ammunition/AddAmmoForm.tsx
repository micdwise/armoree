import React, { FormEvent } from "react";
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
import { handleSubmitAmmo } from "./AmmunitionData";

const AddAmmoForm: React.FunctionComponent = () => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [manufacturerValue, setManufacturerValue] = React.useState("");
  const [brandValue, setBrandValue] = React.useState("");
  const [caliberValue, setCaliberValue] = React.useState("");
  const [purchaseDateValue, setPurchaseDateValue] = React.useState("");
  const [lotNumberValue, setLotNumberValue] = React.useState("");
  const [qtyValue, setQtyValue] = React.useState("");

  const handleModalToggle = (_event: KeyboardEvent | React.MouseEvent) => {
    setModalOpen(!isModalOpen);
  };

  const handleNameInputChange = (_event: FormEvent, value: string) => {
    setManufacturerValue(value);
  };

  const handleBrandInputChange = (_event: FormEvent, value: string) => {
    setBrandValue(value);
  };
  const handleCaliberInputChange = (_event: FormEvent, value: string) => {
    setCaliberValue(value);
  };
  const handlePurchaseDateInputChange = (_event: FormEvent, value: string) => {
    setPurchaseDateValue(value);
  };
  const handleLotNumberInputChange = (_event: FormEvent, value: string) => {
    setLotNumberValue(value);
  };
  const handleQtyInputChange = (_event: FormEvent, value: string) => {
    setQtyValue(value);
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
          <Form id="modal-with-form-form" onSubmit={handleSubmitAmmo}>
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
                value={manufacturerValue}
                onChange={handleNameInputChange}
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
                value={brandValue}
                onChange={handleBrandInputChange}
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
                value={caliberValue}
                onChange={handleCaliberInputChange}
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
                value={purchaseDateValue}
                onChange={handlePurchaseDateInputChange}
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
                value={lotNumberValue}
                onChange={handleLotNumberInputChange}
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
                value={qtyValue}
                onChange={handleQtyInputChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            key="create"
            variant="primary"
            type="submit"
            form="modal-with-form-form"
          >
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
