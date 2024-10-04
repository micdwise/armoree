import React from "react";
import {
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Title,
} from "@patternfly/react-core";
import { ChartDonut, ChartThemeColor } from "@patternfly/react-charts/victory";

const AmmoCaliberTypeCard: React.FunctionComponent = () => (
  <Card id="utilization-card-4-card" component="div">
    <CardTitle>
      <Title headingLevel="h4" size="lg">
        Ammunition Calibers
      </Title>
    </CardTitle>
    <CardBody>
      <ChartDonut
        ariaDesc="Ammo Caliber qtys"
        ariaTitle="Donut chart example"
        constrainToVisibleArea
        data={[
          { x: "9mm", y: 35 },
          { x: "5.56", y: 55 },
          { x: ".22", y: 10 },
        ]}
        labels={({ datum }) => `${datum.x}: ${datum.y}%`}
        legendData={[
          { name: "9mm: 35" },
          { name: "5.56: 55" },
          { name: ".22: 10" },
        ]}
        legendOrientation="vertical"
        legendPosition="right"
        name="chart3"
        padding={{
          bottom: 20,
          left: 20,
          right: 140, // Adjusted to accommodate legend
          top: 20,
        }}
        subTitle="Rounds"
        title="100"
        themeColor={ChartThemeColor.multiOrdered}
        width={350}
      />
    </CardBody>
    <CardFooter>
      <a href="#">See details</a>
    </CardFooter>
  </Card>
);

export { AmmoCaliberTypeCard };
