"use server";
import { revalidatePath } from "next/cache";
import { authRequest } from "@/lib/api/client";
import { Hostel } from "@/lib/types/hostel.types";

const propertyPayload = (formData: FormData) => ({
    name: formData.get("name"), city: formData.get("city"), address: formData.get("address"), description: formData.get("description"),
    pricePerNight: Number(formData.get("pricePerNight")), totalBeds: Number(formData.get("totalBeds")), availableBeds: Number(formData.get("availableBeds")),
    roomTypes: formData.getAll("roomTypes"), genderPolicy: formData.get("genderPolicy"),
    amenities: String(formData.get("amenities") ?? "").split(",").map(v => v.trim()).filter(Boolean),
    images: String(formData.get("images") ?? "").split(",").map(v => v.trim()).filter(Boolean), active: true, featured: false,
});
export async function createOwnerPropertyAction(_state:{success:boolean;message:string}, formData:FormData){const r=await authRequest<Hostel>("/owner/hostels",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(propertyPayload(formData))});if(r.success){revalidatePath("/owner");revalidatePath("/hostels");}return{success:r.success,message:r.message};}
export async function updateOwnerPropertyAction(id:string,formData:FormData){await authRequest<Hostel>(`/owner/hostels/${id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(propertyPayload(formData))});revalidatePath("/owner");revalidatePath("/hostels");}
export async function deactivateOwnerPropertyAction(id:string){const r=await authRequest(`/owner/hostels/${id}`,{method:"DELETE"});revalidatePath("/owner");revalidatePath("/hostels");return r;}
export async function updateOwnerBookingAction(id:string,field:"status"|"paymentStatus",value:string){const r=await authRequest(`/owner/hostels/bookings/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({[field]:value})});revalidatePath("/owner/bookings");return r;}
