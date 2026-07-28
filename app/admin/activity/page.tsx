import Link from "next/link";
import { authRequest } from "@/lib/api/client";

interface ActivityRow {
    _id: string;
    admin?: { name: string; email: string };
    action: string;
    entityType: string;
    entityId?: string | null;
    details?: Record<string, unknown>;
    createdAt: string;
}

export default async function ActivityPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const query = await searchParams;
    const page = Math.max(1, Number(query.page) || 1);
    const result = await authRequest<ActivityRow[]>(`/admin/hostels/activity?page=${page}`);
    const rows = result.success ? result.data : [];
    const meta = result.meta ?? { page: 1, limit: 30, total: rows.length, totalPages: 1 };

    return (
        <div>
            <h1 className="text-3xl font-bold text-zinc-900">Admin activity log</h1>
            <p className="mt-1 text-sm text-zinc-600">An audit trail of sensitive changes across the platform.</p>
            {!result.success && <p className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">{result.message}</p>}
            <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
                <table className="w-full min-w-[850px] text-left text-sm">
                    <thead className="bg-zinc-50 text-zinc-600">
                        <tr>{["Time", "Administrator", "Action", "Target", "Details"].map((heading) => <th key={heading} className="p-4 font-semibold">{heading}</th>)}</tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row._id} className="border-t border-zinc-100 align-top text-zinc-700">
                                <td className="p-4 whitespace-nowrap">{new Date(row.createdAt).toLocaleString()}</td>
                                <td className="p-4"><strong>{row.admin?.name ?? "System"}</strong><p className="text-xs text-zinc-500">{row.admin?.email}</p></td>
                                <td className="p-4"><span className="rounded-full bg-indigo-50 px-2 py-1 font-medium text-indigo-700">{row.action}</span></td>
                                <td className="p-4 capitalize">{row.entityType}<p className="max-w-40 truncate text-xs text-zinc-500">{row.entityId ?? "—"}</p></td>
                                <td className="p-4"><code className="whitespace-pre-wrap break-all text-xs text-zinc-600">{JSON.stringify(row.details ?? {})}</code></td>
                            </tr>
                        ))}
                        {!rows.length && <tr><td colSpan={5} className="p-10 text-center text-zinc-500">No admin activity recorded yet.</td></tr>}
                    </tbody>
                </table>
            </div>
            {meta.totalPages > 1 && (
                <nav className="mt-5 flex justify-between text-sm">
                    <Link href={`/admin/activity?page=${Math.max(1, page - 1)}`} className={page <= 1 ? "pointer-events-none opacity-40" : "text-indigo-700"}>← Previous</Link>
                    <span className="text-zinc-600">Page {meta.page} of {meta.totalPages}</span>
                    <Link href={`/admin/activity?page=${Math.min(meta.totalPages, page + 1)}`} className={page >= meta.totalPages ? "pointer-events-none opacity-40" : "text-indigo-700"}>Next →</Link>
                </nav>
            )}
        </div>
    );
}
