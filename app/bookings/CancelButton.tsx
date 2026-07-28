"use client";

import { useState, useTransition } from "react";
import { cancelBookingAction } from "@/actions/hostel.actions";

export default function CancelButton({ id }: { id: string }) {
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState("");

    const cancel = () => {
        if (!window.confirm("Cancel this booking? This action cannot be undone.")) return;
        startTransition(async () => {
            const result = await cancelBookingAction(id);
            if (!result.success) setError(result.message);
        });
    };

    return (
        <div className="text-right">
            <button
                type="button"
                disabled={pending}
                onClick={cancel}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
                {pending ? "Cancelling..." : "Cancel booking"}
            </button>
            {error && <p className="mt-1 max-w-48 text-xs text-red-600">{error}</p>}
        </div>
    );
}
