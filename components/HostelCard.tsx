"use client";
import Link from "next/link";
import Image from "next/image";
import { Hostel } from "@/lib/types/hostel.types";
import QuickBookingForm from "./QuickBookingForm";
import SaveHostelButton from "./SaveHostelButton";
import { formatNpr, useLocale } from "@/lib/context/LocaleContext";

export default function HostelCard({ hostel, initiallySaved = false }: { hostel: Hostel; initiallySaved?: boolean }) {
    const { locale } = useLocale();
    return <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div className="relative h-44 bg-gradient-to-br from-indigo-500 to-violet-600">
            {hostel.images[0] ? <Image src={hostel.images[0]} alt={hostel.name} fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : <div className="flex h-full items-center justify-center text-5xl">🏠</div>}
            {hostel.featured && <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-700">Featured</span>}
        </div>
        <div className="p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-bold text-zinc-900">{hostel.name}</h3><p className="text-sm text-zinc-500">{hostel.city}</p></div><span className="text-sm font-semibold text-amber-600">★ {hostel.rating.toFixed(1)}</span></div>
        <div className="mt-3 flex items-center justify-between text-sm"><span className="font-semibold text-emerald-700">● {hostel.availableBeds} beds available</span><span className="text-zinc-400">{hostel.totalBeds} total</span></div>
        <div className="mt-2 flex flex-wrap gap-1">{hostel.roomTypes?.map((type) => <span key={type} className="rounded-full bg-zinc-100 px-2 py-1 text-xs capitalize text-zinc-600">{type.replace("-", " ")}</span>)}</div>
        <div className="mt-4 flex items-end justify-between"><p><span className="text-xl font-bold text-indigo-700">{formatNpr(hostel.pricePerNight, locale)}</span><span className="text-xs text-zinc-500"> / night</span></p><Link href={`/hostels/${hostel._id}`} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700">Details</Link></div><div className="mt-3"><SaveHostelButton hostelId={hostel._id} initialSaved={initiallySaved}/></div><QuickBookingForm hostelId={hostel._id}/></div>
    </article>;
}
