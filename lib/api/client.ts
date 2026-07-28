import { cookies } from "next/headers";
import { ApiResponse } from "@/lib/types/auth.types";

const API_BASE_URL =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api/v1";

export async function getAuthToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value;
}

export async function authRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = await getAuthToken();

    if (!token) {
        return {
            status: 401,
            success: false,
            message: "Not authenticated",
            data: null as T,
        };
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });

    return response.json();
}

export async function authFormRequest<T>(
    endpoint: string,
    formData: FormData,
    method: string = "PUT"
): Promise<ApiResponse<T>> {
    const token = await getAuthToken();

    if (!token) {
        return {
            status: 401,
            success: false,
            message: "Not authenticated",
            data: null as T,
        };
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    return response.json();
}
