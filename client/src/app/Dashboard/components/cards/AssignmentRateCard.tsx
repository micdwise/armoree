import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/Card";

interface AssignmentRateCardProps {
    rate: number;
}

export const AssignmentRateCard: React.FC<AssignmentRateCardProps> = ({ rate }) => {
    return (
        <Card className="col-span-7">
            <CardHeader>
                <CardTitle>Assignment Rate</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-4">
                    <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                        <div
                            className="bg-blue-600 h-4 rounded-full"
                            style={{ width: `${rate}%` }}
                        ></div>
                    </div>
                    <span className="text-lg font-bold">{rate}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    Percentage of total service firearms currently assigned.
                </p>
            </CardContent>
        </Card>
    );
};
