"use client";

import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import { useAuth } from "@/lib/context/AuthContext";

export default function DashboardPage() {
    const { user, loading } = useAuth();

    return (
        <DashboardShell>
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-zinc-900">
                    Dashboard
                </h2>
                <p className="mt-2 text-zinc-600">
                    {loading
                        ? "Loading your account..."
                        : user
                          ? `Welcome back, ${user.name}. You are authenticated via HTTP-only cookie and JWT.`
                          : "You are successfully logged in."}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-indigo-50 p-5">
                        <p className="text-sm font-medium text-indigo-600">
                            Saved Hostels
                        </p>
                        <p className="mt-1 text-3xl font-bold text-indigo-900">
                            0
                        </p>
                    </div>
                    <div className="rounded-xl bg-violet-50 p-5">
                        <p className="text-sm font-medium text-violet-600">
                            Bookings
                        </p>
                        <p className="mt-1 text-3xl font-bold text-violet-900">
                            0
                        </p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-5">
                        <p className="text-sm font-medium text-emerald-600">
                            Reviews
                        </p>
                        <p className="mt-1 text-3xl font-bold text-emerald-900">
                            0
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                        href="/profile"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Edit Profile
                    </Link>
                    <Link
                        href="/password"
                        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                    >
                        Change Password
                    </Link>
                </div>
            </div>
        </DashboardShell>
    );
}
