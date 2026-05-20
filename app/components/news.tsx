"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import api from "../services/api";

type NewsRecord = Record<string, unknown>;

type NewsItem = {
    id: string;
    title: string;
    description: string;
    image: string;
    href: string;
    date: string;
    timestamp: number;
    principal: boolean;
};

const DEFAULT_VISIBLE_NEWS = 3;

const isRecord = (value: unknown): value is NewsRecord => (
    typeof value === "object" && value !== null && !Array.isArray(value)
);

const getStringValue = (record: NewsRecord, keys: string[]) => {
    for (const key of keys) {
        const value = record[key];

        if (typeof value === "string" && value.trim().length > 0) {
            return value.trim();
        }
    }

    return "";
};

const getBooleanValue = (record: NewsRecord, keys: string[]) => {
    for (const key of keys) {
        const value = record[key];

        if (typeof value === "boolean") {
            return value;
        }

        if (typeof value === "string") {
            const normalized = value.trim().toLowerCase();

            if (normalized === "true") {
                return true;
            }

            if (normalized === "false") {
                return false;
            }
        }
    }

    return false;
};

const parseNewsResponse = (payload: unknown): NewsRecord[] => {
    if (Array.isArray(payload)) {
        return payload.filter(isRecord);
    }

    if (!isRecord(payload)) {
        return [];
    }

    if (typeof payload.body === "string") {
        try {
            return parseNewsResponse(JSON.parse(payload.body));
        } catch {
            return [];
        }
    }

    if (payload.body) {
        return parseNewsResponse(payload.body);
    }

    const collectionKeys = ["news", "items", "data", "results"];

    for (const key of collectionKeys) {
        const collection = payload[key];
        const parsedCollection = parseNewsResponse(collection);

        if (parsedCollection.length > 0) {
            return parsedCollection;
        }
    }

    return [];
};

const normalizeNewsItem = (item: NewsRecord, index: number): NewsItem | null => {
    const title = getStringValue(item, ["news_title", "title", "name"]);
    const image = getStringValue(item, ["news_image", "image", "image_url", "url"]);

    if (!title || !image) {
        return null;
    }

    const description = getStringValue(item, ["news_description", "news_text", "description", "excerpt"]);
    const href = getStringValue(item, ["news_call", "news_link", "link", "href"]) || "#";
    const id = getStringValue(item, ["news_id", "id"]) || `${title}-${index}`;
    const date = getStringValue(item, ["news_date", "date", "published_at", "created_at"]);
    const parsedDate = Date.parse(date);

    return {
        id,
        title,
        description,
        image,
        href,
        date,
        timestamp: Number.isNaN(parsedDate) ? 0 : parsedDate,
        principal: getBooleanValue(item, ["news_principal", "principal"]),
    };
};

const getNews = async (): Promise<NewsItem[]> => {
    const response = await api.get<unknown>(API_ENDPOINTS.news);
    const publishedNews = parseNewsResponse(response.data)
        .filter((item) => item.news_enabled !== false && item.enabled !== false)
        .filter((item) => getStringValue(item, ["news_state", "state", "status"]).toLowerCase() === "published")
        .map(normalizeNewsItem)
        .filter((item): item is NewsItem => item !== null)
        .sort((a, b) => b.timestamp - a.timestamp);

    const principalNews = publishedNews.find((item) => item.principal) ?? publishedNews[0];

    if (!principalNews) {
        return [];
    }

    const secondaryNews = publishedNews.filter((item) => item.id !== principalNews.id);

    return [principalNews, ...secondaryNews];
};

export default function News() {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [startIndex, setStartIndex] = useState(0);

    useEffect(() => {
        let mounted = true;

        getNews()
            .then((items) => {
                if (mounted) {
                    setNewsItems(items);
                    setStartIndex(0);
                }
            })
            .catch((error) => {
                console.error("Error loading news", error);
            });

        return () => {
            mounted = false;
        };
    }, []);

    if (newsItems.length === 0) {
        return null;
    }

    const canSlide = newsItems.length > 1;
    const visibleNews = Array.from(
        { length: Math.min(DEFAULT_VISIBLE_NEWS, newsItems.length) },
        (_, index) => newsItems[(startIndex + index) % newsItems.length]
    );
    const [mainNews, ...secondaryNews] = visibleNews;

    const handlePrevious = () => {
        setStartIndex((currentIndex) => (
            currentIndex === 0 ? newsItems.length - 1 : currentIndex - 1
        ));
    };

    const handleNext = () => {
        setStartIndex((currentIndex) => (currentIndex + 1) % newsItems.length);
    };

    return (
        <div>
            <section className="seccion contenedor news-section">
                <div className="pphoto-gallery__title">
                    <div className="photo-gallery__header">
                        <h2 className="photo-gallery__title">IFX Player News</h2>
                        <a href="#" className="photo-gallery__button">More Player News</a>
                    </div>
                </div>
                <div className={`programs-carousel ${canSlide ? "" : "programs-carousel--static"}`.trim()}>
                    {canSlide && (
                        <button
                            type="button"
                            className="photo-gallery__control programs-carousel__control"
                            aria-label="Previous news"
                            onClick={handlePrevious}
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                    )}

                    <div className="contenedor-news">
                        <a href={mainNews.href}>
                            <div className="noti-principal">
                                <div className="title-header">
                                    <h3>{mainNews.title}</h3>
                                </div>

                                <picture className="first-new">
                                    <source srcSet={mainNews.image} type="image/webp"></source>
                                    <source srcSet={mainNews.image} type="image/jpeg"></source>
                                    <img loading="lazy" src={mainNews.image} alt={mainNews.title}></img>
                                </picture>

                                <div className="excerpt">
                                    <p>{mainNews.description}</p>
                                </div>
                            </div>
                        </a>

                        <div className="noti-secundarias">
                            {secondaryNews.map((item, index) => (
                                <a href={item.href} key={item.id}>
                                    <div className={index === 0 ? "noticia2" : "noticia3"}>
                                        <picture className="first-new">
                                            <source srcSet={item.image} type="image/webp"></source>
                                            <source srcSet={item.image} type="image/jpeg"></source>
                                            <img loading="lazy" src={item.image} alt={item.title}></img>
                                        </picture>

                                        <div className="excerpt">
                                            <p>{item.title}</p>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {canSlide && (
                        <button
                            type="button"
                            className="photo-gallery__control programs-carousel__control"
                            aria-label="Next news"
                            onClick={handleNext}
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    )}
                </div>

                <div className="boton-base">
                    <a href="#" className="boton boton-news">More Player News</a>
                </div>
            </section>
        </div>
    );
}
