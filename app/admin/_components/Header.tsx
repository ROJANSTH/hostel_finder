"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { logoutAction } from "@/actions/auth.actions";

export default function Header() {
    const { user } = useAuth();

    return (
        <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-6">
            <h1 className="text-sm font-semibold text-zinc-700">
                Hostel Finder Admin
            </h1>
            <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-500">
                    {user?.name || "Admin"}
                </span>
                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50"
                    >
                        Logout
                    </button>
                </form>
            </div>
        </header>
    );
}
