"use client";

import { navigationRoutes, NavigationRoutesKeys, Route, Routes } from "@/config/routes";
import { useNavigation } from "@/context/navigation-context";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Scroll from "../base/scroll";
import { Button } from "../ui/button";
import { SectionContent } from "./section";

interface HeaderProps {
    children?: React.ReactNode | React.ReactNode[];
    className?: string;
}

interface HeaderContentProps {
    children?: React.ReactNode | React.ReactNode[];
    className?: string;
}

export default function Navbar() {
    return (
        <Header className="sticky top-0 w-full">
            <HeaderContent className="mx-auto justify-between">
                <NavbarLogoContainer className="py-1">
                    <span>Logo</span>
                </NavbarLogoContainer>
                <nav className={cn("nav-bp:flex hidden")}>
                    {/* <AnimatedBackground
                        as={"ul"}
                        containerClassName="flex"
                        className="-z-10 list-none rounded-sm bg-zinc-700"
                        transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.3,
                        }}
                        enableHover
                    > */}
                    <ul className="flex list-none">
                        <NavbarNavigationItems
                            type="main"
                            render={(route, isActive, isExpandable) => {
                                return (
                                    <li key={route.link} data-id={route.link}>
                                        <NavLink route={route} />
                                    </li>
                                );
                            }}
                        />
                    </ul>
                    {/* </AnimatedBackground> */}
                </nav>
                <div className="flex items-center gap-2">
                    <NavbarNavigationItems
                        type="cta"
                        render={(route, isActive, isExpandable) => {
                            return <NavLink key={route.link} route={route} />;
                        }}
                    />
                    <Button asChild variant="ghost" size="icon">
                        <NavbarMobileButton type="open">
                            <span className="sr-only">open</span>
                            <Menu aria-hidden="true" className="size-5" />
                        </NavbarMobileButton>
                    </Button>
                </div>
            </HeaderContent>

            {/* Mobile */}
            <MobileNav />
        </Header>
    );
}

function MobileNav() {
    const { isNavOpen, setIsNavOpen } = useNavigation();

    return (
        <Dialog open={isNavOpen} onClose={setIsNavOpen} className={cn("")}>
            <DialogPanel
                className={cn(
                    "fixed inset-y-0 right-0 z-5000 w-full overflow-y-auto bg-white/90 p-2 backdrop-blur-md sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
                )}
            >
                <Button asChild variant="ghost" size="icon">
                    <NavbarMobileButton type="close">
                        <span className="sr-only">close</span>
                        <X aria-hidden="true" className="text-clr-brand-red size-6" />
                    </NavbarMobileButton>
                </Button>
                <NavbarNavigationItems
                    type="main"
                    render={(route, isActive, isExpandable) => {
                        return (
                            <li key={route.link}>
                                <NavLink key={route.link} route={route} />
                            </li>
                        );
                    }}
                />
                <NavbarNavigationItems
                    type="cta"
                    render={(route, isActive, isExpandable) => {
                        return <NavLink key={route.link} route={route} />;
                    }}
                />
            </DialogPanel>
        </Dialog>
    );
}

export function Header({ className, children }: HeaderProps) {
    const { headerRef } = useNavigation();

    return (
        <>
            <div id="navigation-top" className="h-0" />
            <header ref={headerRef} className={cn("", className)}>
                {children}
            </header>
        </>
    );
}

export function HeaderContent({ children, className }: HeaderContentProps) {
    return (
        <SectionContent className={cn("max-w-size-content! flex-row", className)}>
            {children}
        </SectionContent>
    );
}

export function NavbarLogoContainer({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <Scroll
            as={"link"}
            href="/"
            onRoute="/"
            options={{ behavior: "smooth", block: "start" }}
            className={cn("flex items-center justify-center", className)}
        >
            {children}
        </Scroll>
    );
}

interface NavbarNavigationItemsProps {
    routes?: Routes;
    render?: (route: Route, isActive: boolean, isExpandable?: boolean) => React.ReactNode;
    type?: NavigationRoutesKeys;
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
            className="nav-bp:hidden z-navigation"
        >
            {children}
        </button>
    );
}

export function NavbarNavigationItems({
    routes,
    render,
    type = "main",
}: NavbarNavigationItemsProps) {
    const resolvedRoutes = routes ?? navigationRoutes[type];
    const pathname = usePathname();

    const checkIsActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <>
            {resolvedRoutes.map((route) => {
                return render ? render(route, checkIsActive(route.link), false) : <></>;
            })}
        </>
    );
}

function NavLink({ route, className }: { route: Route; className?: string }) {
    return (
        <Button key={route.link} variant="navLink" asChild className={className}>
            <Link href={route.link}>{route.link}</Link>
        </Button>
    );
}
