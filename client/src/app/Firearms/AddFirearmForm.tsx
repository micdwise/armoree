import * as React from "react";
import {
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalVariant,
  Label,
} from "@patternfly/react-core";
import { AddFirearms } from "@app/Firearms/FirearmsData";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

interface FirearmFormState {
  manufacturer: string;
  model: string;
  caliber: string;
  purchase_date: string;
  serial_number: string;
}

interface ValidationState {
  manufacturer: "success" | "warning" | "error" | "default";
  model: "success" | "warning" | "error" | "default";
  caliber: "success" | "warning" | "error" | "default";
  purchase_date: "success" | "warning" | "error" | "default";
  serial_number: "success" | "warning" | "error" | "default";
}

const initialFormState: FirearmFormState = {
  manufacturer: "Select a manufacturer",
  model: "",
  caliber: "Select a caliber",
  purchase_date: "",
  serial_number: "",
};

const initialValidationState: ValidationState = {
  manufacturer: "default",
  model: "default",
  caliber: "default",
  purchase_date: "default",
  serial_number: "default",
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
  const [validationState, setValidationState] =
    React.useState<ValidationState>(initialValidationState);

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
        setValidationState((prevState) => ({
          ...prevState,
          [name]: "default",
        }));
      };

  const validate = (): boolean => {
    const updatedState: ValidationState = {
      manufacturer:
        formState.manufacturer === "Select a manufacturer"
          ? "error"
          : "default",
      model: !formState.model.trim() ? "error" : "default",
      caliber:
        formState.caliber === "Select a caliber" ? "error" : "default",
      purchase_date: !formState.purchase_date ? "error" : "default",
      serial_number: !formState.serial_number.trim() ? "error" : "default",
    };

    setValidationState(updatedState);
    return Object.values(updatedState).every((status) => status !== "error");
  };

  const handleSubmitFirearm = () => {
    if (!validate()) return;
    AddFirearms(formState)
      .then(() => {
        onAddSuccess(); // This triggers the refetch in the parent
        setFormState(initialFormState); // Reset form
        setIsModalOpen(false);
        setValidationState(initialValidationState);
      })
      .catch(console.error);
  };

  const handleModalToggle = (_event: KeyboardEvent | React.MouseEvent) => {
    setIsModalOpen(!isModalOpen);
    // Reset form state if the modal is closed without submitting
    if (isModalOpen) {
      setFormState(initialFormState);
      setValidationState(initialValidationState);
    }
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
                validated={validationState.manufacturer}
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
              {validationState.manufacturer === "error" && (
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                      Please select a manufacturer
                    </HelperTextItem>
                  </HelperText>
                </FormHelperText>
              )}
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
                validated={validationState.model}
              />
              {validationState.model === "error" && (
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                      Please enter a model
                    </HelperTextItem>
                  </HelperText>
                </FormHelperText>
              )}
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
                validated={validationState.caliber}
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
              {validationState.caliber === "error" && (
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                      Please select a caliber
                    </HelperTextItem>
                  </HelperText>
                </FormHelperText>
              )}
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
                validated={validationState.purchase_date}
              />
              {validationState.purchase_date === "error" && (
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                      Please enter a purchase date
                    </HelperTextItem>
                  </HelperText>
                </FormHelperText>
              )}
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
                validated={validationState.serial_number}
              />
              {validationState.serial_number === "error" && (
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                      Please enter a serial number
                    </HelperTextItem>
                  </HelperText>
                </FormHelperText>
              )}
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
