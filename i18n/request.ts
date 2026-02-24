import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { loadMessages, messagesConfig } from "./load-messages";
import { routing } from "./routing";

if (!messagesConfig) {
    throw new Error(
        "Messages configuration not found. Please define 'messagesConfig' in config/i18n.ts"
    );
}

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    return {
        locale,
        messages: await loadMessages(messagesConfig, locale),
    };
});
