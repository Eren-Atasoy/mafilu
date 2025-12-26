"use client";

import { useEffect, useRef } from "react";

export function ViewCounter({ movieId }: { movieId: string }) {
    const hasCounted = useRef(false);

    useEffect(() => {
        if (hasCounted.current) return;

        const recordView = async () => {
            try {
                await fetch(`/api/videos/${movieId}/view`, { method: "POST" });
                hasCounted.current = true;
            } catch (err) {
                console.error("Failed to record view", err);
            }
        };

        // Record view after 5 seconds
        const timer = setTimeout(recordView, 5000);

        return () => clearTimeout(timer);
    }, [movieId]);

    return null;
}
