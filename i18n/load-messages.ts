import { messagesDirStructure } from "../config/i18n";

export type MessageConfig = string | { [key: string]: MessageConfig };

export async function loadMessages(
    config: MessageConfig,
    locale: string
): Promise<Record<string, unknown>> {
    if (typeof config === "string") {
        try {
            return (await import(`../messages/${locale}/${config}`)).default;
        } catch {
            console.warn(`Message file not found: ../messages/${locale}/${config}`);
            return {};
        }
    }

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(config)) {
        result[key] = await loadMessages(value as MessageConfig, locale);
    }
    return result;
}

export { messagesDirStructure as messagesConfig };
