import React from "react";
import { AssetStatusCard } from "./cards/AssetStatusCard";
import { HighWearWeaponsCard } from "./cards/HighWearWeaponsCard";
import { AssignmentRateCard } from "./cards/AssignmentRateCard";

interface Tier2AssetsProps {
  assetStatus: { status: string; count: number }[];
  highWearWeapons: {
    firearm_id: number;
    manufacturer: string;
    model: string;
    serial_number: string;
    rounds_fired: number;
  }[];
  assignmentRate: number;
}

export const Tier2Assets: React.FC<Tier2AssetsProps> = ({
  assetStatus,
  highWearWeapons,
  assignmentRate,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <AssetStatusCard status={assetStatus} />
      <HighWearWeaponsCard weapons={highWearWeapons} />
      <AssignmentRateCard rate={assignmentRate} />
    </div>
  );
};
