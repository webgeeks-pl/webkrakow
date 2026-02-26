import { Route } from "@/config/routes";
import { useTrans } from "@/hooks/use-trans";
import { cn } from "@/lib/utils/cn";
import { DialogPanel } from "@headlessui/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import NeonText from "../../components/base/neon-text";
import ScrollButton from "../../components/base/scroll-button";
import { Button } from "../../components/ui/button";
import {
    Header,
    MobileDialog,
    NavbarMobileButton,
    NavbarNavigationItems,
} from "./navbar.client";

interface HeaderContentProps {
    children?: React.ReactNode | React.ReactNode[];
    className?: string;
}

export default function Navbar() {
    return (
        <Header
            className={cn(
                "sticky top-0 mx-auto w-full",
                "data-[scrolled=true]:bg-background/70 data-[scrolled=false]:bg-background/0 z-10 py-2 transition-all duration-500 data-[scrolled=false]:translate-y-8 data-[scrolled=false]:rounded-full data-[scrolled=true]:w-full data-[scrolled=true]:backdrop-blur-md"
            )}
        >
            <HeaderContent
                className={cn(
                    "xs:container content-padding mx-auto flex h-full flex-row items-center justify-between gap-10 transition-all duration-500 group-data-[scrolled=false]:w-fit group-data-[scrolled=true]:w-full"
                )}
            >
                <NavbarLogoContainer className="py-1">
                    <NeonText text="WebKraków" font="logo" className="text-2xl" />
                </NavbarLogoContainer>
                <nav className={cn("navbar:flex hidden")}>
                    <ul className="flex list-none">
                        <NavbarNavigationItems type="main" groupId="desktop-main" />
                    </ul>
                </nav>
                <div className="flex items-center gap-2">
                    <NavbarNavigationItems type="cta" groupId="desktop-cta" />
                    <div className="navbar:hidden">
                        <Button asChild variant="ghost" size="icon">
                            <NavbarMobileButton type="open">
                                <span className="sr-only">open</span>
                                <Menu aria-hidden="true" className="size-5" />
                            </NavbarMobileButton>
                        </Button>
                    </div>
                </div>
            </HeaderContent>

            {/* Mobile */}
            <MobileNav />
        </Header>
    );
}

function MobileNav() {
    return (
        <MobileDialog>
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
                <NavbarNavigationItems type="main" groupId="mobile-main" />
                <NavbarNavigationItems type="cta" groupId="mobile-cta" />
            </DialogPanel>
        </MobileDialog>
    );
}

export function NavLink({
    route,
    className,
    groupId,
    isActive,
    isExpandable,
}: {
    route: Route;
    className?: string;
    groupId?: string;
    isActive?: boolean;
    isExpandable?: boolean;
}) {
    const t = useTrans("common.navigation.routes");
    const tCta = useTrans("common.navigation.cta");
    const objCta = useTrans("common.navigation").obj("cta");
    const isCta = groupId === "desktop-cta" || groupId === "mobile-cta";
    const ctaTransExist = route.link in objCta;

    return (
        <Button
            variant={groupId === "desktop-cta" ? "neon" : "navLink"}
            asChild
            size={"marketing"}
            className="font-heading uppercase"
        >
            <Link href={route.link}>
                {isCta && ctaTransExist
                    ? tCta(route.link as Parameters<typeof tCta>[0])
                    : t(route.link)}
            </Link>
        </Button>
    );
}

export function HeaderContent({ children, className }: HeaderContentProps) {
    return <div className={cn("", className)}>{children}</div>;
}

export function NavbarLogoContainer({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <ScrollButton
            as={"link"}
            href="/"
            onRoute="/"
            options={{ behavior: "smooth", block: "start" }}
            className={cn("flex items-center justify-center", className)}
        >
            {children}
        </ScrollButton>
    );
}
