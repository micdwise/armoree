import { supabase } from "../../lib/supabase";

export interface DashboardMetrics {
    maintenanceOverdueCount: number;
    qualificationsExpiringCount: number;
    lowAmmoStockCount: number;
    securityAssetsIssueCount: number;
    inventoryStatus: { status: string; count: number }[];
    highWearWeapons: {
        firearm_id: number;
        manufacturer: string;
        model: string;
        serial_number: string;
        rounds_fired: number;
    }[];
    assignmentRate: number; // percentage 0-100
    ammunitionExpenditure: { unit_name: string; total_rounds: number }[];
}

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
    const [
        maintenanceOverdue,
        qualificationsExpiring,
        lowAmmoStock,
        securityAssets,
        inventoryStatus,
        highWearWeapons,
        assignmentStats,
        ammunitionExpenditure,
    ] = await Promise.all([
        getMaintenanceOverdueCount(),
        getQualificationsExpiringCount(),
        getLowAmmoStockCount(),
        getSecurityAssetStatus(),
        getInventoryStatusDistribution(),
        getHighWearWeaponReport(),
        getAssignmentRate(),
        getAmmunitionExpenditureByUnit(),
    ]);

    return {
        maintenanceOverdueCount: maintenanceOverdue,
        qualificationsExpiringCount: qualificationsExpiring,
        lowAmmoStockCount: lowAmmoStock,
        securityAssetsIssueCount: securityAssets,
        inventoryStatus,
        highWearWeapons,
        assignmentRate: assignmentStats,
        ammunitionExpenditure,
    };
};

// Tier 1 Queries

async function getMaintenanceOverdueCount(): Promise<number> {
    const today = new Date().toISOString();
    // Count firearms where next_due_date is in the past
    const { count, error } = await supabase
        .from("service_schedule")
        .select("*", { count: "exact", head: true })
        .lt("next_due_date", today);

    if (error) {
        console.error("Error fetching maintenance overdue count:", error);
        return 0;
    }
    return count || 0;
}

async function getQualificationsExpiringCount(): Promise<number> {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // Count training records expiring within 30 days
    const { count, error } = await supabase
        .from("personnel_training")
        .select("*", { count: "exact", head: true })
        .lte("date_expires", thirtyDaysFromNow.toISOString())
        .gte("date_expires", today.toISOString());

    if (error) {
        console.error("Error fetching expiring qualifications count:", error);
        return 0;
    }
    return count || 0;
}

async function getLowAmmoStockCount(): Promise<number> {
    // We can't easily compare columns (quantity_on_hand < min_stock_level) directly in simple Supabase query builder
    // without using .rpc() or raw SQL.
    // For now, we will fetch all ammo inventory that has a min_stock_level set and filter in JS.
    // OPTIMIZATION: If dataset is huge, move to RPC or View.
    const { data, error } = await supabase
        .from("ammunition_inventory")
        .select("quantity_on_hand, min_stock_level")
        .not("min_stock_level", "is", null);

    if (error) {
        console.error("Error fetching low ammo stock:", error);
        return 0;
    }

    if (!data) return 0;

    return data.filter((item) => item.quantity_on_hand < (item.min_stock_level || 0)).length;
}

async function getSecurityAssetStatus(): Promise<number> {
    // Count assets that are not in a 'Secure' or 'Active' state, e.g., 'Lost', 'Missing', 'Maintenance'
    // Or maybe we want to count specific critical issues.
    // Requirement says: "Status of critical security assets... Actionable: Immediate investigation... for lost items."
    // Let's count items with status 'Lost' or 'Missing'.
    const { count, error } = await supabase
        .from("security_asset")
        .select("*", { count: "exact", head: true })
        .in("status", ["Lost", "Missing"]);

    if (error) {
        console.error("Error fetching security asset status:", error);
        return 0;
    }
    return count || 0;
}

// Tier 2 Queries

