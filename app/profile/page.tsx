import { redirect } from "next/navigation";
import { getCurrentUserAction } from "@/actions/user.actions";
import DashboardShell from "@/components/DashboardShell";
import ProfileForm from "./_components/ProfileForm";
import PasswordForm from "../password/_components/PasswordForm";

export default async function ProfilePage() {
    const result = await getCurrentUserAction();

    if (!result.success || !result.user) {
        redirect("/login");
    }

    return (
        <DashboardShell>
            <div className="space-y-8">
                <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold text-zinc-900">
                        Update Profile
                    </h2>
                    <p className="mt-2 text-zinc-600">
                        Update your personal details and profile picture.
                    </p>
                    <div className="mt-8">
                        <ProfileForm user={result.user} />
                    </div>
                </section>

                <section
                    id="password"
                    className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
                >
                    <h2 className="text-2xl font-semibold text-zinc-900">
                        Change Password
                    </h2>
                    <p className="mt-2 text-zinc-600">
                        Enter your current password and choose a new one.
                    </p>
                    <div className="mt-8">
                        <PasswordForm />
                    </div>
                </section>
            </div>
        </DashboardShell>
    );
}
