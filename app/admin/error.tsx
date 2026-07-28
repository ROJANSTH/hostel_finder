"use client";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="mb-2 text-lg font-bold text-zinc-900">
                Something went wrong
            </h2>
            <p className="mb-6 text-sm text-zinc-500">{error.message}</p>
            <button
                onClick={reset}
                className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
                Try again
            </button>
        </div>
    );
}
