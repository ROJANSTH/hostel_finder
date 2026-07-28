"use client";

import { useState, useTransition } from "react";
import { updateBookingStatusAction } from "@/actions/admin-hostel.actions";

const bookingStatuses = ["pending", "confirmed", "cancelled", "completed"];
const paymentStatuses = ["unpaid", "pending", "paid", "refunded"];

export default function BookingStatus({
    id,
    status,
    paymentStatus,
}: {
    id: string;
    status: string;
    paymentStatus: string;
}) {
    const [bookingValue, setBookingValue] = useState(status);
    const [paymentValue, setPaymentValue] = useState(paymentStatus);
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState("");

    function update(field: "status" | "paymentStatus", value: string) {
        const previous = field === "status" ? bookingValue : paymentValue;
        if (field === "status") setBookingValue(value);
        else setPaymentValue(value);
        setError("");

        startTransition(async () => {
            const result = await updateBookingStatusAction(id, field, value);
            if (!result.success) {
                if (field === "status") setBookingValue(previous);
                else setPaymentValue(previous);
                setError(result.message);
            }
        });
    }

    return (
        <div className="flex min-w-36 flex-col gap-2">
            <label className="text-xs font-medium text-zinc-500">
                Booking
                <select
                    aria-label="Booking status"
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm capitalize text-zinc-800"
                    disabled={pending}
                    value={bookingValue}
                    onChange={(event) => update("status", event.target.value)}
                >
                    {bookingStatuses.map((value) => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
            </label>
            <label className="text-xs font-medium text-zinc-500">
                Payment
                <select
                    aria-label="Payment status"
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm capitalize text-zinc-800"
                    disabled={pending}
                    value={paymentValue}
                    onChange={(event) => update("paymentStatus", event.target.value)}
                >
                    {paymentStatuses.map((value) => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
            </label>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
