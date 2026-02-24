import { useEffect, useEffectEvent } from "react";

export default function useOnMount(callback: () => void) {
    const onMount = useEffectEvent(callback);

    useEffect(() => {
        onMount();
    }, []);
}
