import * as React from "react";
import {
  PageSection,
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Grid,
  GridItem,
  Button,
} from "@patternfly/react-core";
import { AmmoCaliberTypeCard } from "@app/Charts/AmmoCaliberTypes";
import { CardUtilizationDemo3 } from "@app/Charts/utilizationCard";

const Dashboard: React.FunctionComponent = () => (
  <PageSection hasBodyWrapper={false}>
    <Grid hasGutter={true} md={6}>
      <GridItem>
        <AmmoCaliberTypeCard />
      </GridItem>
      <GridItem>
        <CardUtilizationDemo3 />
      </GridItem>
    </Grid>
  </PageSection>
);

export { Dashboard };
