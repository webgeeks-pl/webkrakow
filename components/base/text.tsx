import { applyHardSpaceBreaks } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ReactNode } from "react";
import Tag from "./tag";

const textCva = cva("", {
    variants: {
        intent: {
            h1: "text-4xl scroll-m-20 font-extrabold tracking-tight text-balance ",
            h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
            sectionHeader:
                "scroll-m-20 text-3xl sm:text-4xl  tracking-normal md:text-5xl ",
            pageHeader:
                "scroll-m-20 text-3xl sm:text-4xl font-medium tracking-normal md:text-6xl ",
            h3: "text-2xl scroll-m-20 font-medium tracking-tight",
            h4: "text-xl scroll-m-20 font-medium tracking-tight",
            p: "text-base",
            blockquote: "mt-6 rder-l-2 rder-clr-brand-red/20 pl-6 italic",
            lead: "text-lg sm:text-xl",
            large: "text-lg font-medium",
            small: "text-sm leading-5 font-medium",
            var: "font-monospace font-medium ",
        },

        color: {
            primary: "",
            opposite: "",
            // secondary: "text-clr-900",
        },

        spaced: {
            xs: "[&:not(:first-child)]:mt-size-xs",
            sm: "[&:not(:first-child)]:mt-size-sm",
            md: "[&:not(:first-child)]:mt-size-md",
            lg: "[&:not(:first-child)]:mt-size-lg",
            xl: "[&:not(:first-child)]:mt-size-xl",
            "2xl": "[&:not(:first-child)]:mt-size-2xl",
            "3xl": "[&:not(:first-child)]:mt-size-3xl",
            "4xl": "[&:not(:first-child)]:mt-size-4xl",
            "5xl": "[&:not(:first-child)]:mt-size-5xl",
            "6xl": "[&:not(:first-child)]:mt-size-6xl",
            none: "",
        },

        muted: {
            true: "",
            false: "",
        },
    },
    compoundVariants: [
        // Muted variants
        {
            color: "primary",
            muted: true,
            className: "text-secondary-foreground",
        },
        {
            color: "primary",
            muted: false,
            className: "text-foreground",
        },
        // {
        //     color: "secondary",
        //     muted: true,
        //     className: "text-clr-brand-rose-light",
        // },
        { color: "opposite", muted: true, className: "text-muted" },
        { color: "opposite", muted: false, className: "text-background" },

        // { intent: "lead", color: "opposite", className: "text-clr-bg-dark" },
        // {
        //     intent: "lead",
        //     color: "primary",
        //     className: "text-clr-brand-red-dark",
        // },
        // {
        //     intent: "lead",
        //     color: "secondary",
        //     className: "text-clr-brand-rose-light",
        // },
    ],
    defaultVariants: {
        intent: "p",
        color: "primary",
        spaced: "none",
    },
});
type TextIntent = NonNullable<VariantProps<typeof textCva>["intent"]>;

const defaultTags: Record<TextIntent, keyof HTMLElementTagNameMap> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    p: "p",
    blockquote: "blockquote",
    lead: "p",
    large: "p",
    small: "p",
    sectionHeader: "h2",
    pageHeader: "h1",
    var: "span",
};

interface BaseTextProps extends VariantProps<typeof textCva> {
    children?: ReactNode;
    className?: string;
    id?: string;
    as?: keyof HTMLElementTagNameMap;
    text?: ReactNode;
}

export type TextProps<E extends keyof HTMLElementTagNameMap> = BaseTextProps & {
    as?: E;
    shouldAddHardBreaks?: boolean;
} & React.ComponentPropsWithoutRef<E> &
    React.ComponentPropsWithoutRef<typeof Tag>;

export default function Text<E extends keyof HTMLElementTagNameMap = "p">({
    children,
    className,
    text,
    spaced,
    as,
    intent,
    color,
    shouldAddHardBreaks = true,
    muted = false,
    ...props
}: TextProps<E>) {
    const asTag = as ?? (intent && defaultTags[intent]) ?? "p";
    const output = text || children;

    const processedOutput =
        shouldAddHardBreaks && typeof output === "string"
            ? applyHardSpaceBreaks(output)
            : output;

    return (
        <Tag
            as={asTag}
            className={textCva({
                intent,
                color,
                muted,
                spaced,
                className,
            })}
            {...props}
        >
            {processedOutput}
        </Tag>
    );
}
