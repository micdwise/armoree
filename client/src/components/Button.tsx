import * as React from "react";
import { Button as BaseButton } from "@base-ui-components/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary rounded-sm text-white hover:bg-brand-600 dark:hover:bg-brand-400 focus-visible:ring-brand-primary",
        secondary:
          "bg-muted rounded-sm text-default-font hover:bg-neutral-200 dark:hover:bg-neutral-700 focus-visible:ring-muted",
        outline:
          "border rounded-sm border-neutral-border bg-transparent text-default-font hover:bg-muted",
        ghost: "bg-transparent hover:bg-muted",
        destructive:
          "bg-destructive rounded-sm text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
        link: "bg-transparent text-brand-highlight-text underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, isLoading, children, disabled, ...props },
    ref,
  ) => {
    return (
      <BaseButton
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
