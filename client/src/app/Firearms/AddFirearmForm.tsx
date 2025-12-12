import * as React from "react";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Select } from "@components/Select";
import { Modal } from "@components/Modal";
import { Field } from "@components/Field";
import {
  addFirearm,
  getManufacturers,
  getModels,
  getCalibers,
  Manufacturer,
  Model,
  Caliber,
} from "@app/Firearms/hooks";
import { Plus } from "lucide-react";

interface FirearmFormState {
  manufacturer: string;
  model: string;
  type: string;
  caliber_gauge: string;
  acquisition_date: string;
  serial_number: string;
  asset_tag: string;
  current_status: string;
}

interface ValidationState {
  manufacturer: string | boolean;
  model: string | boolean;
  type: string | boolean;
  caliber_gauge: string | boolean;
  acquisition_date: string | boolean;
  serial_number: string | boolean;
  asset_tag: string | boolean;
  current_status: string | boolean;
}

const initialFormState: FirearmFormState = {
  manufacturer: "Select a manufacturer",
  model: "",
  type: "Select a type",
  caliber_gauge: "Select a caliber",
  acquisition_date: "",
  serial_number: "",
  asset_tag: "",
  current_status: "Select a status",
};

const initialValidationState: ValidationState = {
  manufacturer: false,
  model: false,
  type: false,
  caliber_gauge: false,
  acquisition_date: false,
  serial_number: false,
  asset_tag: false,
  current_status: false,
};

interface AddFirearmFormProps {
  onAddSuccess: () => void;
  isDisabled?: boolean;
}

const AddFirearmForm: React.FunctionComponent<AddFirearmFormProps> = ({
  onAddSuccess,
  isDisabled,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formState, setFormState] =
    React.useState<FirearmFormState>(initialFormState);
  const [validationState, setValidationState] = React.useState<ValidationState>(
    initialValidationState,
  );

  // Dynamic Options State
  const [manufacturers, setManufacturers] = React.useState<Manufacturer[]>([]);
  const [models, setModels] = React.useState<Model[]>([]);
  const [calibers, setCalibers] = React.useState<Caliber[]>([]);

  // Fetch Manufacturers on Load
  React.useEffect(() => {
    getManufacturers().then(setManufacturers).catch(console.error);
  }, []);

  const manufacturerOptions = manufacturers.map((m) => ({
    label: m.name,
    value: m.name,
    id: m.manufacturer_id, // Custom prop handling might be needed if Select doesn't pass full object, but we use ID lookup below
  }));

  const modelOptions = models.map((m) => ({
    label: m.name,
    value: m.name,
  }));

  const caliberOptions = calibers.map((c) => ({
    label: c.name,
    value: c.name,
  }));

  const typeOptions = [
    { label: "Rifle", value: "Rifle" },
    { label: "Pistol", value: "Pistol" },
    { label: "Shotgun", value: "Shotgun" },
    { label: "Other", value: "Other" },
  ];

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Maintenance", value: "Maintenance" },
    { label: "Retired", value: "Retired" },
    { label: "Lost/Stolen", value: "Lost/Stolen" },
  ];

  const handleInputChange = (field: keyof FirearmFormState, value: string) => {
    setFormState((prevState) => {
      const newState = {
        ...prevState,
        [field]: value,
      };
      // Reset dependencies in form state if parent changes
      if (field === "manufacturer") {
        newState.model = "";
        newState.caliber_gauge = "Select a caliber";
      }
      if (field === "model") {
        newState.caliber_gauge = "Select a caliber";
      }
      return newState;
    });

    setValidationState((prevState) => ({
      ...prevState,
      [field]: false, // Clear error on change
    }));

    // Handle Dependency Fetching
    if (field === "manufacturer") {
      const selectedMfg = manufacturers.find((m) => m.name === value);
      if (selectedMfg) {
        // Fetch Models
        getModels(selectedMfg.manufacturer_id)
          .then((data) => {
            setModels(data);
            setCalibers([]); // Reset calibers
          })
          .catch(console.error);
      } else {
        setModels([]);
        setCalibers([]);
      }
    }

    if (field === "model") {
      const selectedModel = models.find((m) => m.name === value);
      if (selectedModel) {
        // Fetch Calibers
        getCalibers(selectedModel.model_id)
          .then(setCalibers)
          .catch(console.error);
      } else {
        setCalibers([]);
      }
    }
  };

  const validate = (): boolean => {
    const updatedState: ValidationState = {
      manufacturer:
        formState.manufacturer === "Select a manufacturer"
          ? "Please select a manufacturer"
          : false,
      model:
        !formState.model || formState.model === "Select a model"
          ? "Please select a model"
          : false,
      type: formState.type === "Select a type" ? "Please select a type" : false,
      caliber_gauge:
        formState.caliber_gauge === "Select a caliber"
          ? "Please select a caliber"
          : false,
      acquisition_date: formState.acquisition_date
        ? false
        : "Please enter a purchase date",
      serial_number: formState.serial_number.trim()
        ? false
        : "Please enter a serial number",
      asset_tag: formState.asset_tag.trim()
        ? false
        : "Please enter an asset tag",
      current_status:
        formState.current_status === "Select a status"
          ? "Please select a status"
          : false,
    };

    setValidationState(updatedState);
    return Object.values(updatedState).every((status) => status === false);
  };

  const handleSubmitFirearm = () => {
    if (!validate()) return;
    addFirearm(formState)
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
      // Reset selections

      setModels([]);
      setCalibers([]);
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
      <Button
        variant="primary"
        onClick={handleModalToggle}
        disabled={isDisabled}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Firearm
      </Button>
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
              options={manufacturerOptions}
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
            <Select
              value={
                !formState.model || formState.model === "Select a model"
                  ? undefined
                  : formState.model
              }
              onChange={(val) => handleInputChange("model", val)}
              options={modelOptions}
              placeholder="Select a model"
              error={!!validationState.model}
              disabled={formState.manufacturer === "Select a manufacturer"}
            />
          </Field>

          <Field label="Type" required error={validationState.type} id="type">
            <Select
              value={
                formState.type === "Select a type" ? undefined : formState.type
              }
              onChange={(val) => handleInputChange("type", val)}
              options={typeOptions}
              placeholder="Select a type"
              error={!!validationState.type}
            />
          </Field>

          <Field
            label="Caliber"
            required
            error={validationState.caliber_gauge}
            id="caliber"
          >
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
            label="Purchase Date"
            required
            error={validationState.acquisition_date}
            id="acquisition_date"
          >
            <Input
              type="date"
              id="acquisition_date"
              name="acquisition_date"
              value={formState.acquisition_date}
              onChange={(e) =>
                handleInputChange("acquisition_date", e.target.value)
              }
              error={!!validationState.acquisition_date}
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

          <Field
            label="Asset Tag"
            required
            error={validationState.asset_tag}
            id="asset_tag"
          >
            <Input
              type="text"
              id="asset_tag"
              name="asset_tag"
              value={formState.asset_tag}
              onChange={(e) => handleInputChange("asset_tag", e.target.value)}
              error={!!validationState.asset_tag}
              required
            />
          </Field>

          <Field
            label="Status"
            required
            error={validationState.current_status}
            id="current_status"
          >
            <Select
              value={
                formState.current_status === "Select a status"
                  ? undefined
                  : formState.current_status
              }
              onChange={(val) => handleInputChange("current_status", val)}
              options={statusOptions}
              placeholder="Select a status"
              error={!!validationState.current_status}
            />
          </Field>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export { AddFirearmForm };
