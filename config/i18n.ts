import common from "@/messages/pl/common.json";

export const messagesDirStructure = {
    common: "common.json",
} as const;

export type MessagesMap = {
    common: typeof common;
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
