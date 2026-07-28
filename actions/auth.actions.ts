"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginUser, registerUser } from "@/lib/api/auth.api";
import {
    requestPasswordReset,
    resetAccountPassword,
} from "@/lib/api/auth.api";
import { z } from "zod";
import {
    loginSchema,
    registerSchema,
} from "@/app/(auth)/_components/schema";
import { AuthActionState } from "@/lib/types/auth.types";

const TOKEN_COOKIE = "auth_token";
const recoveryEmailSchema = z.string().trim().toLowerCase().email();
const resetCodeSchema = z.string().trim().regex(/^\d{6}$/);
const resetPasswordSchema = z.string().min(6).max(100);

export async function requestPasswordResetAction(
    email: string
): Promise<AuthActionState> {
    const parsed = recoveryEmailSchema.safeParse(email);
    if (!parsed.success) {
        return { success: false, message: "Enter a valid email address." };
    }
    const response = await requestPasswordReset({ email: parsed.data });
    return { success: response.success, message: response.message };
}

export async function resetPasswordWithCodeAction(payload: {
    email: string;
    code: string;
    newPassword: string;
}): Promise<AuthActionState> {
    const email = recoveryEmailSchema.safeParse(payload.email);
    const code = resetCodeSchema.safeParse(payload.code);
    const password = resetPasswordSchema.safeParse(payload.newPassword);
    if (!email.success || !code.success || !password.success) {
        return {
            success: false,
            message: "Enter a valid email, six-digit code, and password of at least 6 characters.",
        };
    }
    const response = await resetAccountPassword({
        email: email.data,
        code: code.data,
        newPassword: password.data,
    });
    return { success: response.success, message: response.message };
}

export async function registerAction(
    _prevState: AuthActionState,
    formData: FormData
): Promise<AuthActionState> {
    const rawData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    };

    const validation = registerSchema.safeParse(rawData);

    if (!validation.success) {
        const fieldErrors: Record<string, string[]> = {};
        validation.error.issues.forEach((issue) => {
            const field = issue.path[0] as string;
            if (!fieldErrors[field]) fieldErrors[field] = [];
            fieldErrors[field].push(issue.message);
        });

        return {
            success: false,
            message: "Please fix the validation errors below.",
            fieldErrors,
        };
    }

    const response = await registerUser({
        name: validation.data.name,
        email: validation.data.email,
        password: validation.data.password,
    });

    if (!response.success) {
        return { success: false, message: response.message };
    }

    redirect("/login?registered=true");
}

export async function loginAction(
    _prevState: AuthActionState,
    formData: FormData
): Promise<AuthActionState> {
    const rawData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const validation = loginSchema.safeParse(rawData);

    if (!validation.success) {
        const fieldErrors: Record<string, string[]> = {};
        validation.error.issues.forEach((issue) => {
            const field = issue.path[0] as string;
            if (!fieldErrors[field]) fieldErrors[field] = [];
            fieldErrors[field].push(issue.message);
        });

        return {
            success: false,
            message: "Please fix the validation errors below.",
            fieldErrors,
        };
    }

    const response = await loginUser(validation.data);

    if (!response.success) {
        return { success: false, message: response.message };
    }

    const cookieStore = await cookies();
    cookieStore.set(TOKEN_COOKIE, response.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });

    const role = response.data.user.role;
    const redirectTo = formData.get("redirect") as string | null;
    const safeRedirect =
        redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
            ? redirectTo
            : role === "admin"
              ? "/admin"
              : "/dashboard";

    redirect(safeRedirect);
}

export async function logoutAction(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_COOKIE);
    redirect("/login");
}

export async function clearInvalidSessionAction(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_COOKIE);
}
