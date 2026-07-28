"use client";
import { useActionState, useState, useTransition } from "react";
import { createBookingAction, reviewAction, toggleSavedAction } from "@/actions/hostel.actions";

const initial = { success: false, message: "" };
export default function HostelActions({ id }: { id: string }) {
    const [booking, bookingAction, bookingPending] = useActionState(createBookingAction.bind(null, id), initial);
    const [review, reviewSubmit, reviewPending] = useActionState(reviewAction.bind(null, id), initial);
    const [saved, setSaved] = useState(false); const [saving, startSaving] = useTransition();
    return <div className="space-y-6">
        <button onClick={() => startSaving(async () => { const r = await toggleSavedAction(id); if (r.success) setSaved(r.data.saved); })} className="w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 font-semibold text-indigo-700">{saving ? "Saving..." : saved ? "♥ Saved" : "♡ Save hostel"}</button>
        <form action={bookingAction} className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"><h3 className="font-bold">Book your stay</h3><label className="block text-sm">Check in<input required name="checkIn" type="date" className="mt-1 w-full rounded-lg border p-2" /></label><label className="block text-sm">Check out<input required name="checkOut" type="date" className="mt-1 w-full rounded-lg border p-2" /></label><label className="block text-sm">Guests<input required name="guests" type="number" min="1" defaultValue="1" className="mt-1 w-full rounded-lg border p-2" /></label><label className="block text-sm">Payment<select name="paymentMethod" defaultValue="cash" className="mt-1 w-full rounded-lg border p-2"><option value="cash">Pay at hostel</option><option value="esewa">eSewa</option><option value="khalti">Khalti</option></select></label><button disabled={bookingPending} className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-bold text-white">{bookingPending ? "Booking..." : "Reserve now"}</button>{booking.message && <p className={`text-sm ${booking.success ? "text-emerald-600" : "text-red-600"}`}>{booking.message}</p>}</form>
        <form action={reviewSubmit} className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5"><h3 className="font-bold">Write a review</h3><select name="rating" className="w-full rounded-lg border p-2" defaultValue="5">{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}</select><textarea required name="comment" minLength={5} placeholder="Tell others about your stay" className="w-full rounded-lg border p-2" rows={3}/><button disabled={reviewPending} className="rounded-lg bg-zinc-900 px-4 py-2 font-semibold text-white">Submit review</button>{review.message && <p className="text-sm">{review.message}</p>}</form>
    </div>;
}
