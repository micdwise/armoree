
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Card, CardContent } from "@components/Card";

export const SignUpPage: React.FunctionComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tenantName, setTenantName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Sign Up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("No user created");

            // 2. Register Tenant via Backend
            const response = await fetch("http://localhost:3001/api/register-tenant", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tenantName,
                    userId: authData.user.id,
                    email,
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Failed to register tenant");
            }

            // 3. Redirect to login (or dashboard if auto-login works)
            navigate("/login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-screen-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-default-font">
                        Create an account
                    </h2>
                </div>
                <Card>
                    <CardContent className="p-8">
                        <form className="space-y-6" onSubmit={handleSignUp}>
                            {error && (
                                <div className="rounded-md bg-bg-error p-4">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-text-error">
                                                Sign up failed
                                            </h3>
                                            <div className="mt-2 text-sm text-text-error">
                                                <p>{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div>
                                <label
                                    htmlFor="tenantName"
                                    className="block text-sm font-medium text-default-font"
                                >
                                    Organization Name
                                </label>
                                <div className="mt-1">
                                    <Input
                                        id="tenantName"
                                        name="tenantName"
                                        type="text"
                                        required
                                        value={tenantName}
                                        onChange={(e) => setTenantName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-default-font"
                                >
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-default-font"
                                >
                                    Password
                                </label>
                                <div className="mt-1">
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    className="w-full flex justify-center"
                                    variant="primary"
                                    disabled={loading}
                                >
                                    {loading ? "Creating account..." : "Sign up"}
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Already have an account? Sign in
                                </a>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
