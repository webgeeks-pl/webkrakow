"use client";

import { useEffect } from "react";

export default function ScrollToHashOnLoad() {
    useEffect(() => {
        const hash = window.location.hash;
        if (!hash || !hash.startsWith("#scroll-")) return;
        console.log("Attempting to scroll to", hash);
        const id = hash.replace("#scroll-", "#");
        console.log("id:", id);
        // Try immediately, then poll using requestAnimationFrame until element exists.
        let raf = 0;
        const tryScroll = () => {
            const el = document.querySelector(id);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                return;
            }
            raf = requestAnimationFrame(tryScroll);
        };

        const delayedTry = () => setTimeout(tryScroll, 500); // Initial delay to allow page to render
        // First attempt in a microtask to be as fast as possible
        Promise.resolve().then(delayedTry);

        // Safety timeout: stop polling after 1 second
        const stop = setTimeout(() => cancelAnimationFrame(raf), 1000);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(stop);
        };
    }, []);

    return null;
}
