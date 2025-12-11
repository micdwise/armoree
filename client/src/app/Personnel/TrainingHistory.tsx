import { useEffect, useState, useCallback } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/Table";
import { Spinner } from "@components/Spinner";
import { GetPersonnelTraining, PersonnelTraining } from "./PersonnelData";

interface TrainingHistoryProps {
    personnelId: number;
    refreshTrigger?: number;
}

export const TrainingHistory = ({ personnelId, refreshTrigger = 0 }: TrainingHistoryProps) => {
    const [training, setTraining] = useState<PersonnelTraining[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const fetchTraining = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const data = await GetPersonnelTraining(personnelId);
            setTraining(data);
        } catch (error) {
            console.error("Error fetching training history:", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, [personnelId]);

    useEffect(() => {
        if (personnelId) {
            fetchTraining();
        }
    }, [personnelId, refreshTrigger, fetchTraining]);

    if (isLoading) {
        return (
            <div className="flex justify-center p-4">
                <Spinner size="lg" />
            </div>
        );
    }

    if (isError) {
        return <div className="text-red-500 p-4">Error loading training history.</div>;
    }

    if (training.length === 0) {
        return <div className="text-neutral-500 p-4">No training records found.</div>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Date Completed</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Instructor</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {training.map((record) => {
                        const isExpired = record.date_expires
                            ? new Date(record.date_expires) < new Date()
                            : false;

                        return (
                            <TableRow key={record.training_id}>
                                <TableCell className="font-medium">
                                    {record.course?.course_name || "Unknown Course"}
                                </TableCell>
                                <TableCell>{record.date_completed}</TableCell>
                                <TableCell className={isExpired ? "text-red-500 font-bold" : ""}>
                                    {record.date_expires || "-"}
                                </TableCell>
                                <TableCell>{record.score_achieved || "-"}</TableCell>
                                <TableCell>
                                    {record.instructor
                                        ? `${record.instructor.first_name} ${record.instructor.last_name}`
                                        : "-"}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};
