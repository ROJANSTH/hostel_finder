import { authRequest } from "./client";
import { ApiResponse } from "../types/auth.types";
import { Booking, DashboardData, Hostel, Notification, Review } from "../types/hostel.types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
export async function getHostels(query = ""): Promise<ApiResponse<Hostel[]>> {
    const response = await fetch(`${API}/hostels${query ? `?${query}` : ""}`, { cache: "no-store" });
    return response.json();
}
export async function getHostel(id: string): Promise<ApiResponse<Hostel>> {
    const response = await fetch(`${API}/hostels/${id}`, { cache: "no-store" }); return response.json();
}
export async function getReviews(id: string): Promise<ApiResponse<Review[]>> {
    const response = await fetch(`${API}/hostels/${id}/reviews`, { cache: "no-store" }); return response.json();
}
export const getSaved = () => authRequest<Hostel[]>("/hostels/saved");
export const getBookings = () => authRequest<Booking[]>("/hostels/bookings");
export const getBooking = (id: string) => authRequest<Booking>(`/hostels/bookings/${id}`);
export const getDashboard = () => authRequest<DashboardData>("/hostels/dashboard");
export const toggleSaved = (id: string) => authRequest<{ saved: boolean }>(`/hostels/${id}/save`, { method: "POST" });
export const createBooking = (id: string, data: object) => authRequest<Booking>(`/hostels/${id}/bookings`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const cancelBooking = (id: string) => authRequest<Booking>(`/hostels/bookings/${id}/cancel`, { method: "PATCH" });
export const saveReview = (id: string, data: object) => authRequest<Review>(`/hostels/${id}/reviews`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const getNotifications = () => authRequest<{ notifications: Notification[]; unread: number }>("/notifications");
export const markAllNotificationsRead = () => authRequest<null>("/notifications/read-all", { method: "PATCH" });
export const markNotificationRead = (id: string) => authRequest<Notification>(`/notifications/${id}/read`, { method: "PATCH" });
