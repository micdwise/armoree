import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFirearm, useMaintenanceLogs } from "@app/Firearms/hooks";
import { AddMaintenanceModal } from "./AddMaintenanceModal";
import { MaintenanceHistory } from "./MaintenanceHistory";
import {
  PageSection,
  Button,
  Card,
  CardContent,
  Spinner,
} from "@components/index";
import { ArrowLeft, Crosshair, Shield, Tag, Calendar, Hash } from "lucide-react";

const getStatusColor = (status: string) => {
  if (status === "Active") return "bg-success-100 text-success-800";
  if (status === "Maintenance") return "bg-warning-100 text-warning-800";
  return "bg-neutral-100 text-neutral-800";
};

export const FirearmsDetail: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: firearm, isLoading, isError } = useFirearm(id);
  const { refetch: refetchLogs } = useMaintenanceLogs(id);
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
        <div className="text-center text-error-600">
          <h2 className="text-xl font-bold">Error loading firearm</h2>
          <p>
            The firearm could not be found or there was an error loading it.
          </p>
          <Button
            variant="link"
            onClick={() => navigate("/Firearms")}
            className="mt-4">
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
          className="flex items-center gap-2 pl-0 text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Firearms
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-24 w-24 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                <Crosshair className="h-12 w-12 text-neutral-400" />
              </div>
              <h1 className="text-2xl font-bold text-default-font">
                {firearm.manufacturer} {firearm.model}
              </h1>
              <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                  firearm.current_status
                )}`}
              >
                {firearm.current_status}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-neutral-border max-w-md mx-auto">
              <div className="flex justify-between items-center text-sm">
                <span className="text-subtext-color flex items-center gap-2">
                  <Hash className="h-4 w-4" /> Serial Number
                </span>
                <span className="font-medium text-default-font">
                  {firearm.serial_number}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-subtext-color flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Type
                </span>
                <span className="font-medium text-default-font">
                  {firearm.type || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-subtext-color flex items-center gap-2">
                  <Crosshair className="h-4 w-4" /> Caliber
                </span>
                <span className="font-medium text-default-font">
                  {firearm.caliber_gauge}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-subtext-color flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Asset Tag
                </span>
                <span className="font-medium text-default-font">
                  {firearm.asset_tag || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-subtext-color flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Purchase Date
                </span>
                <span className="font-medium text-default-font">
                  {new Date(firearm.acquisition_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <MaintenanceHistory firearmId={firearm.firearm_id} />
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
