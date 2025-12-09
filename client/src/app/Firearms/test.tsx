import * as React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    FormControl,
    FormHelperText,
} from "@mui/material";
import { AddFirearms } from "@app/Firearms/FirearmsData";
// import { Button } from "@radix-ui/themes";
import allFirearmsManufacturer from "@data/firearm-manufacturer.json";
import allCalibers from "@data/caliber.json";
import firearmModels from "@data/firearm-models.json";
import { Button } from "@/components/ui/button";

interface FirearmFormState {
    manufacturer: string;
    model: string;
    caliber: string;
    purchase_date: string;
    serial_number: string;
}

interface ValidationState {
    manufacturer: boolean;
    model: boolean;
    caliber: boolean;
    purchase_date: boolean;
    serial_number: boolean;
}

const initialFormState: FirearmFormState = {
    manufacturer: "",
    model: "",
    caliber: "",
    purchase_date: "",
    serial_number: "",
};

const initialValidationState: ValidationState = {
    manufacturer: false,
    model: false,
    caliber: false,
    purchase_date: false,
    serial_number: false,
};

interface AddFirearmFormProps {
    onAddSuccess: () => void;
}

const AddFirearmForm: React.FunctionComponent<AddFirearmFormProps> = ({
    onAddSuccess,
}) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [formState, setFormState] =
        React.useState<FirearmFormState>(initialFormState);
    const [validationState, setValidationState] = React.useState<ValidationState>(
        initialValidationState,
    );

    const handleInputChange =
        (name: keyof FirearmFormState) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setFormState((prevState) => {
                    const newState = {
                        ...prevState,
                        [name]: event.target.value,
                    };

                    if (name === "manufacturer") {
                        newState.model = "";
                    }

                    return newState;
                });
                setValidationState((prevState) => ({
                    ...prevState,
                    [name]: false,
                }));
            };

    const validate = (): boolean => {
        const updatedState: ValidationState = {
            manufacturer: !formState.manufacturer.trim(),
            model: !formState.model.trim(),
            caliber: !formState.caliber.trim(),
            purchase_date: !formState.purchase_date,
            serial_number: !formState.serial_number.trim(),
        };

        setValidationState(updatedState);
        return !Object.values(updatedState).some((hasError) => hasError);
    };

    const handleSubmitFirearm = () => {
        if (!validate()) return;
        AddFirearms(formState)
            .then(() => {
                onAddSuccess(); // This triggers the refetch in the parent
                setFormState(initialFormState); // Reset form
                setIsModalOpen(false);
                setValidationState(initialValidationState);
            })
            .catch(console.error);
    };

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
        // Reset form state if the modal is closed without submitting
        if (isModalOpen) {
            setFormState(initialFormState);
            setValidationState(initialValidationState);
        }
    };

    const availFirearmModels = firearmModels.filter(
        (model) => model.manufacturer === formState.manufacturer,
    );

    return (
        <React.Fragment>
            <Button variant={"default"} onClick={handleModalToggle}>
                Add Firearm
            </Button>
            <Dialog
                open={isModalOpen}
                onClose={handleModalToggle}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Add Firearm</DialogTitle>
                <DialogContent>
                    <FormControl
                        fullWidth
                        margin="normal"
                        error={validationState.manufacturer}
                    >
                        <TextField
                            select
                            required
                            label="Manufacturer"
                            value={formState.manufacturer}
                            onChange={handleInputChange("manufacturer")}
                            error={validationState.manufacturer}
                        >
                            {allFirearmsManufacturer.map((option) => (
                                <MenuItem key={option.name} value={option.name}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        {validationState.manufacturer && (
                            <FormHelperText>Please select a manufacturer</FormHelperText>
                        )}
                    </FormControl>

                    <FormControl fullWidth margin="normal" error={validationState.model}>
                        <TextField
                            select
                            required
                            label="Model"
                            value={formState.model}
                            onChange={handleInputChange("model")}
                            error={validationState.model}
                        >
                            {availFirearmModels.map((option) => (
                                <MenuItem key={option.name} value={option.name}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        {validationState.model && (
                            <FormHelperText>Please enter a model</FormHelperText>
                        )}
                    </FormControl>

                    <FormControl
                        fullWidth
                        margin="normal"
                        error={validationState.caliber}
                    >
                        <TextField
                            select
                            required
                            label="Caliber"
                            value={formState.caliber}
                            onChange={handleInputChange("caliber")}
                            error={validationState.caliber}
                        >
                            {allCalibers.map((option) => (
                                <MenuItem key={option.name} value={option.name}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        {validationState.caliber && (
                            <FormHelperText>Please select a caliber</FormHelperText>
                        )}
                    </FormControl>

                    <FormControl
                        fullWidth
                        margin="normal"
                        error={validationState.purchase_date}
                    >
                        <TextField
                            required
                            type="date"
                            label="Purchase Date"
                            value={formState.purchase_date}
                            onChange={handleInputChange("purchase_date")}
                            error={validationState.purchase_date}
                            InputLabelProps={{ shrink: true }}
                        />
                        {validationState.purchase_date && (
                            <FormHelperText>Please enter a purchase date</FormHelperText>
                        )}
                    </FormControl>

                    <FormControl
                        fullWidth
                        margin="normal"
                        error={validationState.serial_number}
                    >
                        <TextField
                            required
                            label="Serial Number"
                            value={formState.serial_number}
                            onChange={handleInputChange("serial_number")}
                            error={validationState.serial_number}
                        />
                        {validationState.serial_number && (
                            <FormHelperText>Please enter a serial number</FormHelperText>
                        )}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalToggle}>Cancel</Button>
                    <Button onClick={handleSubmitFirearm}>Confirm </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export { AddFirearmForm };
