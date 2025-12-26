"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Film } from "lucide-react";

// Generate random values once on initial render
function generateStars(count: number) {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 2,
    }));
}

function generateParticles(count: number) {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: `rgba(${168 + Math.random() * 50}, ${85 + Math.random() * 50}, 247, ${0.3 + Math.random() * 0.4})`,
        xOffset: Math.random() * 20 - 10,
        duration: 4 + Math.random() * 4,
        delay: Math.random() * 3,
    }));
}

// Pre-generated static values to avoid hydration mismatch
const STATIC_STARS = generateStars(150);
const STATIC_PARTICLES = generateParticles(20);

// Animated stars component
function Stars() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {STATIC_STARS.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: star.duration,
                        delay: star.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

// Floating particles
function FloatingParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {STATIC_PARTICLES.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        background: particle.color,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, particle.xOffset, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Cosmic Background */}
            <div className="fixed inset-0">
                {/* Deep space gradient */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
              radial-gradient(ellipse at 20% 20%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(88, 28, 135, 0.1) 0%, transparent 60%),
              linear-gradient(180deg, #0A0510 0%, #1A0B2E 40%, #2B0F3F 70%, #150A24 100%)
            `
                    }}
                />

                {/* Animated cosmic clouds */}
                <motion.div
                    className="absolute -top-20 -left-20 w-[600px] h-[400px] opacity-40"
                    style={{
                        background: "radial-gradient(ellipse, rgba(147, 51, 234, 0.3) 0%, transparent 70%)",
                        filter: "blur(60px)",
                    }}
                    animate={{
                        x: [0, 30, 0],
                        y: [0, 20, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <motion.div
                    className="absolute -bottom-40 -right-20 w-[500px] h-[500px] opacity-30"
                    style={{
                        background: "radial-gradient(ellipse, rgba(192, 132, 252, 0.4) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                    animate={{
                        x: [0, -20, 0],
                        y: [0, -30, 0],
                        scale: [1.1, 1, 1.1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Central glow */}
                <div
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-20"
                    style={{
                        background: "radial-gradient(ellipse, rgba(139, 92, 246, 0.5) 0%, transparent 60%)",
                        filter: "blur(100px)",
                    }}
                />

                {/* Stars */}
                <Stars />

                {/* Floating particles */}
                <FloatingParticles />

                {/* Moon glow effect */}
                <motion.div
                    className="absolute top-[15%] right-[20%] w-32 h-32"
                    animate={{
                        opacity: [0.6, 0.9, 0.6],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-200/30 to-purple-400/10 blur-xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-purple-100/50 to-purple-300/30 blur-md" />
                </motion.div>
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <header className="p-6">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Film className="w-9 h-9 text-[#A855F7]" />
                        </motion.div>
                        <span className="text-2xl font-semibold headline-serif text-gradient">
                            Mafilu
                        </span>
                    </Link>
                </header>

                {/* Main content */}
                <main className="flex-1 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            duration: 0.6,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                    >
                        {children}
                    </motion.div>
                </main>

                {/* Footer */}
                <footer className="p-6 text-center">
                    <p className="text-sm text-[#6B5F7C]">
                        © 2024 Mafilu. Bağımsız sinemacılar için yapıldı.
                    </p>
                </footer>
            </div>
        </div>
    );
}
