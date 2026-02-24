export function comparePaths(
    paths: string[],
    options?: { matchMode?: "exact" | "pathname" | "startswith" | "full" }
): boolean {
    if (paths.length === 0) return true;
    if (paths.length === 1) return true;

    const matchMode = options?.matchMode ?? "pathname";
    const firstPath = paths[0];

    return paths.every((path) => {
        if (matchMode === "exact") {
            return path === firstPath;
        } else if (matchMode === "full") {
            return path === firstPath;
        } else if (matchMode === "startswith") {
            // Check if all paths start with the first path
            return path.startsWith(firstPath);
        } else {
            // pathname mode - check if all paths share the same base
            if (path === "/" && firstPath === "/") return true;
            if (path === "/" || firstPath === "/") return false;
            return path.startsWith(firstPath) || firstPath.startsWith(path);
        }
    });
}
