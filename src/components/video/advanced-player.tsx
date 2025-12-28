"use client";

import React, { useRef, useState, useCallback } from "react";

interface AdvancedPlayerProps {
    videoId: string;
    embedUrl: string;
    movieId: string;
    duration?: number;
}

export function AdvancedPlayer({ embedUrl, duration }: AdvancedPlayerProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Focus the iframe to enable keyboard shortcuts
    const focusPlayer = useCallback(() => {
        if (iframeRef.current) {
            iframeRef.current.focus();
        }
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
            className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group cursor-pointer"
            style={{
                border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            onClick={focusPlayer}
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

            {/* Video Iframe - Using Native Bunny Player 
                Auto-focuses on load to enable keyboard shortcuts
            */}
            <iframe
                ref={iframeRef}
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture; gyroscope; accelerometer"
                allowFullScreen
                onLoad={() => {
                    setIsLoading(false);
                    // Auto-focus iframe to enable keyboard shortcuts
                    setTimeout(() => {
                        if (iframeRef.current) {
                            iframeRef.current.focus();
                        }
                    }, 100);
                }}
                style={{ border: 'none' }}
                tabIndex={0}
            />

            {/* Duration Badge (if available) */}
            {durationDisplay && (
                <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-black/70 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    {durationDisplay}
                </div>
            )}

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


