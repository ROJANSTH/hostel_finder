import DashboardShell from "@/components/DashboardShell";
import KhaltiCallbackClient from "./KhaltiCallbackClient";

const queryValue = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

export default async function KhaltiCallbackPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const query = await searchParams;
    const bookingId = queryValue(query.bookingId);
    const pidx = queryValue(query.pidx);

    return (
        <DashboardShell>
            <KhaltiCallbackClient bookingId={bookingId} pidx={pidx} />
        </DashboardShell>
    );
}
