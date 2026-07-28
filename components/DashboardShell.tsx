"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth.actions";
import { useAuth } from "@/lib/context/AuthContext";
import { useLocale } from "@/lib/context/LocaleContext";

type IconName =
    | "dashboard"
    | "explore"
    | "saved"
    | "bookings"
    | "notifications"
    | "profile"
    | "owner"
    | "logout";

function NavIcon({ name }: { name: IconName }) {
    const paths: Record<IconName, React.ReactNode> = {
        dashboard: <><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" /></>,
        explore: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
        saved: <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />,
        bookings: <><path d="M5 3v3M19 3v3M3 9h18M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2Z" /><path d="m8 14 2 2 5-5" /></>,
        notifications: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></>,
        profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
        owner: <><path d="M3 10 12 3l9 7v11H3Z" /><path d="M9 21v-7h6v7" /></>,
        logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M14 4h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-6" /></>,
    };

    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {paths[name]}
        </svg>
    );
}

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, loading, profileImageUrl } = useAuth();
    const { locale, setLocale, t } = useLocale();
    const navLinks: { href: string; label: string; icon: IconName }[] = [
        { href: "/dashboard", label: t.dashboard, icon: "dashboard" },
        { href: "/hostels", label: t.explore, icon: "explore" },
        { href: "/saved", label: t.saved, icon: "saved" },
        { href: "/bookings", label: t.bookings, icon: "bookings" },
        { href: "/notifications", label: t.notifications, icon: "notifications" },
        { href: "/profile", label: t.profile, icon: "profile" },
        ...(user?.role === "owner"
            ? [{ href: "/owner", label: t.owner, icon: "owner" as const }]
            : []),
    ];

    return (
        <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
            <header className="border-b border-zinc-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="text-xl font-bold text-indigo-700"
                        >
                            {t.brand}
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
                        <button type="button" onClick={() => setLocale(locale === "en" ? "ne" : "en")} className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-600">{locale === "en" ? "नेपाली" : "English"}</button>
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-indigo-100 text-indigo-700"
                                            : "text-zinc-600 hover:bg-zinc-100"
                                    }`}
                                >
                                    <NavIcon name={link.icon} />
                                    {link.label}
                                </Link>
                            );
                        })}
                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                            >
                                <NavIcon name="logout" />
                                {t.logout}
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
                {children}
            </main>
        </div>
    );
}
