import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/Card";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory";

interface AmmoExpenditureCardProps {
    data: { unit_name: string; total_rounds: number }[];
}

export const AmmoExpenditureCard: React.FC<AmmoExpenditureCardProps> = ({ data }) => {
    return (
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
                            data={data}
                            x="unit_name"
                            y="total_rounds"
                            style={{ data: { fill: "#8b5cf6" } }}
                        />
                    </VictoryChart>
                </div>
            </CardContent>
        </Card>
    );
};
