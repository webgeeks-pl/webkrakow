import type { MessagesMap } from "@/config/i18n";
import { useTranslations } from "next-intl";

type NestedKeyOf<T> = T extends object
    ? {
          [K in keyof T]: T[K] extends object
              ? `${K & string}` | `${K & string}.${NestedKeyOf<T[K]>}`
              : `${K & string}`;
      }[keyof T]
    : never;

type GetNestedValue<T, K extends string> = K extends `${infer Head}.${infer Tail}`
    ? Head extends keyof T
        ? GetNestedValue<T[Head], Tail>
        : never
    : K extends keyof T
      ? T[K]
      : never;

/**
 * useTrans hook with proper typing
 * @param namespace The namespace path, e.g., "common", "pages.contact"
 */
export function useTrans<N extends NestedKeyOf<MessagesMap>>(namespace: N) {
    const baseT = useTranslations(namespace as Parameters<typeof useTranslations>[0]);

    // Map namespace to MessagesMap type
    type NamespaceMessages = N extends keyof MessagesMap
        ? MessagesMap[N]
        : N extends `pages.${infer PageName}`
          ? PageName extends keyof MessagesMap["pages"]
              ? MessagesMap["pages"][PageName & keyof MessagesMap["pages"]]
              : never
          : never;

    type Keys = NestedKeyOf<NamespaceMessages>;

    /**
     * t(key) returns string translation
     */
    function t(key: Keys): string {
        return baseT(key as string);
    }

    /**
     * t.raw(key) returns the typed raw value from MessagesMap
     */
    function obj<TKey extends Keys>(key: TKey): GetNestedValue<NamespaceMessages, TKey> {
        return baseT.raw(key as string);
    }

    // Build the return value with raw attached
    return Object.assign(t, { obj }) as typeof t & { obj: typeof obj };
}
