import * as React from "react";
import { Modal, Button, Input, TextArea, Select, Field } from "@components";
import { getPersonnelList, Personnel } from "../Personnel/hooks";
import { addMaintenanceLog } from "./hooks";

interface AddMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
  firearmId: number;
}

export const AddMaintenanceModal: React.FunctionComponent<
  AddMaintenanceModalProps
> = ({ isOpen, onClose, onAddSuccess, firearmId }) => {
  const [personnel, setPersonnel] = React.useState<Personnel[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Form State
  const [datePerformed, setDatePerformed] = React.useState<string>("");
  const [type, setType] = React.useState<string>("");
  const [armorer, setArmorer] = React.useState<string>("");
  const [problem, setProblem] = React.useState<string>("");
  const [workPerformed, setWorkPerformed] = React.useState<string>("");

  const typeOptions = [
    { value: "cleaning", label: "Cleaning" },
    { value: "repair", label: "Repair" },
    { value: "inspection", label: "Inspection" },
    { value: "modification", label: "Modification" },
    { value: "other", label: "Other" },
  ];

  React.useEffect(() => {
    if (isOpen) {
      loadOptions();
      resetForm();
    }
  }, [isOpen]);

  const loadOptions = async () => {
    try {
      const data = await getPersonnelList();
      setPersonnel(data);
    } catch (error) {
      console.error("Error loading personnel", error);
    }
  };

  const resetForm = () => {
    setDatePerformed(new Date().toISOString().split("T")[0]);
    setType("");
    setArmorer("");
    setProblem("");
    setWorkPerformed("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addMaintenanceLog({
        firearm_id: firearmId,
        date_performed: datePerformed,
        type: type,
        armorer_id: armorer ? Number.parseInt(armorer) : undefined,
        problem_reported: problem,
        work_performed: workPerformed,
      });
      onAddSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding maintenance log:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const personnelOptions = personnel.map((p) => ({
    value: p.personnel_id.toString(),
    label: `${p.first_name} ${p.last_name} (${p.badge_number})`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Maintenance Record"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={(e) => handleSubmit(e as any)}
            isLoading={isLoading}>
            Save Record
          </Button>
        </>
      }>
      <div className="space-y-4">
        <Field label="Date Performed" required>
          <Input
            type="date"
            value={datePerformed}
            onChange={(e) => setDatePerformed(e.target.value)}
          />
        </Field>

        <Field label="Type" required>
          <Select
            value={type}
            onChange={(val) => setType(val)}
            options={typeOptions}
            placeholder="Select type..."
          />
        </Field>

        <Field label="Armorer" required>
          <Select
            value={armorer}
            onChange={(val) => setArmorer(val)}
            options={personnelOptions}
            placeholder="Select armorer..."
          />
        </Field>

        <Field label="Problem Reported">
          <TextArea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Describe the issue..."
          />
        </Field>

        <Field label="Work Performed" required>
          <TextArea
            value={workPerformed}
            onChange={(e) => setWorkPerformed(e.target.value)}
            placeholder="Describe work done..."
          />
        </Field>
      </div>
    </Modal>
  );
};
