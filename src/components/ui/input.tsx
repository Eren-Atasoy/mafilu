import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, id, ...props }, ref) => {
        const generatedId = React.useId();
        const inputId = id ?? generatedId;

        return (
            <div className="space-y-2">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-slate-300"
                    >
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    id={inputId}
                    className={cn(
                        "flex h-11 w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500",
                        "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent",
                        "transition-all duration-200",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-red-500 focus:ring-red-500",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-red-400">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
