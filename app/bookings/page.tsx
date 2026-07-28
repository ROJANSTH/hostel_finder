import Image from "next/image";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import { getBookings } from "@/lib/api/hostel.api";
import { Booking } from "@/lib/types/hostel.types";
import CancelButton from "./CancelButton";
import KhaltiPaymentButton from "./KhaltiPaymentButton";

const statusStyles: Record<Booking["status"], string> = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    cancelled: "bg-red-50 text-red-700 ring-red-200",
    completed: "bg-indigo-50 text-indigo-700 ring-indigo-200",
};

function BookingCard({ booking }: { booking: Booking }) {
    const hostel = booking.hostel;
    const cancellable = ["pending", "confirmed"].includes(booking.status);

    return (
        <article id={booking._id} className="scroll-mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="grid sm:grid-cols-[180px_1fr]">
                <div className="relative min-h-40 bg-gradient-to-br from-indigo-500 to-violet-600">
                    {hostel?.images?.[0] ? (
                        <Image
                            src={hostel.images[0]}
                            alt={hostel.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 180px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full min-h-40 items-center justify-center text-5xl">🏠</div>
                    )}
                </div>
                <div className="p-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                                Booking #{booking._id.slice(-6).toUpperCase()}
                            </p>
                            <h2 className="mt-1 text-xl font-bold text-zinc-900">
                                {hostel?.name ?? "Unavailable hostel"}
                            </h2>
                            {hostel && <p className="text-sm text-zinc-500">{hostel.city}</p>}
                        </div>
                        <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${statusStyles[booking.status]}`}>
                            {booking.status}
                        </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-zinc-50 p-4 sm:grid-cols-4">
                        <div><p className="text-xs text-zinc-500">Check in</p><p className="mt-1 text-sm font-semibold">{new Date(booking.checkIn).toLocaleDateString()}</p></div>
                        <div><p className="text-xs text-zinc-500">Check out</p><p className="mt-1 text-sm font-semibold">{new Date(booking.checkOut).toLocaleDateString()}</p></div>
                        <div><p className="text-xs text-zinc-500">Guests</p><p className="mt-1 text-sm font-semibold">{booking.guests}</p></div>
                        <div><p className="text-xs text-zinc-500">Total</p><p className="mt-1 text-sm font-bold text-indigo-700">NPR {booking.totalPrice.toLocaleString()}</p></div>
                    </div>
                    <p className="mt-3 text-xs capitalize text-zinc-500">Payment: {booking.paymentMethod} · {booking.paymentStatus}</p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        {hostel ? <Link href={`/hostels/${hostel._id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">View hostel →</Link> : <span />}
                        <div className="flex flex-wrap gap-2">
                            {booking.paymentMethod === "khalti" && booking.paymentStatus === "pending" && booking.status !== "cancelled" && (
                                <KhaltiPaymentButton bookingId={booking._id} amount={booking.totalPrice} />
                            )}
                            {cancellable && <CancelButton id={booking._id} />}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default async function BookingsPage() {
    const result = await getBookings();

    return (
        <DashboardShell>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Your stays</p>
                    <h1 className="mt-1 text-3xl font-bold text-zinc-900">My bookings</h1>
                    <p className="mt-2 text-zinc-500">Review dates, totals, booking status, and cancellations.</p>
                </div>
                <Link href="/hostels" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700">Book another hostel</Link>
            </div>

            {!result.success ? (
                <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                    <h2 className="font-bold">Could not load bookings</h2>
                    <p className="mt-1 text-sm">{result.message}</p>
                </div>
            ) : result.data.length ? (
                <div className="mt-8 space-y-5">{result.data.map((booking) => <BookingCard key={booking._id} booking={booking} />)}</div>
            ) : (
                <div className="mt-8 rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center">
                    <div className="text-5xl">🛏️</div>
                    <h2 className="mt-4 text-xl font-bold">No bookings yet</h2>
                    <p className="mt-2 text-zinc-500">Explore available hostels and reserve your first stay.</p>
                    <Link href="/hostels" className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white">Explore hostels</Link>
                </div>
            )}
        </DashboardShell>
    );
}
