"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Modal from "../../_components/Modal";
import { deleteAdminUserAction } from "@/actions/admin.actions";

interface UserRow {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function UserTable({
    data,
    pagination,
    search,
}: {
    data: UserRow[];
    pagination: Pagination;
    search: string;
}) {
    const router = useRouter();
    const params = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [target, setTarget] = useState<UserRow | null>(null);
    const [deleteError, setDeleteError] = useState("");

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const totalPages = pagination?.totalPages ?? 1;
    const total = pagination?.total ?? 0;

    const setQuery = (next: Record<string, string | number>) => {
        const q = new URLSearchParams(params.toString());
        Object.entries(next).forEach(([k, v]) => q.set(k, String(v)));
        router.push(`/admin/users?${q.toString()}`);
    };

    const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const value = new FormData(e.currentTarget).get("search") as string;
        setQuery({ search: value ?? "", page: 1 });
    };

    const onDelete = () => {
        if (!target) return;
        setDeleteError("");
        startTransition(async () => {
            const result = await deleteAdminUserAction(target.id);
            if (result.success) {
                setTarget(null);
                router.refresh();
            } else {
                setDeleteError(result.message || "Failed to delete user");
            }
        });
    };

    return (
        <div className="mx-auto w-full max-w-5xl">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-900">Users</h2>
                    <p className="text-sm text-zinc-500">{total} total users</p>
                </div>
                <Link
                    href="/admin/users/create"
                    className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                    + New User
                </Link>
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={onSearch} className="flex w-full max-w-sm gap-2">
                    <input
                        name="search"
                        defaultValue={search}
                        placeholder="Search by name or email..."
                        className="h-10 flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                    <button className="h-10 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50">
                        Search
                    </button>
                </form>

                <label className="flex items-center gap-2 text-sm text-zinc-500">
                    Rows
                    <select
                        value={limit}
                        onChange={(e) => setQuery({ limit: e.target.value, page: 1 })}
                        className="h-10 rounded-lg border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500"
                    >
                        {[5, 10, 20, 50].map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Email</th>
                            <th className="px-4 py-3 font-medium">Role</th>
                            <th className="px-4 py-3 font-medium">Created</th>
                            <th className="px-4 py-3 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.length ? (
                            data.map((u) => (
                                <tr key={u.id} className="border-b border-zinc-100 last:border-0 transition-colors hover:bg-zinc-50">
                                    <td className="px-4 py-3 font-medium text-zinc-900">{u.name}</td>
                                    <td className="px-4 py-3 text-zinc-600">{u.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            u.role === "admin"
                                                ? "bg-indigo-100 text-indigo-700"
                                                : "bg-zinc-100 text-zinc-600"
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-500">
                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/users/${u.id}`} className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50">
                                                View
                                            </Link>
                                            <Link href={`/admin/users/${u.id}/edit`} className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50">
                                                Edit
                                            </Link>
                                            <button onClick={() => setTarget(u)} className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-zinc-400">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
                <span>Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                    <button
                        disabled={page <= 1}
                        onClick={() => setQuery({ page: page - 1 })}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm transition hover:bg-zinc-50 disabled:opacity-40"
                    >
                        ← Prev
                    </button>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setQuery({ page: page + 1 })}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm transition hover:bg-zinc-50 disabled:opacity-40"
                    >
                        Next →
                    </button>
                </div>
            </div>

            <Modal open={!!target} onClose={() => setTarget(null)} title="Delete user">
                <p className="mb-2 text-sm text-zinc-600">
                    Are you sure you want to delete <span className="font-semibold text-zinc-900">{target?.name}</span>? This cannot be undone.
                </p>
                {deleteError && <p className="mb-3 text-sm text-red-500">{deleteError}</p>}
                <div className="mt-5 flex justify-end gap-3">
                    <button onClick={() => setTarget(null)} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50">
                        Cancel
                    </button>
                    <button onClick={onDelete} disabled={isPending} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50">
                        {isPending ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
