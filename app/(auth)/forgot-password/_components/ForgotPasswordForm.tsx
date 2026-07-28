"use client";

import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";
import {
    requestPasswordResetAction,
    resetPasswordWithCodeAction,
} from "@/actions/auth.actions";

type Step = "email" | "code" | "success";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [step, setStep] = useState<Step>("email");
    const [message, setMessage] = useState("");
    const [pending, startTransition] = useTransition();

    function requestCode(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");
        startTransition(async () => {
            const result = await requestPasswordResetAction(email);
            setMessage(result.message);
            if (result.success) setStep("code");
        });
    }

    function resetPassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");
        const formData = new FormData(event.currentTarget);
        const newPassword = String(formData.get("newPassword") ?? "");
        const confirmPassword = String(formData.get("confirmPassword") ?? "");
        if (newPassword !== confirmPassword) {
            setMessage("New password and confirmation do not match.");
            return;
        }

        startTransition(async () => {
            const result = await resetPasswordWithCodeAction({
                email,
                code: String(formData.get("code") ?? ""),
                newPassword,
            });
            setMessage(result.message);
            if (result.success) setStep("success");
        });
    }

    if (step === "success") {
        return (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800" role="status">
                <p className="font-semibold">Password reset complete</p>
                <p className="mt-1">{message}</p>
                <Link
                    href="/login"
                    className="mt-4 inline-block font-semibold text-indigo-700 hover:text-indigo-600"
                >
                    Continue to login
                </Link>
            </div>
        );
    }

    if (step === "code") {
        return (
            <form className="space-y-5" onSubmit={resetPassword}>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800" role="status">
                    <p className="font-semibold">Check your email</p>
                    <p className="mt-1">{message}</p>
                </div>

                <div>
                    <label htmlFor="resetCode" className="block text-sm font-medium text-zinc-700">
                        Six-digit reset code
                    </label>
                    <input
                        id="resetCode"
                        name="code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        required
                        placeholder="000000"
                        className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 tracking-[0.35em] text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                </div>

                <PasswordField id="newPassword" label="New password" />
                <PasswordField id="confirmPassword" label="Confirm new password" />

                {message && !message.startsWith("If an active") && (
                    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={pending}
                    className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                    {pending ? "Resetting password…" : "Reset password"}
                </button>

                <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                        setMessage("");
                        startTransition(async () => {
                            const result = await requestPasswordResetAction(email);
                            setMessage(result.message);
                        });
                    }}
                    className="w-full text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-60"
                >
                    Send another code
                </button>
            </form>
        );
    }

    return (
        <form className="space-y-5" onSubmit={requestCode}>
            <div>
                <label htmlFor="recoveryEmail" className="block text-sm font-medium text-zinc-700">
                    Account email address
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

            {message && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                    {message}
                </p>
            )}

            <button
                type="submit"
                disabled={pending}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
                {pending ? "Sending code…" : "Send reset code"}
            </button>
        </form>
    );
}

function PasswordField({ id, label }: { id: string; label: string }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-zinc-700">
                {label}
            </label>
            <input
                id={id}
                name={id}
                type="password"
                autoComplete="new-password"
                minLength={6}
                maxLength={100}
                required
                placeholder="At least 6 characters"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
        </div>
    );
}
