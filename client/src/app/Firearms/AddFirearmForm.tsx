import React, { FormEvent } from 'react';
import {
	Button,
	Form,
	FormGroup,
	Popover,
	TextInput
} from '@patternfly/react-core';
import {
	Modal,
	ModalVariant
} from '@patternfly/react-core/deprecated';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';
import formStyles from '@patternfly/react-styles/css/components/Form/form';

const AddFirearmForm: React.FunctionComponent = () => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [manufacturerValue, setManufacturerValue] = React.useState('');
  const [modelValue, setModelValue] = React.useState('');
  const [caliberValue, setCaliberValue] = React.useState('');
  const [purchaseDateValue, setPurchaseDateValue] = React.useState('');
  const [serialNumberValue, setSerialNumberValue] = React.useState('');

  const handleModalToggle = (_event: KeyboardEvent | React.MouseEvent) => {
    setModalOpen(!isModalOpen);
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
        title="Add Firearm"
        description="Enter information below."
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="create" variant="primary" form="modal-with-form-form" onClick={handleModalToggle}>
            Confirm
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            Cancel
          </Button>
        ]}
      >
        <Form id="modal-with-form-form">
          <FormGroup
            label="Manufacturer"
            isRequired
            fieldId="modal-with-form-form-manufacturer"
          >
            <TextInput
              isRequired
              type="text"
              id="modal-with-form-form-manufacturer"
              name="modal-with-form-form-manufacturer"
              value={manufacturerValue}
              onChange={handleNameInputChange}
            />
          </FormGroup>
          <FormGroup
            label="Model"
            isRequired
            fieldId="modal-with-form-form-model"
          >
            <TextInput
              isRequired
              type="text"
              id="modal-with-form-form-brand"
              name="modal-with-form-form-brand"
              value={modelValue}
              onChange={handleModelInputChange}
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
              name="modal-with-form-form-caliber"
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
              name="modal-with-form-form-purchase-date"
              value={purchaseDateValue}
              onChange={handlePurchaseDateInputChange}
            />
          </FormGroup>
          <FormGroup
            label="Serial Number"
            isRequired
            fieldId="modal-with-form-form-serial-number"
          >
            <TextInput
              isRequired
              type="text"
              id="modal-with-form-form-lot-number"
              name="modal-with-form-form-lot-number"
              value={serialNumberValue}
              onChange={handleSerialNumberInputChange}
            />
          </FormGroup>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export { AddFirearmForm }