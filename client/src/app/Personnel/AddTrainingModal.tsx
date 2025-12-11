import * as React from "react";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Modal } from "@components/Modal";
import { Field } from "@components/Field";
import { Select } from "@components/Select";
import { Plus } from "lucide-react";
import {
    AddPersonnelTraining,
    GetTrainingCourses,
    GetPersonnel,
    TrainingCourse,
    Personnel,
} from "./PersonnelData";

interface AddTrainingModalProps {
    personnelId: number;
    onAddSuccess: () => void;
    isDisabled?: boolean;
}

interface FormState {
    course_id: string;
    date_completed: string;
    score_achieved: string;
    instructor_id: string;
}

const initialFormState: FormState = {
    course_id: "",
    date_completed: new Date().toISOString().split("T")[0],
    score_achieved: "",
    instructor_id: "",
};

export function AddTrainingModal({
    personnelId,
    onAddSuccess,
    isDisabled,
}: Readonly<AddTrainingModalProps>) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [formState, setFormState] = React.useState<FormState>(initialFormState);
    const [error, setError] = React.useState<string | null>(null);
    const [courses, setCourses] = React.useState<TrainingCourse[]>([]);
    const [instructors, setInstructors] = React.useState<Personnel[]>([]);

    const fetchOptions = React.useCallback(async () => {
        try {
            const [coursesData, personnelData] = await Promise.all([
                GetTrainingCourses(),
                GetPersonnel(),
            ]);
            setCourses(coursesData);
            if (personnelData && personnelData.data) {
                setInstructors(personnelData.data);
            }
        } catch (err) {
            console.error("Failed to load options:", err);
            setError("Failed to load available courses or instructors.");
        }
    }, []);

    React.useEffect(() => {
        if (isModalOpen) {
            fetchOptions();
        }
    }, [isModalOpen, fetchOptions]);

    const handleInputChange = (field: keyof FormState, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const validate = () => {
        if (!formState.course_id) return "Course is required";
        if (!formState.date_completed) return "Date completed is required";
        if (!formState.instructor_id) return "Instructor is required";
        return null;
    };

    const handleSubmit = async () => {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        try {
            // Calculate expiry date based on course
            const course = courses.find((c) => c.course_id === Number(formState.course_id));
            let date_expires;
            if (course && course.expiration_period_days) {
                const date = new Date(formState.date_completed);
                date.setDate(date.getDate() + course.expiration_period_days);
                date_expires = date.toISOString().split("T")[0];
            }

            await AddPersonnelTraining({
                personnel_id: personnelId,
                course_id: Number(formState.course_id),
                date_completed: formState.date_completed,
                score_achieved: formState.score_achieved ? Number(formState.score_achieved) : undefined,
                instructor_id: Number(formState.instructor_id),
                date_expires,
            });

            setFormState(initialFormState);
            setIsModalOpen(false);
            onAddSuccess();
        } catch (err) {
            console.error("Failed to add training:", err);
            setError("Failed to save training record. Please try again.");
        }
    };

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
        if (!isModalOpen) {
            setFormState(initialFormState);
            setError(null);
        }
    };

    const footer = (
        <>
            <Button variant="link" onClick={handleModalToggle}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
                Save Record
            </Button>
        </>
    );

    return (
        <>
            <Button disabled={isDisabled} onClick={handleModalToggle} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Training
            </Button>
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalToggle}
                title="Add Training Record"
                description="Enter training details below."
                footer={footer}
            >
                <form className="flex flex-col gap-4">
                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <Field label="Course" required id="course_id">
                        <Select
                            value={formState.course_id}
                            onChange={(value) => handleInputChange("course_id", value)}
                            options={courses.map((c) => ({
                                value: String(c.course_id),
                                label: c.course_name,
                            }))}
                            placeholder="Select Course"
                        />
                    </Field>

                    <Field label="Date Completed" required id="date_completed">
                        <Input
                            type="date"
                            value={formState.date_completed}
                            onChange={(e) => handleInputChange("date_completed", e.target.value)}
                        />
                    </Field>

                    <Field label="Score" id="score_achieved">
                        <Input
                            type="number"
                            value={formState.score_achieved}
                            onChange={(e) => handleInputChange("score_achieved", e.target.value)}
                            placeholder="Example: 95"
                        />
                    </Field>

                    <Field label="Instructor" required id="instructor_id">
                        <Select
                            value={formState.instructor_id}
                            onChange={(value) => handleInputChange("instructor_id", value)}
                            options={instructors.map((p) => ({
                                value: String(p.personnel_id),
                                label: `${p.first_name} ${p.last_name} (${p.badge_number})`,
                            }))}
                            placeholder="Select Instructor"
                        />
                    </Field>
                </form>
            </Modal>
        </>
    );
}
