"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

interface AdvancedPlayerProps {
    videoId: string;
    embedUrl: string;
    movieId: string;
    duration?: number;
}

export function AdvancedPlayer({ embedUrl, duration }: AdvancedPlayerProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Send command to Bunny.net player via postMessage
    const sendPlayerCommand = useCallback((command: string, value?: number) => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                { event: command, value },
                "*"
            );
        }
    }, []);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only handle if container is focused or no input is focused
            const activeElement = document.activeElement;
            const isInputFocused = activeElement?.tagName === "INPUT" ||
                activeElement?.tagName === "TEXTAREA";

            if (isInputFocused) return;

            switch (e.key) {
                case "ArrowLeft":
                    e.preventDefault();
                    sendPlayerCommand("seek", -5); // Seek back 5 seconds
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    sendPlayerCommand("seek", 5); // Seek forward 5 seconds
                    break;
                case " ": // Spacebar
                    e.preventDefault();
                    sendPlayerCommand("togglePlay");
                    break;
                case "f":
                case "F":
                    e.preventDefault();
                    sendPlayerCommand("toggleFullscreen");
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [sendPlayerCommand]);

    // Listen for messages from the Bunny player
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Handle Bunny.net player events if needed
            if (event.data?.event === "ready") {
                setIsLoading(false);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    // Format duration display
    const formatDuration = (seconds?: number) => {
        if (!seconds) return null;
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const durationDisplay = formatDuration(duration);

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group"
            style={{
                border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            tabIndex={0}
        >
            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10 transition-opacity duration-500">
                    <div className="flex flex-col items-center gap-4">
                        <div
                            className="w-12 h-12 rounded-full animate-spin"
                            style={{
                                border: "4px solid rgba(139, 92, 246, 0.3)",
                                borderTopColor: "#8B5CF6",
                            }}
                        />
                        <p className="text-gray-400 text-sm animate-pulse">Film Yükleniyor...</p>
                    </div>
                </div>
            )}

            {/* Video Iframe - Using Native Bunny Player */}
            <iframe
                ref={iframeRef}
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture; gyroscope; accelerometer"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
                style={{ border: 'none' }}
            />

            {/* Duration Badge (if available) */}
            {durationDisplay && (
                <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-black/70 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    {durationDisplay}
                </div>
            )}

            {/* Keyboard Shortcut Hint */}
            <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <div className="flex gap-2 text-xs text-white/60">
                    <span className="px-2 py-1 bg-black/50 rounded">← → 5sn</span>
                    <span className="px-2 py-1 bg-black/50 rounded">Space Oynat</span>
                </div>
            </div>

            {/* Ambient Glow Effect (Decoration) - Using site's purple theme */}
            <div
                className="absolute -inset-1 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 -z-10"
                style={{
                    background: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A855F7 100%)",
                }}
            />
        </div>
    );
}

