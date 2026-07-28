"use client";

import { AuthProvider } from "@/lib/context/AuthContext";
import { LocaleProvider } from "@/lib/context/LocaleContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return <LocaleProvider><AuthProvider>{children}</AuthProvider></LocaleProvider>;
}
