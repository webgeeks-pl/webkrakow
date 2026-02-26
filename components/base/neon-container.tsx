"use client";

import { cn } from "@/lib/utils/cn";
import { animate } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

// ─── Props ───────────────────────────────────────────────────────────────────

interface NeonContainerProps {
    children: React.ReactNode;
    /** Wrapper element. @default "div" */
    as?: "div" | "section" | "article" | "aside" | "span";
    className?: string;

    // ── Glow ──────────────────────────────────────────────────────────────────

    /**
     * Neon tube color. Any CSS color.
     * @default "oklch(0.70 0.12 183)"
     */
    glowColor?: string;
    /**
     * Glow spread multiplier.
     * `0` = no glow · `0.5` = subtle · `1` = normal · `2` = blown-out
     * @default 0.6
     */
    glowSpread?: number;
    /**
     * Border width in px.
     * @default 1
     */
    borderWidth?: number;
    /**
     * Border radius. Any CSS value (px, rem, %, etc.).
     * Alternatively use Tailwind `rounded-*` via `className`.
     * @default undefined
     */
    borderRadius?: string | number;

    // ── Flicker (voltage sag on the border tube) ──────────────────────────────

    /**
     * Enable border flicker — simulates a bad tube connection.
     * @default true
     */
    flicker?: boolean;
    /**
     * Random wait range **in seconds** before a flicker fires again.
     * @default [6, 18]
     */
    flickerInterval?: [number, number];
    /**
     * How long the stutter animation lasts (seconds).
     * @default 0.8
     */
    flickerSpeed?: number;
    /**
     * Depth of the voltage dip during flicker.
     * `0` = barely noticeable · `1` = full stutter · `2` = nearly dies
     * @default 0.7
     */
    flickerDepth?: number;

    // ── Breathe (global voltage surge) ────────────────────────────────────────

    /**
     * Border gently breathes brighter, like a transformer surge.
     * @default false
     */
    breathe?: boolean;
    /**
     * Random wait range **in seconds** between breathe surges.
     * @default [10, 22]
     */
    breatheInterval?: [number, number];
    /**
     * How much brighter the surge gets.
     * @default 0.35
     */
    breatheStrength?: number;
    /**
     * Duration of the breathe animation (seconds).
     * @default 1.4
     */
    breatheSpeed?: number;
    /**
     * How much the border dims during each breathe (voltage dip before surge).
     * @default 0
     */
    breatheDeep?: number;
    /**
     * How many breathe pulses per series. `[min, max]`.
     * @default [1, 1]
     */
    breatheCount?: [number, number];
    /**
     * Time gap **in seconds** between breathes inside a series. `[min, max]`.
     * @default [1.5, 3]
     */
    breatheGroupGap?: [number, number];

    // ── Trigger mode ──────────────────────────────────────────────────────────

    /**
     * Controls when the neon border is lit.
     * - `"auto"`: always on
     * - `"hover"`: starts off, ignites on hover of nearest
     *   `[data-slot="card"]` ancestor (or own wrapper)
     * @default "auto"
     */
    trigger?: "auto" | "hover";
    /**
     * Border color when the neon is off (trigger="hover" only).
     * @default "oklch(0.25 0.02 183)"
     */
    offColor?: string;
    /**
     * Speed multiplier for the ignition animation.
     * @default 1
     */
    ignitionSpeed?: number;
    /**
     * Speed multiplier for the shutdown animation.
     * @default 1
     */
    shutdownSpeed?: number;
    /**
     * CSS selector for the hover trigger element (found via `closest()`).
     * If not set, defaults to `[data-slot="card"]`, then falls back to own wrapper.
     * Examples: `"#my-card"`, `".card-wrapper"`, `"[data-neon-trigger=hero]"`
     * @default undefined
     */
    triggerSelector?: string;
}

// ─── Glow helpers ────────────────────────────────────────────────────────────

function r(n: number) {
    return Math.round(Math.max(0, n));
}

/**
 * Build a multi-layer box-shadow that mimics a neon tube halo around a border.
 * Uses both inset + outset layers for realistic glow on both sides.
 */
