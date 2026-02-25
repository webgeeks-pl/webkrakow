"use client";

import { cn } from "@/lib/utils/cn";
import { animate } from "motion/react";
import { useEffect, useMemo, useRef } from "react";

// ─── Props ───────────────────────────────────────────────────────────────────

interface NeonTextProps {
    /** The text to render as a neon sign. */
    text: string;
    /** Wrapper element. */
    as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
    className?: string;
    /** Which font family token to use. */
    font?: "logo" | "heading";

    // ── Glow ──────────────────────────────────────────────────────────────────

    /**
     * Neon tube color. Any CSS color.
     * @default "oklch(0.70 0.12 183)"
     */
    glowColor?: string;
    /**
     * Glow spread multiplier.
     * Controls the radius layers of the halo around each letter.
     * `0` = no glow · `0.5` = subtle · `1` = normal · `2` = blown-out
     * @default 0.6
     */
    glowSpread?: number;

    // ── Flicker (per-letter voltage sag) ──────────────────────────────────────

    /**
     * Enable individual letter flicker — simulates a bad tube connection.
     * @default true
     */
    flicker?: boolean;
    /**
     * How many letters can flicker. `undefined` = all.
     * The chosen letters are deterministic (seeded by text).
     * @default undefined
     */
    flickerCount?: number;
    /**
     * Random wait range **in seconds** before a letter flickers again.
     * @default [6, 18]
     */
    flickerInterval?: [number, number];
    /**
     * How long the stutter animation lasts (seconds).
     * Shorter = snappy spark · longer = sluggish tube.
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
     * All letters gently breathe brighter together,
     * like a shared transformer surge.
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
     * `0.3` = gentle · `0.6` = noticeable · `1` = bright flash
     * @default 0.35
     */
    breatheStrength?: number;
    /**
     * Duration of the breathe animation (seconds).
     * @default 1.4
     */
    breatheSpeed?: number;
    /**
     * How much the sign dims during each breathe cycle (voltage dip
     * before the surge). `0` = no dimming · `0.3` = subtle · `0.6` = deep.
     * @default 0
     */
    breatheDeep?: number;
    /**
     * How many breathe pulses fire in a single series before a longer pause.
     * `[min, max]` — a random count is picked each series.
     * @default [1, 1]
     */
    breatheCount?: [number, number];
    /**
     * Time gap **in seconds** between individual breathes inside a series.
     * `[min, max]` — random per gap.
     * @default [1.5, 3]
     */
    breatheGroupGap?: [number, number];
}

// ─── Glow helpers ────────────────────────────────────────────────────────────

/**
 * Build a multi-layer text-shadow that mimics a real neon tube halo.
 * Layers: tight core → inner glow → mid spread → soft bloom
 */
function glowShadow(color: string, spread: number, intensity = 1): string {
    const i = spread * intensity;
    const layers = [
        `0 0 ${r(2 * i)}px ${color}`, // tight core
        `0 0 ${r(8 * i)}px ${color}`, // inner glow
        `0 0 ${r(20 * i)}px ${color}`, // mid spread
        `0 0 ${r(40 * i)}px ${color}`, // soft bloom
    ];
    return layers.join(", ");
}

/** Glow at a specific voltage fraction (0 = dead, 1 = full) */
function glowAt(color: string, spread: number, voltage: number): string {
    if (voltage <= 0.05) return "0 0 0px transparent";
    return glowShadow(color, spread, voltage);
}

function r(n: number) {
    return Math.round(Math.max(0, n));
}

