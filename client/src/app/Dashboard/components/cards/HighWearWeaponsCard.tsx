import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/Card";
import {
    VictoryBar,
    VictoryChart,
    VictoryAxis,
    VictoryTheme,
    VictoryLabel,
} from "victory";

interface HighWearWeaponsCardProps {
    weapons: {
        firearm_id: number;
        manufacturer: string;
        model: string;
        serial_number: string;
        rounds_fired: number;
    }[];
}

export const HighWearWeaponsCard: React.FC<HighWearWeaponsCardProps> = ({ weapons }) => {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>High-Wear Weapons</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <VictoryChart
                        theme={VictoryTheme.material}
                        domainPadding={20}
                        padding={{ top: 20, bottom: 60, left: 60, right: 20 }}
                    >
                        <VictoryAxis
                            style={{
                                tickLabels: { fontSize: 8, angle: -45, textAnchor: "end" },
                            }}
                        />
                        <VictoryAxis
                            dependentAxis
                            style={{ tickLabels: { fontSize: 10 } }}
                        />
                        <VictoryBar
                            data={weapons}
                            x="serial_number"
                            y="rounds_fired"
                            style={{
                                data: { fill: "#f97316" },
                                labels: { fontSize: 10 },
                            }}
                            labels={({ datum }) => datum.rounds_fired}
                            labelComponent={<VictoryLabel dy={-10} />}
                        />
                    </VictoryChart>
                </div>
            </CardContent>
        </Card>
    );
};
