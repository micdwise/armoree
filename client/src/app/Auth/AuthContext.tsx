
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

import { useTenant } from "../../lib/TenantContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const { setTenantId } = useTenant();

    useEffect(() => {
        const initSession = async (session: Session | null) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                // Fetch tenant schema
                const { data, error } = await supabase
                    .from('user_tenants')
                    .select('schema_name')
                    .eq('user_id', session.user.id)
                    .single();

                if (data && !error) {
                    setTenantId(data.schema_name);
                } else {
                    console.error("Failed to fetch tenant for user", error);
                    // Fallback or handle error?
                }
            } else {
                setTenantId(null);
            }
            setLoading(false);
        };

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            initSession(session);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            initSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const value = React.useMemo(() => ({
        session,
        user,
        loading,
        signOut,
    }), [session, user, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
