import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", ...props }, ref) => {
        const variants = {
            default: "bg-[#150A24] border border-[#7C3AED]/10",
            glass: "bg-[#150A24]/60 backdrop-blur-xl border border-[#7C3AED]/15 glass-card",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-2xl shadow-xl transition-all duration-300",
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl font-bold leading-none tracking-tight text-[#F5F3FF] headline-serif",
            className
        )}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-[#A197B0]", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
