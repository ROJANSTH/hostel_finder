"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { editUserSchema } from "./schema";
import { updateAdminUserAction } from "@/actions/admin.actions";

const inputClass = "mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function UserFormEdit({ user }: { user: UserData }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const router = useRouter();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});

        const fd = new FormData(e.currentTarget);
        const raw = {
            name: fd.get("name") as string,
            email: fd.get("email") as string,
            role: fd.get("role") as "user" | "admin",
        };

        const parsed = editUserSchema.safeParse(raw);
        if (!parsed.success) {
            const errs: Record<string, string> = {};
            parsed.error.issues.forEach((i) => {
                const key = i.path[0];
                if (key) errs[String(key)] = i.message;
            });
            setFieldErrors(errs);
            return;
        }

        startTransition(async () => {
            try {
                const result = await updateAdminUserAction(user.id, parsed.data);
                if (!result.success) throw new Error(result.message);
                router.push("/admin/users");
                router.refresh();
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            }
        });
    };

    return (
        <form onSubmit={onSubmit} className="w-full max-w-md space-y-5">
            {error && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            )}
            <div>
                <label className="block text-sm font-medium text-zinc-700">Name</label>
                <input name="name" type="text" defaultValue={user.name} className={inputClass} />
                {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-zinc-700">Email</label>
                <input name="email" type="email" defaultValue={user.email} className={inputClass} />
                {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-zinc-700">Role</label>
                <select name="role" defaultValue={user.role} className={inputClass}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <button type="submit" disabled={isPending} className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60">
                {isPending ? "Saving..." : "Save Changes"}
            </button>
        </form>
    );
}
