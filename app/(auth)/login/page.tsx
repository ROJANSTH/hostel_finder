import LoginForm from "../_components/LoginForm";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ registered?: string; redirect?: string; session?: string }>;
}) {
    const { registered, redirect, session } = await searchParams;
    const showRegisteredMessage = registered === "true";

    return (
        <div>
            <h1 className="mb-2 text-2xl font-semibold text-zinc-900">
                Welcome back
            </h1>
            <p className="mb-6 text-sm text-zinc-600">
                Sign in to your account to continue
            </p>

            {showRegisteredMessage && (
                <p
                    className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                    role="status"
                >
                    Account created successfully. Please sign in with your
                    credentials.
                </p>
            )}
            {session === "expired" && (
                <p className="mb-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
                    Your session was expired or revoked. Please sign in again.
                </p>
            )}

            <LoginForm redirectTo={redirect} />
        </div>
    );
}
