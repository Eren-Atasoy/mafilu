"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, PictureInPicture } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface AdvancedPlayerProps {
    videoId: string;
    embedUrl: string;
    movieId: string;
    duration?: number;
}

export function AdvancedPlayer({ videoId, embedUrl, movieId, duration }: AdvancedPlayerProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showControls, setShowControls] = useState(true);
    const [savedPosition, setSavedPosition] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    // Load saved playback position
    useEffect(() => {
        const loadProgress = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const res = await fetch(`/api/videos/${movieId}/progress`);
                if (res.ok) {
                    const data = await res.json();
                    setSavedPosition(data.position || 0);
                }
            } catch (error) {
                console.error("Failed to load progress:", error);
            }
        };

        loadProgress();
    }, [movieId, supabase]);

    // Save playback position periodically
    useEffect(() => {
        if (!isPlaying || currentTime === 0) return;

        const saveProgress = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                await fetch(`/api/videos/${movieId}/progress`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ position: currentTime }),
                });
            } catch (error) {
                console.error("Failed to save progress:", error);
            }
        };

        // Save every 10 seconds
        const interval = setInterval(saveProgress, 10000);
        return () => clearInterval(interval);
    }, [currentTime, isPlaying, movieId, supabase]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Ignore if typing in input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key) {
                case " ":
                    e.preventDefault();
                    togglePlay();
                    break;
                case "f":
                case "F":
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    seek(-10);
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    seek(10);
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setVolume(Math.min(1, volume + 0.1));
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    setVolume(Math.max(0, volume - 0.1));
                    break;
                case "m":
                case "M":
                    e.preventDefault();
                    setIsMuted(!isMuted);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [isPlaying, volume, isMuted]);

    // Show/hide controls on mouse move
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const handleMouseMove = () => {
            setShowControls(true);
            clearTimeout(timeout);
            timeout = setTimeout(() => setShowControls(false), 3000);
        };

        if (containerRef.current) {
            containerRef.current.addEventListener("mousemove", handleMouseMove);
            containerRef.current.addEventListener("mouseleave", () => setShowControls(false));
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.removeEventListener("mousemove", handleMouseMove);
            }
            clearTimeout(timeout);
        };
    }, []);

    const togglePlay = () => {
        // Note: Bunny.net iframe doesn't expose player controls directly
        // This is a placeholder - in production, you'd use Bunny.net's JS SDK
        setIsPlaying(!isPlaying);
    };

    const seek = (seconds: number) => {
        // Placeholder - would need Bunny.net SDK
        setCurrentTime((prev) => Math.max(0, Math.min(duration || 0, prev + seconds)));
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!isFullscreen) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const togglePictureInPicture = async () => {
        if (!iframeRef.current) return;

        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                // Note: PiP requires the video element, not iframe
                // This would need Bunny.net SDK or custom player
                console.log("Picture-in-Picture not available for iframe");
            }
        } catch (error) {
            console.error("PiP error:", error);
        }
    };

    const handleSpeedChange = (speed: number) => {
        setPlaybackRate(speed);
        // Would need Bunny.net SDK to actually change playback rate
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video bg-black group"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            {/* Video Iframe */}
            <iframe
                ref={iframeRef}
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
            />

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="w-12 h-12 border-4 border-[var(--mf-primary-dark)] border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Controls Overlay */}
            <div
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${
                    showControls ? "opacity-100" : "opacity-0"
                }`}
            >
                {/* Top Controls */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePictureInPicture}
                        className="bg-black/50 hover:bg-black/70 text-white"
                    >
                        <PictureInPicture className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleFullscreen}
                        className="bg-black/50 hover:bg-black/70 text-white"
                    >
                        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </Button>
                </div>

                {/* Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={togglePlay}
                        className="w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 text-white"
                    >
                        {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                    </Button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/20 rounded-full cursor-pointer group/progress">
                        <div
                            className="h-full bg-[var(--mf-primary-dark)] rounded-full transition-all"
                            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={togglePlay}
                                className="text-white hover:bg-white/10"
                            >
                                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMuted(!isMuted)}
                                className="text-white hover:bg-white/10"
                            >
                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </Button>

                            <div className="w-20 h-1 bg-white/20 rounded-full">
                                <div
                                    className="h-full bg-white rounded-full"
                                    style={{ width: `${volume * 100}%` }}
                                />
                            </div>

                            <div className="text-white text-sm">
                                {formatTime(currentTime)} / {formatTime(duration || 0)}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Speed Control */}
                            <div className="relative group/speed">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-white hover:bg-white/10"
                                >
                                    {playbackRate}x
                                </Button>
                                <div className="absolute bottom-full right-0 mb-2 hidden group-hover/speed:block bg-black/90 rounded-lg p-1 space-y-1">
                                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                                        <button
                                            key={speed}
                                            onClick={() => handleSpeedChange(speed)}
                                            className={`block w-full px-3 py-1 text-sm text-white hover:bg-white/10 rounded ${
                                                playbackRate === speed ? "bg-[var(--mf-primary-dark)]" : ""
                                            }`}
                                        >
                                            {speed}x
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/10"
                            >
                                <Settings className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Continue Watching Banner */}
            {savedPosition > 60 && (
                <div className="absolute top-20 left-4 bg-black/80 backdrop-blur-md rounded-lg p-3 text-white">
                    <p className="text-sm font-medium mb-1">Kaldığınız yerden devam edin</p>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            onClick={() => seek(savedPosition - currentTime)}
                            className="bg-[var(--mf-primary-dark)] hover:bg-[var(--mf-primary-glow-alt)]"
                        >
                            Devam Et
                        </Button>
                        <button
                            onClick={() => setSavedPosition(0)}
                            className="text-sm text-white/60 hover:text-white"
                        >
                            Baştan İzle
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
}

