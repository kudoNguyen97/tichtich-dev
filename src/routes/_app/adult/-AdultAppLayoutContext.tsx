import { createContext, useContext } from 'react';

export type AdultAppLayoutContextValue = {
    openAccountSheet: () => void;
};

export const AdultAppLayoutContext =
    createContext<AdultAppLayoutContextValue | null>(null);

export function useAdultAppLayoutContext(): AdultAppLayoutContextValue {
    const ctx = useContext(AdultAppLayoutContext);
    if (!ctx) {
        throw new Error(
            'useAdultAppLayoutContext must be used within AdultAppLayout'
        );
    }
    return ctx;
}
