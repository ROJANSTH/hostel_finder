"use client";

import { FormEvent, useState } from "react";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitted(true);
    }

    if (submitted) {
        return (
            <div
                className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                role="status"
            >
                <p className="font-semibold">Recovery request received</p>
                <p className="mt-1">
                    If an account exists for {email}, password recovery
                    instructions will be sent after the reset API is connected.
                </p>
            </div>
        );
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
                <label
                    htmlFor="recoveryEmail"
                    className="block text-sm font-medium text-zinc-700"
                >
                    Email address
                </label>
                <input
                    id="recoveryEmail"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
            </div>

            <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
                Request password reset
            </button>
        </form>
    );
}
