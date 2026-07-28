"use client";

import { createContext, useContext, useMemo, useState } from "react";

type Locale = "en" | "ne";
const dictionary = {
    en: { dashboard: "Dashboard", explore: "Explore", saved: "Saved", bookings: "Bookings", profile: "Profile", password: "Password", notifications: "Notifications", owner: "Owner portal", logout: "Logout", brand: "Hostel Finder" },
    ne: { dashboard: "ड्यासबोर्ड", explore: "खोज्नुहोस्", saved: "सुरक्षित", bookings: "बुकिङहरू", profile: "प्रोफाइल", password: "पासवर्ड", notifications: "सूचनाहरू", owner: "सञ्चालक पोर्टल", logout: "बाहिरिनुहोस्", brand: "होस्टेल खोजकर्ता" },
} as const;

const LocaleContext = createContext<{
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (typeof dictionary)[Locale];
}>({ locale: "en", setLocale: () => undefined, t: dictionary.en });
export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Locale>("en");
    const value = useMemo(() => ({ locale, setLocale, t: dictionary[locale] }), [locale]);
    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
export const useLocale = () => useContext(LocaleContext);
export const formatNpr = (amount: number, locale: Locale = "en") => new Intl.NumberFormat(locale === "ne" ? "ne-NP" : "en-NP", { style: "currency", currency: "NPR", maximumFractionDigits: 0 }).format(amount);
