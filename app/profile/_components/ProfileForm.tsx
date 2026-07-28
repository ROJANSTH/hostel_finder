"use client";

import { useActionState, useEffect, useState } from "react";
import { updateProfileAction } from "@/actions/user.actions";
import { useAuth } from "@/lib/context/AuthContext";
import { User, UserActionState } from "@/lib/types/auth.types";
import { getProfileImageUrl } from "@/lib/utils/image";

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

export default function ProfileForm({ user }: { user: User }) {
    const { refreshUser, setUser } = useAuth();
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        getProfileImageUrl(user.profileImage)
    );
    const [state, formAction, isPending] = useActionState(
        updateProfileAction,
        initialState
    );

    useEffect(() => {
        if (state.success && state.user) {
            setUser(state.user);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPreviewUrl(getProfileImageUrl(state.user.profileImage));
            refreshUser();
        }
    }, [state.success, state.user, setUser, refreshUser]);

    return (
        <form action={formAction} className="space-y-5" noValidate>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="h-24 w-24 rounded-full border border-zinc-200 object-cover"
                    />
                ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-2xl font-semibold text-indigo-700">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="flex-1">
                    <label
                        htmlFor="profileImage"
                        className="block text-sm font-medium text-zinc-700"
                    >
                        Profile Image
                    </label>
                    <input
                        id="profileImage"
                        name="profileImage"
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="mt-1 block w-full text-sm text-zinc-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                        onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                                setPreviewUrl(URL.createObjectURL(file));
                            }
                        }}
                    />
                    <p className="mt-1 text-xs text-zinc-500">
                        JPG, PNG, GIF or WEBP. Max 5MB.
                    </p>
                </div>
            </div>

            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-zinc-700"
                >
                    Full Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={user.name}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <FieldError errors={state.fieldErrors?.name} />
            </div>

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
                    defaultValue={user.email}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <FieldError errors={state.fieldErrors?.email} />
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
                {isPending ? "Saving..." : "Save Profile"}
            </button>
        </form>
    );
}
