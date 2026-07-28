"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { logoutAction } from "@/actions/auth.actions";
import Link from "next/link";

const mobileLinks = [
    ["/admin", "Overview"],
    ["/admin/users", "Users"],
    ["/admin/hostels", "Hostels"],
    ["/admin/bookings", "Bookings"],
    ["/admin/reviews", "Reviews"],
    ["/admin/reports", "Reports"],
    ["/admin/announcements", "Notify"],
    ["/admin/activity", "Activity"],
];

export default function Header() {
    const { user } = useAuth();

    return (
        <div className="border-b border-zinc-200 bg-white">
            <header className="flex h-14 items-center justify-between px-4 md:px-6">
                <h1 className="text-sm font-semibold text-zinc-800">
                    Hostel Finder Admin
                </h1>
                <div className="flex items-center gap-3 md:gap-4">
                    <span className="hidden text-sm text-zinc-600 sm:inline">
                        {user?.name || "Admin"}
                    </span>
                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Logout
                        </button>
                    </form>
                </div>
            </header>
            <nav className="flex gap-1 overflow-x-auto border-t border-zinc-100 px-3 py-2 md:hidden">
                {mobileLinks.map(([href, label]) => (
                    <Link key={href} href={href} className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-indigo-50 hover:text-indigo-700">
                        {label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
