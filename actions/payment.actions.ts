"use server";

import { revalidatePath } from "next/cache";
import { khaltiService } from "@/lib/payments/khalti.service";

export async function initiateKhaltiPaymentAction(bookingId: string) {
    return khaltiService.initiate(bookingId);
}

export async function verifyKhaltiPaymentAction(bookingId: string, pidx: string) {
    const result = await khaltiService.verify(bookingId, pidx);
    if (result.success) revalidatePath("/bookings");
    return result;
}
