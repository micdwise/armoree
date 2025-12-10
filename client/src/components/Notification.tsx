import * as React from "react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface NotificationProps {
  variant?: "success" | "danger" | "warning" | "info";
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const Notification = ({
  variant = "info",
  title,
  children,
  className,
}: NotificationProps) => {
  const variants = {
    success: "bg-bg-success text-text-success border-border-success",
    danger: "bg-bg-error text-text-error border-border-error",
    warning: "bg-bg-warning text-text-warning border-border-warning",
    info: "bg-bg-info text-text-info border-border-info",
  };

  const icons = {
    success: CheckCircle,
    danger: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const Icon = icons[variant];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border p-4",
        variants[variant],
        className,
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <div className="flex flex-col gap-1">
        <h3 className="font-medium leading-none">{title}</h3>
        {children && <div className="text-sm opacity-90">{children}</div>}
      </div>
    </div>
  );
};
