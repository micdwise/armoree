import { Link } from "react-router-dom";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { AlertTriangle, ShieldAlert, BadgeAlert, Hammer } from "lucide-react";
import clsx from "clsx";

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
    const getSeverity = (count: number, threshold: number = 0) => {
        return count > threshold ? "text-red-600" : "text-green-600";
    };

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/Firearms?filter=maintenance_overdue">
                <Card className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overdue Maintenance</CardTitle>
                        <Hammer className={clsx("h-4 w-4", getSeverity(maintenanceOverdue))} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{maintenanceOverdue}</div>
                        <p className="text-xs text-muted-foreground">Firearms needing service</p>
                    </CardContent>
                </Card>
            </Link>

            <Link to="/Settings/Personnel?filter=expiring">
                <Card className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expiring Qualifications</CardTitle>
                        <BadgeAlert className={clsx("h-4 w-4", getSeverity(qualificationsExpiring))} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{qualificationsExpiring}</div>
                        <p className="text-xs text-muted-foreground">Personnel within 30 days</p>
                    </CardContent>
                </Card>
            </Link>

            <Link to="/Ammunition?filter=low_stock">
                <Card className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Ammo Stock</CardTitle>
                        <ShieldAlert className={clsx("h-4 w-4", getSeverity(lowAmmoStock))} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lowAmmoStock}</div>
                        <p className="text-xs text-muted-foreground">Lots below minimum</p>
                    </CardContent>
                </Card>
            </Link>

            <Link to="/Settings/Security?filter=issues">
                <Card className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Security Issues</CardTitle>
                        <AlertTriangle className={clsx("h-4 w-4", getSeverity(securityIssues))} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{securityIssues}</div>
                        <p className="text-xs text-muted-foreground">Lost/Missing Assets</p>
                    </CardContent>
                </Card>
            </Link>
        </div>
    );
};
