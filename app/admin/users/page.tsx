import { getAdminUsersAction } from "@/actions/admin.actions";
import UserTable from "./_components/UserTable";

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const query = await searchParams;
    const page = query.page ? parseInt(query.page as string, 10) : 1;
    const limit = query.limit ? parseInt(query.limit as string, 10) : 10;
    const search = query.search ? (query.search as string) : "";
    const role = query.role ? (query.role as string) : "";
    const status = query.status ? (query.status as string) : "";

    const result = await getAdminUsersAction({ page, limit, search, role, status });

    if (!result.success) {
        return (
            <div className="mx-auto max-w-5xl rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                <p className="text-sm font-medium text-red-600">
                    {result.message || "Failed to load users"}
                </p>
                <p className="mt-1 text-xs text-red-400">
                    Make sure you are logged in as an admin.
                </p>
            </div>
        );
    }

    return (
        <UserTable
            data={result.data || []}
            pagination={result.meta || { page: 1, limit: 10, total: 0, totalPages: 1 }}
            search={search}
            role={role}
            status={status}
        />
    );
}
