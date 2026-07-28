import Link from "next/link";

export default function AdminPage() {
    return (
        <div className="mx-auto max-w-4xl">
            <h2 className="mb-2 text-2xl font-semibold text-zinc-900">
                Admin Dashboard
            </h2>
            <p className="mb-8 text-sm text-zinc-500">
                Manage your Hostel Finder platform
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                    href="/admin/users"
                    className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                    <div className="mb-3 inline-flex rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600">
                        Users
                    </div>
                    <h3 className="font-semibold text-zinc-900 group-hover:text-indigo-700">
                        User Management
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                        View, create, edit, and delete users
                    </p>
                </Link>

                <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-6 opacity-50">
                    <div className="mb-3 inline-flex rounded-xl bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-600">
                        Hostels
                    </div>
                    <h3 className="font-semibold text-zinc-900">Hostel Management</h3>
                    <p className="mt-1 text-sm text-zinc-500">Coming soon</p>
                </div>
            </div>
        </div>
    );
}
