"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
    { href: "/admin", label: "Overview", exact: true },
    { href: "/admin/users", label: "Users" },
];

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

    return (
        <aside className="hidden w-56 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 md:flex">
            <div className="flex h-14 items-center border-b border-zinc-200 px-5">
                <span className="text-sm font-bold uppercase tracking-widest text-indigo-700">
                    Admin
                </span>
            </div>

            <nav className="flex flex-1 flex-col gap-1 p-3">
                {NAV.map(({ href, label, exact }) => {
                    const active = isActive(href, exact);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                active
                                    ? "bg-white text-indigo-700 shadow-sm"
                                    : "text-zinc-500 hover:bg-white hover:text-zinc-700"
                            }`}
                        >
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-zinc-200 p-3">
                <Link
                    href="/dashboard"
                    className="block rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition hover:text-zinc-600"
                >
                    ← Back to app
                </Link>
            </div>
        </aside>
    );
}
