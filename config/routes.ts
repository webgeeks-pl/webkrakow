export interface Route {
    link: string;
}

export type Routes = Route[];
export type FooterRoutesKeys = "main" | "contact" | "legal";
export type FooterRoutes = Record<FooterRoutesKeys, Routes>;
export type NavigationRoutesKeys = "main" | "expandable" | "cta";
export type NavigationRoutes = Record<string, Routes>;

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
    cta: [],
};

export const footerRoutes: FooterRoutes = {
    main: routes,
    contact: contact,
    legal: legalRoutes,
};
