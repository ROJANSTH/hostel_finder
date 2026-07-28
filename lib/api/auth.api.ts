import { ApiResponse, AuthData, User } from "@/lib/types/auth.types";
import { authFormRequest, authRequest } from "@/lib/api/client";

const API_BASE_URL =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api/v1";

async function publicRequest<T>(
    endpoint: string,
    body: Record<string, string>
): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    return response.json();
}

export async function registerUser(payload: {
    name: string;
    email: string;
    password: string;
}): Promise<ApiResponse<AuthData>> {
    return publicRequest<AuthData>("/auth/register", payload);
}

export async function loginUser(payload: {
    email: string;
    password: string;
}): Promise<ApiResponse<AuthData>> {
    return publicRequest<AuthData>("/auth/login", payload);
}

export async function requestPasswordReset(payload: {
    email: string;
}): Promise<ApiResponse<null>> {
    return publicRequest<null>("/auth/forgot-password", payload);
}

export async function resetAccountPassword(payload: {
    email: string;
    code: string;
    newPassword: string;
}): Promise<ApiResponse<null>> {
    return publicRequest<null>("/auth/reset-password", payload);
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
    return authRequest<User>("/auth/whoami", { method: "GET" });
}

export async function updateUserProfile(
    formData: FormData
): Promise<ApiResponse<User>> {
    return authFormRequest<User>("/auth/update", formData, "PUT");
}

export async function updateUserPassword(payload: {
    currentPassword: string;
    newPassword: string;
}): Promise<ApiResponse<User>> {
    const formData = new FormData();
    formData.append("currentPassword", payload.currentPassword);
    formData.append("newPassword", payload.newPassword);
    return authFormRequest<User>("/auth/update", formData, "PUT");
}
