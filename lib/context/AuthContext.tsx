"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { getCurrentUserAction } from "@/actions/user.actions";
import { User } from "@/lib/types/auth.types";
import { getProfileImageUrl } from "@/lib/utils/image";
import { clearInvalidSessionAction } from "@/actions/auth.actions";
import { usePathname } from "next/navigation";

const protectedRoutes = ["/dashboard", "/profile", "/password", "/saved", "/bookings", "/notifications", "/owner", "/admin"];

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    refreshUser: () => Promise<void>;
    profileImageUrl: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    const refreshUser = useCallback(async () => {
        setLoading(true);
        const result = await getCurrentUserAction();

        if (result.success && result.user) {
            setUser(result.user);
        } else {
            setUser(null);
            if (result.hadSession) {
                await clearInvalidSessionAction();
                const isProtected = protectedRoutes.some(
                    (route) => pathname === route || pathname.startsWith(`${route}/`)
                );
                if (isProtected) window.location.assign("/login?session=expired");
            }
        }

        setLoading(false);
    }, [pathname]);

    useEffect(() => {
        // Initial client hydration intentionally synchronizes the cookie-backed session.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        refreshUser();
    }, [refreshUser]);

    const profileImageUrl = useMemo(
        () => getProfileImageUrl(user?.profileImage),
        [user?.profileImage]
    );

    const value = useMemo(
        () => ({
            user,
            loading,
            setUser,
            refreshUser,
            profileImageUrl,
        }),
        [user, loading, refreshUser, profileImageUrl]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
