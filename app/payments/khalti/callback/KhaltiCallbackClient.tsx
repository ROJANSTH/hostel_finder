"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyKhaltiPaymentAction } from "@/actions/payment.actions";

export default function KhaltiCallbackClient({
    bookingId,
    pidx,
}: {
    bookingId?: string;
    pidx?: string;
}) {
    const router = useRouter();
    const started = useRef(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!bookingId || !pidx || started.current) return;
        started.current = true;

        void verifyKhaltiPaymentAction(bookingId, pidx).then((result) => {
            if (result.success) {
                router.replace(`/payments/success/${bookingId}`);
                return;
            }
            setError(result.message || "Khalti payment could not be verified.");
        });
    }, [bookingId, pidx, router]);

    if (!bookingId || !pidx) {
        return (
            <PaymentMessage
                title="Invalid Khalti callback"
                message="The payment reference or booking information is missing."
                bookingId={bookingId}
            />
        );
    }

    if (error) {
        return (
            <PaymentMessage
                title="Payment could not be verified"
                message={error}
                bookingId={bookingId}
            />
        );
    }

    return (
        <div className="mx-auto max-w-xl rounded-3xl border border-purple-200 bg-white p-8 text-center shadow-sm">
            <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-[#5c2d91]" />
            <h1 className="mt-5 text-2xl font-bold text-zinc-900">
                Verifying your Khalti payment
            </h1>
            <p className="mt-2 text-zinc-600">
                Please keep this page open while payment confirmation is checked.
            </p>
        </div>
    );
}

function PaymentMessage({
    title,
    message,
    bookingId,
}: {
    title: string;
    message: string;
    bookingId?: string;
}) {
    return (
        <div className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm">
            <div className="text-4xl">!</div>
            <h1 className="mt-4 text-2xl font-bold text-zinc-900">{title}</h1>
            <p className="mt-2 text-zinc-600">{message}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                    href={bookingId ? `/bookings#${bookingId}` : "/bookings"}
                    className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white"
                >
                    Return to bookings
                </Link>
                <Link
                    href="/notifications"
                    className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-bold text-zinc-700"
                >
                    View notifications
                </Link>
            </div>
        </div>
    );
}
