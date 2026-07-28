import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api/auth.api";
export default async function OwnerLayout({children}:{children:React.ReactNode}){const r=await getCurrentUser();if(!r.success||!["owner","admin"].includes(r.data.role))redirect("/dashboard");return children;}
