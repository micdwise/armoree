import * as React from "react";
import { Grid } from "lucide-react";
import { AmmoCaliberTypeCard } from "@app/Charts/AmmoCaliberTypes";
import { CardUtilizationDemo3 } from "@app/Charts/utilizationCard";

const Dashboard: React.FunctionComponent = () => {
  return (
    <div className="col-span-2 p4 rounded-xl border border-stone-300">
      <AmmoCaliberTypeCard />
      <CardUtilizationDemo3 />
    </div>
  );
};
export { Dashboard };
