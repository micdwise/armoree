import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/Card";
import { VictoryPie } from "victory";

interface AssetStatusCardProps {
    status: { status: string; count: number }[];
}

export const AssetStatusCard: React.FC<AssetStatusCardProps> = ({ status }) => {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Asset Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                    {status.length > 0 ? (
                        <VictoryPie
                            data={status}
                            x="status"
                            y="count"
                            colorScale={["#10b981", "#f59e0b", "#3b82f6", "#ef4444"]}
                            innerRadius={100}
                            labelRadius={120}
                            style={{
                                labels: { fill: "white", fontSize: 12, fontWeight: "bold" },
                            }}
                            padAngle={2}
                        />
                    ) : (
                        <div className="text-muted-foreground">No data available</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
