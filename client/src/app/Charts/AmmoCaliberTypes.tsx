import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@components/Card";
import { Spinner } from "@components/Spinner";
import { useAmmunitionSummary } from "@app/Ammunition/hooks";
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryLegend,
} from "victory";
import { Box } from "lucide-react";
import { useTheme } from "@components/ThemeContext";

const AmmoCaliberTypeCard: React.FunctionComponent = () => {
  const { data, isLoading } = useAmmunitionSummary();
  const { theme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(
    "light"
  );

  React.useEffect(() => {
    if (theme === "system") {
      const media = globalThis.matchMedia("(prefers-color-scheme: dark)");
      const updateTheme = () =>
        setResolvedTheme(media.matches ? "dark" : "light");
      updateTheme();
      media.addEventListener("change", updateTheme);
      return () => media.removeEventListener("change", updateTheme);
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  const chartData = data.map((item) => ({
    x: item.caliber,
    y: Number(item.total_rounds),
    label: `${item.caliber}: ${item.total_rounds}`,
  }));

  const LIGHT_COLORS = [
    "#334D5C",
    "#45B29D",
    "#EFC94C",
    "#E27A3F",
    "#DF5A49",
    "#9B59B6",
    "#34495E",
    "#1ABC9C",
  ];

  const DARK_COLORS = [
    "#4FC3F7", // Light Blue
    "#81C784", // Light Green
    "#FFF176", // Light Yellow
    "#FF8A65", // Light Orange
    "#E57373", // Light Red
    "#BA68C8", // Light Purple
    "#90A4AE", // Blue Grey
    "#4DB6AC", // Teal
  ];

  const COLORS = resolvedTheme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  const TEXT_COLOR = resolvedTheme === "dark" ? "#E5E5E5" : "#262626"; // neutral-200 vs neutral-800

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
        <div className="flex flex-col items-center justify-center py-12 text-center text-subtext-color">
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
          height={350}>
          <VictoryLegend
            x={50} // Legend inside chart area, adjusting positon
            y={10}
            orientation="horizontal"
            gutter={20}
            style={{
              title: { fontSize: 16, fill: TEXT_COLOR },
              labels: { fill: TEXT_COLOR },
            }}
            data={chartData.map((d) => ({ name: d.x }))}
            colorScale={COLORS}
          />
          <VictoryAxis
            style={{
              tickLabels: {
                fontSize: 12,
                angle: -45,
                textAnchor: "end",
                fill: TEXT_COLOR,
              },
              axis: { stroke: TEXT_COLOR },
              ticks: { stroke: TEXT_COLOR },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fontSize: 12, fill: TEXT_COLOR },
              axis: { stroke: TEXT_COLOR },
              ticks: { stroke: TEXT_COLOR },
              grid: {
                stroke: resolvedTheme === "dark" ? "#404040" : "#e5e5e5",
              },
            }}
          />
          <VictoryBar
            data={chartData}
            labels={({ datum }) => datum.y}
            style={{
              data: {
                fill: ({ index }) => COLORS[Number(index || 0) % COLORS.length],
              },
              labels: { fontSize: 12, fill: TEXT_COLOR },
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
        <a
          href="/Ammunition"
          className="text-sm text-brand-primary hover:underline">
          See details
        </a>
      </CardFooter>
    </Card>
  );
};

export { AmmoCaliberTypeCard };
