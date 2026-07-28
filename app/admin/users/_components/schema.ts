import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["user", "owner", "admin"]),
    status: z.enum(["active", "suspended"]).default("active"),
});
export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Invalid email address"),
    password: z.string().max(100).refine((value) => value.length === 0 || value.length >= 6, "Password must be at least 6 characters").optional(),
    role: z.enum(["user", "owner", "admin"]),
    status: z.enum(["active", "suspended"]),
});
export type EditUserFormData = z.infer<typeof editUserSchema>;
