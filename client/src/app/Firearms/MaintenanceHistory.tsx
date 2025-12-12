import * as React from "react";
import { useParams } from "react-router-dom";
import { useMaintenanceLogs } from "@app/Firearms/hooks";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Card,
  CardContent,
  Spinner,
  Button,
} from "@components/index";
import { Plus } from "lucide-react";
import { AddMaintenanceModal } from "./AddMaintenanceModal";

interface MaintenanceHistoryProps {
  firearmId?: number;
}

export const MaintenanceHistory: React.FunctionComponent<
  MaintenanceHistoryProps
> = ({ firearmId }) => {
  const params = useParams<{ id: string }>();
  const id = firearmId ? String(firearmId) : params.id;
  const {
    data: maintenanceLogs,
    isLoading,
    isError,
    refetch,
  } = useMaintenanceLogs(id);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-default-font">
            Maintenance History
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
            <Spinner size="md" />
          </div>
        ) : isError ? (
          <p className="text-error-600">Error loading maintenance history.</p>
        ) : (maintenanceLogs || []).length === 0 ? (
          <p className="text-sm text-subtext-color">
            No history available yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Armorer</TableHead>
                  <TableHead>Problem</TableHead>
                  <TableHead>Work Performed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceLogs.map((log) => (
                  <TableRow key={log.log_id}>
                    <TableCell>
                      {new Date(log.date_performed).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="capitalize">
                      {log.type.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell>
                      {log.personnel
                        ? `${log.personnel.first_name} ${log.personnel.last_name}`
                        : "Unknown"}
                    </TableCell>
                    <TableCell
                      className="whitespace-pre-wrap break-words"
                      title={log.problem_reported}
                    >
                      {log.problem_reported || "-"}
                    </TableCell>
                    <TableCell
                      className="whitespace-pre-wrap break-words"
                      title={log.work_performed}
                    >
                      {log.work_performed || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {id && (
          <AddMaintenanceModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddSuccess={refetch}
            firearmId={Number(id)}
          />
        )}
      </CardContent>
    </Card>
  );
};
