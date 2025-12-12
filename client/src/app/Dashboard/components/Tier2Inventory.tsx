import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/Card";
import {
  VictoryPie,
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
} from "victory";

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
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Asset Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            {assetStatus.length > 0 ? (
              <VictoryPie
                data={assetStatus}
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

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>High-Wear Weapons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <VictoryChart
              theme={VictoryTheme.material}
              domainPadding={20}
              padding={{ top: 20, bottom: 60, left: 60, right: 20 }}>
              <VictoryAxis
                style={{
                  tickLabels: { fontSize: 8, angle: -45, textAnchor: "end" },
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{ tickLabels: { fontSize: 10 } }}
              />
              <VictoryBar
                data={highWearWeapons}
                x="serial_number"
                y="rounds_fired"
                style={{
                  data: { fill: "#f97316" },
                  labels: { fontSize: 10 },
                }}
                labels={({ datum }) => datum.rounds_fired}
                labelComponent={<VictoryLabel dy={-10} />}
              />
            </VictoryChart>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>Assignment Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${assignmentRate}%` }}></div>
            </div>
            <span className="text-lg font-bold">{assignmentRate}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Percentage of total service firearms currently assigned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
