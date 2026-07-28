import Link from "next/link";
import { authRequest } from "@/lib/api/client";

interface Stats {
    users: number;
    activeUsers: number;
    suspendedUsers: number;
    owners: number;
    hostels: number;
    pendingHostels: number;
    bookings: number;
    activeBookings: number;
    unpaidBookings: number;
    reviews: number;
    revenue: number;
}

const emptyStats: Stats = {
    users: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    owners: 0,
    hostels: 0,
    pendingHostels: 0,
    bookings: 0,
    activeBookings: 0,
    unpaidBookings: 0,
    reviews: 0,
    revenue: 0,
};

export default async function AdminPage() {
    const result = await authRequest<Stats>("/admin/hostels/stats");
    const stats = result.success ? result.data : emptyStats;
    const cards = [
        { label: "Registered users", value: stats.users.toLocaleString(), note: `${stats.activeUsers} active · ${stats.suspendedUsers} suspended`, href: "/admin/users" },
        { label: "Owners", value: stats.owners.toLocaleString(), note: "Active property managers", href: "/admin/users?role=owner&status=active" },
        { label: "Hostels", value: stats.hostels.toLocaleString(), note: `${stats.pendingHostels} awaiting review`, href: "/admin/hostels" },
        { label: "Bookings", value: stats.bookings.toLocaleString(), note: `${stats.activeBookings} active`, href: "/admin/bookings" },
        { label: "Paid revenue", value: `NPR ${stats.revenue.toLocaleString()}`, note: `${stats.unpaidBookings} payments need attention`, href: "/admin/bookings?paymentStatus=unpaid" },
        { label: "Reviews", value: stats.reviews.toLocaleString(), note: "Customer feedback", href: "/admin/reviews" },
    ];

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Platform overview</h1>
                    <p className="mt-1 text-sm text-zinc-600">Live operations, moderation queues, and revenue controls.</p>
                </div>
                <Link href="/admin/activity" className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
                    View audit log
                </Link>
            </div>

            {!result.success && <p className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">{result.message}</p>}
            {(stats.pendingHostels > 0 || stats.unpaidBookings > 0) && (
                <section className="mt-6 grid gap-3 md:grid-cols-2">
                    {stats.pendingHostels > 0 && (
                        <Link href="/admin/hostels?moderationStatus=pending" className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
                            <strong>{stats.pendingHostels} hostel {stats.pendingHostels === 1 ? "submission needs" : "submissions need"} approval</strong>
                            <p className="mt-1 text-sm text-amber-800">Open the moderation queue →</p>
                        </Link>
                    )}
                    {stats.unpaidBookings > 0 && (
                        <Link href="/admin/bookings?paymentStatus=unpaid" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-950">
                            <strong>{stats.unpaidBookings} active {stats.unpaidBookings === 1 ? "booking has" : "bookings have"} unpaid or pending payment</strong>
                            <p className="mt-1 text-sm text-rose-800">Review payment records →</p>
                        </Link>
                    )}
                </section>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                    <Link key={card.label} href={card.href} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
                        <p className="text-sm font-medium text-zinc-600">{card.label}</p>
                        <p className="mt-2 text-2xl font-bold text-zinc-900">{card.value}</p>
                        <p className="mt-2 text-xs text-zinc-500">{card.note}</p>
                    </Link>
                ))}
            </div>

            <section className="mt-8">
                <h2 className="text-lg font-bold text-zinc-900">Administration</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        ["/admin/users", "Accounts & roles"],
                        ["/admin/hostels", "Listing moderation"],
                        ["/admin/bookings", "Bookings & payments"],
                        ["/admin/reviews", "Review moderation"],
                        ["/admin/reports", "Reports & exports"],
                        ["/admin/announcements", "User notifications"],
                        ["/admin/activity", "Security audit trail"],
                    ].map(([href, label]) => (
                        <Link key={href} href={href} className="rounded-xl bg-indigo-700 px-5 py-4 font-semibold text-white shadow-sm hover:bg-indigo-800">
                            {label} →
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
