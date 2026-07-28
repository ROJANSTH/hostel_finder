"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { processDemoKhaltiPayment } from "@/actions/payment.actions";

interface Props {
    bookingId: string;
    hostelName: string;
    amount: number;
}

export default function KhaltiDemoPayment({ bookingId, hostelName, amount }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !pending) setOpen(false);
        };
        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [open, pending]);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        const data = new FormData(event.currentTarget);
        startTransition(async () => {
            const result = await processDemoKhaltiPayment({
                bookingId,
                mobile: String(data.get("mobile") ?? ""),
                pin: String(data.get("pin") ?? ""),
                otp: String(data.get("otp") ?? ""),
                outcome: String(data.get("outcome") ?? "success") as "success" | "failure" | "random",
            });
            if (result.success) {
                router.push(`/payments/success/${bookingId}`);
                return;
            }
            setError(result.message || "Demo payment failed. Please try again.");
        });
    }

    return (
        <>
            <button
                type="button"
                onClick={() => { setError(""); setOpen(true); }}
                className="rounded-lg bg-[#5c2d91] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#4c2479]"
            >
                Pay with Khalti
            </button>

            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={`khalti-title-${bookingId}`}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !pending) setOpen(false);
                    }}
                >
                    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <header className="bg-[#5c2d91] px-6 py-5 text-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200">Development demo</p>
                                    <h2 id={`khalti-title-${bookingId}`} className="mt-1 text-2xl font-black">Khalti Payment</h2>
                                </div>
                                <button type="button" disabled={pending} onClick={() => setOpen(false)} aria-label="Close payment dialog" className="text-2xl leading-none text-purple-100">×</button>
                            </div>
                        </header>

                        <form onSubmit={submit} className="space-y-4 p-6">
                            <div className="rounded-xl bg-purple-50 p-4">
                                <p className="text-sm font-semibold text-zinc-800">{hostelName}</p>
                                <p className="mt-1 text-2xl font-black text-[#5c2d91]">NPR {amount.toLocaleString()}</p>
                                <p className="mt-2 text-xs text-purple-700">Offline simulation—no money or real Khalti account is used.</p>
                            </div>

                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                                Demo credentials: <strong>9800000000</strong> · PIN <strong>1234</strong> · OTP <strong>123456</strong>
                            </div>

                            <label className="block text-sm font-semibold text-zinc-700">
                                Khalti mobile number
                                <input required name="mobile" inputMode="numeric" pattern="98[0-9]{8}" maxLength={10} defaultValue="9800000000" className="mt-1.5 w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100" />
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="text-sm font-semibold text-zinc-700">
                                    MPIN
                                    <input required name="pin" type="password" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} defaultValue="1234" className="mt-1.5 w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none focus:border-purple-500" />
                                </label>
                                <label className="text-sm font-semibold text-zinc-700">
                                    OTP
                                    <input required name="otp" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} defaultValue="123456" className="mt-1.5 w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none focus:border-purple-500" />
                                </label>
                            </div>
                            <label className="block text-sm font-semibold text-zinc-700">
                                Test outcome
                                <select name="outcome" defaultValue="success" className="mt-1.5 w-full rounded-xl border border-zinc-300 px-3 py-2.5">
                                    <option value="success">Force success</option>
                                    <option value="failure">Force failure</option>
                                    <option value="random">Random result</option>
                                </select>
                            </label>

                            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}

                            <button disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5c2d91] px-4 py-3 font-bold text-white disabled:cursor-wait disabled:opacity-70">
                                {pending && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                                {pending ? "Processing demo payment…" : `Pay NPR ${amount.toLocaleString()}`}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
