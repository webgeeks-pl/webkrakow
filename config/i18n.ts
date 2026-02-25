import common from "@/messages/pl/common.json";
import home from "@/messages/pl/pages/home.json";

export const messagesDirStructure = {
    common: "common.json",
    // "ts-satisfier": "ts-satisfier.json",
    pages: {
        home: "home.json",
    },
} as const;

export type MessagesMap = {
    common: typeof common;
    // "ts-satisfier": typeof tsSitisfier;
    pages: {
        home: typeof home;
    };
};

export const routingConfig = {
    locales: ["pl"],
    localePrefix: "as-needed",
    defaultLocale: "pl",
} as const;

declare module "next-intl" {
    interface AppConfig {
        // Automatically use the structure of your default messages
        Messages: MessagesMap;
    }
}
