import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/Card";

export const ComplianceOverviewCard: React.FC = () => {
    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span>Last Audit Score</span>
                        <span className="font-bold text-text-success">98%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-bg-success h-2 rounded-full" style={{ width: "98%" }}></div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <span>Discrepancies (Last 30 days)</span>
                        <span className="font-bold text-default-font">0</span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <span>Pending Inspections</span>
                        <span className="font-bold text-text-warning">3</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
