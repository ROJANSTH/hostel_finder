export const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export function getProfileImageUrl(
    profileImage?: string | null
): string | null {
    if (!profileImage) return null;
    if (profileImage.startsWith("http")) return profileImage;
    return `${BACKEND_URL}${profileImage}`;
}

