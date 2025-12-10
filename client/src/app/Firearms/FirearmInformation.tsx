import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetFirearm } from "@app/Firearms/FirearmsData";
import { PageSection, Title } from "../../components/Layout";
import { Card, CardContent } from "../../components/Card";
import { Spinner } from "../../components/Spinner";
import { Button } from "../../components/Button";
import { ArrowLeft } from "lucide-react";

const getStatusColor = (status: string) => {
    if (status === "Active") return "bg-green-100 text-green-800";
    if (status === "Maintenance") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
};

export const FirearmInformation: React.FunctionComponent = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: firearm, isLoading, isError } = GetFirearm(id);

    if (isLoading) {
        return (
            <PageSection className="flex justify-center p-8">
                <Spinner size="lg" />
            </PageSection>
        );
    }

    if (isError || !firearm) {
        return (
            <PageSection className="p-8">
                <div className="text-center text-red-600">
                    <h2 className="text-xl font-bold">Error loading firearm</h2>
                    <p>The firearm could not be found or there was an error loading it.</p>
                    <Button
                        variant="link"
                        onClick={() => navigate("/Firearms")}
                        className="mt-4"
                    >
                        Back to Firearms
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
                    onClick={() => navigate("/Firearms")}
                    className="flex items-center gap-2 pl-0 text-gray-500 hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Firearms
                </Button>
            </div>

            <div className="mb-6">
                <Title>
                    {firearm.manufacturer} {firearm.model}
                </Title>
                <p className="text-subtext-color text-sm">
                    S/N: {firearm.serial_number}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardContent className="p-6">
                        <h3 className="mb-4 text-lg font-semibold text-default-font">
                            Details
                        </h3>
                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-subtext-color">Type</dt>
                                <dd className="mt-1 text-sm text-default-font">
                                    {firearm.type || "-"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-subtext-color">
                                    Caliber
                                </dt>
                                <dd className="mt-1 text-sm text-default-font">
                                    {firearm.caliber}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-subtext-color">
                                    Asset Tag
                                </dt>
                                <dd className="mt-1 text-sm text-default-font">
                                    {firearm.asset_tag || "-"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-subtext-color">
                                    Status
                                </dt>
                                <dd className="mt-1 text-sm text-default-font">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                                            firearm.current_status,
                                        )}`}
                                    >
                                        {firearm.current_status}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-subtext-color">
                                    Purchase Date
                                </dt>
                                <dd className="mt-1 text-sm text-default-font">
                                    {new Date(firearm.purchase_date).toLocaleDateString()}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                {/* Placeholder for future sections like Maintenance Log or Assignment History */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="mb-4 text-lg font-semibold text-default-font">
                            History
                        </h3>
                        <p className="text-sm text-subtext-color">
                            No history available yet.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </PageSection>
    );
};
