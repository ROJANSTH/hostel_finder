"use server";

import { revalidatePath } from "next/cache";
import { khaltiDemoService } from "@/lib/payments/khalti-demo.service";
import { PaymentRequest } from "@/lib/payments/payment.service";

export async function processDemoKhaltiPayment(request: PaymentRequest) {
    const result = await khaltiDemoService.pay(request);
    if (result.success) {
        revalidatePath("/bookings");
        revalidatePath(`/payments/success/${request.bookingId}`);
    }
    return result;
}
