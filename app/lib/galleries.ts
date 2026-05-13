import { API_ENDPOINTS, API_URL_BASE } from "../config/api";

export type VideoGalleryItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  order: number;
};

export type PhotoGalleryItem = {
  id: string;
  title: string;
  alt: string;
  url: string;
  order: number;
};

type GalleryRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is GalleryRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getStringValue = (record: GalleryRecord, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "";
};

const getNumberValue = (record: GalleryRecord, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      const parsedValue = Number(value);

      if (!Number.isNaN(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return 0;
};

const parseCollectionResponse = (payload: unknown, collectionKeys: string[]): GalleryRecord[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (!isRecord(payload)) {
    return [];
  }

  if (typeof payload.body === "string") {
    try {
      return parseCollectionResponse(JSON.parse(payload.body), collectionKeys);
    } catch {
      return [];
    }
  }

  if (payload.body) {
    return parseCollectionResponse(payload.body, collectionKeys);
  }

  for (const key of collectionKeys) {
    const collection = payload[key];
    const parsedCollection = parseCollectionResponse(collection, collectionKeys);

    if (parsedCollection.length > 0) {
      return parsedCollection;
    }
  }

  return [];
};

const getYouTubeVideoId = (value: string) => {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] ?? "";
    }

    if (url.pathname === "/watch") {
      return url.searchParams.get("v") ?? "";
    }

    const pathParts = url.pathname.split("/").filter(Boolean);
    const embedIndex = pathParts.indexOf("embed");

    if (embedIndex >= 0 && pathParts[embedIndex + 1]) {
      return pathParts[embedIndex + 1];
    }
  } catch {
    return value;
  }

  return "";
};

export const getVideoEmbedUrl = (value: string) => {
  if (!value) {
    return "";
  }

  if (value.includes("/embed/")) {
    return value;
  }

  const videoId = getYouTubeVideoId(value);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : value;
};

export const getProgramVideos = async (): Promise<VideoGalleryItem[]> => {
  const response = await fetch(`${API_URL_BASE}${API_ENDPOINTS.videos}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    return [];
  }

  const payload = await response.json();

  return parseCollectionResponse(payload, ["videos", "items", "data", "results"])
    .filter((item) => item.video_enabled !== false && item.enabled !== false)
    .map((item, index) => {
      const title = getStringValue(item, ["video_title", "title", "name"]);

      return {
        id: getStringValue(item, ["video_id", "id"]) || `${title}-${index}`,
        title,
        description: getStringValue(item, ["video_alt", "video_description", "description"]) || title,
        url: getVideoEmbedUrl(getStringValue(item, ["video_url", "url"])),
        order: getNumberValue(item, ["video_order", "order"]),
      };
    })
    .filter((item) => item.url)
    .sort((first, second) => first.order - second.order)
    .slice(0, 3);
};

export const getProgramPhotos = async (): Promise<PhotoGalleryItem[]> => {
  const response = await fetch(`${API_URL_BASE}${API_ENDPOINTS.images}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    return [];
  }

  const payload = await response.json();

  return parseCollectionResponse(payload, ["images", "items", "data", "results"])
    .filter((item) => item.image_enabled !== false && item.enabled !== false)
    .map((item, index) => {
      const title = getStringValue(item, ["image_title", "title", "name"]);

      return {
        id: getStringValue(item, ["image_id", "id"]) || `${title}-${index}`,
        title,
        alt: getStringValue(item, ["image_alt", "alt"]) || title || "Program photo",
        url: getStringValue(item, ["image_url", "url"]),
        order: getNumberValue(item, ["image_order", "order"]),
      };
    })
    .filter((item) => item.url)
    .sort((first, second) => first.order - second.order)
    .slice(0, 3);
};
