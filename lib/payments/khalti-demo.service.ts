import { authRequest } from "@/lib/api/client";
import { Booking } from "@/lib/types/hostel.types";
import { PaymentService } from "./payment.service";

export const khaltiDemoService: PaymentService = {
    async pay({ bookingId, ...payment }) {
        // Future real Khalti integration boundary:
        // replace only this adapter with initiate/verify API calls. The modal,
        // booking UI, and payment result pages consume the generic service contract.
        return authRequest<Booking>(`/payments/khalti-demo/${bookingId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payment),
        });
    },
};
