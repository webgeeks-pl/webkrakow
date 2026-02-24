import { RefObject, useEffect, useEffectEvent } from "react";

export default function useOnResize(
    callback: (event: ResizeObserverEntry[]) => void,
    ref?: RefObject<HTMLDivElement | null>
) {
    const onResize = useEffectEvent((event: ResizeObserverEntry[]) => {
        callback(event);
    });

    useEffect(() => {
        const node = ref ? ref.current : window.document.body;
        if (!node) return;
        const resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(node);
        return () => resizeObserver.disconnect();
    }, [ref]);
}
