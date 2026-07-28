import Link from "next/link";
import { authRequest } from "@/lib/api/client";
import BookingStatus from "./BookingStatus";

interface BookingRow {
    _id: string;
    user?: { name: string; email: string; status?: string };
    hostel?: { name: string; city: string };
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    createdAt: string;
}

type Query = { [key: string]: string | string[] | undefined };

function pageHref(query: Query, page: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (typeof value === "string" && value) params.set(key, value);
    }
    params.set("page", String(page));
    return `/admin/bookings?${params}`;
}

export default async function AdminBookingsPage({
    searchParams,
}: {
    searchParams: Promise<Query>;
}) {
    const query = await searchParams;
    const page = Math.max(1, Number(query.page) || 1);
    const search = typeof query.search === "string" ? query.search : "";
    const status = typeof query.status === "string" ? query.status : "";
    const paymentStatus = typeof query.paymentStatus === "string" ? query.paymentStatus : "";
    const paymentMethod = typeof query.paymentMethod === "string" ? query.paymentMethod : "";
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (paymentStatus) params.set("paymentStatus", paymentStatus);
    if (paymentMethod) params.set("paymentMethod", paymentMethod);

    const result = await authRequest<BookingRow[]>(`/admin/hostels/bookings?${params}`);
    const rows = result.success ? result.data : [];
    const meta = result.meta ?? { page: 1, limit: 20, total: rows.length, totalPages: 1 };

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Booking & payment management</h1>
                    <p className="mt-1 text-sm text-zinc-600">
                        Search reservations and reconcile booking and payment states.
                    </p>
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                    {meta.total} bookings
                </span>
            </div>

            <form className="mt-6 grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 md:grid-cols-[2fr_repeat(3,1fr)_auto]">
                <input
                    name="search"
                    defaultValue={search}
                    placeholder="Guest, email, hostel, or city"
                    className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
                />
                <select name="status" defaultValue={status} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800">
                    <option value="">All bookings</option>
                    {["pending", "confirmed", "cancelled", "completed"].map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
                <select name="paymentStatus" defaultValue={paymentStatus} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800">
                    <option value="">All payments</option>
                    {["unpaid", "pending", "paid", "refunded"].map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
                <select name="paymentMethod" defaultValue={paymentMethod} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800">
                    <option value="">All methods</option>
                    {["cash", "esewa", "khalti"].map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
                <button className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700">Filter</button>
            </form>

            {!result.success && <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{result.message}</div>}
            <div className="mt-5 overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
                <table className="w-full min-w-[1050px] text-left text-sm">
                    <thead className="bg-zinc-50 text-zinc-600">
                        <tr>
                            {["Guest", "Hostel", "Stay", "Guests", "Total", "Payment", "Controls"].map((heading) => (
                                <th className="p-4 font-semibold" key={heading}>{heading}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((booking) => (
                            <tr key={booking._id} className="border-t border-zinc-100 align-top text-zinc-800">
                                <td className="p-4">
                                    <strong>{booking.user?.name ?? "Deleted user"}</strong>
                                    <p className="text-xs text-zinc-500">{booking.user?.email ?? "—"}</p>
                                    {booking.user?.status === "suspended" && <span className="mt-1 inline-block rounded bg-red-50 px-2 py-0.5 text-xs text-red-700">Suspended</span>}
                                </td>
                                <td className="p-4">
                                    <strong>{booking.hostel?.name ?? "Archived hostel"}</strong>
                                    <p className="text-xs text-zinc-500">{booking.hostel?.city ?? "—"}</p>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    {new Date(booking.checkIn).toLocaleDateString()} – {new Date(booking.checkOut).toLocaleDateString()}
                                    <p className="mt-1 text-xs text-zinc-500">Booked {new Date(booking.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="p-4">{booking.guests}</td>
                                <td className="p-4 font-semibold">NPR {booking.totalPrice.toLocaleString()}</td>
                                <td className="p-4">
                                    <span className="capitalize">{booking.paymentMethod}</span>
                                    <p className="mt-1 text-xs capitalize text-zinc-500">{booking.paymentStatus}</p>
                                </td>
                                <td className="p-4">
                                    <BookingStatus id={booking._id} status={booking.status} paymentStatus={booking.paymentStatus} />
                                </td>
                            </tr>
                        ))}
                        {!rows.length && (
                            <tr><td colSpan={7} className="p-10 text-center text-zinc-500">No bookings match these filters.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {meta.totalPages > 1 && (
                <nav className="mt-5 flex items-center justify-between text-sm">
                    <Link
                        aria-disabled={meta.page <= 1}
                        href={pageHref(query, Math.max(1, meta.page - 1))}
                        className={`rounded-lg border px-4 py-2 ${meta.page <= 1 ? "pointer-events-none opacity-40" : "bg-white text-zinc-700"}`}
                    >
                        Previous
                    </Link>
                    <span className="text-zinc-600">Page {meta.page} of {meta.totalPages}</span>
                    <Link
                        aria-disabled={meta.page >= meta.totalPages}
                        href={pageHref(query, Math.min(meta.totalPages, meta.page + 1))}
                        className={`rounded-lg border px-4 py-2 ${meta.page >= meta.totalPages ? "pointer-events-none opacity-40" : "bg-white text-zinc-700"}`}
                    >
                        Next
                    </Link>
                </nav>
            )}
        </div>
    );
}
