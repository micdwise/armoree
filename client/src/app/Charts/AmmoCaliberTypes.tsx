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
import { VictoryPie, VictoryTheme, VictoryTooltip, VictoryLabel } from "victory";
import { Box } from "lucide-react";

const AmmoCaliberTypeCard: React.FunctionComponent = () => {
  const { data, isLoading } = GetAmmunitionSummary();

  const chartData = data.map((item) => ({
    x: item.caliber,
    y: Number.parseInt(item.total_rounds, 10),
    label: `${item.caliber}: ${item.total_rounds}`,
  }));

  const totalRounds = chartData.reduce((acc, datum) => acc + datum.y, 0);

  const cardBody = () => {
    if (isLoading) {
      return <div className="flex justify-center p-8"><Spinner size="lg" /></div>;
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
      <div style={{ height: 350 }}>
        <svg viewBox="0 0 400 400">
          <VictoryPie
            standalone={false}
            width={400} height={400}
            data={chartData}
            innerRadius={50}
            labelRadius={100}
            style={{ labels: { fontSize: 20, fill: "white" } }}
            theme={VictoryTheme.material}
            colorScale="qualitative"
          />
          <VictoryLabel
            textAnchor="middle"
            style={{ fontSize: 20 }}
            x={200} y={200}
            text={`${totalRounds} Rounds`}
          />
        </svg>
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
        <a href="/Ammunition" className="text-sm text-blue-600 hover:underline">See details</a>
      </CardFooter>
    </Card>
  );
};

export { AmmoCaliberTypeCard };
