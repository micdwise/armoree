import * as React from "react";
import { MaintenanceOverdueCard } from "./cards/MaintenanceOverdueCard";
import { ExpiringQualificationsCard } from "./cards/ExpiringQualificationsCard";
import { LowAmmoStockCard } from "./cards/LowAmmoStockCard";
import { SecurityIssuesCard } from "./cards/SecurityIssuesCard";

interface Tier1AlertsProps {
    maintenanceOverdue: number;
    qualificationsExpiring: number;
    lowAmmoStock: number;
    securityIssues: number;
    isLoading: boolean;
}

export const Tier1Alerts: React.FC<Tier1AlertsProps> = ({
    maintenanceOverdue,
    qualificationsExpiring,
    lowAmmoStock,
    securityIssues,
    isLoading,
}) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MaintenanceOverdueCard count={maintenanceOverdue} isLoading={isLoading} />
            <ExpiringQualificationsCard count={qualificationsExpiring} isLoading={isLoading} />
            <LowAmmoStockCard count={lowAmmoStock} isLoading={isLoading} />
            <SecurityIssuesCard count={securityIssues} isLoading={isLoading} />
        </div>
    );
};
