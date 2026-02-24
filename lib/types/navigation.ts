export interface NavigationRoutesEntry {
    link: string;
    name: string;
    exact?: boolean;
    cta?: boolean;
}

export type NavigationRoutes = NavigationRoutesEntry[];
