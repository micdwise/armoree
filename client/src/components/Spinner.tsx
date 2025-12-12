import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

type SpinnerSize = "sm" | "md" | "lg";

export const Spinner = ({
  className,
  size = "md",
  ...props
}: {
  className?: string;
  size?: SpinnerSize;
} & React.SVGProps<SVGSVGElement>) => {
  const sizes: Record<SpinnerSize, string> = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <Loader2
      className={cn("animate-spin text-brand-primary", sizes[size], className)}
      {...props}
    />
  );
};
