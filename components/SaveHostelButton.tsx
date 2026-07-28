"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toggleSavedAction } from "@/actions/hostel.actions";

export default function SaveHostelButton({
    hostelId,
    initialSaved = false,
}: {
    hostelId: string;
    initialSaved?: boolean;
}) {
    const [saved, setSaved] = useState(initialSaved);
    const [message, setMessage] = useState("");
    const [pending, startTransition] = useTransition();

    return (
        <div>
            <button
                type="button"
                disabled={pending}
                aria-pressed={saved}
                onClick={() =>
                    startTransition(async () => {
                        const result = await toggleSavedAction(hostelId);
                        if (result.success) {
                            setSaved(result.data.saved);
                            setMessage(result.message);
                        } else {
                            setMessage(result.message);
                        }
                    })
                }
                className={`w-full rounded-lg border px-3 py-2 text-sm font-bold transition disabled:opacity-60 ${
                    saved
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : "border-zinc-300 bg-white text-zinc-700 hover:border-indigo-300 hover:text-indigo-700"
                }`}
            >
                {pending ? "Saving..." : saved ? "♥ Saved" : "♡ Save"}
            </button>
            {message && (
                <p className="mt-1 text-center text-xs text-zinc-500">
                    {message === "Not authenticated" ? (
                        <Link href="/login" className="font-semibold text-indigo-600">
                            Sign in to save
                        </Link>
                    ) : (
                        message
                    )}
                </p>
            )}
        </div>
    );
}
