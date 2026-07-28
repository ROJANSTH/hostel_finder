import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api/auth.api";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const result = await getCurrentUser();
    if (!result.success || result.data.role !== "admin") redirect("/dashboard");
    return (
        <div className="flex h-screen bg-zinc-50 text-zinc-700">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