/** Deterministic seeded shuffle (Fisher-Yates with seed). */
function seededShuffle<T>(arr: T[], seed: number): T[] {
    const a = [...arr];
    let s = seed;
    for (let i = a.length - 1; i > 0; i--) {
        s = (s * 16807 + 0) % 2147483647; // LCG
        const j = s % (i + 1);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function NeonText({
    text,
    as: Tag = "span",
    className,
    font = "heading",

    glowColor = "oklch(0.70 0.12 183)",
    glowSpread = 0.6,

    flicker = true,
    flickerCount,
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
}: NeonTextProps) {
    const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
    const wrapRef = useRef<HTMLElement | null>(null);
    const flickerFnRef = useRef<((el: HTMLSpanElement) => () => void) | null>(null);
    const cancelsRef = useRef<(() => void)[]>([]);

    // ── Derived: non-space character indices ──────────────────────────────────

    const charIndices = useMemo(
        () =>
            text
                .split("")
                .map((ch, i) => (ch !== " " ? i : -1))
                .filter((i) => i !== -1),
        [text]
    );

    // ── Derived: which letters are "bad tubes" (flicker-enabled) ─────────────

    const flickerSet = useMemo(() => {
        if (!flicker) return new Set<number>();
        if (flickerCount === undefined || flickerCount >= charIndices.length) {
            return new Set(charIndices);
        }
        const seed = text.length * 7 + text.charCodeAt(0);
        const shuffled = seededShuffle(charIndices, seed);
        return new Set(shuffled.slice(0, flickerCount));
    }, [text, charIndices, flicker, flickerCount]);

    // ── Derived: stagger delays so letters don't all start at once ───────────

    const staggerDelays = useMemo(() => {
        const seed = text.length * 7 + text.charCodeAt(0);
        return charIndices.map((_, idx) => ((seed + idx * 17) % 50) / 10);
    }, [text, charIndices]);

    // ── Full-glow value for reset ────────────────────────────────────────────

    const fullGlow = useMemo(
        () => glowAt(glowColor, glowSpread, 1),
        [glowColor, glowSpread]
    );

    // ═════════════════════════════════════════════════════════════════════════
    //  FLICKER — per-letter voltage sag
    //
    //  Real analogy: a loose tube connection causes the gas to partially
    //  de-ionize. Voltage sags → glow dims through stages → catches → dims
    //  again → stabilizes. It's analog, not binary.
    // ═════════════════════════════════════════════════════════════════════════

    useEffect(() => {
        if (!flicker) {
            flickerFnRef.current = null;
            return;
        }

        // Clamp depth to usable range
        const d = Math.min(Math.max(flickerDepth, 0), 2);

        flickerFnRef.current = (el: HTMLSpanElement) => {
            const [lo, hi] = flickerInterval;
            const wait = (lo + Math.random() * (hi - lo)) * 1000;

            const timeout = setTimeout(() => {
                // Build voltage curve — analog sag & recovery
                // Pattern: stable → sag → partial catch → deeper sag → catch → micro-dip → stable
                const v = (drop: number) => Math.max(0.05, 1 - drop * d);
                const voltageCurve = [
                    1, // stable
                    v(0.35), // first sag
                    v(0.12), // partial recovery
                    v(0.5), // deeper sag
                    v(0.08), // almost back
                    1, // catches
                    v(0.25), // micro-dip
                    v(0.06), // nearly stable
                    1, // fully recovered
                ];

                const brightnessFrames = voltageCurve.map(
                    (val) => `brightness(${val.toFixed(3)})`
                );
                const glowFrames = voltageCurve.map((val) =>
                    glowAt(glowColor, glowSpread, val)
                );

                const ctrl = animate(
                    el,
                    { filter: brightnessFrames, textShadow: glowFrames },
                    { duration: flickerSpeed, ease: [0.4, 0, 0.2, 1] }
                );

                ctrl.then(() => {
                    el.style.filter = "brightness(1)";
                    el.style.textShadow = fullGlow;
                    // Schedule next
                    const cancel = flickerFnRef.current?.(el);
                    if (cancel) cancelsRef.current.push(cancel);
                }).catch(() => {});
            }, wait);

            return () => clearTimeout(timeout);
        };
    }, [
        flicker,
        flickerDepth,
        flickerInterval,
        flickerSpeed,
        glowColor,
        glowSpread,
        fullGlow,
    ]);

    // ── Boot up flicker loops ────────────────────────────────────────────────

    useEffect(() => {
        const cancels: (() => void)[] = [];

        charIndices.forEach((charIdx, orderIdx) => {
            const el = lettersRef.current[charIdx];
            if (!el) return;

            // Set initial lit state
            el.style.textShadow = fullGlow;
            el.style.filter = "brightness(1)";

            if (flicker && flickerSet.has(charIdx)) {
                const t = setTimeout(() => {
                    const cancel = flickerFnRef.current?.(el);
                    if (cancel) cancels.push(cancel);
                }, staggerDelays[orderIdx] * 1000);
                cancels.push(() => clearTimeout(t));
            }
        });

        cancelsRef.current = cancels;
        return () => cancels.forEach((c) => c());
    }, [text, fullGlow, charIndices, staggerDelays, flicker, flickerSet]);

    // ═════════════════════════════════════════════════════════════════════════
    //  BREATHE — global transformer surge
    //
    //  All tubes on the same circuit share a transformer. When voltage rises
    //  slightly the whole sign gets brighter for a moment — smooth sinusoidal,
    //  not a pop.
    // ═════════════════════════════════════════════════════════════════════════

    useEffect(() => {
        if (!breathe) return;

        let dead = false;

        const loop = async () => {
            if (dead) return;

            // ── Wait before the next series ──────────────────────────
            const [lo, hi] = breatheInterval;
            const wait = (lo + Math.random() * (hi - lo)) * 1000;
            await new Promise<void>((res) => {
                const t = setTimeout(res, wait);
                cancelsRef.current.push(() => clearTimeout(t));
            });
            if (dead) return;

            // ── Pick how many breathes are in this series ────────────
            const [cMin, cMax] = breatheCount;
            const count =
                cMin === cMax
                    ? cMin
                    : cMin + Math.floor(Math.random() * (cMax - cMin + 1));

            for (let i = 0; i < count; i++) {
                if (dead) return;
                const wrap = wrapRef.current;
                if (!wrap) break;

                // Build keyframes: optionally dip first, then surge, then settle
                const peak = 1 + breatheStrength;
                const mid = 1 + breatheStrength * 0.4;
                const dip = Math.max(0.2, 1 - breatheDeep);

                const frames: string[] =
                    breatheDeep > 0
                        ? [
                              "brightness(1)",
                              `brightness(${dip})`, // voltage dip
                              `brightness(${mid})`, // recovery overshoot
                              `brightness(${peak})`, // surge peak
                              `brightness(${mid})`, // ease down
                              "brightness(1)",
                          ]
                        : [
                              "brightness(1)",
                              `brightness(${mid})`,
                              `brightness(${peak})`,
                              `brightness(${mid})`,
                              "brightness(1)",
                          ];

                // Duration is a bit longer when there's a dip phase
                const dur = breatheDeep > 0 ? breatheSpeed * 1.25 : breatheSpeed;

                try {
                    await animate(
                        wrap,
                        { filter: frames },
                        {
                            duration: dur,
                            ease: [0.37, 0, 0.63, 1],
                        }
                    );
                    if (wrap) wrap.style.filter = "";
                } catch {
                    /* cancelled */
                }

                // ── Gap inside the series (skip after last) ──────────
                if (i < count - 1 && !dead) {
                    const [gLo, gHi] = breatheGroupGap;
                    const gap = (gLo + Math.random() * (gHi - gLo)) * 1000;
                    await new Promise<void>((res) => {
                        const t = setTimeout(res, gap);
                        cancelsRef.current.push(() => clearTimeout(t));
                    });
                }
            }

            // Next series
            loop();
        };

        loop();

        return () => {
            dead = true;
        };
    }, [
        breathe,
        breatheInterval,
        breatheStrength,
        breatheSpeed,
        breatheDeep,
        breatheCount,
        breatheGroupGap,
    ]);

    // ═════════════════════════════════════════════════════════════════════════
    //  RENDER
    // ═════════════════════════════════════════════════════════════════════════

    return (
        <Tag
            ref={wrapRef as React.RefObject<never>}
            className={cn(
                "inline-flex select-none",
                font === "logo" ? "font-logo" : "font-heading",
                className
            )}
            style={{ color: "#fff" }}
        >
            {text.split("").map((char, i) => {
                if (char === " ") {
                    return <span key={i} className="inline-block w-[0.3em]" />;
                }
                return (
                    <span
                        key={i}
                        ref={(el) => {
                            lettersRef.current[i] = el;
                        }}
                        className="inline-block"
                        style={{
                            textShadow: fullGlow,
                            filter: "brightness(1)",
                        }}
                    >
                        {char}
                    </span>
                );
            })}
        </Tag>
    );
}
