import { useState, useEffect } from "react";
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
import { Caliber } from "../Firearms/hooks";
import { supabase } from "../../lib/supabase"; // Direct access for generic list or add a helper
import {
  AddCaliber,
  UpdateCaliber,
  DeleteCaliber,
} from "./ReferenceDataFunctions";

// The existing GetCalibers is for a specific model. I need to fetch ALL calibers.
// I should add GetAllCalibers to ReferenceDataFunctions or here.
// I'll add it here for now or use direct query.

const GetAllCalibers = async () => {
  const { data, error } = await supabase
    .from("reference_calibers")
    .select("*")
    .order("name");
  if (error) throw error;
  return data as Caliber[];
};

export const CalibersTab = () => {
  const [calibers, setCalibers] = useState<Caliber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Caliber | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await GetAllCalibers();
      setCalibers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load calibers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      if (editingItem) {
        await UpdateCaliber(editingItem.caliber_id, newItemName);
      } else {
        await AddCaliber(newItemName);
      }
      setIsModalOpen(false);
      setNewItemName("");
      setEditingItem(null);
      fetchData();
    } catch (err) {
      console.error(err);
      setError("Failed to save caliber");
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm("Are you sure? This may remove this caliber from linked models!")
    )
      return;
    try {
      await DeleteCaliber(id);
      fetchData();
    } catch (err) {
      console.error(err);
      setError("Failed to delete caliber");
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setNewItemName("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: Caliber) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setIsModalOpen(true);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Calibers</h2>
        <Button onClick={openAddModal} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Caliber
        </Button>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <div className="rounded-md border border-neutral-border bg-default-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calibers.map((m) => (
              <TableRow key={m.caliber_id}>
                <TableCell>{m.name}</TableCell>
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
                    onClick={() => handleDelete(m.caliber_id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Caliber" : "Add Caliber"}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        }>
        <div className="p-4">
          <Field label="Name">
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Enter caliber name"
              autoFocus
            />
          </Field>
        </div>
      </Modal>
    </div>
  );
};
