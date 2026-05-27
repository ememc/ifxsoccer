"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import api from "../services/api";
import { useResponsiveCount } from "./use-responsive-count";

type VideoItem = {
    id: string;
    title: string;
    url: string;
    video_url: string;
    description: string;
};

type VideoRecord = Record<string, unknown>;

const VISIBLE_VIDEOS = 3;

const getYouTubeVideoId = (value: string): string | null => {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (!host.endsWith("youtube.com")) {
      return null;
    }

    if (url.pathname === "/watch") {
      return url.searchParams.get("v");
    }

    const [section, id] = url.pathname.split("/").filter(Boolean);

    if (["embed", "shorts", "live"].includes(section)) {
      return id ?? null;
    }
  } catch {
    return null;
  }

  return null;
};

const isRecord = (value: unknown): value is VideoRecord => (
    typeof value === "object" && value !== null && !Array.isArray(value)
);

const getStringValue = (record: VideoRecord, keys: string[]) => {
    for (const key of keys) {
        const value = record[key];

        if (typeof value === "string" && value.trim().length > 0) {
            return value.trim();
        }
    }

    return "";
};

const parseVideosResponse = (payload: unknown): VideoRecord[] => {
    if (Array.isArray(payload)) {
        return payload.filter(isRecord);
    }

    if (!isRecord(payload)) {
        return [];
    }

    if (typeof payload.body === "string") {
        try {
            return parseVideosResponse(JSON.parse(payload.body));
        } catch {
            return [];
        }
    }

    if (payload.body) {
        return parseVideosResponse(payload.body);
    }

    const collectionKeys = ["videos", "video", "items", "gallery", "data", "results"];

    for (const key of collectionKeys) {
        const collection = payload[key];
        const parsedCollection = parseVideosResponse(collection);

        if (parsedCollection.length > 0) {
            return parsedCollection;
        }
    }

    return [];
};

const normalizeVideoItem = (item: VideoRecord, index: number): VideoItem | null => {
    let video_url = getStringValue(item, [
        "video_url",
        "url",
        "link",
        "youtube_id",
        "video",
    ]);

    // If video_url is just a YouTube ID, convert it to a proper URL
    if (video_url && !video_url.includes("http") && !video_url.includes("youtube")) {
        video_url = `https://www.youtube.com/watch?v=${video_url}`;
    }

    if (!video_url) {
        return null;
    }

    const id = getStringValue(item, ["video_id", "id"]) || `${video_url}-${index}`;
    const title = getStringValue(item, [
        "video_title",
        "title",
        "name",
    ]) || "IFX Soccer video";
    const description = getStringValue(item, [
        "video_description",
        "description",
        "caption",
    ]) || "";
    const url = getStringValue(item, ["video_link", "link", "href"]) || video_url;

    return {
        id,
        title,
        url,
        video_url,
        description,
    };
};

export const getVideos = async (): Promise<VideoItem[]> => {
    const response = await api.get<unknown>(API_ENDPOINTS.videos);

    return parseVideosResponse(response.data)
        .filter((item) => item.video_enabled !== false && item.enabled !== false)
        .map(normalizeVideoItem)
        .filter((item): item is VideoItem => item !== null);
};

export default function Video() {
    const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = useResponsiveCount({
        desktop: VISIBLE_VIDEOS,
        tablet: 1,
        mobile: 1,
        tabletBreakpoint: 768,
        desktopBreakpoint: 1021,
    });

    useEffect(() => {
        let mounted = true;

        getVideos()
            .then((videos) => {
                if (mounted) {
                    setVideoItems(videos);
                    setStartIndex(0);
                }
            })
            .catch((error) => {
                console.error("Error loading videos", error);
            });

        return () => {
            mounted = false;
        };
    }, []);

    const canSlide = videoItems.length > visibleCount;
    const visibleVideos = canSlide
        ? Array.from({ length: visibleCount }, (_, index) => videoItems[(startIndex + index) % videoItems.length])
        : videoItems.slice(0, visibleCount);

    const handlePrevious = () => {
        setStartIndex((currentIndex) => (
            currentIndex === 0 ? videoItems.length - 1 : currentIndex - 1
        ));
    };

    const handleNext = () => {
        setStartIndex((currentIndex) => (currentIndex + 1) % videoItems.length);
    };

    const getEmbedUrl = (url: string): string => {
        const youTubeId = getYouTubeVideoId(url);

        return `https://www.youtube.com/embed/${youTubeId}`;
    };

    if (videoItems.length === 0) {
        return null;
    }

    return (
        <div>
            <section className="seccion contenedor media-gallery-section">
                <div className="pphoto-gallery__title">
                    <div className="photo-gallery__header">
                        <h2 className="photo-gallery__title">Video Gallery</h2>
                        <a href="#" className="photo-gallery__button">More Video Galleries</a>
                    </div>
                </div>
                <div className={`video-gallery__carousel ${canSlide ? "" : "video-gallery__carousel--static"}`.trim()}>
                    {canSlide && (
                        <button
                            type="button"
                            className="video-gallery__control"
                            aria-label="Previous videos"
                            onClick={handlePrevious}
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                    )}
                    <div className={`video-gallery__grid ${visibleCount === 1 ? "media-gallery__grid--single" : ""}`.trim()}>
                        {visibleVideos.map((item) => (
                            <div className="video-gallery__item" key={item.id}>
                                <div className="video-item">
                                    <div className="video-iframe-wrapper">
                                        <iframe
                                            width="560"
                                            height="315"
                                            src={getEmbedUrl(item.video_url)}
                                            title={item.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen></iframe>
                                    </div>
                                    {item.title && (
                                        <div className="video-gallery__caption">
                                            <p>{item.title}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {canSlide && (
                        <button
                            type="button"
                            className="video-gallery__control"
                            aria-label="Next videos"
                            onClick={handleNext}
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    )}
                </div>
                <div className="boton-base">
                    <a href="#" className="boton boton-news">More Video Galleries</a>
                </div>
            </section>
            <section className="imagen-videogallery seccion">
                <a href="https://www.youtube.com/@IFXSOCCER" target="_blank" className="boton-youtube"><i className="fa-brands fa-youtube"></i> Follow Us On YouTube</a>
            </section>
        </div>
    );
}
