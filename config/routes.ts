import type { MessagesMap } from "@/config/i18n";

export type RouteKey = keyof MessagesMap["common"]["navigation"]["routes"];

export interface Route {
    link: RouteKey;
}

export type Routes = Route[];
export type FooterRoutesKeys = "main" | "contact" | "legal";
export type FooterRoutes = Record<FooterRoutesKeys, Routes>;
export type NavigationRoutesKeys = "main" | "expandable" | "cta";
export type NavigationRoutes = Record<NavigationRoutesKeys, Routes>;

export const routes: Routes = [
    { link: "/" },
    { link: "/offer" },
    { link: "/templates" },
    { link: "/contact" },
];

const contact: Routes = [{ link: "/contact" }];

export const legalRoutes: Routes = [
    { link: "/privacy-policy" },
    { link: "/terms-of-service" },
];

export const navigationRoutes: NavigationRoutes = {
    main: routes,
    expandable: [],
    cta: [{ link: "/contact" }],
};

export const footerRoutes: FooterRoutes = {
    main: routes,
    contact: contact,
    legal: legalRoutes,
};
