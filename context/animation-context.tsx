"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useRef } from "react";

type AnimationContextType = {
    hasAnimated: (id: string) => boolean;
    markAsAnimated: (id: string) => void;
};

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({ children }: { children?: ReactNode }) {
    const animatedIds = useRef<Set<string>>(new Set());

    const hasAnimated = useCallback((id: string) => {
        return animatedIds.current.has(id);
    }, []);

    const markAsAnimated = useCallback((id: string) => {
        animatedIds.current.add(id);
    }, []);

    const value = useMemo(
        () => ({ hasAnimated, markAsAnimated }),
        [hasAnimated, markAsAnimated]
    );

    return (
        <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>
    );
}

export function useAnimationContext() {
    const context = useContext(AnimationContext);
    if (context === undefined) {
        throw new Error("useAnimationContext must be used within AnimationProvider");
    }
    return context;
}
