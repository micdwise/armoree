import * as React from "react";
import { PageSection, Title } from "../../components/Layout";
import { AmmoCaliberTypeCard } from "@app/Charts/AmmoCaliberTypes";
import { CardUtilizationDemo3 } from "@app/Charts/utilizationCard";

const Dashboard: React.FunctionComponent = () => (
  <PageSection>
    <div className="mb-6">
      <Title>Dashboard</Title>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <AmmoCaliberTypeCard />
      </div>
      <div>
        <CardUtilizationDemo3 />
      </div>
    </div>
  </PageSection>
);

export { Dashboard };
