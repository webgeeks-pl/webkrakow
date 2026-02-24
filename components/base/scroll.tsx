"use client";

import { useIsCurrPath } from "@/hooks/use-path";
import { Link, redirect } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Tag, { TagProps } from "./tag";

type ScrollAsButton = {
    as?: "button" | undefined;
    href?: never;
} & ButtonHTMLAttributes<HTMLButtonElement> & { target?: string };

type ScrollAsLink = {
    as: "link";
    href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement> & { target?: string };

export type ScrollButtonProps = (ScrollAsButton | ScrollAsLink) & {
    children?: ReactNode;
    className?: string;
    text?: string;
    options?: ScrollIntoViewOptions;
    onRoute?: string;
    routeMatchMode?: "exact" | "pathname" | "full";
} & Partial<TagProps<any>>;

export default function Scroll({
    as = "button",
    options,
    href,
    target,
    children,
    className,
    onRoute,
    text,
    routeMatchMode = "pathname",
    ...props
}: ScrollButtonProps) {
    const locale = useLocale();
    const isSameRoute = useIsCurrPath(onRoute, { matchMode: routeMatchMode });
    const isLink = as === "link" && href;

    function onClick(e: MouseEvent) {
        if (!target) return;

        const element = document.querySelector(target);
        const scroll = () => element?.scrollIntoView(options ?? { behavior: "smooth" });

        if (onRoute) {
            if (isSameRoute) scroll();
        } else {
            scroll();
        }

        if (isLink) {
            redirect({ href, locale });
        }
    }

    if (isLink) {
        const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;
        return (
            <Link
                href={href}
                className={["scroll-smooth", className].filter(Boolean).join(" ")}
                onClick={(e) => {
                    onClick(e);
                    if (typeof anchorProps.onClick === "function")
                        anchorProps.onClick(e as any);
                }}
                {...anchorProps}
            >
                {children ?? text}
            </Link>
        );
    }

    const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
        <Tag
            as={(as as any) ?? "button"}
            className={className}
            onClick={onClick}
            {...(buttonProps as any)}
        >
            {children ?? text}
        </Tag>
    );
}
