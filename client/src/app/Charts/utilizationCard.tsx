import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@components/Card";
import {
  VictoryChart,
  VictoryStack,
  VictoryBar,
  VictoryTooltip,
  VictoryTheme,
  VictoryAxis,
  VictoryLegend,
} from "victory";
import { Select } from "@components/Select";
import { AlertCircle } from "lucide-react";

export const CardUtilizationDemo3: React.FunctionComponent = () => {
  // Mock data and state
  const [filter, setFilter] = React.useState<string>("Last hour");

  const dataLow = [{ x: "Cluster A", y: 6, label: "Low: 6" }];
  const dataImportant = [{ x: "Cluster A", y: 2, label: "Important: 2" }];
  const dataModerate = [{ x: "Cluster A", y: 4, label: "Moderate: 4" }];
  const dataCritical = [{ x: "Cluster A", y: 2, label: "Critical: 2" }];

  const filterOptions = [
    { value: "Last hour", label: "Last hour" },
    { value: "Last 6 hours", label: "Last 6 hours" },
    { value: "Last 24 hours", label: "Last 24 hours" },
    { value: "Last 7 days", label: "Last 7 days" },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Recommendations</CardTitle>
        <div className="w-[180px]">
          <Select
            placeholder="Filter"
            value={filter}
            onChange={(val) => setFilter(val)}
            options={filterOptions}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 text-sm text-gray-500">
            <b>Note:</b> Custom CSS is used in this demo.
          </div>

          <div>
            <span className="text-sm font-semibold text-gray-700">System</span>
            <div className="flex items-center gap-2 mt-1 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="hover:underline text-sm font-medium">
                25 incidents detected
              </span>
            </div>
          </div>

          <div style={{ height: 200 }}>
            <VictoryChart
              theme={VictoryTheme.material}
              domainPadding={{ x: 50 }}
              height={200}
              padding={{ top: 20, bottom: 60, left: 40, right: 40 }}
            >
              <VictoryLegend
                x={40}
                y={160}
                orientation="horizontal"
                gutter={20}
                style={{ border: { stroke: "black" }, title: { fontSize: 12 } }}
                data={[
                  { name: "Low", symbol: { fill: "#FCE96A" } },
                  { name: "Important", symbol: { fill: "#F6C142" } },
                  { name: "Moderate", symbol: { fill: "#F09833" } },
                  { name: "Critical", symbol: { fill: "#E26F2D" } },
                ]}
              />
              <VictoryAxis
                style={{
                  axis: { stroke: "none" },
                  tickLabels: { fill: "none" },
                }}
              />
              <VictoryStack
                horizontal
                colorScale={["#FCE96A", "#F6C142", "#F09833", "#E26F2D"]}
              >
                <VictoryBar
                  data={dataLow}
                  labelComponent={<VictoryTooltip />}
                />
                <VictoryBar
                  data={dataImportant}
                  labelComponent={<VictoryTooltip />}
                />
                <VictoryBar
                  data={dataModerate}
                  labelComponent={<VictoryTooltip />}
                />
                <VictoryBar
                  data={dataCritical}
                  labelComponent={<VictoryTooltip />}
                />
              </VictoryStack>
            </VictoryChart>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <span className="text-sm text-blue-600 hover:underline">
          See details
        </span>
      </CardFooter>
    </Card>
  );
};
