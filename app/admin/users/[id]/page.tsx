import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminUserByIdAction } from "@/actions/admin.actions";

export default async function UserDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await getAdminUserByIdAction(id);

    if (!result.success || !result.data) notFound();

    const user = result.data;

    const rows: [string, string][] = [
        ["Name", user.name],
        ["Email", user.email],
        ["Role", user.role || "user"],
        ["Created", user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"],
        ["Updated", user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "—"],
    ];

    return (
        <div className="mx-auto w-full max-w-2xl">
            <Link href="/admin/users" className="text-sm text-zinc-400 transition hover:text-zinc-600">
                ← Back to users
            </Link>

            <div className="mt-4 mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-zinc-900">{user.name}</h2>
                    <p className="text-sm text-zinc-500">{user.email}</p>
                </div>
                <Link
                    href={`/admin/users/${user.id}/edit`}
                    className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
                >
                    Edit
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                {rows.map(([label, value]) => (
                    <div key={label} className="flex justify-between border-b border-zinc-100 px-5 py-3.5 last:border-0">
                        <span className="text-sm text-zinc-500">{label}</span>
                        <span className="text-sm font-medium text-zinc-900">{value || "—"}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
