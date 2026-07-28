"use server";

import { revalidatePath } from "next/cache";
import {
    fetchAdminUsers,
    fetchAdminUserById,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
} from "@/lib/api/admin.api";

export async function getAdminUsersAction({
    page,
    limit,
    search,
    role,
    status,
}: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
}) {
    try {
        const result = await fetchAdminUsers({
            page: page && page > 0 ? page : 1,
            limit: limit && limit > 0 ? limit : 10,
            search: search || "",
            role: role || "",
            status: status || "",
        });

        if (result.success) {
            return { success: true, data: result.data, meta: result.meta };
        }
        return { success: false, message: result.message || "Failed to fetch users" };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Failed to fetch users";
        return { success: false, message: msg };
    }
}

export async function getAdminUserByIdAction(id: string) {
    try {
        const result = await fetchAdminUserById(id);
        if (result.success) {
            return { success: true, data: result.data };
        }
        return { success: false, message: result.message || "Failed to fetch user" };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Failed to fetch user";
        return { success: false, message: msg };
    }
}

export async function createAdminUserAction(data: Record<string, string>) {
    try {
        const result = await createAdminUser(data);
        if (result.success) {
            revalidatePath("/admin/users");
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Failed to create user" };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Failed to create user";
        return { success: false, message: msg };
    }
}

export async function updateAdminUserAction(
    id: string,
    data: Record<string, string>
) {
    try {
        const result = await updateAdminUser(id, data);
        if (result.success) {
            revalidatePath("/admin/users");
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Failed to update user" };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Failed to update user";
        return { success: false, message: msg };
    }
}

export async function deleteAdminUserAction(id: string) {
    try {
        const result = await deleteAdminUser(id);
        if (result.success) {
            revalidatePath("/admin/users");
            return { success: true, message: result.message };
        }
        return { success: false, message: result.message || "Failed to delete user" };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Failed to delete user";
        return { success: false, message: msg };
    }
}
