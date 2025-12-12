import * as React from "react";
import { Modal, Button } from "@components/index";
import { TrainingHistory } from "./TrainingHistory";
import { AddTrainingModal } from "./AddTrainingModal";
import { Personnel } from "./hooks";

interface TrainingManagementModalProps {
  personnel: Personnel | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TrainingManagementModal = ({
  personnel,
  isOpen,
  onClose,
}: TrainingManagementModalProps) => {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const handleAddSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    setIsAddModalOpen(false);
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  if (!personnel) return null;

  const footer = (
    <Button variant="secondary" onClick={onClose}>
      Close
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Training Record: ${personnel.first_name} ${personnel.last_name}`}
      description={`Manage training qualifications for ${personnel.badge_number}.`}
      footer={footer}>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" onClick={openAddModal}>
            Add Training Entry
          </Button>
          <AddTrainingModal
            isOpen={isAddModalOpen}
            onClose={closeAddModal}
            personnelId={personnel.personnel_id}
            onAddSuccess={handleAddSuccess}
          />
        </div>
        <TrainingHistory
          personnelId={personnel.personnel_id}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </Modal>
  );
};
