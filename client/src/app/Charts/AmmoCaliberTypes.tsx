import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/Card";
import { Spinner } from "../../components/Spinner";
import { GetAmmunitionSummary } from "@app/Ammunition/AmmunitionData";
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryLegend,
} from "victory";
import { Box } from "lucide-react";

const AmmoCaliberTypeCard: React.FunctionComponent = () => {
  const { data, isLoading } = GetAmmunitionSummary();

  const chartData = data.map((item) => ({
    x: item.caliber,
    y: Number.parseInt(item.total_rounds, 10),
    label: `${item.caliber}: ${item.total_rounds}`,
  }));

  const totalRounds = chartData.reduce((acc, datum) => acc + datum.y, 0);

  const COLORS = [
    "#334D5C",
    "#45B29D",
    "#EFC94C",
    "#E27A3F",
    "#DF5A49",
    "#9B59B6",
    "#34495E",
    "#1ABC9C",
  ];

  const cardBody = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center p-8">
          <Spinner size="lg" />
        </div>
      );
    }

    if (chartData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
          <Box className="h-10 w-10 mb-2 opacity-50" />
          <h4 className="text-lg font-medium">No Ammunition Data</h4>
          <p className="text-sm">Add ammunition to see a summary by caliber.</p>
        </div>
      );
    }

    return (
      <div className="h-[400px] w-full flex justify-center items-center">
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={{ x: 50 }}
          width={600}
          height={350}
        >
          <VictoryLegend
            x={50} // Legend inside chart area, adjusting positon
            y={10}
            orientation="horizontal"
            gutter={20}
            style={{ title: { fontSize: 16 } }}
            data={chartData.map((d) => ({ name: d.x }))}
            colorScale={COLORS}
          />
          <VictoryAxis
            style={{ tickLabels: { fontSize: 12, angle: -45, textAnchor: 'end' } }}
          />
          <VictoryAxis
            dependentAxis
            style={{ tickLabels: { fontSize: 12 } }}
          />
          <VictoryBar
            data={chartData}
            labels={({ datum }) => datum.y}
            style={{
              data: { fill: ({ index }) => COLORS[(index || 0) % COLORS.length] },
              labels: { fontSize: 12, fill: "black" }
            }}
            barWidth={40}
          />
        </VictoryChart>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ammunition Calibers</CardTitle>
      </CardHeader>
      <CardContent>{cardBody()}</CardContent>
      <CardFooter>
        <a href="/Ammunition" className="text-sm text-blue-600 hover:underline">
          See details
        </a>
      </CardFooter>
    </Card>
  );
};

export { AmmoCaliberTypeCard };
