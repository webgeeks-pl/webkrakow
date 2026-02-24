import { MotionValue, motionValue } from "motion";
import { useEffect, useRef } from "react";

export function useThrottledMotionValue(source: MotionValue<number>, fps = 30) {
    const throttled = motionValue(source.get());
    const lastRef = useRef(0);

    useEffect(() => {
        const unsub = source.on("change", (v: number) => {
            const now = performance.now();
            if (now - lastRef.current > 1000 / fps) {
                lastRef.current = now;
                throttled.set(v);
            }
        });
        return () => unsub();
    }, [source, fps, throttled]);

    return throttled;
}
