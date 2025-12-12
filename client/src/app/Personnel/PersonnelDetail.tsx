import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageSection, Card, CardContent, CardHeader, CardTitle, Button, Spinner } from "@components";
import { ArrowLeft, User, Shield, Calendar } from "lucide-react";
import { usePersonnelById } from "./hooks";
import { TrainingHistory } from "./TrainingHistory";

export const PersonnelDetail: React.FunctionComponent = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: person, isLoading, isError } = usePersonnelById(id || "");

    if (isLoading) {
        return (
            <PageSection>
                <div className="flex justify-center p-8">
                    <Spinner size="lg" />
                </div>
            </PageSection>
        );
    }

    if (isError || !person) {
        return (
            <PageSection>
                <div className="flex flex-col items-center justify-center gap-4 p-8 text-center text-red-500">
                    <User className="h-12 w-12" />
                    <h2 className="text-xl font-bold">Error Loading Personnel</h2>
                    <p className="text-subtext-color">
                        Could not find the requested personnel record.
                    </p>
                    <Button onClick={() => navigate("/Personnel")}>
                        Return to List
                    </Button>
                </div>
            </PageSection>
        );
    }

    return (
        <PageSection>
            <div className="mb-6">
                <Button
                    variant="link"
                    className="pl-0 gap-2 text-subtext-color hover:text-default-font"
                    onClick={() => navigate("/Personnel")}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Personnel
                </Button>
            </div>

            <div className="space-y-6">
                {/* Profile Card */}
                <div>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="h-24 w-24 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                                    <User className="h-12 w-12 text-neutral-400" />
                                </div>
                                <h1 className="text-2xl font-bold text-default-font">
                                    {person.first_name} {person.last_name}
                                </h1>
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 mt-2">
                                    {person.status}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-neutral-border">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-subtext-color flex items-center gap-2">
                                        <Shield className="h-4 w-4" /> Badge
                                    </span>
                                    <span className="font-medium text-default-font">
                                        {person.badge_number}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-subtext-color flex items-center gap-2">
                                        <Shield className="h-4 w-4" /> Unit
                                    </span>
                                    <span className="font-medium text-default-font">
                                        {person.unit?.unit_name || "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-subtext-color flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Joined
                                    </span>
                                    <span className="font-medium text-default-font">
                                        - {/* Date joined is not in Personnel interface yet */}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Training History & Other Details */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Training History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TrainingHistory personnelId={person.personnel_id} />
                        </CardContent>
                    </Card>

                    {/* Placeholder for future tabs like Assigned Gear, Firearms, etc. */}
                </div>
            </div>
        </PageSection>
    );
};
