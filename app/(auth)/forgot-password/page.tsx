import Link from "next/link";
import ForgotPasswordForm from "./_components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold text-zinc-900">
                Forgot your password?
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
                Enter the email registered to your account. We will send a
                short-lived reset code to that address.
            </p>

            <div className="mt-6">
                <ForgotPasswordForm />
            </div>

            <p className="mt-6 text-center text-sm text-zinc-600">
                Remembered your password?{" "}
                <Link
                    href="/login"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    Return to login
                </Link>
            </p>
        </div>
    );
}
