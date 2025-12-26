import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", isLoading, children, disabled, ...props }, ref) => {
        const baseStyles = "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium overflow-hidden transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F] disabled:pointer-events-none disabled:opacity-50";

        const variants = {
            default: "bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.5)] hover:-translate-y-0.5",
            ghost: "bg-transparent border border-[#7C3AED]/30 text-[#A197B0] hover:text-white hover:border-[#7C3AED]/60 hover:bg-[#7C3AED]/5",
            outline: "bg-transparent border-2 border-[#2B0F3F] text-[#A197B0] hover:text-white hover:border-[#7C3AED]/40 hover:bg-[#1A0B2E]/50",
            secondary: "bg-[#1A0B2E] text-[#A197B0] hover:text-white hover:bg-[#2B0F3F]",
            destructive: "bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 hover:border-red-500/50",
            link: "text-[#A855F7] underline-offset-4 hover:underline",
        };

        const sizes = {
            default: "h-12 px-7 text-sm",
            sm: "h-10 px-5 text-xs",
            lg: "h-14 px-10 text-base",
            icon: "h-11 w-11",
        };

        return (
            <button
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {/* Glow effect for default variant */}
                {variant === "default" && (
                    <span className="absolute inset-0 -z-10 opacity-0 hover:opacity-100 transition-opacity duration-500">
                        <span className="absolute inset-[-10px] bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.3)_0%,transparent_60%)] blur-xl" />
                    </span>
                )}

                {isLoading ? (
                    <div className="pulsar-loader w-5 h-5" />
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
