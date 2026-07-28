import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import HostelCard from "@/components/HostelCard";
import { getHostels, getSaved } from "@/lib/api/hostel.api";

const amenities = ["WiFi", "Kitchen", "Laundry", "Breakfast", "Parking", "Lockers"];

export default async function HostelsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
    const params = await searchParams;
    const query = new URLSearchParams();
    const first = (key: string) => Array.isArray(params[key]) ? params[key][0] : params[key];
    for (const key of ["search", "city", "minPrice", "maxPrice", "minRating", "roomType", "genderPolicy", "amenities", "checkIn", "checkOut", "guests", "sort"]) {
        const value = params[key];
        if (Array.isArray(value)) value.forEach((item) => query.append(key, item)); else if (value) query.set(key, value);
    }
    const [result, savedResult] = await Promise.all([getHostels(query.toString()), getSaved()]);
    const hostels = result.success ? result.data : [];
    const savedIds = new Set(savedResult.success ? savedResult.data.map((hostel) => hostel._id) : []);

    return (
        <DashboardShell>
            <div>
                <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Discover Nepal</p>
                <h1 className="mt-1 text-3xl font-bold">Find your perfect hostel</h1>
                <form className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        <input name="search" defaultValue={first("search")} placeholder="Name, area, landmark..." className="rounded-xl border px-4 py-3 lg:col-span-2" />
                        <input name="city" defaultValue={first("city")} placeholder="City" className="rounded-xl border px-4 py-3" />
                        <select name="sort" defaultValue={first("sort") ?? "recommended"} className="rounded-xl border px-4 py-3"><option value="recommended">Recommended</option><option value="price">Lowest price</option></select>
                        <input name="checkIn" defaultValue={first("checkIn")} type="date" aria-label="Check in" className="rounded-xl border px-4 py-3" />
                        <input name="checkOut" defaultValue={first("checkOut")} type="date" aria-label="Check out" className="rounded-xl border px-4 py-3" />
                        <input name="guests" defaultValue={first("guests")} type="number" min="1" placeholder="Guests" className="rounded-xl border px-4 py-3" />
                        <select name="roomType" defaultValue={first("roomType") ?? ""} className="rounded-xl border px-4 py-3"><option value="">Any room type</option><option value="mixed-dorm">Mixed dorm</option><option value="female-dorm">Female dorm</option><option value="male-dorm">Male dorm</option><option value="private">Private room</option></select>
                        <input name="minPrice" defaultValue={first("minPrice")} type="number" min="0" placeholder="Minimum NPR" className="rounded-xl border px-4 py-3" />
                        <input name="maxPrice" defaultValue={first("maxPrice")} type="number" min="0" placeholder="Maximum NPR" className="rounded-xl border px-4 py-3" />
                        <select name="minRating" defaultValue={first("minRating") ?? ""} className="rounded-xl border px-4 py-3"><option value="">Any rating</option><option value="4">4+ stars</option><option value="3">3+ stars</option><option value="2">2+ stars</option></select>
                        <select name="genderPolicy" defaultValue={first("genderPolicy") ?? ""} className="rounded-xl border px-4 py-3"><option value="">Any gender policy</option><option value="mixed">Mixed</option><option value="female-only">Female only</option><option value="male-only">Male only</option></select>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                        <span className="text-sm font-semibold text-zinc-700">Amenities:</span>
                        {amenities.map((amenity) => <label key={amenity} className="flex items-center gap-2 text-sm text-zinc-600"><input type="checkbox" name="amenities" value={amenity} defaultChecked={(Array.isArray(params.amenities) ? params.amenities : params.amenities?.split(",") ?? []).includes(amenity)} />{amenity}</label>)}
                    </div>
                    <div className="mt-5 flex gap-3"><button className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white">Apply filters</button><Link href="/hostels" className="rounded-xl border px-6 py-3 font-semibold text-zinc-600">Clear</Link></div>
                </form>
                <p className="mt-6 text-sm text-zinc-500">{result.meta?.total ?? hostels.length} stays found</p>
                <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{hostels.map((hostel) => <HostelCard hostel={hostel} initiallySaved={savedIds.has(hostel._id)} key={hostel._id} />)}</div>
                {!hostels.length && <div className="mt-6 rounded-2xl border border-dashed p-12 text-center text-zinc-500">No available hostels match these filters. Try changing your dates or filters.</div>}
            </div>
        </DashboardShell>
    );
}
