import { Easing } from "motion";
import { ReactNode } from "react";
import { InView } from "./in-view";

const variants = {
    blurIn: {
        hidden: {
            opacity: 0,
            scale: 0.95,
            filter: "blur(4px)",
            willChange: "transform, opacity",
        },
        visible: {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            willChange: "transform, opacity",
        },
    },
    zoomIn: {
        hidden: {
            opacity: 0,
            scale: 0.95,
            willChange: "transform, opacity",
        },
        visible: {
            opacity: 1,
            scale: 1,
            willChange: "transform, opacity",
        },
    },

    fromLeft: {
        hidden: {
            opacity: 0,
            x: -30,
            willChange: "transform, opacity",
        },
        visible: {
            opacity: 1,
            x: 0,
            willChange: "transform, opacity",
        },
    },

    fromRight: {
        hidden: {
            opacity: 0,
            x: 30,
            willChange: "transform, opacity",
        },
        visible: {
            opacity: 1,
            x: 0,
            willChange: "transform, opacity",
        },
    },

    fromTop: {
        hidden: {
            opacity: 0,
            y: -30,
            willChange: "transform, opacity",
        },
        visible: {
            opacity: 1,
            y: 0,
        },
    },

    fromBottom: {
        hidden: {
            opacity: 0,
            y: 35,
            willChange: "transform, opacity",
        },
        visible: {
            opacity: 1,
            y: 0,
            willChange: "transform, opacity",
        },
    },
};

export type AnimateConfigProps = {
    delay?: number;
    variant?: keyof typeof variants;
    animate?: boolean;
    duration?: number;
    ease?: Easing[] | Easing;
    once?: boolean;
    onceOnMount?: boolean;
    className?: string;
    viewOptions?: Parameters<typeof InView>[0]["viewOptions"];
    as?: keyof HTMLElementTagNameMap;
    id?: string;
};

interface AnimateProps extends AnimateConfigProps {
    children?: ReactNode;
    className?: string;
    id?: string;
    asChild?: boolean;
}

export default function Animate({
    children,
    delay = 0.1,
    className,
    duration = 0.3,
    variant = "fromBottom",
    ease = "linear",
    once = false,
    onceOnMount = true,
    viewOptions,
    as,
    id,
}: AnimateProps) {
    return (
        <>
            <InView
                as={as}
                transition={{ duration, ease, delay }}
                className={className}
                once={once}
                onceOnMount={onceOnMount}
                viewOptions={viewOptions}
                variants={variants[variant]}
                id={id}
            >
                {children}
            </InView>
        </>
    );
}
