export interface Hostel {
    _id: string; name: string; city: string; address: string; description: string;
    pricePerNight: number; totalBeds: number; availableBeds: number;
    amenities: string[]; images: string[]; rating: number; reviewCount: number;
    roomTypes: ("mixed-dorm" | "female-dorm" | "male-dorm" | "private")[];
    genderPolicy: "mixed" | "female-only" | "male-only";
    featured: boolean; active: boolean; owner?: string | { _id: string; name: string; email: string } | null;
    moderationStatus: "pending" | "approved" | "rejected"; rejectionReason?: string | null;
}
export interface Booking {
    _id: string; hostel: Hostel; checkIn: string; checkOut: string; guests: number;
    totalPrice: number; status: "pending" | "confirmed" | "cancelled" | "completed";
    paymentMethod: "cash" | "esewa" | "khalti"; paymentStatus: "unpaid" | "pending" | "paid" | "refunded";
    transactionId?: string | null; paymentAmount?: number | null; paymentTimestamp?: string | null;
}
export interface Review {
    _id: string; user: { name: string; profileImage?: string | null };
    rating: number; comment: string; createdAt: string;
}
export interface DashboardData { saved: number; bookings: number; reviews: number; upcoming: Booking[] }
export interface Notification { _id: string; type: "booking" | "payment" | "system"; title: string; message: string; href?: string | null; read: boolean; createdAt: string }
