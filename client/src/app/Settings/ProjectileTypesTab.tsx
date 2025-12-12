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
import { supabase } from "../../lib/supabase";

export interface ProjectileType {
  projectile_type_id: number;
  name: string;
}

export const GetAllProjectileTypes = async () => {
  const { data, error } = await supabase
    .from("reference_projectile_types")
    .select("*")
    .order("name");
  if (error) throw error;
  return data as ProjectileType[];
};

const AddProjectileType = async (name: string) => {
  const { data, error } = await supabase
    .from("reference_projectile_types")
    .insert([{ name }])
    .select()
    .single();
  if (error) throw error;
  return data as ProjectileType;
};

const UpdateProjectileType = async (id: number, name: string) => {
  const { data, error } = await supabase
    .from("reference_projectile_types")
    .update({ name })
    .eq("projectile_type_id", id)
    .select()
    .single();
  if (error) throw error;
  return data as ProjectileType;
};

export const DeleteProjectileType = async (id: number) => {
  const { error } = await supabase
    .from("reference_projectile_types")
    .delete()
    .eq("projectile_type_id", id);
  if (error) throw error;
};

export const ProjectileTypesTab = () => {
  const [projectileTypes, setProjectileTypes] = useState<ProjectileType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectileType | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await GetAllProjectileTypes();
      setProjectileTypes(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load projectile types");
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
        await UpdateProjectileType(editingItem.projectile_type_id, newItemName);
      } else {
        await AddProjectileType(newItemName);
      }
      setIsModalOpen(false);
      setNewItemName("");
      setEditingItem(null);
      fetchData();
    } catch (err) {
      console.error(err);
      setError("Failed to save projectile type");
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Are you sure? This may affect ammunition records using this projectile type!"
      )
    )
      return;
    try {
      await DeleteProjectileType(id);
      fetchData();
    } catch (err) {
      console.error(err);
      setError("Failed to delete projectile type");
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setNewItemName("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: ProjectileType) => {
    setEditingItem(item);
    setNewItemName(item.name);
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
          Manage projectile types for ammunition inventory (e.g., FMJ, JHP,
          Ball).
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={openAddModal} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Projectile Type
        </Button>
      </div>

      {projectileTypes.length === 0 ? (
        <div className="text-center py-8 text-subtext-color">
          No projectile types found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectileTypes.map((pt) => (
              <TableRow key={pt.projectile_type_id}>
                <TableCell>{pt.name}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="link"
                    className="p-1"
                    onClick={() => openEditModal(pt)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="link"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                    onClick={() => handleDelete(pt.projectile_type_id)}>
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
        title={editingItem ? "Edit Projectile Type" : "Add Projectile Type"}
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
              placeholder="Enter projectile type (e.g., FMJ, JHP)"
              autoFocus
            />
          </Field>
        </div>
      </Modal>
    </div>
  );
};
