import { authRequest } from "@/lib/api/client";
import { ApiResponse, User } from "@/lib/types/auth.types";

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string | null;
    createdAt: string;
    updatedAt: string;
}

export async function fetchAdminUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
}): Promise<ApiResponse<AdminUser[]>> {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.search) query.set("search", params.search);

    return authRequest<AdminUser[]>(`/admin/users?${query}`, { method: "GET" });
}

export async function fetchAdminUserById(
    id: string
): Promise<ApiResponse<AdminUser>> {
    return authRequest<AdminUser>(`/admin/users/${id}`, { method: "GET" });
}

export async function createAdminUser(
    data: Record<string, string>
): Promise<ApiResponse<AdminUser>> {
    return authRequest<AdminUser>("/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export async function updateAdminUser(
    id: string,
    data: Record<string, string>
): Promise<ApiResponse<AdminUser>> {
    return authRequest<AdminUser>(`/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export async function deleteAdminUser(
    id: string
): Promise<ApiResponse<null>> {
    return authRequest<null>(`/admin/users/${id}`, { method: "DELETE" });
}
