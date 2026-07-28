"use server";
import { revalidatePath } from "next/cache";
import { authRequest } from "@/lib/api/client";
import { Hostel } from "@/lib/types/hostel.types";

const payload = (formData: FormData) => ({
    name: formData.get("name"), city: formData.get("city"), address: formData.get("address"),
    description: formData.get("description"), pricePerNight: Number(formData.get("pricePerNight")),
    totalBeds: Number(formData.get("totalBeds")), availableBeds: Number(formData.get("availableBeds")),
    amenities: String(formData.get("amenities") || "").split(",").map(v => v.trim()).filter(Boolean),
    images: String(formData.get("images") || "").split(",").map(v => v.trim()).filter(Boolean),
    roomTypes: formData.getAll("roomTypes"), genderPolicy: formData.get("genderPolicy") || "mixed",
    featured: formData.get("featured") === "on", active: formData.get("active") === "on",
    owner: formData.get("owner") || null,
    moderationStatus: formData.get("moderationStatus") || "approved",
    rejectionReason: formData.get("rejectionReason") || null,
});
export async function createHostelAction(_state: {success:boolean;message:string}, formData: FormData){
    const result=await authRequest<Hostel>("/admin/hostels",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload(formData))});
    if(result.success){revalidatePath("/admin/hostels");revalidatePath("/hostels");} return {success:result.success,message:result.message};
}
export async function deleteHostelAction(id:string){const r=await authRequest<null>(`/admin/hostels/${id}`,{method:"DELETE"});revalidatePath("/admin/hostels");revalidatePath("/hostels");return r;}
export async function updateHostelAction(id:string,formData:FormData){await authRequest<Hostel>(`/admin/hostels/${id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload(formData))});revalidatePath("/admin/hostels");revalidatePath("/hostels");}
export async function moderateHostelAction(id:string,status:string,reason=""){const r=await authRequest<Hostel>(`/admin/hostels/${id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({moderationStatus:status,rejectionReason:reason||null,active:status==="approved"})});revalidatePath("/admin/hostels");revalidatePath("/hostels");return r;}
export async function updateBookingStatusAction(id:string,field:"status"|"paymentStatus",value:string){const r=await authRequest(`/admin/hostels/bookings/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({[field]:value})});revalidatePath("/admin/bookings");return r;}
export async function deleteReviewAction(id:string){const r=await authRequest<null>(`/admin/hostels/reviews/${id}`,{method:"DELETE"});revalidatePath("/admin/reviews");revalidatePath("/hostels");return r;}
