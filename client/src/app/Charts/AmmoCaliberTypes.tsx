import * as React from "react";
import {
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Title,
  Spinner,
  EmptyState,
  EmptyStateBody,
} from "@patternfly/react-core";
import { ChartPie, ChartThemeColor } from "@patternfly/react-charts/victory";
import { GetAmmunitionSummary } from "@app/Ammunition/AmmunitionData";
import { CubesIcon } from "@patternfly/react-icons";

const AmmoCaliberTypeCard: React.FunctionComponent = () => {
  const { data, isLoading } = GetAmmunitionSummary();

  const chartData = data.map((item) => ({
    x: item.caliber,
    y: Number.parseInt(item.total_rounds, 10),
  }));

  const totalRounds = chartData.reduce((acc, datum) => acc + datum.y, 0);

  const legendData = chartData.map((item) => ({
    name: `${item.x}: ${item.y}`,
  }));

  const cardBody = () => {
    if (isLoading) {
      return <Spinner />;
    }

    if (chartData.length === 0) {
      return (
        <EmptyState variant="sm" icon={CubesIcon}>
          <Title headingLevel="h5" size="md">
            No Ammunition Data
          </Title>
          <EmptyStateBody>
            Add ammunition to see a summary by caliber.
          </EmptyStateBody>
        </EmptyState>
      );
    }

    return (
      <ChartPie
        ariaDesc="Ammo Caliber quantities"
        ariaTitle="Ammunition by caliber"
        constrainToVisibleArea
        data={chartData}
        labels={({ datum }) => `${datum.x}: ${datum.y}`}
        legendData={legendData}
        legendOrientation="vertical"
        legendPosition="right"
        name="ammunition-summary-chart"
        padding={{ bottom: 20, left: 20, right: 140, top: 20 }}
        subTitle="Rounds"
        title={totalRounds.toString()}
        themeColor={ChartThemeColor.multiOrdered}
        width={350}
      />
    );
  };

  return (
    <Card id="ammo-caliber-type-card" component="div">
      <CardTitle>
        <Title headingLevel="h4" size="lg">
          Ammunition Calibers
        </Title>
      </CardTitle>
      <CardBody>{cardBody()}</CardBody>
      <CardFooter>
        <a href="/Ammunition">See details</a>
      </CardFooter>
    </Card>
  );
};

export { AmmoCaliberTypeCard };
