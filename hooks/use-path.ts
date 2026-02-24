import { usePathname } from "@/i18n/navigation";

export function useIsCurrPath(
    path: string | string[] | undefined,
    options?: { matchMode?: "exact" | "pathname" | "startswith" | "full" }
): boolean {
    const pathname = usePathname();
    if (!path) return false;
    const matchMode = options?.matchMode ?? "pathname";

    const checkPath = (pathToCheck: string): boolean => {
        if (matchMode === "exact") {
            return pathname === pathToCheck;
        } else if (matchMode === "full") {
            const fullUrl =
                typeof window !== "undefined"
                    ? window.location.pathname +
                      window.location.search +
                      window.location.hash
                    : pathname;
            return fullUrl === pathToCheck;
        } else if (matchMode === "startswith") {
            // Check if pathname starts with the target path
            return pathname.startsWith(pathToCheck);
        } else {
            // pathname mode (default) - check if pathname starts with path
            return pathToCheck === "/"
                ? pathname === "/"
                : pathname.startsWith(pathToCheck);
        }
    };

    if (Array.isArray(path)) {
        return path.some((p) => checkPath(p));
    }

    return checkPath(path);
}
