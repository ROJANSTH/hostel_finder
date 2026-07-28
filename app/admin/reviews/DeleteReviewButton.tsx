"use client";

import { useState, useTransition } from "react";
import { deleteReviewAction } from "@/actions/admin-hostel.actions";

export default function DeleteReviewButton({ id }: { id: string }) {
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState("");

    return (
        <div className="text-right">
            <button
                disabled={pending}
                onClick={() => {
                    if (!window.confirm("Remove this review? The hostel rating will be recalculated.")) return;
                    startTransition(async () => {
                        const result = await deleteReviewAction(id);
                        if (!result.success) setError(result.message);
                    });
                }}
                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
                {pending ? "Removing…" : "Remove"}
            </button>
            {error && <p className="mt-1 max-w-40 text-xs text-red-600">{error}</p>}
        </div>
    );
}
