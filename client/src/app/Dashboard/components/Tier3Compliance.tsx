import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory";

interface Tier3ComplianceProps {
    ammunitionExpenditure: { unit_name: string; total_rounds: number }[];
}

export const Tier3Compliance: React.FC<Tier3ComplianceProps> = ({
    ammunitionExpenditure,
}) => {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Ammo Expenditure by Unit</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <VictoryChart
                            theme={VictoryTheme.material}
                            domainPadding={20}
                            padding={{ top: 20, bottom: 60, left: 60, right: 20 }}
                        >
                            <VictoryAxis
                                style={{ tickLabels: { fontSize: 8, angle: -45, textAnchor: 'end' } }}
                            />
                            <VictoryAxis dependentAxis />
                            <VictoryBar
                                data={ammunitionExpenditure}
                                x="unit_name"
                                y="total_rounds"
                                style={{ data: { fill: "#8b5cf6" } }}
                            />
                        </VictoryChart>
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Compliance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span>Last Audit Score</span>
                            <span className="font-bold text-green-600">98%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: "98%" }}></div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <span>Discrepancies (Last 30 days)</span>
                            <span className="font-bold text-gray-900 dark:text-gray-100">0</span>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <span>Pending Inspections</span>
                            <span className="font-bold text-yellow-500">3</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
