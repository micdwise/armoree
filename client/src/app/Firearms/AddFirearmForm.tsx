import React, { FormEvent } from "react";
import {
  Button,
  Form,
  FormGroup,
  TextInput,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalVariant,
} from "@patternfly/react-core";
import { AddFirearms } from "./FirearmsData";

const AddFirearmForm: React.FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [manufacturerValue, setManufacturerValue] = React.useState("");
  const [modelValue, setModelValue] = React.useState("");
  const [caliberValue, setCaliberValue] = React.useState("");
  const [purchaseDateValue, setPurchaseDateValue] = React.useState("");
  const [serialNumberValue, setSerialNumberValue] = React.useState("");

  const handleSubmitFirearm = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const newFirearm = Object.fromEntries(data.entries());

    AddFirearms(newFirearm);

    setIsModalOpen(!isModalOpen);
  };

  const handleModalToggle = (_event: KeyboardEvent | React.MouseEvent) => {
    setIsModalOpen(!isModalOpen);
  };

  const handleNameInputChange = (_event: FormEvent, value: string) => {
    setManufacturerValue(value);
  };

  const handleModelInputChange = (_event: FormEvent, value: string) => {
    setModelValue(value);
  };
  const handleCaliberInputChange = (_event: FormEvent, value: string) => {
    setCaliberValue(value);
  };
  const handlePurchaseDateInputChange = (_event: FormEvent, value: string) => {
    setPurchaseDateValue(value);
  };
  const handleSerialNumberInputChange = (_event: FormEvent, value: string) => {
    setSerialNumberValue(value);
  };

  return (
    <React.Fragment>
      <Button variant="primary" onClick={handleModalToggle}>
        Add Firearm
      </Button>
      <Modal
        variant={ModalVariant.small}
        isOpen={isModalOpen}
        onClose={handleModalToggle}>
        <ModalHeader
          title="Add Firearm"
          description="Enter information below."
        />
        <ModalBody>
          <Form id="modal-with-form-form" onSubmit={handleSubmitFirearm}>
            <FormGroup
              label="Manufacturer"
              isRequired
              fieldId="modal-with-form-form-manufacturer">
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
              label="Model"
              isRequired
              fieldId="modal-with-form-form-model">
              <TextInput
                isRequired
                type="text"
                id="modal-with-form-form-model"
                name="model"
                value={modelValue}
                onChange={handleModelInputChange}
              />
            </FormGroup>

            <FormGroup
              label="Caliber"
              isRequired
              fieldId="modal-with-form-form-caliber">
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
              fieldId="modal-with-form-form-purchase-date">
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
              label="Serial Number"
              isRequired
              fieldId="modal-with-form-form-serial-number">
              <TextInput
                isRequired
                type="text"
                id="modal-with-form-form-serial-number"
                name="serial_number"
                value={serialNumberValue}
                onChange={handleSerialNumberInputChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            key="create"
            variant="primary"
            type="submit"
            form="modal-with-form-form">
            Confirm
          </Button>
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export { AddFirearmForm };
