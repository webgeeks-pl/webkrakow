import Tag from "@/components/base/tag";
import { cn } from "@/lib/utils";
import { ElementType, ReactNode } from "react";
import Text, { TextProps } from "../base/text";

interface SectionProps {
    children?: ReactNode;
    className?: string;
    id?: string;
    shouldRender?: boolean;
    as?: ElementType;
    asChild?: boolean;
    section?: boolean;
}

type SectionTextProps = TextProps<keyof HTMLElementTagNameMap> & {
    text?: React.ReactNode;
};

export default function Section({
    children,
    className,
    id,
    shouldRender = true,
    as,
    ...props
}: SectionProps) {
    if (!shouldRender) {
        return null;
    }

    return (
        <Tag
            id={id}
            as={as ?? "section"}
            className={cn("flex w-full flex-col items-center", className)}
            {...props}
        >
            {children}
        </Tag>
    );
}

export function SectionContent({
    children,
    className,
    ...props
}: {
    children?: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "xs:container max-w-size-content content-padding flex w-full flex-col items-center",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

interface SectionHeaderProps {
    children?: ReactNode;
    className?: string;
}

export function SectionHeader({ className, children }: SectionHeaderProps) {
    return <div className={cn("w-full", className)}>{children}</div>;
}

export function SectionHeaderContent({
    children,
    className,
}: {
    children?: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "flex-start mx-auto flex max-w-4xl flex-col gap-4 sm:gap-6 sm:text-center",
                className
            )}
        >
            {children}
        </div>
    );
}

export function SectionTitle({
    text,
    children,
    className,
    color = "primary",
    as = "p",
}: SectionTextProps) {
    return (
        <Text as={as} color={color} intent="sectionHeader" className={cn("", className)}>
            {text ?? children}
        </Text>
    );
}

export function SectionLead({
    text,
    children,
    className,
    muted = true,
    color = "primary",
    as = "h1",
}: SectionTextProps) {
    return (
        <Text as={as} color={color} muted={muted} intent="lead" className={className}>
            {text ?? children}
        </Text>
    );
}
