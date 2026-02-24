import { useEffect, useEffectEvent } from "react";

interface OnScrollCallbackParams {
    event: Event;
}

export default function useOnScroll(
    callback: (params: OnScrollCallbackParams) => void
) {
    const handleScroll = useEffectEvent((event: Event) => {
        callback({ event });
    });

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
}
