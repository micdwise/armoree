import * as React from "react";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Select } from "@components/Select";
import { Modal } from "@components/Modal";
import { Field } from "@components/Field";
import { addAmmunition } from "@app/Ammunition/hooks";
import { getManufacturers, Manufacturer, Caliber } from "@app/Firearms/hooks";
import {
  GetAllCalibers,
  GetAllLocations,
  LocationRef,
} from "@app/Settings/ReferenceDataFunctions";
import {
  GetAllProjectileTypes,
  ProjectileType,
} from "@app/Settings/ProjectileTypesTab";
import { Plus } from "lucide-react";

interface AmmoFormState {
  manufacturer: string;
  caliber_gauge: string;
  projectile_type: string;
  lot_number: string;
  quantity_on_hand: string;
  storage_location_id: string;
}

interface ValidationState {
  manufacturer: string | boolean;
  caliber_gauge: string | boolean;
  projectile_type: string | boolean;
  lot_number: string | boolean;
  quantity_on_hand: string | boolean;
}

const initialFormState: AmmoFormState = {
  manufacturer: "",
  caliber_gauge: "",
  projectile_type: "",
  lot_number: "",
  quantity_on_hand: "",
  storage_location_id: "",
};

const initialValidationState: ValidationState = {
  manufacturer: false,
  caliber_gauge: false,
  projectile_type: false,
  lot_number: false,
  quantity_on_hand: false,
  storage_location_id: false,
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
  const [manufacturers, setManufacturers] = React.useState<Manufacturer[]>([]);
  const [calibers, setCalibers] = React.useState<Caliber[]>([]);
  const [projectileTypes, setProjectileTypes] = React.useState<
    ProjectileType[]
  >([]);
  const [locations, setLocations] = React.useState<LocationRef[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const m = await getManufacturers();
        setManufacturers(m);
        const c = await GetAllCalibers();
        setCalibers(c);
        const p = await GetAllProjectileTypes();
        setProjectileTypes(p);
        const l = await GetAllLocations();
        setLocations(l);
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

  const projectileTypeOptions = projectileTypes.map((p) => ({
    label: p.name,
    value: p.name,
  }));

  const locationOptions = locations.map((loc) => ({
    label: loc.location_name,
    value: String(loc.location_id),
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
      projectile_type:
        formState.projectile_type === "Select a projectile type"
          ? "Please select a projectile type"
          : false,
      lot_number: formState.lot_number.trim()
        ? false
        : "Please enter a lot number",
      quantity_on_hand: formState.quantity_on_hand
        ? false
        : "Please enter a quantity",
      storage_location_id: formState.storage_location_id
        ? false
        : "Please select a location",
    };

    setValidationState(updatedState);
    return Object.values(updatedState).every((status) => status === false);
  };

  const handleSubmitAmmo = () => {
    if (!validate()) return;
    const payload = {
      ...formState,
      quantity_on_hand: Number(formState.quantity_on_hand),
      storage_location_id: Number(formState.storage_location_id),
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
        disabled={isDisabled}
      >
        <Plus className="w-4 h-4 mr-2" />
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
            label="Projectile Type"
            required
            error={validationState.projectile_type}
            id="projectile_type"
          >
            <Select
              value={
                formState.projectile_type === "Select a projectile type"
                  ? undefined
                  : formState.projectile_type
              }
              onChange={(val) => handleInputChange("projectile_type", val)}
              options={projectileTypeOptions}
              placeholder="Select a projectile type"
              error={!!validationState.projectile_type}
            />
          </Field>

          <Field
            label="Location"
            required
            error={validationState.storage_location_id}
            id="storage_location_id"
          >
            <Select
              value={
                formState.storage_location_id === "Select a location"
                  ? undefined
                  : formState.storage_location_id
              }
              onChange={(val) => handleInputChange("storage_location_id", val)}
              options={locationOptions}
              placeholder="Select a location"
              error={!!validationState.storage_location_id}
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

          <Field
            label="Quantity"
            required
            error={validationState.quantity_on_hand}
            id="qty"
          >
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
