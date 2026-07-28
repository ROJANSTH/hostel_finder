"use client";

import { useActionState } from "react";
import { updatePasswordAction } from "@/actions/user.actions";
import { UserActionState } from "@/lib/types/auth.types";

const initialState: UserActionState = {
    success: false,
    message: "",
};

function FieldError({ errors }: { errors?: string[] }) {
    if (!errors?.length) return null;
    return (
        <p className="mt-1 text-sm text-red-600" role="alert">
            {errors[0]}
        </p>
    );
}

export default function PasswordForm() {
    const [state, formAction, isPending] = useActionState(
        updatePasswordAction,
        initialState
    );

    return (
        <form action={formAction} className="space-y-5" noValidate>
            <div>
                <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-zinc-700"
                >
                    Current Password
                </label>
                <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your current password"
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <FieldError errors={state.fieldErrors?.currentPassword} />
            </div>

            <div>
                <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-zinc-700"
                >
                    New Password
                </label>
                <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <FieldError errors={state.fieldErrors?.newPassword} />
            </div>

            <div>
                <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-zinc-700"
                >
                    Confirm New Password
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Re-enter your new password"
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <FieldError errors={state.fieldErrors?.confirmPassword} />
            </div>

            {state.message && (
                <p
                    className={`rounded-lg px-4 py-3 text-sm ${
                        state.success
                            ? "bg-emerald-50 text-emerald-800"
                            : state.fieldErrors
                              ? "bg-amber-50 text-amber-800"
                              : "bg-red-50 text-red-700"
                    }`}
                    role="alert"
                >
                    {state.message}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPending ? "Updating..." : "Update Password"}
            </button>
        </form>
    );
}
