import { useNavigation } from "@/context/navigation-context";
import { useRef } from "react";
import useOnMount from "./use-on-mount";
import useOnResize from "./use-on-resize";

export function useOnNavHeightChange(
    callback: (height: number, isNavOpen: boolean) => void
) {
    const prevHeightRef = useRef(0);
    const { isNavOpen, headerRef } = useNavigation();
    const checkNavHeight = () => {
        if (!headerRef.current) return;
        const navHeight = headerRef.current.getBoundingClientRect().height;
        if (prevHeightRef.current === navHeight) return;
        prevHeightRef.current = navHeight;
        callback(navHeight, isNavOpen);
    };

    useOnMount(checkNavHeight);
    useOnResize(checkNavHeight, headerRef);
}
