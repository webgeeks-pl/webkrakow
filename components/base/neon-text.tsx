"use client";

import { cn } from "@/lib/utils/cn";
import { animate } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

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

    // ── Trigger mode ──────────────────────────────────────────────────────────

    /**
     * Controls when the neon sign is lit.
     * - `"auto"`: always on (default behavior)
     * - `"hover"`: starts off, ignites with realistic tube startup on hover
     *   of nearest `[data-slot="card"]` ancestor (or own wrapper)
     * - `"inView"`: starts off, ignites when scrolled into viewport
     * @default "auto"
     */
    trigger?: "auto" | "hover" | "inView";
    /**
     * Text / tube color when the sign is off (trigger="hover" only).
     * Any CSS color. Use a dim version of your glow color or a neutral gray.
     * @default "oklch(0.25 0.02 183)"
     */
    offColor?: string;
    /**
     * Speed multiplier for the ignition (power-on) animation.
     * `0.5` = twice as fast · `1` = normal · `2` = twice as slow
     * @default 1
     */
    ignitionSpeed?: number;
    /**
     * Speed multiplier for the shutdown (power-off) animation.
     * `0.5` = twice as fast · `1` = normal · `2` = twice as slow
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

    // ── In-view options ───────────────────────────────────────────────────────

    /**
     * When `trigger="inView"`: if `true` the sign stays lit after the first
     * ignition (observer disconnects). If `false` it shuts down when scrolled
     * out and re-ignites each time it re-enters.
     * @default true
     */
    inViewOnce?: boolean;
    /**
     * IntersectionObserver `rootMargin`. Use negative values to require
     * more of the element to be visible before triggering.
     * @default "0px"
     */
    inViewMargin?: string;
    /**
     * IntersectionObserver `threshold` (0–1). `0` = any pixel visible,
     * `1` = fully visible.
     * @default 0.15
     */
    inViewThreshold?: number;
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

/**
 * Ignition personality profiles.
 * Each models a tube with different gas pressure / electrode wear.
 * `curve` values are voltage fractions (0 = dead, 1 = full, >1 = overshoot).
 * The first value (0.12) matches the CSS off-state brightness.
 */
