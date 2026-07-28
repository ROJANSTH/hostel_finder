"use client";

import { useActionState } from "react";
import { createBookingAction } from "@/actions/hostel.actions";

const initialState = { success: false, message: "" };

export default function QuickBookingForm({ hostelId }: { hostelId: string }) {
    const [state, action, pending] = useActionState(
        createBookingAction.bind(null, hostelId),
        initialState
    );

    const today = new Date().toISOString().slice(0, 10);

    return (
        <details className="mt-4 border-t border-zinc-100 pt-4">
            <summary className="cursor-pointer list-none rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-indigo-700">
                Book from here
            </summary>
            <form action={action} className="mt-3 grid grid-cols-2 gap-2">
                <label className="text-xs font-medium text-zinc-600">
                    Check in
                    <input
                        required
                        min={today}
                        name="checkIn"
                        type="date"
                        className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-2 text-sm"
                    />
                </label>
                <label className="text-xs font-medium text-zinc-600">
                    Check out
                    <input
                        required
                        min={today}
                        name="checkOut"
                        type="date"
                        className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-2 text-sm"
                    />
                </label>
                <label className="col-span-2 text-xs font-medium text-zinc-600">
                    Guests
                    <input
                        required
                        name="guests"
                        type="number"
                        min="1"
                        defaultValue="1"
                        className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-2 text-sm"
                    />
                </label>
                <label className="col-span-2 text-xs font-medium text-zinc-600">
                    Payment method
                    <select name="paymentMethod" defaultValue="cash" className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-2 text-sm">
                        <option value="cash">Pay at hostel</option>
                        <option value="esewa">eSewa</option>
                        <option value="khalti">Khalti</option>
                    </select>
                </label>
                <button
                    disabled={pending}
                    className="col-span-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                >
                    {pending ? "Booking..." : "Confirm booking"}
                </button>
                {state.message && (
                    <p className={`col-span-2 text-xs ${state.success ? "text-emerald-600" : "text-red-600"}`}>
                        {state.message}
                    </p>
                )}
            </form>
        </details>
    );
}
