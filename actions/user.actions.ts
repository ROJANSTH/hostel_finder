"use server";

import {
    getCurrentUser,
    updateUserProfile,
    updateUserPassword,
} from "@/lib/api/auth.api";
import {
    passwordUpdateSchema,
    profileUpdateSchema,
} from "@/lib/schemas/user.schema";
import { User, UserActionState } from "@/lib/types/auth.types";

export async function getCurrentUserAction(): Promise<{
    success: boolean;
    user?: User;
    message?: string;
}> {
    const response = await getCurrentUser();

    if (!response.success) {
        return { success: false, message: response.message };
    }

    return { success: true, user: response.data };
}

export async function updateProfileAction(
    _prevState: UserActionState,
    formData: FormData
): Promise<UserActionState> {
    const rawData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
    };

    const validation = profileUpdateSchema.safeParse(rawData);

    if (!validation.success) {
        const fieldErrors: Record<string, string[]> = {};
        validation.error.issues.forEach((issue) => {
            const field = issue.path[0] as string;
            if (!fieldErrors[field]) {
                fieldErrors[field] = [];
            }
            fieldErrors[field].push(issue.message);
        });

        return {
            success: false,
            message: "Please fix the validation errors below.",
            fieldErrors,
        };
    }

    const apiFormData = new FormData();
    apiFormData.append("name", validation.data.name);
    apiFormData.append("email", validation.data.email);

    const profileImage = formData.get("profileImage");
    if (profileImage instanceof File && profileImage.size > 0) {
        apiFormData.append("profileImage", profileImage);
    }

    const response = await updateUserProfile(apiFormData);

    if (!response.success) {
        return {
            success: false,
            message: response.message,
        };
    }

    return {
        success: true,
        message: "Profile updated successfully.",
        user: response.data,
    };
}

export async function updatePasswordAction(
    _prevState: UserActionState,
    formData: FormData
): Promise<UserActionState> {
    const rawData = {
        currentPassword: formData.get("currentPassword") as string,
        newPassword: formData.get("newPassword") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    };

    const validation = passwordUpdateSchema.safeParse(rawData);

    if (!validation.success) {
        const fieldErrors: Record<string, string[]> = {};
        validation.error.issues.forEach((issue) => {
            const field = issue.path[0] as string;
            if (!fieldErrors[field]) {
                fieldErrors[field] = [];
            }
            fieldErrors[field].push(issue.message);
        });

        return {
            success: false,
            message: "Please fix the validation errors below.",
            fieldErrors,
        };
    }

    const response = await updateUserPassword({
        currentPassword: validation.data.currentPassword,
        newPassword: validation.data.newPassword,
    });

    if (!response.success) {
        return {
            success: false,
            message: response.message,
        };
    }

    return {
        success: true,
        message: "Password updated successfully.",
        user: response.data,
    };
}
