import * as React from "react";
import { Modal, Button, Input, Select, Field } from "@components";
import {
    addPersonnelTraining,
    getTrainingCourses,
    getPersonnelList,
    TrainingCourse,
    Personnel,
} from "./hooks";

interface AddTrainingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSuccess: () => void;
    personnelId: number;
}

export const AddTrainingModal: React.FunctionComponent<AddTrainingModalProps> = ({
    isOpen,
    onClose,
    onAddSuccess,
    personnelId,
}) => {
    const [courses, setCourses] = React.useState<TrainingCourse[]>([]);
    const [instructors, setInstructors] = React.useState<Personnel[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);

    // Form State
    const [selectedCourse, setSelectedCourse] = React.useState<string>("");
    const [dateCompleted, setDateCompleted] = React.useState<string>("");
    const [score, setScore] = React.useState<string>("");
    const [selectedInstructor, setSelectedInstructor] = React.useState<string>("");

    React.useEffect(() => {
        if (isOpen) {
            loadOptions();
            // Reset form
            setSelectedCourse("");
            setDateCompleted(new Date().toISOString().split("T")[0]);
            setScore("");
            setSelectedInstructor("");
        }
    }, [isOpen]);

    const loadOptions = async () => {
        try {
            const [coursesData, personnelData] = await Promise.all([
                getTrainingCourses(),
                getPersonnelList(),
            ]);

            setCourses(coursesData);
            setInstructors(personnelData);
        } catch (error) {
            console.error("Error loading options", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const course = courses.find(c => c.course_id.toString() === selectedCourse);

            let dateExpires = "";
            if (course && dateCompleted) {
                const date = new Date(dateCompleted);
                date.setDate(date.getDate() + course.expiration_period_days);
                dateExpires = date.toISOString().split("T")[0];
            }

            await addPersonnelTraining({
                personnel_id: personnelId,
                course_id: parseInt(selectedCourse),
                date_completed: dateCompleted,
                date_expires: dateExpires,
                score_achieved: score ? parseFloat(score) : undefined,
                instructor_id: selectedInstructor ? parseInt(selectedInstructor) : undefined,
            });
            onAddSuccess();
            onClose();
        } catch (error) {
            console.error("Error adding training:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const courseOptions = courses.map(c => ({
        value: c.course_id.toString(),
        label: c.course_name
    }));

    const instructorOptions = instructors.map(p => ({
        value: p.personnel_id.toString(),
        label: `${p.first_name} ${p.last_name} (${p.badge_number})`
    }));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add Training Record"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} type="button">
                        Cancel
                    </Button>
                    <Button type="submit" onClick={(e) => handleSubmit(e as any)} isLoading={isLoading}>
                        Save Record
                    </Button>
                </>
            }
        >
            <div className="space-y-4">
                <Field label="Course" required>
                    <Select
                        value={selectedCourse}
                        onChange={(val) => setSelectedCourse(val)}
                        options={courseOptions}
                        placeholder="Select a course..."
                    />
                </Field>

                <Field label="Date Completed" required>
                    <Input
                        type="date"
                        value={dateCompleted}
                        onChange={(e) => setDateCompleted(e.target.value)}
                    />
                </Field>

                <Field label="Score">
                    <Input
                        type="number"
                        step="0.01"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        placeholder="Optional"
                    />
                </Field>

                <Field label="Instructor">
                    <Select
                        value={selectedInstructor}
                        onChange={(val) => setSelectedInstructor(val)}
                        options={instructorOptions}
                        placeholder="Select an instructor..."
                    />
                </Field>
            </div>
        </Modal>
    );
};
