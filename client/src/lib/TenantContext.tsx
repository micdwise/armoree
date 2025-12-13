
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { switchClient } from './supabase';

interface TenantContextType {
    tenantId: string | null;
    setTenantId: (id: string | null) => void;
    supabase: SupabaseClient;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { readonly children: ReactNode }) {
    const [tenantId, setTenantId] = useState<string | null>(null);

    useEffect(() => {
        switchClient(tenantId);
    }, [tenantId]);

    const value = useMemo(() => ({ tenantId, setTenantId, supabase: {} as any }), [tenantId]);

    return (
        <TenantContext.Provider value={value}>
            <div key={tenantId || 'public'}>
                {children}
            </div>
        </TenantContext.Provider>
    );
}

export function useTenant() {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
}
