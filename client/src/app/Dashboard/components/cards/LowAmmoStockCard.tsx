import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/Card";
import { ShieldAlert } from "lucide-react";
import clsx from "clsx";

interface LowAmmoStockCardProps {
    count: number;
    isLoading?: boolean;
}

export const LowAmmoStockCard: React.FC<LowAmmoStockCardProps> = ({ count, isLoading }) => {
    if (isLoading) {
        return (
            <Card className="animate-pulse">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 w-1/2 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                    <div className="h-8 w-1/4 bg-muted rounded"></div>
                </CardContent>
            </Card>
        );
    }

    const severity = count > 0 ? "text-text-error" : "text-text-success";

    return (
        <Link to="/Ammunition?filter=low_stock">
            <Card className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Ammo Stock</CardTitle>
                    <ShieldAlert className={clsx("h-4 w-4", severity)} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{count}</div>
                    <p className="text-xs text-muted-foreground">Lots below minimum</p>
                </CardContent>
            </Card>
        </Link>
    );
};
