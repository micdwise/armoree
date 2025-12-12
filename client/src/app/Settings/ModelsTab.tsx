import React, { useState, useEffect } from "react";
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
import { Select } from "@components/Select";
import { Trash2, Edit2, Plus } from "lucide-react";
import {
  getManufacturers,
  getModels,
  Manufacturer,
  Model,
  Caliber,
} from "../Firearms/hooks";
import { supabase } from "../../lib/supabase";
import {
  AddModel,
  UpdateModel,
  DeleteModel,
  GetModelCaliberIds,
  UpdateModelCalibers,
} from "./ReferenceDataFunctions";

const GetAllCalibers = async () => {
  const { data, error } = await supabase
    .from("reference_calibers")
    .select("*")
    .order("name");
  if (error) throw error;
  return data as Caliber[];
};

export const ModelsTab = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [selectedManufacturerId, setSelectedManufacturerId] =
    useState<string>("");
  const [models, setModels] = useState<Model[]>([]);

  // For Modal
  const [allCalibers, setAllCalibers] = useState<Caliber[]>([]);
  const [selectedCaliberIds, setSelectedCaliberIds] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(false); // Only for table data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Model | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Load Manufacturers & Calibers on mount
  useEffect(() => {
    const init = async () => {
      try {
        const m = await getManufacturers();
        setManufacturers(m);
        const c = await GetAllCalibers();
        setAllCalibers(c);

        // Select first manufacturer if available
        if (m.length > 0 && !selectedManufacturerId) {
          setSelectedManufacturerId(m[0].manufacturer_id.toString());
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load initial data");
      }
    };
    init();
  }, []);

  // Load Models when manufacturer changes
  useEffect(() => {
    if (!selectedManufacturerId) return;

    const loadModels = async () => {
      setIsLoading(true);
      try {
        const data = await getModels(Number.parseInt(selectedManufacturerId));
        setModels(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load models");
      } finally {
        setIsLoading(false);
      }
    };
    loadModels();
  }, [selectedManufacturerId]);

  const handleSave = async () => {
    if (!selectedManufacturerId) return;
    try {
      let modelId: number;
      if (editingItem) {
        await UpdateModel(editingItem.model_id, newItemName);
        modelId = editingItem.model_id;
      } else {
        const newModel = await AddModel(
          Number.parseInt(selectedManufacturerId),
          newItemName
        );
        modelId = newModel.model_id;
      }

      // Update calibers
      await UpdateModelCalibers(modelId, selectedCaliberIds);

      setIsModalOpen(false);
      setNewItemName("");
      setEditingItem(null);
      setSelectedCaliberIds([]);
      // Refresh models
      const data = await getModels(Number.parseInt(selectedManufacturerId));
      setModels(data);
    } catch (err) {
      console.error(err);
      setError("Failed to save model");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await DeleteModel(id);
      // Refresh
      if (selectedManufacturerId) {
        const data = await getModels(Number.parseInt(selectedManufacturerId));
        setModels(data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete model");
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setNewItemName("");
    setSelectedCaliberIds([]);
    setIsModalOpen(true);
  };

  const openEditModal = async (item: Model) => {
    setEditingItem(item);
    setNewItemName(item.name);
    // Fetch linked calibers
    try {
      const ids = await GetModelCaliberIds(item.model_id);
      setSelectedCaliberIds(ids);
      setIsModalOpen(true);
    } catch (e) {
      console.error(e);
      setError("Failed to load model details");
    }
  };

  const toggleCaliber = (id: number) => {
    setSelectedCaliberIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={3} className="text-center py-8">
            <Spinner />
          </TableCell>
        </TableRow>
      );
    }

    if (models.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={3}
            className="text-center py-8 text-subtext-color">
            No models found for this manufacturer.
          </TableCell>
        </TableRow>
      );
    }

    return models.map((m) => (
      <TableRow key={m.model_id}>
        <TableCell>{m.name}</TableCell>
        <TableCell className="text-subtext-color text-sm">
          Use edit to view
        </TableCell>
        <TableCell className="text-right space-x-2">
          <Button
            variant="link"
            className="p-1"
            onClick={() => openEditModal(m)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="link"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
            onClick={() => handleDelete(m.model_id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center">
        <div className="w-full sm:w-64">
          <label htmlFor="manufacturer-select" className="text-sm font-medium mb-1 block">Manufacturer</label>
          <Select
            id="manufacturer-select"
            value={selectedManufacturerId}
            onChange={(val) => setSelectedManufacturerId(val)}
            options={manufacturers.map((m) => ({
              value: m.manufacturer_id.toString(),
              label: m.name,
            }))}
            placeholder="Select Manufacturer"
          />
        </div>
        <Button onClick={openAddModal} disabled={!selectedManufacturerId}>
          <Plus className="w-4 h-4 mr-2" />
          Add Model
        </Button>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <div className="rounded-md border border-neutral-border bg-default-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Valid Calibers (Count)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderTableBody()}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Model" : "Add Model"}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        }>
        <div className="p-4 space-y-6">
          <Field label="Name">
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Enter model name"
              autoFocus
            />
          </Field>

          <div>
            <div className="text-sm font-medium mb-2 block">
              Valid Calibers
            </div>
            <div className="border border-neutral-border rounded p-3 h-48 overflow-y-auto grid grid-cols-2 gap-2">
              {allCalibers.map((c) => (
                <label
                  key={c.caliber_id}
                  className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-screen-background p-1 rounded">
                  <input
                    type="checkbox"
                    checked={selectedCaliberIds.includes(c.caliber_id)}
                    onChange={() => toggleCaliber(c.caliber_id)}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-subtext-color mt-1">
              Select all calibers compatible with this model.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
