export interface User {
    id: string;
    name: string;
    email: string;
    profileImage?: string | null;
    role: string;
    status: "active" | "suspended";
    createdAt: string;
}

export interface AuthData {
    user: User;
    token: string;
}

export interface ApiResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: T;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface AuthActionState {
    success: boolean;
    message: string;
    fieldErrors?: Record<string, string[]>;
}

export interface UserActionState {
    success: boolean;
    message: string;
    fieldErrors?: Record<string, string[]>;
    user?: User;
}
