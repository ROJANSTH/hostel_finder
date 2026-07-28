import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminUserByIdAction } from "@/actions/admin.actions";
import UserFormEdit from "../../_components/UserFormEdit";

export default async function EditUserPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await getAdminUserByIdAction(id);

    if (!result.success || !result.data) notFound();

    return (
        <div className="mx-auto max-w-5xl">
            <Link href="/admin/users" className="text-sm text-zinc-400 transition hover:text-zinc-600">
                ← Back to users
            </Link>
            <h2 className="mb-6 mt-3 text-2xl font-semibold text-zinc-900">Edit User</h2>
            <UserFormEdit user={result.data} />
        </div>
    );
}
