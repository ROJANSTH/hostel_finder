"use client";
import { useActionState, useTransition } from "react";
import { createOwnerPropertyAction, deactivateOwnerPropertyAction, updateOwnerPropertyAction } from "@/actions/owner.actions";
import { Hostel } from "@/lib/types/hostel.types";

const initial = { success: false, message: "" };
const input = "rounded-lg border border-zinc-300 px-3 py-2";
const roomOptions = [["mixed-dorm", "Mixed dorm"], ["female-dorm", "Female dorm"], ["male-dorm", "Male dorm"], ["private", "Private"]];

function Fields({ hostel }: { hostel?: Hostel }) {
    return <>
        <input required name="name" defaultValue={hostel?.name} placeholder="Hostel name" className={`${input} w-full`} />
        <div className="grid grid-cols-2 gap-2"><input required name="city" defaultValue={hostel?.city} placeholder="City" className={input} /><input required name="address" defaultValue={hostel?.address} placeholder="Address" className={input} /></div>
        <textarea required minLength={20} name="description" defaultValue={hostel?.description} rows={4} placeholder="Property description" className={`${input} w-full`} />
        <div className="grid grid-cols-3 gap-2"><input required type="number" min="0" name="pricePerNight" defaultValue={hostel?.pricePerNight} placeholder="NPR/night" className={input} /><input required type="number" min="1" name="totalBeds" defaultValue={hostel?.totalBeds} placeholder="Beds" className={input} /><input required type="number" min="0" name="availableBeds" defaultValue={hostel?.availableBeds} placeholder="Available" className={input} /></div>
        <select name="genderPolicy" defaultValue={hostel?.genderPolicy ?? "mixed"} className={`${input} w-full`}><option value="mixed">Mixed</option><option value="female-only">Female only</option><option value="male-only">Male only</option></select>
        <div className="flex flex-wrap gap-3 text-sm">{roomOptions.map(([value, label]) => <label key={value}><input type="checkbox" name="roomTypes" value={value} defaultChecked={hostel ? hostel.roomTypes?.includes(value as Hostel["roomTypes"][number]) : value === "mixed-dorm"} /> {label}</label>)}</div>
        <input name="amenities" defaultValue={hostel?.amenities.join(", ")} placeholder="WiFi, Kitchen, Laundry" className={`${input} w-full`} />
        <input name="images" defaultValue={hostel?.images.join(", ")} placeholder="Image URL(s), comma separated" className={`${input} w-full`} />
    </>;
}

export default function OwnerPropertyClient({ hostels }: { hostels: Hostel[] }) {
    const [state, createAction, pending] = useActionState(createOwnerPropertyAction, initial);
    const [working, startTransition] = useTransition();
    return <div className="mt-8 grid gap-8 xl:grid-cols-[390px_1fr]">
        <form action={createAction} className="h-fit space-y-3 rounded-2xl border bg-white p-5"><h2 className="font-bold">Add a property</h2><Fields /><button disabled={pending} className="w-full rounded-lg bg-indigo-600 py-3 font-bold text-white">{pending ? "Adding..." : "Add property"}</button>{state.message && <p className="text-sm">{state.message}</p>}</form>
        <div className="space-y-3">{hostels.map((hostel) => <article key={hostel._id} className="rounded-2xl border bg-white p-5"><div className="flex items-center justify-between"><div><h3 className="font-bold">{hostel.name}</h3><p className="text-sm text-zinc-500">{hostel.city} · NPR {hostel.pricePerNight} · {hostel.availableBeds}/{hostel.totalBeds} beds</p><div className="mt-2 flex flex-wrap gap-2"><span className={`inline-block rounded-full px-2 py-1 text-xs ${hostel.active ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>{hostel.active ? "Active" : "Inactive"}</span><span className={`inline-block rounded-full px-2 py-1 text-xs ${hostel.moderationStatus === "approved" ? "bg-indigo-50 text-indigo-700" : hostel.moderationStatus === "rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800"}`}>{hostel.moderationStatus === "approved" ? "Approved" : hostel.moderationStatus === "rejected" ? "Changes required" : "Awaiting approval"}</span></div>{hostel.moderationStatus === "rejected" && hostel.rejectionReason && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{hostel.rejectionReason}</p>}</div>{hostel.active && <button disabled={working} onClick={() => startTransition(async () => { await deactivateOwnerPropertyAction(hostel._id); })} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600">Deactivate</button>}</div>
            <details className="mt-4 border-t pt-4"><summary className="cursor-pointer text-sm font-bold text-indigo-600">Edit property details</summary><form action={updateOwnerPropertyAction.bind(null, hostel._id)} className="mt-4 space-y-3"><Fields hostel={hostel} /><button className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white">Save changes</button></form></details>
        </article>)}{!hostels.length && <p className="rounded-2xl border border-dashed p-10 text-center text-zinc-500">No properties yet.</p>}</div>
    </div>;
}
