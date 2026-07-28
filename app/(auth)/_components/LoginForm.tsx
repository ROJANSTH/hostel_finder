"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth.actions";
import { AuthActionState } from "@/lib/types/auth.types";

const initialState: AuthActionState = {
    success: false,
    message: "",
};

function FieldError({
    errors,
}: {
    errors?: string[];
}) {
    if (!errors?.length) return null;
    return (
        <p className="mt-1 text-sm text-red-600" role="alert">
            {errors[0]}
        </p>
    );
}

export default function LoginForm({
    redirectTo,
}: {
    redirectTo?: string;
}) {
    const [state, formAction, isPending] = useActionState(
        loginAction,
        initialState
    );

    return (
        <form action={formAction} className="space-y-5" noValidate>
            {redirectTo && (
                <input type="hidden" name="redirect" value={redirectTo} />
            )}
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-zinc-700"
                >
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <FieldError errors={state.fieldErrors?.email} />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-zinc-700"
                >
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <FieldError errors={state.fieldErrors?.password} />
                <div className="mt-2 text-right">
                    <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Forgot password?
                    </Link>
                </div>
            </div>

            {!state.success && state.message && !state.fieldErrors && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                    {state.message}
                </p>
            )}

            {!state.success && state.message && state.fieldErrors && (
                <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
                    {state.message}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPending ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-center text-sm text-zinc-600">
                Don&apos;t have an account?{" "}
                <Link
                    href="/register"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    Create one
                </Link>
            </p>
        </form>
    );
}
