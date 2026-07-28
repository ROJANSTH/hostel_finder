import { ApiResponse } from "@/lib/types/auth.types";
import { Booking } from "@/lib/types/hostel.types";
export interface KhaltiInitiation {
    pidx: string;
    payment_url: string;
    expires_at: string;
    expires_in: number;
}

export interface PaymentService {
    initiate(bookingId: string): Promise<ApiResponse<KhaltiInitiation>>;
    verify(bookingId: string, pidx: string): Promise<ApiResponse<Booking>>;
}
