import * as React from "react";
import { Tier1Alerts } from "./components/Tier1Alerts";
import { Tier2Assets } from "./components/Tier2Inventory";
import { Tier3Compliance } from "./components/Tier3Compliance";
import { getDashboardMetrics, DashboardMetrics } from "./DashboardData";
import { Button } from "../../components/Button";
import { RefreshCw } from "lucide-react";

export const Dashboard: React.FunctionComponent = () => {
  const [metrics, setMetrics] = React.useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const fetchMetrics = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getDashboardMetrics();
      setMetrics(data);
    } catch (error) {
      console.error("Failed to fetch dashboard metrics", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-default-font">
          Armory Dashboard
        </h1>
        <Button
          onClick={fetchMetrics}
          disabled={isLoading}
          variant="secondary"
          className="gap-2 text-default-font"
        >
          <RefreshCw
            className={`h-4 w-4 text-default-font ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <Tier1Alerts
        maintenanceOverdue={metrics?.maintenanceOverdueCount || 0}
        qualificationsExpiring={metrics?.qualificationsExpiringCount || 0}
        lowAmmoStock={metrics?.lowAmmoStockCount || 0}
        securityIssues={metrics?.securityAssetsIssueCount || 0}
        isLoading={isLoading}
      />

      {metrics && (
        <>
          <Tier2Assets
            assetStatus={metrics.inventoryStatus}
            highWearWeapons={metrics.highWearWeapons}
            assignmentRate={metrics.assignmentRate}
          />

          <Tier3Compliance
            ammunitionExpenditure={metrics.ammunitionExpenditure}
          />
        </>
      )}
    </div>
  );
};
