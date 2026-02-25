import Text from "@/components/base/text";
import { Button } from "@/components/ui/button";
import { footerRoutes, FooterRoutesKeys, Route, Routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import Section, { SectionContent } from "../../components/layout/section";

interface FooterLinkProps {
    route: Route;
}

interface FooterContainerProps {
    children?: React.ReactNode;
    className?: string;
}

interface FooterContentProps {
    children?: React.ReactNode;
    className?: string;
}

interface FooterNavigation {
    children?: React.ReactNode;
    className?: string;
    render?: (route: Route) => React.ReactNode;
    routes?: Routes;
    type: FooterRoutesKeys;
}

interface FooterSocialProps {
    link: string;
    className?: string;
    size?: number;
}

export default function Footer() {
    const renderFooterLink = useCallback(
        (route: Route) => <FooterLink route={route} key={route.link} />,
        []
    );

    return (
        <FooterContainer>
            <FooterContent
                className={cn(
                    "py-size-xl grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5",
                    "md:flex-row"
                )}
            >
                <div className="relative z-10 flex flex-col gap-2 sm:col-span-2 md:col-span-3 xl:col-span-2">
                    {/* {Logo && (
                        <ScrollButton target="#navigation-top" onRoute="/" className="w-fit">
                            <Link href="/">{Logo}</Link>
                        </ScrollButton>
                    )} */}
                    <div className="flex flex-col"></div>
                    <div className="flex w-fit">
                        <FooterSocial link="https://github.com/webgeeks-pl" />
                        <FooterSocial link="https://www.linkedin.com/company/webgeeks" />
                        <FooterSocial link="https://facebook.com/webgeeks" />
                        <FooterSocial link="https://twitter.com/webgeeks" />
                    </div>
                </div>

                <div className={cn("flex w-fit flex-col gap-3")}>
                    <FooterNavigation type="main" render={renderFooterLink} />
                </div>
                <div className={cn("flex w-fit flex-col gap-3")}>
                    <FooterNavigation type="contact" render={renderFooterLink} />
                </div>
                <div className={cn("flex w-fit flex-col gap-3")}>
                    <FooterNavigation type="legal" render={renderFooterLink} />
                </div>
            </FooterContent>
            {/* <Separator decorative /> */}
            <FooterFooter className={cn("py-size-sm flex flex-col items-start gap-4")}>
                <Text className="text-clr-text-extra-muted" size="small">
                    Copyright
                </Text>
            </FooterFooter>
        </FooterContainer>
    );
}

function FooterLink({ route }: FooterLinkProps) {
    return (
        <Button variant="link" asChild className="w-fit">
            <Link href={route.link}>link z messages</Link>
        </Button>
    );
}

function FooterContainer({ children, className }: FooterContainerProps) {
    return (
        <Section as="footer" className={cn("", className)}>
            {children}
        </Section>
    );
}

function FooterContent({ children, className }: FooterContentProps) {
    return <SectionContent className={cn(className)}>{children}</SectionContent>;
}

function FooterFooter({ children, className }: FooterContentProps) {
    return <SectionContent className={cn(className)}>{children}</SectionContent>;
}

function FooterNavigation({ className, render, routes, type }: FooterNavigation) {
    let resolvedRoutes: Routes = [];
    if (type) {
        resolvedRoutes = footerRoutes[type];
    }
    if (routes) {
        resolvedRoutes = routes;
    }

    return (
        <ul className={cn("flex flex-col gap-2", className)}>
            {resolvedRoutes.map((route) => {
                return render ? render(route) : <></>;
            })}
        </ul>
    );
}

function FooterSocial({ link, size, className }: FooterSocialProps) {
    const brand = getBrandFromUrl(link);

    return (
        <a
            href={link}
            target="_blank"
            className={cn(
                "hover:text-brand flex h-full w-full items-center px-1 transition-all duration-200",
                className
            )}
        >
            <div
                style={{
                    WebkitMaskImage: `url(https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@13.21.0/icons/${brand}.svg)`,
                    maskImage: `url(https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@13.21.0/icons/${brand}.svg)`,
                    background: "currentcolor",
                    backgroundSize: "cover",
                    width: size ?? 20,
                    height: size ?? 20,
                }}
            />
        </a>
    );
}

function getBrandFromUrl(url: string) {
    try {
        const { hostname } = new URL(url);
        return hostname.replace("www.", "").split(".")[0];
    } catch (e) {
        return "wordpress";
    }
}