const IGNITION_PROFILES = [
    // Easy starter — two pulses before catch
    {
        curve: [0.12, 0.4, 0.06, 0.7, 0.1, 0.95, 1.06, 1.0],
        duration: 0.55,
    },
    // Normal — three pulses, classic neon startup
    {
        curve: [0.12, 0.3, 0.05, 0.5, 0.06, 0.75, 0.08, 0.95, 1.08, 1.0],
        duration: 0.8,
    },
    // Stubborn — four pulses, lazy tube that needs coaxing
    {
        curve: [0.12, 0.2, 0.04, 0.35, 0.05, 0.55, 0.06, 0.8, 0.08, 0.96, 1.12, 1.0],
        duration: 1.05,
    },
];

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
    trigger = "auto",
    offColor = "oklch(0.25 0.02 183)",
    ignitionSpeed = 1,
    shutdownSpeed = 1,
    triggerSelector,
    inViewOnce = true,
    inViewMargin = "0px",
    inViewThreshold = 0.15,
}: NeonTextProps) {
    const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
    const wrapRef = useRef<HTMLElement | null>(null);
    const flickerFnRef = useRef<((el: HTMLSpanElement) => () => void) | null>(null);
    const cancelsRef = useRef<(() => void)[]>([]);
    const animationsRef = useRef<{ stop: () => void }[]>([]);
    const mountedRef = useRef(false);
    const [lit, setLit] = useState(trigger === "auto");
    const litRef = useRef(lit);

    // Keep litRef in sync
    useEffect(() => {
        litRef.current = lit;
    }, [lit]);

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

    /** Whether letters render lit on first paint (avoids flash) */
    const initiallyLit = trigger === "auto";

    // ═════════════════════════════════════════════════════════════════════════
    //  HOVER TRIGGER — attach to nearest Card ancestor
    // ═════════════════════════════════════════════════════════════════════════

    useEffect(() => {
        if (trigger !== "hover") return;
        const wrap = wrapRef.current;
        if (!wrap) return;

        const target =
            (triggerSelector
                ? (wrap.closest<HTMLElement>(triggerSelector) ??
                  document.querySelector<HTMLElement>(triggerSelector))
                : wrap.closest<HTMLElement>('[data-slot="card"]')) ?? wrap;

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
    //  IN-VIEW TRIGGER — IntersectionObserver
    // ═════════════════════════════════════════════════════════════════════════

    useEffect(() => {
        if (trigger !== "inView") return;
        const wrap = wrapRef.current;
        if (!wrap) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setLit(true);
                    if (inViewOnce) observer.disconnect();
                } else {
                    setLit(false);
                }
            },
            { rootMargin: inViewMargin, threshold: inViewThreshold }
        );

        observer.observe(wrap);
        return () => observer.disconnect();
    }, [trigger, inViewOnce, inViewMargin, inViewThreshold]);

    // ═════════════════════════════════════════════════════════════════════════
    //  IGNITION & SHUTDOWN — realistic tube power-on / power-off
    //
    //  On power-on each letter gets an "ignition personality":
    //    • easy starters catch on the first spark
    //    • normal tubes have one false start
    //    • stubborn tubes need two attempts before the gas ionizes
    //  Letters light up in a rough left-to-right wave with random jitter
    //  so no two ignitions look identical.
    //
    //  On power-off the voltage drops, tubes sputter once, then die.
    // ═════════════════════════════════════════════════════════════════════════

    useEffect(() => {
        if (trigger === "auto") return;

        // Skip the shutdown branch on initial mount — letters are
        // already rendered in their off-state via inline styles.
        if (!mountedRef.current) {
            mountedRef.current = true;
            return;
        }

        // Cancel ALL in-flight WAAPI animations first so ignition
        // animations don't keep running over a shutdown (and vice-versa).
        animationsRef.current.forEach((a) => a.stop());
        animationsRef.current = [];
        cancelsRef.current.forEach((c) => c());
        cancelsRef.current = [];

        const cancels: (() => void)[] = [];
        const anims: { stop: () => void }[] = [];
        const letters = lettersRef.current;

        // Nuclear cancel: kill EVERY running animation on every letter
        // element AND the wrapper. This catches flicker animations that
        // aren't tracked in animationsRef.
        const wrap = wrapRef.current;
        if (wrap) {
            wrap.getAnimations().forEach((a) => a.cancel());
            wrap.style.filter = "";
        }
        charIndices.forEach((ci) => {
            const el = letters[ci];
            if (!el) return;
            el.getAnimations().forEach((a) => a.cancel());
        });

        // Force every letter to a known baseline BEFORE scheduling
        // any new animations — this fixes ghosted states from
        // stopped mid-flight animations.
        charIndices.forEach((ci) => {
            const el = letters[ci];
            if (!el) return;
            if (lit) {
                // About to ignite → snap to off-state
                el.style.filter = "brightness(1)";
                el.style.textShadow = "none";
                el.style.color = offColor;
            } else {
                // About to shut down → snap to fully-lit
                // Also kill flicker function so in-flight flicker .then()
                // callbacks don't re-ignite letters after shutdown.
                flickerFnRef.current = null;
                el.style.filter = "brightness(1)";
                el.style.textShadow = fullGlow;
                el.style.color = "";
            }
        });

        if (lit) {
            // ── IGNITION ─────────────────────────────────────────────
            const seed = text.length * 13 + text.charCodeAt(0);

            charIndices.forEach((ci, i) => {
                const el = letters[ci];
                if (!el) return;

                // Personality: ~25 % easy, ~50 % normal, ~25 % stubborn
                const roll = ((seed + i * 31) % 100) / 100;
                const pIdx = roll < 0.25 ? 0 : roll < 0.75 ? 1 : 2;
                const profile = IGNITION_PROFILES[pIdx];

                // Stagger: rough L→R wave + per-letter jitter
                const wave = (ci / Math.max(text.length, 1)) * 0.18;
                const jitter = ((seed + i * 7) % 35) / 175; // 0–0.2 s
                const delay = (wave + jitter) * 1000;

                const t = setTimeout(async () => {
                    const bFrames = profile.curve.map((v) => `brightness(${v})`);
                    const gFrames = profile.curve.map((v) =>
                        glowAt(glowColor, glowSpread, v)
                    );

                    try {
                        // Reset off-color before ignition
                        el.style.color = "";
                        const ctrl = animate(
                            el,
                            { filter: bFrames, textShadow: gFrames },
                            {
                                duration: profile.duration * ignitionSpeed,
                                ease: [0.37, 0, 0.63, 1],
                            }
                        );
                        anims.push(ctrl);
                        await ctrl;
                        el.style.filter = "brightness(1)";
                        el.style.textShadow = fullGlow;

                        // Kick off ongoing flicker for this letter
                        if (flicker && flickerSet.has(ci)) {
                            const cancel = flickerFnRef.current?.(el);
                            if (cancel) cancels.push(cancel);
                        }
                    } catch {
                        /* animation cancelled */
                    }
                }, delay);
                cancels.push(() => clearTimeout(t));
            });
        } else {
            // ── SHUTDOWN ─────────────────────────────────────────────
            // Per-letter sputter + crossfade to offColor with stagger.
            // Each letter gets a tiny random delay (like tubes losing
            // contact at slightly different times), then a quick
            // brightness dip before fading color to offColor.
            const seed = text.length * 13 + text.charCodeAt(0);

            charIndices.forEach((ci, i) => {
                const el = letters[ci];
                if (!el) return;

                // Stagger: 0 – 0.15s random per letter
                const delay = (((seed + i * 11) % 30) / 200) * 1000;

                const t = setTimeout(() => {
                    // Phase 1: quick sputter (brightness dip + partial glow fade)
                    const dimGlow = glowAt(glowColor, glowSpread, 0.3);
                    const sputter = animate(
                        el,
                        {
                            filter: [
                                "brightness(1)",
                                "brightness(0.5)",
                                "brightness(0.75)",
                                "brightness(0.3)",
                            ],
                            textShadow: [fullGlow, dimGlow, fullGlow, dimGlow],
                        },
                        {
                            duration: 0.2 * shutdownSpeed,
                            ease: [0.4, 0, 0.8, 1],
                        }
                    );
                    anims.push(sputter);

                    // Phase 2: crossfade color + kill glow
                    sputter
                        .then(() => {
                            if (litRef.current) return;
                            const fade = animate(
                                el,
                                {
                                    color: ["#fff", offColor],
                                    textShadow: [dimGlow, "0 0 0px transparent"],
                                    filter: ["brightness(0.3)", "brightness(1)"],
                                },
                                {
                                    duration: 0.25 * shutdownSpeed,
                                    ease: [0.2, 0, 0.4, 1],
                                }
                            );
                            anims.push(fade);
                            return fade;
                        })
                        .then(() => {
                            if (litRef.current) return;
                            el.style.color = offColor;
                            el.style.textShadow = "none";
                            el.style.filter = "brightness(1)";
                        })
                        .catch(() => {});
                }, delay);
                cancels.push(() => clearTimeout(t));
            });
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
        text,
        charIndices,
        glowColor,
        glowSpread,
        fullGlow,
        flicker,
        flickerSet,
        offColor,
        ignitionSpeed,
        shutdownSpeed,
    ]);

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
                    // Don't corrupt off-state if sign was turned off mid-flicker
                    if (!litRef.current) return;
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

    // ── Boot up flicker loops (auto mode only — hover uses ignition) ────────

    useEffect(() => {
        if (trigger !== "auto") return;

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
    }, [trigger, text, fullGlow, charIndices, staggerDelays, flicker, flickerSet]);

    // ═════════════════════════════════════════════════════════════════════════
    //  BREATHE — global transformer surge
    //
    //  All tubes on the same circuit share a transformer. When voltage rises
    //  slightly the whole sign gets brighter for a moment — smooth sinusoidal,
    //  not a pop.
    // ═════════════════════════════════════════════════════════════════════════

    useEffect(() => {
        if (!breathe || !lit) return;

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
        lit,
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
                        style={
                            initiallyLit
                                ? {
                                      textShadow: fullGlow,
                                      filter: "brightness(1)",
                                  }
                                : {
                                      color: offColor,
                                      textShadow: "none",
                                      filter: "brightness(1)",
                                  }
                        }
                    >
                        {char}
                    </span>
                );
            })}
        </Tag>
    );
}
