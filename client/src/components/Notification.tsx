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
    success: "bg-green-50 text-green-800 border-green-200",
    danger: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
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
