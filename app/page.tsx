import Link from "next/link";

export default function Home() {
    return (
        <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-6">
            <main className="max-w-2xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
                    Find Your Perfect{" "}
                    <span className="text-indigo-600">Hostel</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-zinc-600">
                    Discover affordable hostels near your campus. Create an
                    account to save favourites and manage bookings.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/hostels"
                        className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Explore Hostels
                    </Link>
                    <Link
                        href="/register"
                        className="rounded-lg border border-indigo-200 bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                    >
                        Create Account
                    </Link>
                    <Link
                        href="/login"
                        className="rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                    >
                        Sign In
                    </Link>
                </div>
            </main>
        </div>
    );
}
