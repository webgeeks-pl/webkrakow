import { BREAKPOINT_VALUES } from "@/lib/constants";
import type { ScreenBreakpoint } from "@/lib/types/breakpoints";
import { useEffect, useState } from "react";

function getBreakpoint(size: number): ScreenBreakpoint {
    for (const [breakpoint, value] of Object.entries(BREAKPOINT_VALUES).reverse()) {
        if (value <= size) return breakpoint as ScreenBreakpoint;
    }
    return "base";
}

export function useScreenSize(target?: Element) {
    const [breakpoint, setBreakpoint] = useState<ScreenBreakpoint>("base");

    const handleNewDimensions = (target: Element) => {
        const width =
            target === document.body
                ? window.innerWidth
                : target.getBoundingClientRect().width;
        const bp = getBreakpoint(width);
        setBreakpoint(bp);
    };

    useEffect(() => {
        const node = target ? target : document.body;
        const observer = new ResizeObserver(([entry]) => {
            handleNewDimensions(entry.target);
        });

        observer.observe(node);
        return () => observer.disconnect();
    }, [target]);

    return { breakpoint, breakpointValue: BREAKPOINT_VALUES[breakpoint] };
}
