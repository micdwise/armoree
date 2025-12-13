import React from "react";
import { AmmoExpenditureCard } from "./cards/AmmoExpenditureCard";
import { ComplianceOverviewCard } from "./cards/ComplianceOverviewCard";

interface Tier3ComplianceProps {
    ammunitionExpenditure: { unit_name: string; total_rounds: number }[];
}

export const Tier3Compliance: React.FC<Tier3ComplianceProps> = ({
    ammunitionExpenditure,
}) => {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <AmmoExpenditureCard data={ammunitionExpenditure} />
            <ComplianceOverviewCard />
        </div>
    );
};
