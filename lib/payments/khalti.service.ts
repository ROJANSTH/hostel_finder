import { authRequest } from "@/lib/api/client";
import { Booking } from "@/lib/types/hostel.types";
import { KhaltiInitiation, PaymentService } from "./payment.service";

export const khaltiService: PaymentService = {
    async initiate(bookingId) {
        return authRequest<KhaltiInitiation>(`/payments/khalti/${bookingId}/initiate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });
    },
    async verify(bookingId, pidx) {
        return authRequest<Booking>(`/payments/khalti/${bookingId}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pidx }),
        });
    },
};
