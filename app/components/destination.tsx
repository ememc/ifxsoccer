"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import api from "../services/api";
import { useResponsiveCount } from "./use-responsive-count";

type DestinationRecord = Record<string, unknown>;
type DestinationCity = {
    title: string;
};
type DestinationItem = {
    id: string;
    title: string;
    imageUrls: string[];
    cities: DestinationCity[];
};

const DEFAULT_VISIBLE_DESTINATIONS = 3;
const DESTINATION_IMAGE_ROTATION_INTERVAL = 5000;
const FALLBACK_DESTINATION_IMAGE = "/assets/img/photo6.jpg";

const isRecord = (value: unknown): value is DestinationRecord =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const getStringValue = (record: DestinationRecord, keys: string[]) => {
    for (const key of keys) {
        const value = record[key];
        if (typeof value === "string" && value.trim().length > 0) {
            return value.trim();
        }
    }

    return "";
};

const parseDestinationResponse = (payload: unknown): DestinationRecord[] => {
    if (Array.isArray(payload)) {
        return payload.filter(isRecord);
    }

    if (!isRecord(payload)) {
        return [];
    }

    if (typeof payload.body === "string") {
        try {
            return parseDestinationResponse(JSON.parse(payload.body));
        } catch {
            return [];
        }
    }

    if (payload.body) {
        return parseDestinationResponse(payload.body);
    }

    const collectionKeys = ["destinations", "destination", "items", "data", "results"];

    for (const key of collectionKeys) {
        const collection = payload[key];
        const parsedCollection = parseDestinationResponse(collection);
        if (parsedCollection.length > 0) {
            return parsedCollection;
        }
    }

    return [];
};

const getDestinationHeroImages = (item: DestinationRecord) => {
    const heroCollection = item.destination_hero;

    if (!Array.isArray(heroCollection)) {
        return [];
    }

    const images: string[] = [];

    for (const heroItem of heroCollection) {
        if (!isRecord(heroItem)) {
            continue;
        }

        const imageUrl = getStringValue(heroItem, ["image_url"]);
        if (imageUrl) {
            images.push(imageUrl);
        }
    }

    return images;
};

const getDestinationCities = (item: DestinationRecord): DestinationCity[] => {
    const citiesCollection = item.destination_cities;

    if (!Array.isArray(citiesCollection)) {
        return [];
    }

    return citiesCollection
        .filter(isRecord)
        .map((city) => ({
            title: getStringValue(city, ["city_title", "title", "name"]),
            order: Number(getStringValue(city, ["city_order", "order"]) || "0"),
        }))
        .filter((city) => city.title)
        .sort((a, b) => a.order - b.order)
        .map(({ title }) => ({ title }));
};

const normalizeDestinationItem = (item: DestinationRecord, index: number): DestinationItem | null => {
    const title = getStringValue(item, ["destination_title", "title", "name"]);
    if (!title) {
        return null;
    }

    return {
        id: getStringValue(item, ["destination_id", "id"]) || `${title}-${index}`,
        title,
        imageUrls: getDestinationHeroImages(item),
        cities: getDestinationCities(item),
    };
};

const getDestinations = async (): Promise<DestinationItem[]> => {
    const response = await api.get<unknown>(API_ENDPOINTS.destinations);

    return parseDestinationResponse(response.data)
        .filter(
            (item) =>
                item.destination_state !== "inactive" &&
                item.destination_enabled !== false &&
                item.enabled !== false
        )
        .map(normalizeDestinationItem)
        .filter((item): item is DestinationItem => item !== null);
};

export default function Destination() {
    const [destinations, setDestinations] = useState<DestinationItem[]>([]);
    const [startIndex, setStartIndex] = useState(0);
    const [imageIndex, setImageIndex] = useState(0);
    const visibleCount = useResponsiveCount({
        desktop: DEFAULT_VISIBLE_DESTINATIONS,
        mobile: 1,
    });

    useEffect(() => {
        let mounted = true;

        getDestinations()
            .then((items) => {
                if (mounted) {
                    setDestinations(items);
                    setStartIndex(0);
                    setImageIndex(0);
                }
            })
            .catch((error) => {
                console.error("Error loading destinations", error);
            });

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (!destinations.some((destination) => destination.imageUrls.length > 1)) {
            return;
        }

        const interval = window.setInterval(() => {
            setImageIndex((currentIndex) => currentIndex + 1);
        }, DESTINATION_IMAGE_ROTATION_INTERVAL);

        return () => {
            window.clearInterval(interval);
        };
    }, [destinations]);

    if (destinations.length === 0) {
        return null;
    }

    const canNavigate = destinations.length > 1;
    const visibleDestinations = Array.from(
        { length: Math.min(visibleCount, destinations.length) },
        (_, index) => destinations[(startIndex + index) % destinations.length]
    );

    const handlePrevious = () => {
        setStartIndex((currentIndex) =>
            currentIndex === 0 ? destinations.length - 1 : currentIndex - 1
        );
    };

    const handleNext = () => {
        setStartIndex((currentIndex) => (currentIndex + 1) % destinations.length);
    };

    return (
        <div>
            <section className="seccion contenedor">
                <div className="pphoto-gallery__title">
                    <div className="photo-gallery__header">
                        <h2 className="photo-gallery__title">Destinations</h2>
                    </div>
                </div>

                <div className="programs-carousel">
                    <button
                        type="button"
                        className="photo-gallery__control programs-carousel__control"
                        aria-label="Previous destinations"
                        disabled={!canNavigate}
                        onClick={handlePrevious}
                    >
                        <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
                    </button>

                    <div className="photo-grid">
                        {visibleDestinations.map((destination) => (
                            <div className="country" key={destination.id}>
                                <img
                                    src={
                                        destination.imageUrls.length > 0
                                            ? destination.imageUrls[imageIndex % destination.imageUrls.length]
                                            : FALLBACK_DESTINATION_IMAGE
                                    }
                                    alt={destination.title}
                                    loading="lazy"
                                />
                                <h4>{destination.title}</h4>
                                {destination.cities.length > 0 && (
                                    <div className="cities">
                                        {destination.cities.map((city, index) => (
                                            <span key={`${destination.id}-${city.title}`}>
                                                {index > 0 && " | "}
                                                {city.title}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="photo-gallery__control programs-carousel__control"
                        aria-label="Next destinations"
                        disabled={!canNavigate}
                        onClick={handleNext}
                    >
                        <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                    </button>
                </div>
            </section>

            <section className="imagen-destinations seccion">
                <h2>...the real experience of playing Soccer Internationally</h2>
            </section>
        </div>
    );
}
