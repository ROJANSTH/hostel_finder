"use server";
import { authRequest } from "@/lib/api/client";
import { revalidatePath } from "next/cache";
export async function sendAnnouncementAction(_state:{success:boolean;message:string},formData:FormData){const r=await authRequest<{recipients:number}>("/admin/hostels/announcements",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:formData.get("title"),message:formData.get("message"),href:formData.get("href")||undefined,audience:formData.get("audience")||"all"})});if(r.success)revalidatePath("/admin/announcements");return{success:r.success,message:r.success?`${r.message} to ${r.data.recipients} users.`:r.message};}
