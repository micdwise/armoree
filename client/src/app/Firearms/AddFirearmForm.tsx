import * as React from "react";
import {
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalVariant,
  Label,
} from "@patternfly/react-core";
import { AddFirearms } from "@app/Firearms/FirearmsData";

interface FirearmFormState {
  manufacturer: string;
  model: string;
  caliber: string;
  purchase_date: string;
  serial_number: string;
}

const initialFormState: FirearmFormState = {
  manufacturer: "Select a manufacturer",
  model: "",
  caliber: "Select a caliber",
  purchase_date: "",
  serial_number: "",
};

const manufactureOptions = [
  {
    value: "Select a manufacturer",
    label: "Select a manufacturer",
    disabled: true,
  },
  { value: "Smith & Wesson", label: "Smith & Wesson", disabled: false },
  { value: "Colt", label: "Colt", disabled: false },
];

const caliberOptions = [
  { value: "Select a caliber", label: "Select a caliber", disabled: true },
  { value: "9MM", label: "9MM", disabled: false },
  { value: "5.56", label: "5.56", disabled: false },
];

interface AddFirearmFormProps {
  onAddSuccess: () => void;
}

const AddFirearmForm: React.FunctionComponent<AddFirearmFormProps> = ({
  onAddSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formState, setFormState] =
    React.useState<FirearmFormState>(initialFormState);

  // A specific handler for each field is more robust with PatternFly's onChange signatures
  const handleInputChange =
    (name: keyof FirearmFormState) =>
    (
      _event: React.FormEvent<HTMLInputElement | HTMLSelectElement>,
      value: string,
    ) => {
      setFormState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

  const handleSubmitFirearm = () => {
    AddFirearms(formState)
      .then(() => {
        onAddSuccess(); // This triggers the refetch in the parent
        setFormState(initialFormState); // Reset form
        setIsModalOpen(false);
      })
      .catch(console.error);
  };

  const handleModalToggle = (_event: KeyboardEvent | React.MouseEvent) => {
    setIsModalOpen(!isModalOpen);
    // Reset form state if the modal is closed without submitting
    if (isModalOpen) setFormState(initialFormState);
  };

  return (
    <React.Fragment>
      <Button variant="primary" onClick={handleModalToggle}>
        Add Firearm
      </Button>
      <Modal
        variant={ModalVariant.small}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <ModalHeader
          title="Add Firearm"
          description="Enter information below."
        />
        <ModalBody>
          <Form id="modal-with-form-form">
            <FormGroup
              label="Manufacturer"
              isRequired
              fieldId="modal-with-form-form-manufacturer"
            >
              <FormSelect
                isRequired
                id="modal-with-form-form-manufacturer"
                name="manufacturer"
                value={formState.manufacturer}
                onChange={handleInputChange("manufacturer")}
              >
                {manufactureOptions.map((option) => (
                  <FormSelectOption
                    isDisabled={option.disabled}
                    key={option.value}
                    value={option.value}
                    label={option.label}
                  />
                ))}
              </FormSelect>
            </FormGroup>

            <FormGroup
              label="Model"
              isRequired
              fieldId="modal-with-form-form-model"
            >
              <TextInput
                isRequired
                type="text"
                id="modal-with-form-form-model"
                name="model"
                value={formState.model}
                onChange={handleInputChange("model")}
              />
            </FormGroup>

            <FormGroup
              label="Caliber"
              isRequired
              fieldId="modal-with-form-form-caliber"
            >
              <FormSelect
                isRequired
                id="modal-with-form-form-caliber"
                name="caliber"
                value={formState.caliber}
                onChange={handleInputChange("caliber")}
              >
                {caliberOptions.map((option) => (
                  <FormSelectOption
                    isDisabled={option.disabled}
                    key={option.value}
                    value={option.value}
                    label={option.label}
                  />
                ))}
              </FormSelect>
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
              label="Serial Number"
              isRequired
              fieldId="modal-with-form-form-serial-number"
            >
              <TextInput
                isRequired
                type="text"
                id="modal-with-form-form-serial-number"
                name="serial_number"
                value={formState.serial_number}
                onChange={handleInputChange("serial_number")}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button key="create" variant="primary" onClick={handleSubmitFirearm}>
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
