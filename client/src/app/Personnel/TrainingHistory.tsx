import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Spinner,
  Button,
  Card,
  CardContent,
} from "@components/index";
import { Plus } from "lucide-react";
import { usePersonnelTraining, PersonnelTraining } from "./hooks";
import { AddTrainingModal } from "./AddTrainingModal";

interface TrainingHistoryProps {
  personnelId: number;
  refreshTrigger?: number;
}

export const TrainingHistory = ({
  personnelId,
  refreshTrigger = 0,
}: TrainingHistoryProps) => {
  const {
    data: training,
    isLoading,
    isError,
    refetch,
  } = usePersonnelTraining(personnelId);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    refetch();
  }, [refreshTrigger, refetch]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-default-font">
            Training History
          </h3>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-3 w-3 mr-2" />
            Add Entry
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-4">
            <Spinner size="lg" />
          </div>
        ) : isError ? (
          <p className="text-error-600">Error loading training history.</p>
        ) : training.length === 0 ? (
          <p className="text-sm text-subtext-color">
            No training records found.
          </p>
        ) : (
          <div className="overflow-x-auto">
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
                      <TableCell
                        className={isExpired ? "text-error-600 font-bold" : ""}
                      >
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
        )}

        <AddTrainingModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddSuccess={refetch}
          personnelId={personnelId}
        />
      </CardContent>
    </Card>
  );
};
