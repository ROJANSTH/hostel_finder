import { z } from "zod";

export const profileUpdateSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters"),
    email: z.string().email("Please enter a valid email address"),
});

export const passwordUpdateSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(6, "New password must be at least 6 characters")
            .max(100, "New password must not exceed 100 characters"),
        confirmPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "New passwords do not match",
        path: ["confirmPassword"],
    });

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PasswordUpdateFormData = z.infer<typeof passwordUpdateSchema>;
