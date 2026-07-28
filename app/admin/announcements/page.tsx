import { authRequest } from "@/lib/api/client";
import AnnouncementForm from "./AnnouncementForm";

interface Announcement {
    _id: string;
    sentBy?: { name: string; email: string };
    title: string;
    message: string;
    href?: string | null;
    audience: "all" | "user" | "owner";
    recipients: number;
    createdAt: string;
}

export default async function AnnouncementsPage() {
    const result = await authRequest<Announcement[]>("/admin/hostels/announcements");
    const history = result.success ? result.data : [];

    return (
        <div>
            <h1 className="text-3xl font-bold text-zinc-900">User announcements</h1>
            <p className="mt-1 text-sm text-zinc-600">Send targeted in-app notifications and review the delivery history.</p>
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,620px)_1fr]">
                <AnnouncementForm />
                <section className="rounded-2xl border border-zinc-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-zinc-900">Recent broadcasts</h2>
                        <span className="text-xs text-zinc-500">Latest 50</span>
                    </div>
                    {!result.success && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{result.message}</p>}
                    <div className="mt-3 max-h-[650px] space-y-3 overflow-y-auto">
                        {history.map((announcement) => (
                            <article key={announcement._id} className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <strong className="text-sm text-zinc-900">{announcement.title}</strong>
                                    <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold capitalize text-indigo-800">{announcement.audience === "all" ? "All accounts" : announcement.audience}</span>
                                </div>
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">{announcement.message}</p>
                                <p className="mt-3 text-xs text-zinc-500">
                                    {announcement.recipients} recipients · {new Date(announcement.createdAt).toLocaleString()} · {announcement.sentBy?.name ?? "Administrator"}
                                </p>
                            </article>
                        ))}
                        {!history.length && result.success && <p className="py-10 text-center text-sm text-zinc-500">No announcements have been sent yet.</p>}
                    </div>
                </section>
            </div>
        </div>
    );
}
