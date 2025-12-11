import * as React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Input } from "./Input";
import { supabase } from "../lib/supabase";
import { Eye, EyeOff } from "lucide-react";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    // Reset state when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setPassword("");
            setConfirmPassword("");
            setError(null);
            setSuccess(false);
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) {
                throw error;
            }

            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err: any) {
            setError(err.message || "Failed to update password");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Change Password"
            description="Enter your new password below."
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading || success}>
                        {(() => {
                            if (isLoading) return "Updating...";
                            if (success) return "Updated!";
                            return "Update Password";
                        })()}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="space-y-4">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                        startContent={
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="focus:outline-none"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        }
                    />
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        required
                        error={!!error}
                    />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                {success && (
                    <p className="text-sm text-green-600">
                        Password updated successfully.
                    </p>
                )}
            </form>
        </Modal>
    );
};
