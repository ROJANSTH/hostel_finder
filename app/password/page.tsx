import DashboardShell from "@/components/DashboardShell";
import PasswordForm from "./_components/PasswordForm";

export default function PasswordPage() {
    return (
        <DashboardShell>
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-zinc-900">
                    Change Password
                </h2>
                <p className="mt-2 text-zinc-600">
                    Enter your current password and choose a new one.
                </p>
                <div className="mt-8">
                    <PasswordForm />
                </div>
            </div>
        </DashboardShell>
    );
}
