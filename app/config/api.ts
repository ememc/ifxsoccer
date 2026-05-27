export const API_URL_BASE =
    process.env.NEXT_PUBLIC_API_URL_BASE || "https://api.ifxsoccer.com";

export const API_ENDPOINTS = {
    heros: "/v1/heros/",
    herosFallback: "/v1/heros/",
    category: "/v1/category",
    images: "/v1/images/",
    news: "/v1/news/",
    programs: "/v1/programs/",
    videos: "/v1/videos/",
    destinations: "/v1/destination",
} as const;
