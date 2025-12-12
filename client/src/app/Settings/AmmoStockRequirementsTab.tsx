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
import { Select } from "@components/Select";
import { GetAllCalibers } from "./ReferenceDataFunctions";
import { GetAllProjectileTypes, ProjectileType } from "./ProjectileTypesTab";
import { Edit2, Plus } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface AmmoStockRequirement {
  caliber_gauge: string;
  projectile_type: string;
  min_stock_level: number | null;
  current_total: number;
}

const fetchStockRequirements = async () => {
  // Get distinct ammo types with their min stock levels and totals
  const { data, error } = await supabase
    .from("ammunition_inventory")
    .select("caliber_gauge, projectile_type, min_stock_level, quantity_on_hand")
    .order("caliber_gauge");

  if (error) throw error;

  // Aggregate by caliber_gauge and projectile_type
  const aggregated = new Map<string, AmmoStockRequirement>();

  data.forEach((item) => {
    const key = `${item.caliber_gauge}|${item.projectile_type}`;

    if (aggregated.has(key)) {
      const existing = aggregated.get(key)!;
      existing.current_total += item.quantity_on_hand;
      // Use the max min_stock_level if there are multiple entries
      if (
        item.min_stock_level &&
        (!existing.min_stock_level ||
          item.min_stock_level > existing.min_stock_level)
      ) {
        existing.min_stock_level = item.min_stock_level;
      }
    } else {
      aggregated.set(key, {
        caliber_gauge: item.caliber_gauge,
        projectile_type: item.projectile_type,
        min_stock_level: item.min_stock_level,
        current_total: item.quantity_on_hand,
      });
    }
  });

  return Array.from(aggregated.values());
};

const updateStockRequirement = async (
  caliber: string,
  projectileType: string,
  minStockLevel: number,
) => {
  // Update all matching ammunition_inventory records
  const { data, error } = await supabase
    .from("ammunition_inventory")
    .update({ min_stock_level: minStockLevel })
    .eq("caliber_gauge", caliber)
    .eq("projectile_type", projectileType)
    .select("ammo_id");

  if (error) throw error;
  return (data ?? []).length;
};

