import React, { useState } from "react";
import { PageSection } from "@components/Layout";
import { Card, CardContent, CardHeader } from "@components/Card";
import { ManufacturersTab } from "./ManufacturersTab";
import { ModelsTab } from "./ModelsTab";
import { CalibersTab } from "./CalibersTab";
import { cn } from "../../lib/utils";

const tabs = [
    { id: "manufacturers", label: "Manufacturers", component: ManufacturersTab },
    { id: "models", label: "Models", component: ModelsTab },
    { id: "calibers", label: "Calibers", component: CalibersTab },
];

export const ReferenceDataPage = () => {
    const [activeTab, setActiveTab] = useState("manufacturers");

    const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component || ManufacturersTab;

    return (
        <PageSection>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-default-font">Reference Data</h1>
                <p className="text-subtext-color">Manage system reference tables for manufacturers, models, and calibers.</p>
            </div>

            <Card>
                <CardHeader className="border-b border-neutral-border pb-0 px-0">
                    <div className="flex px-6 space-x-6 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "pb-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
                                    activeTab === tab.id
                                        ? "border-brand-primary text-brand-primary"
                                        : "border-transparent text-subtext-color hover:text-default-font hover:border-neutral-border"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <ActiveComponent />
                </CardContent>
            </Card>
        </PageSection>
    );
};
