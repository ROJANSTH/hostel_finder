import { authRequest } from "@/lib/api/client";
import { Hostel } from "@/lib/types/hostel.types";
import { AdminUser } from "@/lib/api/admin.api";
import HostelAdminClient from "./HostelAdminClient";

export default async function AdminHostelsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; moderationStatus?: string; active?: string }>;
}) {
    const query = await searchParams;
    const params = new URLSearchParams();
    if (query.search) params.set("search", query.search);
    if (query.moderationStatus) params.set("moderationStatus", query.moderationStatus);
    if (query.active) params.set("active", query.active);
    const [hostels, owners] = await Promise.all([
        authRequest<Hostel[]>(`/admin/hostels?${params}`),
        authRequest<AdminUser[]>("/admin/users?role=owner&status=active&limit=100"),
    ]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-zinc-900">Hostel moderation</h1>
            <p className="mt-1 text-sm text-zinc-600">Create, assign, edit, approve, reject, feature, and archive marketplace listings.</p>
            <form className="my-6 grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 md:grid-cols-[2fr_1fr_1fr_auto]">
                <input name="search" defaultValue={query.search} placeholder="Hostel name or city" className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900" />
                <select name="moderationStatus" defaultValue={query.moderationStatus ?? ""} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800">
                    <option value="">All moderation states</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
                <select name="active" defaultValue={query.active ?? ""} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800">
                    <option value="">Active and archived</option>
                    <option value="true">Active</option>
                    <option value="false">Archived</option>
                </select>
                <button className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-bold text-white">Filter</button>
            </form>
            {!hostels.success && <p className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">{hostels.message}</p>}
            <HostelAdminClient hostels={hostels.success ? hostels.data : []} owners={owners.success ? owners.data : []} />
        </div>
    );
}
