import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFirearm, useMaintenanceLogs } from "@app/Firearms/hooks";
import { AddMaintenanceModal } from "./AddMaintenanceModal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@components/Table";
import { PageSection, Title } from "@components/Layout";
import { Card, CardContent } from "@components/Card";
import { Spinner } from "@components/Spinner";
import { Button } from "@components/Button";
import { ArrowLeft, Plus } from "lucide-react";

const getStatusColor = (status: string) => {
  if (status === "Active") return "bg-green-100 text-green-800";
  if (status === "Maintenance") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
};

export const FirearmInformation: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: firearm, isLoading, isError } = useFirearm(id);
  const {
    data: maintenanceLogs,
    isLoading: isLogsLoading,
    isError: isLogsError,
    refetch: refetchLogs,
  } = useMaintenanceLogs(id);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  if (isLoading) {
    return (
      <PageSection className="flex justify-center p-8">
        <Spinner size="lg" />
      </PageSection>
    );
  }

  if (isError || !firearm) {
    return (
      <PageSection className="p-8">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-bold">Error loading firearm</h2>
          <p>
            The firearm could not be found or there was an error loading it.
          </p>
          <Button
            variant="link"
            onClick={() => navigate("/Firearms")}
            className="mt-4"
          >
            Back to Firearms
          </Button>
        </div>
      </PageSection>
    );
  }

  return (
    <PageSection>
      <div className="mb-6">
        <Button
          variant="link"
          onClick={() => navigate("/Firearms")}
          className="flex items-center gap-2 pl-0 text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Firearms
        </Button>
      </div>

      <div className="mb-6">
        <Title>
          {firearm.manufacturer} {firearm.model}
        </Title>
        <p className="text-subtext-color text-sm">
          S/N: {firearm.serial_number}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-default-font">
              Details
            </h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-subtext-color">Type</dt>
                <dd className="mt-1 text-sm text-default-font">
                  {firearm.type || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-subtext-color">
                  Caliber
                </dt>
                <dd className="mt-1 text-sm text-default-font">
                  {firearm.caliber_gauge}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-subtext-color">
                  Asset Tag
                </dt>
                <dd className="mt-1 text-sm text-default-font">
                  {firearm.asset_tag || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-subtext-color">
                  Status
                </dt>
                <dd className="mt-1 text-sm text-default-font">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                      firearm.current_status,
                    )}`}
                  >
                    {firearm.current_status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-subtext-color">
                  Purchase Date
                </dt>
                <dd className="mt-1 text-sm text-default-font">
                  {new Date(firearm.acquisition_date).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Placeholder for future sections like Maintenance Log or Assignment History */}
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
            {isLogsLoading ? (
              <div className="flex justify-center p-4">
                <Spinner size="md" />
              </div>
            ) : isLogsError ? (
              <p className="text-red-600">Error loading maintenance history.</p>
            ) : maintenanceLogs.length === 0 ? (
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
                          className="max-w-xs truncate"
                          title={log.problem_reported}
                        >
                          {log.problem_reported || "-"}
                        </TableCell>
                        <TableCell
                          className="max-w-xs truncate"
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
          </CardContent>
        </Card>
      </div>

      <AddMaintenanceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSuccess={refetchLogs}
        firearmId={firearm.firearm_id}
      />
    </PageSection>
  );
};
