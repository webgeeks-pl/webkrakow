import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Text, { TextProps } from "../base/text";
import ScrollToHashOnLoad from "../ui/ScrollToHashOnLoad";
import Section, { SectionContent } from "./section";

export default function Page({
    children,
    className,
    id,
}: {
    children?: ReactNode;
    className?: string;
    id?: string;
}) {
    return (
        <div id={id} className={cn("overflow-x-hidden", className)}>
            <ScrollToHashOnLoad />
            {children}
        </div>
    );
}

type PageTextProps = TextProps<keyof HTMLElementTagNameMap> & {
    text?: React.ReactNode;
};

export function PageHeader({
    className,
    children,
}: {
    children?: ReactNode;
    className?: string;
}) {
    return (
        <Section as={"header"} className={cn("py-size-xl", className)}>
            {children}
        </Section>
    );
}

export function PageHeaderContent({
    className,
    children,
}: {
    children?: ReactNode;
    className?: string;
}) {
    return (
        <SectionContent className={cn("gap-size-xs text-center", className)}>
            {children}
        </SectionContent>
    );
}

export function PageTitle({
    className,
    children,
    text,
    as = "p",
    ...props
}: PageTextProps) {
    return (
        <Text
            intent="pageHeader"
            as={as}
            className={cn("font-heading text-3xl", className)}
            {...props}
        >
            {text ?? children}
        </Text>
    );
}

export function PageLead({
    className,
    children,
    text,
    as = "h1",
    ...props
}: PageTextProps) {
    return (
        <Text
            intent="lead"
            as={as}
            muted
            className={cn("max-w-2xl", className)}
            {...props}
        >
            {text ?? children}
        </Text>
    );
}
