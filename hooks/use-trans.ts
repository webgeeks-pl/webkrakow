import type { MessagesMap } from "@/config/i18n";
import { useTranslations } from "next-intl";

export type NestedKeyOf<T> = T extends object
    ? {
          [K in keyof T]: T[K] extends object
              ? `${K & string}` | `${K & string}.${NestedKeyOf<T[K]>}`
              : `${K & string}`;
      }[keyof T]
    : never;
export type GetNestedValue<T, K extends string> = K extends `${infer Head}.${infer Tail}`
    ? Head extends keyof T
        ? GetNestedValue<T[Head], Tail>
        : never
    : K extends keyof T
      ? T[K]
      : never;

/**
 * The return type of `useTrans(namespace)` for a specific namespace `N`.
 * Example: `TransFor<"pages.contact.form">`.
 */
export type TransFor<N extends NestedKeyOf<MessagesMap>> = ((
    key: NestedKeyOf<GetNestedValue<MessagesMap, N>>
) => string) & {
    obj: <TKey extends NestedKeyOf<GetNestedValue<MessagesMap, N>>>(
        key: TKey
    ) => GetNestedValue<GetNestedValue<MessagesMap, N>, TKey>;
};

/**
 * useTrans hook with proper typing
 * @param namespace The namespace path, e.g., "common", "pages.contact"
 */
export function useTrans<N extends NestedKeyOf<MessagesMap>>(namespace: N) {
    const baseT = useTranslations(namespace as Parameters<typeof useTranslations>[0]);

    // Map namespace to MessagesMap type
    type NamespaceMessages = GetNestedValue<MessagesMap, N>;

    type Keys = NestedKeyOf<NamespaceMessages>;

    /**
     * t(key) returns string translation
     */
    function t(key: Keys): string {
        return baseT(key as Parameters<typeof baseT>[0]);
    }

    /**
     * t.raw(key) returns the typed raw value from MessagesMap
     */
    function obj<TKey extends Keys>(key: TKey): GetNestedValue<NamespaceMessages, TKey> {
        return baseT.raw(key as Parameters<typeof baseT>[0]);
    }

    // Build the return value with raw attached
    return Object.assign(t, { obj }) as typeof t & { obj: typeof obj };
}
