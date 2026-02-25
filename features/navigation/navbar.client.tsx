"use client";

import { navigationRoutes, NavigationRoutesKeys, Routes } from "@/config/routes";
import { useNavigation } from "@/context/navigation-context";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { NavLink } from "./navbar";

interface HeaderProps {
    children?: React.ReactNode | React.ReactNode[];
    className?: string;
}

interface NavbarNavigationItemsProps {
    routes?: Routes;
    type?: NavigationRoutesKeys;
    groupId?: string;
}

export function MobileDialog({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) {
    const { isNavOpen, setIsNavOpen } = useNavigation();
    return (
        <Dialog open={isNavOpen} onClose={setIsNavOpen} className={cn("", className)}>
            {children}
        </Dialog>
    );
}

export function NavbarMobileButton({
    children,
    type,
}: {
    children: React.ReactNode | React.ReactNode[];
    type: "open" | "close" | "toggle";
}) {
    const { closeNav, openNav, toggleNav } = useNavigation();
    return (
        <button
            onClick={type === "open" ? openNav : type === "close" ? closeNav : toggleNav}
            className="navbar:hidden z-navigation"
        >
            {children}
        </button>
    );
}

export function NavbarNavigationItems({
    routes,

    type = "main",
    groupId,
}: NavbarNavigationItemsProps) {
    const resolvedRoutes = routes ?? navigationRoutes[type];
    const pathname = usePathname();

    const checkIsActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    const checkIsExpandable = (href: string) => {
        return navigationRoutes.expandable.some((route) => route.link === href);
    };

    return (
        <>
            {resolvedRoutes.map((route) => {
                const status = checkIsActive(route.link);
                const isExpandable = checkIsExpandable(route.link);
                return (
                    <NavLink
                        route={route}
                        isActive={status}
                        data-id={route.link}
                        isExpandable={isExpandable}
                        groupId={groupId}
                        key={route.link}
                    />
                );
            })}
        </>
    );
}

export function Header({ className, children }: HeaderProps) {
    const { headerRef } = useNavigation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const SCROLL_THRESHOLD = 200;

        const checkScroll = () => {
            const scrollY = window.scrollY || window.pageYOffset;
            setIsScrolled(scrollY > SCROLL_THRESHOLD);
        };

        // Check initial scroll position
        checkScroll();

        // Listen for scroll events
        window.addEventListener("scroll", checkScroll, { passive: true });

        // Listen for resize events
        window.addEventListener("resize", checkScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        };
    }, []);

    return (
        <>
            <div id="navigation-top" className="h-0" />
            <header
                ref={headerRef}
                data-scrolled={isScrolled}
                className={cn("group z-navbar", className)}
            >
                {children}
            </header>
        </>
    );
}