function borderGlow(
    color: string,
    spread: number,
    intensity = 1
): string {
    const s = spread * intensity;
    const layers = [
        // Outset glow
        `0 0 ${r(2 * s)}px ${color}`,
        `0 0 ${r(8 * s)}px ${color}`,
        `0 0 ${r(20 * s)}px ${color}`,
        `0 0 ${r(40 * s)}px ${color}`,
        // Inset glow
        `inset 0 0 ${r(2 * s)}px ${color}`,
        `inset 0 0 ${r(8 * s)}px ${color}`,
        `inset 0 0 ${r(20 * s)}px ${color}`,
    ];
    return layers.join(", ");
}

/** Glow at a specific voltage fraction (0 = dead, 1 = full) */
function glowAt(color: string, spread: number, voltage: number): string {
    if (voltage <= 0.05) return "0 0 0px transparent";
    return borderGlow(color, spread, voltage);
}

/**
 * Ignition profiles — same physics as NeonText but for the border tube.
 */
const IGNITION_PROFILES = [
    {
        curve: [0.0, 0.4, 0.06, 0.7, 0.1, 0.95, 1.06, 1.0],
        duration: 0.55,
    },
    {
        curve: [0.0, 0.3, 0.05, 0.5, 0.06, 0.75, 0.08, 0.95, 1.08, 1.0],
        duration: 0.8,
    },
    {
        curve: [0.0, 0.2, 0.04, 0.35, 0.05, 0.55, 0.06, 0.8, 0.08, 0.96, 1.12, 1.0],
        duration: 1.05,
    },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function NeonContainer({
    children,
    as: Tag = "div",
    className,

    glowColor = "oklch(0.70 0.12 183)",
    glowSpread = 0.6,
    borderWidth = 1,
    borderRadius,

    flicker = true,
    flickerInterval = [6, 18],
    flickerSpeed = 0.8,
    flickerDepth = 0.7,

    breathe = false,
    breatheInterval = [10, 22],
    breatheStrength = 0.35,
    breatheSpeed = 1.4,
    breatheDeep = 0,
    breatheCount = [1, 1],
    breatheGroupGap = [1.5, 3],

    trigger = "auto",
    offColor = "oklch(0.25 0.02 183)",
    ignitionSpeed = 1,
    shutdownSpeed = 1,
    triggerSelector,
}: NeonContainerProps) {
    const borderRef = useRef<HTMLElement | null>(null);
    const cancelsRef = useRef<(() => void)[]>([]);
    const animationsRef = useRef<{ stop: () => void }[]>([]);
    const flickerFnRef = useRef<(() => () => void) | null>(null);
    const mountedRef = useRef(false);
    const [lit, setLit] = useState(trigger === "auto");
    const litRef = useRef(lit);

    useEffect(() => {
        litRef.current = lit;
    }, [lit]);

    const initiallyLit = trigger === "auto";

    const fullGlow = useMemo(
        () => glowAt(glowColor, glowSpread, 1),
        [glowColor, glowSpread]
    );

    // ═════════════════════════════════════════════════════════════════════════
    //  HOVER TRIGGER
    // ═════════════════════════════════════════════════════════════════════════

    useEffect(() => {
        if (trigger !== "hover") return;
        const el = borderRef.current;
        if (!el) return;

        const target =
            (triggerSelector
                ? el.closest<HTMLElement>(triggerSelector) ??
                  document.querySelector<HTMLElement>(triggerSelector)
                : el.closest<HTMLElement>('[data-slot="card"]')) ?? el;

        const onEnter = () => setLit(true);
        const onLeave = () => setLit(false);

        target.addEventListener("mouseenter", onEnter);
        target.addEventListener("mouseleave", onLeave);
        return () => {
            target.removeEventListener("mouseenter", onEnter);
            target.removeEventListener("mouseleave", onLeave);
        };
    }, [trigger, triggerSelector]);

    // ═════════════════════════════════════════════════════════════════════════
    //  IGNITION & SHUTDOWN
    // ═════════════════════════════════════════════════════════════════════════

    useEffect(() => {
        if (trigger !== "hover") return;

        if (!mountedRef.current) {
            mountedRef.current = true;
            return;
        }

        // Nuclear cancel
        animationsRef.current.forEach((a) => a.stop());
        animationsRef.current = [];
        cancelsRef.current.forEach((c) => c());
        cancelsRef.current = [];

        const el = borderRef.current;
        if (!el) return;
        el.getAnimations().forEach((a) => a.cancel());

        const cancels: (() => void)[] = [];
        const anims: { stop: () => void }[] = [];

        if (lit) {
            // ── IGNITION ─────────────────────────────────────────────
            // Pick random profile
            const roll = Math.random();
            const pIdx = roll < 0.25 ? 0 : roll < 0.75 ? 1 : 2;
            const profile = IGNITION_PROFILES[pIdx];

            // Snap to off-state first
            el.style.borderColor = offColor;
            el.style.boxShadow = "none";

            const glowFrames = profile.curve.map((v) =>
                glowAt(glowColor, glowSpread, v)
            );
            const borderFrames = profile.curve.map((v) => {
                if (v <= 0.05) return offColor;
                return glowColor;
            });

            const ctrl = animate(
                el,
                { boxShadow: glowFrames, borderColor: borderFrames },
                {
                    duration: profile.duration * ignitionSpeed,
                    ease: [0.37, 0, 0.63, 1],
                }
            );
            anims.push(ctrl);
            ctrl.then(() => {
                if (!litRef.current) return;
                el.style.boxShadow = fullGlow;
                el.style.borderColor = glowColor;

                // Start flicker
                if (flicker) {
                    const cancel = flickerFnRef.current?.();
                    if (cancel) cancels.push(cancel);
                }
            }).catch(() => {});
        } else {
            // ── SHUTDOWN ─────────────────────────────────────────────
            flickerFnRef.current = null;

            // Snap to lit
            el.style.boxShadow = fullGlow;
            el.style.borderColor = glowColor;

            // Phase 1: sputter
            const dimGlow = glowAt(glowColor, glowSpread, 0.3);
            const sputter = animate(
                el,
                {
                    boxShadow: [fullGlow, dimGlow, fullGlow, dimGlow],
                    borderColor: [glowColor, offColor, glowColor, offColor],
                },
                { duration: 0.2 * shutdownSpeed, ease: [0.4, 0, 0.8, 1] }
            );
            anims.push(sputter);

            // Phase 2: fade to off
            sputter
                .then(() => {
                    if (litRef.current) return;
                    const fade = animate(
                        el,
                        {
                            boxShadow: [dimGlow, "0 0 0px transparent"],
                            borderColor: [offColor, offColor],
                        },
                        { duration: 0.25 * shutdownSpeed, ease: [0.2, 0, 0.4, 1] }
                    );
                    anims.push(fade);
                    return fade;
                })
                .then(() => {
                    if (litRef.current) return;
                    el.style.boxShadow = "none";
                    el.style.borderColor = offColor;
                })
                .catch(() => {});
        }

        cancelsRef.current = cancels;
        animationsRef.current = anims;
        return () => {
            cancels.forEach((c) => c());
            anims.forEach((a) => a.stop());
        };
    }, [
        lit,
        trigger,
        glowColor,
        glowSpread,
        fullGlow,
        flicker,
        offColor,
        ignitionSpeed,
        shutdownSpeed,
    ]);

    // ═════════════════════════════════════════════════════════════════════════
    //  FLICKER — voltage sag on the border tube
    // ═════════════════════════════════════════════════════════════════════════

    useEffect(() => {
        if (!flicker) {
            flickerFnRef.current = null;
            return;
        }

        const d = Math.min(Math.max(flickerDepth, 0), 2);

        flickerFnRef.current = () => {
            const el = borderRef.current;
            if (!el) return () => {};

            const [lo, hi] = flickerInterval;
            const wait = (lo + Math.random() * (hi - lo)) * 1000;

            const timeout = setTimeout(() => {
                const v = (drop: number) => Math.max(0.05, 1 - drop * d);
                const voltageCurve = [
                    1,
                    v(0.35),
                    v(0.12),
                    v(0.5),
                    v(0.08),
                    1,
                    v(0.25),
                    v(0.06),
                    1,
                ];

                const glowFrames = voltageCurve.map((val) =>
                    glowAt(glowColor, glowSpread, val)
                );

                const ctrl = animate(
                    el,
                    { boxShadow: glowFrames },
                    { duration: flickerSpeed, ease: [0.4, 0, 0.2, 1] }
                );

                ctrl.then(() => {
                    if (!litRef.current) return;
                    el.style.boxShadow = fullGlow;
                    const cancel = flickerFnRef.current?.();
                    if (cancel) cancelsRef.current.push(cancel);
                }).catch(() => {});
            }, wait);

            return () => clearTimeout(timeout);
        };
    }, [flicker, flickerDepth, flickerInterval, flickerSpeed, glowColor, glowSpread, fullGlow]);

    // ── Boot flicker (auto mode) ─────────────────────────────────────────────

    useEffect(() => {
        if (trigger === "hover") return;
        if (!flicker) return;

        const el = borderRef.current;
        if (!el) return;

        el.style.boxShadow = fullGlow;
        el.style.borderColor = glowColor;

        const cancel = flickerFnRef.current?.();
        if (cancel) cancelsRef.current.push(cancel);

        return () => {
            cancelsRef.current.forEach((c) => c());
            cancelsRef.current = [];
        };
    }, [trigger, flicker, fullGlow, glowColor]);

    // ═════════════════════════════════════════════════════════════════════════
    //  BREATHE — transformer surge
    // ═════════════════════════════════════════════════════════════════════════

    useEffect(() => {
        if (!breathe || !lit) return;
        const el = borderRef.current;
        if (!el) return;

        let dead = false;

        const loop = async () => {
            if (dead) return;

            const [lo, hi] = breatheInterval;
            const wait = (lo + Math.random() * (hi - lo)) * 1000;
            await new Promise<void>((res) => {
                const t = setTimeout(res, wait);
                cancelsRef.current.push(() => clearTimeout(t));
            });
            if (dead) return;

            const [cMin, cMax] = breatheCount;
            const count =
                cMin === cMax
                    ? cMin
                    : cMin + Math.floor(Math.random() * (cMax - cMin + 1));

            for (let i = 0; i < count; i++) {
                if (dead) return;

                const peak = 1 + breatheStrength;
                const mid = 1 + breatheStrength * 0.4;
                const dip = Math.max(0.2, 1 - breatheDeep);

                const frames =
                    breatheDeep > 0
                        ? [1, dip, mid, peak, mid, 1]
                        : [1, mid, peak, mid, 1];

                const glowFrames = frames.map((v) =>
                    glowAt(glowColor, glowSpread, v)
                );

                const dur = breatheDeep > 0 ? breatheSpeed * 1.25 : breatheSpeed;

                try {
                    await animate(
                        el,
                        { boxShadow: glowFrames },
                        { duration: dur, ease: [0.37, 0, 0.63, 1] }
                    );
                    el.style.boxShadow = fullGlow;
                } catch {
                    /* cancelled */
                }

                if (i < count - 1 && !dead) {
                    const [gLo, gHi] = breatheGroupGap;
                    const gap = (gLo + Math.random() * (gHi - gLo)) * 1000;
                    await new Promise<void>((res) => {
                        const t = setTimeout(res, gap);
                        cancelsRef.current.push(() => clearTimeout(t));
                    });
                }
            }

            loop();
        };

        loop();

        return () => {
            dead = true;
        };
    }, [
        lit,
        breathe,
        breatheInterval,
        breatheStrength,
        breatheSpeed,
        breatheDeep,
        breatheCount,
        breatheGroupGap,
        glowColor,
        glowSpread,
        fullGlow,
    ]);

    // ═════════════════════════════════════════════════════════════════════════
    //  RENDER
    // ═════════════════════════════════════════════════════════════════════════

    return (
        <Tag
            ref={borderRef as React.RefObject<never>}
            className={cn("relative", className)}
            style={
                initiallyLit
                    ? {
                          borderWidth,
                          borderStyle: "solid",
                          borderColor: glowColor,
                          boxShadow: fullGlow,
                          borderRadius,
                      }
                    : {
                          borderWidth,
                          borderStyle: "solid",
                          borderColor: offColor,
                          boxShadow: "none",
                          borderRadius,
                      }
            }
        >
            {children}
        </Tag>
    );
}