export const AmmoStockRequirementsTab = () => {
  const [requirements, setRequirements] = useState<AmmoStockRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AmmoStockRequirement | null>(
    null,
  );
  const [minStockValue, setMinStockValue] = useState("");
  const [minStockCreateValue, setMinStockCreateValue] = useState("");
  const [selectedCaliber, setSelectedCaliber] = useState<string>("");
  const [selectedProjectileType, setSelectedProjectileType] =
    useState<string>("");
  const [caliberOptions, setCaliberOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [projectileTypeOptions, setProjectileTypeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchStockRequirements();
      setRequirements(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load stock requirements");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchData();
      try {
        const calibers = await GetAllCalibers();
        setCaliberOptions(
          calibers.map((c) => ({ label: c.name, value: c.name })),
        );
        const projectiles: ProjectileType[] = await GetAllProjectileTypes();
        setProjectileTypeOptions(
          projectiles.map((p) => ({ label: p.name, value: p.name })),
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load reference data for stock requirements");
      }
    };

    init();
  }, []);

  const handleSave = async () => {
    if (!editingItem) return;

    const minStock = Number.parseInt(minStockValue);
    if (Number.isNaN(minStock) || minStock < 0) {
      setError("Please enter a valid minimum stock level (0 or greater)");
      return;
    }

    try {
      await updateStockRequirement(
        editingItem.caliber_gauge,
        editingItem.projectile_type,
        minStock,
      );
      setIsModalOpen(false);
      setEditingItem(null);
      setMinStockValue("");
      fetchData();
    } catch (err) {
      console.error(err);
      setError("Failed to update stock requirement");
    }
  };

  const handleCreate = async () => {
    const minStock = Number.parseInt(minStockCreateValue);

    if (!selectedCaliber || !selectedProjectileType) {
      setError("Select a caliber and projectile type");
      return;
    }

    if (Number.isNaN(minStock) || minStock < 0) {
      setError("Please enter a valid minimum stock level (0 or greater)");
      return;
    }

    try {
      const updated = await updateStockRequirement(
        selectedCaliber,
        selectedProjectileType,
        minStock,
      );

      if (updated === 0) {
        setError(
          "No inventory records found for that caliber and projectile type",
        );
        return;
      }

      setIsCreateModalOpen(false);
      setMinStockCreateValue("");
      setSelectedCaliber("");
      setSelectedProjectileType("");
      await fetchData();
    } catch (err) {
      console.error(err);
      setError("Failed to add stock requirement");
    }
  };

  const openEditModal = (item: AmmoStockRequirement) => {
    setEditingItem(item);
    setMinStockValue(item.min_stock_level?.toString() || "");
    setIsModalOpen(true);
  };

  const getStockStatus = (requirement: AmmoStockRequirement) => {
    if (!requirement.min_stock_level) return null;

    if (requirement.current_total < requirement.min_stock_level) {
      return <span className="text-warning-500 font-semibold">Low Stock</span>;
    }

    return <span className="text-green-600 dark:text-green-400">Adequate</span>;
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
          Set minimum stock levels for each ammunition type. Low stock warnings
          will appear when current quantity falls below the minimum.
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Stock Requirement
        </Button>
      </div>

      {requirements.length === 0 ? (
        <div className="text-center py-8 text-subtext-color">
          No ammunition types found in inventory.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Caliber</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Current Total</TableHead>
              <TableHead>Min Stock Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requirements.map((req) => (
              <TableRow key={`${req.caliber_gauge}-${req.projectile_type}`}>
                <TableCell className="font-medium">
                  {req.caliber_gauge}
                </TableCell>
                <TableCell>{req.projectile_type}</TableCell>
                <TableCell>{req.current_total.toLocaleString()}</TableCell>
                <TableCell>
                  {req.min_stock_level?.toLocaleString() || (
                    <span className="text-subtext-color italic">Not set</span>
                  )}
                </TableCell>
                <TableCell>{getStockStatus(req)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(req)}
                    aria-label={`Edit stock requirement for ${req.caliber_gauge} ${req.projectile_type}`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
          setMinStockValue("");
          setError(null);
        }}
        title={`Set Stock Requirement - ${editingItem?.caliber_gauge} ${editingItem?.projectile_type}`}
      >
        <div className="space-y-4">
          <Field label="Minimum Stock Level" required>
            <Input
              type="number"
              min="0"
              value={minStockValue}
              onChange={(e) => setMinStockValue(e.target.value)}
              placeholder="Enter minimum quantity"
            />
          </Field>

          {editingItem && (
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-md text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-subtext-color">Current Total:</span>
                <span className="font-medium">
                  {editingItem.current_total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-subtext-color">Current Minimum:</span>
                <span className="font-medium">
                  {editingItem.min_stock_level?.toLocaleString() || "Not set"}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingItem(null);
                setMinStockValue("");
                setError(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedCaliber("");
          setSelectedProjectileType("");
          setMinStockCreateValue("");
          setError(null);
        }}
        title="Add Stock Requirement"
      >
        <div className="space-y-4">
          <Field label="Caliber" required>
            <Select
              value={selectedCaliber || undefined}
              onChange={(val) => setSelectedCaliber(val)}
              options={caliberOptions}
              placeholder="Select a caliber"
            />
          </Field>

          <Field label="Projectile Type" required>
            <Select
              value={selectedProjectileType || undefined}
              onChange={(val) => setSelectedProjectileType(val)}
              options={projectileTypeOptions}
              placeholder="Select a projectile type"
            />
          </Field>

          <Field label="Minimum Stock Level" required>
            <Input
              type="number"
              min="0"
              value={minStockCreateValue}
              onChange={(e) => setMinStockCreateValue(e.target.value)}
              placeholder="Enter minimum quantity"
            />
          </Field>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setSelectedCaliber("");
                setSelectedProjectileType("");
                setMinStockCreateValue("");
                setError(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
