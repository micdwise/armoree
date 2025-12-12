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
import { Trash2, Edit2, Plus } from "lucide-react";
import { getManufacturers, Manufacturer } from "../Firearms/hooks";
import {
    AddManufacturer,
    UpdateManufacturer,
    DeleteManufacturer,
} from "./ReferenceDataFunctions";

export const ManufacturersTab = () => {
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Manufacturer | null>(null);
    const [newItemName, setNewItemName] = useState("");
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await getManufacturers();
            setManufacturers(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load manufacturers");
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
                await UpdateManufacturer(editingItem.manufacturer_id, newItemName);
            } else {
                await AddManufacturer(newItemName);
            }
            setIsModalOpen(false);
            setNewItemName("");
            setEditingItem(null);
            fetchData();
        } catch (err) {
            console.error(err);
            setError("Failed to save manufacturer");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure? This may delete linked models!")) return;
        try {
            await DeleteManufacturer(id);
            fetchData();
        } catch (err) {
            console.error(err);
            setError("Failed to delete manufacturer");
        }
    };

    const openAddModal = () => {
        setEditingItem(null);
        setNewItemName("");
        setIsModalOpen(true);
    };

    const openEditModal = (item: Manufacturer) => {
        setEditingItem(item);
        setNewItemName(item.name);
        setIsModalOpen(true);
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Manufacturers</h2>
                <Button onClick={openAddModal} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Manufacturer
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
                        {manufacturers.map((m) => (
                            <TableRow key={m.manufacturer_id}>
                                <TableCell>{m.name}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="link"
                                        className="p-1"
                                        onClick={() => openEditModal(m)}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="link"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                                        onClick={() => handleDelete(m.manufacturer_id)}
                                    >
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
                title={editingItem ? "Edit Manufacturer" : "Add Manufacturer"}
                footer={
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                }
            >
                <div className="p-4">
                    <Field label="Name">
                        <Input
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="Enter manufacturer name"
                            autoFocus
                        />
                    </Field>
                </div>
            </Modal>
        </div>
    );
};
