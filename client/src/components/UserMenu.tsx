import * as React from "react";
import { useAuth } from "../app/Auth/AuthContext";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { Button } from "./Button";
import { ChevronDown, LogOut, KeyRound, User } from "lucide-react";
import { cn } from "../lib/utils";

export const UserMenu: React.FC = () => {
    const { user, signOut } = useAuth();
    const [isOpen, setIsOpen] = React.useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!user) {
        return null;
    }

    return (
        <div className="relative" ref={menuRef}>
            <Button
                variant="link"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-medium text-subtext-color hover:text-default-font !no-underline"
            >
                <span className="hidden sm:inline-block">{user.email}</span>
                <span className="sm:hidden">
                    <User className="h-5 w-5" />
                </span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border border-neutral-border bg-default-background shadow-lg shadow-black/5 focus:outline-none z-50">
                    <div className="p-1">
                        <div className="px-2 py-1.5 text-xs font-semibold text-subtext-color border-b border-neutral-border mb-1 sm:hidden">
                            {user.email}
                        </div>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setIsPasswordModalOpen(true);
                            }}
                            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-default-font hover:bg-screen-background hover:text-brand-primary transition-colors"
                        >
                            <KeyRound className="h-4 w-4" />
                            Change Password
                        </button>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                signOut();
                            }}
                            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-text-error hover:bg-bg-error hover:text-text-error transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            )}

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
};
