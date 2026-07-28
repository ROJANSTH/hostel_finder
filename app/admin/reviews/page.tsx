import Link from "next/link";
import { authRequest } from "@/lib/api/client";
import DeleteReviewButton from "./DeleteReviewButton";

interface ReviewRow {
    _id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user?: { name: string; email: string };
    hostel?: { name: string; city: string };
}

export default async function AdminReviewsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; rating?: string }>;
}) {
    const query = await searchParams;
    const page = Math.max(1, Number(query.page) || 1);
    const rating = query.rating ?? "";
    const params = new URLSearchParams({ page: String(page) });
    if (rating) params.set("rating", rating);
    const result = await authRequest<ReviewRow[]>(`/admin/hostels/reviews?${params}`);
    const reviews = result.success ? result.data : [];
    const meta = result.meta ?? { page: 1, limit: 20, total: reviews.length, totalPages: 1 };

    return (
        <div>
            <h1 className="text-3xl font-bold text-zinc-900">Review moderation</h1>
            <p className="mt-1 text-sm text-zinc-600">Inspect customer feedback and remove abusive or inappropriate content.</p>
            <form className="mt-6 flex flex-wrap gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
                <select name="rating" defaultValue={rating} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800">
                    <option value="">All ratings</option>
                    {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}
                </select>
                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white">Filter</button>
                <span className="ml-auto self-center text-sm text-zinc-600">{meta.total} reviews</span>
            </form>
            {!result.success && <p className="mt-4 rounded-xl bg-red-50 p-4 text-red-700">{result.message}</p>}
            <div className="mt-5 space-y-3">
                {reviews.map((review) => (
                    <article key={review._id} className="rounded-2xl border border-zinc-200 bg-white p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <strong className="text-zinc-900">{review.user?.name ?? "Deleted user"}</strong>
                                    <span className="text-amber-600">{"★".repeat(review.rating)}<span className="text-zinc-300">{"★".repeat(5 - review.rating)}</span></span>
                                    <span className="text-xs text-zinc-500">{new Date(review.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-zinc-500">{review.user?.email ?? "—"} · {review.hostel?.name ?? "Archived hostel"}, {review.hostel?.city ?? "—"}</p>
                                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700">{review.comment}</p>
                            </div>
                            <DeleteReviewButton id={review._id} />
                        </div>
                    </article>
                ))}
                {!reviews.length && <div className="rounded-2xl border bg-white p-10 text-center text-zinc-500">No reviews match this filter.</div>}
            </div>
            {meta.totalPages > 1 && (
                <nav className="mt-5 flex justify-between text-sm">
                    <Link href={`/admin/reviews?page=${Math.max(1, page - 1)}&rating=${rating}`} className={page <= 1 ? "pointer-events-none opacity-40" : "text-indigo-700"}>← Previous</Link>
                    <span className="text-zinc-600">Page {meta.page} of {meta.totalPages}</span>
                    <Link href={`/admin/reviews?page=${Math.min(meta.totalPages, page + 1)}&rating=${rating}`} className={page >= meta.totalPages ? "pointer-events-none opacity-40" : "text-indigo-700"}>Next →</Link>
                </nav>
            )}
        </div>
    );
}
