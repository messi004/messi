import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const { toast } = useToast();

    const changePassword = useMutation({
        mutationFn: (data: { currentPassword: string; newPassword: string }) =>
            apiRequest('PATCH', '/api/auth/password', data),
        onSuccess: () => {
            toast({ title: "Password changed successfully!" });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        },
        onError: (error: any) => {
            toast({
                title: "Failed to change password",
                description: error.message?.includes("401") ? "Current password is incorrect" : error.message,
                variant: "destructive"
            });
        }
    });

    const handleSubmit = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast({ title: "Please fill all fields", variant: "destructive" });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast({ title: "New passwords don't match", variant: "destructive" });
            return;
        }
        if (newPassword.length < 6) {
            toast({ title: "Password must be at least 6 characters", variant: "destructive" });
            return;
        }
        changePassword.mutate({ currentPassword, newPassword });
    };

    return (
        <AdminLayout title="Settings">
            <div className="max-w-lg">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock size={20} /> Change Password
                        </CardTitle>
                        <CardDescription>Update your admin panel password</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Current Password</label>
                            <div className="relative">
                                <Input
                                    type={showCurrent ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                >
                                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium">New Password</label>
                            <div className="relative">
                                <Input
                                    type={showNew ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password (min 6 chars)"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowNew(!showNew)}
                                >
                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Confirm New Password</label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
                            />
                        </div>
                        <Button
                            onClick={handleSubmit}
                            disabled={changePassword.isPending}
                            className="w-full"
                        >
                            {changePassword.isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Changing...</>
                            ) : "Change Password"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
