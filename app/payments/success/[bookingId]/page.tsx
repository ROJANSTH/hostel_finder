import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import { getBooking } from "@/lib/api/hostel.api";

export default async function PaymentSuccessPage({
    params,
}: {
    params: Promise<{ bookingId: string }>;
}) {
    const { bookingId } = await params;
    const result = await getBooking(bookingId);
    if (!result.success) notFound();
    const booking = result.data;
    if (booking.paymentStatus !== "paid") redirect(`/bookings#${bookingId}`);

    return (
        <DashboardShell>
            <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-xl">
                <div className="bg-emerald-600 px-8 py-10 text-center text-white">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl font-black text-emerald-600">✓</div>
                    <h1 className="mt-4 text-3xl font-black">Payment successful</h1>
                    <p className="mt-2 text-emerald-100">Your demo Khalti payment has been recorded.</p>
                </div>
                <div className="p-8">
                    <div className="grid gap-4 rounded-2xl bg-zinc-50 p-5 sm:grid-cols-2">
                        <div><p className="text-xs uppercase tracking-wide text-zinc-500">Hostel</p><p className="mt-1 font-bold">{booking.hostel?.name}</p></div>
                        <div><p className="text-xs uppercase tracking-wide text-zinc-500">Booking</p><p className="mt-1 font-bold">#{booking._id.slice(-6).toUpperCase()}</p></div>
                        <div><p className="text-xs uppercase tracking-wide text-zinc-500">Amount paid</p><p className="mt-1 font-bold text-emerald-700">NPR {(booking.paymentAmount ?? booking.totalPrice).toLocaleString()}</p></div>
                        <div><p className="text-xs uppercase tracking-wide text-zinc-500">Payment method</p><p className="mt-1 font-bold">Khalti Demo</p></div>
                        <div className="sm:col-span-2"><p className="text-xs uppercase tracking-wide text-zinc-500">Transaction ID</p><p className="mt-1 break-all font-mono text-sm font-bold">{booking.transactionId}</p></div>
                        <div className="sm:col-span-2"><p className="text-xs uppercase tracking-wide text-zinc-500">Paid at</p><p className="mt-1 font-semibold">{booking.paymentTimestamp ? new Date(booking.paymentTimestamp).toLocaleString() : "Just now"}</p></div>
                    </div>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Link href="/bookings" className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white">View all bookings</Link>
                        <Link href={`/hostels/${booking.hostel?._id}`} className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-bold text-zinc-700">View hostel</Link>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}
