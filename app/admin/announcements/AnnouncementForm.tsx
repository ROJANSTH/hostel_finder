"use client";

import { useActionState } from "react";
import { sendAnnouncementAction } from "@/actions/announcement.actions";

const initial = { success: false, message: "" };

export default function AnnouncementForm() {
    const [state, action, pending] = useActionState(sendAnnouncementAction, initial);

    return (
        <form action={action} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
            <label className="block text-sm font-semibold text-zinc-800">
                Audience
                <select name="audience" className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900">
                    <option value="all">All active accounts</option>
                    <option value="user">Guests only</option>
                    <option value="owner">Hostel owners only</option>
                </select>
            </label>
            <label className="block text-sm font-semibold text-zinc-800">
                Title
                <input required name="title" minLength={3} maxLength={100} className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-900" placeholder="Important update" />
            </label>
            <label className="block text-sm font-semibold text-zinc-800">
                Message
                <textarea required name="message" minLength={5} maxLength={500} rows={5} className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-900" placeholder="Write a message for your selected audience…" />
            </label>
            <label className="block text-sm font-semibold text-zinc-800">
                Link (optional)
                <input name="href" pattern="/.*" className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-900" placeholder="/hostels" />
            </label>
            <button disabled={pending} className="rounded-xl bg-indigo-700 px-5 py-3 font-bold text-white hover:bg-indigo-800 disabled:opacity-50">
                {pending ? "Sending…" : "Send announcement"}
            </button>
            {state.message && <p aria-live="polite" className={`text-sm ${state.success ? "text-emerald-700" : "text-red-700"}`}>{state.message}</p>}
        </form>
    );
}
