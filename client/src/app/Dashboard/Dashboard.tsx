import * as React from "react";
import { AmmoCaliberTypeCard } from "@app/Charts/AmmoCaliberTypes";
import { CardUtilizationDemo3 } from "@app/Charts/utilizationCard";

const Dashboard: React.FunctionComponent = () => {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <AmmoCaliberTypeCard />
      </div>
      <div>
        <CardUtilizationDemo3 />
      </div>
    </div>
  );
};
export { Dashboard };
