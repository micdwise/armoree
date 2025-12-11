import * as React from "react";
import { Button as BaseButton } from "@base-ui-components/react/button";
import { cn } from "../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "link" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary:
        "rounded-xl bg-brand-primary text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm border border-transparent ",
      secondary:
        "bg-default-background text-default-font border border-neutral-border hover:bg-screen-background active:bg-neutral-200 shadow-sm",
      link: "text-brand-primary hover:underline bg-transparent border-transparent hover:text-brand-700 p-0 h-auto",
      danger:
        "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm border border-transparent",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <BaseButton
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none transition-colors duration-200 cursor-pointer",
          variants[variant],
          variant !== "link" && sizes[size],
          className,
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </BaseButton>
    );
  },
);

Button.displayName = "Button";
