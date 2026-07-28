import { ApiResponse } from "@/lib/types/auth.types";
import { Booking } from "@/lib/types/hostel.types";

export interface PaymentRequest {
    bookingId: string;
    mobile: string;
    pin: string;
    otp: string;
    outcome: "success" | "failure" | "random";
}

export interface PaymentService {
    pay(request: PaymentRequest): Promise<ApiResponse<Booking>>;
}
