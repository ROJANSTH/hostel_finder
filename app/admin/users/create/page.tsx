import Link from "next/link";
import UserForm from "../_components/UserForm";

export default function CreateUserPage() {
    return (
        <div className="mx-auto max-w-5xl">
            <Link href="/admin/users" className="text-sm text-zinc-400 transition hover:text-zinc-600">
                ← Back to users
            </Link>
            <h2 className="mb-6 mt-3 text-2xl font-semibold text-zinc-900">New User</h2>
            <UserForm />
        </div>
    );
}
