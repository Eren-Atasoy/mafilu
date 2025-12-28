"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Hls from "hls.js";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Volume1,
    Maximize,
    Minimize,
    SkipBack,
    SkipForward,
    Loader2,
    Settings,
    Check,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface CustomPlayerProps {
    videoId: string;
    playbackUrl: string;
    posterUrl?: string;
    duration?: number;
    title?: string;
    description?: string;
}

interface QualityLevel {
    height: number;
    bitrate: number;
    index: number;
}

const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4];

export function CustomPlayer({
    videoId,
    playbackUrl,
    posterUrl,
    title,
    description,
}: CustomPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const savePositionIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Core states
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // New feature states
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showSettings, setShowSettings] = useState(false);
    const [settingsMenu, setSettingsMenu] = useState<"main" | "speed" | "quality">("main");
    const [qualityLevels, setQualityLevels] = useState<QualityLevel[]>([]);
    const [currentQuality, setCurrentQuality] = useState(-1); // -1 = auto
    const [showResumeToast, setShowResumeToast] = useState(false);
    const [showQualityMenu, setShowQualityMenu] = useState(false);

    const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

    // Storage key for resume position
    const storageKey = `mafilu_video_${videoId}`;

    // Format time (seconds -> MM:SS or HH:MM:SS)
    const formatTime = useCallback((seconds: number) => {
        if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) {
            return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        }
        return `${m}:${s.toString().padStart(2, "0")}`;
    }, []);



    // Save position to localStorage
    const savePosition = useCallback(() => {
        const video = videoRef.current;
        if (video && video.currentTime > 5 && video.currentTime < video.duration - 10) {
            localStorage.setItem(storageKey, JSON.stringify({
                time: video.currentTime,
                duration: video.duration,
                timestamp: Date.now()
            }));
        }
    }, [storageKey]);

    // Restore position from localStorage
    const restorePosition = useCallback(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                // Only restore if saved within last 7 days
                if (Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000) {
                    return data.time;
                }
            }
        } catch {
            // Ignore parse errors
        }
        return null;
    }, [storageKey]);

    // Initialize HLS
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !playbackUrl) return;

        setIsLoading(true);
        setError(null);

        const savedPosition = restorePosition();

        const onLoadedMetadata = () => {
            setIsLoading(false);
            setDuration(video.duration);

            if (savedPosition && savedPosition > 5) {
                video.currentTime = savedPosition;
                setShowResumeToast(true);
                setTimeout(() => setShowResumeToast(false), 3000);
            }
        };

        // Check if video element can play HLS natively (Safari)
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = playbackUrl;
            video.addEventListener("loadedmetadata", onLoadedMetadata);
        } else if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
            });

            hlsRef.current = hls;
            hls.loadSource(playbackUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
                setIsLoading(false);

                // Get quality levels
                const levels = data.levels.map((level, index) => ({
                    height: level.height,
                    bitrate: level.bitrate,
                    index,
                })).sort((a, b) => b.height - a.height);
                setQualityLevels(levels);

                if (savedPosition && savedPosition > 5) {
                    video.currentTime = savedPosition;
                    setShowResumeToast(true);
                    setTimeout(() => setShowResumeToast(false), 3000);
                }
            });

            hls.on(Hls.Events.ERROR, (_, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            setError("Ağ hatası oluştu. Lütfen bağlantınızı kontrol edin.");
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            setError("Medya hatası oluştu. Yeniden deneniyor...");
                            hls.recoverMediaError();
                            break;
                        default:
                            setError("Video yüklenemedi.");
                            hls.destroy();
                            break;
                    }
                }
            });

            return () => {
                hls.destroy();
                hlsRef.current = null;
            };
        } else {
            setError("Tarayıcınız HLS formatını desteklemiyor.");
        }
    }, [playbackUrl, restorePosition]);

    // Save position periodically and on unload
    useEffect(() => {
        savePositionIntervalRef.current = setInterval(savePosition, 5000);

        const handleBeforeUnload = () => savePosition();
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            if (savePositionIntervalRef.current) {
                clearInterval(savePositionIntervalRef.current);
            }
            window.removeEventListener("beforeunload", handleBeforeUnload);
            savePosition();
        };
    }, [savePosition]);

    // Video event listeners
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => setCurrentTime(video.currentTime);
        const handleDurationChange = () => setDuration(video.duration);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => {
            setIsPlaying(false);
            savePosition();
        };
        const handleWaiting = () => setIsLoading(true);
        const handleCanPlay = () => setIsLoading(false);
        const handleProgress = () => {
            if (video.buffered.length > 0) {
                setBuffered(video.buffered.end(video.buffered.length - 1));
            }
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("durationchange", handleDurationChange);
        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);
        video.addEventListener("waiting", handleWaiting);
        video.addEventListener("canplay", handleCanPlay);
        video.addEventListener("progress", handleProgress);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("durationchange", handleDurationChange);
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
            video.removeEventListener("waiting", handleWaiting);
            video.removeEventListener("canplay", handleCanPlay);
            video.removeEventListener("progress", handleProgress);
        };
    }, [savePosition]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeElement = document.activeElement;
            const isInputFocused =
                activeElement?.tagName === "INPUT" ||
                activeElement?.tagName === "TEXTAREA";

            if (isInputFocused) return;

            const video = videoRef.current;
            if (!video) return;

            switch (e.key.toLowerCase()) {
                case " ":
                case "k":
                    e.preventDefault();
                    togglePlay();
                    break;
                case "arrowleft":
                case "j":
                    e.preventDefault();
                    seek(-10);
                    break;
                case "arrowright":
                case "l":
                    e.preventDefault();
                    seek(10);
                    break;
                case "arrowup":
                    e.preventDefault();
                    changeVolume(0.1);
                    break;
                case "arrowdown":
                    e.preventDefault();
                    changeVolume(-0.1);
                    break;
                case "m":
                    e.preventDefault();
                    toggleMute();
                    break;
                case "f":
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case ">":
                case ".":
                    e.preventDefault();
                    cycleSpeed(1);
                    break;
                case "<":
                case ",":
                    e.preventDefault();
                    cycleSpeed(-1);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Fullscreen change listener
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    // Auto-hide controls
    const showControlsTemporarily = useCallback(() => {
        setShowControls(true);
        if (hideControlsTimeout.current) {
            clearTimeout(hideControlsTimeout.current);
        }
        hideControlsTimeout.current = setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
                setShowSettings(false);
            }
        }, 3000);
    }, [isPlaying]);

    // Player control functions
    const togglePlay = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play().catch(console.error);
        } else {
            video.pause();
        }
    }, []);

    const seek = useCallback((seconds: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
    }, []);

    const seekTo = useCallback((time: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = time;
    }, []);

    const changeVolume = useCallback((delta: number) => {
        const video = videoRef.current;
        if (!video) return;
        const newVolume = Math.max(0, Math.min(1, video.volume + delta));
        video.volume = newVolume;
        setVolume(newVolume);
        if (newVolume > 0) setIsMuted(false);
    }, []);

    const toggleMute = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    }, []);

    const toggleFullscreen = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            container.requestFullscreen();
        }
    }, []);


    const setSpeed = useCallback((speed: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.playbackRate = speed;
        setPlaybackSpeed(speed);
    }, []);

    const cycleSpeed = useCallback((direction: number) => {
        const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackSpeed);
        const newIndex = Math.max(0, Math.min(PLAYBACK_SPEEDS.length - 1, currentIndex + direction));
        setSpeed(PLAYBACK_SPEEDS[newIndex]);
    }, [playbackSpeed, setSpeed]);

    const setQuality = useCallback((levelIndex: number) => {
        const hls = hlsRef.current;
        if (!hls) return;
        hls.currentLevel = levelIndex;
        setCurrentQuality(levelIndex);
    }, []);

    const handleProgressClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            seekTo(pos * duration);
        },
        [duration, seekTo]
    );

    const handleVolumeChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const video = videoRef.current;
            if (!video) return;
            const newVolume = parseFloat(e.target.value);
            video.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        },
        []
    );

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    const bufferProgress = duration > 0 ? (buffered / duration) * 100 : 0;

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) return <VolumeX className="w-5 h-5 text-white" />;
        if (volume < 0.5) return <Volume1 className="w-5 h-5 text-white" />;
        return <Volume2 className="w-5 h-5 text-white" />;
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group cursor-pointer select-none"
            style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}
            onMouseMove={showControlsTemporarily}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => {
                if (isPlaying) {
                    setShowControls(false);
                    setShowSettings(false);
                    setShowQualityMenu(false);
                }
            }}
            onClick={(e) => {
                if (e.target === videoRef.current || e.target === containerRef.current) {
                    togglePlay();
                }
            }}
            tabIndex={0}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full"
                poster={posterUrl}
                playsInline
            />

            {/* Resume Toast */}
            {showResumeToast && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 rounded-lg text-white text-sm z-40 animate-fade-in">
                    Kaldığınız yerden devam ediliyor...
                </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-[var(--mf-primary)] animate-spin" />
                        <p className="text-gray-300 text-sm">Yükleniyor...</p>
                    </div>
                </div>
            )}

            {/* Error Overlay */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
                    <div className="text-center p-6">
                        <p className="text-red-400 text-lg mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 rounded-lg bg-[var(--mf-primary)] text-white hover:bg-[var(--mf-primary-glow)] transition-colors"
                        >
                            Yeniden Dene
                        </button>
                    </div>
                </div>
            )}

            {/* PuhuTV Style Pause Overlay - Shows movie info when paused */}
            {!isPlaying && !isLoading && !error && (
                <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.5) 100%)"
                    }}
                >
                    {/* Movie Info - Top Left */}
                    <div className="absolute top-6 left-6 max-w-lg">
                        {/* Mafilu Logo */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[var(--mf-primary)] font-bold text-lg">mafilu</span>
                            <span className="text-gray-400 text-sm">| Originals</span>
                        </div>

                        {/* Title */}
                        {title && (
                            <h2 className="text-white text-2xl font-bold mb-3 drop-shadow-lg">
                                {title}
                            </h2>
                        )}

                        {/* Description */}
                        {description && (
                            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 drop-shadow-md">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Settings Menu */}
            {showSettings && (
                <div
                    className="absolute bottom-20 right-4 w-56 bg-black/95 rounded-lg overflow-hidden z-40 border border-white/10"
                    onClick={(e) => e.stopPropagation()}
                >
                    {settingsMenu === "main" && (
                        <>
                            <button
                                onClick={() => setSettingsMenu("speed")}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors text-white"
                            >
                                <span>Hız</span>
                                <span className="flex items-center gap-1 text-gray-400">
                                    {playbackSpeed}x <ChevronRight className="w-4 h-4" />
                                </span>
                            </button>
                            {/* Always show Quality option */}
                            <button
                                onClick={() => setSettingsMenu("quality")}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors text-white border-t border-white/10"
                            >
                                <span>Kalite</span>
                                <span className="flex items-center gap-1 text-gray-400">
                                    {qualityLevels.length === 0
                                        ? "Otomatik"
                                        : currentQuality === -1
                                            ? "Otomatik"
                                            : `${qualityLevels.find(q => q.index === currentQuality)?.height}p`
                                    }
                                    <ChevronRight className="w-4 h-4" />
                                </span>
                            </button>
                        </>
                    )}

                    {settingsMenu === "speed" && (
                        <>
                            <button
                                onClick={() => setSettingsMenu("main")}
                                className="w-full px-4 py-3 flex items-center gap-2 hover:bg-white/10 transition-colors text-white border-b border-white/10"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Hız</span>
                            </button>
                            <div className="max-h-48 overflow-y-auto">
                                {PLAYBACK_SPEEDS.map((speed) => (
                                    <button
                                        key={speed}
                                        onClick={() => {
                                            setSpeed(speed);
                                            setShowSettings(false);
                                            setSettingsMenu("main");
                                        }}
                                        className="w-full px-4 py-2 flex items-center justify-between hover:bg-white/10 transition-colors text-white"
                                    >
                                        <span>{speed === 1 ? "Normal" : `${speed}x`}</span>
                                        {playbackSpeed === speed && <Check className="w-4 h-4 text-[var(--mf-primary)]" />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {settingsMenu === "quality" && (
                        <>
                            <button
                                onClick={() => setSettingsMenu("main")}
                                className="w-full px-4 py-3 flex items-center gap-2 hover:bg-white/10 transition-colors text-white border-b border-white/10"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Kalite</span>
                            </button>
                            <div className="max-h-48 overflow-y-auto">
                                <button
                                    onClick={() => {
                                        setQuality(-1);
                                        setShowSettings(false);
                                        setSettingsMenu("main");
                                    }}
                                    className="w-full px-4 py-2 flex items-center justify-between hover:bg-white/10 transition-colors text-white"
                                >
                                    <span className="flex items-center gap-2">
                                        Otomatik
                                        {qualityLevels.length === 0 && (
                                            <span className="text-xs text-gray-500">(Önerilen)</span>
                                        )}
                                    </span>
                                    {currentQuality === -1 && <Check className="w-4 h-4 text-[var(--mf-primary)]" />}
                                </button>
                                {qualityLevels.length === 0 ? (
                                    <div className="px-4 py-3 text-gray-500 text-sm border-t border-white/5">
                                        Kalite bağlantı hızınıza göre otomatik ayarlanır
                                    </div>
                                ) : (
                                    qualityLevels.map((level) => {
                                        const qualityLabel = level.height >= 1080 ? "Full HD" : level.height >= 720 ? "HD" : "SD";
                                        return (
                                            <button
                                                key={level.index}
                                                onClick={() => {
                                                    setQuality(level.index);
                                                    setShowSettings(false);
                                                    setSettingsMenu("main");
                                                }}
                                                className="w-full px-4 py-2 flex items-center justify-between hover:bg-white/10 transition-colors text-white border-t border-white/5"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span>{level.height}p</span>
                                                    <span className="text-xs text-gray-500">{qualityLabel}</span>
                                                </span>
                                                {currentQuality === level.index && <Check className="w-4 h-4 text-[var(--mf-primary)]" />}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Controls Overlay */}
            <div
                className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-20 pb-4 px-4 transition-opacity duration-300 z-30 ${showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            >
                {/* Progress Bar */}
                <div
                    ref={progressRef}
                    className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group/progress mb-4"
                    onClick={handleProgressClick}
                >
                    {/* Buffer Progress */}
                    <div
                        className="absolute left-0 top-0 h-full bg-white/30 rounded-full"
                        style={{ width: `${bufferProgress}%` }}
                    />
                    {/* Playback Progress */}
                    <div
                        className="absolute left-0 top-0 h-full bg-[var(--mf-primary)] rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                    {/* Handle */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity"
                        style={{ left: `calc(${progress}% - 8px)` }}
                    />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Play/Pause */}
                        <button
                            onClick={togglePlay}
                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                            title={isPlaying ? "Duraklat (K)" : "Oynat (K)"}
                        >
                            {isPlaying ? (
                                <Pause className="w-6 h-6 text-white" />
                            ) : (
                                <Play className="w-6 h-6 text-white ml-0.5" />
                            )}
                        </button>

                        {/* Skip Backward 10s */}
                        <button
                            onClick={() => seek(-10)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                            title="10 saniye geri (←)"
                        >
                            <SkipBack className="w-5 h-5 text-white" />
                        </button>

                        {/* Skip Forward 10s */}
                        <button
                            onClick={() => seek(10)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                            title="10 saniye ileri (→)"
                        >
                            <SkipForward className="w-5 h-5 text-white" />
                        </button>

                        {/* Volume */}
                        <div className="flex items-center gap-2 group/volume">
                            <button
                                onClick={toggleMute}
                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                                title="Sessiz (M)"
                            >
                                {getVolumeIcon()}
                            </button>
                            <div className="w-0 group-hover/volume:w-24 overflow-hidden transition-all duration-200">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-24 h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, var(--mf-primary) 0%, var(--mf-primary) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) 100%)`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Time Display */}
                        <span className="text-white text-sm font-mono ml-2">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>

                        {/* Speed Indicator */}
                        {playbackSpeed !== 1 && (
                            <span className="text-[var(--mf-primary)] text-sm font-medium ml-2">
                                {playbackSpeed}x
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1">

                        {/* Quality Selector Button - Puhutv Style - Always visible */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowQualityMenu(!showQualityMenu);
                                    setShowSettings(false);
                                }}
                                className={`h-8 px-3 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-sm font-medium ${showQualityMenu ? "text-[var(--mf-primary)] bg-white/10" : "text-white"
                                    }`}
                                title="Kalite"
                            >
                                {qualityLevels.length === 0
                                    ? "Otomatik"
                                    : currentQuality === -1
                                        ? "Otomatik"
                                        : qualityLevels.find(q => q.index === currentQuality)?.height
                                            ? `${qualityLevels.find(q => q.index === currentQuality)?.height}p`
                                            : "Otomatik"}
                            </button>

                            {/* Quality Dropdown Menu */}
                            {showQualityMenu && (
                                <div
                                    className="absolute bottom-full right-0 mb-2 w-48 bg-black/95 rounded-lg overflow-hidden border border-white/10 shadow-xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => {
                                            setQuality(-1);
                                            setShowQualityMenu(false);
                                        }}
                                        className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-white/10 transition-colors ${currentQuality === -1 ? "text-[var(--mf-primary)]" : "text-white"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            Otomatik
                                            {qualityLevels.length === 0 && (
                                                <span className="text-xs text-gray-500">(Önerilen)</span>
                                            )}
                                        </span>
                                        {currentQuality === -1 && <Check className="w-4 h-4" />}
                                    </button>
                                    {qualityLevels.length === 0 ? (
                                        <div className="px-4 py-2.5 text-gray-500 text-xs border-t border-white/5">
                                            Kalite bağlantı hızınıza göre otomatik ayarlanır
                                        </div>
                                    ) : (
                                        qualityLevels
                                            .sort((a, b) => b.height - a.height)
                                            .map((level) => {
                                                const qualityLabel = level.height >= 1080
                                                    ? "Full HD"
                                                    : level.height >= 720
                                                        ? "HD"
                                                        : "SD";
                                                return (
                                                    <button
                                                        key={level.index}
                                                        onClick={() => {
                                                            setQuality(level.index);
                                                            setShowQualityMenu(false);
                                                        }}
                                                        className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-white/10 transition-colors border-t border-white/5 ${currentQuality === level.index ? "text-[var(--mf-primary)]" : "text-white"
                                                            }`}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span>{level.height}p</span>
                                                            <span className="text-gray-500 text-xs">{qualityLabel}</span>
                                                        </span>
                                                        {currentQuality === level.index && <Check className="w-4 h-4" />}
                                                    </button>
                                                );
                                            })
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Settings */}
                        <button
                            onClick={() => {
                                setShowSettings(!showSettings);
                                setSettingsMenu("main");
                                setShowQualityMenu(false);
                            }}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors ${showSettings ? "text-[var(--mf-primary)]" : "text-white"
                                }`}
                            title="Ayarlar"
                        >
                            <Settings className="w-5 h-5" />
                        </button>

                        {/* Fullscreen */}
                        <button
                            onClick={toggleFullscreen}
                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                            title="Tam Ekran (F)"
                        >
                            {isFullscreen ? (
                                <Minimize className="w-5 h-5 text-white" />
                            ) : (
                                <Maximize className="w-5 h-5 text-white" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Ambient Glow Effect */}
            <div
                className="absolute -inset-1 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 -z-10"
                style={{
                    background: "linear-gradient(135deg, var(--mf-primary) 0%, var(--mf-primary-glow) 100%)",
                }}
            />


        </div>
    );
}
