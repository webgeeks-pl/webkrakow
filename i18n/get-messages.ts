import { notFound } from "next/navigation";
import { loadMessages, messagesConfig } from "./load-messages";

export async function getMessages(locale: string) {
    try {
        return await loadMessages(messagesConfig, locale);
    } catch {
        notFound();
    }
}
