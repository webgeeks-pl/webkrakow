"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface RainProps {
    /** Number of raindrops. @default 300 */
    count?: number;
    /** Base fall speed multiplier. @default 1 */
    speed?: number;
    /** Base opacity of the drops (0-1). @default 0.35 */
    opacity?: number;
    /** Neon tint color (CSS). @default "oklch(0.70 0.12 183)" */
    color?: string;
    /** Wind angle in degrees (0 = straight down, positive = right). @default 8 */
    wind?: number;
    /** Minimum drop length in px. @default 18 */
    minLength?: number;
    /** Maximum drop length in px. @default 40 */
    maxLength?: number;

    className?: string;
}

interface Drop {
    x: number;
    y: number;
    len: number;
    speed: number;
    opacity: number;
    width: number;
}

const Rain: React.FC<RainProps> = ({
    count = 300,
    speed = 1,
    opacity = 0.35,
    color = "oklch(0.70 0.12 183)",
    wind = 8,
    minLength = 18,
    maxLength = 40,
    className,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let raf: number;
        let w: number;
        let h: number;

        // ── Parse color once for compositing ────────────────────────
        // We'll draw in the raw color and control alpha per-drop
        const resolvedColor = (() => {
            // Create an offscreen canvas to resolve CSS color (including oklch)
            const tmp = document.createElement("canvas");
            tmp.width = tmp.height = 1;
            const c = tmp.getContext("2d")!;
            c.fillStyle = color;
            c.fillRect(0, 0, 1, 1);
            const [r, g, b] = c.getImageData(0, 0, 1, 1).data;
            return { r, g, b };
        })();

        const resize = () => {
            w = canvas.clientWidth * devicePixelRatio;
            h = canvas.clientHeight * devicePixelRatio;
            canvas.width = w;
            canvas.height = h;
        };
        resize();
        window.addEventListener("resize", resize);

        // ── Initialise drops ────────────────────────────────────────

        const makeDrop = (startAtTop = false): Drop => ({
            x: Math.random() * w * 1.2 - w * 0.1,
            y: startAtTop ? -Math.random() * h : Math.random() * h,
            len: minLength + Math.random() * (maxLength - minLength),
            speed: (2 + Math.random() * 4) * speed,
            opacity: (0.15 + Math.random() * 0.85) * opacity,
            width: 0.8 + Math.random() * 0.8,
        });

        const drops: Drop[] = Array.from({ length: count }, () => makeDrop(false));

        // Wind as dx per frame
        const windRad = (wind * Math.PI) / 180;
        const windDx = Math.sin(windRad);
        const windDy = Math.cos(windRad);

        // ── Render loop ─────────────────────────────────────────────

        const render = () => {
            ctx.clearRect(0, 0, w, h);

            const { r, g, b } = resolvedColor;
            const scale = devicePixelRatio;

            for (let i = 0; i < drops.length; i++) {
                const d = drops[i];

                const dy = d.speed * windDy * scale;
                const dx = d.speed * windDx * scale;

                d.y += dy;
                d.x += dx;

                // Reset when off screen
                if (d.y > h + d.len * scale) {
                    const fresh = makeDrop(true);
                    d.x = fresh.x;
                    d.y = fresh.y;
                    d.len = fresh.len;
                    d.speed = fresh.speed;
                    d.opacity = fresh.opacity;
                    d.width = fresh.width;
                }

                const len = d.len * scale;
                const endX = d.x + windDx * len;
                const endY = d.y + windDy * len;

                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = `rgba(${r},${g},${b},${d.opacity})`;
                ctx.lineWidth = d.width * scale;
                ctx.lineCap = "round";
                ctx.stroke();
            }

            raf = requestAnimationFrame(render);
        };

        raf = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
        };
    }, [count, speed, opacity, color, wind, minLength, maxLength]);

    return (
        <canvas
            ref={canvasRef}
            className={cn(
                "pointer-events-none absolute inset-0 h-full w-full",
                className
            )}
        />
    );
};

export default Rain;
