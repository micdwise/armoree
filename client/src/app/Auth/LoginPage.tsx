import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Card, CardContent } from "@components/Card";
import { useAuth } from "./AuthContext";

export const LoginPage: React.FunctionComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Auth state listener in AuthContext will handle redirect via useEffect above
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-screen-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-default-font">
            Sign in to your account
          </h2>
        </div>
        <Card>
          <CardContent className="p-8">
            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="rounded-md bg-bg-error p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-text-error">
                        Login failed
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
                    autoComplete="current-password"
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
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
