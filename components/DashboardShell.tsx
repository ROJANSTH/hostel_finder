"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth.actions";
import { useAuth } from "@/lib/context/AuthContext";

const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
    { href: "/password", label: "Password" },
];

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, loading, profileImageUrl } = useAuth();

    return (
        <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
            <header className="border-b border-zinc-200 bg-white">
                <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="text-xl font-bold text-indigo-700"
                        >
                            Hostel Finder
                        </Link>
                        {!loading && user && (
                            <div className="flex items-center gap-2 text-sm text-zinc-600">
                                {profileImageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={profileImageUrl}
                                        alt={user.name}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                                <span>{user.name}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-indigo-100 text-indigo-700"
                                            : "text-zinc-600 hover:bg-zinc-100"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                            >
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
                {children}
            </main>
        </div>
    );
}
