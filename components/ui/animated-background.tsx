"use client";
import { cn } from "@/lib/utils/index";
import { AnimatePresence, Transition, motion } from "motion/react";
import {
    type ElementType,
    type ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

export type AnimatedBackgroundProps = {
    children: ReactNode;
    as?: ElementType;
    defaultValue?: string;
    onValueChange?: (newActiveId: string | null) => void;
    className?: string;
    containerClassName?: string;
    transition?: Transition;
    enableHover?: boolean;
};

export function AnimatedBackground({
    children,
    as: Component = "div",
    defaultValue,
    onValueChange,
    className,
    containerClassName,
    transition,
    enableHover = false,
}: AnimatedBackgroundProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const containerRef = useRef<HTMLElement>(null);

    const handleSetActiveId = useCallback(
        (id: string | null) => {
            setActiveId(id);
            onValueChange?.(id);
        },
        [onValueChange]
    );

    useEffect(() => {
        if (defaultValue !== undefined) {
            // eslint-disable-next-line
            setActiveId(defaultValue);
        }
    }, [defaultValue]);

    // Find the closest ancestor (or self) with data-id
    const findDataId = (target: EventTarget | null): string | null => {
        if (!(target instanceof HTMLElement)) return null;
        const el = target.closest<HTMLElement>("[data-id]");
        // Make sure the found element is inside our container
        if (el && containerRef.current?.contains(el)) {
            return el.getAttribute("data-id");
        }
        return null;
    };

    // Update data-checked attributes on children with data-id
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const items = container.querySelectorAll<HTMLElement>("[data-id]");
        items.forEach((item) => {
            const id = item.getAttribute("data-id");
            item.setAttribute("data-checked", id === activeId ? "true" : "false");
            item.style.position = "relative";
        });
    }, [activeId, children]);

    const interactionProps = enableHover
        ? {
              onMouseOver: (e: React.MouseEvent) => {
                  const id = findDataId(e.target);
                  if (id !== null) handleSetActiveId(id);
              },
              onMouseLeave: () => handleSetActiveId(null),
          }
        : {
              onClick: (e: React.MouseEvent) => {
                  const id = findDataId(e.target);
                  if (id !== null) handleSetActiveId(id);
              },
          };

    const getRect = useCallback(
        (id: string) => {
            const container = containerRef.current;
            if (!container) return null;
            const target = container.querySelector<HTMLElement>(
                `[data-id="${CSS.escape(id)}"]`
            );
            if (!target) return null;

            const containerRect = container.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();

            return {
                top: targetRect.top - containerRect.top,
                left: targetRect.left - containerRect.left,
                width: targetRect.width,
                height: targetRect.height,
            };
        },
        [containerRef]
    );

    return (
        <Component
            ref={containerRef}
            className={cn("relative isolate", containerClassName)}
            {...interactionProps}
        >
            {children}
            <AnimatePresence initial={false}>
                {activeId && (
                    <ActiveBackground
                        activeId={activeId}
                        className={className}
                        transition={transition}
                        getRect={getRect}
                    />
                )}
            </AnimatePresence>
        </Component>
    );
}

function ActiveBackground({
    activeId,
    className,
    transition,
    getRect,
}: {
    activeId: string;
    className?: string;
    transition?: Transition;
    getRect: (id: string) => {
        top: number;
        left: number;
        width: number;
        height: number;
    } | null;
}) {
    const rect = getRect(activeId);

    if (!rect) return null;

    return (
        <motion.div
            className={cn("absolute", className)}
            initial={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                opacity: 0,
            }}
            animate={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={transition}
        />
    );
}
