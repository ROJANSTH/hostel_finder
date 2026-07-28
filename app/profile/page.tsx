import { redirect } from "next/navigation";
import { getCurrentUserAction } from "@/actions/user.actions";
import DashboardShell from "@/components/DashboardShell";
import ProfileForm from "./_components/ProfileForm";

export default async function ProfilePage() {
    const result = await getCurrentUserAction();

    if (!result.success || !result.user) {
        redirect("/login");
    }

    return (
        <DashboardShell>
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-zinc-900">
                    Update Profile
                </h2>
                <p className="mt-2 text-zinc-600">
                    Update your personal details and profile picture.
                </p>
                <div className="mt-8">
                    <ProfileForm user={result.user} />
                </div>
            </div>
        </DashboardShell>
    );
}
