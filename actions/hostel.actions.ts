"use server";
import { revalidatePath } from "next/cache";
import { cancelBooking, createBooking, saveReview, toggleSaved } from "@/lib/api/hostel.api";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/api/hostel.api";

export async function toggleSavedAction(id: string) {
    const result = await toggleSaved(id); revalidatePath("/saved"); revalidatePath("/dashboard"); return result;
}
export async function createBookingAction(id: string, _state: { success: boolean; message: string }, formData: FormData) {
    const result = await createBooking(id, { checkIn: formData.get("checkIn"), checkOut: formData.get("checkOut"), guests: formData.get("guests"), paymentMethod: formData.get("paymentMethod") });
    if (result.success) { revalidatePath("/bookings"); revalidatePath("/dashboard"); }
    return { success: result.success, message: result.message };
}
export async function markNotificationReadAction(id: string) { const result = await markNotificationRead(id); revalidatePath("/notifications"); return result; }
export async function markAllNotificationsReadAction() { const result = await markAllNotificationsRead(); revalidatePath("/notifications"); return result; }
export async function cancelBookingAction(id: string) {
    const result = await cancelBooking(id); revalidatePath("/bookings"); revalidatePath("/dashboard"); return result;
}
export async function reviewAction(id: string, _state: { success: boolean; message: string }, formData: FormData) {
    const result = await saveReview(id, { rating: formData.get("rating"), comment: formData.get("comment") });
    if (result.success) { revalidatePath(`/hostels/${id}`); revalidatePath("/dashboard"); }
    return { success: result.success, message: result.message };
}
