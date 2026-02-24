"use client";
/* eslint-disable react-compiler/react-compiler */
import useOnMount from "@/hooks/use-on-mount";
import { usePathname } from "@/i18n/navigation";
import { motion, Transition, useInView, UseInViewOptions, Variant } from "motion/react";

import { useAnimationContext } from "@/context/animation-context";
import { ReactNode, useEffect, useRef, useState } from "react";

export type InViewProps = {
    children: ReactNode;
    variants?: {
        hidden: Variant;
        visible: Variant;
    };
    transition?: Transition;
    viewOptions?: UseInViewOptions;
    as?: React.ElementType;
    once?: boolean;
    onceOnMount?: boolean;
    onLoad?: () => void;
    className?: string;
    id?: string;
};

const defaultVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

export function InView({
    children,
    variants = defaultVariants,
    transition,
    viewOptions,
    as = "div",
    className,
    onLoad,
    once = false,
    onceOnMount = true,
    id: providedId,
}: InViewProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, viewOptions);
    const animationContext = useAnimationContext();
    const pathname = usePathname();

    // Track if window has loaded
    const [windowLoaded, setWindowLoaded] = useState(
        () => typeof window !== "undefined" && document.readyState === "complete"
    );

    useEffect(() => {
        // If already loaded, nothing to do
        if (windowLoaded) return;

        // Listen for load event
        const handleLoad = () => setWindowLoaded(true);
        window.addEventListener("load", handleLoad);
        return () => window.removeEventListener("load", handleLoad);
    }, [windowLoaded]);

    // For global once to work properly, an ID must be provided
    const id = providedId;

    // Warn in development if once is true but no id provided
    useEffect(() => {
        if (process.env.NODE_ENV === "development" && once && !id) {
            console.warn(
                "InView: 'once' is enabled but no 'id' provided. " +
                    "Global animation tracking requires a unique 'id' prop. " +
                    "Without it, the animation will replay on every mount."
            );
        }
    }, [once, id]);

    const [hasStartedAnimation, setHasStartedAnimation] = useState(false);

    const [forceVisible, setForceVisible] = useState(false);
    useEffect(() => {
        if (!pathname) return;
        // eslint-disable-next-line
        setForceVisible(true);
        const t = window.setTimeout(() => setForceVisible(false), 700);
        return () => window.clearTimeout(t);
    }, [pathname]);

    // Mark as started when element enters view for the first time (onceOnMount)
    useEffect(() => {
        if (onceOnMount && isInView && !hasStartedAnimation) {
            // eslint-disable-next-line
            setHasStartedAnimation(true);
        }
    }, [isInView, onceOnMount, hasStartedAnimation]);

    // Handle global once with AnimationContext
    const hasAnimatedGlobally = once && id ? animationContext.hasAnimated(id) : false;

    useEffect(() => {
        if (once && id && isInView && !hasAnimatedGlobally) {
            animationContext.markAsAnimated(id);
        }
    }, [isInView, once, id, hasAnimatedGlobally, animationContext]);

    useOnMount(() => {
        onLoad?.();
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionComponent = motion[as as keyof typeof motion] as any;

    // Determine if should be visible - only start animation after window loads
    const shouldBeVisible =
        windowLoaded &&
        (isInView || hasStartedAnimation || forceVisible || hasAnimatedGlobally);

    // If animation already happened globally, start as visible to prevent re-animation
    const initialState = hasAnimatedGlobally ? "visible" : "hidden";

    return (
        <MotionComponent
            className={className}
            ref={ref}
            initial={initialState}
            animate={shouldBeVisible ? "visible" : "hidden"}
            variants={variants}
            transition={transition}
        >
            {children}
        </MotionComponent>
    );
}
// "use client";

// import { usePathname } from "@/i18n/navigation";
// import {
//     motion,
//     Transition,
//     useInView,
//     UseInViewOptions,
//     Variant,
// } from "motion/react";
// import type { ComponentType, ElementType } from "react";
// import { ReactElement, useEffect, useRef, useState } from "react";

// export type InViewProps = {
//     children: ReactElement<any>;
//     variants?: {
//         hidden: Variant;
//         visible: Variant;
//     };
//     transition?: Transition;
//     viewOptions?: UseInViewOptions;
//     once?: boolean;
// };

// const defaultVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1 },
// };
// const motionCache = new Map<ElementType, ComponentType<any>>();

// function getMotionComponent(type: ElementType) {
//     if (!motionCache.has(type)) {
//         motionCache.set(type, motion(type));
//     }
//     return motionCache.get(type)!;
// }

// export function InView({
//     children,
//     variants = defaultVariants,
//     transition,
//     viewOptions,
//     once = true,
// }: InViewProps) {
//     const ref = useRef<HTMLElement | null>(null);
//     const isInView = useInView(ref, viewOptions);

//     const [hasStartedAnimation, setHasStartedAnimation] = useState(false);
//     const [forceVisible, setForceVisible] = useState(false);

//     const pathname = usePathname();

//     useEffect(() => {
//         // eslint-disable-next-line
//         setForceVisible(true);
//         const t = setTimeout(() => setForceVisible(false), 700);
//         return () => clearTimeout(t);
//     }, [pathname]);

//     useEffect(() => {
//         if (once && isInView && !hasStartedAnimation) {
//             // eslint-disable-next-line
//             setHasStartedAnimation(true);
//         }
//     }, [isInView, once, hasStartedAnimation]);
//     const MotionChild = getMotionComponent(children.type as ElementType);

//     return (
//         // eslint-disable-next-line react-hooks/static-components
//         <MotionChild
//             {...children.props}
//             ref={ref}
//             initial="hidden"
//             animate={
//                 isInView || hasStartedAnimation || forceVisible
//                     ? "visible"
//                     : "hidden"
//             }
//             variants={variants}
//             transition={transition}
//         />
//     );
// }
