"use client";

import { useState, useTransition } from "react";
import { initiateKhaltiPaymentAction } from "@/actions/payment.actions";

export default function KhaltiPaymentButton({
    bookingId,
    amount,
}: {
    bookingId: string;
    amount: number;
}) {
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState("");

    function pay() {
        setError("");
        startTransition(async () => {
            const result = await initiateKhaltiPaymentAction(bookingId);
            if (result.success && result.data?.payment_url) {
                window.location.assign(result.data.payment_url);
                return;
            }
            setError(result.message || "Khalti payment could not be started.");
        });
    }

    return (
        <div className="flex flex-col items-end gap-1">
            <button
                type="button"
                onClick={pay}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-lg bg-[#5c2d91] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#4c2479] disabled:cursor-wait disabled:opacity-70"
            >
                {pending && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {pending
                    ? "Opening Khalti…"
                    : `Pay NPR ${amount.toLocaleString()} with Khalti`}
            </button>
            {error && (
                <p className="max-w-xs text-right text-xs font-medium text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