async function getInventoryStatusDistribution(): Promise<{ status: string; count: number }[]> {
    // Need to group by status. Supabase JS client doesn't support 'group by' easily returning counts without RPC.
    // We will fetch all firearms current_status and aggregate in JS.
    const { data, error } = await supabase
        .from("firearm")
        .select("current_status");

    if (error) {
        console.error("Error fetching inventory status:", error);
        return [];
    }

    const counts: Record<string, number> = {};
    data?.forEach((item) => {
        counts[item.current_status] = (counts[item.current_status] || 0) + 1;
    });

    return Object.entries(counts).map(([status, count]) => ({ status, count }));
}

async function getHighWearWeaponReport(): Promise<any[]> {
    // "Top 5 to 10 firearms with the highest rounds fired since last service."
    // This is complex. Requires summing rounds from usage_log where date > last_service_date.
    // For MVP, let's just show top firearms by TOTAL rounds fired recorded in usage_log,
    // assuming 'high usage' implies high wear.
    // Ideally this should be an RPC.

    // We will fetch usage logs, aggregate by firearm_id, and then sort.
    const { data: usageData, error: usageError } = await supabase
        .from("usage_log")
        .select("firearm_id, rounds_fired");

    if (usageError) {
        console.error("Error fetching usage log:", usageError);
        return [];
    }

    const roundsByFirearm: Record<number, number> = {};
    usageData?.forEach(log => {
        roundsByFirearm[log.firearm_id] = (roundsByFirearm[log.firearm_id] || 0) + log.rounds_fired;
    });

    // Sort and take top 5
    const topFirearmIds = Object.entries(roundsByFirearm)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id]) => Number.parseInt(id));

    if (topFirearmIds.length === 0) return [];

    // Fetch details for these firearms
    const { data: firearmData, error: firearmError } = await supabase
        .from("firearm")
        .select("firearm_id, manufacturer, model, serial_number")
        .in("firearm_id", topFirearmIds);

    if (firearmError) {
        console.error("Error fetching firearm details:", firearmError);
        return [];
    }

    return firearmData.map(f => ({
        ...f,
        rounds_fired: roundsByFirearm[f.firearm_id]
    })).sort((a, b) => b.rounds_fired - a.rounds_fired);
}

async function getAssignmentRate(): Promise<number> {

    // Total service firearms
    const { count: totalFirearms, error: totalError } = await supabase
        .from("firearm")
        .select("*", { count: "exact", head: true })
        // Assuming 'Retired' or 'Disposed' are status we might exclude, but "total service firearms" usually means active inventory.
        .neq("current_status", "Retired")
        .neq("current_status", "Disposed");

    if (totalError) {
        console.error("Error fetching total firearms:", totalError);
        return 0;
    }

    if (!totalFirearms || totalFirearms === 0) return 0;

    // Assigned firearms
    const { count: assignedCount, error: assignedError } = await supabase
        .from("current_assignment")
        .select("*", { count: "exact", head: true });

    if (assignedError) {
        console.error("Error fetching assigned firearms:", assignedError);
        return 0;
    }

    return Math.round(((assignedCount || 0) / totalFirearms) * 100);
}

// Tier 3 Queries

async function getAmmunitionExpenditureByUnit(): Promise<{ unit_name: string; total_rounds: number }[]> {
    // Join usage_log -> personnel -> unit
    // Fetch flattened data
    const { data, error } = await supabase
        .from("usage_log")
        .select(`
            rounds_fired,
            personnel (
                unit (
                    unit_name
                )
            )
        `);

    if (error) {
        console.error("Error fetching ammo expenditure:", error);
        return [];
    }

    const roundsByUnit: Record<string, number> = {};

    data?.forEach((log: any) => {
        const unitName = log.personnel?.unit?.unit_name || "Unknown";
        roundsByUnit[unitName] = (roundsByUnit[unitName] || 0) + log.rounds_fired;
    });

    return Object.entries(roundsByUnit).map(([unit_name, total_rounds]) => ({ unit_name, total_rounds }));
}
