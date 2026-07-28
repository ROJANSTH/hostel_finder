import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-full flex-1 items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-tight text-indigo-700"
                    >
                        Hostel Finder
                    </Link>
                    <p className="mt-2 text-sm text-zinc-600">
                        Find your perfect stay near campus
                    </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                    {children}
                </div>
            </div>
        </div>
    );
}
