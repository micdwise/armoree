import * as React from "react";
import { Button as BaseButton } from "@base-ui-components/react/button";
import { cn } from "../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "link" | "danger";
  size?: "sm" | "md" | "lg";
}

export const NewButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary:
        "rounded-xl bg-mint-600 text-white hover:bg-mint-700 active:bg-mint-800 shadow-sm border border-transparent",
      secondary:
        "rounded-xl bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 shadow-sm",
      link: "rounded-xl text-blue-600 hover:underline bg-transparent border-transparent hover:text-blue-700 p-0 h-auto",
      danger:
        "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm border border-transparent",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    // Link variant shouldn't have standard size padding if it's acting like a link,
    // but sometimes it does. Let's keep it simple for now and override if needed or handled in variants.
    // Actually Base UI Button helps with accessibility.

    return (
      <BaseButton
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none transition-colors duration-200 cursor-pointer",
          variants[variant],
          variant !== "link" && sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);

NewButton.displayName = "Button";
