import React from "react";
import Animate, { AnimateConfigProps } from "./animate";

type BaseAnimateProps = React.ComponentProps<typeof Animate>;

interface AnimateManyProps
    extends Omit<BaseAnimateProps, "children" | "delay">, AnimateConfigProps {
    children: React.ReactNode | React.ReactNode[];
    delay?: number; // base delay
    delayBetween?: number; // additional delay per item
    itemDuration?: number; // duration per item
    itemClassName?: string; // className for each animated item
    asChildren?: boolean; // whether to use asChild for each item
}

export default function AnimateMany({
    children,
    delay = 0,
    delayBetween = 0,
    duration = 0.3,
    itemDuration,
    itemClassName,
    asChildren,
    ...props // other props like duration, ease, once,
}: AnimateManyProps) {
    const items = React.Children.toArray(children);

    return (
        <>
            {items.map((child, i) => {
                const targetDuration = itemDuration ?? duration / items.length;
                const itemDelay = delay + i * delayBetween + i * targetDuration;
                const key: React.Key =
                    React.isValidElement(child) && child.key != null ? child.key : i;

                return (
                    <Animate
                        key={key}
                        delay={itemDelay}
                        duration={itemDuration}
                        className={itemClassName}
                        asChild={asChildren}
                        {...props}
                    >
                        {child}
                    </Animate>
                );
            })}
        </>
    );
}
