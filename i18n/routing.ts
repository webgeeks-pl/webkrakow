import { defineRouting } from "next-intl/routing";
import { routingConfig } from "../config/i18n";

if (!routingConfig) {
    throw new Error(
        "Routing configuration not found. Please define 'routingConfig' in config/i18n.ts"
    );
}

export const routing = defineRouting(routingConfig);
