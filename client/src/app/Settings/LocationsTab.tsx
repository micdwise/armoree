import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@components/Table";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Field } from "@components/Field";
import { Modal } from "@components/Modal";
import { Spinner } from "@components/Spinner";
import { Trash2, Edit2, Plus } from "lucide-react";
import {
  GetAllLocations,
  AddLocation,
  UpdateLocation,
  DeleteLocation,
  LocationRef,
} from "./ReferenceDataFunctions";

export const LocationsTab = () => {
  const [locations, setLocations] = useState<LocationRef[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LocationRef | null>(null);
  const [locationName, setLocationName] = useState("");
  const [securityLevel, setSecurityLevel] = useState("1");
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await GetAllLocations();
      setLocations(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load locations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    const level = Number.parseInt(securityLevel);
    if (Number.isNaN(level) || level < 0) {
      setError("Security level must be 0 or greater");
      return;
    }

    try {
      if (editingItem) {
        await UpdateLocation(editingItem.location_id, locationName, level);
      } else {
        await AddLocation(locationName, level);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setLocationName("");
      setSecurityLevel("1");
      fetchData();
    } catch (err) {
      console.error(err);
      setError("Failed to save location");
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Are you sure? This may affect firearms or ammunition assigned to this location!"
      )
    )
      return;
    try {
      await DeleteLocation(id);
      fetchData();
    } catch (err) {
      console.error(err);
      setError("Failed to delete location");
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setLocationName("");
    setSecurityLevel("1");
    setIsModalOpen(true);
  };

  const openEditModal = (item: LocationRef) => {
    setEditingItem(item);
    setLocationName(item.location_name);
    setSecurityLevel(String(item.security_level ?? ""));
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-warning-50 border border-warning-200 rounded-md text-warning-800">
          {error}
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm text-subtext-color">
          Manage storage locations for assets and ammunition.
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={openAddModal} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      {locations.length === 0 ? (
        <div className="text-center py-8 text-subtext-color">
          No locations found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Security Level</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((loc) => (
              <TableRow key={loc.location_id}>
                <TableCell>{loc.location_name}</TableCell>
                <TableCell>{loc.security_level}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="link"
                    className="p-1"
                    onClick={() => openEditModal(loc)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="link"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                    onClick={() => handleDelete(loc.location_id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Location" : "Add Location"}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        }>
        <div className="p-4 space-y-4">
          <Field label="Name" required>
            <Input
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Enter location name"
              autoFocus
            />
          </Field>
          <Field label="Security Level" required>
            <Input
              type="number"
              min="0"
              value={securityLevel}
              onChange={(e) => setSecurityLevel(e.target.value)}
              placeholder="Enter security level"
            />
          </Field>
        </div>
      </Modal>
    </div>
  );
};
