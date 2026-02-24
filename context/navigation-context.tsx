"use client";

import {
    createContext,
    RefObject,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from "react";

interface Props {
    children: React.ReactNode;
}

interface Context {
    isNavOpen: boolean;
    openNav: () => void;
    closeNav: () => void;
    toggleNav: () => void;
    setIsNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
    headerRef: RefObject<HTMLDivElement | null>;
}

export const NavigationContext = createContext<Context>({
    isNavOpen: false,
    openNav: () => {},
    closeNav: () => {},
    toggleNav: () => {},
    setIsNavOpen: () => {},
    headerRef: { current: null },
});

export default function NavigationProvider({ children }: Props) {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const openNav = useCallback(() => setIsNavOpen(true), []);
    const closeNav = useCallback(() => setIsNavOpen(false), []);
    const toggleNav = useCallback(() => setIsNavOpen((x) => !x), []);

    // useEffect(() => {
    //     document.addEventListener("scroll", () => (scrollRef.current = window.scrollY));
    // }, []);

    // useEffect(() => {
    //     if (isNavOpen) {
    //         const scrollY = window.scrollY;
    //         document.body.style.position = "fixed";
    //         document.body.style.top = `-${scrollY}px`;
    //         document.body.style.width = "100%";
    //     } else {
    //         const scrollY = document.body.style.top;
    //         document.body.style.position = "";
    //         document.body.style.top = "";
    //         window.scrollTo(0, parseInt(scrollY || "0") * -1);
    //     }
    // }, [isNavOpen]);

    const value = useMemo(() => {
        return {
            isNavOpen,
            openNav,
            setIsNavOpen,
            closeNav,
            toggleNav,
            headerRef,
        };
    }, [isNavOpen, openNav, closeNav, setIsNavOpen, toggleNav, headerRef]);

    return <NavigationContext value={value}>{children}</NavigationContext>;
}

export function useNavigation() {
    const ctx = useContext(NavigationContext);
    if (!ctx) throw new Error("useNavigation must be used within NavigationProvider");
    return ctx;
}
